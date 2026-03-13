import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { MdNotifications, MdDashboard, MdPeople, MdInventory, MdLogout, MdMenu, MdClose, MdEdit, MdDelete, MdCheck } from "react-icons/md";
import logo from "../assets/logo.png";

/* ================= UTIL ================= */
const getStorage = (key, fallback = []) => {
  const raw = localStorage.getItem(key);
  if (raw === null || raw === undefined) {
    return fallback;
  } 

  try {
    const parsed = JSON.parse(raw);
    return parsed || fallback;  
  } catch (err) {
    console.warn(`getStorage: failed to parse key ${key}`, raw, err);
    return fallback;
  }
};

/* ================= SIDEBAR ================= */
export function AdminDashboard() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [active, setActive] = useState(window.location.pathname);

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const links = [
    { label: "Dashboard", icon: <MdDashboard size={20} />, path: "/admin" },
    { label: "Users", icon: <MdPeople size={20} />, path: "/admin/users" },
    { label: "Capsules", icon: <MdInventory size={20} />, path: "/admin/capsules" },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:w-64 xl:w-72 min-h-screen bg-gradient-to-b from-emerald-700 to-emerald-800 text-white lg:p-4 xl:p-6 font-serif font-bold shadow-2xl flex-col transition-all duration-300 ease-out fixed left-0 top-0 z-40">
        <div className="mb-6 lg:mb-10 flex items-center justify-between gap-2 lg:gap-3 bg-white rounded-lg p-2 lg:p-3 shadow-lg">
          <div className="flex-1 min-w-0">
            <h1 className="text-base lg:text-md xl:text-2xl font-bold text-emerald-700 truncate"> Time Capsule</h1>
          </div>
          <div className="w-12 lg:w-14 h-12 lg:h-14 rounded-full bg-gradient-to-br from-[#9dd1b1] to-[#025622] flex items-center justify-center flex-shrink-0 shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-110">
            <img 
              src={logo} 
              alt="logo" 
              className="w-10 lg:w-12 h-10 lg:h-12 rounded-full object-cover"
            />
          </div>
        </div>
        <ul className="flex flex-col gap-2 lg:gap-3 flex-1">
          {links.map((link) => (
            <li
              key={link.path}
              className={`flex items-center gap-2 lg:gap-3 px-3 lg:px-4 py-2 lg:py-3 rounded-lg cursor-pointer transition-all duration-300 ease-out transform text-sm lg:text-base ${
                active === link.path 
                  ? "bg-emerald-600 shadow-lg lg:scale-105" 
                  : "hover:bg-emerald-600/70 hover:lg:translate-x-1"
              }`}
              onClick={() => {
                navigate(link.path);
                setActive(link.path);
              }}
            >
              <span className="transition-transform duration-300 flex-shrink-0">{link.icon}</span>
              <span className="truncate">{link.label}</span>
            </li>
          ))}
        </ul>
        <button
          onClick={logout}
          className="flex items-center gap-2 lg:gap-3 text-red-200 hover:text-red-100 hover:bg-red-600/20 px-3 lg:px-4 py-2 lg:py-3 rounded-lg cursor-pointer transition-all duration-300 ease-out transform hover:lg:translate-x-1 mt-auto text-sm lg:text-base"
        >
          <MdLogout size={20} /> <span className="truncate">Logout</span>
        </button>
      </aside>

      {/* Desktop Content Offset */}
      <div className="hidden lg:block lg:w-64 xl:w-72" />

      {/* Mobile Hamburger */}
      <div className="lg:hidden fixed top-3 right-3 sm:top-4 sm:right-4 z-50 transition-all duration-300">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 sm:p-3 bg-emerald-700 text-white rounded-lg shadow-lg hover:bg-emerald-800 active:scale-95 transition-all duration-200"
        >
          <MdMenu size={24} />
        </button>
      </div>

      {/* Mobile Sidebar with Smooth Animation (always rendered, toggles classes for smooth transition) */}
      <div className={`mobile-overlay fixed inset-0 z-50 flex justify-start ${sidebarOpen ? 'open' : 'closed'}`}>
        <style>{`
          .mobile-overlay { transition: opacity 280ms ease, visibility 280ms ease; }
          .mobile-overlay.closed { opacity: 0; visibility: hidden; pointer-events: none; }
          .mobile-overlay.open { opacity: 1; visibility: visible; pointer-events: auto; }

          .mobile-backdrop { background: rgba(0,0,0,0.42); backdrop-filter: blur(6px); transition: opacity 280ms ease; }
          .mobile-backdrop.closed { opacity: 0; }
          .mobile-backdrop.open { opacity: 1; }

          .mobile-sidebar { transform: translateX(-100%); transition: transform 320ms cubic-bezier(.2,.9,.2,1); }
          .mobile-sidebar.open { transform: translateX(0); }
        `}</style>

        {/* Backdrop */}
        <div
          className={`fixed inset-0 mobile-backdrop ${sidebarOpen ? 'open' : 'closed'}`}
          onClick={() => setSidebarOpen(false)}
        />

        {/* Sidebar panel */}
        <aside className={`relative bg-gradient-to-b from-emerald-700 to-emerald-800 w-64 sm:w-72 h-full p-4 sm:p-6 flex flex-col text-white shadow-2xl mobile-sidebar ${sidebarOpen ? 'open' : ''}`}>
          <button
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
            className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-white p-1.5 sm:p-2 rounded-full shadow-md transition-all duration-200 active:scale-95 z-50"
          >
            <MdClose size={20} className="text-emerald-700" />
          </button>

          <div className="mb-6 sm:mb-10 mt-4 flex items-center justify-between gap-2 sm:gap-3 bg-white rounded-lg py-3 px-3 sm:py-3 sm:px-4 pr-10 sm:pr-12 shadow-lg">
            <div className="flex-1 min-w-0">
              <h1 className="text-sm sm:text-lg md:text-xl font-bold text-emerald-700 whitespace-normal leading-tight">DIGITAL TIME CAPSULE</h1>
            </div>
            <div className="flex-shrink-0 ml-3 w-12 sm:w-14 h-12 sm:h-14 rounded-full bg-gradient-to-br from-[#9dd1b1] to-[#025622] flex items-center justify-center shadow-md">
              <img 
                src={logo} 
                alt="logo" 
                className="w-10 sm:w-12 h-10 sm:h-12 rounded-full object-cover"
              />
            </div>
          </div>

          <ul className="flex flex-col gap-2 sm:gap-3 flex-1">
            {links.map((link) => (
              <li
                key={link.path}
                className={`flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-lg cursor-pointer transition-all duration-300 ease-out text-sm sm:text-base ${
                  active === link.path 
                    ? "bg-emerald-600 shadow-lg" 
                    : "hover:bg-emerald-600/70"
                }`}
                onClick={() => {
                  navigate(link.path);
                  setActive(link.path);
                  setSidebarOpen(false);
                }}
              >
                <span className="transition-transform duration-300 flex-shrink-0">{link.icon}</span>
                <span className="truncate">{link.label}</span>
              </li>
            ))}
          </ul>

          <button
            onClick={() => {
              logout();
              setSidebarOpen(false);
            }}
            className="flex items-center gap-2 sm:gap-3 text-red-200 hover:text-red-100 hover:bg-red-600/20 px-3 sm:px-4 py-2 sm:py-3 rounded-lg cursor-pointer transition-all duration-300 mt-auto w-full text-sm sm:text-base"
          >
            <MdLogout size={20} /> <span className="truncate">Logout</span>
          </button>
        </aside>
      </div>
    </>
  );
}

