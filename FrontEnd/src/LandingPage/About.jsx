import React from "react";
import Footer from "./Footer";
import Navbar from "./Navbar";
import { BsStars } from "react-icons/bs";
import { TiMicrophoneOutline } from "react-icons/ti";
import { VscWorkspaceTrusted } from "react-icons/vsc";
import { FaRegHeart } from "react-icons/fa";
import { RiGitRepositoryPrivateLine } from "react-icons/ri";
import { FiAward } from "react-icons/fi";



const About = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#cbe2d4] text-gray-800 px-4 md:px-20 py-10 md:py-16">

        {/* Heading */}
        <div className="text-center mb-12">
          <h1 className="font-bold text-blue-800 text-3xl md:text-5xl font-serif leading-tight">
            We built this so that anyone can tell their stories and have their
            <span className="text-4xl md:text-5xl text-[#d08a2e] italic"> legacy live on for generations to come.</span>
          </h1>

          <p className="mt-4 text-gray-900 text-lg md:text-2xl">
            Because life is too short, and one day they'll need your messages more than ever.
          </p>
        </div>

        {/* Mission Section */}
        <div className="flex flex-col items-center gap-4 text-center mt-10">


          <p className="text-gray-400 italic text-lg">
            "What if I'm not there for their graduation?"
          </p>

          <p className="text-gray-400 italic text-lg">
            "What if I never get to say goodbye?"
          </p>

          <p className="text-gray-400 italic text-lg">
            "What if they forget my voice?"
          </p>

        </div>

        {/* Vision */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-green-700 mb-4 font-serif">
            Why We Created This
          </h2>
          <p className=" max-w-2xl mx-auto font-bold mt-4 text-gray-900 text-2xl">
            Every meaningful idea begins with a question. Ours was simple:
            How can we protect the moments that matter most?
            Virtual Time Capsule was created to ensure that love,
            laughter, and legacy can travel safely into the future.
          </p>
        </div>

      </div>
      <div className="min-h-screen px-4 md:px-20 py-10 md:py-16">
        <h2 className="text-3xl md:text-4xl font-serif text-gray-800 mb-4 text-center">
          Our Vision
        </h2>
        <div className="flex justify-center items-center py-6 md:py-10">

          <div className="max-w-3xl bg-[#cbe2d4] rounded-2xl shadow-xl p-6 md:p-12 text-center transition duration-500 hover:shadow-2xl hover:-translate-y-1">

            <p className="text-gray-700 text-lg md:text-2xl leading-relaxed font-medium">
              Our vision is a future where every individual can effortlessly
              pass on their living essence, their voice, wisdom, and stories,
              to loved ones across generations, ensuring no memory is lost to
              time or technological decay.
            </p>

          </div>
        </div>
        <div>
          <div className=" py-16">
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center">

              {/* Item 1 */}
              <div className="flex flex-col items-center space-y-4">
                <div className="text-3xl text-gray-700"><TiMicrophoneOutline /></div>
                <h3 className="text-xl font-semibold text-gray-900">
                  Living Essence
                </h3>
                <p className="text-gray-600">
                  Capture the true spirit of who you are
                </p>
              </div>

              {/* Item 2 */}
              <div className="flex flex-col items-center space-y-4">
                <div className="text-3xl text-gray-700"><BsStars /></div>
                <h3 className="text-xl font-semibold text-gray-900">
                  Timeless Wisdom
                </h3>
                <p className="text-gray-600">
                  Share your knowledge across generations
                </p>
              </div>

              {/* Item 3 */}
              <div className="flex flex-col items-center space-y-4">
                <div className="text-3xl text-gray-700"><FaRegHeart /></div>
                <h3 className="text-xl font-semibold text-gray-900">
                  Lasting Legacy
                </h3>
                <p className="text-gray-600">
                  Ensure memories survive forever
                </p>
              </div>

            </div>
          </div>
        </div>

      </div >
      <div className="bg-[#e6dcc8] py-10 md:py-16 flex flex-col items-center px-4">

        <div className="max-w-4xl w-full bg-gray-100 rounded-2xl p-6 md:p-10 shadow-sm">

          <p className="flex items-center gap-2 text-sm font-semibold text-amber-600 tracking-wide mb-4">
            <VscWorkspaceTrusted className="text-lg" />
            TRUST GUARANTEE
          </p>

          <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4">
            Virtual Time Capsule isn't just storage.
          </h2>

          <p className="text-gray-700 leading-relaxed mb-4">
            A portion of every Legacy Vault is placed into a legally protected
            Trust designed to keep your memories online and deliverable for
            decades — even if we disappear.
          </p>

          <p className="text-amber-600 italic font-medium mb-8">
            Your stories are preserved beyond us.
          </p>
        </div>
        <div className="flex flex-wrap justify-center mt-10 gap-6 text-gray-900 text-sm">

            <div className="flex items-center gap-2">
              <VscWorkspaceTrusted className="text-amber-600 text-lg" />
              Encrypted & Private
            </div>

            <div className="flex items-center gap-2">
              <RiGitRepositoryPrivateLine className="text-amber-600 text-lg" />
              You Control Delivery
            </div>

            <div className="flex items-center gap-2">
              <FiAward className="text-amber-600 text-lg" />
              WCAG-AA Accessible
            </div>

          </div>

          <div className="mt-6 flex justify-center items-center gap-2 text-gray-900 text-sm">
            
            Alzheimer's Association Partner (Pending)
          </div>

      </div>


      {/* Footer */}
      <Footer />
    </>
  );
};

export default About;
