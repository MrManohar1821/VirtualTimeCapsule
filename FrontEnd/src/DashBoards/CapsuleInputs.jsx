import { useState, useRef, useEffect } from "react";
import { Upload, Video, Send, X } from "lucide-react";
import { FaUserCircle } from "react-icons/fa";
import { MdClose, MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { API_BASE_URL } from "../config";
import logo from "../assets/logo.png";
import PremiumToast from "../components/PremiumToast";

function CapsuleInput() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [recording, setRecording] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "error" });
  const [timer, setTimer] = useState(30);
  const [deleteConfirmIndex, setDeleteConfirmIndex] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const fileInputRef = useRef(null);
  const videoPreviewRef = useRef(null);
  const streamRef = useRef(null);

  const navigate = useNavigate();
  const MAX_RECORD_TIME = 30;

  /* ---------------- Timer ---------------- */
  useEffect(() => {
    let interval;
    if (recording) {
      interval = setInterval(() => {
        setTimer((t) => {
          if (t <= 1) {
            stopRecording();
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    } else {
      setTimer(MAX_RECORD_TIME);
    }
    return () => clearInterval(interval);
  }, [recording]);

  const showPopup = (msg, type = "error") => {
    setToast({ show: true, message: msg, type });
  };

  /* ---------------- Text Message ---------------- */
  const handleSend = () => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { type: "text", text: input, id: Date.now() }]);
    setInput("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  /* ---------------- Video Recording ---------------- */
  const startRecording = async () => {
    try {
      // Simplify constraints for better desktop compatibility
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      streamRef.current = stream;
      
      chunksRef.current = [];
      
      // Select the best supported codec
      const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp8,opus') 
        ? 'video/webm;codecs=vp8,opus' 
        : 'video/webm';
        
      const recorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "video/webm" });
        const file = new File([blob], "recorded.webm", { type: "video/webm" });
        const url = URL.createObjectURL(blob);
        setMessages((prev) => [
          ...prev,
          { type: "video", file, url, id: Date.now() }
        ]);
        
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((t) => t.stop());
        }
        setRecording(false);
      };

      recorder.start();
      setRecording(true);
    } catch (err) {
      console.error("Camera access error:", err);
      if (err.name === "NotAllowedError") {
        alert("Camera Access Denied! Please click the 'Lock' icon in the browser address bar and set Camera to 'Allow'.");
      } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
        alert("No camera found! Please check your system connections.");
      } else {
        alert(`Camera Error: ${err.message}. Please refresh the page or check if another app is using the camera.`);
      }
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current?.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    setRecording(false);
  };


  /* ---------------- File Upload ---------------- */
  const handleUploadClick = () => fileInputRef.current.click();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const allowed = ["image/", "video/", "application/pdf"];
    if (!allowed.some((t) => file.type.startsWith(t))) {
      showPopup("Image | Video | PDF only!");
      return;
    }
    const url = URL.createObjectURL(file);
    setMessages((prev) => [
      ...prev,
      {
        type: file.type.startsWith("image") ? "image" : file.type.startsWith("video") ? "video" : "pdf",
        file,
        url,
        id: Date.now()
      }
    ]);
  };

  /* ---------------- Save Capsule ---------------- */
  const saveCapsule = async () => {
    if (!messages.length) {
      showPopup("Add at least one memory!");
      return;
    }
    const capsuleId = sessionStorage.getItem("capsuleId");
    if (!capsuleId || capsuleId === "null") {
      showPopup("Capsule ID missing!");
      return;
    }
    setIsSaving(true);
    try {
      await Promise.all(messages.map(async (msg) => {
        const formData = new FormData();
        formData.append("CapsuleId", capsuleId);
        if (msg.type === "text") formData.append("Message", msg.text);
        if (msg.file) formData.append("File", msg.file);
        return axios.post(`${API_BASE_URL}/api/memory/add`, formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
      }));
      navigate("/user/invitecontributer");
    } catch (err) {
      showPopup("Failed to save memories");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="h-screen w-full bg-[#f2eee3] flex items-center justify-center p-2 sm:p-4 font-serif relative overflow-hidden">
      {/* Background Decorations */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-100/30 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-green-100/30 rounded-full blur-[120px] pointer-events-none" />

      {/* Popups (Glassmorphism) */}
      <PremiumToast 
        show={toast.show} 
        message={toast.message} 
        type={toast.type}
        onClose={() => setToast(prev => ({ ...prev, show: false }))} 
      />

        <AnimatePresence>
          {deleteConfirmIndex !== null && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-[#025622]/20 backdrop-blur-sm flex items-center justify-center z-[110] px-4"
            >
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white/90 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-2xl w-full max-w-sm text-center border border-white"
              >
                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500">
                  <MdDelete size={32} />
                </div>
                <h3 className="text-xl font-black text-[#201229] mb-2 font-serif">Delete Memory?</h3>
                <p className="text-gray-500 text-sm mb-8 font-serif italic">This action cannot be undone.</p>
                <div className="flex gap-4 font-serif">
                  <button
                    onClick={() => setDeleteConfirmIndex(null)}
                    className="flex-1 py-3 px-4 rounded-2xl font-bold bg-gray-100 text-gray-500 hover:bg-gray-200 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      setMessages((prev) => prev.filter((_, i) => i !== deleteConfirmIndex));
                      setDeleteConfirmIndex(null);
                    }}
                    className="flex-1 py-3 px-4 rounded-2xl font-bold bg-red-500 text-white shadow-lg shadow-red-500/30 hover:bg-red-600 transition"
                  >
                    Confirm
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-4xl max-h-[95vh] bg-white/60 backdrop-blur-2xl rounded-[2.5rem] sm:rounded-[3rem] shadow-md shadow-[#9dd1b1] p-4 sm:p-6 md:p-8 flex flex-col border border-white/50 relative z-10"
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between border-b border-[#9dd1b1]/30 pb-6 mb-6 gap-4">
          <div className="flex items-center gap-4 w-full sm:w-auto justify-center sm:justify-start">
            <div className="w-12 h-12 rounded-2xl bg-[#9dd1b1] flex items-center justify-center p-2 shadow-inner border border-white/40">
              <img src={logo} alt="logo" className="w-8 h-8 rounded-full bg-[#025622] object-contain" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl md:text-2xl font-black text-[#025622] tracking-tighter uppercase leading-none">
                Capsule <span className="text-[#117f3b]">Memorie<span className="text-black">'</span>s</span>
              </h1>
              <p className="text-[9px] text-[#117f3b]/60 font-black tracking-[0.2em] uppercase mt-1">Digital Preservation</p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={saveCapsule}
            disabled={isSaving}
            className={`w-full sm:w-auto text-[10px] sm:text-xs px-6 md:px-8 py-3 rounded-2xl font-black uppercase tracking-widest transition-all ${
              isSaving 
                ? "bg-gray-200 text-gray-400" 
                : "bg-[#117f3b] text-white shadow-lg shadow-green-900/20 hover:bg-[#025622]"
            }`}
          >
            {isSaving ? "Saving..." : "Deliver ➜"}
          </motion.button>
        </div>

        {/* Message List (Scroll Section) - TALLER ON DESKTOP */}
        <div className="flex-1 min-h-[200px] overflow-y-auto bg-white/30 backdrop-blur-md rounded-[2rem] sm:rounded-[2.5rem] p-4 sm:p-6 shadow-inner border border-[#9dd1b1]/10 mb-6 custom-scrollbar relative">
          <AnimatePresence mode="popLayout">
            {messages.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full flex flex-col items-center justify-center opacity-30 text-[#025622] text-center"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-dashed border-[#117f3b] mb-4 flex items-center justify-center">
                  <span className="text-3xl sm:text-4xl font-light">+</span>
                </div>
                <p className="font-serif italic font-bold text-sm sm:text-base">Add your first memory...</p>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {messages.map((msg, i) => (
                  <motion.div
                    layout
                    key={msg.id || i}
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.8, opacity: 0, x: -20 }}
                    className="group relative"
                  >
                    {/* Delete Icon */}
                    <button 
                      onClick={() => setDeleteConfirmIndex(i)}
                      className="absolute -top-2 -right-2 w-7 h-7 sm:w-8 sm:h-8 bg-white rounded-full shadow-lg border border-red-50 flex items-center justify-center text-red-400 hover:text-red-600 hover:scale-110 transition-all z-20 cursor-pointer"
                    >
                      <MdClose size={16} className="sm:w-[18px] sm:h-[18px]" />
                    </button>

                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-3 sm:p-4 border border-white shadow-sm hover:shadow-md transition-all">
                      {msg.type === "text" && (
                        <p className="text-[#201229] font-serif font-bold text-sm sm:text-base px-2 break-words">
                          {msg.text}
                        </p>
                      )}

                      {msg.type === "image" && (
                        <img
                          src={msg.url}
                          className="rounded-xl sm:rounded-2xl max-h-48 sm:max-h-60 w-full object-cover shadow-sm border-[3px] sm:border-4 border-white"
                        />
                      )}

                      {msg.type === "video" && (
                        <video
                          controls
                          playsInline
                          className="rounded-xl sm:rounded-2xl max-h-48 sm:max-h-60 w-full object-cover shadow-sm border-[3px] sm:border-4 border-white"
                        >
                          <source src={msg.url} type="video/webm" />
                          Your browser does not support the video tag.
                        </video>
                      )}

                      {msg.type === "pdf" && (
                        <div className="flex items-center gap-3 sm:gap-4 bg-red-50/50 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-red-100">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-lg sm:rounded-xl flex items-center justify-center text-red-500 shadow-sm">
                            <Upload size={20} className="sm:w-6 sm:h-6" />
                          </div>
                          <div className="flex-1 overflow-hidden">
                            <p className="text-xs sm:text-sm font-bold text-[#025622] truncate">Document Archive</p>
                            <a href={msg.url} target="_blank" rel="noreferrer" className="text-[10px] sm:text-xs text-red-500 font-bold hover:underline">View PDF File</a>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Input Controls */}
        <div className="flex flex-col gap-3 p-3 bg-white/40 backdrop-blur-xl rounded-[2rem] border border-white shadow-lg">
          <div className="flex items-center gap-2">
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleUploadClick}
                className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white text-[#117f3b] shadow-sm hover:bg-green-50 transition-colors border border-green-100"
              >
                <Upload size={18} className="sm:w-[22px] sm:h-[22px]" />
              </motion.button>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={handleFileChange}
                accept="image/*,video/*,application/pdf"
              />

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={startRecording}
                disabled={recording}
                className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white text-red-500 shadow-sm hover:bg-red-50 transition-colors border border-red-100"
              >
                <Video size={18} className="sm:w-[22px] sm:h-[22px]" />
              </motion.button>
            </div>

            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Whisper to the future..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                className="w-full p-3 sm:p-4 pr-12 rounded-xl sm:rounded-2xl border-2 border-[#9dd1b1] focus:outline-none focus:ring-4 focus:ring-green-100/50 bg-white/50 text-[#025622] font-serif font-bold text-sm sm:text-base transition-all placeholder:text-[#117f3b]/30"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSend}
                className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 p-2 sm:p-3 rounded-lg sm:rounded-xl bg-[#117f3b] text-white shadow-lg hover:bg-[#025622] transition-colors"
              >
                <Send size={18} className="sm:w-5 sm:h-5" />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Video Recording Overlay with Live Preview */}
      <AnimatePresence>
        {recording && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#025622]/60 backdrop-blur-xl flex items-center justify-center z-[200] p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white rounded-[2.5rem] sm:rounded-[3rem] p-6 sm:p-8 shadow-2xl text-center w-full max-w-sm sm:max-w-md border border-white"
            >
              <div className="relative mb-6 rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden border-4 sm:border-8 border-[#9dd1b1]/20 shadow-2xl bg-black aspect-video flex items-center justify-center group">
                {/* Fallback Connecting Text */}
                <div className="absolute inset-0 flex items-center justify-center text-white/20 text-[10px] font-bold uppercase tracking-[0.3em]">
                  Initializing Hardware...
                </div>

                <video
                  ref={(el) => {
                    if (el && streamRef.current) {
                      if (el.srcObject !== streamRef.current) {
                        el.srcObject = streamRef.current;
                      }
                      el.muted = true;
                      const forcePlay = () => { if (el.paused) el.play().catch(() => {}); };
                      forcePlay();
                      setTimeout(forcePlay, 500);
                    }
                  }}
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-full object-cover relative z-10"
                  style={{ transform: 'scaleX(-1)' }} 
                />

                <div className="absolute top-3 right-3 sm:top-4 sm:right-4 flex items-center gap-2 bg-red-500 text-white px-2 py-1 sm:px-3 sm:py-1.5 rounded-full text-[8px] sm:text-[10px] font-black uppercase tracking-widest animate-pulse">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full" />
                  Recording
                </div>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-xl px-4 py-2 rounded-2xl text-white border border-white/20 shadow-2xl flex items-center gap-3 z-20">
                  <div className="flex flex-col items-center leading-none">
                    <span className="text-sm font-black tracking-tighter">{timer < 10 ? `0${timer}` : timer}</span>
                    <span className="text-[6px] font-black uppercase tracking-widest opacity-60">Seconds</span>
                  </div>
                  <div className="w-px h-4 bg-white/20" />
                  <span className="text-[8px] font-black uppercase tracking-widest opacity-80">Remaining</span>
                </div>
              </div>

              <h3 className="text-lg sm:text-xl font-black text-[#025622] mb-1">Live Capture</h3>
              <p className="text-gray-400 text-[8px] sm:text-[10px] uppercase font-bold tracking-widest mb-6 italic opacity-60">Identity Visualization Active</p>

              <button
                onClick={stopRecording}
                className="w-full py-3 sm:py-4 bg-red-500 hover:bg-red-600 text-white rounded-xl sm:rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-red-500/30 transition-all transform active:scale-95"
              >
                Stop & Save
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #9dd1b144; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #117f3b88; }
      `}} />
    </div>
  );
}

export default CapsuleInput;