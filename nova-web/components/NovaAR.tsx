"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";
import { Loader2, X } from "lucide-react";

export default function NovaAR({ onClose }: { onClose: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [poseLoaded, setPoseLoaded] = useState(false);
  const [camLoaded, setCamLoaded] = useState(false);

  useEffect(() => {
    if (!poseLoaded || !camLoaded) return;

    const videoElement = videoRef.current;
    const canvasElement = canvasRef.current;
    if (!videoElement || !canvasElement) return;

    const canvasCtx = canvasElement.getContext("2d");
    if (!canvasCtx) return;
    const hoodieImage = new Image();
    hoodieImage.src = "/hoodie.png"; 

    const PoseClass = (window as any).Pose;
    const CameraClass = (window as any).Camera;

    if (!PoseClass || !CameraClass) return;

    const pose = new PoseClass({
      locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
    });

    pose.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      enableSegmentation: false,
      smoothSegmentation: false,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    pose.onResults((results: any) => {
      setIsLoading(false);
      canvasCtx.save();
      canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
      canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);

      if (results.poseLandmarks) {
        const leftShoulder = results.poseLandmarks[11];
        const rightShoulder = results.poseLandmarks[12];
        const leftVis = leftShoulder?.visibility ?? 0;
        const rightVis = rightShoulder?.visibility ?? 0;

        if (leftVis > 0.5 && rightVis > 0.5) {
          
          const shoulderWidth = Math.abs(rightShoulder.x - leftShoulder.x) * canvasElement.width;
          const hoodieWidth = shoulderWidth * 2.8; 
          const aspectRatio = hoodieImage.height / hoodieImage.width;
          const hoodieHeight = hoodieWidth * aspectRatio;
          const centerX = ((leftShoulder.x + rightShoulder.x) / 2) * canvasElement.width;
          const centerY = ((leftShoulder.y + rightShoulder.y) / 2) * canvasElement.height;

          canvasCtx.drawImage(
            hoodieImage,
            centerX - (hoodieWidth / 2),
            centerY - (hoodieHeight * 0.25), 
            hoodieWidth,
            hoodieHeight
          );
        }
      }
      canvasCtx.restore();
    });

    const camera = new CameraClass(videoElement, {
      onFrame: async () => {
        if (videoElement.readyState === 4) { 
          await pose.send({ image: videoElement });
        }
      },
      width: 640,
      height: 480,
    });

    camera.start();

    return () => {
      camera.stop();
      pose.close();
    };
  }, [poseLoaded, camLoaded]);

  return (
    <div className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-xl flex flex-col items-center justify-center p-4">
      <Script src="https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js" onLoad={() => setCamLoaded(true)} />
      <Script src="https://cdn.jsdelivr.net/npm/@mediapipe/pose/pose.js" onLoad={() => setPoseLoaded(true)} />

      <button 
        onClick={onClose} 
        className="absolute top-6 right-6 w-12 h-12 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full flex items-center justify-center text-white transition-all z-50"
      >
        <X size={24} />
      </button>
      
      <div className="relative w-full max-w-3xl aspect-[4/3] bg-zinc-950 rounded-[2rem] overflow-hidden shadow-[0_0_80px_rgba(59,130,246,0.2)] border border-white/10 flex items-center justify-center">
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-zinc-950">
            <Loader2 className="animate-spin text-blue-500 mb-4" size={40} />
            <p className="text-white font-mono uppercase tracking-widest text-sm font-bold">
              {(!poseLoaded || !camLoaded) ? "Downloading AI Core..." : "Calibrating AR Engine..."}
            </p>
          </div>
        )}
        
        <video ref={videoRef} className="hidden" playsInline muted />
        <canvas ref={canvasRef} width={640} height={480} className="w-full h-full object-cover scale-x-[-1]" />
        
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-md border border-white/10 px-6 py-2 rounded-full pointer-events-none">
          <span className="text-xs text-white font-bold tracking-widest uppercase"><span className="text-blue-400 mr-2 animate-pulse">●</span>Live Spatial Tracking</span>
        </div>
      </div>
    </div>
  );
}