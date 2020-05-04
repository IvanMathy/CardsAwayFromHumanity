import socketIO from "socket.io"
import express from "express"
import path from "path"
import * as http from "http"

let app = express();
let server = http.createServer(app)

server.listen(process.env.PORT || 3000)

let startPath = path.join(__dirname, '../../../../dist')

console.log(startPath)

app.use(express.static(startPath));

app.get('/:roomCode([A-Z]{4})', function (req, res, next) {
    res.sendFile(path.join(startPath, "index.html"), { dotfiles: "allow" });
});

export const io = socketIO.listen(server)