import { cn } from "@/lib/utils";

interface IntroProps {
    className?: string,
    text: string,
}

function Intro({ className, text }: IntroProps) {
    const baseStyles = "w-14/16 mx-auto font-light text-gray-600 text-[0.85rem]/[1.3] sm:text-lg text-center my-2";
    const mergedStyles = cn(baseStyles, className);

    return (
        <p className={mergedStyles}>{text}</p>
    );
}

export default Intro;