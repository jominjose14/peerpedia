import { Link } from "react-router-dom";
import type { User } from "../lib/types";
import LetterImage from "./LetterImage";
import Badge from "./Badge";

interface PeerCardProps {
    peer: User,
}

function PeerCard({ peer }: PeerCardProps) {
    return (
        <Link to={`/peer?id=${peer.id}`}>
            <div className="flex items-center gap-5 p-6 rounded-md border-[2px] border-gray-100 shadow-md cursor-pointer hover:scale-102 transition">
                <div className="flex flex-col items-center gap-2">
                    <LetterImage username={peer.username} variant="large" />
                    <div>@{peer.username}</div>
                </div>
                <div className="flex flex-col gap-2">
                    <div className="flex gap-1 items-center flex-wrap">
                        <div className="text-[0.8rem]/[1] mr-1 w-full sm:w-fit sm:mr-2">Teach: </div>
                        {peer.teachSkills ? peer.teachSkills.slice(0, 5).map((skill, idx) => <Badge key={idx} text={skill} variant="small" />) : "-"}
                    </div>
                    <div className="flex gap-1 items-center flex-wrap">
                        <div className="text-[0.8rem]/[1] mr-1 w-full sm:w-fit sm:mr-2">Learn: </div>
                        {peer.learnSkills ? peer.learnSkills.slice(0, 5).map((skill, idx) => <Badge key={idx} text={skill} variant="small" />) : "-"}
                    </div>
                    <div className="mt-2 text-sm line-clamp-1 sm:line-clamp-2">{peer.bio ? peer.bio : "-"}</div>
                </div>
            </div>
        </Link>
    );
}

export default PeerCard;