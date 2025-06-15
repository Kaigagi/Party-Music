'use client'

import React, {useEffect, useRef, useState} from "react";
import {useAudioForm} from "@/app/music/components/AudioFormProvider";

export default function MusicPage() {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { mp3File, setMp3File, youtubeLink, setYoutubeLink, audioRef } = useAudioForm();

    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        function resize() {
            if (container && canvas && ctx){
                const { width, height } = container.getBoundingClientRect();
                canvas.width = width;
                canvas.height = height;

                clearCanvas();
            }
        }

        resize();

        window.addEventListener("resize", resize);
        return () => window.removeEventListener("resize", resize);
    }, []);

    function clearCanvas() {
        const canvas = canvasRef.current;
        const container = containerRef.current;

        if (container && canvas){
            const ctx = canvas.getContext("2d");
            if (!ctx) return;

            const { width, height } = container.getBoundingClientRect();
            canvas.width = width;
            canvas.height = height;

            // Clear or redraw canvas as needed
            ctx.clearRect(0, 0, width, height);
            ctx.fillStyle = "#222";
            ctx.fillRect(0, 0, width, height);
        }
    }

    React.useEffect(() => {
        if (mp3File && audioRef.current && canvasRef.current) {
            const url = URL.createObjectURL(mp3File);
            audioRef.current.src = url;
            audioRef.current.play();

            const audioCtx = new AudioContext();
            const canvas = canvasRef.current;
            const ctx = canvas.getContext("2d");
            if (!ctx) return;

            let audioSource = audioCtx.createMediaElementSource(audioRef.current);
            let analyser = audioCtx.createAnalyser();

            audioSource.connect(analyser);
            analyser.connect(audioCtx.destination);
            analyser.fftSize = 64;
            //half of fftSize
            let bufferLength = analyser.frequencyBinCount;
            let dataArray = new Uint8Array(bufferLength);

            //define column char
            let barWidth = canvas.width / bufferLength;
            let x;

            function animate() {
                if (!ctx) return;
                x = 0;
                clearCanvas();
                analyser.getByteFrequencyData(dataArray);
                for (let i = 0; i < dataArray.length; i++){
                    let barHeight = dataArray[i] * 2;
                    ctx.fillStyle = 'white';
                    ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
                    x+= barWidth;
                }
                if (!audioRef.current?.paused) {
                    requestAnimationFrame(animate);
                }
            }
            animate();
            return () => {
                URL.revokeObjectURL(url);
            };
        }
    }, [mp3File]);

    return (
        <div ref={containerRef} className="w-full h-full relative">
            <canvas
                ref={canvasRef}
                className="block"
                style={{ width: "100%", height: "100%" }}
            />
        </div>
    );
}
