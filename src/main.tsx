
import React from "react";
import ReactDOM from "react-dom/client";
import {
  BrowserRouter,
  Link,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";

import "./styles.css";
import Home from "./routes/Home";
import About from "./routes/About";
import Projects from "./routes/Projects";
import ProjectDetail from "./routes/ProjectDetail";

function SiteNavigation() {
  const location = useLocation();

  return (
    <header className="site-navigation">
      <Link className="site-wordmark" to="/">
        J.GM
      </Link>

      <nav aria-label="Main navigation">
        <Link
          className={location.pathname === "/" ? "current" : ""}
          to="/"
        >
          Home
        </Link>

        <Link
          className={
            location.pathname.startsWith("/projects") ? "current" : ""
          }
          to="/projects"
        >
          Projects
        </Link>

        <Link
          className={location.pathname === "/about" ? "current" : ""}
          to="/about"
        >
          About
        </Link>
      </nav>
    </header>
  );
}

function App() {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <>
      {!isHome && <SiteNavigation />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/:slug" element={<ProjectDetail />} />

        <Route
          path="*"
          element={
            <main className="project-detail-page">
              <p className="eyebrow">404</p>
              <h1>Page not found</h1>
              <Link to="/">Return home</Link>
            </main>
          }
        />
      </Routes>
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
