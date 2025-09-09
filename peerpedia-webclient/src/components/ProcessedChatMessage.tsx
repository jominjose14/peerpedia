import React from "react";

interface ProcessedChatMessageProps {
    msg: string,
}

function ProcessedChatMessage({ msg }: ProcessedChatMessageProps) {
    const words: string[] = msg.split(" ");

    return (
        <>
            {words.map((word, index) => {
                const isHyperlink = word.startsWith("https://");

                return (
                    <React.Fragment key={index}>
                        {isHyperlink ? (
                            <a href={word} target="_blank" rel="noopener noreferrer" className="cursor-pointer text-blue-500 hover:underline">
                                {word}
                            </a>
                        ) : (
                            word
                        )}
                        {index < words.length - 1 && ' '}
                    </React.Fragment>
                );
            })}
        </>
    );
}

export default ProcessedChatMessage;