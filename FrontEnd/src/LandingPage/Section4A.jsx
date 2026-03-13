import React, { useState } from "react";
import { FaRegComment, FaHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Section4A = () => {
  const [step, setStep] = useState(1);
  const [selectedRecipient, setSelectedRecipient] = useState("");
  const navigate = useNavigate();
  
  const handleFirstQuestionClick = (recipient) => {
    setSelectedRecipient(recipient);
    setStep(2);
  };

  return (
    <section id="create-capsule">
      <div className="py-10 px-4 bg-[#f9f6f1] font-serif font-bold">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold font-serif text-gray-900">
            The True Gift of Time:{" "}
            <span className="text-[#257d47] font-serif">
              Receiving a Virtual Time Capsule
            </span>
          </h2>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto italic">
            Imagine opening a message from the past, just when you need it most
            <br />
            <span className="text-gray-500">
              "This isn't a file—it's your voice echoing through time."
            </span>
          </p>
        </div>

        {/* Interactive Quiz */}
        <div className="mt-20 max-w-4xl mx-auto bg-[#cbe2d4] rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">
            What Message Will You Send?
          </h2>
          <p className="text-center text-gray-600 mb-6">
            Discover the perfect type of time capsule for your unique story.
          </p>

          {/* STEP 1 */}
          {step === 1 && (
            <>
              <Progress percent="25%" label="Question 1 of 4" />
              <h3 className="text-xl font-semibold text-center mb-6 text-[#06441e]">
                Who do you want to inspire?
              </h3>

              <div className="space-y-4">
                {[
                  ["children", "My children or grandchildren"],
                  ["partner", "My romantic partner"],
                  ["self", "My future self"],
                  ["students", "Students or mentees"],
                ].map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => handleFirstQuestionClick(key)}
                    className="w-full py-3 px-4 text-left border rounded-lg hover:bg-[#6dac85]"
                  >
                    {label}
                  </button>
                ))}
              </div>
            </>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <>
              <Progress percent="50%" label="Question 2 of 4" />

              <h3 className="text-xl font-semibold text-center mb-6 text-[#06441e]">
                Choose your message type
              </h3>

              <div className="space-y-4">
                {[
                  "Life lessons & wisdom",
                  "Love & gratitude",
                  "Memories & stories",
                  "Encouragement for the future",
                ].map((item, i) => (
                  <button
                    key={i}
                    onClick={() => setStep(3)}
                    className="w-full py-3 px-4 border rounded-lg hover:bg-[#6dac85]"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <>
              <Progress percent="75%" label="Question 3 of 4" />

              <h3 className="text-xl font-semibold text-center mb-6 text-[#06441e]">
                When should it be delivered?
              </h3>

              <div className="space-y-4">
                {[
                  "On a special occasion",
                  "When they need encouragement",
                  "A surprise delivery",
                ].map((item, i) => (
                  <button
                    key={i}
                    onClick={() => setStep(4)}
                    className="w-full py-3 px-4 border rounded-lg hover:bg-[#6dac85]"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </>
          )}

          {/* STEP 4 */}
          {step === 4 && (
            <>
              <Progress percent="100%" label="Question 4 of 4" />

              <h3 className="text-xl font-semibold text-center mb-6 text-[#06441e]">
                🎉 Your Time Capsule is ready!
              </h3>

              <div className="text-center">
                <button
                  onClick={() => navigate("/login")}
                  className="bg-[#c18a4d] text-white font-semibold py-3 px-6 rounded-lg hover:bg-[#a8743f] "
                >
                  Create your capsule
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

const Progress = ({ percent, label }) => (
  <div className="mb-6">
    <div className="flex justify-between mb-2 text-sm font-medium">
      <span>{label}</span>
      <span>{percent}</span>
    </div>
    <div className="w-full bg-gray-200 rounded-full h-2.5">
      <div
        className="bg-[#19da63] h-2.5 rounded-full"
        style={{ width: percent }}
      ></div>
    </div>
  </div>
);

export default Section4A;
