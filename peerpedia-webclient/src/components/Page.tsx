import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface PageProps {
    className?: string,
    children: ReactNode,
}

function Page({ className = "", children }: PageProps) {
    const baseStyles = "w-full sm:w-9/16 m-auto";
    const mergedStyles = cn(baseStyles, className);
    return (
        <div className={mergedStyles}>
            {children}
        </div>
    );
}

export default Page;