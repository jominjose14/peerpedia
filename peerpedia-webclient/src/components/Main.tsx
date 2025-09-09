import type { ReactNode } from "react";

interface MainProps {
    children: ReactNode,
}

function Main({ children }: MainProps) {
    return (
        <main className="min-h-screen w-full sm:w-13/32 m-auto bg-white drop-shadow-xl p-6 px-1 sm:px-6 pb-24">
            {children}
        </main>
    );
}

export default Main;