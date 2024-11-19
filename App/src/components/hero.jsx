import { Button, TextField } from "@mui/material"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

const HeroPageComponent = () => {
    const navigate = useNavigate()
    const [roomID, setRoomID] = useState("")
    return (
        <div style={{
            margin: 0,
            height: "100vh",
            width: "100%",
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            // backgroundColor: "black"
        }}>
            <div style={{
                display: "flex",
                flexDirection: "row",
                width: "500px",
                alignItems: "center",
                justifyContent: "space-between"
            }}>
                <Button
                    onClick={() => navigate("/game", { state: { ishost: true } })}
                    style={{
                        alignSelf: "stretch",
                        width: "100px"
                    }} variant="contained">
                    Create
                </Button>
                <div style={{
                    alignSelf: "stretch", borderLeft: "solid black"
                }}></div>

                <div style={{
                    width: "70%",
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "flex-start"
                }}>
                    <TextField
                        value={roomID}
                        onChange={(event) => setRoomID(event.target.value)}
                        label="Room code"
                    />
                    {roomID &&
                        <Button
                            onClick={() => navigate("/game", { state: { roomID: roomID, ishost: false } })}
                            style={{
                                marginLeft: "1rem",
                                alignSelf: "stretch",
                                width: "100px"
                            }} variant="contained">
                            Join
                        </Button>
                    }

                </div>
            </div>
        </div >
    )
}
export default HeroPageComponent