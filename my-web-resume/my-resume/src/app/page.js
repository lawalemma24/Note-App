import AboutSection from "@/app/components/AboutSection";
import Footer from "@/app/components/Footer";
import HeroSection from "@/app/components/HeroSection";
import Navbar from "@/app/components/NavBar";
import ProjectsSection from "@/app/components/ProjectSection";
import Image from "next/image";
import EmailSection from "./components/EmailSection";
import AchievementSection from "./components/AchievementSection";

export default function Home() {
  return (
   <main className="flex min-h-screen flex-col bg-[#121212]">
    <Navbar />
    <div className="container  mx-auto px-12" >
      <HeroSection />
      <AchievementSection />
      <AboutSection />
      <ProjectsSection />
      <EmailSection />

    </div>
    <Footer />
   </main>
    
  );
}
