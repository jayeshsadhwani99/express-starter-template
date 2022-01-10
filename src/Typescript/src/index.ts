import dotenv from "dotenv";
import express, { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import ExpressError from "./utils/ExpressError";
import Cors from "cors";

// Middleware
import { isLoggedIn } from "./middlewares/verification";

// Route imports
import authenticateRoutes from "./routes/authentication";

if (process.env.NODE_ENV !== "production") {
  // initialize configuration
  dotenv.config();
}

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(Cors());
const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/hmr";

// Connect to MongoDB
mongoose.connect(dbUrl);
const db = mongoose.connection;
db.on(
  "error", // tslint:disable-next-line:no-console
  console.error.bind(console, "connection error:")
);
db.once("open", () => {
  // tslint:disable-next-line:no-console
  console.log("Database connected");
});

// Routes
app.use("/api/authenticate", authenticateRoutes);

// Route handler for the default home page
app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

// Protected Route
app.get("/secret", isLoggedIn, (req: Request, res: Response) => {
  res.send("Welcome to the secret!");
});

// Errors
app.all("*", (req: Request, res: Response, next: NextFunction) => {
  next(new ExpressError("Page Not Found", 404));
});

app.use(
  (err: ExpressError, req: Request, res: Response, next: NextFunction) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = "Oh No, Something Went Wrong!";
    res.status(statusCode).send({ err });
  }
);

const port = process.env.PORT || 3000;
// start the express server
app.listen(port, () => {
  // tslint:disable-next-line:no-console
  console.log(`server started at http://localhost:${port}`);
  // tslint:disable-next-line:no-console
  console.log(`View Admin Panel at http://localhost:${port}/admin`);
});
