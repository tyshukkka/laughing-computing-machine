import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { ThemeProvider } from "./context/ThemeContext";
import { store } from "./redux/store";
import "./App.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Menu from "./components/Menu";
import Content from "./components/Content";
import AboutPage from "./components/AboutPage";

function App() {
  const [selectedLab, setSelectedLab] = useState("lab2");
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Отслеживаем изменение размера экрана
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setIsMenuOpen(false);
      } else {
        setIsMenuOpen(true);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    if (isMobile) {
      setIsMenuOpen(false);
    }
  };

  return (
    <Provider store={store}>
      <ThemeProvider>
        <Router
          future={{
            v7_relativeSplatPath: true,
            v7_startTransition: true,
          }}
        >
          <div
            className="App"
            style={{
              display: "flex",
              flexDirection: "column",
              minHeight: "100vh",
            }}
          >
            <Header isMenuOpen={isMenuOpen} onMenuToggle={toggleMenu} />

            {/* Основной контент с маршрутизацией */}
            <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
              {/* Меню лабораторных показывается на всех страницах */}
              <Menu
                selected={selectedLab}
                onSelect={setSelectedLab}
                isOpen={isMenuOpen}
                onClose={closeMenu}
                isMobile={isMobile}
              />

              <div
                style={{ flex: 1, display: "flex", flexDirection: "column" }}
              >
                <Routes>
                  <Route
                    path="/"
                    element={<Content selected={selectedLab} />}
                  />
                  <Route path="/about" element={<AboutPage />} />
                  <Route
                    path="/lab/*"
                    element={<Content selected={selectedLab} />}
                  />
                  {/* Редирект на главную для несуществующих маршрутов */}
                  <Route
                    path="*"
                    element={<Content selected={selectedLab} />}
                  />
                </Routes>
              </div>
            </div>

            <Footer />
          </div>
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
