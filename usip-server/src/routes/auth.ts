import { Router, Request, Response } from "express";
import { findUserByUsername, findUserById, tokens, generateToken } from "../data/users.js";

const router = Router();

// Login endpoint
router.post("/login", (req: Request, res: Response) => {
    const { username, password } = req.body;

    if (!username || !password) {
        res.status(400).json({ error: "Username and password required" });
        return;
    }

    const user = findUserByUsername(username);

    if (!user || user.password !== password) {
        res.status(401).json({ error: "Invalid credentials" });
        return;
    }

    // Generate token and store mapping
    const token = generateToken();
    tokens.set(token, user.userID);

    res.json({
        success: true,
        token,
        user: {
            userID: user.userID,
            name: user.name,
            avatar: user.avatar,
            role: user.defaultRole,
        },
    });
});

// Logout endpoint
router.post("/logout", (req: Request, res: Response) => {
    const authHeader = req.headers.authorization;

    if (authHeader?.startsWith("Bearer ")) {
        const token = authHeader.substring(7);
        tokens.delete(token);
    }

    res.json({ success: true });
});

// Get current user info
router.get("/me", (req: Request, res: Response) => {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
        res.status(401).json({ error: "Not authenticated" });
        return;
    }

    const token = authHeader.substring(7);
    const userID = tokens.get(token);

    if (!userID) {
        res.status(401).json({ error: "Invalid token" });
        return;
    }

    const user = findUserById(userID);

    if (!user) {
        res.status(401).json({ error: "User not found" });
        return;
    }

    res.json({
        userID: user.userID,
        name: user.name,
        avatar: user.avatar,
        role: user.defaultRole,
    });
});

export default router;