/* ================= TOPBAR + ALERT ================= */
export function Topbar() {
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const alerts = getStorage("adminAlerts");
      if (alerts.length > 0) {
        setAlert(alerts[0]);
        localStorage.setItem("adminAlerts", JSON.stringify(alerts.slice(1)));
        setTimeout(() => setAlert(null), 4000);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className="h-14 sm:h-16 lg:h-14 bg-gradient-to-r from-emerald-600 to-emerald-700 shadow-lg flex items-center px-3 sm:px-4 md:px-6 lg:px-8 font-semibold text-white sticky top-0 z-40 transition-all duration-300 lg:ml-0">
        <span className="text-xs sm:text-sm md:text-base lg:text-lg truncate font-serif font-bold">Admin Panel</span>
      </div>

      {/* Alert with Smooth Animation */}
      {alert && (
        <div className="fixed top-16 sm:top-20 md:top-20 lg:top-14 right-2 sm:right-3 md:right-4 lg:right-6 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 rounded-lg shadow-2xl z-50 flex items-center gap-2 transform transition-all duration-300 animate-in slide-in-from-top max-w-xs sm:max-w-sm lg:max-w-md mx-1 sm:mx-2">
          <MdNotifications size={18} className="flex-shrink-0 hidden sm:block" />
          <MdNotifications size={16} className="flex-shrink-0 sm:hidden" />
          <span className="text-xs sm:text-sm lg:text-base line-clamp-2">
            Capsule unlocked for <b>{alert.user}</b>
          </span>
        </div>
      )}
    </>
  );
}

