import { Router, Request, Response } from "express";
import { tokens, findUserById, documentPermissions, users } from "../data/users.js";

const router = Router();

/**
 * USIP Credential endpoint
 * Called by Univer Server to authenticate user from request headers
 * Must return: { user: { userID, name, avatar } }
 */
router.get("/credential", (req: Request, res: Response) => {
    console.log("[USIP] /credential called");
    console.log("[USIP] Headers:", JSON.stringify(req.headers, null, 2));

    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
        console.log("[USIP] No Bearer token found");
        res.status(401).json({ error: "No authorization header" });
        return;
    }

    const token = authHeader.substring(7);
    const userID = tokens.get(token);

    if (!userID) {
        console.log("[USIP] Invalid token:", token);
        res.status(401).json({ error: "Invalid token" });
        return;
    }

    const user = findUserById(userID);

    if (!user) {
        console.log("[USIP] User not found for ID:", userID);
        res.status(401).json({ error: "User not found" });
        return;
    }

    console.log("[USIP] Authenticated user:", user.name);

    res.json({
        user: {
            userID: user.userID,
            name: user.name,
            avatar: user.avatar,
        },
    });
});

/**
 * USIP UserInfo endpoint
 * Get user information in batches
 * Input: { userIDs: string[] }
 * Output: { users: [{ userID, name, avatar }] }
 */
router.post("/userinfo", (req: Request, res: Response) => {
    console.log("[USIP] /userinfo called");

    const { userIDs } = req.body as { userIDs: string[] };

    if (!userIDs || !Array.isArray(userIDs)) {
        res.status(400).json({ error: "userIDs array required" });
        return;
    }

    const result = userIDs.map((userID) => {
        const user = findUserById(userID);
        if (user) {
            return {
                userID: user.userID,
                name: user.name,
                avatar: user.avatar,
            };
        }
        return {
            userID,
            name: "Unknown User",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=unknown",
        };
    });

    res.json({ users: result });
});

/**
 * USIP Role endpoint
 * Get user's permission role on a specific document
 * Query params: unitID, userID
 * Output: { userID, role } where role is 'owner' | 'editor' | 'reader'
 */
router.get("/role", (req: Request, res: Response) => {
    console.log("[USIP] /role called");

    const { unitID, userID } = req.query as { unitID: string; userID: string };

    if (!unitID || !userID) {
        res.status(400).json({ error: "unitID and userID required" });
        return;
    }

    // Check document-specific permissions first
    const docPerms = documentPermissions.get(unitID);
    if (docPerms?.has(userID)) {
        const role = docPerms.get(userID)!;
        console.log(`[USIP] Found specific permission for ${userID} on ${unitID}: ${role}`);
        res.json({ userID, role });
        return;
    }

    // Fall back to user's default role
    const user = findUserById(userID);
    if (user) {
        console.log(`[USIP] Using default role for ${userID}: ${user.defaultRole}`);
        res.json({ userID, role: user.defaultRole });
        return;
    }

    // Unknown user - give reader role
    console.log(`[USIP] Unknown user ${userID}, assigning reader role`);
    res.json({ userID, role: "reader" });
});

/**
 * USIP Collaborators endpoint
 * Get list of collaborators for a document
 * Query params: unitIDs (comma-separated)
 * Output: { collaborators: [{ unitID, subjects: [{ subjectID, role }] }] }
 */
router.get("/collaborators", (req: Request, res: Response) => {
    console.log("[USIP] /collaborators called");

    const unitIDsParam = req.query.unitIDs as string;

    if (!unitIDsParam) {
        res.status(400).json({ error: "unitIDs required" });
        return;
    }

    const unitIDs = unitIDsParam.split(",");

    const collaborators = unitIDs.map((unitID) => {
        const docPerms = documentPermissions.get(unitID);

        if (docPerms) {
            const subjects = Array.from(docPerms.entries()).map(([subjectID, role]) => ({
                subjectID,
                role,
            }));
            return { unitID, subjects };
        }

        // If no specific permissions, return all users with their default roles
        return {
            unitID,
            subjects: users.map((u) => ({
                subjectID: u.userID,
                role: u.defaultRole,
            })),
        };
    });

    res.json({ collaborators });
});

/**
 * Helper endpoint to set document permissions
 * POST /usip/set-permission
 * Body: { unitID, userID, role }
 */
router.post("/set-permission", (req: Request, res: Response) => {
    const { unitID, userID, role } = req.body;

    if (!unitID || !userID || !role) {
        res.status(400).json({ error: "unitID, userID, and role required" });
        return;
    }

    if (!["owner", "editor", "reader"].includes(role)) {
        res.status(400).json({ error: "Invalid role" });
        return;
    }

    let docPerms = documentPermissions.get(unitID);
    if (!docPerms) {
        docPerms = new Map();
        documentPermissions.set(unitID, docPerms);
    }

    docPerms.set(userID, role);

    console.log(`[USIP] Set permission: ${userID} is ${role} on ${unitID}`);
    res.json({ success: true });
});

export default router;
