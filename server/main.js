// const express = require("express");
const { WebSocketServer } = require("ws");
const ShortUniqueId = require("short-unique-id");
// const app = express();
const PORT = 3000;
let roomID;
let hostID;
let peerID;

const uid = new ShortUniqueId({ length: 10 });
let winList = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
  [1, 5, 9],
  [3, 5, 7],
  [1, 4, 7],
  [2, 5, 8],
  [3, 6, 9],
];
[1, 2, 4, 5, 3];

function winCheck(moves) {
  winList.forEach((winPtrn, index) => {
    if (winPtrn.every((item) => moves.includes(item))) return true;
  });
  return false;
}

const room = new Map();
const socket = new WebSocketServer({ port: PORT });
socket.on("connection", (ws) => {
  ws.on("message", (message) => {
    const data = JSON.parse(message);
    switch (data.type) {
      case "create":
        // create a new room
        roomID = uid.rnd();
        hostID = uid.rnd();
        room.set(roomID, new Map());
        room.get(roomID).set("host", [ws, hostID]);
        ws.send(
          JSON.stringify({
            type: "room-created",
            roomID,
            hostID,
          })
        );
        console.log(room);

        break;
      case "join":
        peerID = uid.rnd();
        if (room.get(data.roomID)) {
          room.get(data.roomID).set("peer", [ws, peerID]);
          ws.send(
            JSON.stringify({
              type: "peer-joined",
              peerID,
            })
          );
          room
            .get(data.roomID)
            .get("host")[0]
            .send(
              JSON.stringify({
                type: "start-game",
              })
            );
          console.log(room);
        }
        break;

      // case "player-done":
      //   if (winCheck(data.moves)) {
      //     room.get(data.roomID).forEach((obj, index) => {
      //       console.log(obj);
      //     });
      //   }
      //   break;
    }
  });
  ws.on("close", () =>
    Array.from(room.keys()).forEach((key, index) => {
      const obj = room.get(key);
      if (obj.get("host")[0] == ws) {
        if (obj.has("peer")) {
          obj.get("peer")[0].send(
            JSON.stringify({
              type: "host-disconnected",
            })
          );
        }
        room.delete(key);
      } else {
        obj.get("host")[0].send(
          JSON.stringify({
            type: "peer-disconnected",
          })
        );
        room.get(key).delete("peer");
      }
      console.log(room);
    })
  );
});

// app.get("/", (req, res) => {
//   res.send("Hello world!");
// });

// app.listen(PORT, () => {
//   console.log(`server running at ${PORT}`);
// });
