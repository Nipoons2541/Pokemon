import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Pokemon from "./pages/pokemon";
import Navbar from "./components/navbar/navbar";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Navbar />
      <Pokemon />
    </>
  );
}

export default App;
