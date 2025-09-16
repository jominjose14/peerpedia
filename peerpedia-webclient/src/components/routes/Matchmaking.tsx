import { useEffect, useState } from "react";
import NavBar from "../NavBar";
import type { User } from "../../lib/types";
import { getMatchedPeers } from "../../lib/requests";
import PeerCard from "../PeerCard";
import { toast } from "sonner";
import Fullscreen from "../Fullscreen";
import Main from "../Main";
import Spinner from "../Spinner";
import Page from "../Page";
import Header from "../Header";
import Intro from "../Intro";

function Matchmaking() {
    const [loading, setLoading] = useState<boolean>(false);
    const [peers, setPeers] = useState<User[]>([]);
    const lastPeerId = 0 < peers.length ? peers[peers.length - 1].id : 1_000_000;

    useEffect(() => {
        loadPeers();
    }, []);

    async function loadPeers() {
        if (lastPeerId === 1) {
            toast("No more matches available");
            return;
        }

        setLoading(true);
        const fetchedPeers: User[] | null = await getMatchedPeers(1, lastPeerId - 1);
        if (fetchedPeers === null) {
            setLoading(false);
            toast("Failed to fetch matched peers");
            return;
        }

        if (fetchedPeers.length === 0) {
            setLoading(false);
            toast("No more matches available");
            return;
        }

        setPeers(peers => [...peers, ...fetchedPeers]);
        setLoading(false);
    }

    return (
        <Fullscreen>
            <Page>
                <Header iconSrc="matchmaking.svg" iconStyles="pt-1 scale-105" text="Matchmaking" />
                <Main>
                    <Intro text="Connect with peers exactly matching your requirements" />
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

export default Matchmaking;