'use client'

import {FormEvent, useState} from "react";
import {useAudioForm} from "@/app/music/components/AudioFormProvider";

export default function AudioInput() {
    const { mp3File, setMp3File, youtubeLink, setYoutubeLink, audioRef } = useAudioForm();
    const [error, setError] = useState<string | null>(null);
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        try{
            const form = e.currentTarget as HTMLFormElement;
            const formData = new FormData(form);
            // ✅ Read YouTube link
            const ytLink = formData.get("youtube-link")?.toString().trim();
            // ✅ Read MP3 file
            const file = formData.get("audio-upload") as File;

            //Validate YT link
            const isValidYouTubeLink =
                !ytLink || // allow empty
                ytLink.startsWith("https://www.youtube.com") ||
                ytLink.startsWith("https://youtube.com");

            if (!isValidYouTubeLink) {
                setError("Please enter a valid YouTube link.");
                return;
            }

            console.log("MP3 File:", file);
            console.log("YouTube Link:", ytLink);
            if (
                !file ||
                (file.type !== "audio/mpeg" && file.type !== "video/mp4")
            ) {
                setError("Please upload a valid MP3 or MP4 file.");
                return;
            }

            // All good!
            console.log("YouTube Link:", ytLink);
            console.log("MP3 File:", file);

            if (ytLink){
                setYoutubeLink(ytLink);
            }

            setMp3File(file)
        }catch (e){
            setError("Invalid Input");
        }
    };

    return (
        <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
                <div className="text-red-600 border border-red-300 bg-red-100 p-3 rounded text-sm">
                    {error}
                </div>
            )}
            {/* MP3 Upload */}
            <div>
                <label htmlFor="audio-upload" className="block text-sm font-medium mb-1">
                    Upload MP3
                </label>
                <input
                    type="file"
                    id="audio-upload"
                    name="audio-upload"
                    accept=".mp3, .mp4"
                    className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:border-0 file:bg-blue-600 file:text-white file:rounded hover:file:bg-blue-700"
                />
            </div>

            {/* YouTube Link Input */}
            <div>
                <label htmlFor="youtube-link" className="block text-sm font-medium mb-1">
                    YouTube Link
                </label>
                <input
                    type="url"
                    id="youtube-link"
                    name="youtube-link"
                    placeholder="https://youtube.com/..."
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            >
                Submit
            </button>

            <audio ref={audioRef} controls/>
        </form>
    )
}