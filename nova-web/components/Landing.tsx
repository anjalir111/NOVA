"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Scan, Palette } from "lucide-react";
import { triggerHaptic } from "../utils/haptics";
import { useEffect, useState } from "react";

const FashionTerminalCode = () => {
  const [typedCode, setTypedCode] = useState("");
  const codeLines = [
    "> SCANNING OUTFIT TOPOGRAPHY...",
    "> EXTRACTING GARMENT VECTORS",
    "> [color_harmony] : 94.2% (OPTIMAL)",
    "> [style_profile] : MINIMALIST_CHIC",
    "> LOCATING SIMILAR ITEMS IN DATABASE",
    "> READY."
  ];

  useEffect(() => {
    let currentLine = 0;
    const interval = setInterval(() => {
      setTypedCode((prev) => prev + codeLines[currentLine] + "\n");
      currentLine++;
      if (currentLine >= codeLines.length) clearInterval(interval);
    }, 800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="py-3 font-mono text-[10px] md:text-xs text-blue-300/90 whitespace-pre-line leading-relaxed overflow-hidden drop-shadow-md">
      {typedCode}
      <motion.span 
        animate={{ opacity: [0, 1, 0] }} 
        transition={{ duration: 1, repeat: Infinity }}
        className="inline-block w-1.5 h-3 bg-blue-400 ml-1 translate-y-0.5"
      />
    </div>
  );
};

export default function Landing({ onStart }: { onStart: () => void }) {
  const handleStart = () => {
    triggerHaptic();
    onStart();
  };

  return (
    <div className="relative min-h-[85vh] flex flex-col items-center justify-center overflow-hidden pt-4 md:pt-12 px-4">
      <div className="relative w-full max-w-4xl h-[360px] md:h-[400px] flex items-center justify-center mb-8 md:mb-12 perspective-1000 pointer-events-none mt-8 md:mt-0">
        <motion.div
          style={{ willChange: "transform" }}
          animate={{ scale: [1, 1.1, 1], rotateZ: [0, 90, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute w-[250px] h-[250px] md:w-[500px] md:h-[500px] bg-gradient-to-tr from-blue-600/30 to-purple-600/30 rounded-full blur-[80px] md:blur-[100px]"
        />
        <motion.div
          style={{ willChange: "transform", transformStyle: "preserve-3d" }}
          animate={{ y: [-10, 10, -10], rotateZ: [-5, -7, -5] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="hidden md:block absolute left-[15%] w-56 h-80 rounded-3xl overflow-hidden border border-white/10 opacity-60 grayscale-[30%] shadow-2xl z-0"
        >
          <img src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600&auto=format&fit=crop" className="w-full h-full object-cover" alt="Streetwear Fashion" />
        </motion.div>
        <motion.div
          style={{ willChange: "transform", transformStyle: "preserve-3d" }}
          animate={{ y: [10, -10, 10], rotateZ: [5, 7, 5] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="hidden md:block absolute right-[15%] w-56 h-80 rounded-3xl overflow-hidden border border-white/10 opacity-60 grayscale-[30%] shadow-2xl z-0"
        >
          <img src="https://images.unsplash.com/photo-1480455624313-e29b44bbfde1?q=80&w=600&auto=format&fit=crop" className="w-full h-full object-cover" alt="Menswear Fashion" />
        </motion.div>
        <motion.div
          style={{ willChange: "transform", transformStyle: "preserve-3d" }}
          animate={{ y: [-10, 10, -10], rotateX: [2, -2, 2] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="relative w-[280px] h-[340px] md:w-72 md:h-[400px] bg-zinc-900 border border-white/20 rounded-[2rem] shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden z-10 flex flex-col"
        >
          <div className="relative h-1/2 md:h-3/5 w-full">
            <img src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover opacity-90" alt="High Fashion Model" />
            <motion.div
              style={{ willChange: "transform" }}
              animate={{ translateY: ["0px", "200px", "0px"] }} 
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="absolute left-0 right-0 top-0 h-[2px] bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,1)] z-20 pointer-events-none"
            />  
            <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md border border-white/20 px-3 py-1.5 rounded-full flex items-center gap-2">
              <Scan size={12} className="text-white" />
              <span className="text-[9px] font-bold text-white tracking-widest uppercase">Scanning..</span>
            </div>
          </div>
          <div className="flex-grow bg-black/80 backdrop-blur-xl p-4 md:p-5 flex flex-col relative overflow-hidden border-t border-white/10">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:15px_15px] pointer-events-none" />
            <div className="flex items-center gap-3 mb-2 z-10">
              <div className="p-1.5 bg-white/10 rounded-lg text-white"><Palette size={14} /></div>
              <div className="flex gap-1.5">
                <div className="w-4 h-4 rounded-full bg-[#E4D5C7] border border-white/20"></div>
                <div className="w-4 h-4 rounded-full bg-[#1A1A1A] border border-white/20"></div>
                <div className="w-4 h-4 rounded-full bg-[#8E9B90] border border-white/20"></div>
              </div>
            </div>
            
            <div className="z-10 relative">
              <FashionTerminalCode />
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="text-center z-30 flex flex-col items-center mt-2 md:mt-4"
      >
        <div className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full text-zinc-300 text-xs font-bold uppercase tracking-widest shadow-2xl mb-6 backdrop-blur-md">
          <Sparkles size={14} className="text-blue-400 animate-pulse" />
          <span>Smart Styling Matrix</span>
        </div>
        
        <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-[0.9] text-white mb-6">
          The Future of <br/> 
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
            Personal Styling.
          </span>
        </h1>
        
        <p className="text-sm md:text-lg text-zinc-400 max-w-xl mx-auto mb-10 px-2">
          Upload a photo or drop into the scanner. Our multimodal AI extracts your exact demographic vectors to curate a shoppable, hyper-personalized wardrobe.
        </p>

        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleStart}
          className="bg-white text-black px-8 py-4 md:px-10 md:py-5 rounded-2xl font-black text-base md:text-lg shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:shadow-[0_0_60px_rgba(255,255,255,0.4)] transition-shadow flex items-center gap-3 w-full md:w-auto justify-center"
        >
          Initialize Engine <ArrowRight size={20} />
        </motion.button>
      </motion.div>
    </div>
  );
}
