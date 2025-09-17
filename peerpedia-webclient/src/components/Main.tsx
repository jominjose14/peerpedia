import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface MainProps {
    className?: string,
    children: ReactNode,
}

function Main({ className = "", children }: MainProps) {
    const baseStyles = "min-h-dvh bg-white border-x-[1px] border-gray-100 shadow-[0_0_2rem_rgb(0,0,0,0.1)] text-[0.9rem]/[1.4] sm:text-lg text-gray-800 p-6 px-1 sm:px-8 pb-24";
    const mergedStyles = cn(baseStyles, className);

    return (
        <main className={mergedStyles}>
            {children}
        </main>
    );
}

export default Main;