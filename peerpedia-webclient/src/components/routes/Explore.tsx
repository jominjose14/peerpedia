import { useEffect, useState, type FormEvent } from "react";
import NavBar from "../NavBar";
import type { User } from "../../lib/types";
import { getAllSkills, getPeers } from "../../lib/requests";
import PeerCard from "../PeerCard";
import { toast } from "sonner";
import Fullscreen from "../Fullscreen";
import Main from "../Main";
import Spinner from "../Spinner";
import Page from "../Page";
import Header from "../Header";
import Intro from "../Intro";
import Button from "../Button";
import { MultiSelect, MultiSelectContent, MultiSelectItem, MultiSelectTrigger, MultiSelectValue } from "../ui/multi-select";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import Separator from "../Separator";

function Explore() {
    const [loading, setLoading] = useState<boolean>(false);
    const [skills, setSkills] = useState<string[]>([]);
    const [peers, setPeers] = useState<User[]>([]);
    const [username, setUsername] = useState<string>("");
    const [teachSkills, setTeachSkills] = useState<string[]>([]);
    const [learnSkills, setLearnSkills] = useState<string[]>([]);
    const [count, setCount] = useState<number>(10);
    const [searchError, setSearchError] = useState<string>("");

    useEffect(() => {
        init();
    }, []);

    async function init() {
        await loadSkills();
        await loadPeers();
    }

    async function loadSkills() {
        setLoading(true);
        const fetchedSkills: string[] | null = await getAllSkills();
        if (fetchedSkills === null) {
            setLoading(false);
            return;
        }

        setSkills(fetchedSkills);
        setLoading(false);
    }

    async function loadPeers() {
        setLoading(true);

        const fetchedPeers: User[] | null = await getPeers(username, teachSkills, learnSkills, count);
        if (fetchedPeers === null) {
            setLoading(false);
            toast("Failed to fetch peers");
            return;
        }

        if (fetchedPeers.length === 0) {
            setPeers([]);
            setLoading(false);
            toast("No peers matched search criteria");
            return;
        }

        setPeers(fetchedPeers);
        setLoading(false);
    }

    async function onFormSubmit(event: FormEvent) {
        event.preventDefault();
        setSearchError("");
        setLoading(true);

        // form validation
        if (10 < teachSkills.length) {
            setSearchError('You cannot choose more than 10 teach skills');
            setLoading(false);
            return;
        } else if (10 < learnSkills.length) {
            setSearchError('You cannot choose more than 10 learn skills');
            setLoading(false);
            return;
        }

        loadPeers();
        setLoading(false);
    }

    return (
        <Fullscreen>
            <Page>
                <Header iconSrc="explore.svg" iconStyles="pt-1 scale-111" text="Explore" />
                <Main>
                    <Intro text="Peerpedia's search engine" />
                    <form onSubmit={onFormSubmit} className="space-y-4 w-15/16 sm:w-13/16 mx-auto text-[0.9rem]/[1] sm:text-[1.05rem]/[1.25] my-6">
                        <div className="flex gap-4">
                            <input type="text" name="username" id="explore-username" placeholder="Search username" spellCheck="false" value={username} onChange={e => setUsername(e.target.value)} className="w-full rounded-full border px-4 py-2 outline-blue-500" />
                            <Button type="submit" disabled={loading} className="p-2.5">
                                <img src={loading ? "spinner.svg" : "search.svg"} alt="search" height="25px" width="25px" className="filter brightness-0 invert-100" />
                            </Button>
                        </div>
                        {searchError && <p className="text-sm text-red-500 text-center">{searchError}</p>}

                        <Collapsible className="text-center px-2 sm:px-0">
                            <CollapsibleTrigger className="text-center cursor-pointer text-blue-500 rounded-sm px-2 pt-1 pb-1.5 hover:bg-blue-50 transition">Filters</CollapsibleTrigger>
                            <CollapsibleContent className="text-left space-y-2.5">
                                <div className="space-y-1.5">
                                    <label className="block text-blue-500 font-semibold">Teach skills</label>
                                    <MultiSelect values={teachSkills} onValuesChange={setTeachSkills} >
                                        <MultiSelectTrigger className="w-full text-[0.9rem]/[1] sm:text-[1.05rem]/[1.25]">
                                            <MultiSelectValue placeholder="All" />
                                        </MultiSelectTrigger>
                                        <MultiSelectContent className="text-[0.9rem]/[1] sm:text-[1.05rem]/[1.25] text-gray-600">
                                            {skills.map((skill, idx) => <MultiSelectItem key={idx} value={skill} className="text-[0.9rem]/[1] sm:text-[1.05rem]/[1.25]">{skill}</MultiSelectItem>)}
                                        </MultiSelectContent>
                                    </MultiSelect>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="block text-blue-500 font-semibold">Learn skills</label>
                                    <MultiSelect values={learnSkills} onValuesChange={setLearnSkills}>
                                        <MultiSelectTrigger className="w-full text-[0.9rem]/[1] sm:text-[1.05rem]/[1.25]">
                                            <MultiSelectValue placeholder="All" />
                                        </MultiSelectTrigger>
                                        <MultiSelectContent className="text-[0.9rem]/[1] sm:text-[1.05rem]/[1.25] text-gray-600">
                                            {skills.map((skill, idx) => <MultiSelectItem key={idx} value={skill} className="text-[0.9rem]/[1] sm:text-[1.05rem]/[1.25]">{skill}</MultiSelectItem>)}
                                        </MultiSelectContent>
                                    </MultiSelect>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="block text-blue-500 font-semibold">Results</label>
                                    <Select value={'' + count} onValueChange={value => setCount(parseInt(value))}>
                                        <SelectTrigger className="w-full rounded-md border focus:border-blue-500 outline-none px-3 py-1.75 text-md">
                                            <SelectValue placeholder="Number of results" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="10" className="text-md">10</SelectItem>
                                            <SelectItem value="20" className="text-md">20</SelectItem>
                                            <SelectItem value="50" className="text-md">50</SelectItem>
                                            <SelectItem value="100" className="text-md">100</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </CollapsibleContent>
                        </Collapsible>
                    </form>
                    {0 < peers.length && (
                        <>
                            <Separator />
                            <div className="p-4 flex flex-col gap-4">
                                {peers.map(peer => <PeerCard key={peer.id} peer={peer} />)}
                            </div>
                        </>
                    )}
                </Main>
            </Page>
            <NavBar />
            <Spinner loading={loading} />
        </Fullscreen>
    )
}

export default Explore;