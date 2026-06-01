"use client";
import { motion } from "framer-motion";

interface NavbarProps {
  activeFeature: string;
  setActiveFeature: (feature: string) => void;
}

export default function Navbar({ activeFeature, setActiveFeature }: NavbarProps) {
  return (
    <nav className="w-full max-w-7xl mx-auto px-4 py-6 md:py-8 flex flex-col md:flex-row justify-between items-center gap-5 relative z-50">
      <div className="flex items-center gap-4 cursor-pointer group" onClick={() => setActiveFeature("home")}>
        <div className="relative flex items-center justify-center h-10 w-10 md:h-12 md:w-12">
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-full blur-[10px] opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative h-full w-full bg-black border border-white/20 rounded-full flex items-center justify-center overflow-hidden">
            <motion.div 
              animate={{ rotate: 360 }} 
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }} 
              className="absolute w-[200%] h-[20px] bg-blue-500/40 blur-md" 
            />
            <span className="relative text-white font-black text-lg md:text-xl font-mono">N</span>
          </div>
        </div>
        <h1 className="text-xl md:text-2xl font-black tracking-[0.2em] text-white uppercase">
          NOVA<span className="text-blue-500 font-sans animate-pulse">_</span>
        </h1>
      </div>
      <div className="w-full md:w-auto overflow-x-auto pb-2 md:pb-0 hide-scrollbar flex justify-center md:justify-end">
        <div className="flex gap-1.5 md:gap-2 bg-white/5 border border-white/10 p-1.5 rounded-2xl backdrop-blur-xl shadow-2xl min-w-max">
          {["home", "find-clothes", "rate-outfit"].map((tab) => (
            <button 
              key={tab}
              onClick={() => setActiveFeature(tab)} 
              className={`px-5 py-2.5 md:px-6 rounded-xl text-xs md:text-sm font-bold transition-all relative capitalize tracking-wide whitespace-nowrap ${activeFeature === tab ? "text-white" : "text-zinc-500 hover:text-white"}`}
            >
              {activeFeature === tab && <motion.div layoutId="nav-pill" className="absolute inset-0 bg-white/10 border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] rounded-xl -z-10" />}
              {tab.replace("-", " ")}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
