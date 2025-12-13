// Demo users for testing - In production, replace with database
export interface User {
    userID: string;
    username: string;
    password: string;
    name: string;
    avatar: string;
    defaultRole: "owner" | "editor" | "reader";
}

export const users: User[] = [
    {
        userID: "user-admin-001",
        username: "admin",
        password: "admin123",
        name: "Admin User",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=admin",
        defaultRole: "owner",
    },
    {
        userID: "user-editor-001",
        username: "editor1",
        password: "editor123",
        name: "Editor One",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=editor1",
        defaultRole: "editor",
    },
    {
        userID: "user-viewer-001",
        username: "viewer1",
        password: "viewer123",
        name: "Viewer One",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=viewer1",
        defaultRole: "reader",
    },
];

// Simple token storage (in-memory) - In production, use Redis or database
export const tokens: Map<string, string> = new Map(); // token -> userID

// Document permissions storage (in-memory)
// Format: { unitID: { userID: role } }
export const documentPermissions: Map<string, Map<string, string>> = new Map();

export function findUserByUsername(username: string): User | undefined {
    return users.find((u) => u.username === username);
}

export function findUserById(userID: string): User | undefined {
    return users.find((u) => u.userID === userID);
}

export function generateToken(): string {
    return `token_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
}
