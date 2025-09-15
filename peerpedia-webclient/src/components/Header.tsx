import { cn } from "@/lib/utils";

interface HeaderProps {
    className?: string,
    iconSrc: string,
    iconStyles?: string,
    text: string,
}

function Header({ className = "", iconSrc, iconStyles = "", text }: HeaderProps) {
    const baseHeaderStyles = "flex gap-4 items-center justify-center bg-gradient-to-r from-blue-700 to-blue-500 pt-5 pb-7";
    const mergedHeaderStyles = cn(baseHeaderStyles, className);

    const baseIconStyles = "filter brightness-0 invert-100";
    const mergedIconStyles = cn(baseIconStyles, iconStyles);

    return (
        <header className={mergedHeaderStyles}>
            <img src={iconSrc} alt="peerpedia icon" height="35px" width="35px" className={mergedIconStyles} />
            <h1 className="text-[1.9rem]/[1.1] sm:text-[2.2rem]/[1.2] text-white font-semibold">{text}</h1>
        </header>
    );
}

export default Header;