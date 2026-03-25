// LoginForm.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../assets/logo.png";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { API_BASE_URL } from "../config";
import PremiumToast from "../components/PremiumToast";

export default function LoginForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [forgotFormData, setForgotFormData] = useState({
    email: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // OTP State
  const [showOtpPopup, setShowOtpPopup] = useState(false);
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: ""
  });

  // Auto hide toast
  useEffect(() => {
    if (!toast.show) return;

    const timer = setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 3000);

    return () => clearTimeout(timer);
  }, [toast.show]);

  // Auto redirect if already logged in
  useEffect(() => {
    const existingUser = localStorage.getItem("user");
    if (existingUser) {
      const parsedUser = JSON.parse(existingUser);
      if (parsedUser.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/user");
      }
    }
  }, [navigate]);

  const showToast = (message, type) => {
    setToast({ show: true, message, type });
  };

  const handleLogin = async () => {
    if (!formData.email.trim() || !formData.password.trim()) {
      showToast("Please fill all fields", "error");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        `${API_BASE_URL}/api/Registration/Login`,
        {
          email: formData.email,
          password: formData.password
        },
        {
          withCredentials: true
        }
      );

      const { id, firstName, email, role } = response.data;

      const userData = {
        id: id,
        firstName: firstName,
        email: email,
        role: role === 1 ? "admin" : "user"
      };

      localStorage.setItem("user", JSON.stringify(userData));
      showToast("Login successful", "success");

      setTimeout(() => {
        if (userData.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/user");
        }
      }, 600);

    } catch (err) {
      showToast("Invalid email or password", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    const { email, newPassword, confirmPassword } = forgotFormData;

    if (!email || !newPassword || !confirmPassword) {
      return showToast("All fields are required", "error");
    }

    const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
    if (!emailRegex.test(email.toLowerCase())) {
      return showToast("Email must be valid", "error");
    }

    const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{6,15}$/;
    if (!passwordRegex.test(newPassword)) {
      return showToast("Password must be 6-15 characters with 1 number & 1 special character", "error");
    }

    if (newPassword !== confirmPassword) {
      return showToast("Passwords do not match", "error");
    }

    try {
      setLoading(true);
      const response = await axios.post(
        `${API_BASE_URL}/api/Registration/ForgotPassword`,
        { email: email.toLowerCase().trim() }
      );

      if (response.status === 200) {
        setShowOtpPopup(true);
      }
    } catch (err) {
      const message = err.response?.data?.message || 
                     (typeof err.response?.data === 'string' ? err.response.data : null) || 
                     "Failed to send OTP";
      showToast(message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyReset = async () => {
    if (!otp || otp.length !== 6) {
      return showToast("Please enter a valid 6-digit OTP", "error");
    }

    try {
      setIsVerifying(true);
      const response = await axios.post(
        `${API_BASE_URL}/api/Registration/ResetPassword`,
        {
          email: forgotFormData.email.toLowerCase().trim(),
          password: forgotFormData.newPassword,
          otp: otp
        }
      );

      if (response.status === 200) {
        setShowOtpPopup(false);
        showToast("Password updated successfully. Please login.", "success");
        setIsForgotPassword(false);
        setForgotFormData({ email: "", newPassword: "", confirmPassword: "" });
        setOtp("");
      }
    } catch (err) {
      const message = err.response?.data?.message || 
                     (typeof err.response?.data === 'string' ? err.response.data : null) || 
                     "Invalid OTP or reset failed";
      showToast(message, "error");
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

      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-8 shadow-[#9dd1b1]">

        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-[#9dd1b1] flex items-center justify-center">
            <img
              className="w-14 h-14 rounded-full bg-[#025622]"
              src={logo}
              alt="logo"
            />
          </div>
        </div>

        {!isForgotPassword ? (
          <>
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
              Welcome Back
            </h2>
            <p className="text-center text-gray-500 mb-6">
              Please login to your account
            </p>

            <div className="mb-4">
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-4 py-2 border border-[#9dd1b1] rounded-lg focus:outline-none"
                autoComplete="username"
              />
            </div>

            <div className="relative mb-2">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full px-4 py-2 border border-[#9dd1b1] rounded-lg focus:outline-none"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-xl text-[#117f3b]"
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>

            <div className="text-right mb-6">
              <button
                onClick={() => setIsForgotPassword(true)}
                className="text-sm text-[#117f3b] hover:underline"
              >
                Forgot Password?
              </button>
            </div>

            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full bg-[#117f3b] text-white py-2 rounded-lg hover:bg-[#025622] transition disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
              Reset Password
            </h2>
            <p className="text-center text-gray-500 mb-6">
              Enter details to update password
            </p>

            <div className="mb-4">
              <input
                type="email"
                placeholder="Registered Email"
                value={forgotFormData.email}
                onChange={(e) =>
                  setForgotFormData({ ...forgotFormData, email: e.target.value })
                }
                className="w-full px-4 py-2 border border-[#9dd1b1] rounded-lg focus:outline-none"
              />
            </div>

            <div className="relative mb-4">
              <input
                type={showNewPassword ? "text" : "password"}
                placeholder="New Password"
                value={forgotFormData.newPassword}
                onChange={(e) =>
                  setForgotFormData({ ...forgotFormData, newPassword: e.target.value })
                }
                className="w-full px-4 py-2 border border-[#9dd1b1] rounded-lg focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-2.5 text-xl text-[#117f3b]"
              >
                {showNewPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>

            <div className="relative mb-6">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                value={forgotFormData.confirmPassword}
                onChange={(e) =>
                  setForgotFormData({ ...forgotFormData, confirmPassword: e.target.value })
                }
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
              onClick={handleForgotPassword}
              disabled={loading}
              className="w-full bg-[#117f3b] text-white py-2 rounded-lg hover:bg-[#025622] transition disabled:opacity-50 mb-4"
            >
              {loading ? "Sending OTP..." : "Update Password"}
            </button>

            <button
              onClick={() => setIsForgotPassword(false)}
              className="w-full text-gray-500 hover:text-gray-800 transition text-sm"
            >
              Back to Login
            </button>
          </>
        )}

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don’t have an account?{" "}
            <button
              onClick={() => navigate("/register")}
              className="text-[#201229] hover:underline"
            >
              Register
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
              <span className="font-bold text-[#117f3b]">{forgotFormData.email}</span>
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
                onClick={handleVerifyReset}
                disabled={isVerifying}
                className="w-full bg-[#117f3b] text-white py-3 rounded-lg font-bold hover:bg-[#025622] transition disabled:opacity-70"
              >
                {isVerifying ? "Verifying..." : "Verify & Update"}
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