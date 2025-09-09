import { useEffect, useState } from "react";
import Fullscreen from "../Fullscreen";
import NavBar from "../NavBar";
import Spinner from "../Spinner";
import { getMostKnownSkills, getMostSaughtSkills, getUserCount } from "../../lib/requests";

function Info() {
    const [loading, setLoading] = useState<boolean>(false);
    const [userCount, setUserCount] = useState<number>(50);
    const [mostKnownSkills, setMostKnownSkills] = useState<string[]>(["JavaScript", "NodeJS", "HTML"]);
    const [mostSaughtSkills, setMostSaughtSkills] = useState<string[]>(["SpringBoot", "Golang", "Docker"]);

    useEffect(() => {
        init();
    }, []);

    async function init() {
        setLoading(true);

        const fetchedUserCount: number | null = await getUserCount();
        if (fetchedUserCount) setUserCount(fetchedUserCount);

        const fetchedMostKnownSkills: string[] | null = await getMostKnownSkills();
        if (fetchedMostKnownSkills) setMostKnownSkills(fetchedMostKnownSkills);

        const fetchedMostSaughtSkills: string[] | null = await getMostSaughtSkills();
        if (fetchedMostSaughtSkills) setMostSaughtSkills(fetchedMostSaughtSkills);

        setLoading(false);
    }

    return (
        <Fullscreen>
            <main className="min-h-screen w-full sm:w-13/32 m-auto shadow-[0_0_1.5rem_rgb(0,0,0,0.09)] pt-8 px-10 sm:px-16 pb-24">
                <header className="flex gap-2 items-center justify-center mb-8">
                    <img src="favicon.svg" alt="peerpedia icon" height="30px" width="30px" />
                    <h1 className="text-2xl">Peerpedia</h1>
                </header>

                <h2 className="text-blue-500 font-bold">About</h2>
                <p className="text-justify">Welcome to Peerpedia. Get matched with peers who want to learn from you and teach them in return!</p>

                <h2 className="text-blue-500 font-bold mt-6">Get started</h2>
                <ul className="list-disc list-outside pl-5">
                    <li>Click on Profile tab <img className="inline" src="profile.svg" alt="profile icon" height="20px" width="20px" /> from the bottom nav bar</li>
                    <li>Provide your email and skills. Then,</li>
                    <li>Click on Matchmaking tab <img className="inline" src="matchmaking.svg" alt="matchmaking icon" height="20px" width="20px" /> for algorithmic matchmaking with peers who can learn from each other</li>
                    <li>Click on Teach tab <img className="inline" src="teach.svg" alt="teach icon" height="20px" width="20px" /> to find peers to teach</li>
                    <li>Click on Learn tab <img className="inline" src="learn.svg" alt="learn icon" height="20px" width="20px" /> to find peers to learn from</li>
                </ul>

                <h2 className="text-blue-500 font-bold mt-6">Stats</h2>
                <ul className="list-disc list-outside pl-5">
                    <li>Peerpedia population: {userCount} peers</li>
                    <li>Most known skills: {mostKnownSkills.join(", ")}</li>
                    <li>Most saught-after skills: {mostSaughtSkills.join(", ")}</li>
                </ul>

                <h2 className="text-blue-500 font-bold mt-6">Tech Stack</h2>
                <ul className="list-disc list-outside pl-5">
                    <li>Frontend: TypeScript, Node, React, TailwindCSS, ShadCN, Vite</li>
                    <li>Backend: Java, Spring Boot, JPA, Hibernate, JJWT, Gradle</li>
                    <li>Database: PostgreSQL</li>
                    <li>Deployment: Docker, Render, Neon</li>
                </ul>
            </main>
            <NavBar />
            <Spinner loading={loading} />
        </Fullscreen>
    );
}

export default Info;