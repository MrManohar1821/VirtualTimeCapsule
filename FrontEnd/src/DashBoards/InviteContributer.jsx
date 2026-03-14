import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, ArrowLeft, X } from "lucide-react";
import { BsCalendar4Event, BsClockFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";
import logo from "../assets/logo.png";
import PremiumToast from "../components/PremiumToast";

const InviteContributer = () => {
  const today = new Date().toISOString().split("T")[0];
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    sendDate: "",
    sendTime: "",
    note: "",
  });

  const [errors, setErrors] = useState({});
  const [showPopup, setShowPopup] = useState(false);
  const [sent, setSent] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "" });
  const [showCalendar, setShowCalendar] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [timeStep, setTimeStep] = useState("hour"); // hour, minute, ampm
  const [viewDate, setViewDate] = useState(new Date());
  const [isPaying, setIsPaying] = useState(false);
  const [paymentStep, setPaymentStep] = useState(0); // 0: Secure Conn, 1: Processing, 2: Finalizing

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const getDaysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();
  const getFirstDayOfMonth = (y, m) => new Date(y, m, 1).getDay();

  useEffect(() => {
    document.body.style.overflow = showPopup ? "hidden" : "auto";
    return () => { document.body.style.overflow = "auto"; };
  }, [showPopup]);

  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => setToast({ show: false, message: "" }), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast.show]);

  const formatTimeTo12Hour = (time) => {
    if (!time) return "";
    const [hourStr, minute] = time.split(":");
    let hour = parseInt(hourStr, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12;
    return `${hour}:${minute} ${ampm}`;
  };

  const handleDateSelect = (day) => {
    const selected = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);
    
    if (selected < todayDate) return;

    // Use local coordinates to avoid UTC off-by-one errors
    const year = selected.getFullYear();
    const month = String(selected.getMonth() + 1).padStart(2, '0');
    const dayStr = String(selected.getDate()).padStart(2, '0');
    setFormData({ ...formData, sendDate: `${year}-${month}-${dayStr}` });
    setShowCalendar(false);
  };

  const handleTimeSelect = (val, step) => {
    let currentH = formData.sendTime ? parseInt(formData.sendTime.split(":")[0]) : 12;
    let currentM = formData.sendTime ? formData.sendTime.split(":")[1] : "00";
    let isPM = currentH >= 12;
    let h12 = currentH % 12 || 12;

    if (step === "hour") {
      h12 = parseInt(val);
      setTimeStep("minute");
    } else if (step === "minute") {
      currentM = val;
      setTimeStep("ampm");
    } else if (step === "ampm") {
      isPM = val === "PM";
      let finalH = h12;
      if (isPM && h12 !== 12) finalH += 12;
      if (!isPM && h12 === 12) finalH = 0;
      setFormData({ ...formData, sendTime: `${String(finalH).padStart(2, "0")}:${currentM}` });
      setShowTimePicker(false);
      setTimeStep("hour"); // Reset for next time
    }

    // Temporary update for preview
    let finalH = h12;
    if (isPM && h12 !== 12) finalH += 12;
    if (!isPM && h12 === 12) finalH = 0;
    setFormData({ ...formData, sendTime: `${String(finalH).padStart(2, "0")}:${currentM}` });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const isValidGmail = (email) => /^[a-z0-9._%+-]+@gmail\.com$/.test(email);

  const handleSendClick = () => {
    let newErrors = {};
    if (!formData.firstName) newErrors.firstName = "First name is required";
    if (!formData.lastName) newErrors.lastName = "Last name is required";
    if (!formData.email) newErrors.email = "Email is required";
    else if (!isValidGmail(formData.email)) newErrors.email = "Valid @gmail.com required";
    if (formData.sendDate && formData.sendTime) {
      if (new Date(`${formData.sendDate}T${formData.sendTime}`) <= new Date()) {
        newErrors.sendDate = "Select a future date & time";
      }
    }
    if (!formData.sendDate) newErrors.sendDate = "Date is required";
    if (!formData.sendTime) newErrors.sendTime = "Time is required";
    if (!formData.note) newErrors.note = "Note is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setToast({ show: true, message: Object.values(newErrors)[0] });
      return;
    }
    setErrors({});
    setShowPopup(true);
  };

  const handleConfirmSend = async () => {
    setIsPaying(true);
    setPaymentStep(0);
    
    // Multi-stage simulation sequence
    setTimeout(() => setPaymentStep(1), 1500);
    setTimeout(() => setPaymentStep(2), 3000);
    setTimeout(async () => {
      setIsProcessing(true);
      try {
        const capsuleId = sessionStorage.getItem("capsuleId");
        if (!capsuleId) {
          setToast({ show: true, message: "Capsule session not found" });
          setIsPaying(false);
          setIsProcessing(false);
          return;
        }

        // Parallel execution of Invitation and Activation
        const [inviteRes, activateRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/contributor/invite`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              capsuleId: parseInt(capsuleId),
              firstName: formData.firstName,
              lastName: formData.lastName,
              email: formData.email,
              unlockDate: formData.sendDate,
              unlockTime: formData.sendTime + ":00",
              note: formData.note
            }),
          }),
          fetch(`${API_BASE_URL}/api/capsule/activate/${capsuleId}`, { 
            method: "PUT" 
          })
        ]);

        if (inviteRes.ok && activateRes.ok) {
          setSent(true);
          setShowPopup(false);
          setIsPaying(false);
          sessionStorage.removeItem("capsuleId");
        } else {
          const errMsg = !inviteRes.ok ? "Invitation failed" : "Activation failed";
          setToast({ show: true, message: `${errMsg}. Please try again.` });
          setIsPaying(false);
        }
      } catch (err) {
        setToast({ show: true, message: "Server connection error." });
        setIsPaying(false);
      } finally {
        setIsProcessing(false);
      }
    }, 4500);
  };

  const handleCancel = () => setShowPopup(false);

  const getMinTime = () => {
    if (formData.sendDate === today) {
      const now = new Date();
      return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    }
    return "";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f2eee3] px-4 py-6 sm:py-10 overflow-hidden relative">
      <PremiumToast 
        show={toast.show} 
        message={toast.message} 
        onClose={() => setToast({ ...toast, show: false })} 
      />

      <div className="absolute top-[-5%] left-[-5%] w-[30%] h-[30%] bg-[#b5e3c8] rounded-full blur-[100px] opacity-10 pointer-events-none" />
      <div className="absolute bottom-[-5%] right-[-5%] w-[30%] h-[30%] bg-[#9dd1b1] rounded-full blur-[100px] opacity-10 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-[2rem] shadow-md shadow-[#9dd1b1] w-full max-w-5xl md:h-[650px] flex flex-col md:flex-row overflow-hidden relative z-10 border border-green-50 text-[#025622] font-serif font-bold"
      >
        <div className="hidden md:flex md:w-2/5 bg-gradient-to-br from-[#025622] to-[#117f3b] p-10 flex-col justify-between text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl text-[#025622] font-serif font-bold" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24 blur-3xl" />
          <div className="relative z-10">
            <button onClick={() => navigate("/user/capsuleInputs")} className="group flex items-center gap-2 text-white/80 hover:text-white transition-all text-[10px] uppercase font-black mb-12 tracking-[0.3em]">
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back
            </button>
            <div className="mb-8">
              <div className="w-16 h-16 rounded-full bg-[#9dd1b1] flex items-center justify-center mb-6 shadow-xl">
                <img className="w-12 h-12 rounded-full bg-[#025622]" src={logo} alt="logo" />
              </div>
              <h2 className="text-3xl font-black leading-tight">Digital Time<br /><span className="text-[#9dd1b1]">Capsule</span></h2>
            </div>
          </div>
          <div className="relative z-10 p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10">
            <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1 leading-none">Status</p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-widest">Active Connection</span>
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col h-full bg-white relative">
          <div className="md:hidden p-6 flex items-center justify-between border-b border-green-50">
            <button onClick={() => navigate("/user/capsuleInputs")} className="text-[#025622]"><ArrowLeft size={20} /></button>
            <div className="w-10 h-10 rounded-full bg-[#9dd1b1] flex items-center justify-center border border-white">
              <img className="w-7 h-7 rounded-full bg-[#025622]" src={logo} alt="logo" />
            </div>
            <div className="w-5" />
          </div>

          <AnimatePresence mode="wait">
            {!sent ? (
              <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-6 sm:p-10 flex-1 overflow-y-auto no-scrollbar md:overflow-visible relative">
                <div className="mb-8 text-center sm:text-left">
                  <h2 className="text-2xl font-black uppercase tracking-tight">Delivery <span className="text-[#117f3b]">Details</span></h2>
                  <p className="text-gray-400 text-[10px] uppercase font-bold tracking-[0.3em] mt-1 opacity-60">Complete the schedule to lock memory</p>
                </div>

                <div className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-black uppercase tracking-widest pl-1">First Name</label>
                      <input type="text" name="firstName" placeholder="Recipient" value={formData.firstName} onChange={handleChange} className="w-full bg-[#f8fbfa] border border-[#9dd1b1] rounded-xl p-3 focus:outline-none text-[#025622] font-serif font-bold transition-all duration-500 text-sm autofill-fix premium-input" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-black uppercase tracking-widest pl-1">Last Name</label>
                      <input type="text" name="lastName" placeholder="Family Name" value={formData.lastName} onChange={handleChange} className="w-full bg-[#f8fbfa] border border-[#9dd1b1] rounded-xl p-3 focus:outline-none text-[#025622] font-serif font-bold transition-all duration-500 text-sm autofill-fix premium-input" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-black uppercase tracking-widest pl-1">Destination @gmail.com</label>
                    <input type="email" name="email" placeholder="example@gmail.com" value={formData.email} onChange={handleChange} className="w-full bg-[#f8fbfa] border border-[#9dd1b1] rounded-xl p-3 focus:outline-none text-[#025622] font-serif font-bold transition-all duration-500 text-sm autofill-fix premium-input" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5 relative">
                      <label className="text-[10px] font-black text-black uppercase tracking-widest pl-1">Unlock Date</label>
                      <div className="relative group cursor-pointer" onClick={() => { 
                        if (formData.sendDate) setViewDate(new Date(formData.sendDate));
                        setShowCalendar(!showCalendar); 
                        setShowTimePicker(false); 
                      }}>
                        <BsCalendar4Event className="absolute left-3 top-1/2 -translate-y-1/2 text-[#117f3b] z-10 pointer-events-none group-hover:scale-110 transition-transform" size={16} />
                        <div className="w-full bg-white border border-[#9dd1b1] rounded-xl p-3 pl-10 focus:outline-none text-[#025622] font-serif font-bold transition-all duration-500 text-sm shadow-sm hover:shadow-green-100 min-h-[46px] flex items-center">
                          {formData.sendDate || "Select Date"}
                        </div>
                      </div>
                      {/* Custom Parrot Green Calendar - Positioned ABOVE */}
                      <AnimatePresence>
                        {showCalendar && (
                          <motion.div 
                            initial={{ opacity: 0, y: 20, scale: 0.9, rotateX: -15 }} 
                            animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }} 
                            exit={{ opacity: 0, y: 20, scale: 0.9, rotateX: 15 }} 
                            transition={{ type: "spring", damping: 20, stiffness: 200 }}
                            style={{ perspective: 1000, transformOrigin: "bottom center" }}
                            className="absolute bottom-full left-0 mb-3 z-[400] bg-white border border-green-100 shadow-[0_25px_60px_rgba(0,0,0,0.2)] rounded-[1.5rem] p-5 min-w-[300px]" 
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="flex items-center justify-between mb-5">
                              <button onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1))} className="p-2 hover:bg-green-50 rounded-full text-[#117f3b] transition-colors"><ArrowLeft size={14} /></button>
                              <div className="text-[11px] font-black uppercase text-[#025622] tracking-widest">{monthNames[viewDate.getMonth()]} {viewDate.getFullYear()}</div>
                              <button onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1))} className="p-2 hover:bg-green-50 rounded-full text-[#117f3b] transition-colors"><ArrowLeft size={14} className="rotate-180" /></button>
                            </div>
                            <div className="grid grid-cols-7 gap-1 text-center mb-2">
                              {["S", "m", "t", "w", "T", "f", "s"].map((d, i) => <span key={`${d}-${i}`} className="text-[9px] font-black text-gray-300 uppercase">{d}</span>)}
                            </div>
                            <div className="grid grid-cols-7 gap-2 text-center">
                              {Array(getFirstDayOfMonth(viewDate.getFullYear(), viewDate.getMonth())).fill(null).map((_, i) => <div key={`empty-${i}`} />)}
                              {Array.from({ length: getDaysInMonth(viewDate.getFullYear(), viewDate.getMonth()) }).map((_, i) => {
                                const d = i + 1;
                                const dateObj = new Date(viewDate.getFullYear(), viewDate.getMonth(), d);
                                const todayDate = new Date();
                                todayDate.setHours(0,0,0,0);
                                const isPast = dateObj < todayDate;
                                const isToday = dateObj.getTime() === todayDate.getTime();
                                const isSelected = formData.sendDate === `${viewDate.getFullYear()}-${String(viewDate.getMonth() + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
                                
                                return (
                                  <button 
                                    key={d} 
                                    disabled={isPast}
                                    onClick={() => handleDateSelect(d)} 
                                    className={`
                                      h-8 w-8 rounded-full text-[10px] font-black transition-all flex items-center justify-center
                                      ${isSelected ? 'bg-[#32CD32] text-white shadow-lg shadow-[#32CD32]/40 scale-110' : 
                                        isToday ? 'border-2 border-[#32CD32] text-[#32CD32]' : 
                                        isPast ? 'text-gray-200 cursor-not-allowed' : 'hover:bg-green-50 text-[#025622]'}
                                    `}
                                  >
                                    {d}
                                  </button>
                                );
                              })}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <div className="space-y-1.5 relative">
                      <label className="text-[10px] font-black text-black uppercase tracking-widest pl-1">Unlock Time</label>
                      <div className="relative group cursor-pointer" onClick={() => { setShowTimePicker(!showTimePicker); setShowCalendar(false); setTimeStep("hour"); }}>
                        <BsClockFill className="absolute left-3 top-1/2 -translate-y-1/2 text-[#117f3b] z-10 pointer-events-none group-hover:scale-110 transition-transform" size={16} />
                        <div className="w-full bg-white border border-[#9dd1b1] rounded-xl p-3 pl-10 focus:outline-none text-[#025622] font-serif font-bold transition-all duration-500 text-sm shadow-sm hover:shadow-green-100 min-h-[46px] flex items-center">
                          {formData.sendTime ? formatTimeTo12Hour(formData.sendTime) : "Select Time"}
                        </div>
                      </div>
                      
                      {/* Custom Parrot Green Time Picker - Wizard Flow - Positioned ABOVE */}
                      <AnimatePresence>
                        {showTimePicker && (
                          <motion.div 
                            initial={{ opacity: 0, y: 20, scale: 0.9, rotateX: -15 }} 
                            animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }} 
                            exit={{ opacity: 0, y: 20, scale: 0.9, rotateX: 15 }} 
                            transition={{ type: "spring", damping: 20, stiffness: 200 }}
                            style={{ perspective: 1000, transformOrigin: "bottom center" }}
                            className="absolute bottom-full left-0 mb-3 z-[400] bg-white border border-green-100 shadow-[0_25px_60px_rgba(0,0,0,0.2)] rounded-[1.5rem] p-5 w-full min-w-[280px]" 
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="flex justify-between items-center mb-4 border-b border-green-50 pb-2">
                              {["hour", "minute", "ampm"].map((s, idx) => (
                                <div key={s} className="flex items-center gap-1">
                                  <div className={`w-4 h-4 rounded-full text-[8px] flex items-center justify-center font-black ${timeStep === s ? 'bg-[#32CD32] text-white' : idx < ["hour", "minute", "ampm"].indexOf(timeStep) ? 'bg-[#117f3b] text-white' : 'bg-gray-100 text-gray-400'}`}>
                                    {idx + 1}
                                  </div>
                                  <span className={`text-[8px] font-black uppercase tracking-widest ${timeStep === s ? 'text-[#32CD32]' : 'text-gray-300'}`}>{s}</span>
                                </div>
                              ))}
                            </div>

                            <div className="h-44 overflow-y-auto custom-scrollbar pr-1">
                              {timeStep === "hour" && (
                                <div className="grid grid-cols-3 gap-2">
                                  {Array.from({ length: 12 }).map((_, i) => (
                                    <button key={i} onClick={() => handleTimeSelect(String(i + 1), "hour")} className="p-3 text-[11px] font-black rounded-xl hover:bg-green-50 text-[#025622] transition-colors border border-transparent hover:border-green-100">{i + 1}</button>
                                  ))}
                                </div>
                              )}
                              {timeStep === "minute" && (
                                <div className="grid grid-cols-5 gap-1">
                                  {Array.from({ length: 60 }).map((_, i) => (
                                    <button key={i} onClick={() => handleTimeSelect(String(i).padStart(2, "0"), "minute")} className="p-2 text-[10px] font-black rounded-lg hover:bg-green-50 text-[#025622] transition-colors">{String(i).padStart(2, "0")}</button>
                                  ))}
                                </div>
                              )}
                              {timeStep === "ampm" && (
                                <div className="flex flex-col gap-3 justify-center h-full">
                                  <button onClick={() => handleTimeSelect("AM", "ampm")} className="p-5 text-sm font-black rounded-2xl border-2 border-green-100 hover:border-[#32CD32] transition-all text-[#025622] hover:bg-green-50">AM (Morning)</button>
                                  <button onClick={() => handleTimeSelect("PM", "ampm")} className="p-5 text-sm font-black rounded-2xl border-2 border-green-100 hover:border-[#32CD32] transition-all text-[#025622] hover:bg-green-50">PM (Afternoon/Evening)</button>
                                </div>
                              )}
                            </div>

                            <div className="mt-4 pt-3 border-t border-green-50 flex justify-between items-center">
                              <button onClick={() => setTimeStep(timeStep === "minute" ? "hour" : timeStep === "ampm" ? "minute" : "hour")} disabled={timeStep === "hour"} className="text-[9px] font-black uppercase text-gray-400 disabled:opacity-0 transition-opacity">Back</button>
                              <div className="text-[10px] font-black text-[#025622]">PREVIEW: {formData.sendTime ? formatTimeTo12Hour(formData.sendTime) : "--:--"}</div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  <div className="space-y-1.5 pb-4">
                    <label className="text-[10px] font-black text-black uppercase tracking-widest pl-1">Personal Note</label>
                    <textarea name="note" placeholder="Write something heartfelt..." value={formData.note} onChange={handleChange} className="w-full bg-[#f8fbfa] border border-[#9dd1b1] rounded-xl p-3 h-24 focus:outline-none text-[#025622] font-serif font-bold transition-all duration-500 text-sm resize-none autofill-fix premium-input" />
                  </div>

                  <button onClick={handleSendClick} className="w-full bg-[#117f3b] text-white py-4 rounded-xl font-black glass-button transition-all transform active:scale-[0.98] uppercase tracking-[0.2em] text-[10px]">
                    Schedule & Lock Memory
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-10 text-center flex flex-col items-center justify-center min-h-[400px]">
                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6 shadow-inner border border-green-100">
                  <motion.svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#117f3b" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <motion.path 
                      d="M20 6L9 17L4 12" 
                      initial={{ pathLength: 0 }} 
                      animate={{ pathLength: 1 }} 
                      transition={{ duration: 1.5, ease: "easeInOut", delay: 0.5 }} 
                    />
                  </motion.svg>
                </div>
                <h3 className="text-3xl font-black mb-2 uppercase tracking-tight text-[#025622]">Time Capsule <span className="text-[#117f3b]">Locked</span></h3>
                <p className="text-gray-500 text-[11px] font-bold uppercase tracking-widest mb-10 max-w-xs leading-relaxed opacity-60">Your messages are now secure. They will reappear precisely at the scheduled moment.</p>
                <div className="w-full max-w-xs">
                  <button onClick={() => navigate("/user")} className="w-full bg-[#117f3b] text-white py-4 rounded-xl font-black shadow-lg shadow-green-900/10 hover:bg-[#025622] transition-all transform active:scale-[0.98] uppercase tracking-[0.2em] text-[10px]">
                    Return to Memories
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div className="mt-auto p-6 border-t border-green-50 bg-[#f8fbfa]/50">
            <p className="text-[8px] font-black text-[#117f3b] uppercase tracking-[0.5em] opacity-30 text-center">Virtual Time Capsule © Secure Preservation</p>
          </div>
        </div>
      </motion.div>
      <AnimatePresence>
        {showPopup && !isPaying && (
          <motion.div className="fixed inset-0 flex items-center justify-center bg-[#025622]/40 backdrop-blur-md z-[200] p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="bg-white p-8 sm:p-10 rounded-[2.5rem] w-full max-w-md shadow-2xl relative border border-green-50" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
              <div className="flex flex-col items-center mb-6">
                <div className="w-20 h-20 rounded-full bg-[#9dd1b1] flex items-center justify-center mb-4 shadow-lg shadow-[#9dd1b1]/20 border border-white">
                  <img
                    src={logo}
                    alt="logo"
                    className="w-14 h-14 rounded-full bg-[#025622] object-cover"
                  />
                </div>
                <h3 className="font-black text-2xl text-[#025622] uppercase tracking-tight">Final Deployment</h3>
              </div>
              <p className="mb-6 text-sm text-gray-500 leading-relaxed">Lock memories for <span className="text-[#117f3b] font-black">{formData.firstName} {formData.lastName}</span> at <span className="font-bold">{formData.email}</span>?</p>
              <div className="bg-[#f8fbfa] p-4 rounded-2xl mb-8 border border-green-50 shadow-inner">
                <p className="text-[10px] font-black uppercase text-[#117f3b] opacity-60 mb-1 leading-none">Unlock Event</p>
                <p className="text-[#025622] font-black">{formData.sendDate} @ {formatTimeTo12Hour(formData.sendTime)}</p>
              </div>
              <div className="flex gap-4">
                <button onClick={handleCancel} className="flex-1 py-4 text-gray-400 font-bold uppercase tracking-widest text-[10px]">Edit</button>
                <button onClick={handleConfirmSend} disabled={isProcessing} className="flex-2 bg-[#117f3b] text-white py-4 px-8 rounded-xl font-bold hover:bg-[#025622] shadow-xl shadow-green-900/10 transition-all uppercase tracking-widest text-[10px]">{isProcessing ? "Deploying..." : "Lock & Send"}</button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {isPaying && (
          <motion.div className="fixed inset-0 flex items-center justify-center bg-[#025622] z-[300]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="w-full max-w-md p-8 text-center text-white relative h-full flex flex-col items-center justify-center">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#32CD32] rounded-full blur-[120px] opacity-20 animate-pulse pointer-events-none" />
              
              <AnimatePresence mode="wait">
                {paymentStep === 0 && (
                  <motion.div key="step0" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }} className="space-y-6">
                    <div className="relative">
                      <motion.div initial={{ scale: 1 }} animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="w-24 h-24 rounded-full border-2 border-[#32CD32]/30 flex items-center justify-center mx-auto">
                        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 8, ease: "linear" }} className="absolute inset-0 border-t-2 border-[#32CD32] rounded-full" />
                        <CheckCircle size={40} className="text-[#32CD32]" />
                      </motion.div>
                    </div>
                    <h2 className="text-2xl font-black uppercase tracking-widest text-[#9dd1b1]">Secure Connection</h2>
                    <p className="text-[#9dd1b1] text-[10px] font-black uppercase tracking-[0.4em] opacity-60">Initializing encrypted gateway...</p>
                  </motion.div>
                )}

                {paymentStep === 1 && (
                  <motion.div key="step1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }} className="w-full space-y-8">
                    <div className="bg-white/5 backdrop-blur-2xl border border-white/10 p-8 rounded-[2.5rem] shadow-2xl text-left relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-[#32CD32]/10 rounded-full blur-3xl -mr-16 -mt-16" />
                      <div className="flex justify-between items-start mb-8">
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-[#32CD32] mb-1">Processing Transaction</p>
                          <h4 className="text-xl font-black text-white">Digital Asset Seal</h4>
                        </div>
                        <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center p-1">
                          <img src={logo} alt="logo" className="w-full h-full object-contain opacity-50" />
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                          <motion.div initial={{ width: "0%" }} animate={{ width: "100%" }} transition={{ duration: 1.5, ease: "easeInOut" }} className="h-full bg-gradient-to-r from-[#117f3b] to-[#32CD32]" />
                        </div>
                        <div className="flex justify-between text-[9px] font-black uppercase tracking-widest opacity-40">
                          <span>Blockchain Sync</span>
                          <span className="text-[#32CD32]">Securing...</span>
                        </div>
                      </div>
                      <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-center">
                        <span className="text-[9px] font-bold opacity-30 tracking-widest uppercase">Memory Verification Layer</span>
                        <div className="flex gap-1.5">
                          <div className="w-1.5 h-1.5 bg-[#32CD32] rounded-full animate-bounce" />
                          <div className="w-1.5 h-1.5 bg-[#32CD32] rounded-full animate-bounce [animation-delay:0.1s]" />
                          <div className="w-1.5 h-1.5 bg-[#32CD32] rounded-full animate-bounce [animation-delay:0.2s]" />
                        </div>
                      </div>
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-[0.5em] text-[#9dd1b1] animate-pulse">Encoding Permanent Index</p>
                  </motion.div>
                )}

                {paymentStep === 2 && (
                  <motion.div key="step2" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
                    <div className="w-32 h-32 bg-[#32CD32]/10 rounded-full flex items-center justify-center border-4 border-[#32CD32] shadow-[0_0_50px_rgba(50,205,50,0.3)] mx-auto relative cursor-pointer group">
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 10 }}>
                        <CheckCircle size={64} className="text-[#32CD32]" />
                      </motion.div>
                    </div>
                    <div>
                      <h2 className="text-3xl font-black uppercase tracking-tighter mb-2 text-white">Digital Vault Sealed</h2>
                      <p className="text-[#9dd1b1] text-[10px] font-black uppercase tracking-[0.3em] opacity-60">Synchronizing Local Nodes • Done</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{
        __html: `
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #9dd1b1; border-radius: 10px; }
        
        /* Smooth Placeholder Hiding */
        .premium-input::placeholder {
          transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
          opacity: 0.5;
        }
        .premium-input:focus::placeholder {
          opacity: 0;
          transform: translateY(-8px) scale(0.95);
          filter: blur(2px);
        }

        .autofill-fix:-webkit-autofill,
        .autofill-fix:-webkit-autofill:hover, 
        .autofill-fix:-webkit-autofill:focus {
          -webkit-box-shadow: 0 0 0px 1000px #f8fbfa inset !important;
          -webkit-text-fill-color: #025622 !important;
          transition: background-color 5000s ease-in-out 0s;
        }

        .glass-button {
          background: #117f3b;
          box-shadow: 0 10px 25px -5px rgba(17, 127, 59, 0.2);
        }
        .glass-button:hover {
          background: #025622;
          box-shadow: 0 15px 30px -5px rgba(2, 86, 34, 0.3);
        }

        input[type="date"]::-webkit-calendar-picker-indicator,
        input[type="time"]::-webkit-calendar-picker-indicator {
          opacity: 0;
          position: absolute;
          right: 0;
          width: 100%;
          height: 100%;
          cursor: pointer;
        }
      `}} />
    </div>
  );
};

export default InviteContributer;