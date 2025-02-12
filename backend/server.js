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

// CORS Configuration
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      process.env.CLIENT_URL?.replace(/\/+$/, "") || "http://localhost:3000",
      "https://task-manager-seven-umber.vercel.app".replace(/\/+$/, ""),
      "https://task-manager-f8mo.onrender.com" // Add your Render URL here
    ].map(url => url.toLowerCase());

    // Normalize origin by removing trailing slash
    const cleanOrigin = origin ? origin.replace(/\/+$/, "").toLowerCase() : null;

    if (!cleanOrigin || allowedOrigins.includes(cleanOrigin)) {
      callback(null, true);
    } else {
      console.log(`CORS Rejected: ${cleanOrigin} not in ${allowedOrigins}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
};

// Apply CORS middleware
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Handle preflight requests for all routes

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(errorHandler);

// Dynamically load routes
const routeFiles = fs.readdirSync("./src/routes");
routeFiles.forEach((file) => {
  import(`./src/routes/${file}`)
    .then((route) => {
      app.use("/api/v1", route.default);
    })
    .catch((err) => console.log("Failed to load route file", err));
});

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