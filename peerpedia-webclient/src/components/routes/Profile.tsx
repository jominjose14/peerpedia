import { useEffect, useState, type FormEvent } from "react";
import NavBar from "../NavBar";
import { emailRegex } from "../../lib/constants";
import { MultiSelect, MultiSelectContent, MultiSelectItem, MultiSelectTrigger, MultiSelectValue } from "../ui/multi-select";
import { doesIntersect, extractUsernameFromToken } from "../../lib/utils";
import { getAllSkills, getCurrentUser, postUser } from "../../lib/requests";
import type { User } from "../../lib/types";
import { toast } from "sonner";
import LetterImage from "../LetterImage";
import { useNavigate } from "react-router-dom";
import Fullscreen from "../Fullscreen";
import Spinner from "../Spinner";
import Main from "../Main";

const bioCharsLimit = 500;

function Profile() {
    const [loading, setLoading] = useState<boolean>(false);
    const [skills, setSkills] = useState<string[]>([]);
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

    async function onFormSubmit(event: FormEvent) {
        event.preventDefault();

        // form validation
        if (email !== "" && !emailRegex.test(email)) {
            setProfileError('Invalid email');
            return;
        } else if (10 < teachSkills.length) {
            setProfileError('You cannot choose more than 10 skills to teach');
            return;
        } else if (10 < learnSkills.length) {
            setProfileError('You cannot choose more than 10 skills to learn');
            return;
        } else if (doesIntersect(teachSkills, learnSkills)) {
            setProfileError('You cannot teach and learn the same skill');
            return;
        } else if (500 < bio.length) {
            setProfileError('Bio must be less than 500 characters long');
            return;
        }

        const message: string = await postUser(email, teachSkills, learnSkills, bio);
        toast(message);
        setProfileError('');
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
            <Main className="pt-8 px-8 pb-24">
                <header className="flex gap-2 items-center justify-center mb-10">
                    <img src="profile.svg" alt="profile icon" height="30px" width="30px" />
                    <h1 className="text-2xl">Profile</h1>
                </header>
                <div className="flex items-center justify-center gap-2 px-0 sm:px-16 mb-10">
                    <LetterImage username={username} variant="small" />
                    <div>Logged in as <span className="text-blue-500 font-semibold">{username}</span></div>
                    <button onClick={logout} className="text-center ml-auto cursor-pointer text-blue-500 font-semibold rounded-sm px-2 pt-1 pb-1.5 hover:bg-blue-50 transition">Logout</button>
                </div>
                <form className="flex flex-col gap-1 px-0 sm:px-16" onSubmit={onFormSubmit}>
                    <label htmlFor="profile-email" className="text-blue-500 font-semibold">Email</label>
                    <input type="text" name="email" id="profile-email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="rounded-md border focus:border-blue-500 outline-none px-3 py-1.5" />

                    <label htmlFor="profile-teach" className="mt-3 text-blue-500 font-semibold">I can teach</label>
                    <MultiSelect values={teachSkills} onValuesChange={setTeachSkills} >
                        <MultiSelectTrigger className="w-full">
                            <MultiSelectValue placeholder="Select skills you can teach" />
                        </MultiSelectTrigger>
                        <MultiSelectContent>
                            {skills.map((skill, idx) => <MultiSelectItem key={idx} value={skill}>{skill}</MultiSelectItem>)}
                        </MultiSelectContent>
                    </MultiSelect>

                    <label htmlFor="profile-learn" className="mt-3 text-blue-500 font-semibold">I want to learn</label>
                    <MultiSelect values={learnSkills} onValuesChange={setLearnSkills}>
                        <MultiSelectTrigger className="w-full">
                            <MultiSelectValue placeholder="Select skills you want to learn" />
                        </MultiSelectTrigger>
                        <MultiSelectContent>
                            {skills.map((skill, idx) => <MultiSelectItem key={idx} value={skill}>{skill}</MultiSelectItem>)}
                        </MultiSelectContent>
                    </MultiSelect>

                    <label htmlFor="profile-bio" className="mt-3 text-blue-500 font-semibold">Bio</label>
                    <div className="rounded-md border px-4 py-2.5 focus-within:border-blue-500">
                        <textarea name="bio" id="profile-bio" rows={9} placeholder="Tell the world a little about how well you know the skills you teach and what interests you about the skills you wish to learn" value={bio} onChange={(e) => setBio(e.target.value.substring(0, bioCharsLimit))} className="w-full outline-none" />
                        <div className={`${getBioCharsLeftColor()} text-xs font-semibold text-right`}>
                            {bioCharsLeft}
                        </div>
                    </div>

                    {profileError && <p className="text-sm text-red-500">{profileError}</p>}
                    <button type="submit" disabled={loading} className="w-1/3 font-semi-bold mt-2 self-center cursor-pointer px-2 py-2.5 bg-blue-500 hover:bg-blue-400 transition text-blue-50 rounded-4xl">Save</button>
                </form>
            </Main>
            <NavBar />
            <Spinner loading={loading} />
        </Fullscreen>
    )
}

export default Profile;