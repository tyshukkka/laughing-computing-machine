import React, { useContext, useState } from "react";
import { ThemeContext } from "../context/ThemeContext";
import {
  AppBar,
  Toolbar,
  Typography,
  Avatar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  Badge,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  Logout,
  Person,
  Settings,
  Email,
  CalendarToday,
} from "@mui/icons-material";

const HeaderWithProfile = ({ user, onLogout }) => {
  const { theme } = useContext(ThemeContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    onLogout();
  };

  const handleProfileClick = () => {
    handleMenuClose();
    setSnackbar({
      open: true,
      message: "Нажата кнопка: Профиль",
      severity: "info",
    });
  };

  const handleSettingsClick = () => {
    handleMenuClose();
    setSnackbar({
      open: true,
      message: "Нажата кнопка: Настройки",
      severity: "info",
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

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
          <Typography
            variant="h6"
            component="div"
            sx={{
              flexGrow: 1,
              fontWeight: 700,
              fontSize: { xs: "1rem", sm: "1.25rem" },
            }}
          >
            Лабораторная работа 5
          </Typography>

          {user && (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              {/* Аватар с бейджем */}
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                variant="dot"
                sx={{
                  "& .MuiBadge-dot": {
                    backgroundColor: "#4caf50",
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    border: `2px solid ${
                      theme === "dark" ? "#1a252f" : "#2c3e50"
                    }`,
                  },
                }}
              >
                <IconButton
                  onClick={handleMenuOpen}
                  sx={{
                    p: 0,
                    "&:hover": {
                      backgroundColor:
                        theme === "dark"
                          ? "rgba(255,255,255,0.1)"
                          : "rgba(255,255,255,0.2)",
                    },
                  }}
                >
                  <Avatar
                    sx={{
                      bgcolor:
                        theme === "dark"
                          ? "linear-gradient(45deg, #3498db, #2980b9)"
                          : "linear-gradient(45deg, #1976d2, #1565c0)",
                      width: 40,
                      height: 40,
                      fontWeight: "bold",
                      fontSize: "1.1rem",
                      boxShadow: 2,
                    }}
                    alt={user.name}
                  >
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </Avatar>
                </IconButton>
              </Badge>

              {/* Выпадающее меню профиля */}
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                PaperProps={{
                  elevation: 3,
                  sx: {
                    width: 280,
                    maxWidth: "100%",
                    backgroundColor: theme === "dark" ? "#2c3e50" : "#ffffff",
                    color: theme === "dark" ? "#ecf0f1" : "#000000",
                    mt: 1,
                    "& .MuiMenuItem-root": {
                      py: 1.5,
                      px: 2,
                    },
                  },
                }}
              >
                {/* Заголовок профиля */}
                <MenuItem disabled>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      width: "100%",
                    }}
                  >
                    <Avatar
                      sx={{
                        bgcolor: theme === "dark" ? "#3498db" : "#1976d2",
                        width: 48,
                        height: 48,
                        mr: 2,
                        fontSize: "1.2rem",
                      }}
                    >
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        {user.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: theme === "dark" ? "#bdc3c7" : "#666666",
                          fontSize: "0.8rem",
                        }}
                      >
                        {user.email}
                      </Typography>
                    </Box>
                  </Box>
                </MenuItem>

                <Divider sx={{ my: 1 }} />

                {/* Информация профиля */}
                <MenuItem disabled>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      width: "100%",
                    }}
                  >
                    <Email
                      sx={{
                        mr: 2,
                        fontSize: 20,
                        color: theme === "dark" ? "#3498db" : "#1976d2",
                      }}
                    />
                    <Box>
                      <Typography
                        variant="caption"
                        sx={{
                          display: "block",
                          color: theme === "dark" ? "#bdc3c7" : "#666666",
                        }}
                      >
                        Email
                      </Typography>
                      <Typography variant="body2">{user.email}</Typography>
                    </Box>
                  </Box>
                </MenuItem>

                {user.createdAt && (
                  <MenuItem disabled>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        width: "100%",
                      }}
                    >
                      <CalendarToday
                        sx={{
                          mr: 2,
                          fontSize: 20,
                          color: theme === "dark" ? "#3498db" : "#1976d2",
                        }}
                      />
                      <Box>
                        <Typography
                          variant="caption"
                          sx={{
                            display: "block",
                            color: theme === "dark" ? "#bdc3c7" : "#666666",
                          }}
                        >
                          Дата регистрации
                        </Typography>
                        <Typography variant="body2">
                          {formatDate(user.createdAt)}
                        </Typography>
                      </Box>
                    </Box>
                  </MenuItem>
                )}

                <Divider sx={{ my: 1 }} />

                {/* Действия профиля */}
                <MenuItem
                  onClick={handleProfileClick}
                  sx={{
                    "&:hover": {
                      backgroundColor:
                        theme === "dark"
                          ? "rgba(255,255,255,0.08)"
                          : "rgba(0,0,0,0.04)",
                    },
                  }}
                >
                  <Person sx={{ mr: 2, fontSize: 20 }} />
                  <Typography variant="body2">Профиль</Typography>
                </MenuItem>

                <MenuItem
                  onClick={handleSettingsClick}
                  sx={{
                    "&:hover": {
                      backgroundColor:
                        theme === "dark"
                          ? "rgba(255,255,255,0.08)"
                          : "rgba(0,0,0,0.04)",
                    },
                  }}
                >
                  <Settings sx={{ mr: 2, fontSize: 20 }} />
                  <Typography variant="body2">Настройки</Typography>
                </MenuItem>

                <Divider sx={{ my: 1 }} />

                {/* Выход */}
                <MenuItem
                  onClick={handleLogout}
                  sx={{
                    color: "#e74c3c",
                    "&:hover": {
                      backgroundColor: "rgba(231, 76, 60, 0.08)",
                    },
                  }}
                >
                  <Logout sx={{ mr: 2, fontSize: 20 }} />
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    Выйти
                  </Typography>
                </MenuItem>
              </Menu>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {/* Snackbar для уведомлений */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{
            width: "100%",
            backgroundColor: theme === "dark" ? "#2c3e50" : "#1976d2",
            color: "white",
            "& .MuiAlert-icon": {
              color: "white",
            },
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default HeaderWithProfile;
