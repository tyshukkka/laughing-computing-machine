import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  useTheme,
} from "@mui/material";
import { ThemeContext } from "../../context/ThemeContext";

export default function Lab7() {
  const muiTheme = useTheme();
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const currentUser = localStorage.getItem("currentUser")
    ? JSON.parse(localStorage.getItem("currentUser"))
    : null;

  // Обработчик перехода к Lab5
  const handleGoToLab5 = () => {
    navigate("/lab5");
  };

  // Стили для карточек
  const cardStyles = {
    backgroundColor: theme === "dark" ? "#2c3e50" : "#ffffff",
    color: theme === "dark" ? "#ecf0f1" : "#000000",
    border: theme === "dark" ? "1px solid #34495e" : "1px solid #e0e0e0",
    transition: "all 0.3s ease",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    "&:hover": {
      boxShadow:
        theme === "dark"
          ? "0 4px 20px rgba(0,0,0,0.3)"
          : "0 4px 20px rgba(0,0,0,0.1)",
      transform: "translateY(-2px)",
    },
  };

  // Стили для текста
  const textStyles = {
    color: theme === "dark" ? "#ecf0f1" : "#000000",
  };

  return (
    <Box
      sx={{
        width: "100%",
        color: textStyles.color,
        p: { xs: 2, sm: 3, md: 4 },
        boxSizing: "border-box",
      }}
    >
      {/* Заголовок лабы */}
      <Typography variant="h4" gutterBottom sx={textStyles}>
        Лабораторная работа 7
      </Typography>

      <Grid container spacing={3}>
        {/* Карточка 1 */}
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={cardStyles}>
            <CardContent
              sx={{
                flexGrow: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "150px",
              }}
            >
              <Typography variant="h4" sx={textStyles} align="center">
                адаптивность
                <br />
                под размер
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Карточка 2 */}
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={cardStyles}>
            <CardContent
              sx={{
                flexGrow: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "150px",
              }}
            >
              <Typography variant="h4" sx={textStyles} align="center">
                адаптивность
                <br />
                под размер
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Карточка 3 */}
        <Grid item xs={12} sm={12} md={4}>
          <Card sx={cardStyles}>
            <CardContent
              sx={{
                flexGrow: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "150px",
              }}
            >
              <Typography variant="h4" sx={textStyles} align="center">
                адаптивность
                <br />
                под размер
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Карточка 4: Кнопка перехода к Lab5 */}
        <Grid item xs={12}>
          <Card
            sx={{
              ...cardStyles,
              backgroundColor: theme === "dark" ? "#1a5276" : "#e8f4fd",
              borderLeft: `4px solid ${
                theme === "dark" ? "#3498db" : "#1976d2"
              }`,
            }}
          >
            <CardContent sx={{ textAlign: "center", py: 4 }}>
              <Typography variant="h5" sx={textStyles} gutterBottom>
                Форма обратной связи
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  ...textStyles,
                  mb: 3,
                  maxWidth: "600px",
                  mx: "auto",
                }}
              >
                {currentUser
                  ? `Приветствуем, ${currentUser.name}!`
                  : "Для оставления отзыва необходимо войти в систему."}
              </Typography>

              <Button
                variant="contained"
                size="large"
                onClick={handleGoToLab5}
                sx={{
                  backgroundColor: theme === "dark" ? "#3498db" : "#1976d2",
                  color: "white",
                  px: 4,
                  py: 1.5,
                  fontSize: "1.1rem",
                  fontWeight: "bold",
                  borderRadius: 2,
                  "&:hover": {
                    backgroundColor: theme === "dark" ? "#2980b9" : "#1565c0",
                    transform: "scale(1.05)",
                  },
                  transition: "all 0.3s ease",
                  mb: 2,
                }}
              >
                {currentUser ? "Перейти к отзывам" : "Перейти к авторизации"}
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
