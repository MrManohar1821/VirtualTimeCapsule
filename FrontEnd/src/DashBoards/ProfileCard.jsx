import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoMdClose } from "react-icons/io";
import { IoArrowBack } from "react-icons/io5";
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

  const [menuOpen, setMenuOpen] = useState(false);
  const [toast, setToast] = useState("");

  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const MAX_FILE_SIZE = 2 * 1024 * 1024;

  // ==============================
  // Get Logged UserId
  // ==============================

  const getUserId = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    return user?.id;
  };

  // ==============================
  // Load Profile
  // ==============================

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

  // ==============================
  // Image Upload
  // ==============================

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

  // ==============================
  // Input Change
  // ==============================

  const handleChange = (e) => {

    const { name, value } = e.target;

    if ((name === "firstName" || name === "lastName") && !/^[A-Za-z]*$/.test(value))
      return;

    if (name === "phone") {

      let digits = value.replace("+91", "");

      if (!/^[0-9]*$/.test(digits)) return;
      if (digits.length > 10) return;

      setProfileData({
        ...profileData,
        phone: "+91" + digits
      });

      return;
    }

    setProfileData({
      ...profileData,
      [name]: value
    });

  };

  // ==============================
  // Save Profile
  // ==============================

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

      await axios.put(
        `${API}/Profile/update`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true
        }
      );

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

    <div className="min-h-screen w-full bg-[#f2eee3] flex flex-col items-center px-4 sm:px-6 md:px-8 py-20 font-serif font-bold overflow-x-hidden">

      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-white/30 backdrop-blur-lg border border-white/20 text-[#025622] px-6 py-3 rounded-xl shadow-lg z-50 animate-fadeinout">
          {toast}
        </div>
      )}

      {/* Card */}

      <div className="relative bg-white shadow rounded-2xl w-full max-w-md sm:max-w-lg px-4 sm:px-6 py-6 sm:py-8 mt-4">

        <button
          onClick={() => navigate("/user")}
          className="absolute top-4 left-4 flex items-center gap-1 text-[#025622]"
        >
          <IoArrowBack /> Back
        </button>

        <button
          onClick={handleEdit}
          className="absolute top-4 right-4 bg-green-200 text-[#025622] px-4 py-1.5 rounded-lg font-semibold"
        >
          Edit
        </button>

        <h1 className="text-xl sm:text-2xl text-[#025622] mb-6 text-center">
          Your Profile
        </h1>

        {/* Profile Image */}

        <div className="flex justify-center mb-6">

          <div
            onClick={handleClick}
            className={`w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 flex items-center justify-center bg-gray-200 ${isEditing ? "cursor-pointer border-green-400" : "border-gray-300"
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
              <span className="text-sm text-gray-500">Upload Photo</span>
            )}

          </div>

          <input
            type="file"
            ref={fileInputRef}
            accept="image/jpeg,image/png"
            className="hidden"
            onChange={handleImageChange}
          />

        </div>

        {/* Form */}

        <form className="space-y-5" onSubmit={handleSave}>

          <div className="flex flex-col sm:flex-row gap-4">

            <input
              name="firstName"
              placeholder="First name"
              value={profileData.firstName}
              onChange={handleChange}
              disabled={!isEditing}
              className="w-full p-3 border border-green-300 rounded-lg focus:outline-none disabled:bg-gray-100"
            />

            <input
              name="lastName"
              placeholder="Last name"
              value={profileData.lastName}
              onChange={handleChange}
              disabled={!isEditing}
              className="w-full p-3 border border-green-300 rounded-lg focus:outline-none disabled:bg-gray-100"
            />

          </div>

          <div className="flex flex-col sm:flex-row gap-4">

            <input
              name="email"
              value={profileData.email}
              disabled
              className="w-full p-3 border border-green-300 rounded-lg bg-gray-100"
            />

            <input
              name="phone"
              value={profileData.phone.replace("+91", "")}
              onChange={handleChange}
              disabled={!isEditing}
              className="w-full p-3 border border-green-300 rounded-lg disabled:bg-gray-100"
            />

          </div>

          <button
            type="submit"
            disabled={!isEditing}
            className={`w-full py-3 rounded-lg font-semibold ${isEditing
                ? "bg-green-200 text-[#025622]"
                : "bg-gray-300 text-gray-600 cursor-not-allowed"
              }`}
          >
            Save Profile
          </button>

        </form>

      </div>

    </div>

  );

}

export default ProfileCard;