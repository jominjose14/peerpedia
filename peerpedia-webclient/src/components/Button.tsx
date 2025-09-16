import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface ButtonProps {
    className?: string,
    children: ReactNode,
}

function Button({ className, children, ...props }: React.ComponentProps<"button"> & ButtonProps) {
    const baseStyles = "text-white bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-full text-md sm:text-lg px-2 py-2.5 text-center cursor-pointer";
    const mergedStyles = cn(baseStyles, className);

    return (
        <button className={mergedStyles} {...props}>
            {children}
        </button>
    );
}

export default Button;