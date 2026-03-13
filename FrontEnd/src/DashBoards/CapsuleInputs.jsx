import { useState, useRef, useEffect } from "react";
import { Upload, Video, Send } from "lucide-react";
import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../config";

export default function CapsuleInput() {

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [recording, setRecording] = useState(false);
  const [popupMsg, setPopupMsg] = useState("");
  const [timer, setTimer] = useState(30);
  const [deleteConfirmIndex, setDeleteConfirmIndex] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const fileInputRef = useRef(null);

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

  const showPopup = (msg) => {

    setPopupMsg(msg);

    setTimeout(() => setPopupMsg(""), 2000);

  };

  /* ---------------- Text Message ---------------- */

  const handleSend = () => {

    if (!input.trim()) return;

    setMessages((prev) => [
      ...prev,
      { type: "text", text: input }
    ]);

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

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: true
      });

      chunksRef.current = [];

      const recorder = new MediaRecorder(stream);

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
          { type: "video", file, url }
        ]);

        stream.getTracks().forEach((t) => t.stop());

        setRecording(false);

      };

      recorder.start();

      setRecording(true);

    }
    catch {

      showPopup("Camera access denied!");

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
        type: file.type.startsWith("image")
          ? "image"
          : file.type.startsWith("video")
            ? "video"
            : "pdf",
        file,
        url
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
    if (!capsuleId || capsuleId === "null" || capsuleId === "undefined") {
      showPopup("Capsule ID missing! Try creating again.");
      console.error("Missing capsuleId in sessionStorage");
      return;
    }

    setIsSaving(true);
    try {
      // Parallelize all memory uploads for better performance
      await Promise.all(messages.map(async (msg) => {
        const formData = new FormData();
        formData.append("CapsuleId", capsuleId);

        if (msg.type === "text") {
          formData.append("Message", msg.text);
        }

        if (msg.file) {
          formData.append("File", msg.file);
        }

        return axios.post(
          `${API_BASE_URL}/api/memory/add`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" }
          }
        );
      }));

      navigate("/user/invitecontributer");

    }
    catch (err) {
      console.error("Memory save error", err);
      const errMsg = err.response?.data || err.message || "Failed to save memory";
      showPopup(`Error: ${errMsg}`);
    } finally {
      setIsSaving(false);
    }

  };

  return (

    <div className="min-h-screen bg-[#f8fbfa] flex items-center justify-center p-2 sm:p-4 font-serif font-bold">

      {popupMsg && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-white px-4 py-2 rounded-xl shadow border border-green-200 text-[#190E20] z-50 text-sm">
          {popupMsg}
        </div>
      )}

      {deleteConfirmIndex !== null && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">

          <div className="bg-white p-4 sm:p-5 rounded-2xl shadow w-64 text-center">

            <p className="text-[#190E20] mb-4">
              Confirm to delete?
            </p>

            <div className="flex gap-4 justify-center">

              <button
                onClick={() => {
                  setMessages((prev) =>
                    prev.filter((_, i) => i !== deleteConfirmIndex)
                  );
                  setDeleteConfirmIndex(null);
                }}
                className="px-4 py-2 bg-green-200 hover:bg-green-300 text-[#190E20] rounded-full"
              >
                Yes
              </button>

              <button
                onClick={() => setDeleteConfirmIndex(null)}
                className="px-4 py-2 bg-gray-200 text-[#190E20] rounded-full"
              >
                No
              </button>

            </div>

          </div>

        </div>
      )}

      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-xl shadow-green-900/10 p-4 sm:p-8 flex flex-col border border-green-50">
        <div className="flex items-center justify-between border-b border-green-100 pb-5 mb-6">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-[#9dd1b1] flex items-center justify-center p-1 shadow-sm border border-white">
                <img src="/src/assets/logo.png" alt="logo" className="w-7 h-7 rounded-full bg-[#025622] object-contain" />
             </div>
             <h1 className="text-lg sm:text-xl font-black text-[#025622] tracking-tight uppercase">
               Capsule <span className="text-[#117f3b]">Design</span>
             </h1>
          </div>
          <button
            onClick={saveCapsule}
            disabled={isSaving}
            className={`text-xs sm:text-sm px-6 py-2.5 ${isSaving ? "bg-gray-100 text-gray-400" : "bg-[#117f3b] text-white hover:bg-[#025622] shadow-lg shadow-green-900/20"} rounded-xl transition-all font-black uppercase tracking-widest`}
          >
            {isSaving ? "Saving..." : "Deliver ➜"}
          </button>
        </div>

        <div className="h-64 sm:h-80 md:h-96 overflow-y-auto bg-[#f8fbfa] rounded-[2rem] p-4 sm:p-6 shadow-inner border border-green-50/50 mb-6 custom-scrollbar">

          {messages.map((msg, i) => (

            <div
              key={i}
              className="mb-2 cursor-pointer"
              onClick={() => setDeleteConfirmIndex(i)}
            >

              {msg.type === "text" && (
                <p className="bg-green-200 text-[#190E20] px-3 py-2 rounded-xl max-w-[85%] sm:max-w-[70%] break-words">
                  {msg.text}
                </p>
              )}

              {msg.type === "image" && (
                <img
                  src={msg.url}
                  className="rounded-xl max-h-40 sm:max-h-48 w-full object-cover"
                />
              )}

              {msg.type === "video" && (
                <video
                  src={msg.url}
                  controls
                  className="rounded-xl max-h-40 sm:max-h-48 w-full object-cover"
                />
              )}

              {msg.type === "pdf" && (
                <a
                  href={msg.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#025622] underline font-semibold"
                >
                  View PDF
                </a>
              )}

            </div>

          ))}

        </div>

        {recording && (

          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

            <div className="bg-white p-6 rounded-3xl shadow-2xl text-center w-72">

              <FaUserCircle size={72} className="text-[#025622] mx-auto" />

              <p className="mt-3 text-[#025622] font-semibold">
                {timer}s left
              </p>

              <button
                onClick={stopRecording}
                className="mt-4 px-6 py-2 bg-green-200 hover:bg-green-300 text-[#190E20] rounded-full"
              >
                Stop
              </button>

            </div>

          </div>

        )}

        <div className="flex items-center gap-3 p-2 bg-[#f8fbfa] rounded-2xl border border-green-100 shadow-sm">
          <button
            onClick={handleUploadClick}
            className="p-3 rounded-xl bg-white text-[#117f3b] shadow-sm hover:bg-green-50 transition-colors border border-green-100"
          >
            <Upload size={20} />
          </button>

          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleFileChange}
            accept="image/*,video/*,application/pdf"
          />

          <button
            onClick={startRecording}
            disabled={recording}
            className="p-3 rounded-xl bg-white text-red-500 shadow-sm hover:bg-red-50 transition-colors border border-red-100"
          >
            <Video size={20} />
          </button>

          <input
            type="text"
            placeholder="Write a message to the future..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            className="flex-1 min-w-[150px] p-3 rounded-xl border-none focus:ring-0 bg-transparent placeholder-green-900/20 text-[#025622] font-medium"
          />

          <button
            onClick={handleSend}
            className="p-3 rounded-xl bg-[#117f3b] text-white shadow-md hover:bg-[#025622] transition-colors"
          >
            <Send size={20} />
          </button>
        </div>

      </div>

    </div>

  );

}