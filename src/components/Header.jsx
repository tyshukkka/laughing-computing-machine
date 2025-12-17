import React, { useContext, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Switch,
  Box,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import HomeIcon from "@mui/icons-material/Home";
import PersonIcon from "@mui/icons-material/Person";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";

function Header({ onMenuToggle, isMenuOpen }) {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const location = useLocation();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { label: "Главная", path: "/", icon: <HomeIcon /> },
    { label: "О себе", path: "/about", icon: <PersonIcon /> },
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box sx={{ width: 250 }} onClick={handleDrawerToggle}>
      <List>
        {navItems.map((item) => (
          <ListItem
            key={item.label}
            component={Link}
            to={item.path}
            sx={{
              backgroundColor:
                location.pathname === item.path
                  ? theme === "dark"
                    ? "rgba(52, 152, 219, 0.2)"
                    : "rgba(25, 118, 210, 0.1)"
                  : "transparent",
              "&:hover": {
                backgroundColor:
                  theme === "dark"
                    ? "rgba(255,255,255,0.05)"
                    : "rgba(0,0,0,0.04)",
              },
            }}
          >
            <ListItemIcon
              sx={{
                color: theme === "dark" ? "#ecf0f1" : "#000000",
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={item.label}
              sx={{
                color: theme === "dark" ? "#ecf0f1" : "#000000",
              }}
            />
          </ListItem>
        ))}
      </List>
      <Box sx={{ p: 2 }}>
        <Typography
          variant="body2"
          sx={{ mb: 1, color: theme === "dark" ? "#ecf0f1" : "#000000" }}
        >
          Тема:
        </Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <LightModeIcon
            sx={{ color: theme === "dark" ? "#bdc3c7" : "#f39c12" }}
          />
          <Switch
            checked={theme === "dark"}
            onChange={toggleTheme}
            color="primary"
          />
          <DarkModeIcon
            sx={{ color: theme === "dark" ? "#3498db" : "#bdc3c7" }}
          />
        </Box>
      </Box>
    </Box>
  );

  return (
    <>
      <AppBar
        position="static"
        sx={{
          backgroundColor: theme === "dark" ? "#1a252f" : "#2c3e50",
          boxShadow: 2,
        }}
      >
        <Toolbar>
          {/* Кнопка меню лабораторных - ВСЕГДА видна */}
          <IconButton
            color="inherit"
            onClick={onMenuToggle}
            edge="start"
            sx={{
              mr: 2,
              "&:hover": {
                backgroundColor:
                  theme === "dark"
                    ? "rgba(255,255,255,0.1)"
                    : "rgba(255,255,255,0.2)",
              },
            }}
          >
            {isMenuOpen ? <MenuOpenIcon /> : <MenuIcon />}
          </IconButton>

          {/* Навигация для десктопа */}
          {!isMobile && (
            <Box sx={{ display: "flex", gap: 1, mr: 2 }}>
              {navItems.map((item) => (
                <Button
                  key={item.label}
                  component={Link}
                  to={item.path}
                  startIcon={item.icon}
                  sx={{
                    color: "white",
                    backgroundColor:
                      location.pathname === item.path
                        ? theme === "dark"
                          ? "rgba(52, 152, 219, 0.3)"
                          : "rgba(255,255,255,0.2)"
                        : "transparent",
                    "&:hover": {
                      backgroundColor:
                        theme === "dark"
                          ? "rgba(52, 152, 219, 0.2)"
                          : "rgba(255,255,255,0.1)",
                    },
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Box>
          )}

          <Typography
            variant="h6"
            component="div"
            sx={{
              flexGrow: 1,
              fontWeight: 700,
              fontSize: { xs: "1rem", sm: "1.25rem" },
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            Лабораторные работы
          </Typography>

          {/* Кнопка меню для мобильных */}
          {isMobile && (
            <IconButton
              color="inherit"
              onClick={handleDrawerToggle}
              sx={{
                ml: 2,
                "&:hover": {
                  backgroundColor:
                    theme === "dark"
                      ? "rgba(255,255,255,0.1)"
                      : "rgba(255,255,255,0.2)",
                },
              }}
            >
              <MenuIcon />
            </IconButton>
          )}

          {/* Переключатель темы (десктоп) */}
          {!isMobile && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, ml: 2 }}>
              <LightModeIcon sx={{ color: "#f39c12", fontSize: 20 }} />
              <Switch
                checked={theme === "dark"}
                onChange={toggleTheme}
                color="default"
                size="medium"
              />
              <DarkModeIcon sx={{ color: "#3498db", fontSize: 20 }} />
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {/* Drawer для мобильной навигации */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          "& .MuiDrawer-paper": {
            backgroundColor: theme === "dark" ? "#2c3e50" : "#ffffff",
          },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
}

export default Header;
