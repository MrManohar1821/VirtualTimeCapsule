import React, { useEffect, useState } from "react";
import { MdHome, MdLogout, MdEmail, MdAccessTime, MdClose, MdDelete, MdFolderOpen, MdCalendarToday, MdMenu, MdDashboard, MdChevronRight, MdEdit } from "react-icons/md";
import { IoPersonCircle } from "react-icons/io5";
import { FaGift, FaImage, FaVideo, FaFilePdf, FaQuoteLeft, FaUserFriends } from "react-icons/fa";
import { IoIosPeople } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../assets/logo.png";
import { API_BASE_URL } from "../config";
import PremiumToast from "../components/PremiumToast";

function CreateCapsule() {
  const [greeting, setGreeting] = useState("");
  const [profile, setProfile] = useState(null);
  const [capsules, setCapsules] = useState([]);
  const [memories, setMemories] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedCapsule, setSelectedCapsule] = useState(null);
  const [timer, setTimer] = useState(Date.now());
  const [loadingMemories, setLoadingMemories] = useState(false);
  const [loadingCapsules, setLoadingCapsules] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Dashboard");

  /* CUSTOM UI STATES */
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [capsuleToDelete, setCapsuleToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });


  const navigate = useNavigate();
  const API = `${API_BASE_URL}/api`;

  /* LIVE TIMER */
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  /* GREETING */
  useEffect(() => {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 12) setGreeting("Good Morning");
    else if (hour >= 12 && hour < 17) setGreeting("Good Afternoon");
    else if (hour >= 17 && hour < 21) setGreeting("Good Evening");
    else setGreeting("Good Night");
  }, []);

  /* USERID */
  const getUserId = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    return user?.id || user?.userId || user?.UserId;
  };

  /* FETCH PROFILE DATA */
  const fetchProfile = async () => {
    const uid = getUserId();
    if (!uid) return;
    try {
      const res = await fetch(`/api/Profile/user/${uid}`);
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
      }
    } catch (err) {
      console.error("Profile fetch error:", err);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  /* COUNTDOWN TIMER */
  const getCountdown = (date, time) => {
    if (!date) return "--";

    let unlock;

    if (time) {
      const cleanTime = time.split(".")[0];
      const datePart = date.split("T")[0];
      unlock = new Date(`${datePart}T${cleanTime}`);
    } else {
      unlock = new Date(date);
    }
    const now = new Date(timer);
    const diff = unlock.getTime() - now.getTime();

    if (isNaN(diff)) return "--";
    if (diff <= 0) return "Unlocked";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);

    return `${days}d ${hours}h ${minutes}m`;
  };

  /* FETCH CAPSULES */
  const fetchCapsules = async () => {
    setLoadingCapsules(true);
    try {
      const userId = getUserId();
      if (!userId) return;

      const res = await fetch(`${API}/Capsule/user/${userId}`);
      const data = await res.json();
      setCapsules(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Capsule load error:", err);
    } finally {
      setLoadingCapsules(false);
    }
  };

  /* AUTO REFRESH CAPSULES */
  useEffect(() => {
    fetchCapsules();
  }, []);

  /* OPEN CAPSULE MEMORIES */
  const openCapsule = async (capsule) => {
    setSelectedCapsule(capsule);
    setLoadingMemories(true);
    setShowPopup(true);
    try {
      const res = await fetch(`${API}/Capsule/details/${capsule.capsuleId}`);
      const data = await res.json();
      setMemories(Array.isArray(data) ? data : data.memories || []);
    } catch (err) {
      console.error("Capsule details error:", err);
    } finally {
      setLoadingMemories(false);
    }
  };

  /* CREATE CAPSULE */
  const [isCreating, setIsCreating] = useState(false);
  const handleCreateCapsule = async () => {
    if (isCreating) return;
    setIsCreating(true);
    try {
      const userId = getUserId();

      const res = await fetch(`${API}/Capsule/create?userId=${userId}`, {
        method: "POST",
      });

      if (!res.ok) throw new Error("Failed to create capsule");

      const data = await res.json();

      sessionStorage.setItem("capsuleId", data.capsuleId);

      navigate("/user/capsuleInputs");
    } catch (err) {
      console.error("Capsule creation failed", err);
      showToast("Creation failed. Is backend running?", "error");
    } finally {
      setIsCreating(false);
    }
  };

  /* TRIGGER DELETE CONFIRMATION */
  const handleDeleteCapsule = (e, capsuleId) => {
    e.stopPropagation();
    setCapsuleToDelete(capsuleId);
    setShowDeleteConfirm(true);
  };

  /* ACTUAL DELETE EXECUTION */
  const confirmDeleteCapsule = async () => {
    if (!capsuleToDelete) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`${API}/Capsule/delete/${capsuleToDelete}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setCapsules((prev) => prev.filter((c) => c.capsuleId !== capsuleToDelete));
        showToast("Capsule deleted successfully!", "success");
      } else {
        showToast("Failed to delete capsule", "error");
      }
    } catch {
      showToast("Server error. Please try again.", "error");
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
      setCapsuleToDelete(null);
    }
  };

  /* TOAST HELPER */
  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3000);
  };

  /* LOGOUT */
  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  /* SIDEBAR BUTTON */
  const NavButton = ({ icon: Icon, label, onClick, active }) => (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition duration-300 group ${active ? "bg-[#117f3b] text-white shadow-lg" : "text-gray-600 hover:bg-green-50 hover:text-[#117f3b]"
        }`}
    >
      <span className={`${active ? "text-white" : "text-[#117f3b] bg-green-100 group-hover:bg-white"} p-2 rounded-full transition duration-300`}>
        <Icon size={20} />
      </span>
      <span className="font-semibold">{label}</span>
    </button>
  );

  return (
    <div className="h-screen flex bg-[#f8fbfa] font-serif overflow-hidden relative">
      {/* MOBILE HEADER */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md border-b border-green-100 flex items-center justify-between px-4 z-50">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-[#9dd1b1] flex items-center justify-center p-1 shadow-md border border-white">
            <img src={logo} alt="logo" className="w-7 h-7 rounded-full bg-[#025622] object-cover" />
          </div>
          <span className="font-serif font-black text-[#025622] text-xs tracking-tight uppercase">Dashboard</span>
        </div>
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 text-[#117f3b] hover:bg-green-50 rounded-xl transition-colors"
        >
          <MdMenu size={28} />
        </button>
      </div>

      {/* MOBILE OVERLAY */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-emerald-950/40 backdrop-blur-sm z-[60] md:hidden"
          />
        )}
      </AnimatePresence>

      {/* SIDEBAR */}
      <motion.aside
        initial={false}
        animate={{
          x: sidebarOpen ? 0 : (window.innerWidth < 768 ? "-100%" : 0),
          transition: { type: "spring", damping: 25, stiffness: 200 }
        }}
        className={`fixed md:relative inset-y-0 left-0 w-72 bg-white shadow-2xl md:shadow-xl p-6 flex flex-col h-full border-r border-green-100 z-[70] md:z-30 overflow-hidden`}
      >
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 rounded-[1.5rem] bg-[#9dd1b1] flex items-center justify-center shrink-0 shadow-lg shadow-green-900/10 border border-white">
              <img src={logo} alt="logo" className="w-11 h-11 rounded-full bg-[#025622] object-contain p-1" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-black text-[#025622] leading-tight tracking-tight uppercase">User</h1>
              <p className="text-[10px] text-[#117f3b] font-bold tracking-widest uppercase opacity-70">Dashboard</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden p-2 hover:bg-green-50 rounded-full transition-colors"
          >
            <MdClose size={24} className="text-[#117f3b]" />
          </button>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-green-200 to-transparent mb-8" />

        <nav className="flex flex-col gap-2">
          <NavButton icon={MdHome} label="Home" onClick={() => navigate("/")} />
          <NavButton icon={MdDashboard} label="Dashboard" active={activeTab === "Dashboard"} onClick={() => { setActiveTab("Dashboard"); setSidebarOpen(false); }} />
          <NavButton
            icon={IoPersonCircle}
            label="My Profile"
            active={activeTab === "Profile"}
            onClick={() => { navigate("/user/profile"); setSidebarOpen(false); }}
          />
          <div className="mt-4 pt-4 border-t border-gray-100">
            <NavButton icon={MdLogout} label="Logout" onClick={handleLogout} />
          </div>
        </nav>

        {/* SIDEBAR FOOTER */}
        <div className="mt-auto pt-6">
          <div className="bg-[#f8fbfa] rounded-[1.8rem] p-4 flex items-center gap-4 border border-green-100/50 shadow-inner">
            <div className="w-10 h-10 rounded-xl bg-[#9dd1b1] flex items-center justify-center overflow-hidden border border-white shadow-sm ring-2 ring-white">
              {profile?.profileImage ? (
                <img src={`/${profile.profileImage}`} alt="P" className="w-full h-full object-cover" />
              ) : (
                <span className="text-lg font-black text-[#025622] uppercase">{profile?.firstName?.charAt(0) || "U"}</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-black text-[#025622] truncate">{profile?.firstName || "User"}</p>
              <p className="text-[10px] font-bold text-[#117f3b] uppercase tracking-widest opacity-60 truncate">Active session</p>
            </div>
          </div>
        </div>
      </motion.aside>

      {/* MAIN */}
      <main className="flex-1 overflow-y-auto flex flex-col relative w-full mt-16 md:mt-0">
        <div className="sticky top-0 bg-[#f8fbfa]/80 backdrop-blur-md z-20 px-4 sm:px-8 py-4 sm:py-6 border-b border-green-100 flex justify-between items-center shadow-sm">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-emerald-950 font-serif leading-tight">
              {greeting}, <span className="text-[#117f3b]">{profile ? profile.firstName : "User"}</span>
            </h2>
            <p className="text-gray-500 text-[10px] sm:text-xs font-bold tracking-wide uppercase opacity-60 mt-0.5 sm:mt-1">Experience your memories through time.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col items-end mr-1">
              <span className="text-xs font-black text-[#025622] leading-none uppercase tracking-tight">Access Token</span>
              <span className="text-[10px] font-bold text-[#117f3b] uppercase tracking-widest opacity-60">Verified User</span>
            </div>
            <div
              onClick={() => navigate("/user/profile")}
              className="group cursor-pointer relative w-10 h-10 sm:w-12 sm:h-12 rounded-[1.2rem] bg-[#9dd1b1] flex items-center justify-center shadow-lg border-2 border-white hover:scale-105 transition-all active:scale-95 overflow-hidden ring-1 ring-[#9dd1b1]/20"
            >
              {profile?.profileImage ? (
                <img src={`/${profile.profileImage}`} alt="profile" className="w-full h-full object-cover" />
              ) : (
                <span className="text-lg sm:text-xl font-black text-[#025622] uppercase">
                  {profile?.firstName?.charAt(0) || "U"}
                </span>
              )}
              <div className="absolute inset-0 bg-emerald-950/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                <MdEdit className="text-white" size={18} />
              </div>
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div className="p-4 sm:p-8">
          {loadingCapsules ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-64 bg-gray-200 rounded-3xl"></div>
              ))}
            </div>
          ) : capsules.length > 0 ? (
            <div className="mb-10">
              <div className="flex justify-between items-end mb-6">
                <h3 className="text-xl font-bold text-[#025622] flex items-center gap-2">
                  <span className="w-2 h-8 bg-[#117f3b] rounded-full"></span>
                  Active Capsules ({capsules.length})
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {capsules.map((capsule, index) => (
                  <motion.div
                    whileHover={{ y: -5 }}
                    key={capsule.capsuleId}
                    onClick={() => openCapsule(capsule)}
                    className="group bg-white rounded-3xl p-1 shadow-lg shadow-green-900/5 cursor-pointer border-2 border-transparent hover:border-[#9dd1b1] transition duration-500"
                  >
                    <div className="bg-[#f8fbfa] rounded-[22px] p-6 h-full flex flex-col">
                      <div className="flex justify-between items-start mb-4">
                        <div className="bg-white p-3 rounded-2xl shadow-sm text-[#117f3b] group-hover:bg-[#117f3b] group-hover:text-white transition duration-500">
                          <FaGift size={24} />
                        </div>
                        <span className="text-[10px] font-bold py-1 px-3 bg-[#e8f5ed] text-[#117f3b] rounded-full ring-1 ring-[#9dd1b1]">
                          ID: #{capsule.capsuleId}
                        </span>
                      </div>

                      <h4 className="text-lg font-bold text-gray-800 mb-1 group-hover:text-[#117f3b] transition duration-500">
                        {capsule.firstName ? `${capsule.firstName}'s Capsule` : `Memory Capsule #${index + 1}`}
                      </h4>

                      <div className="flex items-center gap-2 text-xs text-gray-400 mb-4">
                        <MdCalendarToday size={14} />
                        Created on {new Date(capsule.createdDate).toLocaleDateString("en-IN", { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>

                      <div className="mt-auto space-y-3">
                        {capsule.firstName ? (
                          <div className="bg-white/60 p-3 rounded-2xl border border-green-50">
                            <p className="flex items-center gap-2 text-xs font-bold text-gray-700">
                              <FaUserFriends className="text-[#117f3b]" />
                              {capsule.firstName} {capsule.lastName}
                            </p>
                            <p className="text-[10px] text-gray-400 mt-1 truncate pl-6">
                              {capsule.email}
                            </p>
                          </div>
                        ) : (
                          <div className="bg-gray-100/50 p-3 rounded-2xl border border-dashed border-gray-200">
                            <p className="text-[10px] text-gray-400 italic text-center">No contributor assigned yet</p>
                          </div>
                        )}

                        <div className="pt-2 flex justify-between items-center text-[10px] border-t border-gray-100">
                          <div className="flex items-center gap-1.5 text-gray-500">
                            <MdAccessTime size={14} className="text-orange-400" />
                            <span className="font-bold uppercase tracking-tighter">Unlocks in</span>
                          </div>
                          <span className="font-black text-gray-700 bg-orange-50 px-2 py-0.5 rounded">
                            {getCountdown(capsule.unlockDate, capsule.unlockTime)}
                          </span>
                        </div>
                      </div>

                      <div className="mt-5 pt-4 flex gap-2">
                        <button className="flex-1 bg-[#117f3b] text-white text-[11px] font-bold py-2.5 rounded-xl shadow-md shadow-green-900/20 hover:bg-[#025622] transition">
                          VIEW MEMORIES
                        </button>
                        <button
                          onClick={(e) => handleDeleteCapsule(e, capsule.capsuleId)}
                          className="bg-white text-red-500 p-2.5 rounded-xl border border-red-50 hover:bg-red-50 transition"
                        >
                          <MdDelete size={18} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border-2 border-dashed border-green-100 mb-10">
              <div className="bg-green-50 p-6 rounded-full mb-4">
                <MdFolderOpen size={48} className="text-[#117f3b] opacity-20" />
              </div>
              <h3 className="text-lg font-bold text-gray-800">No capsules found</h3>
              <p className="text-gray-400 text-sm mt-1">Start by creating your first digital memory.</p>
            </div>
          )}

          {/* CREATE BUTTON */}
          <div className="flex justify-center mt-10">
            <motion.button
              whileHover={{ scale: isCreating ? 1 : 1.05 }}
              whileTap={{ scale: isCreating ? 1 : 0.95 }}
              onClick={handleCreateCapsule}
              disabled={isCreating}
              className={`px-10 py-5 ${isCreating ? "bg-gray-400" : "bg-[#117f3b]"} text-white rounded-[28px] shadow-xl shadow-green-900/30 flex items-center gap-4 group transition-colors`}
            >
              <span className={`w-10 h-10 ${isCreating ? "bg-white/50" : "bg-white"} rounded-2xl flex items-center justify-center text-[#117f3b] font-black text-2xl ${isCreating ? "animate-spin" : "group-hover:rotate-90"} transition duration-500`}>
                {isCreating ? "◌" : "+"}
              </span>
              <span className="text-xl font-bold font-serif tracking-tight pr-2">
                {isCreating ? "Creating..." : "Create New Capsule"}
              </span>
            </motion.button>
          </div>
        </div>

        {/* MODAL POPUP */}
        <AnimatePresence>
          {showPopup && (
            <div className="fixed inset-0 bg-[#025622]/40 backdrop-blur-md flex items-center justify-center z-[100] p-4 sm:p-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="bg-white rounded-[40px] shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col relative"
              >
                {/* MODAL HEADER */}
                <div className="p-5 sm:p-8 border-b border-green-50 flex justify-between items-center bg-[#f8fbfa]">
                  <div>
                    <h3 className="text-2xl font-bold text-[#025622]">
                      {selectedCapsule?.firstName ? `${selectedCapsule.firstName}'s Memories` : 'Memory Gallery'}
                    </h3>
                    <p className="text-gray-500 text-sm font-medium">Reliving the moments from ID: #{selectedCapsule?.capsuleId}</p>
                  </div>
                  <button
                    onClick={() => setShowPopup(false)}
                    className="bg-white p-3 rounded-2xl shadow-sm text-gray-400 hover:text-red-500 transition duration-300"
                  >
                    <MdClose size={24} />
                  </button>
                </div>

                {/* MODAL CONTENT */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-8 custom-scrollbar">
                  {loadingMemories ? (
                    <div className="h-64 flex flex-col items-center justify-center">
                      <div className="w-12 h-12 border-4 border-green-100 border-t-[#117f3b] rounded-full animate-spin"></div>
                      <p className="text-gray-400 text-sm font-bold mt-4 animate-pulse">Retrieving Memories...</p>
                    </div>
                  ) : memories.length === 0 ? (
                    <div className="h-64 flex flex-col items-center justify-center text-center px-10">
                      <FaGift size={48} className="text-green-50 mb-4" />
                      <p className="text-gray-800 font-bold italic">This capsule is waiting to be filled.</p>
                      <p className="text-gray-400 text-xs mt-2 font-medium">Add memories to experience the magic of time travel.</p>
                    </div>
                  ) : (
                    <div className="space-y-10">
                      {memories.map((m, index) => (
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          key={m.memoryId || index}
                          className="relative pl-10 border-l-2 border-green-100"
                        >
                          <div className="absolute left-[-11px] top-0 w-5 h-5 bg-[#117f3b] rounded-full ring-4 ring-green-50"></div>

                          <div className="bg-[#f8fbfa] rounded-3xl p-6 shadow-sm border border-green-50">
                            {/* MEDIA HANDLING */}
                            {m.filePath ? (
                              <div className="mb-4 rounded-2xl overflow-hidden shadow-md border-4 border-white">
                                {m.fileType?.startsWith("image") ? (
                                  <img
                                    src={`${API_BASE_URL}/${m.filePath}`}
                                    alt="memory"
                                    className="w-full object-cover max-h-80 hover:scale-105 transition duration-[2s]"
                                  />
                                ) : m.fileType?.startsWith("video") ? (
                                  <video
                                    src={`${API_BASE_URL}/${m.filePath}`}
                                    controls
                                    className="w-full bg-black max-h-80"
                                  />
                                ) : (
                                  <div className="p-8 bg-white flex flex-col items-center gap-3">
                                    <FaFilePdf size={48} className="text-red-500" />
                                    <p className="font-bold text-gray-700">Digital Document</p>
                                    <a
                                      href={`${API_BASE_URL}/${m.filePath}`}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="bg-red-50 text-red-600 px-6 py-2 rounded-xl text-sm font-bold hover:bg-red-600 hover:text-white transition"
                                    >
                                      View PDF File
                                    </a>
                                  </div>
                                )}
                              </div>
                            ) : null}

                            {/* MESSAGE HANDLING */}
                            {m.message && (
                              <div className="relative">
                                <FaQuoteLeft className="text-[#117f3b]/10 absolute -top-2 -left-2" size={32} />
                                <p className="text-[#190E20] text-sm leading-relaxed font-medium pl-6 italic">
                                  "{m.message}"
                                </p>
                              </div>
                            )}

                            {/* MEMORY TYPE ICON */}
                            <div className="mt-4 flex justify-end">
                              <div className="flex items-center gap-1.5 bg-white px-3 py-1 rounded-full shadow-sm ring-1 ring-green-50">
                                {m.fileType?.startsWith("image") ? <FaImage size={12} className="text-blue-500" /> :
                                  m.fileType?.startsWith("video") ? <FaVideo size={12} className="text-purple-500" /> :
                                    m.message ? <FaQuoteLeft size={10} className="text-green-500" /> : null}
                                <span className="text-[10px] font-bold text-gray-500 uppercase">
                                  {m.fileType?.split('/')[1] || (m.message ? 'Note' : 'Memory')}
                                </span>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>

                {/* MODAL FOOTER */}
                <div className="p-6 bg-green-50/50 border-t border-green-50 flex justify-center">
                  <p className="text-[11px] text-[#117f3b] font-bold uppercase tracking-widest bg-white px-5 py-2 rounded-full shadow-sm ring-1 ring-green-100">
                    End of Time Capsule Session
                  </p>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* CUSTOM DELETE CONFIRMATION MODAL */}
        <AnimatePresence>
          {showDeleteConfirm && (
            <div className="fixed inset-0 bg-[#025622]/40 backdrop-blur-sm flex items-center justify-center z-[200] p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white rounded-[32px] p-8 w-full max-w-sm shadow-2xl border border-red-50"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="bg-red-50 p-4 rounded-full mb-4">
                    <MdDelete size={32} className="text-red-500" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Delete Capsule?</h3>
                  <p className="text-gray-500 text-sm mb-8 leading-relaxed">
                    This action cannot be undone. All memories inside this capsule will be permanently lost.
                  </p>
                  <div className="flex gap-3 w-full">
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      disabled={isDeleting}
                      className="flex-1 py-3 px-4 rounded-xl font-bold text-gray-500 hover:bg-gray-50 transition"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={confirmDeleteCapsule}
                      disabled={isDeleting}
                      className="flex-1 py-3 px-4 rounded-xl font-bold bg-red-500 text-white shadow-lg shadow-red-900/20 hover:bg-red-600 transition flex items-center justify-center gap-2"
                    >
                      {isDeleting ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      ) : (
                        "Yes, Delete"
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <PremiumToast
          show={toast.show}
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(prev => ({ ...prev, show: false }))}
        />
      </main>
    </div>
  );
}

export default CreateCapsule;
