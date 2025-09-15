interface IntroProps {
    text: string,
}

function Intro({ text }: IntroProps) {
    return (
        <p className="font-light text-md sm:text-lg text-center my-2">{text}</p>
    );
}

export default Intro;