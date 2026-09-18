import React from "react";
import Navbar from "./shared/Navbar.jsx";
import HeroSection from "./HeroSection.jsx";
import CategoryCarousel from "./CategoryCarousel.jsx";
import LatestJobs from "./LatestJobs";
import Footer from "./shared/Footer.jsx";
import useGetAllJobs from '@/hooks/useGetAllJobs';

const Home = () => {
    useGetAllJobs();
    return (
        <div>
            <Navbar />
            <HeroSection />
            <CategoryCarousel />
            <LatestJobs />
            <Footer />
        </div>
    )
}

export default Home