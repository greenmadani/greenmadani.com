import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Fade in images when they load
document.addEventListener("load", (e) => {
  if (e.target instanceof HTMLImageElement) {
    e.target.classList.add("loaded");
  }
}, true);

createRoot(document.getElementById("root")!).render(<App />);
