interface LetterImageProps {
    username: string,
    variant: "small" | "large",
}

function LetterImage({ username, variant }: LetterImageProps) {
    const letter = username[0].toUpperCase();
    const sizeStyles = variant === "small" ? "p-3.5 text-[1rem]/[0.1]" : "p-7 text-[2.25rem]/[0.1]";

    return (
        <div className={`grid place-items-center font-mono ${sizeStyles} aspect-square rounded-full bg-blue-500 text-white`}>
            {letter}
        </div>
    );
}

export default LetterImage;