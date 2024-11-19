import { useLocation } from "react-router-dom"
import { Grid2 as Grid } from "@mui/material"
import { Clear as Cross } from "@mui/icons-material"
import { RadioButtonUnchecked as Circle } from "@mui/icons-material"
import { useEffect, useState } from "react"

let socket
function multiplayer({ setRoomID, setSelfID, isHost, roomID }) {
    if (socket && (socket.readystate === WebSocket.OPEN || socket.readyState === WebSocket.OPEN)) {
        console.log("Closing existing WebSocket connection...");
        socket.close();
    }
    socket = new WebSocket("wss://crispy-capybara-xqv4qqrpwwg25wr-3000.app.github.dev/")
    socket.onopen = () => {
        if (socket.readyState === WebSocket.OPEN) {
            console.log("connected", isHost)
            if (isHost == true)
                socket.send(JSON.stringify({
                    type: "create"
                }))
            else {
                socket.send(JSON.stringify({
                    type: "join",
                    roomID
                }))
            }
        }
    }
    socket.onmessage = (message) => {
        const data = JSON.parse(message.data)
        switch (data.type) {
            case "room-created":
                setSelfID(data.hostID)
                setRoomID(data.roomID)
                break
            case "peer-joined":
                setSelfID(data.peerID)
                break

        }
    }

}
const GamePageComponent = () => {
    const location = useLocation()
    const [gridValue, setGridValue] = useState(Array(9).fill(null))
    const [currSign, setCurrSign] = useState(false)
    const [isHost, setIsHost] = useState(location.state.ishost)
    const [roomID, setRoomID] = useState(location.state.roomID || '')
    const [selfID, setSelfID] = useState("")
    useEffect(() => multiplayer({ setRoomID, setSelfID, isHost, roomID }), [])
    const handleCurrValue = ({ index }) => {
        if (gridValue[index] == "o") {
            return <Circle sx={{ fontSize: 80, color: "red" }} />
        }
        else if (gridValue[index] == "x") {
            return <Cross sx={{ fontSize: 80, color: "black" }} />
        }
        return
    }

    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center"
        }}>

            <h1>Game Page</h1>
            <div>
                <h4>Your ID <span style={{ backgroundColor: "yellow" }}>{selfID}</span></h4>
                <h4>Room ID <span style={{ backgroundColor: "yellow" }}>{roomID}</span></h4>
            </div>
            <Grid sx={{ maxWidth: "345px" }} container spacing={2}>
                {
                    [...Array(9).keys()].map((val) => (
                        <Grid size={4} key={val}>
                            <div
                                onClick={() => {
                                    if (currSign == false) {
                                        setGridValue(prevArray => {
                                            const newArray = [...prevArray]
                                            newArray[val] = "x"
                                            return newArray
                                        })
                                    }
                                    else {
                                        setGridValue(prevArray => {
                                            const newArray = [...prevArray]
                                            newArray[val] = "o"
                                            return newArray
                                        })
                                    }
                                    setCurrSign(!currSign)
                                }}
                                style={{
                                    height: "100px",
                                    width: "100px",
                                    border: "3px solid grey",
                                    borderRadius: "1rem",
                                    textAlign: 'center',
                                    alignContent: "center",
                                    cursor: "pointer"
                                }}>{handleCurrValue({ index: val })}</div>
                        </Grid>
                    ))
                }
            </Grid>

        </div >
    )
}
export default GamePageComponent