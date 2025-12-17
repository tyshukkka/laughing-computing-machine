import React, { useContext } from "react";
import {
  Typography,
  Box,
  Container,
  Paper,
  Avatar,
  Divider,
} from "@mui/material";
import { ThemeContext } from "../context/ThemeContext";
import { Person } from "@mui/icons-material";

const AboutPage = () => {
  const { theme } = useContext(ThemeContext);

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          backgroundColor: theme === "dark" ? "#2c3e50" : "#ffffff",
          color: theme === "dark" ? "#ecf0f1" : "#000000",
          borderRadius: 2,
          textAlign: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Avatar
            sx={{
              width: 100,
              height: 100,
              mb: 2,
              bgcolor: theme === "dark" ? "#3498db" : "#1976d2",
              fontSize: "2rem",
            }}
          >
            <Person sx={{ fontSize: 50 }} />
          </Avatar>
          <Typography variant="h4" gutterBottom>
            О себе
          </Typography>
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Typography variant="body1" paragraph>
          Привет! Я студент, изучающий веб-разработку. Этот проект представляет
          собой сборник лабораторных работ, выполненных в рамках учебного курса.
        </Typography>

        <Typography variant="body1" paragraph>
          Здесь я практикую различные технологии веб-разработки: React,
          Material-UI, управление состоянием, маршрутизацию и многое другое.
        </Typography>

        <Typography variant="body1" paragraph>
          Каждая лабораторная работа демонстрирует определенный аспект
          разработки современных веб-приложений.
        </Typography>

        <Box
          sx={{
            mt: 4,
            p: 3,
            backgroundColor:
              theme === "dark"
                ? "rgba(52, 152, 219, 0.1)"
                : "rgba(25, 118, 210, 0.05)",
            borderRadius: 2,
          }}
        >
          <Typography variant="body2" fontStyle="italic">
            "Цель обучения - не только знание, но и действие"
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default AboutPage;
