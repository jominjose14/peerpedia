import { useEffect, useRef, useState, type FormEvent } from "react";
import type { ChatMessage } from "../lib/types";
import { getChatHistory, postChatMessage, type PostChatMessageResponse } from "../lib/requests";
import { toast } from "sonner";
import ChatMessageTile from "./ChatMessageTile";
import Button from "./Button";

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
        <section className="my-8">
            <div className="text-xl sm:text-2xl text-center text-blue-500 font-bold">Chat</div>
            <div ref={chatBox} className="h-140 overflow-y-auto rounded-md border p-5 mt-4 space-y-3">
                {messages.length === 0 ? <p className="text-center text-gray-400"> - No messages yet - </p> : messages.map(message => <ChatMessageTile key={message.id} chatMessage={message} peerId={peerId} peerUsername={peerUsername} />)}
            </div>
            <form onSubmit={onFormSubmit} className="mt-2 flex gap-2 items-center">
                <input type="text" name="chat-message" id="chat-message" value={curMessage} onChange={e => setCurMessage(e.target.value)} placeholder="Type a message" className="w-full rounded-md border px-4 py-2 outline-blue-500" />
                <Button type="submit" disabled={loading} className="box-border p-0 px-2.25 pl-2.5 size-9.5 sm:size-11 sm:px-3 sm:pl-3.25 grid place-items-center">
                    <img src={loading ? "spinner.svg" : "send.svg"} alt="send" height="25px" width="25px" className="size-4.5 sm:size-11 filter brightness-0 invert-100" />
                </Button>
            </form>
        </section>
    );
}

export default Chat;