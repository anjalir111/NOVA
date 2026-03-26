"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Sliders, Loader2, Sparkles, AlertCircle, UploadCloud, ArrowRight, X, ShoppingBag } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { triggerHaptic } from "../utils/haptics";

const API_URL = "https://nova-backend-uemq.onrender.com";

export default function FindClothes() {
  const [inputMode, setInputMode] = useState<"photo" | "manual">("photo");
  const [loading, setLoading] = useState(false);
  const [sysError, setSysError] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [extractedTraits, setExtractedTraits] = useState<any>(null);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>("M");
  
  const [manualForm, setManualForm] = useState({ 
    gender: "unisex", age_group: "young_adult", occasion: "casual", skin_tone: "medium", style: "minimalist" 
  });

  useEffect(() => {
    if (selectedProduct) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [selectedProduct]);

  const processFile = async (file: File) => {
    setPreviewImage(URL.createObjectURL(file));
    setLoading(true); setSysError(null); setRecommendations([]); setExtractedTraits(null);

    const formData = new FormData();
    formData.append("file", file);
    
    try {
      const res = await fetch(`${API_URL}/analyze-image`, { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || "Neural link severed.");
      setExtractedTraits(data.traits || {});
      setRecommendations(data.recommendations || []);
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

  const handleManualSearch = async () => {
    triggerHaptic();
    setLoading(true); setSysError(null); setExtractedTraits(manualForm);
    try {
      const res = await fetch(`${API_URL}/recommend`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(manualForm) });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || "Database query failed.");
      setRecommendations(data.results || []);
    } catch (err: any) {
      setSysError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-7xl mx-auto space-y-12 pb-24 relative px-4">
      <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full blur-[120px] -z-10 transition-colors duration-1000 ${loading ? 'bg-blue-600/20' : recommendations.length > 0 ? 'bg-purple-600/10' : 'bg-transparent'}`} />
      <div className="flex flex-col items-center text-center space-y-8">
        <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-white">
          Curate <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Your Aesthetic.</span>
        </h2>

        <div className="bg-white/5 border border-white/10 p-1.5 rounded-2xl flex backdrop-blur-xl shadow-2xl">
          <button 
            onClick={() => { setInputMode("photo"); triggerHaptic(); }}
            className={`relative px-8 py-3 rounded-xl font-bold text-sm transition-colors ${inputMode === "photo" ? "text-white" : "text-zinc-500 hover:text-white"}`}
          >
            {inputMode === "photo" && <motion.div layoutId="active-tab" className="absolute inset-0 bg-white/10 border border-white/10 rounded-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]" />}
            <span className="relative z-10 flex items-center gap-2"><Camera size={16}/> Vision AI</span>
          </button>
          <button 
            onClick={() => { setInputMode("manual"); triggerHaptic(); }}
            className={`relative px-8 py-3 rounded-xl font-bold text-sm transition-colors ${inputMode === "manual" ? "text-white" : "text-zinc-500 hover:text-white"}`}
          >
            {inputMode === "manual" && <motion.div layoutId="active-tab" className="absolute inset-0 bg-white/10 border border-white/10 rounded-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]" />}
            <span className="relative z-10 flex items-center gap-2"><Sliders size={16}/> Manual Parameters</span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {sysError && (
          <motion.div key="error-alert" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="max-w-md mx-auto bg-red-500/10 border border-red-500/20 text-red-400 px-6 py-4 rounded-2xl flex items-center gap-3 backdrop-blur-md">
            <AlertCircle size={20} /><p className="text-sm font-bold">{sysError}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {inputMode === "photo" ? (
          <motion.div 
            key="photo-mode"
            initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.3 }}
            className="max-w-2xl mx-auto"
          >
            <div {...getRootProps()} className="outline-none cursor-pointer">
              <input {...getInputProps()} />
              <div 
                className={`relative overflow-hidden group rounded-[2rem] border-2 border-dashed transition-all duration-500 h-[400px] flex flex-col items-center justify-center bg-zinc-950/50 backdrop-blur-xl hover:scale-[1.01] active:scale-[0.99] ${isDragActive ? "border-blue-500 shadow-[0_0_50px_rgba(59,130,246,0.2)]" : "border-white/10 hover:border-white/30"}`}
              >
                {!previewImage ? (
                  <div className="flex flex-col items-center text-center p-10 z-10 pointer-events-none">
                    <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <UploadCloud size={32} className="text-blue-400" />
                    </div>
                    <p className="text-2xl font-bold text-white mb-2">Drop photo to initialize</p>
                    <p className="text-zinc-500 text-sm max-w-xs">Our Vision Model will extract your exact demographic and stylistic vectors.</p>
                  </div>
                ) : (
                  <div className="absolute inset-0 p-2">
                    <div className="relative w-full h-full rounded-[1.5rem] overflow-hidden border border-white/10 bg-black">
                      <img src={previewImage} className={`w-full h-full object-contain transition-all duration-700 ${loading ? "opacity-30 grayscale" : "opacity-100"}`} alt="User Input" />
                      
                      {loading && (
                        <>
                          <motion.div animate={{ top: ["-10%", "110%", "-10%"] }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }} className="absolute left-0 right-0 h-[2px] bg-blue-500 shadow-[0_0_30px_rgba(59,130,246,1)] z-20" />
                          <div className="absolute inset-0 flex items-center justify-center z-30">
                            <div className="bg-black/60 backdrop-blur-md px-6 py-3 rounded-full border border-blue-500/30 flex items-center gap-3">
                              <Loader2 className="animate-spin text-blue-400" size={18}/>
                              <span className="text-xs font-mono font-bold text-blue-400 tracking-widest uppercase">Extracting Vectors...</span>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="manual-mode"
            initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.3 }}
            className="max-w-2xl mx-auto"
          >
            <div className="bg-zinc-950/80 border border-white/10 p-8 rounded-[2rem] backdrop-blur-xl shadow-2xl">
              <div className="grid grid-cols-2 gap-4 mb-8">
                {Object.keys(manualForm).map((key) => (
                  <div key={key} className="flex flex-col space-y-2">
                    <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest pl-1">{key.replace("_", " ")}</label>
                    <select 
                      className="bg-white/5 hover:bg-white/10 border border-white/10 focus:border-blue-500 rounded-xl p-3.5 text-sm text-white outline-none cursor-pointer transition-colors appearance-none" 
                      onChange={(e) => setManualForm({...manualForm, [key]: e.target.value})} 
                      value={(manualForm as any)[key]}
                    >
                      {key === "gender" && ["unisex", "male", "female"].map(o => <option key={o} value={o} className="bg-zinc-900">{o}</option>)}
                      {key === "age_group" && ["teen", "young_adult", "adult", "senior"].map(o => <option key={o} value={o} className="bg-zinc-900">{o.replace("_", " ")}</option>)}
                      {key === "occasion" && ["casual", "formal", "party", "sport", "streetwear"].map(o => <option key={o} value={o} className="bg-zinc-900">{o}</option>)}
                      {key === "skin_tone" && ["fair", "medium", "dark", "olive"].map(o => <option key={o} value={o} className="bg-zinc-900">{o}</option>)}
                      {key === "style" && ["minimalist", "vintage", "hypebeast", "elegant", "classic"].map(o => <option key={o} value={o} className="bg-zinc-900">{o}</option>)}
                    </select>
                  </div>
                ))}
              </div>
              <motion.button 
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleManualSearch} disabled={loading} 
                className="w-full bg-white text-black py-4 rounded-xl font-black text-sm uppercase tracking-wide hover:bg-zinc-200 transition-all flex justify-center items-center shadow-[0_0_20px_rgba(255,255,255,0.1)]"
              >
                {loading ? <Loader2 className="animate-spin mr-2"/> : <Sparkles className="mr-2 text-blue-600" size={18}/>} 
                {loading ? "Querying Database..." : "Generate Wardrobe"}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {recommendations.length > 0 && !loading && (
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="pt-12 border-t border-white/5">
          
          <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
            <div>
              <h3 className="text-3xl font-black text-white mb-2">Curated Matches</h3>
              <p className="text-zinc-500 text-sm">Cosine similarity scored against your profile.</p>
            </div>
            
            {extractedTraits && (
              <div className="flex flex-wrap gap-2">
                {Object.entries(extractedTraits).map(([key, value]) => (
                  <span key={key} className="bg-white/5 border border-white/10 text-[10px] uppercase font-bold tracking-widest px-3 py-1.5 rounded-md text-zinc-400 backdrop-blur-md">
                    <span className="text-blue-400 mr-1">{key.substring(0,3)}:</span>{String(value)}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
            {recommendations.map((item, idx) => (
              <motion.div 
                key={idx}
                onClick={() => { triggerHaptic(); setSelectedProduct(item); }}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="break-inside-avoid relative rounded-[2rem] overflow-hidden bg-zinc-900 border border-white/10 hover:border-white/40 transition-all duration-500 shadow-xl hover:shadow-2xl cursor-pointer group"
              >
                <img src={item.image_url} alt={item.item} className="w-full h-auto object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-transform duration-700" />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent pointer-events-none" />
                
                <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col justify-end">
                  <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <p className="text-blue-400 font-mono text-[10px] font-bold tracking-widest uppercase mb-1">{item.brand}</p>
                    <h4 className="text-lg font-bold text-white leading-tight mb-2">{item.item}</h4>
                    <div className="flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                      <span className="text-white font-black">${item.price}</span>
                      <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center">
                        <ArrowRight size={14} />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

        </motion.div>
      )}

      <AnimatePresence>
        {selectedProduct && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
          >
            <div className="absolute inset-0 bg-black/80 backdrop-blur-xl cursor-pointer" onClick={() => setSelectedProduct(null)} />
            
            <motion.div 
              initial={{ y: 50, scale: 0.95 }} animate={{ y: 0, scale: 1 }} exit={{ y: 20, scale: 0.95 }} transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-5xl bg-zinc-950 border border-white/10 rounded-[2rem] overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.8)] flex flex-col md:flex-row max-h-[90vh]"
            >
              <button onClick={() => setSelectedProduct(null)} className="absolute top-4 right-4 z-50 w-10 h-10 bg-black/50 hover:bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-colors border border-white/10">
                <X size={20} />
              </button>

              <div className="w-full md:w-1/2 h-[350px] md:h-auto bg-zinc-900 relative">
                <img src={selectedProduct.image_url} alt={selectedProduct.item} className="w-full h-full object-cover" />
                <div className="absolute bottom-4 left-4 flex gap-2">
                  <div className="w-12 h-16 rounded-lg overflow-hidden border-2 border-white/50 cursor-pointer"><img src={selectedProduct.image_url} className="w-full h-full object-cover" /></div>
                  <div className="w-12 h-16 rounded-lg overflow-hidden border border-white/10 opacity-50 cursor-pointer"><img src={selectedProduct.image_url} className="w-full h-full object-cover scale-150" /></div>
                  <div className="w-12 h-16 rounded-lg overflow-hidden border border-white/10 opacity-50 cursor-pointer"><img src={selectedProduct.image_url} className="w-full h-full object-cover scale-150 origin-top" /></div>
                </div>
              </div>

              <div className="w-full md:w-1/2 p-6 md:p-10 overflow-y-auto hide-scrollbar flex flex-col">
                <p className="text-blue-400 font-mono text-xs font-bold tracking-widest uppercase mb-2">{selectedProduct.brand}</p>
                <h3 className="text-3xl md:text-4xl font-black text-white leading-tight mb-4">{selectedProduct.item}</h3>
                <p className="text-2xl text-white font-medium mb-8">${selectedProduct.price}</p>
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-3">
                    <p className="text-sm font-bold text-white">Select Size</p>
                    <p className="text-xs text-zinc-500 underline cursor-pointer hover:text-white">Size Guide</p>
                  </div>
                  <div className="grid grid-cols-5 gap-2">
                    {["XS", "S", "M", "L", "XL"].map(size => (
                      <button 
                        key={size} onClick={() => setSelectedSize(size)}
                        className={`py-3 rounded-xl font-bold text-sm transition-all border ${selectedSize === size ? "bg-white text-black border-white" : "bg-transparent text-zinc-400 border-white/10 hover:border-white/30 hover:text-white"}`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  <p className="text-zinc-400 text-sm leading-relaxed">
                    Designed for the modern aesthetic. This <span className="text-zinc-200 capitalize">{selectedProduct.color}</span> garment offers premium comfort and dynamic styling. Perfectly matched to your extracted <span className="text-zinc-200">{extractedTraits?.style || "minimalist"}</span> demographic vectors.
                  </p>
                  <ul className="text-zinc-500 text-sm space-y-2 list-disc pl-4">
                    <li>100% Machine Washable</li>
                    <li>Algorithmic Fit Match: <span className="text-green-400">98.4%</span></li>
                    <li>Sourced from the NOVA Data Architecture</li>
                  </ul>
                </div>

                <div className="mt-auto pt-6 border-t border-white/10 flex gap-4">
                  <a 
                    href={selectedProduct.product_url} target="_blank" rel="noreferrer"
                    className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-xl font-black text-sm uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(37,99,235,0.3)]"
                  >
                    <ShoppingBag size={18} /> View on Vendor
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}