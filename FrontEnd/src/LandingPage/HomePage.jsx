import Section1 from "./Section1";
import Section2 from "./Section2";
import Section3 from "./Section3";
import Section4A from "./Section4A";
import Footer from "./Footer";
import Navbar from "./Navbar";
import axios from "axios";
import { useEffect } from "react";
export default function HomePage() {
    

    return (
        <>
            <Navbar />
            <Section1 />
            <Section2 />
            <Section3 />
            <Section4A />
            <Footer />
            
            
        </>
    );
}
