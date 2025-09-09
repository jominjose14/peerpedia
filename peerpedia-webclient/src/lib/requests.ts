import { API_URL } from "./constants";
import type { APIResponse, ChatMessage, PopularSkills, User } from "./types";

const errorResponse: APIResponse = {
    success: false,
    message: "Something went wrong, try again later",
};

export async function postLogin(username: string, password: string): Promise<APIResponse> {
    try {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
        });

        if (Math.floor(res.status / 100) === 5) return errorResponse;
        const json: { success: boolean; message: string; token: string; } = await res.json();
        if (json.success) localStorage.setItem('jwt', json.token);
        return json;
    } catch (err) {
        console.log("Login failed");
        console.error(err);
        return errorResponse;
    }
}

export async function postSignup(username: string, password: string): Promise<APIResponse> {
    try {
        const res = await fetch(`${API_URL}/auth/signup`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
        });

        if (Math.floor(res.status / 100) === 5) return errorResponse;
        const json: { success: boolean; message: string; } = await res.json();
        return json;
    } catch (err) {
        console.log("Signup failed");
        console.error(err);
        return errorResponse;
    }
}

export async function getAllSkills(): Promise<string[] | null> {
    try {
        const res = await fetch(`${API_URL}/skills/all`, {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem('jwt')}`,
            }
        });
        if (!res.ok) throw new Error("Request failed");
        const json: { success: boolean, message: string, payload: string[] } = await res.json();
        return json.payload;
    } catch (err) {
        console.error("Failed to get all skills", err);
        return null;
    }
}

export async function getCurrentUser(): Promise<User | null> {
    try {
        const res = await fetch(`${API_URL}/users/self`, {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem('jwt')}`,
            }
        });
        if (!res.ok) throw new Error("Request failed");
        const json: { success: boolean, message: string, payload: User } = await res.json();
        return json.payload;
    } catch (err) {
        console.error("Failed to get current user's details", err);
        return null;
    }
}

export async function getUserById(id: number): Promise<User | null> {
    try {
        const res = await fetch(`${API_URL}/users/by-id/${id}`, {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem('jwt')}`,
            }
        });
        if (!res.ok) throw new Error("Request failed");
        const json: { success: boolean, message: string, payload: User } = await res.json();
        return json.payload;
    } catch (err) {
        console.error("Failed to get user details using id", err);
        return null;
    }
}

export async function postUser(email: string, teachSkills: string[], learnSkills: string[], bio: string): Promise<string> {
    try {
        const res = await fetch(`${API_URL}/users/self`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem('jwt')}`,
            },
            body: JSON.stringify({ email, teachSkills, learnSkills, bio }),
        });

        if (!res.ok) throw new Error("Request failed");
        const json: { success: boolean, message: string } = await res.json();
        return json.message;
    } catch (err) {
        console.error("User update failed", err);
        return "User update failed";
    }
}

export async function getPeers(startId: number, endId: number): Promise<User[] | null> {
    try {
        const res = await fetch(`${API_URL}/users/all?start=${startId}&end=${endId}`, {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem('jwt')}`,
            }
        });
        if (!res.ok) throw new Error("Request failed");
        const json: { success: boolean, message: string, payload: User[] } = await res.json();
        return json.payload;
    } catch (err) {
        console.error("Failed to fetch peers", err);
        return null;
    }
}

export async function getMatchedPeers(startId: number, endId: number): Promise<User[] | null> {
    try {
        const res = await fetch(`${API_URL}/users/match?start=${startId}&end=${endId}`, {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem('jwt')}`,
            }
        });
        if (!res.ok) throw new Error("Request failed");
        const json: { success: boolean, message: string, payload: User[] } = await res.json();
        return json.payload;
    } catch (err) {
        console.error("Failed to fetch peers", err);
        return null;
    }
}

export async function getPeersToTeach(startId: number, endId: number): Promise<User[] | null> {
    try {
        const res = await fetch(`${API_URL}/users/teach?start=${startId}&end=${endId}`, {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem('jwt')}`,
            }
        });
        if (!res.ok) throw new Error("Request failed");
        const json: { success: boolean, message: string, payload: User[] } = await res.json();
        return json.payload;
    } catch (err) {
        console.error("Failed to fetch peers", err);
        return null;
    }
}

export async function getPeersToLearnFrom(startId: number, endId: number): Promise<User[] | null> {
    try {
        const res = await fetch(`${API_URL}/users/learn?start=${startId}&end=${endId}`, {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem('jwt')}`,
            }
        });
        if (!res.ok) throw new Error("Request failed");
        const json: { success: boolean, message: string, payload: User[] } = await res.json();
        return json.payload;
    } catch (err) {
        console.error("Failed to fetch peers", err);
        return null;
    }
}

export async function getChatHistory(startId: number, endId: number, peerId: number): Promise<ChatMessage[] | null> {
    try {
        const res = await fetch(`${API_URL}/chats/history?start=${startId}&end=${endId}&user-id=${peerId}`, {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem('jwt')}`,
            }
        });
        if (!res.ok) throw new Error("Request failed");
        const json: { success: boolean, message: string, payload: ChatMessage[] } = await res.json();
        return json.payload;
    } catch (err) {
        console.error("Failed to fetch chat history", err);
        return null;
    }
}

export interface PostChatMessageResponse {
    success: boolean,
    message: string,
    payload: ChatMessage,
}

export async function postChatMessage(recipientId: number, message: string): Promise<PostChatMessageResponse | null> {
    try {
        const res = await fetch(`${API_URL}/chats/message`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem('jwt')}`,
            },
            body: JSON.stringify({ recipientId, message }),
        });

        if (!res.ok) throw new Error("Request failed");
        const json: PostChatMessageResponse = await res.json();
        return json;
    } catch (err) {
        console.error("Chat message post failed", err);
        return null;
    }
}

export async function getUserCount(): Promise<number | null> {
    try {
        const res = await fetch(`${API_URL}/users/stats/count`, {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem('jwt')}`,
            }
        });
        if (!res.ok) throw new Error("Request failed");
        const json: { success: boolean, message: string, payload: number } = await res.json();
        return json.payload;
    } catch (err) {
        console.error("Failed to get user count", err);
        return null;
    }
}

export async function getMostKnownSkills(): Promise<PopularSkills | null> {
    try {
        const res = await fetch(`${API_URL}/users/stats/teach`, {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem('jwt')}`,
            }
        });
        if (!res.ok) throw new Error("Request failed");
        const json: { success: boolean, message: string, payload: PopularSkills } = await res.json();
        return json.payload;
    } catch (err) {
        console.error("Failed to get most known skills", err);
        return null;
    }
}

export async function getMostSaughtSkills(): Promise<PopularSkills | null> {
    try {
        const res = await fetch(`${API_URL}/users/stats/learn`, {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem('jwt')}`,
            }
        });
        if (!res.ok) throw new Error("Request failed");
        const json: { success: boolean, message: string, payload: PopularSkills } = await res.json();
        return json.payload;
    } catch (err) {
        console.error("Failed to get most saught skills", err);
        return null;
    }
}