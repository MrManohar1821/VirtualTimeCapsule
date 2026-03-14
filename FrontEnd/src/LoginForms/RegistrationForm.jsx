// RegistrationForm.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../assets/logo.png";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { API_BASE_URL } from "../config";
import PremiumToast from "../components/PremiumToast";

export default function RegistrationForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "error" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // OTP State
  const [showOtpPopup, setShowOtpPopup] = useState(false);
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (!toast.show) return;
    const timer = setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
    return () => clearTimeout(timer);
  }, [toast.show]);

  // Handle Register Button Click (Sends OTP)
  const handleRegister = async (e) => {
    e.preventDefault();
    setToast({ ...toast, show: false });

    if (!firstName || !lastName || !email || !password || !confirmPassword)
      return setToast({ show: true, message: "All fields are required", type: "error" });

    const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
    if (!emailRegex.test(email.toLowerCase()))
      return setToast({ show: true, message: "Email must be valid", type: "error" });

    const passwordRegex =
      /^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{6,15}$/;

    if (!passwordRegex.test(password))
      return setToast({ show: true, message: "Password must be 6-15 characters with 1 number & 1 special character", type: "error" });

    if (password !== confirmPassword)
      return setToast({ show: true, message: "Passwords do not match", type: "error" });

    setIsSubmitting(true);

    try {
      // Step 1: Send OTP
      const response = await axios.post(
        `${API_BASE_URL}/api/Registration/SendOTP`,
        { email: email.toLowerCase().trim() },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.status === 200) {
        setShowOtpPopup(true);
      }

    } catch (err) {
      console.error("OTP send error:", err.response?.data || err.message);
      const message =
        err.response?.data?.message ||
        (typeof err.response?.data === "string" ? err.response.data : null) ||
        err.response?.data?.title ||
        "Failed to send OTP. Please try again.";
      setToast({ show: true, message: message, type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle OTP Verification and Final Registration
  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      return setToast({ show: true, message: "Please enter a valid 6-digit OTP", type: "error" });
    }

    setIsVerifying(true);
    setToast({ ...toast, show: false });

    try {
      const registrationData = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.toLowerCase().trim(),
        password: password,
        otp: otp
      };

      const response = await axios.post(
        `${API_BASE_URL}/api/Registration/Register`,
        registrationData,
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.status === 200) {
        setShowOtpPopup(false);
        setToast({ show: true, message: "Registered successfully. Please login.", type: "success" });
        setTimeout(() => navigate("/login"), 3000);
      }

    } catch (err) {
      const message =
        err.response?.data?.message ||
        (typeof err.response?.data === "string" ? err.response.data : null) ||
        err.response?.data?.title ||
        "Registration Failed. Invalid OTP.";
      setToast({ show: true, message: message, type: "error" });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f2eee3] px-4 font-serif font-bold">

      <PremiumToast 
        show={toast.show} 
        message={toast.message} 
        type={toast.type}
        onClose={() => setToast(prev => ({ ...prev, show: false }))} 
      />

      <div className="w-full max-w-md bg-white rounded-2xl p-8 shadow-md shadow-[#9dd1b1]">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-[#9dd1b1] flex items-center justify-center">
            <img
              src={logo}
              alt="logo"
              className="w-14 h-14 rounded-full bg-[#025622]"
            />
          </div>
        </div>

        <h2 className="text-2xl text-center text-gray-800 mb-6">
          Create Account
        </h2>

        <form autoComplete="off" onSubmit={handleRegister}>

          <div className="flex gap-4 mb-4">
            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-1/2 px-4 py-2 border border-[#9dd1b1] rounded-lg focus:outline-none"
            />
            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-1/2 px-4 py-2 border border-[#9dd1b1] rounded-lg focus:outline-none"
            />
          </div>

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 mb-4 border border-[#9dd1b1] rounded-lg focus:outline-none"
          />

          <div className="relative mb-4">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-[#9dd1b1] rounded-lg focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5 text-xl text-[#117f3b]"
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>

          <p className="text-xs text-gray-500 mb-4">
            6-15 characters, 1 number & 1 special character
          </p>

          <div className="relative mb-6">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 border border-[#9dd1b1] rounded-lg focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-2.5 text-xl text-[#117f3b]"
            >
              {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#117f3b] text-white py-2 rounded-lg hover:bg-[#025622] transition disabled:opacity-70"
          >
            {isSubmitting ? "Sending OTP..." : "Register"}
          </button>

        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-[#201229] hover:underline"
            >
              Login
            </button>
          </p>
        </div>
      </div>

      {/* OTP Verification Popup */}
      {showOtpPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-sm shadow-2xl animate-fadein border-2 border-[#9dd1b1]">
            <h3 className="text-xl font-bold text-center text-gray-800 mb-2">Verify OTP</h3>
            <p className="text-sm text-center text-gray-500 mb-6">
              Enter the 6-digit code sent to<br />
              <span className="font-bold text-[#117f3b]">{email}</span>
            </p>

            <input
              type="text"
              placeholder="Enter 6-digit OTP"
              value={otp}
              maxLength={6}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              className="w-full text-center text-2xl tracking-[0.5em] font-bold px-4 py-3 mb-6 border-2 border-[#9dd1b1] rounded-xl focus:outline-none focus:border-[#117f3b]"
            />

            <div className="flex flex-col gap-3">
              <button
                onClick={handleVerifyOtp}
                disabled={isVerifying}
                className="w-full bg-[#117f3b] text-white py-3 rounded-lg font-bold hover:bg-[#025622] transition disabled:opacity-70"
              >
                {isVerifying ? "Verifying..." : "Verify & Register"}
              </button>
              
              <button
                onClick={() => setShowOtpPopup(false)}
                className="w-full py-2 text-gray-500 hover:text-gray-800 transition text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}