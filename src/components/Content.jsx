// В Content.jsx добавьте импорт и маршрут:
import React, { useMemo, lazy, Suspense } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Lab2 from "../Labs/lab2/Lab2";
import Lab3 from "../Labs/lab2/Lab3";
import Lab4 from "../Labs/lab2/Lab4";
import Lab5 from "../Labs/lab2/Lab5";
import Lab6New from "../Labs/lab2/Lab6New";
import Lab7 from "../Labs/lab2/Lab7";
import Lab8 from "../Labs/lab2/Lab8";
import Lab1Html from "../Labs/lab1/Plotnikov.43012-1.html?raw";

// Ленивая загрузка Lab9
const Lab9 = lazy(() => import("../Labs/lab2/Lab9"));

function Content({ selected }) {
  const location = useLocation();

  const memoizedComponents = useMemo(() => {
    return {
      lab2: <Lab2 />,
      lab3: <Lab3 />,
      lab4: <Lab4 />,
      lab5: <Lab5 />,
      lab6: <Lab6New />,
      lab7: <Lab7 />,
      lab8: <Lab8 />,
    };
  }, []);

  const contentStyle = {
    padding: 16,
    boxSizing: "border-box",
    flex: 1,
    minHeight: 0,
    width: "100%",
  };

  const LoadingFallback = () => (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "200px",
      }}
    >
      <div
        style={{
          width: "40px",
          height: "40px",
          border: "4px solid #f3f3f3",
          borderTop: "4px solid #3498db",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
        }}
      ></div>
    </div>
  );

  // Добавляем стили для анимации
  const styleSheet = document.styleSheets[0];
  styleSheet.insertRule(
    `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `,
    styleSheet.cssRules.length
  );

  return (
    <main style={contentStyle}>
      <Routes>
        <Route
          path="/lab1"
          element={
            <div
              style={{
                height: "70vh",
                border: "1px solid #e5e5e5",
                borderRadius: 8,
                overflow: "hidden",
              }}
            >
              <iframe
                title="Лабораторная 1"
                srcDoc={Lab1Html}
                style={{ width: "100%", height: "100%", border: "none" }}
              />
            </div>
          }
        />
        <Route path="/lab2" element={memoizedComponents.lab2} />
        <Route path="/lab3" element={memoizedComponents.lab3} />
        <Route path="/lab4" element={memoizedComponents.lab4} />
        <Route path="/lab5" element={memoizedComponents.lab5} />
        <Route path="/lab6" element={memoizedComponents.lab6} />
        <Route path="/lab7" element={memoizedComponents.lab7} />
        <Route path="/lab8" element={memoizedComponents.lab8} />
        <Route
          path="/lab9"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <Lab9 />
            </Suspense>
          }
        />
        <Route path="/" element={memoizedComponents.lab2} />
      </Routes>
    </main>
  );
}

export default Content;
