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

        if (canvas){
            const ctx = canvas.getContext("2d");
            if (!ctx) return;

            // Clear or redraw canvas as needed
            ctx.fillStyle = "#0b1a26";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
    }

    class SoundWavePoint{
        private readonly stiffness = 0.02; // how fast it responds
        private readonly damping = 0.1;   // how much it resists fast movement
        private velocity = 1;
        private soundValue = 0;
        private barWidth = 0;
        private amplitude = 300;
        private acceleration = 0;

        private x= 0;
        private y = 0;
        private volumeLength = 50;

        public constructor(barWidth: number) {
            this.barWidth = barWidth;
        }

        public GetPosition() {
            return this.soundValue;
        }

        public CalculateAcceleration(target: number) {
            const delta = target - this.soundValue;

            // Hooke's law: F = -k * x, here we omit the negative because we're applying delta toward the target
            this.acceleration = delta * this.stiffness;

            // Apply damping
            this.acceleration -= this.velocity * this.damping;
        }

        public UpdatePhysics() {
            this.velocity += this.acceleration;
            this.soundValue += this.velocity;
        }

        public render(ctx: CanvasRenderingContext2D, xIndex: number, canvas: HTMLCanvasElement) {
            ctx.fillStyle = 'white';
            ctx.fillRect(xIndex * this.barWidth, canvas.height - this.soundValue, this.barWidth, this.soundValue);
        }

        public renderWave(ctx: CanvasRenderingContext2D, xIndex: number, canvas: HTMLCanvasElement, previousPosition: number) {
            const preX = (xIndex-1)*this.barWidth;
            const preY = (canvas.height / 2) + (previousPosition / 128.0 - 1.0) * this.amplitude;
            if (xIndex > 0){
                ctx.moveTo(preX, preY);
            }else {
                ctx.moveTo(0, canvas.height / 2);
            }
            this.x = xIndex * this.barWidth;
            const v = this.soundValue / 128.0 - 1.0; // normalize [-1, 1]
            this.y = (canvas.height / 2) + v * this.amplitude;

            //mid point for curve
            const midX = (this.x + preX) / 2;
            const midY = (this.y + preY) / 2;

            ctx.strokeStyle = "aqua";          // or a neon color like "#00faff"
            ctx.shadowColor = "aqua";          // same or brighter for glow
            ctx.lineWidth = 2;
            ctx.shadowBlur = 15;
            ctx.globalAlpha = 0.9;

            // Use previous point as control, curve to midpoint between prev and curr
            ctx.quadraticCurveTo(preX, preY, midX, midY);
        }

        public addVolume(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);

            // Create gradient from top of wave to bottom
            let gradient = ctx.createLinearGradient(this.x, this.y, this.x, canvas.height/2);

            // Extend path down to bottom
            if (Math.abs(this.y - canvas.height/2) <= this.volumeLength){
                ctx.lineTo(this.x, canvas.height/2);
            } else {
                if (this.y > canvas.height/2) {
                    ctx.lineTo(this.x, this.y - this.volumeLength);
                    gradient = ctx.createLinearGradient(this.x, this.y, this.x, this.y - this.volumeLength);
                } else {
                    ctx.lineTo(this.x, this.y + this.volumeLength);
                    gradient = ctx.createLinearGradient(this.x, this.y, this.x, this.y + this.volumeLength);
                }
            }

            ctx.shadowColor = "transparent"; // disable shadow
            ctx.shadowBlur = 0;
            ctx.globalAlpha = 0.9;

            // Fade from aqua to transparent
            gradient.addColorStop(0, "rgba(0, 255, 255, 1)");   // aqua
            gradient.addColorStop(1, "rgba(0, 255, 255, 0)");

            ctx.strokeStyle = gradient;
            ctx.stroke();
            ctx.closePath();
        }
    }

    function smooth(data: Uint8Array, windowSize = 30) {
        const smoothed = new Uint8Array(data.length);
        for (let i = 0; i < data.length; i++) {
            let sum = 0;
            let count = 0;
            for (let j = i - Math.floor(windowSize/2); j <= i + Math.floor(windowSize/2); j++) {
                if (j >= 0 && j < data.length) {
                    sum += data[j];
                    count++;
                }
            }
            smoothed[i] = sum / count;
        }
        return smoothed;
    }

    React.useEffect(() => {
        if (mp3File && audioRef.current && canvasRef.current) {
            const url = URL.createObjectURL(mp3File);
            audioRef.current.src = url;
            audioRef.current.play();

            const audioCtx = new AudioContext();
            const canvas = canvasRef.current;
            const container = containerRef.current;
            const ctx = canvas.getContext("2d");
            if (!ctx || !container) return;

            const { width, height } = container.getBoundingClientRect();
            canvas.width = width;
            canvas.height = height;

            let audioSource = audioCtx.createMediaElementSource(audioRef.current);
            let analyser = audioCtx.createAnalyser();
            const biquadFilter = audioCtx.createBiquadFilter();
            // biquadFilter.type = "lowpass";
            // biquadFilter.frequency.setValueAtTime(1000, audioCtx.currentTime);

            audioSource.connect(analyser);
            audioSource.connect(biquadFilter);
            biquadFilter.connect(analyser);
            analyser.connect(audioCtx.destination);
            analyser.fftSize = 2048;
            //half of fftSize
            let bufferLength = analyser.frequencyBinCount;
            let dataArray = new Uint8Array(bufferLength);

            //define column char
            let barWidth = canvas.width / bufferLength;
            let soundBarArr = Array.from({ length: bufferLength }, () => (
                new SoundWavePoint(barWidth)
            ));

            setInterval(() => {
                analyser.getByteTimeDomainData(dataArray);
                // store or process dataArray here
            }, 150);

            let lastTime = performance.now();
            let frameCount = 0;
            function animate(time: number) {
                if (!ctx) return;
                clearCanvas();
                // console.log(dataArray);
                dataArray = smooth(dataArray);
                ctx.beginPath();
                for (let i = 0; i < dataArray.length; i++) {

                    soundBarArr[i].CalculateAcceleration(dataArray[i]);
                    soundBarArr[i].UpdatePhysics();

                    if (i == 0){
                        soundBarArr[i].renderWave(ctx, i, canvas, 0);
                        continue;
                    }
                    soundBarArr[i].renderWave(ctx, i, canvas, soundBarArr[i-1].GetPosition());
                }
                ctx.stroke();
                ctx.closePath();


                for (let i = 0; i < dataArray.length; i++) {

                    soundBarArr[i].addVolume(ctx, canvas)
                }

                //count FPS
                frameCount++;
                const delta = time - lastTime;
                if (delta >= 1000) {
                    console.log('FPS:', frameCount);
                    frameCount = 0;
                    lastTime = time;
                }

                if (!audioRef.current?.paused) {
                    requestAnimationFrame(animate);
                }
            }
            requestAnimationFrame(animate);
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
