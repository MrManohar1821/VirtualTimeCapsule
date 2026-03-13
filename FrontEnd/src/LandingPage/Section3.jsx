import React from "react";
import { ArrowRight } from "lucide-react";
import { FaPencil } from "react-icons/fa6";
import { FaUsers } from "react-icons/fa";
import { MdMailLock } from "react-icons/md";

import image1 from "../assets/image1.png";
import image2 from "../assets/image2.png";
import image3 from "../assets/image3.png";

import birthday from "../assets/birthday.png";
import graduation from "../assets/graduction.png";
import wedding from "../assets/wedding.png";
import family from "../assets/familyt.png";
import milestone from "../assets/milestone.png";
import wisdom from "../assets/wisdom.png";
import { useNavigate } from "react-router-dom";

export default function Section3() {
  const navigate = useNavigate();
  const steps = [
    {
      id: 1,
      title: "Create Your Capsule",
      description:
        "Record a message or upload photos, videos, and heartfelt messages into your digital time capsule.",
      icon: <FaPencil className="w-8 h-8 sm:w-10 sm:h-9 text-[#025622]" />,
      image: image1,
    },
    {
      id: 2,
      title: "Collaborate Together",
      description:
        "Invite friends, siblings, children, or loved ones to add their own memories to build something truly unforgettable.",
      icon: <FaUsers className="w-8 h-8 sm:w-10 sm:h-10 text-[#025622]" />,
      image: image2,
    },
    {
      id: 3,
      title: "Deliver to Loved Ones",
      description:
        "Your recipient will receive a notification when it's time to open your special message, exactly when you intended.",
      icon: <MdMailLock className="w-8 h-8 sm:w-10 sm:h-10 text-[#025622]" />,
      image: image3,
    },
  ];

  const perfectFor = [
    {
      title: "Future Birthdays",
      description:
        "Create special messages for milestone birthdays years in advance, letting your loved ones know you're celebrating with them across time.",
      image: birthday,
    },
    {
      title: "Freshman–Graduation",
      description:
        "Record your pride and encouragement for future academic achievements, preserving the emotions of these pivotal life moments.",
      image: graduation,
    },
    {
      title: "Wedding Anniversaries",
      description:
        "Celebrate the journey of love with memories delivered on future anniversaries, keeping romance alive through the years.",
      image: wedding,
    },
    {
      title: "Family Legacy",
      description:
        "Share family stories, traditions, and wisdom with future generations, creating a bridge between past and future family members.",
      image: family,
    },
    {
      title: "Personal Milestones",
      description:
        "Mark important life achievements with messages from the past, celebrating personal growth and transformation over time.",
      image: milestone,
    },
    {
      title: "Words of Wisdom",
      description:
        "Send support and motivation for future challenges, providing comfort and inspiration when your loved ones need it most.",
      image: wisdom,
    },
  ];

  return (
    <section id="about">
      <div className="bg-[#F2F2F2] pt-12 sm:pt-16 lg:pt-20">

        {/* HOW IT WORKS */}
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-blue-950">
            How It Works
          </h2>

          <p className="text-[#666] mt-3 mb-10 font-serif font-semibold">
            Create digital time capsules to be delivered to your loved ones in the future
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {steps.map((step) => (
              <div
                key={step.id}
                className="relative bg-[#cbe2d4] rounded-2xl p-6 shadow-md hover:shadow-xl transition"
              >
                <div className="absolute -top-2 left-0 bg-[#6dac85] text-[#190E20] w-9 h-9 flex items-center justify-center rounded-full font-serif font-bold">
                  {step.id}
                </div>

                <div className="mb-4 mt-6 flex justify-center">
                  {step.icon}
                </div>

                <h3 className="text-lg font-serif font-bold text-[#190E20] mb-2">
                  {step.title}
                </h3>

                <p className="text-sm font-serif font-semibold text-gray-600 mb-4">
                  {step.description}
                </p>

                <img
                  src={step.image}
                  alt={step.title}
                  className="w-full rounded-lg hover:scale-105 transition"
                />
              </div>
            ))}
          </div>

          <div className="mt-10 flex justify-center">
            <button onClick={() => navigate("/login")} className="bg-[#a6e0bc] text-[#043f1b] font-semibold font-serif px-6 py-3 rounded-md flex items-center gap-2 hover:bg-[#3d6778] hover:text-white transition">
              Ready to Start Your Journey?
              <ArrowRight className="w-5 h-5 text-[#190E20] font-bold" />
            </button>
          </div>
        </div>

        {/* PERFECT FOR */}
        <div className="py-16">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-serif font-bold text-blue-950">
              Perfect For
            </h2>

            <p className="text-gray-600 mt-2 mb-10 font-serif font-semibold">
              Virtual Time Capsules can be used for many memorable occasions
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {perfectFor.map((item, idx) => (
                <div
                  key={idx}
                  className="relative rounded-xl overflow-hidden shadow-md group"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-60 w-full object-cover group-hover:scale-105 transition"
                  />
                  <div className="absolute inset-0 bg-black/40" />
                  <div className="absolute bottom-4 left-4 right-4 text-white text-left">
                    <h3 className="font-bold text-lg">{item.title}</h3>
                    <p className="text-sm mt-1">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 flex justify-center">
              <button onClick={() => navigate("/login")}  className="bg-[#cfe3d7] lg:hover:cursor-pointer text-[#0b662e] font-serif font-bold px-6 py-3 rounded-md flex items-center gap-2 hover:bg-[#3d6778] hover:text-white transition">
                Find Your Perfect Moment
                <ArrowRight className="w-5 h-5 text-[#190E20] font-bold" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
