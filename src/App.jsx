import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Projects from "./pages/Projects";
import Blog from "./pages/Blog";
import GlobalScene from "./components/HeroScene";

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <GlobalScene />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/blog" element={<Blog />} />
      </Routes>
    </BrowserRouter>
  );
}