/* ================= DASHBOARD ================= */
export function Dashboard() {
  const users = getStorage("users");
  const capsules = getStorage("capsules");
  const locked = capsules.filter(c => c.status === "Locked").length;
  const opened = capsules.filter(c => c.status === "Opened").length;

  return (
    <div className="min-h-screen pt-14 sm:pt-16  bg-[#f2eee3] transition-all duration-300 lg:ml-0">
      <div className="p-3 sm:p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-emerald-700 mb-4 sm:mb-6 md:mb-8">Dashboard Overview</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 lg:gap-6">
          <Stat title="Users" value={users.length} color="from-green-300 to-green-600" />
          <Stat title="Total Capsules" value={capsules.length} color="from-green-300 to-green-600" />
          <Stat title="Locked" value={locked} color="from-green-300 to-green-600" />
          <Stat title="Opened" value={opened} color="from-green-300 to-green-600" />
        </div>
      </div>
    </div>
  );
}

/* ================= USERS ================= */
export function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editValues, setEditValues] = useState({ firstName: "", lastName: "", email: "" });

  // helpers for editing/deleting
  const saveUsers = (list) => {
    setUsers(list);
    localStorage.setItem("users", JSON.stringify(list));
  };

  const handleDelete = (idx) => {
    if (confirm("Are you sure you want to delete this user?")) {
      const updated = [...users];
      updated.splice(idx, 1);
      saveUsers(updated);
    }
  };

  const startEdit = (idx) => {
    setEditingIndex(idx);
    setEditValues({ ...users[idx] });
  };

  const cancelEdit = () => {
    setEditingIndex(null);
  };

  const applyEdit = () => {
    const updated = [...users];
    updated[editingIndex] = { ...editValues };
    saveUsers(updated);
    setEditingIndex(null);
  };

  const onChangeValue = (field, value) => {
    setEditValues((prev) => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    const loadUsers = () => {
      const raw = localStorage.getItem("users");
      console.log("[Users] raw localStorage users:", raw);
      try {
        const fetchedUsers = getStorage("users", []);
      setUsers(fetchedUsers);
      } catch (error) {
        console.error("Error loading users:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();

    // Listen for storage changes (updates from other tabs/windows)
    const handleStorageChange = () => {
      loadUsers();
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <div className="min-h-screen pt-14 sm:pt-16 lg:pt-20 bg-[#f2eee3] transition-all duration-300 lg:ml-0">
      <div className="p-3 sm:p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
        {/* Header with Count */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6">
          <div className="mb-3 sm:mb-0">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-emerald-700 mb-1 sm:mb-2">Registered Users</h2>
            <p className="text-xs sm:text-sm text-gray-600">Total: <span className="font-bold text-emerald-600">{users.length}</span> users</p>
          </div>
          <div className="hidden sm:flex items-center justify-center w-16 sm:w-20 lg:w-24 h-16 sm:h-20 lg:h-24 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-full shadow-lg flex-shrink-0">
            <span className="text-2xl sm:text-3xl lg:text-4xl font-bold">{users.length}</span>
          </div>
        </div>
        
        {/* Desktop Table View */}
        {users.length > 0 ? (
          <div className="hidden sm:block bg-white shadow-lg rounded-lg overflow-hidden transition-all duration-300 hover:shadow-2xl">
            {/* hide scrollbar permanently */}
            <div className="overflow-x-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              <table className="w-full">
                <thead className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white sticky top-0">
                  <tr>
                    <th className="px-2 sm:px-3 md:px-4 lg:px-6 py-3 md:py-4 text-left font-semibold text-xs sm:text-sm md:text-base">#</th>
                    <th className="px-2 sm:px-3 md:px-4 lg:px-6 py-3 md:py-4 text-left font-semibold text-xs sm:text-sm md:text-base">First Name</th>
                    <th className="px-2 sm:px-3 md:px-4 lg:px-6 py-3 md:py-4 text-left font-semibold text-xs sm:text-sm md:text-base">Last Name</th>
                    <th className="px-2 sm:px-3 md:px-4 lg:px-6 py-3 md:py-4 text-left font-semibold text-xs sm:text-sm md:text-base">Email</th>
                    <th className="px-2 sm:px-3 md:px-4 lg:px-6 py-3 md:py-4 text-center font-semibold text-xs sm:text-sm md:text-base">Edit</th>
                    <th className="px-2 sm:px-3 md:px-4 lg:px-6 py-3 md:py-4 text-center font-semibold text-xs sm:text-sm md:text-base">Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u, i) => (
                    <tr 
                      key={i} 
                      className="border-t border-gray-200 hover:bg-emerald-50 transition-all duration-200 transform hover:translate-x-1 relative"
                    >
                      <td className="px-2 sm:px-3 md:px-4 lg:px-6 py-3 md:py-4 text-slate-700 font-semibold text-xs sm:text-sm md:text-base">{i + 1}</td>
                      <td className="px-2 sm:px-3 md:px-4 lg:px-6 py-3 md:py-4 text-slate-800 font-medium text-xs sm:text-sm md:text-base truncate">
                        {editingIndex === i ? (
                          <span
                            contentEditable
                            suppressContentEditableWarning
                            onBlur={(e) => onChangeValue("firstName", e.currentTarget.textContent || "")}
                            className="inline-block w-full px-2 py-1 border border-gray-300 rounded text-xs sm:text-sm"
                          >
                            {editValues.firstName}
                          </span>
                        ) : (
                          u.firstName
                        )}
                      </td>
                      <td className="px-2 sm:px-3 md:px-4 lg:px-6 py-3 md:py-4 text-slate-800 font-medium text-xs sm:text-sm md:text-base truncate">
                        {editingIndex === i ? (
                          <span
                            contentEditable
                            suppressContentEditableWarning
                            onBlur={(e) => onChangeValue("lastName", e.currentTarget.textContent || "")}
                            className="inline-block w-full px-2 py-1 border border-gray-300 rounded text-xs sm:text-sm"
                          >
                            {editValues.lastName}
                          </span>
                        ) : (
                          u.lastName
                        )}
                      </td>
                      <td className="px-2 sm:px-3 md:px-4 lg:px-6 py-3 md:py-4 text-slate-600 text-xs sm:text-sm md:text-base break-all">
                        {editingIndex === i ? (
                          <span
                            contentEditable
                            suppressContentEditableWarning
                            onBlur={(e) => onChangeValue("email", e.currentTarget.textContent || "")}
                            className="inline-block w-full px-2 py-1 border border-gray-300 rounded text-xs sm:text-sm"
                          >
                            {editValues.email}
                          </span>
                        ) : (
                          u.email
                        )}
                      </td>
                      {/* edit column */}
                      <td className="px-2 sm:px-3 md:px-4 lg:px-6 py-3 md:py-4 text-center">
                        {editingIndex === i ? (
                          <button onClick={applyEdit} className="text-green-500 hover:text-green-700 transition flex flex-col items-center mx-auto">
                            <MdCheck size={16} className="sm:block hidden" />
                            <MdCheck size={14} className="sm:hidden" />
                            <span className="text-xs mt-0.5 hidden sm:block">Save</span>
                          </button>
                        ) : (
                          <button onClick={() => startEdit(i)} className="text-yellow-500 hover:text-yellow-700 transition flex flex-col items-center mx-auto">
                            <MdEdit size={16} className="sm:block hidden" />
                            <MdEdit size={14} className="sm:hidden" />
                          </button>
                        )}
                      </td>
                      {/* delete column */}
                      <td className="px-2 sm:px-3 md:px-4 lg:px-6 py-3 md:py-4 text-center">
                        {editingIndex === i ? (
                          <button onClick={cancelEdit} className="text-gray-500 hover:text-gray-700 transition flex flex-col items-center mx-auto">
                            <MdClose size={16} className="sm:block hidden" />
                            <MdClose size={14} className="sm:hidden" />
                            <span className="text-xs mt-0.5 hidden sm:block">Cancel</span>
                          </button>
                        ) : (
                          <button onClick={() => handleDelete(i)} className="text-red-500 hover:text-red-700 transition flex flex-col items-center mx-auto">
                            <MdDelete size={16} className="sm:block hidden" />
                            <MdDelete size={14} className="sm:hidden" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : null}

        {/* Mobile Card View */}
        {users.length > 0 ? (
          <div className="sm:hidden space-y-3">
            <style>{`
              @keyframes cardAppear {
                from { opacity: 0; transform: translateY(12px) scale(0.995); }
                to   { opacity: 1; transform: translateY(0) scale(1); }
              }
              .card-animate { opacity: 0; animation-name: cardAppear; animation-fill-mode: both; animation-duration: 360ms; animation-timing-function: cubic-bezier(.2,.9,.2,1); }
            `}</style>
            {users.map((u, i) => (
              <div
                key={i}
                className="w-full bg-white p-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 border-l-4 border-emerald-600 card-animate"
                style={{ animationDelay: `${i * 90}ms` }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold bg-emerald-600 text-white px-2 py-1 rounded-full">#{i + 1}</span>
                </div>
                <p className="text-xs text-gray-600 font-semibold mb-1">First Name</p>
                {editingIndex === i ? (
                  <>
                    <span
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) => onChangeValue("firstName", e.currentTarget.textContent || "")}
                      className="inline-block w-full px-2 py-1 border border-gray-300 rounded mb-1 text-xs"
                    >
                      {editValues.firstName}
                    </span>
                    <div className="flex justify-center gap-3 mb-2">
                      <button onClick={applyEdit} className="text-green-500 hover:text-green-700 transition flex flex-col items-center">
                        <MdCheck size={16} />
                        <span className="text-xs">Save</span>
                      </button>
                      <button onClick={cancelEdit} className="text-gray-500 hover:text-gray-700 transition flex flex-col items-center">
                        <MdClose size={16} />
                        <span className="text-xs">Cancel</span>
                      </button>
                    </div>
                  </>
                ) : (
                  <p className="text-sm font-bold text-slate-800 mb-2">{u.firstName}</p>
                )}
                <p className="text-xs text-gray-600 font-semibold mb-1">Last Name</p>
                {editingIndex === i ? (
                  <span
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) => onChangeValue("lastName", e.currentTarget.textContent || "")}
                    className="inline-block w-full px-2 py-1 border border-gray-300 rounded mb-2 text-xs"
                  >
                    {editValues.lastName}
                  </span>
                ) : (
                  <p className="text-sm font-bold text-slate-800 mb-2">{u.lastName}</p>
                )}
                <p className="text-xs text-gray-600 font-semibold mb-1">Email</p>
                {editingIndex === i ? (
                  <span
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) => onChangeValue("email", e.currentTarget.textContent || "")}
                    className="inline-block w-full px-2 py-1 border border-gray-300 rounded mb-2 text-xs"
                  >
                    {editValues.email}
                  </span>
                ) : (
                  <p className="text-xs text-slate-600 break-all mb-2">{u.email}</p>
                )}
                {!editingIndex && (
                  <div className="flex justify-center">
                    <button onClick={() => startEdit(i)} className="text-yellow-500 hover:text-yellow-700 transition flex flex-col items-center mr-3">
                      <MdEdit size={16} />
                      <span className="text-xs">Edit</span>
                    </button>
                    <button onClick={() => handleDelete(i)} className="text-red-500 hover:text-red-700 transition flex flex-col items-center">
                      <MdDelete size={16} />
                      <span className="text-xs">Delete</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : null}

        {/* Empty State */}
        {users.length === 0 && !loading && (
          <div className="bg-white p-4 sm:p-6 md:p-8 rounded-lg shadow-md text-center">
            <p className="text-gray-500 text-base sm:text-lg font-semibold">No users registered yet</p>
            <p className="text-gray-400 text-xs sm:text-sm mt-1 sm:mt-2">Users will appear here once they register</p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="bg-white p-4 sm:p-6 md:p-8 rounded-lg shadow-md text-center">
            <p className="text-gray-500 text-base sm:text-lg">Loading users...</p>
          </div>
        )}

      </div>
    </div>
  );
}

/* ================= CAPSULES ================= */
export function Capsules() {
  const [capsules, setCapsules] = useState([]);

  useEffect(() => {
    setCapsules(getStorage("capsules"));

    const interval = setInterval(() => {
      const now = new Date();
      let updated = getStorage("capsules");
      let alerts = getStorage("adminAlerts");

      updated = updated.map(c => {
        if (c.status === "Locked" && new Date(c.unlockAt) <= now) {
          alerts.push({ user: c.user });
          return { ...c, status: "Opened" };
        }
        return c;
      });

      localStorage.setItem("capsules", JSON.stringify(updated));
      localStorage.setItem("adminAlerts", JSON.stringify(alerts));
      setCapsules(updated);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen pt-14 sm:pt-16 lg:pt-20 bg-[#f2eee3] transition-all duration-300 lg:ml-0">
      <div className="p-3 sm:p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-emerald-700 mb-4 sm:mb-6">Capsules</h2>

        {/* Desktop Table View */}
        <div className="hidden sm:block bg-white shadow-lg rounded-lg overflow-hidden transition-all duration-300 hover:shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white sticky top-0">
                <tr>
                  <th className="px-2 sm:px-3 md:px-4 lg:px-6 py-3 md:py-4 text-left font-semibold text-xs sm:text-sm md:text-base">ID</th>
                  <th className="px-2 sm:px-3 md:px-4 lg:px-6 py-3 md:py-4 text-left font-semibold text-xs sm:text-sm md:text-base">User</th>
                  <th className="px-2 sm:px-3 md:px-4 lg:px-6 py-3 md:py-4 text-left font-semibold text-xs sm:text-sm md:text-base">Unlock Date</th>
                  <th className="px-2 sm:px-3 md:px-4 lg:px-6 py-3 md:py-4 text-left font-semibold text-xs sm:text-sm md:text-base">Unlock Time</th>
                  <th className="px-2 sm:px-3 md:px-4 lg:px-6 py-3 md:py-4 text-left font-semibold text-xs sm:text-sm md:text-base">Status</th>
                </tr>
              </thead>
              <tbody>
                {capsules.map(c => {
                  const unlockDate = new Date(c.unlockAt);
                  return (
                    <tr 
                      key={c.id} 
                      className="border-t border-gray-200 hover:bg-emerald-50 transition-colors duration-200 transform hover:translate-x-1"
                    >
                      <td className="px-2 sm:px-3 md:px-4 lg:px-6 py-3 md:py-4 text-slate-800 font-medium text-xs sm:text-sm md:text-base truncate">{c.id}</td>
                      <td className="px-2 sm:px-3 md:px-4 lg:px-6 py-3 md:py-4 text-slate-600 text-xs sm:text-sm md:text-base truncate">{c.user}</td>
                      <td className="px-2 sm:px-3 md:px-4 lg:px-6 py-3 md:py-4 text-slate-600 text-xs sm:text-sm md:text-base">{unlockDate.toLocaleDateString()}</td>
                      <td className="px-2 sm:px-3 md:px-4 lg:px-6 py-3 md:py-4 text-slate-600 text-xs sm:text-sm md:text-base">{unlockDate.toLocaleTimeString()}</td>
                      <td className="px-2 sm:px-3 md:px-4 lg:px-6 py-3 md:py-4">
                        {c.status === "Opened" ? (
                          <span className="inline-block bg-emerald-100 text-emerald-700 px-2 sm:px-3 py-1 rounded-full font-bold text-xs sm:text-sm transition-all duration-300 hover:bg-emerald-200">Opened</span>
                        ) : (
                          <span className="inline-block bg-red-100 text-red-700 px-2 sm:px-3 py-1 rounded-full font-semibold text-xs sm:text-sm transition-all duration-300 hover:bg-red-200">Locked</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile Card View */}
        <div className="sm:hidden space-y-3">
          <style>{`
            @keyframes cardAppear {
              from { opacity: 0; transform: translateY(12px) scale(0.995); }
              to   { opacity: 1; transform: translateY(0) scale(1); }
            }
            .card-animate { opacity: 0; animation-name: cardAppear; animation-fill-mode: both; animation-duration: 360ms; animation-timing-function: cubic-bezier(.2,.9,.2,1); }
          `}</style>
          {capsules.map((c, i) => {
            const unlockDate = new Date(c.unlockAt);
            return (
              <div
                key={c.id}
                className="w-full bg-white p-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 border-l-4 border-emerald-600 card-animate"
                style={{ animationDelay: `${i * 90}ms` }}
              >
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-xs text-gray-600 font-semibold">ID</p>
                    <p className="text-sm font-bold text-slate-800 truncate">{c.id}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 font-semibold">User</p>
                    <p className="text-sm font-bold text-slate-800 truncate">{c.user}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 font-semibold">Date</p>
                    <p className="text-xs text-slate-600">{unlockDate.toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 font-semibold">Time</p>
                    <p className="text-xs text-slate-600">{unlockDate.toLocaleTimeString()}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-gray-600 font-semibold mb-1">Status</p>
                    {c.status === "Opened" ? (
                      <span className="inline-block bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full font-bold text-xs">Opened</span>
                    ) : (
                      <span className="inline-block bg-red-100 text-red-700 px-2 py-1 rounded-full font-semibold text-xs">Locked</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {capsules.length === 0 && (
          <div className="bg-white p-4 sm:p-6 md:p-8 rounded-lg shadow-md text-center">
            <p className="text-gray-500 text-base sm:text-lg">No capsules created yet</p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ================= STAT CARD ================= */
function Stat({ title, value, color = "from-emerald-500 to-emerald-600" }) {
  return (
    <div className={`bg-gradient-to-br ${color} shadow-lg rounded-lg p-3 sm:p-4 md:p-6 text-white text-center border border-opacity-20 border-white hover:shadow-2xl hover:sm:scale-105 transition-all duration-300 transform cursor-default`}>
      <h3 className="text-xs sm:text-sm md:text-base font-semibold opacity-90 mb-1 sm:mb-2">{title}</h3>
      <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold animate-pulse hover:animate-none transition-all duration-300">{value}</p>
    </div>
  );
}
