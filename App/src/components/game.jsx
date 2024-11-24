import { useLocation } from "react-router-dom"
import { Grid2 as Grid } from "@mui/material"
import { CompressOutlined, Clear as Cross } from "@mui/icons-material"
import { RadioButtonUnchecked as Circle } from "@mui/icons-material"
import { useEffect, useState } from "react"

let socket
function multiplayer({ setRoomID, setSelfID, setCanPlay, setGridValue, isHost, roomID }) {
    if (socket && (socket.readystate === WebSocket.OPEN || socket.readyState === WebSocket.OPEN)) {
        console.log("Closing existing WebSocket connection...");
        socket.close();
    }
    let selfIDTemp
    let roomIDTemp
    socket = new WebSocket("wss://crispy-capybara-xqv4qqrpwwg25wr-8000.app.github.dev/")
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
                selfIDTemp = data.hostID
                roomIDTemp = data.roomID
                break
            case "peer-joined":
                setSelfID(data.peerID)
                selfIDTemp = data.peerID
                break
            case "player-turn":
                console.log('My turn!')
                setCanPlay(true)
                setGridValue(data.gridValue)
            case "player-win":
                if (selfIDTemp == data.playerID) {
                    console.log("I won!!")
                }
        }
    }

}
const GamePageComponent = () => {
    const location = useLocation()
    const [gridValue, setGridValue] = useState(Array(9).fill(null))
    const [indexValue, setIndexValue] = useState([])
    const [isHost, setIsHost] = useState(location.state.ishost)
    const [roomID, setRoomID] = useState(location.state.roomID || '')
    const [selfID, setSelfID] = useState("")
    const [canPlay, setCanPlay] = useState(location.state.ishost)
    useEffect(() => multiplayer({ setRoomID, setSelfID, setCanPlay, setGridValue, isHost, roomID }), [])
    useEffect(() => {
        console.log(indexValue)
        if (!canPlay && indexValue.length > 0)
            socket.send(JSON.stringify({
                type: "player-turn-completed",
                moves: indexValue,
                playerID: selfID,
                roomID: roomID,
                gridValue: gridValue
            }))
    }, [indexValue])
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
                                    if (gridValue[val] != null) return
                                    if (!canPlay) return
                                    if (isHost == true) {
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
                                    setIndexValue(prevArray => {
                                        const newArray = [...prevArray]
                                        newArray.push(val + 1)
                                        return newArray
                                    })
                                    setCanPlay(false)
                                }}
                                style={{
                                    height: "100px",
                                    width: "100px",
                                    border: "3px solid grey",
                                    borderRadius: "1rem",
                                    textAlign: 'center',
                                    alignContent: "center",
                                    cursor: (canPlay == true && gridValue[val] == null) ? "pointer" : "not-allowed"

                                }}>{handleCurrValue({ index: val })}</div>
                        </Grid>
                    ))
                }
            </Grid>

        </div >
    )
}
export default GamePageComponent