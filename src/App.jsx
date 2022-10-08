import { useState } from "react";
import "./App.css";
import { Clock } from "./components/Clock";
import { Quote } from "./components/Quote";

const BG_PATH = new Map([
  [22, "/web-clock/images/night"],
  [18, "/web-clock/images/evening"],
  [12, "/web-clock/images/afternoon"],
  [6, "/web-clock/images/morning"],
  [0, "/web-clock/images/earlyMorning"],
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
