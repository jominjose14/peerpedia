interface BadgeProps {
    text: string,
    variant: "small" | "large"
}

function Badge({ text, variant }: BadgeProps) {
    return (
        <div className={`inline border shadow-sm rounded-sm ${variant === "small" ? "text-[0.8rem]/[1] px-1.5 py-1" : "text-[0.9rem]/[1] px-2 py-1.5"}`}>{text}</div>
    );
}

export default Badge;