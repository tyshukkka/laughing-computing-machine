import React, { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";
import { Drawer, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

function Menu({ selected, onSelect, isOpen, onClose, isMobile }) {
  const location = useLocation();
  const { theme } = useContext(ThemeContext);

  const items = [
    { id: "lab1", label: "Лабораторная 1", path: "/lab1" },
    { id: "lab2", label: "Лабораторная 2", path: "/lab2" },
    { id: "lab3", label: "Лабораторная 3", path: "/lab3" },
    { id: "lab4", label: "Лабораторная 4", path: "/lab4" },
    { id: "lab5", label: "Лабораторная 5", path: "/lab5" },
    { id: "lab6", label: "Лабораторная 6", path: "/lab6" },
    { id: "lab7", label: "Лабораторная 7", path: "/lab7" },
    { id: "lab8", label: "Лабораторная 8", path: "/lab8" },
    { id: "lab9", label: "Лабораторная 9", path: "/lab9" },
  ];

  const menuStyle = {
    width: 300,
    borderRight: `2px solid ${theme === "light" ? "#bdc3c7" : "#34495e"}`,
    padding: "20px 16px",
    boxSizing: "border-box",
    backgroundColor: theme === "light" ? "#ecf0f1" : "#1a252f",
    height: "100%",
    minWidth: 300,
    flexShrink: 0,
    transition: "all 0.3s ease",
  };

  const linkBaseStyle = {
    display: "block",
    width: "calc(100% - 4px)",
    textAlign: "left",
    padding: "12px 14px",
    borderRadius: 8,
    border: `2px solid ${theme === "light" ? "#34495e" : "#2c3e50"}`,
    color: "white",
    fontSize: "15px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    textDecoration: "none",
    boxSizing: "border-box",
  };

  const getLinkStyle = (itemPath) => {
    const isActive = location.pathname === itemPath;
    return {
      ...linkBaseStyle,
      background: isActive
        ? "#3498db"
        : theme === "light"
        ? "#2c3e50"
        : "#2c3e50",
      fontWeight: isActive ? 700 : 500,
      marginBottom: 8,
      borderColor: theme === "light" ? "#34495e" : "#1a252f",
      ":hover": {
        backgroundColor: isActive ? "#2980b9" : "#34495e",
      },
    };
  };

  // Мобильная версия - Drawer
  if (isMobile) {
    return (
      <Drawer
        anchor="left"
        open={isOpen}
        onClose={onClose}
        sx={{
          "& .MuiDrawer-paper": {
            width: 280,
            backgroundColor: theme === "light" ? "#ecf0f1" : "#1a252f",
            borderRight: `2px solid ${
              theme === "light" ? "#bdc3c7" : "#34495e"
            }`,
            padding: "20px 16px",
          },
        }}
      >
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <IconButton onClick={onClose} sx={{ color: "white", mb: 2 }}>
            <CloseIcon />
          </IconButton>
        </div>
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {items.map((item) => (
            <li key={item.id} style={{ marginBottom: "12px" }}>
              <Link
                to={item.path}
                style={getLinkStyle(item.path)}
                onClick={() => {
                  onSelect(item.id);
                  onClose();
                }}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </Drawer>
    );
  }

  // Десктопная версия - обычная панель
  // Если меню закрыто, вообще не рендерим элемент
  if (!isOpen) {
    return null;
  }

  return (
    <aside style={menuStyle}>
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {items.map((item) => (
          <li key={item.id} style={{ marginBottom: "12px" }}>
            <Link
              to={item.path}
              style={getLinkStyle(item.path)}
              onClick={() => onSelect(item.id)}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}

export default Menu;
