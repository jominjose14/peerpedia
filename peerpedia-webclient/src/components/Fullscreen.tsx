import type { ReactNode } from "react";

interface FullscreenProps {
    children: ReactNode,
}

function Fullscreen({ children }: FullscreenProps) {
    return (
        <div className="min-h-screen w-full animate-fade">
            {children}
        </div>
    );
}

export default Fullscreen;