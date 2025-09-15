import { useEffect, useState } from "react";
import Fullscreen from "../Fullscreen";
import NavBar from "../NavBar";
import Spinner from "../Spinner";
import { getMostKnownSkills, getMostSaughtSkills, getUserCount } from "../../lib/requests";
import { CountingNumber } from "../ui/shadcn-io/counting-number";
import SkillChart from "../SkillChart";
import type { PlottableSkill, PopularSkills } from "../../lib/types";
import Main from "../Main";
import Header from "../Header";
import Page from "../Page";

function Home() {
    const [loading, setLoading] = useState<boolean>(false);
    const [userCount, setUserCount] = useState<number>(50);
    const [mostKnownSkills, setMostKnownSkills] = useState<PlottableSkill[]>([{ skill: "JavaScript", count: 100 }, { skill: "NodeJS", count: 90 }, { skill: "HTML", count: 80 }, { skill: "Java", count: 75 }, { skill: "CSS", count: 69 }]);
    const [mostSaughtSkills, setMostSaughtSkills] = useState<PlottableSkill[]>([{ skill: "SpringBoot", count: 150 }, { skill: "Golang", count: 145 }, { skill: "Docker", count: 130 }, { skill: "PostgreSQL", count: 120 }, { skill: "Android", count: 110 }]);

    useEffect(() => {
        init();
    }, []);

    async function init() {
        setLoading(true);

        const fetchedUserCount: number | null = await getUserCount();
        if (fetchedUserCount) setUserCount(fetchedUserCount);

        const fetchedMostKnownSkills: PopularSkills | null = await getMostKnownSkills();
        if (fetchedMostKnownSkills) {
            const plottableSkills: PlottableSkill[] = [];
            for (const key in fetchedMostKnownSkills) {
                plottableSkills.push({ skill: key, count: fetchedMostKnownSkills[key] });
            }
            setMostKnownSkills(plottableSkills);
        }

        const fetchedMostSaughtSkills: PopularSkills | null = await getMostSaughtSkills();
        if (fetchedMostSaughtSkills) {
            const plottableSkills: PlottableSkill[] = [];
            for (const key in fetchedMostSaughtSkills) {
                plottableSkills.push({ skill: key, count: fetchedMostSaughtSkills[key] });
            }
            setMostSaughtSkills(plottableSkills);
        }

        setLoading(false);
    }

    const h2Style = "text-blue-500 font-bold text-lg sm:text-xl mt-12";
    const iconSize = "25px";

    return (
        <Fullscreen>
            <Page>
                <Header text="Peerpedia" iconSrc="favicon.svg" />
                <Main className="pt-12 px-6 sm:px-20 pb-24 text-gray-700">
                    <h2 className={h2Style + "mt-0"}>About</h2>
                    <p className="mt-3 px-5 pt-3 pb-4 rounded-lg border text-justify">Welcome to Peerpedia. Get matched with peers who want to learn from you and teach them in return!</p>

                    <h2 className={h2Style}>Get started</h2>
                    <ul className="mt-3 pl-11 pr-4 pt-4 pb-5 rounded-lg border list-disc list-outside space-y-1">
                        <li>Click on Profile tab <img className="inline" src="profile.svg" alt="profile icon" height={iconSize} width={iconSize} /> from the bottom nav bar</li>
                        <li>Provide your email and skills. Then,</li>
                        <li>Click on Matchmaking tab <img className="inline" src="matchmaking.svg" alt="matchmaking icon" height={iconSize} width={iconSize} /> for algorithmic matchmaking with peers who can learn from each other</li>
                        <li>Click on Teach tab <img className="inline" src="teach.svg" alt="teach icon" height={iconSize} width={iconSize} /> to find peers to teach</li>
                        <li>Click on Learn tab <img className="inline" src="learn.svg" alt="learn icon" height={iconSize} width={iconSize} /> to find peers to learn from</li>
                    </ul>

                    <h2 className={h2Style}>Stats</h2>
                    <div className="mt-3 px-4 pt-8 pb-12 rounded-lg border">
                        <div className="">
                            <CountingNumber number={userCount} inView={true} inViewMargin="-100px" transition={{ stiffness: 100, damping: 30 }} className="block text-center text-[3rem] sm:text-[3.5rem] font-bold bg-gradient-to-r from-blue-950 via-blue-500 to-blue-50 text-transparent bg-clip-text" />
                            <p className="text-center font-light">Total users on Peerpedia</p>
                        </div>
                        <div className="space-y-1 mt-12">
                            <SkillChart data={mostKnownSkills} />
                            <p className="text-center font-light">Most known skills</p>
                        </div>
                        <div className="space-y-1 mt-13">
                            <SkillChart data={mostSaughtSkills} />
                            <p className="text-center font-light">Most saught-after skills</p>
                        </div>
                    </div>

                    <h2 className={h2Style}>Tech Stack</h2>
                    <ul className="mt-3 pl-11 pr-5 pt-4 pb-5 rounded-lg border list-disc list-outside space-y-1">
                        <li>Frontend: TypeScript, Node, React, TailwindCSS, ShadCN, Vite</li>
                        <li>Backend: Java, Spring Boot, JPA, Hibernate, JJWT, Gradle, Redis, Nginx</li>
                        <li>Database: PostgreSQL</li>
                        <li>Deployment: Docker, Render, Neon</li>
                    </ul>
                </Main>
            </Page>
            <NavBar />
            <Spinner loading={loading} />
        </Fullscreen>
    );
}

export default Home;