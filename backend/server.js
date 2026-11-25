import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connect from "./src/db/connect.js"; // Your MongoDB connection logic
import cookieParser from "cookie-parser";
import fs from "fs";
import errorHandler from "./src/helpers/errorhandler.js";

dotenv.config();

const port = process.env.PORT || 8000;
const app = express();
app.disable("x-powered-by");
app.set(
  "trust proxy",
  Number(
    process.env.TRUST_PROXY_HOPS || (process.env.RENDER === "true" ? 1 : 0),
  ),
);

// CORS Configuration
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      process.env.CLIENT_URL?.replace(/\/+$/, "") || "http://localhost:3000",
      "https://task-manager-seven-umber.vercel.app".replace(/\/+$/, ""),
      "https://task-manager-f8mo.onrender.com", // Add your Render URL here
    ].map((url) => url.toLowerCase());

    // Normalize origin by removing trailing slash
    const cleanOrigin = origin
      ? origin.replace(/\/+$/, "").toLowerCase()
      : null;

    // Log incoming origin for debugging
    console.log(`CORS Check for Origin: ${cleanOrigin}`);

    if (!cleanOrigin || allowedOrigins.includes(cleanOrigin)) {
      callback(null, true);
    } else {
      console.log(`CORS Rejected: ${cleanOrigin} not in ${allowedOrigins}`);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"], // Added PATCH here
};

// Apply CORS middleware
app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // Handle preflight requests for all routes

// Only JSON bodies are accepted by the API.
app.use((req, res, next) => {
  if (
    !["GET", "HEAD", "OPTIONS"].includes(req.method) &&
    (req.headers["transfer-encoding"] ||
      Number(req.headers["content-length"]) > 0) &&
    !req.is("application/json")
  ) {
    return res.status(415).json({ message: "Use application/json" });
  }
  next();
});

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: false, limit: "16kb" }));
app.use(cookieParser());

const routeFiles = fs.readdirSync("./src/routes");
for (const file of routeFiles) {
  const route = await import(`./src/routes/${file}`);
  app.use("/api/v1", route.default);
}
app.use(errorHandler);

// Start the server
const server = async () => {
  try {
    await connect();
    app.listen(port, () => console.log(`Server running on port ${port}`));
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

server();
