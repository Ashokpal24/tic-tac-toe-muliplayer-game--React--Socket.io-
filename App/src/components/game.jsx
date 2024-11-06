import { useLocation } from "react-router-dom"
import { Grid2 as Grid } from "@mui/material"
import { Clear as Cross } from "@mui/icons-material"
import { RadioButtonUnchecked as Circle } from "@mui/icons-material"
import { useState } from "react"

const GamePageComponent = () => {
    const location = useLocation()
    const { message } = location.state || {}
    const [gridValue, setGridValue] = useState(Array(9).fill(null))
    const [currSign, setCurrSign] = useState(false)

    const handleCurrValue = ({ index }) => {
        console.log
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
            <p>{message}</p>
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