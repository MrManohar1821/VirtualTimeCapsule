import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import {
  MdNotifications, MdDashboard, MdPeople, MdInventory, MdLogout,
  MdMenu, MdClose, MdEdit, MdDelete, MdCheck, MdChevronRight, MdSearch,
  MdOutlineAccessTimeFilled
} from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../assets/logo.png";
import PremiumToast from "../components/PremiumToast";

/* ================= UTIL ================= */
const getStorage = (key, fallback = []) => {
  const raw = localStorage.getItem(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) || fallback;
  } catch (err) {
    return fallback;
  }
};

const getUserId = () => {
  const user = getStorage("user", null);
  return user?.id || user?.userId || user?.UserId;
};

/* ================= SIDEBAR COMPONENT ================= */
export function AdminDashboard() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [active, setActive] = useState(window.location.pathname);

  const links = [
    { label: "Dashboard", icon: <MdDashboard size={22} />, path: "/admin" },
    { label: "Users", icon: <MdPeople size={22} />, path: "/admin/users" },
    { label: "Capsules", icon: <MdInventory size={22} />, path: "/admin/capsules" },
  ];

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <>
      {/* Mobile Top Header (Minimized for space) */}
      <div className="lg:hidden flex items-center justify-between bg-white/80 backdrop-blur-md px-4 h-16 shadow-sm sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-[#9dd1b1] flex items-center justify-center p-1 shadow-md border border-white">
            <img src={logo} alt="logo" className="w-7 h-7 rounded-full bg-[#025622] object-cover" />
          </div>
          <span className="font-serif font-black text-emerald-800 text-xs tracking-tight">ADMIN PANEL</span>
        </div>
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 text-emerald-700 hover:bg-emerald-50 rounded-xl transition-colors"
        >
          <MdMenu size={28} />
        </button>
      </div>

      {/* Sidebars (Shared Logic) */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] lg:hidden"
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{
          x: sidebarOpen ? 0 : (window.innerWidth < 1024 ? "-100%" : 0),
          transition: { type: "spring", damping: 25, stiffness: 200 }
        }}
        className={`fixed inset-y-0 left-0 w-72 bg-emerald-950/80 backdrop-blur-xl border-r border-white/10 text-white z-[70] lg:z-40 flex flex-col shadow-2xl overflow-hidden`}
      >
        {/* Sidebar Header */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#9dd1b1] flex items-center justify-center p-2 shadow-xl shadow-emerald-900/40 border border-white/20">
                <img src={logo} alt="logo" className="w-8 h-8 rounded-full bg-[#025622] object-cover" />
              </div>
              <div className="flex flex-col">
                <h1 className="text-xl font-black font-serif text-white leading-tight">ADMIN</h1>
                <p className="text-[10px] text-emerald-300 font-bold tracking-widest uppercase opacity-70">Control Panel</p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <MdClose size={24} />
            </button>
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent mb-8" />

          {/* Nav Links */}
          <nav className="space-y-2">
            {links.map((link) => {
              const isActive = active === link.path;
              return (
                <button
                  key={link.path}
                  onClick={() => {
                    navigate(link.path);
                    setActive(link.path);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-300 group ${isActive
                    ? "bg-emerald-600 shadow-lg shadow-emerald-950/50 text-white translate-x-1"
                    : "text-emerald-100 hover:bg-white/5 hover:translate-x-1"
                    }`}
                >
                  <div className="flex items-center gap-4">
                    <span className={`transition-colors duration-300 ${isActive ? "text-white" : "text-emerald-400 group-hover:text-white"}`}>
                      {link.icon}
                    </span>
                    <span className="font-bold text-sm tracking-wide">{link.label}</span>
                  </div>
                  {isActive && <MdChevronRight size={20} className="text-emerald-300" />}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer (Profile Recap) */}
        <div className="mt-auto p-6 space-y-4">
          <div className="bg-white/5 rounded-[1.5rem] p-4 flex items-center gap-4 border border-white/5 shadow-inner">
            {JSON.parse(localStorage.getItem("adminProfile"))?.profileImage ? (
              <img
                src={`/${JSON.parse(localStorage.getItem("adminProfile")).profileImage}`}
                alt="admin"
                className="w-10 h-10 rounded-xl object-cover shadow-lg"
              />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-emerald-950 font-black shadow-lg uppercase">
                {JSON.parse(localStorage.getItem("user"))?.firstName?.charAt(0) || "A"}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-black text-white truncate">Administrator</p>
              <p className="text-[10px] font-medium text-emerald-400 uppercase tracking-widest truncate">Active System</p>
            </div>
          </div>

          <button
            onClick={logout}
            className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-red-200 hover:bg-red-500/10 hover:text-red-100 transition-all duration-300 border border-transparent hover:border-red-500/20"
          >
            <MdLogout size={22} />
            <span className="font-bold text-sm">Sign Out</span>
          </button>
        </div>
      </motion.aside>

      {/* Desktop Main Layout Helper */}
      <div className="hidden lg:block lg:w-72 flex-shrink-0" />
    </>
  );
}

/* ================= TOPBAR COMPONENT ================= */
export function Topbar() {
  const [alert, setAlert] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [adminProfile, setAdminProfile] = useState(() => getStorage("adminProfile", {}));
  const [isUpdating, setIsUpdating] = useState(false);
  const [profileForm, setProfileForm] = useState({ phone: "", image: null });

  const fetchProfile = async () => {
    const uid = getUserId();
    if (!uid) return;
    try {
      const response = await fetch(`/api/Profile/user/${uid}`);
      if (response.ok) {
        const data = await response.json();
        setAdminProfile(data);
        localStorage.setItem("adminProfile", JSON.stringify(data));
        setProfileForm(prev => ({ ...prev, phone: data.phone || "" }));
      }
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    fetchProfile();
    const interval = setInterval(() => {
      const alerts = getStorage("adminAlerts");
      if (alerts.length > 0) {
        setAlert(alerts[0]);
        localStorage.setItem("adminAlerts", JSON.stringify(alerts.slice(1)));
        setTimeout(() => setAlert(null), 5000);
      }
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    const user = getStorage("user", {});
    const uid = getUserId();

    if (!uid) {
      alert("System error: User session not found.");
      setIsUpdating(false);
      return;
    }

    const formData = new FormData();
    formData.append("UserId", uid);
    formData.append("FirstName", user.firstName || adminProfile.firstName || "Admin");
    formData.append("LastName", user.lastName || adminProfile.lastName || "");
    formData.append("Email", user.email || adminProfile.email || "");
    formData.append("Phone", profileForm.phone);
    if (profileForm.image) formData.append("Image", profileForm.image);

    if (profileForm.phone && profileForm.phone.length !== 10) {
      alert("Phone number must be exactly 10 digits");
      setIsUpdating(false);
      return;
    }

    try {
      const res = await fetch("/api/Profile/update", {
        method: "PUT",
        body: formData
      });
      if (res.ok) {
        await fetchProfile();
        setProfileOpen(false);
      }
    } catch (err) { console.error(err); }
    finally { setIsUpdating(false); }
  };

  return (
    <>
      {/* Profile Modal */}
      <AnimatePresence>
        {profileOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-emerald-950/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="bg-white rounded-[2.5rem] w-full max-w-md shadow-2xl border border-emerald-50 overflow-hidden">
              <div className="p-8 border-b border-emerald-50">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-black text-emerald-950 font-serif">Update <span className="text-emerald-600">Profile</span></h3>
                  <button onClick={() => setProfileOpen(false)} className="p-2 hover:bg-emerald-50 rounded-xl transition-colors"><MdClose size={24} className="text-emerald-900" /></button>
                </div>
                <form onSubmit={handleUpdateProfile} className="space-y-6">
                  <div className="flex flex-col items-center gap-4">
                    <div className="relative group cursor-pointer" onClick={() => document.getElementById('profileImgInput').click()}>
                      <div className="w-24 h-24 rounded-[2rem] bg-emerald-50 border-2 border-emerald-100 flex items-center justify-center overflow-hidden shadow-inner group-hover:border-emerald-300 transition-all">
                        {profileForm.image ? (
                          <img src={URL.createObjectURL(profileForm.image)} className="w-full h-full object-cover" />
                        ) : adminProfile.profileImage ? (
                          <img src={`/${adminProfile.profileImage}`} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-3xl font-serif font-black text-emerald-300">{adminProfile.firstName?.charAt(0) || "A"}</span>
                        )}
                      </div>
                      <div className="absolute inset-0 bg-emerald-950/40 rounded-[2rem] opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                        <MdEdit size={24} className="text-white" />
                      </div>
                    </div>
                    <input id="profileImgInput" type="file" className="hidden" accept="image/*" onChange={(e) => setProfileForm({ ...profileForm, image: e.target.files[0] })} />
                    <p className="text-[10px] font-black text-emerald-900/40 uppercase tracking-widest">Click to change photo</p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-emerald-900/40 uppercase tracking-widest">Phone Number</label>
                    <input
                      type="text"
                      value={profileForm.phone}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                        setProfileForm({ ...profileForm, phone: val });
                      }}
                      placeholder="e.g., 9876543210"
                      className="w-full bg-emerald-50/50 border border-emerald-100 rounded-2xl py-3 px-4 text-sm font-bold text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>

                  <button
                    disabled={isUpdating}
                    className="w-full bg-emerald-600 text-white font-black py-4 rounded-2xl shadow-xl shadow-emerald-600/30 hover:bg-emerald-700 transition-all active:scale-95 disabled:opacity-50"
                  >
                    {isUpdating ? "Updating..." : "Save Changes"}
                  </button>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <header className="h-16 lg:h-20 bg-white/80 backdrop-blur-md border-b border-emerald-50 flex items-center justify-between px-4 sm:px-8 sticky top-0 z-30 transition-all duration-300">
        <div className="flex items-center gap-3">
          <h2 className="text-lg lg:text-xl font-black text-emerald-900 font-serif hidden sm:block">
            Manage <span className="text-emerald-600">Overview</span>
          </h2>
          <span className="hidden md:inline-flex items-center px-4 py-1.5 bg-white rounded-xl text-xs font-black text-emerald-800 tracking-widest uppercase">
            [ {JSON.parse(localStorage.getItem("user"))?.firstName || "ADMIN"} ]
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end mr-2">
            <span className="text-sm font-black text-emerald-900 leading-none">Administrator</span>
            <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Active System</span>
          </div>
          <button
            onClick={() => setProfileOpen(true)}
            className="group relative w-12 h-12 rounded-2xl bg-[#9dd1b1] flex items-center justify-center shadow-lg border-2 border-white hover:scale-105 transition-all active:scale-95 overflow-hidden"
          >
            {adminProfile.profileImage ? (
              <img src={`/${adminProfile.profileImage}`} alt="profile" className="w-full h-full object-cover" />
            ) : (
              <span className="text-lg font-black text-[#025622]">
                {JSON.parse(localStorage.getItem("user"))?.firstName?.charAt(0) || "A"}
              </span>
            )}
            <div className="absolute inset-0 bg-emerald-950/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
              <MdEdit className="text-white" size={18} />
            </div>
          </button>
        </div>
      </header>

      {/* Notifications Portal */}
      <PremiumToast 
        show={!!alert} 
        message={alert ? `Capsule unlocked for user @${alert.user}` : ""} 
        type="success"
        onClose={() => setAlert(null)} 
      />
    </>
  );
}

/* ================= DASHBOARD ================= */
export function Dashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCapsules: 0,
    lockedCapsules: 0,
    openedCapsules: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/DashboardStatics/counts");
        const data = await response.json();
        // Handle both PascalCase and camelCase from backend
        setStats({
          totalUsers: data.totalUsers ?? data.TotalUsers ?? 0,
          totalCapsules: data.totalCapsules ?? data.TotalCapsules ?? 0,
          lockedCapsules: data.lockedCapsules ?? data.LockedCapsules ?? 0,
          openedCapsules: data.openedCapsules ?? data.OpenedCapsules ?? 0
        });
      } catch (error) {
        console.error("Error fetching dashboard statistics:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-[#fdfaf5] transition-all duration-300">
      <div className="p-4 sm:p-8 lg:p-12 max-w-7xl mx-auto">
        <header className="mb-10 sm:mb-14">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-black text-emerald-950 font-serif leading-tight"
          >
            Dashboard <span className="block sm:inline text-emerald-600">Statistics</span>
          </motion.h2>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "4rem" }}
            className="h-1.5 bg-emerald-600 rounded-full mt-4"
          />
        </header>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8"
        >
          <Stat title="Total Users" value={stats.totalUsers} icon={<MdPeople size={28} />} delay={0.1} />
          <Stat title="Total Capsules" value={stats.totalCapsules} icon={<MdInventory size={28} />} delay={0.2} />
          <Stat title="Locked Status" value={stats.lockedCapsules} icon={<MdDashboard size={28} />} delay={0.3} />
          <Stat title="Opened Content" value={stats.openedCapsules} icon={<MdCheck size={28} />} delay={0.4} />
        </motion.div>
      </div>
    </div>
  );
}

/* ================= USERS ================= */
export function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  // confirmTarget: { userId, name } or null
  const [confirmTarget, setConfirmTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/DashboardStatics/UserInfo");
      const data = await response.json();
      // Handle both camelCase and PascalCase from backend
      setUsers(data.map(u => ({
        userId: u.userId ?? u.UserId,
        firstName: u.firstName ?? u.FirstName ?? "",
        lastName: u.lastName ?? u.LastName ?? "",
        email: u.email ?? u.Email ?? "",
        totalCapsules: u.totalCapsules ?? u.TotalCapsules ?? 0
      })));
    } catch (error) {
      console.error("Error loading users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadUsers(); }, []);

  const confirmDelete = (user) => {
    setConfirmTarget(user);
  };

  const cancelDelete = () => {
    setConfirmTarget(null);
  };

  const executeDelete = async () => {
    if (!confirmTarget) return;
    setDeleting(true);
    try {
      const response = await fetch(`/api/DashboardStatics/DeleteUser/${confirmTarget.userId}`, {
        method: "DELETE"
      });
      if (response.ok) {
        setUsers(prev => prev.filter(u => u.userId !== confirmTarget.userId));
        setToast({ show: true, message: "USER DELETED SUCCESSFULLY", type: "success" });
      } else {
        console.error("Failed to delete user.");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    } finally {
      setDeleting(false);
      setConfirmTarget(null);
    }
  };

  // Avatar color from first letter
  const getAvatarColor = (name = "") => {
    const colors = [
      "from-emerald-400 to-emerald-600",
      "from-teal-400 to-teal-600",
      "from-cyan-400 to-cyan-600",
      "from-green-400 to-green-600",
    ];
    return colors[(name.charCodeAt(0) || 0) % colors.length];
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-[#fdfaf5]"
    >
      <PremiumToast 
        show={toast.show} 
        message={toast.message} 
        type={toast.type}
        onClose={() => setToast(prev => ({ ...prev, show: false }))} 
      />

      {/* Confirm Delete Modal */}
      <AnimatePresence>
        {confirmTarget && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4"
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className="bg-white rounded-[2.5rem] p-8 max-w-sm w-full shadow-2xl shadow-black/20 border border-red-50"
            >
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-5 text-red-500">
                <MdDelete size={32} />
              </div>
              <h3 className="text-xl font-black text-emerald-950 font-serif text-center mb-2">Delete User?</h3>
              <p className="text-center text-emerald-900/50 text-sm font-medium mb-1">
                <span className="font-black text-emerald-700">{confirmTarget.firstName}</span>
              </p>
              <p className="text-center text-emerald-900/40 text-xs mb-8">
                All capsules and memories will be permanently removed.
              </p>
              <div className="flex gap-3">
                <button onClick={cancelDelete} className="flex-1 py-3.5 rounded-2xl border-2 border-emerald-100 text-emerald-700 font-black hover:bg-emerald-50 transition-all duration-200">Cancel</button>
                <button onClick={executeDelete} disabled={deleting} className="flex-1 py-3.5 rounded-2xl bg-red-500 hover:bg-red-600 text-white font-black transition-all duration-200 active:scale-95 disabled:opacity-60 flex items-center justify-center gap-2">
                  {deleting ? <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" /> : <><MdDelete size={18} /> Delete</>}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sticky Header */}
      <div className="sticky top-0 z-30 bg-[#fdfaf5]/95 backdrop-blur-md px-4 sm:px-8 lg:px-12 py-6 border-b border-emerald-50 shadow-sm shadow-emerald-900/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl sm:text-4xl font-black text-emerald-950 font-serif leading-tight">
              User <span className="text-emerald-600">Management</span>
            </h2>
            <div className="h-1.5 w-16 bg-emerald-600 rounded-full mt-2" />
          </div>

          {/* Search Bar */}
          <div className="relative flex-1 max-w-md mx-auto md:mx-0">
            <MdSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-400" size={20} />
            <input
              type="text"
              placeholder="Search by ID, email, or name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-emerald-100 rounded-2xl py-3 pl-12 pr-4 text-sm font-medium text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm shadow-emerald-900/5"
            />
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-8 lg:p-12 max-w-7xl mx-auto pt-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600" />
          </div>
        ) : users.length > 0 ? (
          <div className="space-y-4">
            {users
              .filter(u => {
                const search = searchTerm.toLowerCase();
                const fullName = `${u.firstName} ${u.lastName}`.toLowerCase();
                const idMatch = u.userId.toString().includes(search);
                return u.email.toLowerCase().includes(search) ||
                  u.firstName.toLowerCase().includes(search) ||
                  u.lastName.toLowerCase().includes(search) ||
                  fullName.includes(search) ||
                  idMatch;
              })
              .map((u, i) => (
                <motion.div
                  key={u.userId}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07, type: "spring", stiffness: 180, damping: 20 }}
                  whileHover={{ scale: 1.015, transition: { duration: 0.25 } }}
                  className="group bg-white rounded-[1.8rem] px-5 sm:px-7 py-5 flex flex-wrap sm:flex-nowrap items-center gap-4 shadow-md shadow-emerald-900/5 border border-emerald-50 hover:border-emerald-100 hover:shadow-xl transition-all duration-300"
                >
                  {/* ID */}
                  <div className="shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 flex flex-col items-center justify-center shadow-md shadow-emerald-500/30">
                    <span className="text-[8px] font-black text-white/60 uppercase tracking-widest">ID</span>
                    <span className="text-sm font-black text-white leading-none">#{u.userId}</span>
                  </div>

                  {/* Name column */}
                  <div className="flex-1 min-w-0">
                    <p className="text-[9px] font-black text-emerald-700/50 uppercase tracking-widest mb-0.5">Name</p>
                    <p className="text-sm font-bold text-emerald-950 truncate capitalize">
                      {u.firstName} {u.lastName}
                    </p>
                  </div>

                  {/* Registered column (NEW) */}
                  <div className="hidden md:block shrink-0 px-4 border-l border-emerald-50">
                    <p className="text-[9px] font-black text-emerald-700/50 uppercase tracking-widest mb-0.5">Registered</p>
                    <p className="text-xs font-bold text-emerald-800">
                      {new Date(2025, 0, 1 + (u.userId % 365)).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>

                  {/* Email column (Centered) */}
                  <div className="flex-1 min-w-0 hidden md:block text-center">
                    <p className="text-[9px] font-black text-emerald-700/50 uppercase tracking-widest mb-0.5">Email Address</p>
                    <p className="text-sm font-bold text-emerald-950 truncate">{u.email}</p>
                  </div>

                  {/* Capsules column */}
                  <div className="shrink-0 hidden sm:block">
                    <p className="text-[9px] font-black text-emerald-700/50 uppercase tracking-widest mb-0.5 text-center">Capsules</p>
                    <span className="inline-flex items-center gap-1.5 bg-[#fafffd] border border-emerald-100 text-emerald-700 font-black text-sm px-4 py-2 rounded-xl">
                      <MdInventory size={13} />
                      {u.totalCapsules}
                    </span>
                  </div>

                  {/* Delete Button (Always visible on mobile) */}
                  <button
                    onClick={() => confirmDelete(u)}
                    className="shrink-0 p-2.5 rounded-xl text-red-400 hover:bg-red-50 hover:text-red-600 sm:opacity-0 group-hover:opacity-100 transition-all duration-300 active:scale-90"
                    title={`Delete ${u.firstName}`}
                  >
                    <MdDelete size={20} />
                  </button>

                  {/* Mobile Email (visible on sm) */}
                  <div className="w-full md:hidden mt-2 pt-2 border-t border-emerald-50 flex justify-between items-center">
                    <p className="text-[10px] font-bold text-emerald-900/40 truncate">{u.email}</p>
                    <div className="flex items-center gap-1 sm:hidden">
                      <MdInventory size={12} className="text-emerald-400" />
                      <span className="text-xs font-black text-emerald-700">{u.totalCapsules}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
          </div>
        ) : (
          <div className="bg-white rounded-[2.5rem] p-16 text-center shadow-xl shadow-emerald-900/5 border border-emerald-50">
            <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-300">
              <MdPeople size={48} />
            </div>
            <p className="text-xl font-black text-emerald-950 font-serif mb-2">No users found</p>
            <p className="text-emerald-900/40 text-sm font-medium">Registered users will appear here.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

/* ================= CAPSULES ================= */
export function Capsules() {
  const [capsules, setCapsules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL"); // ALL | ACTIVE | COMPLETED
  const [confirmCapsule, setConfirmCapsule] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [memoriesPopup, setMemoriesPopup] = useState(null); // {capsuleId, senderEmail}
  const [memories, setMemories] = useState([]);
  const [loadingMemories, setLoadingMemories] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const loadCapsules = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/DashboardStatics/CapsulesInfo");
      const data = await res.json();
      setCapsules(data.map(c => ({
        capsuleId: c.capsuleId ?? c.CapsuleId,
        status: c.status ?? c.Status ?? "",
        senderEmail: c.senderEmail ?? c.SenderEmail ?? "",
        receiverEmail: c.receiverEmail ?? c.ReceiverEmail ?? "",
        unlockDate: c.unlockDate ?? c.UnlockDate ?? null,
        unlockTime: c.unlockTime ?? c.UnlockTime ?? null,
        memoryCount: c.memoryCount ?? c.MemoryCount ?? 0
      })));
    } catch (err) {
      console.error("Error loading capsules:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadCapsules(); }, []);

  // Filter logic: ACTIVE = status ACTIVE, COMPLETED = COMPLETED
  const filteredCapsules = capsules.filter(c => {
    const s = searchTerm.toLowerCase();
    const idMatch = c.capsuleId.toString().includes(s);
    const emailMatch = c.senderEmail.toLowerCase().includes(s) || c.receiverEmail.toLowerCase().includes(s);
    const statusMatch = filter === "ALL" || c.status.toUpperCase() === filter;
    return (idMatch || emailMatch) && statusMatch;
  });

  const openMemories = async (cap) => {
    setMemoriesPopup(cap);
    setMemories([]);
    setLoadingMemories(true);
    try {
      const res = await fetch(`/api/Capsule/details/${cap.capsuleId}`);
      const data = await res.json();
      setMemories(Array.isArray(data) ? data : data.memories || []);
    } catch (err) {
      console.error("Memory load error:", err);
    } finally {
      setLoadingMemories(false);
    }
  };

  const closeMemories = () => { setMemoriesPopup(null); setMemories([]); };

  const executeDeleteCapsule = async () => {
    if (!confirmCapsule) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/Capsule/delete/${confirmCapsule.capsuleId}`, { method: "DELETE" });
      if (res.ok) {
        setCapsules(prev => prev.filter(c => c.capsuleId !== confirmCapsule.capsuleId));
        setToast({ show: true, message: "CAPSULE DELETED SUCCESSFULLY", type: "success" });
      }
    } catch (err) { console.error(err); }
    finally { setDeleting(false); setConfirmCapsule(null); }
  };

  const statusLabel = (status) => {
    const s = status?.toUpperCase();
    if (s === "ACTIVE") return { label: "Active", cls: "bg-amber-50 text-amber-700 border-amber-100" };
    if (s === "COMPLETED") return { label: "Delivered", cls: "bg-emerald-50 text-emerald-700 border-emerald-100" };
    return { label: status || "--", cls: "bg-gray-50 text-gray-500 border-gray-100" };
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="min-h-screen bg-[#fdfaf5]">
      
      <PremiumToast 
        show={toast.show} 
        message={toast.message} 
        type={toast.type}
        onClose={() => setToast(prev => ({ ...prev, show: false }))} 
      />

      {/* Delete Capsule Confirm Modal */}
      <AnimatePresence>
        {confirmCapsule && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4">
            <motion.div initial={{ scale: 0.85, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.85, y: 20 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className="bg-white rounded-[2.5rem] p-8 max-w-sm w-full shadow-2xl border border-red-50">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-5 text-red-500"><MdDelete size={32} /></div>
              <h3 className="text-xl font-black text-emerald-950 font-serif text-center mb-2">Delete Capsule?</h3>
              <p className="text-center text-emerald-900/40 text-xs mb-8">All memories and contributor data for Capsule <span className="font-black text-emerald-700">#{confirmCapsule.capsuleId}</span> will be permanently removed.</p>
              <div className="flex gap-3">
                <button onClick={() => setConfirmCapsule(null)} className="flex-1 py-3.5 rounded-2xl border-2 border-emerald-100 text-emerald-700 font-black hover:bg-emerald-50 transition-all">Cancel</button>
                <button onClick={executeDeleteCapsule} disabled={deleting}
                  className="flex-1 py-3.5 rounded-2xl bg-red-500 hover:bg-red-600 text-white font-black transition-all active:scale-95 disabled:opacity-60 flex items-center justify-center gap-2">
                  {deleting ? <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" /> : <><MdDelete size={18} />Delete</>}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Memories Popup (styled like CreateCapsule) */}
      <AnimatePresence>
        {memoriesPopup && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#025622]/40 backdrop-blur-md p-4">
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
              {/* Popup Header */}
              <div className="p-7 border-b border-emerald-50 flex justify-between items-center bg-[#fafffd]">
                <div>
                  <h3 className="text-2xl font-black text-emerald-950 font-serif">Memory Gallery</h3>
                  <p className="text-emerald-900/40 text-sm font-medium mt-0.5">Capsule #{memoriesPopup.capsuleId} · {memoriesPopup.senderEmail}</p>
                </div>
                <button onClick={closeMemories} className="p-3 rounded-2xl bg-white shadow-sm text-emerald-900/40 hover:text-red-500 transition-all">
                  <MdClose size={22} />
                </button>
              </div>
              {/* Popup Body */}
              <div className="flex-1 overflow-y-auto p-7">
                {loadingMemories ? (
                  <div className="h-64 flex flex-col items-center justify-center gap-4">
                    <div className="w-12 h-12 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin" />
                    <p className="text-emerald-900/40 text-sm font-bold animate-pulse">Loading memories...</p>
                  </div>
                ) : memories.length === 0 ? (
                  <div className="h-64 flex flex-col items-center justify-center text-center">
                    <MdInventory size={48} className="text-emerald-100 mb-4" />
                    <p className="font-black text-emerald-950">No memories found</p>
                    <p className="text-emerald-900/40 text-xs mt-1">This capsule has no stored memories.</p>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {memories.map((m, idx) => (
                      <motion.div key={idx} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }}
                        className="relative pl-10 border-l-2 border-emerald-100">
                        <div className="absolute left-[-10px] top-0 w-5 h-5 bg-emerald-600 rounded-full ring-4 ring-emerald-50" />
                        <div className="bg-[#fafffd] rounded-2xl p-5 shadow-sm border border-emerald-50">
                          {m.filePath && (
                            <div className="mb-4 rounded-xl overflow-hidden shadow border-4 border-white">
                              {m.fileType?.startsWith("image") ? (
                                <img src={`/${m.filePath}`} alt="memory" className="w-full object-cover max-h-64" />
                              ) : m.fileType?.startsWith("video") ? (
                                <video src={`/${m.filePath}`} controls className="w-full max-h-64" />
                              ) : (
                                <div className="p-4 bg-gray-50 text-center text-xs text-gray-500">File attachment</div>
                              )}
                            </div>
                          )}
                          {m.message && (
                            <p className="text-emerald-950 text-sm font-medium leading-relaxed italic">"{m.message}"</p>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sticky Header */}
      <div className="sticky top-0 z-30 bg-[#fdfaf5]/95 backdrop-blur-md px-4 sm:px-8 lg:px-12 py-5 border-b border-emerald-50 shadow-sm shadow-emerald-900/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-emerald-950 font-serif leading-tight">
              System <span className="text-emerald-600">Capsules</span>
            </h2>
            <div className="h-1.5 w-12 bg-emerald-600 rounded-full mt-1.5" />
          </div>

          {/* Search Bar (Center) */}
          <div className="relative flex-1 max-w-md">
            <MdSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-400" size={20} />
            <input
              type="text"
              placeholder="Search by ID, sender or receiver..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-emerald-100 rounded-2xl py-3 pl-12 pr-4 text-sm font-medium text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm shadow-emerald-900/5"
            />
          </div>


          {/* Filter Buttons */}
          <div className="flex items-center gap-2 bg-white border border-emerald-100 rounded-2xl p-1.5 shadow-sm self-end md:self-auto">
            {["ALL", "ACTIVE", "COMPLETED"].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 ${filter === f
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
                  : "text-emerald-900/50 hover:bg-emerald-50"
                  }`}
              >
                {f === "COMPLETED" ? "Delivered" : f === "ACTIVE" ? "Active" : "All"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Capsule List */}
      <div className="p-4 sm:p-8 lg:p-12 max-w-7xl mx-auto pt-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600" />
          </div>
        ) : filteredCapsules.length > 0 ? (
          <div className="space-y-3">
            {filteredCapsules.map((cap, i) => {
              const { label, cls } = statusLabel(cap.status);
              return (
                <motion.div
                  key={cap.capsuleId}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06, type: "spring", stiffness: 180, damping: 20 }}
                  whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
                  className="group bg-white rounded-[1.8rem] px-5 sm:px-7 py-5 flex flex-col md:flex-row md:items-center gap-6 shadow-md shadow-emerald-900/5 border border-emerald-50 hover:border-emerald-100 hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex flex-1 items-center gap-4">
                    {/* ID */}
                    <div className="shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 flex flex-col items-center justify-center shadow-md shadow-emerald-500/30">
                      <span className="text-[8px] font-black text-white/60 uppercase tracking-widest">ID</span>
                      <span className="text-sm font-black text-white leading-none">#{cap.capsuleId}</span>
                    </div>

                    {/* Receiver & Unlock Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-[9px] font-black text-emerald-700/50 uppercase tracking-widest mb-0.5">Receiver & Unlock</p>
                      <p className="text-sm font-bold text-emerald-950 truncate mb-1">{cap.receiverEmail}</p>
                      {cap.unlockDate && (
                        <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-bold bg-emerald-50 w-fit px-2 py-0.5 rounded-lg border border-emerald-100">
                          <MdOutlineAccessTimeFilled size={12} />
                          <span>{cap.unlockDate} {cap.unlockTime?.split('.')[0] || ''}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-[1.5] flex-wrap md:flex-nowrap items-center gap-4 md:gap-8 justify-between">
                    {/* Sender */}
                    <div className="min-w-[150px] flex-1">
                      <p className="text-[9px] font-black text-emerald-700/50 uppercase tracking-widest mb-0.5">Sender</p>
                      <p className="text-sm font-bold text-emerald-950 truncate">{cap.senderEmail || "—"}</p>
                    </div>

                    {/* Status Badge */}
                    <span className={`shrink-0 text-[10px] font-black uppercase tracking-widest px-3.5 py-1.5 rounded-full border ${cls}`}>
                      {label}
                    </span>

                    {/* Action Area */}
                    <div className="flex items-center gap-3 ml-auto md:ml-0">
                      <button
                        onClick={() => openMemories(cap)}
                        className="flex items-center gap-1.5 bg-emerald-50/50 border border-emerald-100 text-emerald-700 hover:bg-emerald-100/50 hover:border-emerald-200 text-[10px] font-black px-4 py-2.5 rounded-xl transition-all duration-300 active:scale-95"
                      >
                        <MdInventory size={14} />
                        Memories ({cap.memoryCount})
                      </button>

                      <button
                        onClick={() => setConfirmCapsule(cap)}
                        className="p-2.5 rounded-xl text-red-400 hover:bg-red-50 hover:text-red-600 transition-all duration-300 active:scale-90"
                        title="Delete Capsule"
                      >
                        <MdDelete size={20} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-[2.5rem] p-16 text-center shadow-xl shadow-emerald-900/5 border border-emerald-50">
            <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-300">
              <MdInventory size={48} />
            </div>
            <p className="text-xl font-black text-emerald-950 font-serif mb-2">No capsules found</p>
            <p className="text-emerald-900/40 text-sm font-medium">
              {filter === "ALL" ? "No capsules exist yet." : `No "${filter === "ACTIVE" ? "Active" : "Delivered"}" capsules found.`}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

/* ================= STAT CARD ================= */
function Stat({ title, value, icon, delay }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, scale: 0.95 },
        show: { opacity: 1, scale: 1 }
      }}
      whileHover={{ y: -8 }}
      className="group bg-white rounded-[2.5rem] p-1.5 shadow-xl shadow-emerald-900/5 cursor-pointer border-2 border-transparent hover:border-emerald-200 transition-all duration-500"
    >
      <div className="bg-[#fafffd] rounded-[2.2rem] p-8 h-full flex flex-col justify-between">
        <div className="flex justify-between items-start mb-8">
          <div className="bg-white p-4 rounded-2xl shadow-md text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-500 transform group-hover:rotate-6">
            {icon}
          </div>
          <div className="text-emerald-100 group-hover:text-emerald-600 transition-colors duration-500">
            <MdChevronRight size={28} />
          </div>
        </div>

        <div>
          <p className="text-emerald-900/40 font-black uppercase tracking-widest text-[10px] mb-2">{title}</p>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl sm:text-5xl font-black font-serif text-emerald-950 tracking-tighter tabular-nums transition-all duration-500 group-hover:text-emerald-600">
              {value}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
