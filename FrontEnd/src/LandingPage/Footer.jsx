import React from 'react'
import { IoShieldOutline } from "react-icons/io5";
import { CiLock } from "react-icons/ci";
import { CiSettings } from "react-icons/ci";

const Footer = () =>{
    return (
        <>
            <div className="bg-[#f2eee3] font-serif font-bold">

                <div className="p-10 flex flex-col md:flex-row justify-around gap-10">


                    <div>
                        <h1 className="font-serif font-bold text-lg md:text-xl text-blue-950">
                            Virtual Time Capsule
                        </h1>
                        <p className="italic text-gray-500 w-65 mt-4">
                            "A Future Surprise That Brings Tears To Their Eyes."
                        </p>
                        <p className="text-gray-500 w-65 mt-4">
                            Preserve moments that matter the most and deliver them to the future.
                        </p>
                        <div className="flex gap-3.5 text-gray-500 w-65 mt-4 text-sm">
                            <p className="flex items-center gap-1">
                                <IoShieldOutline /> SSL Secured
                            </p>
                            <p className="flex items-center gap-1">
                                <CiLock size={18} /> Data Encrypted
                            </p>
                        </div>
                    </div>


                    <div>
                        <h1 className="font-bold text-blue-950">Company</h1>
                        <ul className="text-gray-400 mt-4 space-y-2">
                            <li className='hover:text-blue-800'>About Us</li>
                            <li className='hover:text-blue-800'>Pricing</li>
                            <li className='hover:text-blue-800'>Contact</li>
                        </ul>
                    </div>


                    <div>
                        <h1 className="font-bold text-blue-950">Legal</h1>
                        <ul className="text-gray-400 mt-4 space-y-2">
                            <li className='hover:text-blue-800'>Privacy Policy</li>
                            <li className='hover:text-blue-800'>Terms of Service</li>
                            <li className='hover:text-blue-800'>Cookie Policy</li>
                        </ul>
                    </div>


                    <div>
                        <h1 className="font-bold text-blue-950">Community</h1>
                        <ul className="text-gray-400 mt-4 space-y-2">
                            <li className='hover:text-blue-800'>Help Center</li>
                            <li className='hover:text-blue-800'>FAQ</li>
                            <li className='hover:text-blue-800'>Blog</li>
                            <li className='hover:text-blue-800'>Join Our Community</li>
                        </ul>
                    </div>
                </div>


                <div className="flex flex-col md:flex-row justify-between items-center p-6 border-t text-gray-400 gap-4">
                    <p>© 2025 Virtual Time Capsule. All rights reserved.</p>

                    <div className="flex flex-wrap gap-6 items-center">
                        <button className="hover:text-blue-800">User Stories</button>
                        <button className="hover:text-blue-800">Inspiration Hub</button>
                        <button className="hover:text-blue-800">Success Stories</button>
                        <button className="rounded-lg  px-4 py-2 text-gray-600 font-bold flex  transition">
                            <CiSettings size={23} /> Privacy Settings
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Footer