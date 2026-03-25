import React, { useState } from "react";
import Footer from "./Footer";
import Navbar from "./Navbar";
import { FiHelpCircle } from "react-icons/fi";

const FAQ = () => {

  const faqs = [
    {
      question: "What is Virtual Time Capsule?",
      answer:
        "Virtual Time Capsule allows you to store messages, photos, and memories and deliver them to loved ones at a future date."
    },
    {
      question: "How does future delivery work?",
      answer:
        "You choose a delivery date and we securely store your message until that date arrives, then it will be delivered automatically."
    },
    {
      question: "Is my data secure?",
      answer:
        "Yes. We use encrypted storage and secure servers to ensure your memories remain private and protected."
    },
    {
      question: "Can I edit my capsule after creating it?",
      answer:
        "Yes. You can update or edit your capsule anytime before the scheduled delivery date."
    },
    {
      question: "What types of content can I store?",
      answer:
        "You can upload text messages, images, videos, and other meaningful memories for the future."
    }
  ];

  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#f2eee3] py-10 md:py-16 px-4 md:px-20 font-serif">

        {/* Page Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-blue-950 text-center mb-6">
          Frequently Asked Questions
        </h1>

        <p className="text-center text-[#666666] max-w-2xl mx-auto mb-12">
          Everything you need to know about creating and delivering memories
          through Virtual Time Capsule.
        </p>

        {/* FAQ Cards */}
        <div className="max-w-3xl mx-auto space-y-6">

          {faqs.map((faq, index) => (

            <div
              key={index}
              className="bg-[#cbe2d4] rounded-2xl p-4 md:p-6 shadow-sm ring-1 ring-black/5 cursor-pointer transition"
              onClick={() => toggleFAQ(index)}
            >

              {/* Question */}
              <div className="flex justify-between items-center">

                <div className="flex items-center gap-3">
                  <FiHelpCircle className="text-[#025622]" size={22} />

                  <h2 className="text-lg md:text-xl font-semibold text-slate-900">
                    {faq.question}
                  </h2>
                </div>

                <span className="text-2xl text-[#025622] font-bold">
                  {openIndex === index ? "-" : "+"}
                </span>

              </div>

              {/* Answer */}
              {openIndex === index && (
                <p className="text-slate-700 mt-4 leading-relaxed">
                  {faq.answer}
                </p>
              )}

            </div>

          ))}

        </div>

      </div>

      <Footer />
    </>
  );
};

export default FAQ;
