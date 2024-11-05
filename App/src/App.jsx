import { Routes, Route, BrowserRouter } from "react-router-dom"
import HeroPageComponent from "./components/hero"
import GamePageComponent from "./components/game"
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HeroPageComponent />} />
        <Route path="/game" element={<GamePageComponent />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
