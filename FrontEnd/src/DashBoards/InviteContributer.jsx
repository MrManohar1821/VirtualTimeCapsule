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
    <div className="min-h-screen flex items-center justify-center bg-green-50 px-4 font-serif font-bold ">
      <div className="bg-white rounded-2xl shadow p-6 w-full max-w-xl relative shadow-[#025622]">
        <button
          onClick={() => navigate("/user/capsuleInputs")}
          className="absolute top-1 left-4 flex items-center gap-1 text-[#025622] font-semibold hover:text-[#190E20]"
        >
          <ArrowLeft size={15} /> Back
        </button>

        {!sent ? (
          <>
            <div className="flex justify-between items-center mt-5 mb-5">
              <h2 className="text-2xl font-bold text-[#025622]">Invite a Contributor</h2>
            </div>

            {/* Inputs */}
            <input type="text" name="firstName" placeholder="Enter first name" value={formData.firstName} onChange={handleChange} className="w-full border border-green-300 rounded-md p-2 mb-2 focus:outline-none" />
            {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName}</p>}

            <input type="text" name="lastName" placeholder="Enter last name" value={formData.lastName} onChange={handleChange} className="w-full border border-green-300 rounded-md p-2 mb-2 focus:outline-none" />
            {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName}</p>}

            <input type="email" name="email" placeholder="Enter email" value={formData.email} onChange={handleChange} className="w-full border border-green-300 rounded-md p-2 mb-2 focus:outline-none" />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

            <div className="flex gap-2 mb-2">
              <input type="date" name="sendDate" value={formData.sendDate} onChange={handleChange} min={today} className="w-1/2 border border-green-300 rounded-md p-2 focus:outline-none" />
              <input type="time" name="sendTime" value={formData.sendTime} onChange={handleChange} min={getMinTime()} className="w-1/2 border border-green-300 rounded-md p-2 focus:outline-none" />
            </div>
            {(errors.sendDate || errors.sendTime) && <p className="text-red-500 text-sm">{errors.sendDate || errors.sendTime}</p>}

            <textarea name="note" placeholder="Add a personal note" value={formData.note} onChange={handleChange} className="w-full border border-green-300 rounded-md p-2 mb-2 focus:outline-none" />
            {errors.note && <p className="text-red-500 text-sm">{errors.note}</p>}


            <button onClick={handleSendClick} className="w-full bg-green-200 text-[#025622] py-2 rounded-md font-bold hover:bg-green-300 mt-2">SEND INVITATION</button>
          </>
        ) : (
          <div className="text-center">
            <CheckCircle className="mx-auto text-green-500" size={48} />
            <h3 className="text-lg font-bold mt-3 text-[#025622]">Invitation Sent!</h3>
            <p className="mt-2 text-sm text-[#190E20]">
              To: <b>{formData.firstName} {formData.lastName}</b> ({formData.email}) on <b>{formData.sendDate} {formatTimeTo12Hour(formData.sendTime)}</b>
            </p>
            <div className="mt-4 flex flex-col gap-2">
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
                className="bg-green-200 text-[#025622] py-2 rounded-md font-bold hover:bg-green-300"
              >
                Create Another Capsule
              </button>
              <button
                onClick={() => navigate("/user")}
                className="bg-white py-2 rounded-md font-bold border border-green-200 hover:bg-green-50"
              >
                Return to Memory
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Popup Modal */}
      <AnimatePresence>
        {showPopup && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50 p-3 sm:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white border border-green-200 shadow-2xl p-4 sm:p-6 rounded-2xl w-full max-w-sm sm:max-w-md max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="font-bold text-base sm:text-lg mb-3 text-[#025622]">
                Confirm Invitation
              </h3>
              <p className="mb-4 sm:mb-6 text-xs sm:text-sm text-[#190E20]">
                Send invitation to{" "}
                <span className="font-bold">{formData.firstName} {formData.lastName}</span> ({formData.email}) on{" "}
                <b>{formData.sendDate} {formatTimeTo12Hour(formData.sendTime)}</b>?
              </p>
              <div className="flex flex-col sm:flex-row justify-between gap-3">
                <button
                  onClick={handleCancel}
                  className="bg-red-400 px-4 py-2 rounded-lg hover:bg-red-500 font-semibold text-white text-sm sm:text-base"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmSend}
                  disabled={isProcessing}
                  className={`${isProcessing ? "bg-gray-300" : "bg-green-200 hover:bg-green-300"} text-[#025622] px-4 py-2 rounded-lg font-bold text-sm sm:text-base transition-colors`}
                >
                  {isProcessing ? "Processing..." : "Send"}
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