import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IoArrowBack, IoCamera } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

import { API_BASE_URL } from "../config";

function ProfileCard() {
  const API = `${API_BASE_URL}/api`;
  const IMAGE_BASE = API_BASE_URL;

  const [image, setImage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: ""
  });

  const [toast, setToast] = useState("");
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const MAX_FILE_SIZE = 2 * 1024 * 1024;

  const getUserId = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    return user?.id || user?.userId || user?.UserId;
  };

  const loadProfile = async () => {
    try {
      const userId = getUserId();
      if (!userId) return;

      const res = await axios.get(`${API}/Profile/user/${userId}`, {
        withCredentials: true
      });

      const data = res.data;
      setProfileData({
        firstName: data.firstName || "",
        lastName: data.lastName || "",
        email: data.email || "",
        phone: data.phone || "+91"
      });

      if (data.profileImage) {
        setImage(`${IMAGE_BASE}/${data.profileImage}`);
      } else {
        setImage(null);
      }
    } catch (err) {
      console.error("Profile load error:", err);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png"];
    if (!allowedTypes.includes(file.type)) {
      setToast("⚠️ Only JPG or PNG images allowed");
      setTimeout(() => setToast(""), 3000);
      fileInputRef.current.value = "";
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setToast("⚠️ Image must be less than 2MB");
      setTimeout(() => setToast(""), 3000);
      fileInputRef.current.value = "";
      return;
    }

    setImage(URL.createObjectURL(file));
  };

  const handleClick = () => {
    if (isEditing) fileInputRef.current.click();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if ((name === "firstName" || name === "lastName") && !/^[A-Za-z]*$/.test(value))
      return;

    if (name === "phone") {
      let digits = value.replace("+91", "");
      if (!/^[0-9]*$/.test(digits)) return;
      if (digits.length > 10) return;
      setProfileData({ ...profileData, phone: "+91" + digits });
      return;
    }

    setProfileData({ ...profileData, [name]: value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const userId = getUserId();

    if (!profileData.firstName || !profileData.lastName) {
      setToast("⚠️ Please fill required fields");
      setTimeout(() => setToast(""), 3000);
      return;
    }

    if (!/^\+91\d{10}$/.test(profileData.phone)) {
      setToast("⚠️ Phone must be +91XXXXXXXXXX");
      setTimeout(() => setToast(""), 3000);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("userId", userId);
      formData.append("firstName", profileData.firstName);
      formData.append("lastName", profileData.lastName);
      formData.append("email", profileData.email);
      formData.append("phone", profileData.phone);

      if (fileInputRef.current.files[0]) {
        formData.append("image", fileInputRef.current.files[0]);
      }

      await axios.put(`${API}/Profile/update`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true
      });

      setIsEditing(false);
      setToast("✅ Profile updated successfully");
      setTimeout(() => setToast(""), 3000);
      loadProfile();
    } catch (err) {
      console.error("Update error:", err);
      setToast("❌ Failed to update profile");
      setTimeout(() => setToast(""), 3000);
    }
  };

  const handleEdit = () => setIsEditing(true);

  return (
    <div className="min-h-screen w-full bg-[#f8fbfa] relative flex flex-col items-center justify-center p-4 sm:p-6 font-serif overflow-y-auto overflow-x-hidden">
      {/* BACKGROUND DECORATIONS (SUBTLE) */}
      <div className="fixed top-[-5%] left-[-2%] w-48 h-48 bg-green-100/40 rounded-full blur-3xl pointer-events-none"></div>
      <div className="fixed bottom-[-5%] right-[-2%] w-64 h-64 bg-emerald-100/30 rounded-full blur-3xl pointer-events-none"></div>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed top-10 left-1/2 -translate-x-1/2 bg-white px-6 py-3 rounded-2xl shadow-xl border border-green-100 text-[#117f3b] z-[100] font-bold text-xs uppercase tracking-widest"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="w-full max-w-xl flex flex-col items-center gap-4 py-6">
        
        {/* Profile Card Container */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[2.8rem] p-1 shadow-2xl shadow-green-900/5 w-full border border-green-100/30"
        >
          <div className="bg-[#f8fbfa] rounded-[2.5rem] p-6 sm:p-10 flex flex-col items-center">
            
            {/* Navigation & Header Section (Aligned) */}
            <div className="w-full mb-8">
              {/* Integrated Button Header for Desktop/iPad */}
              <div className="hidden sm:flex justify-between items-center mb-6 w-full">
                <button
                  onClick={() => navigate("/user")}
                  className="flex items-center gap-2 text-[#025622] font-black text-[10px] uppercase tracking-widest hover:bg-green-100/50 px-3 py-2 rounded-xl transition-all"
                >
                  <IoArrowBack size={16} /> Back
                </button>
                {!isEditing && (
                  <button
                    onClick={handleEdit}
                    className="bg-[#117f3b] text-white px-5 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-md hover:bg-[#025622] transition-all"
                  >
                    Edit Profile
                  </button>
                )}
              </div>

              {/* Mobile Navigation (Centred) */}
              <div className="flex sm:hidden justify-between w-full mb-6">
                <button
                  onClick={() => navigate("/user")}
                  className="p-2 text-[#025622] hover:bg-green-50 rounded-xl"
                >
                  <IoArrowBack size={20} />
                </button>
                {!isEditing && (
                  <button
                    onClick={handleEdit}
                    className="bg-[#117f3b] text-white px-4 py-1.5 rounded-lg font-black text-[9px] uppercase tracking-widest"
                  >
                    Edit
                  </button>
                )}
              </div>

              <div className="text-center w-full">
                <h1 className="text-3xl sm:text-4xl font-black text-[#025622] tracking-tighter uppercase mb-1.5">
                  Your <span className="text-[#117f3b]">Profile</span>
                </h1>
                <div className="h-0.5 w-8 bg-[#9dd1b1] mx-auto rounded-full mb-2 opacity-60"></div>
                <p className="text-gray-400 text-[8px] uppercase tracking-[0.2em] font-black opacity-50">Identity Management</p>
              </div>
            </div>

            {/* Profile Image Section */}
            <div className="relative mb-8 group">
              <motion.div
                whileHover={isEditing ? { scale: 1.05 } : {}}
                onClick={handleClick}
                className={`w-28 h-28 sm:w-32 sm:h-32 rounded-[2.2rem] overflow-hidden border-[4px] bg-white flex items-center justify-center shadow-xl transition-all duration-300 ${
                  isEditing 
                    ? "cursor-pointer border-[#9dd1b1] ring-8 ring-green-100/20" 
                    : "border-white"
                }`}
              >
                {image ? (
                  <img
                    src={image}
                    alt="Profile"
                    className="w-full h-full object-cover"
                    onError={() => setImage(null)}
                  />
                ) : (
                  <div className="flex flex-col items-center gap-1 opacity-20">
                    <span className="text-lg font-black text-[#025622]">+</span>
                    <span className="text-[7px] font-black uppercase tracking-widest">Photo</span>
                  </div>
                )}
              </motion.div>

              {isEditing && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute -bottom-1 -right-1 bg-[#117f3b] text-white p-2 rounded-2xl shadow-xl border-4 border-white pointer-events-none"
                >
                  <IoCamera size={14} />
                </motion.div>
              )}
              <input
                type="file"
                ref={fileInputRef}
                accept="image/jpeg,image/png"
                className="hidden"
                onChange={handleImageChange}
              />
            </div>

            {/* Form Section */}
            <form className="w-full space-y-4 px-2" onSubmit={handleSave}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[8px] font-black text-[#117f3b] uppercase tracking-widest pl-2 opacity-80">First Name</label>
                  <input
                    name="firstName"
                    placeholder="First Name"
                    value={profileData.firstName}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full bg-white p-2.5 border border-green-50 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#117f3b]/5 text-[#025622] font-black text-[11px] transition-all"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[8px] font-black text-[#117f3b] uppercase tracking-widest pl-2 opacity-80">Last Name</label>
                  <input
                    name="lastName"
                    placeholder="Last Name"
                    value={profileData.lastName}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full bg-white p-2.5 border border-green-50 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#117f3b]/5 text-[#025622] font-black text-[11px] transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[8px] font-black text-[#117f3b] uppercase tracking-widest pl-2 opacity-80">Email Address</label>
                <input
                  name="email"
                  value={profileData.email}
                  disabled
                  className="w-full bg-gray-100/50 p-2.5 border border-gray-100 rounded-xl text-gray-400 font-bold text-[11px] cursor-not-allowed italic"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[8px] font-black text-[#117f3b] uppercase tracking-widest pl-2 opacity-80">Mobile Number</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300 font-black text-[11px] font-serif">+91</span>
                  <input
                    name="phone"
                    value={profileData.phone.replace("+91", "")}
                    onChange={handleChange}
                    placeholder="XXXXXXXXXX"
                    disabled={!isEditing}
                    className="w-full bg-white p-2.5 pl-12 border border-green-50 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#117f3b]/5 text-[#025622] font-black text-[11px] transition-all"
                  />
                </div>
              </div>

              {isEditing && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col sm:flex-row gap-3 pt-3"
                >
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="flex-1 py-3 rounded-xl font-black text-[8px] uppercase tracking-widest text-gray-400 hover:bg-white transition-all border border-transparent hover:border-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-[2] bg-[#117f3b] text-white py-3 rounded-xl font-black text-[8px] uppercase tracking-widest shadow-lg hover:bg-[#025622] transition-all transform hover:scale-[1.01] active:scale-95"
                  >
                    Sync Profile
                  </button>
                </motion.div>
              )}
            </form>
          </div>
        </motion.div>
        
        {/* Footer Note */}
        <p className="text-[7px] font-bold text-[#117f3b] uppercase tracking-[0.3em] opacity-20 mt-4 text-center">
          Virtual Time Capsule © Secure Identity
        </p>
      </div>
    </div>
  );
}

export default ProfileCard;