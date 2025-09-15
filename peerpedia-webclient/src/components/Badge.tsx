interface BadgeProps {
    text: string,
    variant: "small" | "large" | "xl",
}

function Badge({ text, variant }: BadgeProps) {
    let styles = "inline border shadow-sm rounded-sm";
    const smallVariantStyles = "text-[0.8rem]/[1] px-1.5 py-1";
    const largeVariantStyles = "text-[0.9rem]/[1] px-2 py-1.5";
    const xlVariantStyles = "text-[1.1rem]/[1] px-2 py-1.5";

    if (variant === "small") {
        styles += " " + smallVariantStyles;
    } else if (variant === "large") {
        styles += " " + largeVariantStyles;
    } else if (variant === "xl") {
        styles += " " + xlVariantStyles;
    }

    return (
        <div className={styles}>{text}</div>
    );
}

export default Badge;