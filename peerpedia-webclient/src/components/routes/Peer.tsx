import { useEffect, useState } from "react";
import NavBar from "../NavBar";
import { getUserById } from "../../lib/requests";
import type { User } from "../../lib/types";
import { useSearchParams } from "react-router-dom";
import LetterImage from "../LetterImage";
import Badge from "../Badge";
import Chat from "../Chat";
import Fullscreen from "../Fullscreen";
import Spinner from "../Spinner";
import Main from "../Main";
import Page from "../Page";
import Header from "../Header";

function Peer() {
    const [loading, setLoading] = useState<boolean>(false);
    const [searchParams] = useSearchParams();
    const [peer, setPeer] = useState<User>({ id: 0, username: 'loading', email: 'loading', teachSkills: ['loading'], learnSkills: ['loading'], bio: 'loading' });

    const idStr = searchParams.get("id");
    const lastActiveBeforeInHours = Math.trunc(1 + Math.random() * 10);

    useEffect(() => {
        init();
    }, []);

    async function init() {
        setLoading(true);
        if (idStr === null) {
            setLoading(false);
            return;
        }

        const id = parseInt(idStr);
        if (!Number.isInteger(id)) {
            setLoading(false);
            return;
        }

        const peer: User | null = await getUserById(id);
        if (peer === null) {
            setLoading(false);
            return;
        }

        setPeer(peer);
        setLoading(false);
    }

    return (
        <Fullscreen>
            <Page>
                <Header iconSrc="profile.svg" iconStyles="scale-111" text="Peer" />
                <Main className="pt-8 px-6 sm:px-24 pb-24">
                    <header className="flex flex-col gap-2 items-center justify-center mt-3">
                        <LetterImage username={peer.username} variant="large" />
                        <div>@{peer.username}</div>
                        {/* TODO: dynamically update last active */}
                        <div className="text-[1rem]/[1.3] font-light">Last active {lastActiveBeforeInHours} {lastActiveBeforeInHours === 1 ? "hour" : "hours"} ago</div>
                    </header>
                    <section className="space-y-4 mt-10">
                        {/* <div className="space-y-2 mt-2">
                        <div className="text-blue-500 font-semibold">Email</div>
                        <div className="px-2 py-1 border">{peer.email}</div>
                        </div> */}
                        <div className="space-y-2">
                            <div className="text-blue-500 font-semibold">Bio</div>
                            <div className="px-5 py-3 pb-4 rounded-md border text-gray-800 justify">
                                {peer.bio}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="text-blue-500 font-semibold">I can teach</div>
                            <div className="flex gap-1 items-center flex-wrap">
                                {peer.teachSkills.map((skill, idx) => <Badge key={idx} text={skill} variant="xl" />)}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="text-blue-500 font-semibold">I want to learn</div>
                            <div className="flex gap-1 items-center flex-wrap">
                                {peer.learnSkills.map((skill, idx) => <Badge key={idx} text={skill} variant="xl" />)}
                            </div>
                        </div>
                    </section>
                    <Chat peerId={peer.id} peerUsername={peer.username} />
                </Main>
            </Page>
            <NavBar />
            <Spinner loading={loading} />
        </Fullscreen>
    )
}

export default Peer;