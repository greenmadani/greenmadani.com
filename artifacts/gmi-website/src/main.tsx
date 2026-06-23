import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Fade in images when they load
document.addEventListener("load", (e) => {
  if (e.target instanceof HTMLImageElement) {
    e.target.classList.add("loaded");
  }
}, true);
// Also catch cached images that fire load synchronously before DOM attach
new MutationObserver((mutations) => {
  for (const m of mutations) {
    for (const node of m.addedNodes) {
      if (node instanceof HTMLImageElement && node.complete && !node.classList.contains("loaded")) {
        node.classList.add("loaded");
      }
    }
  }
}).observe(document.body || document.documentElement, { childList: true, subtree: true });

createRoot(document.getElementById("root")!).render(<App />);
