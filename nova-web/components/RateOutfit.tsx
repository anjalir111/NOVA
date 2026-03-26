"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, AlertCircle, UploadCloud, Palette, Maximize, TrendingUp, Activity } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { triggerHaptic } from "../utils/haptics";
import MetricRing from "./MetricRing";

const API_URL = "https://nova-backend-uemq.onrender.com";

export default function RateOutfit() {
  const [loading, setLoading] = useState(false);
  const [sysError, setSysError] = useState<string | null>(null);
  const [fitRating, setFitRating] = useState<any>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const processFile = async (file: File) => {
    setPreviewImage(URL.createObjectURL(file));
    setLoading(true); setSysError(null); setFitRating(null);

    const formData = new FormData();
    formData.append("file", file);
    
    try {
      const res = await fetch(`${API_URL}/rate-outfit`, { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || "Neural link severed.");
      setFitRating(data);
      triggerHaptic();
    } catch (err: any) {
      setSysError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles[0]) {
      triggerHaptic();
      processFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'image/*': [] }, multiple: false });

  const getOverallScore = () => {
    if (!fitRating) return "0.0";
    const avg = (fitRating.color_harmony + fitRating.proportions + fitRating.trendiness) / 3;
    return avg.toFixed(1);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-6xl mx-auto space-y-12 pb-24 relative px-4">
      
      <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full blur-[120px] -z-10 transition-colors duration-1000 ${loading ? 'bg-purple-600/20' : fitRating ? 'bg-pink-600/10' : 'bg-transparent'}`} />
      
      <div className="flex flex-col items-center text-center space-y-4">
        <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-white">
          Rate <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Your Fit.</span>
        </h2>
        <p className="text-zinc-400 max-w-xl text-sm md:text-base">Upload a mirror selfie. Our spatial engine will mathematically break down your color harmony, proportions, and modern trendiness.</p>
      </div>

      <AnimatePresence>
        {sysError && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="max-w-md mx-auto bg-red-500/10 border border-red-500/20 text-red-400 px-6 py-4 rounded-2xl flex items-center gap-3 backdrop-blur-md">
            <AlertCircle size={20} /><p className="text-sm font-bold">{sysError}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 flex flex-col">
          <AnimatePresence mode="wait">
            {!previewImage ? (
              <motion.div 
                key="dropzone"
                initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }}
              >
                <div 
                  {...getRootProps()} 
                  className={`outline-none relative overflow-hidden group cursor-pointer rounded-[2.5rem] border-2 border-dashed transition-all duration-500 h-[400px] md:h-[500px] flex flex-col items-center justify-center bg-zinc-950/50 backdrop-blur-xl ${isDragActive ? "border-purple-500 shadow-[0_0_50px_rgba(168,85,247,0.2)]" : "border-white/10 hover:border-white/30"}`}
                >
                  <input {...getInputProps()} />
                  <div className="w-20 h-20 bg-purple-500/10 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <UploadCloud size={32} className="text-purple-400" />
                  </div>
                  <p className="text-2xl font-bold text-white mb-2">Drop fit check here</p>
                  <p className="text-zinc-500 text-sm max-w-[200px] text-center">We securely process and instantly discard your photo.</p>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="image-preview"
                initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
                className="relative h-[400px] md:h-[500px] rounded-[2.5rem] overflow-hidden border border-white/10 bg-black shadow-2xl p-2"
              >
                <img src={previewImage} className={`w-full h-full object-contain rounded-[2rem] transition-all duration-700 ${loading ? "opacity-40 grayscale" : "opacity-100"}`} alt="Outfit Input" />
                
                {loading && (
                  <>
                    <motion.div animate={{ top: ["-10%", "110%", "-10%"] }} transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }} className="absolute left-0 right-0 h-[2px] bg-purple-500 shadow-[0_0_40px_rgba(168,85,247,1)] z-20" />
                    <div className="absolute inset-0 flex items-center justify-center z-30">
                      <div className="bg-black/60 backdrop-blur-md px-6 py-3 rounded-full border border-purple-500/30 flex items-center gap-3 shadow-2xl">
                        <Loader2 className="animate-spin text-purple-400" size={18}/>
                        <span className="text-xs font-mono font-bold text-purple-400 tracking-widest uppercase">Grading Aesthetics...</span>
                      </div>
                    </div>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="lg:col-span-7 flex flex-col justify-center">
          {fitRating && !loading ? (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-zinc-900 border border-white/10 rounded-[2rem] p-8 relative overflow-hidden flex flex-col justify-center shadow-xl">
                  <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-500/20 blur-[50px] rounded-full" />
                  <p className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-2 flex items-center gap-2"><Activity size={16}/> Overall Aesthetic</p>
                  <div className="flex items-baseline gap-2">
                    <motion.h3 
                      initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
                      className="text-7xl font-black text-white"
                    >
                      {getOverallScore()}
                    </motion.h3>
                    <span className="text-3xl text-zinc-600 font-bold">/10</span>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/5 border border-purple-500/20 rounded-[2rem] p-8 flex flex-col justify-center shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-purple-400 to-pink-400" />
                  <p className="text-sm font-bold text-purple-300 uppercase tracking-widest mb-3">Stylist Notes</p>
                  <p className="text-white text-base md:text-lg font-medium leading-relaxed">"{fitRating.feedback}"</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <MetricRing score={fitRating.color_harmony} label="Color Harmony" icon={<Palette size={24} />} colorHex="#60A5FA" delay={0.4} />
                <MetricRing score={fitRating.proportions} label="Proportions" icon={<Maximize size={24} />} colorHex="#A855F7" delay={0.6} />
                <MetricRing score={fitRating.trendiness} label="Trendiness" icon={<TrendingUp size={24} />} colorHex="#F472B6" delay={0.8} />
              </div>

            </motion.div>
          ) : (
            <div className="hidden lg:flex flex-col items-center justify-center h-full border border-dashed border-white/5 rounded-[2.5rem] opacity-30">
              <Activity size={48} className="text-zinc-600 mb-4" />
              <p className="text-zinc-500 font-mono text-sm tracking-widest uppercase">Awaiting Telemetry</p>
            </div>
          )}
        </div>

      </div>
    </motion.div>
  );
}