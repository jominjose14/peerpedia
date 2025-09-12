import { useEffect, useRef, useState, type FormEvent } from "react";
import type { ChatMessage } from "../lib/types";
import { getChatHistory, postChatMessage, type PostChatMessageResponse } from "../lib/requests";
import { toast } from "sonner";
import ChatMessageTile from "./ChatMessageTile";

interface ChatProps {
    peerId: number,
    peerUsername: string,
}

function Chat({ peerId, peerUsername }: ChatProps) {
    if (peerId <= 0) return null;

    const [loading, setLoading] = useState<boolean>(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [curMessage, setCurMessage] = useState<string>("");
    const chatBox = useRef<HTMLDivElement>(null);

    const oldestMessageId = 0 < messages.length ? messages[0].id : 1_000_000_000;

    useEffect(() => {
        refreshChat();
        const intervalId = setInterval(() => refreshChat(), 15_000);
        return () => clearInterval(intervalId);
    }, [peerId]);

    useEffect(() => {
        if (chatBox && chatBox.current) chatBox.current.scrollTop = chatBox.current.scrollHeight;
    }, [messages]);

    async function refreshChat() {
        if (peerId <= 0) return;

        setLoading(true);
        const fetchedMessages: ChatMessage[] | null = await getChatHistory(1, oldestMessageId - 1, peerId);
        if (fetchedMessages === null) {
            setLoading(false);
            return;
        }

        setMessages(messages => {
            if (messages.length === 0 && 0 < fetchedMessages.length || 0 < messages.length && 0 < fetchedMessages.length && messages[messages.length - 1].id !== fetchedMessages[fetchedMessages.length - 1].id) {
                return fetchedMessages;
            } else {
                return messages;
            }
        });

        setLoading(false);
    }

    async function onFormSubmit(event: FormEvent) {
        event.preventDefault();
        if (curMessage === "") return;
        setLoading(true);

        const response: PostChatMessageResponse | null = await postChatMessage(peerId, curMessage);
        if (response === null) {
            toast("Something went wrong");
        } else if (!response.success) {
            toast(response.message);
        } else {
            setMessages(messages => [...messages, response.payload]);
            setCurMessage("");
        }

        setLoading(false);
    }

    return (
        <section className="mt-8">
            <div className="text-lg text-center text-blue-500 font-semibold">Chat</div>
            <div ref={chatBox} className="h-110 overflow-y-auto rounded-md border p-4 mt-4 space-y-2">
                {messages.length === 0 ? <p className="text-center text-gray-400"> - No messages yet - </p> : messages.map(message => <ChatMessageTile key={message.id} chatMessage={message} peerId={peerId} peerUsername={peerUsername} />)}
            </div>
            <form onSubmit={onFormSubmit} className="mt-2">
                <input type="text" name="chat-message" id="chat-message" value={curMessage} onChange={e => setCurMessage(e.target.value)} placeholder="Type a message" className="w-full rounded-md border px-4 py-2 outline-blue-500" />
                <button type="submit" disabled={loading} className="w-1/3 font-semi-bold mt-2 block mx-auto cursor-pointer px-2 py-2.5 bg-blue-500 hover:bg-blue-400 transition text-blue-50 rounded-4xl">Send</button>
            </form>
        </section>
    );
}

export default Chat;