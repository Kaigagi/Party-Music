import AudioInput from "@/app/music/components/AudioInput";
import {AudioFormProvider} from "@/app/music/components/AudioFormProvider";

export default function Layout({ children }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <AudioFormProvider>
            <div className="flex min-h-screen">
                {/* Main content on the left */}
                <main className="flex-1">{children}</main>

                {/* Audio submission panel on the right */}
                <aside className="w-[350px] border-l border-gray-300 bg-gray-50 p-6">
                    <h2 className="text-xl font-semibold mb-4">Submit Audio</h2>
                    <AudioInput/>
                </aside>
            </div>
        </AudioFormProvider>
    )
}