import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import AquariumApp from "@/components/LivingAquascape";
import "@/app/living.css";

const root = document.getElementById("root");

if (!root) {
  throw new Error("Aquarium Laboratory could not find its application mount.");
}

createRoot(root).render(
  <StrictMode>
    <AquariumApp />
  </StrictMode>,
);
