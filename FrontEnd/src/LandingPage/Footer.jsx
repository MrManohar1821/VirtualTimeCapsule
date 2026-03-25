import React, { useState } from "react";
import { IoShieldOutline } from "react-icons/io5";
import { CiLock, CiSettings } from "react-icons/ci";
import { FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";



const Footer = () => {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    const handleSubscribe = () => {
        if (!email) {
            setMessage("Please enter your email");
            return;
        }

        setMessage("Joined Successfully");
        setEmail("");
    };

    return (
        <>
            <div className="bg-[#f2eee3] font-serif font-bold">

                {/* Top Footer */}
                <div className="p-10 flex flex-col md:flex-row justify-around gap-10">

                    {/* Logo Section */}
                    <div>
                        <h1 className="text-lg md:text-xl text-blue-950">
                            Virtual Time Capsule
                        </h1>

                        <p className="italic text-gray-500 w-64 mt-4">
                            "A Future Surprise That Brings Tears To Their Eyes."
                        </p>

                        <p className="text-gray-500 w-64 mt-4">
                            Preserve moments that matter the most and deliver them to the future.
                        </p>

                        <div className="flex gap-3.5 text-gray-500 mt-4 text-sm">
                            <p className="flex items-center gap-1">
                                <IoShieldOutline /> SSL Secured
                            </p>

                            <p className="flex items-center gap-1">
                                <CiLock size={18} /> Data Encrypted
                            </p>
                        </div>
                    </div>

                    {/* Company */}
                    <div>
                        <h1 className="text-blue-950">Company</h1>

                        <div className="text-gray-400 mt-4 space-y-2 flex flex-col items-start">
                            <button
                                onClick={() => navigate("/about")}
                                className="hover:text-blue-800"
                            >
                                About Us
                            </button>

                            <button className="hover:text-blue-800">
                                Pricing
                            </button>

                            <button
                                onClick={() => navigate("/contact")}
                                className="hover:text-blue-800"
                            >
                                Contact
                            </button>
                        </div>
                    </div>

                    {/* Legal */}
                    <div>
                        <h1 className="text-blue-950">Legal</h1>

                        <div className="text-gray-400 mt-4 space-y-2 flex flex-col items-start">
                            <button
                                onClick={() => navigate("/privacy")}
                                className="hover:text-blue-800"
                            >
                                Privacy
                            </button>

                            <button className="hover:text-blue-800">
                                Terms of Service
                            </button>

                            <button className="hover:text-blue-800">
                                Cookie Policy
                            </button>
                        </div>
                    </div>

                    {/* Community */}
                    <div>
                        <h1 className="text-blue-950">Community</h1>

                        <div className="text-gray-400 mt-4 space-y-3 flex flex-col items-start">
                            <button
                                onClick={() => navigate("/faq")}
                                className="hover:text-blue-800"
                            >
                                FAQ
                            </button>

                            <button className="hover:text-blue-800">
                                Contact Us
                            </button>

                            {/* Subscribe Section */}
                            <div className="space-y-2 mt-3">
                                <h3 className="font-semibold text-blue-950">
                                    Join our community
                                </h3>

                                <div className="flex items-center border border-gray-400 rounded-md overflow-hidden w-56">
                                    <input
                                        type="email"
                                        placeholder="Email"
                                        className="w-full px-3 py-2 text-gray-700 outline-none"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />

                                    <button
                                        className="px-3 text-blue-900 hover:text-blue-600"
                                        onClick={handleSubscribe}
                                    >
                                        <FaArrowRight />
                                    </button>
                                </div>

                                {/* Message */}
                                {message && (
                                    <p className="text-sm text-green-600">
                                        {message}
                                    </p>
                                )}
                            </div>

                        </div>
                    </div>

                </div>

                {/* Bottom Footer */}
                <div className="flex flex-col md:flex-row justify-between items-center p-6 border-t text-gray-400 gap-4">

                    <p>© 2025 Virtual Time Capsule. All rights reserved.</p>

                    <div className="flex flex-wrap gap-6 items-center">
                        <button className="hover:text-blue-800">
                            User Stories
                        </button>

                        <button className="hover:text-blue-800">
                            Inspiration Hub
                        </button>

                        <button className="hover:text-blue-800">
                            Success Stories
                        </button>

                        <button className="rounded-lg px-4 py-2 text-gray-600  font-bold flex items-center gap-1">
                            <CiSettings size={23} /> Privacy Settings
                        </button>
                    </div>

                </div>

            </div>
        </>
    );
};

export default Footer;