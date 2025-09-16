import { Link } from "react-router-dom";
import type { User } from "../lib/types";
import LetterImage from "./LetterImage";
import Badge from "./Badge";
import { useWindowDimensions } from "@/lib/hooks";

const smartphoneWidthBreakpoint = 768;

interface PeerCardProps {
    peer: User,
}

function PeerCard({ peer }: PeerCardProps) {
    const { width } = useWindowDimensions();

    if (width <= smartphoneWidthBreakpoint) {
        return (
            <Link to={`/peer?id=${peer.id}`}>
                <div className="space-y-6 p-6 rounded-xl border-[2px] border-gray-100 shadow-md cursor-pointer hover:scale-102 transition">
                    <div className="flex gap-6 items-center justify-center">
                        <div className="flex flex-col items-center gap-2">
                            <LetterImage username={peer.username} variant="large" />
                            <div className="text-gray-700">@{peer.username}</div>
                        </div>
                        <div className="text-sm line-clamp-5">{peer.bio ? peer.bio : "-"}</div>
                    </div>
                    {/* <div className="flex flex-col gap-2">
                        <div className="flex gap-1 items-center flex-wrap">
                            <div className="text-sm mr-1 w-full">I can Teach: </div>
                            {peer.teachSkills ? peer.teachSkills.slice(0, 5).map((skill, idx) => <Badge key={idx} text={skill} variant="small" />) : "-"}
                        </div>
                        <div className="flex gap-1 items-center flex-wrap">
                            <div className="text-sm mr-1 w-full">I want to Learn: </div>
                            {peer.learnSkills ? peer.learnSkills.slice(0, 5).map((skill, idx) => <Badge key={idx} text={skill} variant="small" />) : "-"}
                        </div>
                    </div> */}
                </div>
            </Link>
        );
    } else {
        return (
            <Link to={`/peer?id=${peer.id}`}>
                <div className="flex items-center gap-6 p-6 rounded-xl border-[2px] border-gray-100 shadow-md cursor-pointer hover:scale-102 transition">
                    <div className="flex flex-col items-center gap-2">
                        <LetterImage username={peer.username} variant="large" />
                        <div className="text-gray-700">@{peer.username}</div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <div className="flex gap-1 items-center flex-wrap">
                            <div className="text-[1rem] w-fit mr-2">Teach: </div>
                            {peer.teachSkills ? peer.teachSkills.slice(0, 5).map((skill, idx) => <Badge key={idx} text={skill} variant="large" />) : "-"}
                        </div>
                        <div className="flex gap-1 items-center flex-wrap">
                            <div className="text-[1rem] w-fit mr-2">Learn: </div>
                            {peer.learnSkills ? peer.learnSkills.slice(0, 5).map((skill, idx) => <Badge key={idx} text={skill} variant="large" />) : "-"}
                        </div>
                        <div className="mt-2 text-[1rem] line-clamp-2">{peer.bio ? peer.bio : "-"}</div>
                    </div>
                </div>
            </Link>
        );
    }
}

export default PeerCard;