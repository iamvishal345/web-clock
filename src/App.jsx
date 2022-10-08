import { useState } from "react";
import "./App.css";
import { Clock } from "./components/Clock";
import { Quote } from "./components/Quote";

const BG_PATH = new Map([
  [22, "/images/night"],
  [18, "/images/evening"],
  [12, "/images/afternoon"],
  [6, "/images/morning"],
  [4, "/images/earlyMorning"],
]);
const getBgPath = () => {
  const hour = new Date().getHours();
  return [...BG_PATH.entries()].find(([key]) => key <= hour)[1];
};
function App() {
  const [bgPath, setBgPath] = useState(getBgPath());

  const updateBgPath = () => {
    setBgPath(getBgPath());
  };

  return (
    <div style={{ "--bg-image": `url(${bgPath}.webp)` }} className="app">
      <Quote />
      <Clock updateBgPath={updateBgPath} />
    </div>
  );
}

export default App;
