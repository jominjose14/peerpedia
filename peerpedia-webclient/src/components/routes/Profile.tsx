import { useEffect, useState, type FormEvent } from "react";
import NavBar from "../NavBar";
import { emailRegex } from "../../lib/constants";
import { MultiSelect, MultiSelectContent, MultiSelectItem, MultiSelectTrigger, MultiSelectValue } from "../ui/multi-select";
import { doesIntersect, extractUsernameFromToken } from "../../lib/utils";
import { getAllSkills, getContacts, getCurrentUser, postUser } from "../../lib/requests";
import type { User } from "../../lib/types";
import { toast } from "sonner";
import LetterImage from "../LetterImage";
import { useNavigate } from "react-router-dom";
import Fullscreen from "../Fullscreen";
import Spinner from "../Spinner";
import Main from "../Main";
import Page from "../Page";
import Header from "../Header";
import Button from "../Button";
import Separator from "../Separator";
import PeerCard from "../PeerCard";
import Intro from "../Intro";

const bioCharsLimit = 500;

function Profile() {
    const [loading, setLoading] = useState<boolean>(false);
    const [skills, setSkills] = useState<string[]>([]);
    const [contacts, setContacts] = useState<User[]>([]);
    const [email, setEmail] = useState<string>('');
    const [teachSkills, setTeachSkills] = useState<string[]>([]);
    const [learnSkills, setLearnSkills] = useState<string[]>([]);
    const [bio, setBio] = useState<string>('');
    const [profileError, setProfileError] = useState<string>('');
    const navigate = useNavigate();

    const username: string = extractUsernameFromToken();
    const bioCharsLeft: number = Math.max(0, bioCharsLimit - bio.length);

    useEffect(() => {
        init();
    }, []);

    async function init() {
        await loadCurUser();
        await loadSkills();
        await loadContacts();
    }

    async function loadCurUser() {
        setLoading(true);
        const curUser: User | null = await getCurrentUser();
        if (curUser === null) {
            setLoading(false);
            return;
        }

        setEmail(curUser.email || "");
        setTeachSkills(curUser.teachSkills || []);
        setLearnSkills(curUser.learnSkills || []);
        setBio(curUser.bio || "");
        setLoading(false);
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

    async function loadContacts() {
        setLoading(true);
        const fetchedContacts: User[] | null = await getContacts(1, 999_999);
        if (fetchedContacts === null) {
            setLoading(false);
            return;
        }

        // setContacts(contacts => [...contacts, ...fetchedContacts]);
        setContacts(fetchedContacts);
        setLoading(false);
    }

    async function onFormSubmit(event: FormEvent) {
        event.preventDefault();
        setLoading(true);

        // form validation
        if (email !== "" && !emailRegex.test(email)) {
            setProfileError('Invalid email');
            setLoading(false);
            return;
        } else if (10 < teachSkills.length) {
            setProfileError('You cannot choose more than 10 skills to teach');
            setLoading(false);
            return;
        } else if (10 < learnSkills.length) {
            setProfileError('You cannot choose more than 10 skills to learn');
            setLoading(false);
            return;
        } else if (doesIntersect(teachSkills, learnSkills)) {
            setProfileError('You cannot teach and learn the same skill');
            setLoading(false);
            return;
        } else if (500 < bio.length) {
            setProfileError('Bio must be less than 500 characters long');
            setLoading(false);
            return;
        }

        const message: string = await postUser(email, teachSkills, learnSkills, bio);
        toast(message);
        setProfileError('');
        setLoading(false);
    }

    function logout() {
        localStorage.removeItem('jwt');
        navigate('/login');
    }

    function getBioCharsLeftColor(): string {
        if (bioCharsLeft < 10) {
            return "text-red-500";
        } else {
            return "text-blue-500";
        }
    }

    return (
        <Fullscreen>
            <Page>
                <Header iconSrc="profile.svg" iconStyles="scale-111" text="Profile" />
                <Main className="pt-8 px-8 pb-24">
                    <div className="flex items-center justify-center gap-2 px-0 sm:px-16 mt-5 mb-12">
                        <LetterImage username={username} variant="small" />
                        <div>Logged in as <span className="text-blue-500 font-semibold">{username}</span></div>
                        <button onClick={logout} className="text-center ml-auto cursor-pointer text-blue-500 font-semibold rounded-sm px-2 pt-1 pb-1.5 hover:bg-blue-50 transition">Logout</button>
                    </div>
                    <form className="flex flex-col gap-1 px-0 sm:px-16" onSubmit={onFormSubmit}>
                        <label htmlFor="profile-email" className="text-blue-500 font-semibold">Email</label>
                        <input type="text" name="email" id="profile-email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="rounded-md border focus:border-blue-500 outline-none px-3 py-1.5" />

                        <label htmlFor="profile-teach" className="mt-3 text-blue-500 font-semibold">I can teach</label>
                        <MultiSelect values={teachSkills} onValuesChange={setTeachSkills} >
                            <MultiSelectTrigger className="w-full text-lg">
                                <MultiSelectValue placeholder="Select skills you can teach" />
                            </MultiSelectTrigger>
                            <MultiSelectContent className="text-md">
                                {skills.map((skill, idx) => <MultiSelectItem key={idx} value={skill} className="text-md">{skill}</MultiSelectItem>)}
                            </MultiSelectContent>
                        </MultiSelect>

                        <label htmlFor="profile-learn" className="mt-3 text-blue-500 font-semibold">I want to learn</label>
                        <MultiSelect values={learnSkills} onValuesChange={setLearnSkills}>
                            <MultiSelectTrigger className="w-full text-lg">
                                <MultiSelectValue placeholder="Select skills you want to learn" />
                            </MultiSelectTrigger>
                            <MultiSelectContent className="text-md">
                                {skills.map((skill, idx) => <MultiSelectItem key={idx} value={skill} className="text-md">{skill}</MultiSelectItem>)}
                            </MultiSelectContent>
                        </MultiSelect>

                        <label htmlFor="profile-bio" className="mt-3 text-blue-500 font-semibold">Bio</label>
                        <div className="rounded-md border px-4 py-2.5 focus-within:border-blue-500">
                            <textarea name="bio" id="profile-bio" rows={9} placeholder="Tell the world a little about how well you know the skills you teach and what interests you about the skills you wish to learn" value={bio} onChange={(e) => setBio(e.target.value.substring(0, bioCharsLimit))} className="w-full outline-none" />
                            <div className={`${getBioCharsLeftColor()} text-xs font-semibold text-right`}>
                                {bioCharsLeft}
                            </div>
                        </div>

                        {profileError && <p className="text-red-500 text-center my-4">{profileError}</p>}
                        <Button type="submit" disabled={loading} className="w-1/3 sm:w-1/4 mt-2 self-center">Save</Button>
                    </form>
                    <Separator className="mt-14 mb-12" />
                    <div className="text-xl sm:text-3xl text-center text-blue-500 font-bold mb-4">Contacts</div>
                    <Intro text="Resume your chat with peers" />
                    <div className="p-4 flex flex-col gap-4">
                        {contacts.map(contact => <PeerCard key={contact.id} peer={contact} />)}
                    </div>
                </Main>
            </Page>
            <NavBar />
            <Spinner loading={loading} />
        </Fullscreen>
    )
}

export default Profile;