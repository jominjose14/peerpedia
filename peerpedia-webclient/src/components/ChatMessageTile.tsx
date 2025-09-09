import type { ChatMessage } from "../lib/types";
import { extractUsernameFromToken, isoToDateTime } from "../lib/utils";
import ProcessedChatMessage from "./ProcessedChatMessage";

interface ChatMessageProps {
    chatMessage: ChatMessage,
    peerId: number,
    peerUsername: string,
}

function ChatMessageTile({ chatMessage, peerId, peerUsername }: ChatMessageProps) {
    const isFromPeer: boolean = chatMessage.from === peerId;
    const selfUsername: string = extractUsernameFromToken();

    return (
        <div className={`${isFromPeer ? "mr-auto" : "ml-auto"} w-3/4 shadow-sm rounded-lg px-2 py-1`}>
            <div className="text-blue-500 font-semibold">@{isFromPeer ? peerUsername : selfUsername}</div>
            <div><ProcessedChatMessage msg={chatMessage.message} /></div>
            <div className="mt-2 text-[0.75rem]/[1] font-light text-right">{isoToDateTime(chatMessage.createdAt)}</div>
        </div>
    );
}

export default ChatMessageTile;