import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import { Quiz } from "./pages/Quiz";
import { History } from "./pages/History";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Quiz />} />
          <Route path="/history" element={<History />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
