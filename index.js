const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

app.use(express.static("public"));

let room = {
  players: {},
  votes: {},
  roles: ["Jamie","Taylor","Chris","Morgan"]
};

io.on("connection", socket => {
  socket.on("join-game", () => {
    const role = room.roles.shift();
    room.players[socket.id] = {role, hp:0};
    socket.emit("role-assigned", role);
  });

  socket.on("submit-hp", hp => {
    room.players[socket.id].hp = hp;
  });

  socket.on("vote", suspect => {
    room.votes[socket.id] = suspect;
    if(Object.keys(room.votes).length === 4){
      io.emit("game-result", {
        killer: "Morgan",
        clues: [
          "Morgan was too interested in Alex’s evening plans.",
          "Asked unusual personal questions in chat."
        ],
        votes: room.votes,
        hp: Object.fromEntries(Object.entries(room.players).map(([id,p])=>[id,p.hp]))
      });
    }
  });

  socket.on("disconnect", () => {
    if(room.players[socket.id]){
      room.roles.push(room.players[socket.id].role);
      delete room.players[socket.id];
    }
  });
});

http.listen(process.env.PORT || 3000, () => {
  console.log("Server is running");
});
