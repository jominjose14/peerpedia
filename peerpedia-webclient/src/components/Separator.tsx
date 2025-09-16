import { cn } from "@/lib/utils";

interface SeparatorProps {
    className?: string,
}

function Separator({ className }: SeparatorProps) {
    const baseStyles = "flex gap-3 items-center justify-center mt-8 mb-4";
    const mergedStyles = cn(baseStyles, className);

    return (
        <div className={mergedStyles}>
            <span className="inline-block w-2 h-2 bg-blue-200 rounded-full mx-1"></span>
            <span className="inline-block w-2 h-2 bg-blue-200 rounded-full mx-1"></span>
            <span className="inline-block w-2 h-2 bg-blue-200 rounded-full mx-1"></span>
        </div>
    );
}

export default Separator;