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

export interface PopularSkills {
    [key: string]: number,
}

export interface PlottableSkill {
    skill: string,
    count: number,
    fill?: string,
}