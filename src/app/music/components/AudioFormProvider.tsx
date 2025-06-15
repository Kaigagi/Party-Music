"use client";

import React, { createContext, useContext, useState, ReactNode, useRef, RefObject } from "react";

interface AudioFormContextType {
    mp3File: File | null;
    setMp3File: (file: File | null) => void;
    youtubeLink: string;
    setYoutubeLink: (link: string) => void;
    audioRef: RefObject<HTMLAudioElement | null>;
}

const AudioFormContext = createContext<AudioFormContextType | undefined>(undefined);

export function AudioFormProvider({ children }: { children: ReactNode }) {
    const [mp3File, setMp3File] = useState<File | null>(null);
    const [youtubeLink, setYoutubeLink] = useState("");
    const audioRef = useRef<HTMLAudioElement>(null);

    return (
        <AudioFormContext.Provider value={{ mp3File, setMp3File, youtubeLink, setYoutubeLink, audioRef }}>
            {children}
        </AudioFormContext.Provider>
    );
}

export function useAudioForm() {
    const context = useContext(AudioFormContext);
    if (!context) {
        throw new Error("useAudioForm must be used within an AudioFormProvider");
    }
    return context;
}
