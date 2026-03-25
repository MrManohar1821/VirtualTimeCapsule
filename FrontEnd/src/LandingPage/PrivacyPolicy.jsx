import React from "react";
import Footer from "./Footer";
import Navbar from "./Navbar";

function PrivacyPolicy() {
  return (
    <>
      <Navbar />
      <div className="bg-[#f2eee3] min-h-screen py-10 md:py-16 px-4 md:px-20 flex justify-center">

        {/* Card */}
        <div className="bg-[#cbe2d4] max-w-4xl w-full p-6 md:p-12 rounded-2xl shadow-sm ring-1 ring-black/5 font-serif">

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-blue-950 mb-3">
            Virtual Time Capsule Privacy Policy
          </h1>

          {/* Effective Date */}
          <p className="text-[#666666] mb-6">
            Effective Date: February 2026
          </p>

          {/* Introduction */}
          <p className="text-slate-700 leading-7 mb-8">
            At <span className="font-semibold text-[#025622]">Virtual Time Capsule ("VTC")</span>,
            we deeply value your trust and are committed to protecting your privacy.
            This Privacy Policy explains what data we collect, how we use it,
            how we protect it, and what rights you have over your information.
          </p>

          <div className="space-y-8 leading-7">

            {/* Section 1 */}
            <div>
              <h2 className="text-xl font-bold text-blue-950 mb-3">
                1. Information We Collect
              </h2>

              <p className="mb-4 text-[#666666]">
                We collect the following categories of information to provide,
                secure, and improve our services:
              </p>

              <p className="font-semibold text-[#025622] mb-2">
                Personal Information:
              </p>

              <ul className="list-disc pl-6 space-y-2 text-slate-700">
                <li>Name, email address, phone number, and mailing address.</li>
                <li>Billing information processed through secure payment providers.</li>
              </ul>

              <p className="font-semibold text-[#025622] mt-4 mb-2">
                Account & Usage Data:
              </p>

              <ul className="list-disc pl-6 space-y-2 text-slate-700">
                <li>Login history, IP address, browser type, device information.</li>
                <li>Interactions with the platform such as capsule creation and uploads.</li>
              </ul>
            </div>

            {/* Section 2 */}
            <div>
              <h2 className="text-xl font-bold text-blue-950 mb-3">
                2. How We Use Your Information
              </h2>

              <p className="text-[#666666]">
                The information we collect helps us operate our platform,
                improve user experience, respond to support requests,
                and maintain the security of our services.
              </p>
            </div>

            {/* Section 3 */}
            <div>
              <h2 className="text-xl font-bold text-blue-950 mb-3">
                3. Data Protection
              </h2>

              <p className="text-[#666666]">
                We implement industry-standard security measures to protect
                your personal data from unauthorized access, misuse,
                alteration, or disclosure.
              </p>
            </div>

            {/* Section 4 */}
            <div>
              <h2 className="text-xl font-bold text-blue-950 mb-3">
                4. Third-Party Services
              </h2>

              <p className="text-[#666666]">
                We rely on trusted third-party services for payment processing,
                analytics, and hosting infrastructure. These providers only
                access information necessary to perform their services securely.
              </p>
            </div>

            {/* Section 5 */}
            <div>
              <h2 className="text-xl font-bold text-blue-950 mb-3">
                5. Changes to This Policy
              </h2>

              <p className="text-[#666666]">
                We may update this Privacy Policy periodically. Any changes
                will be posted on this page with an updated effective date.
              </p>
            </div>

          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default PrivacyPolicy;
