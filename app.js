require("dotenv").config();
require("express-async-errors");

// extra security packages
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const useragent = require("express-useragent");
const cookieParser = require("cookie-parser");

const express = require("express");
const app = express();

// connect DB
const connectDB = require("./db/connect");

// routers
const authRouter = require("./routes/authRoutes");
const userRouter = require("./routes/userRoutes");
const roomRouter = require("./routes/roomRoutes");
const deckRouter = require("./routes/deckRoutes");

// use middlewares
app.set("trust proxy", 1);
app.use(helmet());
app.use(
	cors({
		credentials: true,
		origin: ["http://localhost:3000"], // only allow website in this domain too access the resource of this server
	})
);
app.use(xss());
app.use(useragent.express());

app.use(express.json());
app.use(cookieParser());

// routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/room", roomRouter);
app.use("/api/deck", deckRouter);

// error handler
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 8080;

const { verifySocketJWT } = require("./socket/socket.js");
const { connectedUsers } = require("./utils");

const start = async () => {
	try {
		await connectDB(process.env.MONGO_URI);
		const server = app.listen(port, () =>
			console.log(`Server is listening on port ${port}...`)
		);

		const io = require("socket.io")(server, {
			cors: {
				origin: [
					process.env.REACT_APP_LINK,
					"http://localhost:3000",
				],
			},
		});

		io.on("connection", (socket) => {
			socket.on("subscribe", async (userId) => {
				connectedUsers[userId] = socket;
			});
		});

		io.use(verifySocketJWT);

		app.io = io;
	} catch (error) {
		console.log(error);
	}
};

start();

module.exports = app;
