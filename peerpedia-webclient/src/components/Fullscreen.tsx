import type { ReactNode } from "react";

interface FullscreenProps {
    children: ReactNode,
}

function Fullscreen({ children }: FullscreenProps) {
    return (
        <div className="min-h-screen w-full animate-fade bg-gradient-to-r from-blue-50 via-white to-blue-50">
            {children}
        </div>
    );
}

export default Fullscreen;