import Image from "next/image";
import AudioSVG from "@/app/music/svg/AudioSVG";
import ShareSVG from "@/app/music/svg/ShareSVG";
import MusicIcon from "@/app/music/svg/MusicIcon";

export default function Home() {
  return (
    <div className="font-[family-name:var(--font-geist-sans)]">
      <main className="min-h-screen flex flex-col items-center justify-center px-6 sm:px-12 py-16 bg-gradient-to-b from-black to-gray-900 text-white font-sans space-y-16">
        {/* Logo */}
        <Image
            src="/logo.png"
            alt="MusicViz Logo"
            width={480}
            height={480}
            className="dark:invert"
            priority
        />

        {/* Hero Section */}
        <section className="text-center max-w-2xl space-y-6">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
            Experience Your Music as Visual Art
          </h1>
          <p className="text-lg text-gray-300 leading-relaxed">
            Upload or stream your favorite tracks and watch them come alive through stunning generative patterns in real time.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
                href="/music"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-full transition duration-200"
            >
              Try the Visualizer
            </a>
            <a
                href="#how-it-works"
                className="border border-gray-500 hover:bg-gray-800 text-gray-300 font-medium py-3 px-6 rounded-full transition duration-200"
            >
              Learn More
            </a>
          </div>
        </section>

        {/* Features */}
        <section id="how-it-works" className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center max-w-5xl">
          <div className="space-y-3">
            <AudioSVG className="mx-auto dark:invert text-cyan-400 h-16 w-16 "/>
            <h3 className="text-xl font-semibold">Live Audio Input</h3>
            <p className="text-sm text-gray-400">Stream music directly or upload your tracks to begin visualization.</p>
          </div>
          <div className="space-y-3">
            <MusicIcon className="mx-auto dark:invert text-cyan-400 h-16 w-16 "/>
            <h3 className="text-xl font-semibold">Generative Patterns</h3>
            <p className="text-sm text-gray-400">Each sound creates a unique, flowing, real-time art pattern.</p>
          </div>
          <div className="space-y-3">
            <ShareSVG className="mx-auto dark:invert text-cyan-400 h-16 w-16 "/>
            <h3 className="text-xl font-semibold">Save & Share</h3>
            <p className="text-sm text-gray-400">Export your favorite visual loops as videos or GIFs to share with friends.</p>
          </div>
        </section>

      </main>
      <hr className="border-t border-gray-700"/>
      {/* Footer */}
      <footer className="flex items-center justify-center py-8 text-center bg-gray-900 font-sans text-xs text-gray-500">
        Made with 💜 by MusicViz | © 2025 All rights reserved
      </footer>
    </div>
  );
}
