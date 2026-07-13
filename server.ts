import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Path to persistent data storage
const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "state.json");

// Ensure data directory and default state file exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const defaultState = {
  children: [],
  activeChildId: null,
  habits: [],
  logs: [],
  parentPasswordHash: "",
  isInitialized: false,
  rewards: [],
  redemptions: [],
};

if (!fs.existsSync(DATA_FILE)) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(defaultState, null, 2), "utf-8");
    console.log("Initialized default state.json file successfully.");
  } catch (err) {
    console.error("Failed to write default state.json file:", err);
  }
}

// Enable rich JSON body parser with increased limit to support potential Base64 images
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Helper to load application state
function getStoredState() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, "utf-8");
      return JSON.parse(content);
    }
  } catch (error) {
    console.error("Error reading state file, recovering...", error);
  }
  return null;
}

// Helper to save application state
function saveStoredState(state: any) {
  try {
    // Write atomically using a temporary file to avoid corruption on crash/power failure
    const tempFile = `${DATA_FILE}.tmp`;
    fs.writeFileSync(tempFile, JSON.stringify(state, null, 2), "utf-8");
    fs.renameSync(tempFile, DATA_FILE);
    return true;
  } catch (error) {
    console.error("Error writing state file:", error);
    return false;
  }
}

// API endpoint to retrieve state
app.get("/api/state", (req, res) => {
  const state = getStoredState();
  if (state) {
    return res.json({ success: true, state });
  }
  
  // Return uninitialized state if file does not exist
  return res.json({
    success: true,
    state: {
      children: [],
      activeChildId: null,
      habits: [],
      logs: [],
      parentPasswordHash: "",
      isInitialized: false,
      rewards: [],
      redemptions: [],
    },
  });
});

// API endpoint to persist state
app.post("/api/state", (req, res) => {
  const { state } = req.body;
  if (!state) {
    return res.status(400).json({ success: false, error: "Missing state in request body" });
  }

  const success = saveStoredState(state);
  if (success) {
    return res.json({ success: true });
  } else {
    return res.status(500).json({ success: false, error: "Failed to persist state on server" });
  }
});

// Setup Vite integration
async function setupVite() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in development mode with Vite middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in production mode serving static assets...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }
}

setupVite().then(() => {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
