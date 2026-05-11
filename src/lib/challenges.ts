import { Challenge } from "@/types";

export const initialChallenges: Challenge[] = [
  // A02:2025 Security Misconfiguration
  {
    id: "a02-1",
    name: "Default Administrative Credentials",
    category: "A02:2025",
    difficulty: "Easy",
    points: 100,
    goal: "Access the Grafana dashboard using default manufacturing credentials.",
    cwe: ["CWE-1188", "CWE-16"],
    description: "A monitoring node was recently deployed but left with its initial setup password. Identify the default credentials from the documentation and gain admin access.",
    flagHash: ""
  },
  {
    id: "a02-2",
    name: "Exposed Asset Directory",
    category: "A02:2025",
    difficulty: "Easy",
    points: 150,
    goal: "Identify sensitive server backups via an incorrectly configured directory index.",
    cwe: ["CWE-548"],
    description: "The static asset server allows directory listing. Locate the hidden backup files in the infrastructure paths to retrieve sensitive connection strings.",
    flagHash: "" 
  },
  {
    id: "a02-3",
    name: "Information Leakage via Errors",
    category: "A02:2025",
    difficulty: "Medium",
    points: 250,
    goal: "Trigger a verbose server error to leak internal configuration and credentials.",
    cwe: ["CWE-209", "CWE-200"],
    description: "The internal search portal is running in debug mode. Manipulate the search query to trigger a stack trace and extract the production environment variables.",
    flagHash: "" 
  },
  
  // A06:2025 Insecure Design (Focus on Business Logic)
  {
    id: "a06-1",
    name: "Recovery Logic Flaw",
    category: "A06:2025",
    difficulty: "Easy",
    points: 150,
    goal: "Exploit predictable security questions to take over a high-privilege account.",
    cwe: ["CWE-640"],
    description: "The CEO's password recovery process relies on personal security questions. Perform OSINT to find the answers and reset his password.",
    flagHash: "" 
  },
  {
    id: "a06-2",
    name: "Price Manipulation",
    category: "A06:2025",
    difficulty: "Medium",
    points: 250,
    goal: "Tamper with client-side price parameters to purchase items for free.",
    cwe: ["CWE-501", "CWE-602"],
    description: "The e-commerce checkout process trusts the price sent from the client. Intercept the request and modify the price before the payment is processed.",
    flagHash: "" 
  },
  {
    id: "a06-3",
    name: "Race Condition Logic",
    category: "A06:2025",
    difficulty: "Medium",
    points: 350,
    goal: "Exploit a timing window to duplicate account balance or rewards.",
    cwe: ["CWE-362"],
    description: "The reward redemption system has a race condition flaw. Send concurrent requests to redeem points and receive multiple vouchers for a single balance.",
    flagHash: "" 
  },
  {
    id: "a06-4",
    name: "Logic-Based Privilege Escalation",
    category: "A06:2025",
    difficulty: "Hard",
    points: 550,
    goal: "Manipulate account registration parameters to grant yourself admin rights.",
    cwe: ["CWE-269", "CWE-639"],
    description: "The user profile update API doesn't validate the 'role' field correctly. Use Burp Suite to inject administrative roles into your user session.",
    flagHash: "" 
  },
  {
    id: "a06-5",
    name: "MFA Workflow Bypass",
    category: "A06:2025",
    difficulty: "Insane",
    points: 650,
    goal: "Skip the Multi-Factor Authentication step by manipulating the application state.",
    cwe: ["CWE-841"],
    description: "The login workflow can be subverted by directly navigating to the post-MFA landing page with a valid session cookie from the first step.",
    flagHash: "" 
  },
  {
    id: "a06-6",
    name: "Coupon Stacking Abuse",
    category: "A06:2025",
    difficulty: "Hard",
    points: 600,
    goal: "Abuse promo workflow flaws to stack discounts beyond the intended limit and checkout an expensive order for free.",
    cwe: ["CWE-840", "CWE-602"],
    description: "The checkout service combines multiple discount layers from client-submitted values without enforcing server-side eligibility and floor rules. Chain coupon stacking with loyalty credits to force a zero or negative payable amount.",
    flagHash: ""
  },
  {
    id: "a06-7",
    name: "Advanced Price Manipulation",
    category: "A06:2025",
    difficulty: "Hard",
    points: 400,
    goal: "Tamper with client-side price parameters in a luxury car dealership to purchase a high-end vehicle for a fraction of the cost.",
    cwe: ["CWE-501", "CWE-602"],
    description: "The dealership's checkout process implicitly trusts the item price submitted by the client application. Intercept the checkout request and modify the price payload to purchase a $120,000 sports car for $1.",
    flagHash: "" 
  },
  {
    id: "a06-8",
    name: "The Grand Financial Exploit",
    category: "A06:2025",
    difficulty: "Insane",
    points: 1000,
    goal: "Exploit multiple business logic flaws in a global banking platform including currency confusion, rounding errors, and circular credit loops to reach a balance of $1,000,000.",
    cwe: ["CWE-840", "CWE-602", "CWE-362"],
    description: "Spark Global Bank is the most advanced financial simulation. It combines currency exchange flaws, precision rounding errors, and multi-stage trust violations. Chain at least 3 different logic flaws to exfiltrate the ultimate administrative flag.",
    flagHash: ""
  },
  {
    id: "a06-9",
    name: "Workspace Invitation Bypass",
    category: "A06:2025",
    difficulty: "Hard",
    points: 600,
    goal: "Bypass workspace invitation access controls to add yourself to an administrative workspace.",
    cwe: ["CWE-843", "CWE-639", "CWE-285"],
    description: "The B2B portal allows you to invite users to your workspace. The API uses middleware to check permissions but incorrectly handles array types in JSON bodies. Exploit this data binding type confusion to gain access to the 'admin_workspace' and read the flag.",
    flagHash: ""
  }
];
