import { useLocation } from "react-router-dom"


const GamePageComponent = () => {
    const location = useLocation()
    const { message } = location.state || {}
    return (
        <>
            <h1>Game Page</h1>
            <p>{message}</p>
        </>
    )
}
export default GamePageComponent