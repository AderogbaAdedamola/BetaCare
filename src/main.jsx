import { createRoot } from "react-dom/client";
import { Suspense } from "react";
import App from "./App.jsx";
import "./styles/index.css";
import "./i18n.js";

createRoot(document.getElementById("root")).render(
  <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
    <App />
  </Suspense>
);
