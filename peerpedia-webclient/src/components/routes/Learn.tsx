import { useEffect, useState } from "react";
import NavBar from "../NavBar";
import type { User } from "../../lib/types";
import { getPeersToLearnFrom } from "../../lib/requests";
import PeerCard from "../PeerCard";
import { toast } from "sonner";
import Fullscreen from "../Fullscreen";
import Main from "../Main";
import Spinner from "../Spinner";
import Page from "../Page";
import Header from "../Header";
import Intro from "../Intro";

function Learn() {
    const [loading, setLoading] = useState<boolean>(false);
    const [peers, setPeers] = useState<User[]>([]);
    const lastPeerId = 0 < peers.length ? peers[peers.length - 1].id : 1_000_000;

    useEffect(() => {
        loadPeers();
    }, []);

    async function loadPeers() {
        if (lastPeerId === 1) {
            toast("No more peers available");
            return;
        }

        setLoading(true);
        const fetchedPeers: User[] | null = await getPeersToLearnFrom(1, lastPeerId - 1);
        if (fetchedPeers === null) {
            setLoading(false);
            toast("Failed to fetch peers");
            return;
        }

        if (fetchedPeers.length === 0) {
            setLoading(false);
            toast("No more peers available");
            return;
        }

        setPeers(peers => [...peers, ...fetchedPeers]);
        setLoading(false);
    }

    return (
        <Fullscreen>
            <Page>
                <Header iconSrc="learn.svg" iconStyles="pt-1 scale-102" text="Learn" />
                <Main>
                    <Intro text="Learn from peers who possess the skills you wish to acquire" />
                    <div className="p-4 flex flex-col gap-4">
                        {peers.length === 0 ? <p className="text-center text-gray-500"> - No matches - </p> : peers.map(peer => <PeerCard key={peer.id} peer={peer} />)}
                    </div>
                    <button disabled={loading} onClick={loadPeers} className="block mx-auto cursor-pointer text-blue-500">Load more</button>
                </Main>
            </Page>
            <NavBar />
            <Spinner loading={loading} />
        </Fullscreen>
    )
}

export default Learn;