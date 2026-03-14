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

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

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
    }, 2000);

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

      // API response
      const { id, firstName, email, role } = response.data;

      // Store user data
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f2eee3] px-4 font-serif font-bold">

      {/* Toast */}
      <PremiumToast 
        show={toast.show} 
        message={toast.message} 
        type={toast.type}
        onClose={() => setToast(prev => ({ ...prev, show: false }))} 
      />

      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-8 shadow-[#9dd1b1]">

        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-[#9dd1b1] flex items-center justify-center">
            <img
              className="w-14 h-14 rounded-full bg-[#025622]"
              src={logo}
              alt="logo"
            />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
          Welcome Back
        </h2>

        <p className="text-center text-gray-500 mb-6">
          Please login to your account
        </p>

        {/* Email */}
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

        {/* Password */}
        <div className="relative mb-6">
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

        {/* Login Button */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-[#117f3b] text-white py-2 rounded-lg hover:bg-[#025622] transition disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* Register */}
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
    </div>
  );
}