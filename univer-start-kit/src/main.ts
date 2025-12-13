import "./style.css";
import { setupToolbar } from "./setup-toolbar";
import { setupUniver } from "./setup-univer";

const USIP_SERVER = "http://localhost:3001";

// Check if user is authenticated
async function checkAuth(): Promise<boolean> {
    const token = localStorage.getItem("auth_token");
    if (!token) return false;

    try {
        const response = await fetch(`${USIP_SERVER}/api/me`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.ok;
    } catch {
        return false;
    }
}

// Show login form
function showLoginForm() {
    const app = document.getElementById("app")!;
    app.innerHTML = `
    <div style="
      display: flex; 
      justify-content: center; 
      align-items: center; 
      height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    ">
      <div style="
        background: white; 
        padding: 40px; 
        border-radius: 16px; 
        box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        width: 100%;
        max-width: 400px;
      ">
        <h1 style="margin: 0 0 8px 0; font-size: 28px; text-align: center; color: #333;">
          📊 Univer Sheets
        </h1>
        <p style="margin: 0 0 24px 0; text-align: center; color: #666;">
          Collaborative Spreadsheet Editor
        </p>
        
        <form id="login-form">
          <div style="margin-bottom: 16px;">
            <label style="display: block; margin-bottom: 6px; font-weight: 500; color: #333;">Username</label>
            <input 
              type="text" 
              id="username" 
              placeholder="Enter username"
              style="
                width: 100%; 
                padding: 12px; 
                border: 2px solid #e0e0e0; 
                border-radius: 8px; 
                font-size: 16px;
                box-sizing: border-box;
                transition: border-color 0.2s;
              "
              onfocus="this.style.borderColor='#667eea'"
              onblur="this.style.borderColor='#e0e0e0'"
            />
          </div>
          
          <div style="margin-bottom: 24px;">
            <label style="display: block; margin-bottom: 6px; font-weight: 500; color: #333;">Password</label>
            <input 
              type="password" 
              id="password" 
              placeholder="Enter password"
              style="
                width: 100%; 
                padding: 12px; 
                border: 2px solid #e0e0e0; 
                border-radius: 8px; 
                font-size: 16px;
                box-sizing: border-box;
                transition: border-color 0.2s;
              "
              onfocus="this.style.borderColor='#667eea'"
              onblur="this.style.borderColor='#e0e0e0'"
            />
          </div>
          
          <button 
            type="submit"
            style="
              width: 100%; 
              padding: 14px; 
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white; 
              border: none; 
              border-radius: 8px; 
              font-size: 16px;
              font-weight: 600;
              cursor: pointer;
              transition: transform 0.2s, box-shadow 0.2s;
            "
            onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 20px rgba(102,126,234,0.4)'"
            onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'"
          >
            Sign In
          </button>
          
          <div id="error-msg" style="
            margin-top: 16px; 
            padding: 12px; 
            background: #fff0f0; 
            border-radius: 8px; 
            color: #d32f2f;
            display: none;
            text-align: center;
          "></div>
        </form>
        
        <div style="margin-top: 24px; padding-top: 24px; border-top: 1px solid #e0e0e0;">
          <p style="margin: 0 0 12px 0; font-size: 14px; color: #666; text-align: center;">Demo Accounts:</p>
          <div style="display: grid; gap: 8px; font-size: 13px;">
            <div style="display: flex; justify-content: space-between; padding: 8px 12px; background: #f5f5f5; border-radius: 6px;">
              <span><strong>admin</strong> / admin123</span>
              <span style="color: #4caf50;">Owner</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px 12px; background: #f5f5f5; border-radius: 6px;">
              <span><strong>editor1</strong> / editor123</span>
              <span style="color: #2196f3;">Editor</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px 12px; background: #f5f5f5; border-radius: 6px;">
              <span><strong>viewer1</strong> / viewer123</span>
              <span style="color: #9e9e9e;">Reader</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

    const form = document.getElementById("login-form")!;
    const errorMsg = document.getElementById("error-msg")!;

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const username = (document.getElementById("username") as HTMLInputElement).value;
        const password = (document.getElementById("password") as HTMLInputElement).value;

        try {
            const response = await fetch(`${USIP_SERVER}/api/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (response.ok && data.token) {
                localStorage.setItem("auth_token", data.token);
                localStorage.setItem("user_info", JSON.stringify(data.user));
                window.location.reload();
            } else {
                errorMsg.textContent = data.error || "Login failed";
                errorMsg.style.display = "block";
            }
        } catch (err) {
            errorMsg.textContent = "Cannot connect to server. Make sure USIP server is running on port 3001.";
            errorMsg.style.display = "block";
        }
    });
}

// Initialize Univer editor
function initUniver() {
    // Show user info in header area
    const userInfo = JSON.parse(localStorage.getItem("user_info") || "{}");

    const univerAPI = setupUniver();
    window.univerAPI = univerAPI;

    univerAPI.addEvent(univerAPI.Event.LifeCycleChanged, ({ stage }) => {
        if (stage === univerAPI.Enum.LifecycleStages.Rendered) {
            setupToolbar(univerAPI);

            // Add logout button to toolbar
            setTimeout(() => {
                const toolbar = document.querySelector(".univer-toolbar");
                if (toolbar) {
                    const logoutBtn = document.createElement("button");
                    logoutBtn.innerHTML = `👤 ${userInfo.name || "User"} (${userInfo.role || "unknown"}) | Logout`;
                    logoutBtn.style.cssText =
                        "margin-left: auto; padding: 6px 12px; border: none; background: #f5f5f5; border-radius: 4px; cursor: pointer; font-size: 12px;";
                    logoutBtn.onclick = () => {
                        localStorage.removeItem("auth_token");
                        localStorage.removeItem("user_info");
                        window.location.reload();
                    };
                    toolbar.appendChild(logoutBtn);
                }
            }, 500);
        }
    });
}

// Main entry point
async function main() {
    const isAuthenticated = await checkAuth();

    if (isAuthenticated) {
        initUniver();
    } else {
        showLoginForm();
    }
}

main();
