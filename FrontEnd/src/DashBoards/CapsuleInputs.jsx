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

    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-2 sm:px-4 font-serif font-bold">

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

      <div className="w-full max-w-4xl bg-white rounded-2xl shadow shadow-[#025622] p-3 sm:p-5 md:p-6 flex flex-col">

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b pb-3 mb-4">

          <h1 className="text-base sm:text-lg font-semibold text-[#025622]">
            Virtual Time Capsule
          </h1>

          <button
            onClick={saveCapsule}
            disabled={isSaving}
            className={`self-start sm:self-auto text-sm px-4 py-1.5 ${isSaving ? "bg-gray-300" : "bg-green-200 hover:bg-green-300"} text-[#190E20] rounded-lg shadow transition-colors`}
          >
            {isSaving ? "Saving..." : "Next Memory ➜"}
          </button>

        </div>

        <div className="h-52 sm:h-64 md:h-72 overflow-y-auto bg-green-50 rounded-xl p-2 sm:p-3 shadow-inner mb-4">

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

        <div className="flex flex-wrap items-center gap-2">

          <button
            onClick={handleUploadClick}
            className="p-2 rounded-full bg-green-200 text-[#025622] shadow"
          >
            <Upload size={18} />
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
            className="p-2 rounded-full bg-green-200 text-[#025622] shadow"
          >
            <Video size={18} />
          </button>

          <input
            type="text"
            placeholder="Share your thoughts..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            className="flex-1 min-w-[180px] p-2 rounded-xl border border-[#025622] focus:outline-none focus:ring-2 focus:ring-green-200"
          />

          <button
            onClick={handleSend}
            className="p-2 rounded-full bg-green-200 text-[#025622] shadow"
          >
            <Send size={18} />
          </button>

        </div>

      </div>

    </div>

  );

}