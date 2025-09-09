export interface User {
    id: number,
    username: string,
    email: string,
    teachSkills: string[],
    learnSkills: string[],
    bio: string,
}

export interface ChatMessage {
    id: number,
    from: number,
    to: number,
    createdAt: string,
    message: string,
}

export interface APIResponse {
    success: boolean,
    message: string,
}