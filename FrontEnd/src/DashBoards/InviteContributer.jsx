import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";

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

  useEffect(() => {
    document.body.style.overflow = showPopup ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showPopup]);

  const formatTimeTo12Hour = (time) => {
    if (!time) return "";
    const [hourStr, minute] = time.split(":");
    let hour = parseInt(hourStr, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12;
    return `${hour}:${minute} ${ampm}`;
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
    else if (!isValidGmail(formData.email))
      newErrors.email = "Email must be lowercase and a valid @gmail.com";

    if (formData.sendDate && formData.sendTime) {
      const selectedDateTime = new Date(`${formData.sendDate}T${formData.sendTime}`);
      if (selectedDateTime <= new Date()) {
        newErrors.sendDate = "Please select a future date & time";
        newErrors.sendTime = "Please select a future date & time";
      }
    }

    if (!formData.sendDate) newErrors.sendDate = "Date is required";
    if (!formData.sendTime) newErrors.sendTime = "Time is required";
    if (!formData.note) newErrors.note = "Note is required";


    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setShowPopup(true);
  };

  const handleConfirmSend = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    try {

      const capsuleId = sessionStorage.getItem("capsuleId");

      if (!capsuleId) {
        alert("Capsule not found.");
        setIsProcessing(false);
        return;
      }

      // Parallelize invite and activate for performance
      await Promise.all([
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
          })
        }),
        fetch(`${API_BASE_URL}/api/capsule/activate/${capsuleId}`, {
          method: "PUT"
        })
      ]);

      sessionStorage.removeItem("capsuleId");

      setShowPopup(false);
      setSent(true);

    }
    catch (err) {
      console.error("Contributor save error", err);
      alert("Something went wrong. Please check your connection.");
    } finally {
      setIsProcessing(false);
    }

  };

  const handleCancel = () => {
    setShowPopup(false);
  };

  const getMinTime = () => {
    if (formData.sendDate === today) {
      const now = new Date();
      return `${String(now.getHours()).padStart(2, "0")}:${String(
        now.getMinutes()
      ).padStart(2, "0")}`;
    }
    return "";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fbfa] px-4 py-12 font-serif font-bold overflow-x-hidden">
      <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-green-900/10 p-6 sm:p-10 w-full max-w-xl relative border border-green-50">
        <button
          onClick={() => navigate("/user/capsuleInputs")}
          className="absolute top-6 left-6 sm:top-10 sm:left-10 flex items-center gap-2 text-[#025622] font-black text-xs uppercase tracking-widest hover:text-[#117f3b] transition-colors"
        >
          <ArrowLeft size={16} /> Back
        </button>

        {!sent ? (
          <div className="mt-8">
            <div className="text-center mb-10">
              <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-green-100 shadow-sm">
                 <CheckCircle size={32} className="text-[#117f3b] opacity-20" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-[#025622] tracking-tight">Delivery <span className="text-[#117f3b]">Schedule</span></h2>
              <p className="text-gray-400 text-[10px] sm:text-xs uppercase tracking-widest mt-2 font-bold opacity-60">When shall we deliver your memories?</p>
            </div>

            {/* Inputs */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <input type="text" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} className="w-full bg-[#f8fbfa] border border-green-100 rounded-xl p-3.5 focus:outline-none focus:ring-2 focus:ring-[#9dd1b1]/20 text-[#025622] font-bold placeholder:text-green-900/20" />
                  {errors.firstName && <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest pl-2">{errors.firstName}</p>}
                </div>
                <div className="space-y-1">
                  <input type="text" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} className="w-full bg-[#f8fbfa] border border-green-100 rounded-xl p-3.5 focus:outline-none focus:ring-2 focus:ring-[#9dd1b1]/20 text-[#025622] font-bold placeholder:text-green-900/20" />
                  {errors.lastName && <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest pl-2">{errors.lastName}</p>}
                </div>
              </div>

              <div className="space-y-1">
                <input type="email" name="email" placeholder="Recipient's @gmail.com" value={formData.email} onChange={handleChange} className="w-full bg-[#f8fbfa] border border-green-100 rounded-xl p-3.5 focus:outline-none focus:ring-2 focus:ring-[#9dd1b1]/20 text-[#025622] font-bold placeholder:text-green-900/20" />
                {errors.email && <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest pl-2">{errors.email}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-[#117f3b] uppercase tracking-widest pl-2">Unlock Date</label>
                  <input type="date" name="sendDate" value={formData.sendDate} onChange={handleChange} min={today} className="w-full bg-[#f8fbfa] border border-green-100 rounded-xl p-3.5 focus:outline-none focus:ring-2 focus:ring-[#9dd1b1]/20 text-[#025622] font-bold" />
                </div>
                <div className="space-y-1">
                   <label className="text-[10px] font-black text-[#117f3b] uppercase tracking-widest pl-2">Unlock Time</label>
                  <input type="time" name="sendTime" value={formData.sendTime} onChange={handleChange} min={getMinTime()} className="w-full bg-[#f8fbfa] border border-green-100 rounded-xl p-3.5 focus:outline-none focus:ring-2 focus:ring-[#9dd1b1]/20 text-[#025622] font-bold" />
                </div>
              </div>
              {(errors.sendDate || errors.sendTime) && <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest pl-2">{errors.sendTime || errors.sendDate}</p>}

              <div className="space-y-1">
                <textarea name="note" placeholder="Write a heartfelt note..." value={formData.note} onChange={handleChange} className="w-full bg-[#f8fbfa] border border-green-100 rounded-xl p-3.5 h-24 focus:outline-none focus:ring-2 focus:ring-[#9dd1b1]/20 text-[#025622] font-bold placeholder:text-green-900/20 resize-none" />
                {errors.note && <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest pl-2">{errors.note}</p>}
              </div>

              <button 
                onClick={handleSendClick} 
                className="w-full bg-[#117f3b] text-white py-4 rounded-2xl font-black shadow-xl shadow-green-900/20 hover:bg-[#025622] hover:scale-[1.02] transition-all active:scale-95 uppercase tracking-widest text-sm mt-4"
              >
                Schedule Delivery
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-10 mt-5">
            <div className="w-20 h-20 bg-green-50 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-900/5 border border-green-100">
              <CheckCircle size={48} className="text-[#117f3b]" />
            </div>
            <h3 className="text-2xl font-black text-[#025622] tracking-tight">Success!</h3>
            <p className="mt-4 text-sm text-gray-500 font-medium">
              Your memories will be delivered to<br />
              <b className="text-[#117f3b]">{formData.firstName} {formData.lastName}</b><br />
              on <b className="text-[#025622] tracking-tight">{formData.sendDate} {formatTimeTo12Hour(formData.sendTime)}</b>
            </p>
            <div className="mt-10 flex flex-col gap-3">
              <button
                onClick={() => {
                  setFormData({
                    firstName: "",
                    lastName: "",
                    email: "",
                    sendDate: "",
                    sendTime: "",
                    note: "",
                  }); setSent(false);
                }}
                className="bg-[#117f3b] text-white py-4 rounded-2xl font-black shadow-lg shadow-green-900/20 hover:bg-[#025622] transition-all uppercase tracking-widest text-xs"
              >
                Create Another Capsule
              </button>
              <button
                onClick={() => navigate("/user")}
                className="bg-white text-[#025622] py-4 rounded-2xl font-black border border-green-100 hover:bg-green-50 transition-all uppercase tracking-widest text-xs"
              >
                Return to Dashboard
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Popup Modal */}
      <AnimatePresence>
        {showPopup && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-emerald-950/40 backdrop-blur-sm z-[100] p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white shadow-2xl p-8 rounded-[2.5rem] w-full max-w-md border border-green-50"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
            >
              <h3 className="font-black text-xl mb-4 text-[#025622] tracking-tight uppercase">
                Confirm Delivery
              </h3>
              <p className="mb-8 text-sm text-gray-500 font-medium leading-relaxed">
                Send memories to <span className="text-[#117f3b] font-bold">{formData.firstName} {formData.lastName}</span> at <span className="font-bold text-[#025622]">{formData.email}</span> on <b className="text-[#025622]">{formData.sendDate} {formatTimeTo12Hour(formData.sendTime)}</b>?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleCancel}
                  className="flex-1 bg-gray-50 text-gray-500 py-4 rounded-2xl hover:bg-gray-100 font-black uppercase tracking-widest text-xs transition-all"
                >
                  Edit
                </button>
                <button
                  onClick={handleConfirmSend}
                  disabled={isProcessing}
                  className={`flex-1 ${isProcessing ? "bg-gray-200" : "bg-[#117f3b] hover:bg-[#025622] shadow-lg shadow-green-900/20"} text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all`}
                >
                  {isProcessing ? "Scheduling..." : "Confirm"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InviteContributer;