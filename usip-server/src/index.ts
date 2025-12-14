import express from "express";
import cors from "cors";
import authRouter from "./routes/auth.js";
import usipRouter from "./routes/usip.js";

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(
    cors({
        origin: "*", // Allow all origins for development
        credentials: true,
    })
);
app.use(express.json());

// Request logging
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
});

// Routes
app.use("/api", authRouter); // /api/login, /api/logout, /api/me
app.use("/usip", usipRouter); // /usip/credential, /usip/userinfo, /usip/role, /usip/collaborators

// Health check
app.get("/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════════════════════════╗
║                     USIP Server Started                    ║
╠════════════════════════════════════════════════════════════╣
║  Port: ${PORT}                                                ║
║                                                            ║
║  Demo Users:                                               ║
║    - admin / admin123    (owner)                           ║
║    - editor1 / editor123 (editor)                          ║
║    - viewer1 / viewer123 (reader)                          ║
║                                                            ║
║  Endpoints:                                                ║
║    POST /api/login       - Login                           ║
║    POST /api/logout      - Logout                          ║
║    GET  /api/me          - Current user                    ║
║    POST /usip/credential - USIP auth                       ║
║    POST /usip/userinfo   - USIP user info                  ║
║    GET  /usip/role       - USIP role check                 ║
║    GET  /usip/collaborators - USIP collaborators           ║
╚════════════════════════════════════════════════════════════╝
  `);
});
