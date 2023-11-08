// const { PeerServer } = require("peer");

// const customGenerationFunction = () =>
// 	(Math.random().toString(36) + "0000000000000000000").substr(2, 16);

// const peerServer = PeerServer({
// 	port: 9000,
// 	path: "/myapp",
// 	generateClientId: customGenerationFunction,
// });


// const express = require("express");
// const { ExpressPeerServer } = require("peer");

// const app = express();

// app.get("/", (req, res, next) => res.send("Hello world!"));

// // =======

// const server = app.listen(9000);

// const peerServer = ExpressPeerServer(server, {
// 	path: "/myapp",
// });

// app.use("/peerjs", peerServer);

