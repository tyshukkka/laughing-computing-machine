import React, {
  useMemo,
  useState,
  useEffect,
  useCallback,
  useContext,
} from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
} from "@tanstack/react-table";
import { ThemeContext } from "../../context/ThemeContext";

// Хук для определения мобильного устройства
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkIsMobile = () => setIsMobile(window.innerWidth < 768);
    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);
  return isMobile;
};

// Компонент заголовка колонки с перетаскиванием
const DraggableColumnHeader = ({
  header,
  isMobile,
  theme,
  index,
  onDragStart,
  onDrop,
  isDragging,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const colors =
    theme === "dark"
      ? { border: "#34495e", bg: "#2c3e50", hover: "rgba(52, 152, 219, 0.1)" }
      : { border: "#e0e0e0", bg: "#f5f5f5", hover: "rgba(25, 118, 210, 0.1)" };

  return (
    <th
      draggable
      onDragStart={(e) => onDragStart(e, header.id, index)}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragOver(true);
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDragEnd={() => setIsDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        onDrop(e, header.id, index);
        setIsDragOver(false);
      }}
      style={{
        border: `1px solid ${colors.border}`,
        padding: isMobile ? "10px 4px" : "12px 8px",
        backgroundColor: isDragOver ? colors.hover : colors.bg,
        cursor: "grab",
        position: "relative",
        opacity: isDragging ? 0.5 : 1,
        transition: "all 0.2s ease",
        minWidth: isMobile ? "80px" : "auto",
        whiteSpace: "normal", // Добавлено
      }}
      onClick={header.column.getToggleSortingHandler()}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexDirection: isMobile ? "column" : "row",
          gap: isMobile ? "2px" : "8px",
        }}
      >
        <span
          style={{
            fontSize: isMobile ? "12px" : "14px",
            textAlign: "center",
            lineHeight: "1.2",
          }}
        >
          {flexRender(header.column.columnDef.header, header.getContext())}
          {{ asc: " 🔼", desc: " 🔽" }[header.column.getIsSorted()] ?? null}
        </span>
        {!isMobile && (
          <span
            style={{ fontSize: "12px", opacity: 0.5, marginLeft: "8px" }}
            title="Перетащите для изменения порядка"
          >
            ⋮⋮
          </span>
        )}
      </div>
      {isMobile && (
        <div
          style={{
            fontSize: "10px",
            opacity: 0.5,
            textAlign: "center",
            marginTop: "2px",
          }}
          title="Удерживайте для перетаскивания"
        >
          ⋮
        </div>
      )}
    </th>
  );
};

// Стили для темы
const getStyles = (isMobile, theme) => ({
  container: {
    padding: isMobile ? "10px" : "20px",
    maxWidth: "1200px",
    margin: "0 auto",
    backgroundColor: theme === "dark" ? "#1a252f" : "#ffffff",
    color: theme === "dark" ? "#ecf0f1" : "#000000",
    minHeight: "100vh",
  },
  title: {
    fontSize: isMobile ? "1.5rem" : "2rem",
    marginBottom: isMobile ? "15px" : "20px",
    textAlign: "center",
  },
  tabButton: (active) => ({
    padding: isMobile ? "8px 12px" : "10px 20px",
    backgroundColor: active
      ? theme === "dark"
        ? "#3498db"
        : "#1976d2"
      : theme === "dark"
      ? "#34495e"
      : "#f0f0f0",
    color: active ? "#ffffff" : theme === "dark" ? "#ecf0f1" : "#000000",
    border: `1px solid ${theme === "dark" ? "#2c3e50" : "#ddd"}`,
    borderRadius: "4px",
    cursor: "pointer",
    margin: isMobile ? "2px" : "0 10px 0 0",
    flex: isMobile ? "1" : "none",
  }),
  tableContainer: {
    overflowX: "auto", // Это включает горизонтальный скролл
    WebkitOverflowScrolling: "touch",
    border: `1px solid ${theme === "dark" ? "#34495e" : "#ddd"}`,
    borderRadius: "4px",
    backgroundColor: theme === "dark" ? "#2c3e50" : "#ffffff",
    width: "100%",
    boxShadow: isMobile ? "inset -5px 0 10px -5px rgba(0,0,0,0.1)" : "none",
    maxWidth: "100%",
  },
  table: {
    borderCollapse: "collapse",
    // Не задавайте фиксированную ширину здесь
  },
  th: {
    border: `1px solid ${theme === "dark" ? "#34495e" : "#e0e0e0"}`,
    padding: isMobile ? "10px 6px" : "12px 8px",
    backgroundColor: theme === "dark" ? "#2c3e50" : "#f5f5f5",
    cursor: "pointer",
    fontWeight: "bold",
    position: "sticky",
    top: 0,
    zIndex: 10,
    whiteSpace: "nowrap", // Не переносить заголовки
    minWidth: "120px", // Минимальная ширина заголовков
  },
  td: {
    border: `1px solid ${theme === "dark" ? "#34495e" : "#e0e0e0"}`,
    padding: isMobile ? "8px 6px" : "10px 8px",
    position: "relative",
    whiteSpace: "normal",
    wordBreak: "break-word",
    minWidth: "100px", // Минимальная ширина ячеек
  },
  firstColumn: {
    position: isMobile ? "sticky" : "relative",
    left: 0,
    backgroundColor: theme === "dark" ? "#2c3e50" : "#ffffff",
    zIndex: 5,
    boxShadow: isMobile
      ? `2px 0 5px rgba(0,0,0,${theme === "dark" ? "0.3" : "0.1"})`
      : "none",
  },
  searchInput: {
    padding: "8px 12px",
    width: isMobile ? "100%" : "300px",
    border: `1px solid ${theme === "dark" ? "#34495e" : "#ddd"}`,
    borderRadius: "4px",
    backgroundColor: theme === "dark" ? "#2c3e50" : "#ffffff",
    color: theme === "dark" ? "#ecf0f1" : "#000000",
    marginBottom: "15px",
  },
  button: {
    padding: "8px 16px",
    backgroundColor: theme === "dark" ? "#3498db" : "#1976d2",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
});

// Инициализация данных
const initializeData = () => {
  const adminUser = {
    id: "admin_1",
    name: "Администратор",
    email: "admin@example.com",
    role: "admin",
    status: "active",
    password: "admin123",
    createdAt: new Date().toISOString(),
  };

  if (
    !localStorage.getItem("lab8_users") ||
    JSON.parse(localStorage.getItem("lab8_users")).length === 0
  ) {
    localStorage.setItem("lab8_users", JSON.stringify([adminUser]));
  }
  if (!localStorage.getItem("currentUser")) {
    localStorage.setItem("currentUser", JSON.stringify(adminUser));
  }
  if (!localStorage.getItem("lab8_feedbacks")) {
    localStorage.setItem("lab8_feedbacks", JSON.stringify([]));
  }

  return JSON.parse(localStorage.getItem("currentUser") || "null");
};

const Lab8 = () => {
  const isMobile = useIsMobile();
  const { theme } = useContext(ThemeContext);
  const styles = useMemo(() => getStyles(isMobile, theme), [isMobile, theme]);

  const [activeTab, setActiveTab] = useState("users");
  const [users, setUsers] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [globalFilter, setGlobalFilter] = useState("");

  const [userColumnOrder, setUserColumnOrder] = useState([]);
  const [feedbackColumnOrder, setFeedbackColumnOrder] = useState([]);
  const [draggedColumn, setDraggedColumn] = useState({
    id: null,
    index: -1,
    type: null,
  });

  useEffect(() => {
    const user = initializeData();
    setUsers(JSON.parse(localStorage.getItem("lab8_users") || "[]"));
    setFeedbacks(JSON.parse(localStorage.getItem("lab8_feedbacks") || "[]"));
    setCurrentUser(user);
  }, []);

  const saveUsers = (newUsers) => {
    localStorage.setItem("lab8_users", JSON.stringify(newUsers));
    setUsers(newUsers);
  };

  const saveFeedbacks = (newFeedbacks) => {
    localStorage.setItem("lab8_feedbacks", JSON.stringify(newFeedbacks));
    setFeedbacks(newFeedbacks);
  };

  const handleDeleteUser = (userId) => {
    if (userId === currentUser?.id) return alert("Вы не можете удалить себя!");
    if (window.confirm("Удалить пользователя?"))
      saveUsers(users.filter((user) => user.id !== userId));
  };

  const handleBlockUser = (userId) => {
    if (userId === currentUser?.id)
      return alert("Вы не можете заблокировать себя!");
    saveUsers(
      users.map((user) =>
        user.id === userId
          ? { ...user, status: user.status === "active" ? "blocked" : "active" }
          : user
      )
    );
  };

  const handleChangePassword = (userId) => {
    const newPassword = prompt("Введите новый пароль (минимум 6 символов):");
    if (newPassword && newPassword.length >= 6) {
      saveUsers(
        users.map((user) =>
          user.id === userId ? { ...user, password: newPassword } : user
        )
      );
      alert("Пароль изменен!");
    } else if (newPassword)
      alert("Пароль должен содержать минимум 6 символов!");
  };

  const handleAddUser = () => {
    const newId = `user_${Date.now()}`;
    const newUser = {
      id: newId,
      name: `Пользователь ${users.length + 1}`,
      email: `user${users.length + 1}@example.com`,
      role: "user",
      status: "active",
      password: "user123",
      createdAt: new Date().toISOString(),
    };
    saveUsers([...users, newUser]);
  };

  const handleDeleteFeedback = (feedbackId) => {
    if (window.confirm("Удалить отзыв?"))
      saveFeedbacks(feedbacks.filter((fb) => fb.id !== feedbackId));
  };

  // Инициализация порядка колонок
  useEffect(() => {
    if (users.length > 0 && userColumnOrder.length === 0)
      setUserColumnOrder([
        "id",
        "email",
        "name",
        "role",
        "status",
        "password",
        "actions",
      ]);
    if (feedbacks.length > 0 && feedbackColumnOrder.length === 0)
      setFeedbackColumnOrder([
        "id",
        "userName",
        "userEmail",
        "message",
        "rating",
        "createdAt",
        "actions",
      ]);
  }, [users, feedbacks]);

  // Drag & Drop функции
  const handleDragStart = (e, columnId, index, type) => {
    setDraggedColumn({ id: columnId, index, type });
    e.dataTransfer.setData("text/plain", columnId);
  };

  const handleDrop = (e, targetColumnId, targetIndex, type) => {
    e.preventDefault();
    const draggedId = e.dataTransfer.getData("text/plain");
    if (
      draggedId &&
      draggedId !== targetColumnId &&
      draggedColumn.type === type
    ) {
      const currentOrder =
        type === "users" ? [...userColumnOrder] : [...feedbackColumnOrder];
      [currentOrder[draggedColumn.index], currentOrder[targetIndex]] = [
        currentOrder[targetIndex],
        currentOrder[draggedColumn.index],
      ];
      type === "users"
        ? setUserColumnOrder(currentOrder)
        : setFeedbackColumnOrder(currentOrder);
    }
    setDraggedColumn({ id: null, index: -1, type: null });
  };

  const userColumns = useMemo(() => {
    const baseColumns = {
      id: { accessorKey: "id", header: "ID", size: 80 },
      email: { accessorKey: "email", header: "Email", size: 150 },
      name: { accessorKey: "name", header: "Имя", size: 120 },
      role: {
        accessorKey: "role",
        header: "Роль",
        size: 100,
        cell: ({ row }) => (
          <span
            style={{
              padding: "4px 8px",
              borderRadius: "4px",
              backgroundColor:
                row.original.role === "admin"
                  ? theme === "dark"
                    ? "#155724"
                    : "#d4edda"
                  : theme === "dark"
                  ? "#721c24"
                  : "#f8d7da",
              color:
                row.original.role === "admin"
                  ? theme === "dark"
                    ? "#ffffff"
                    : "#155724"
                  : theme === "dark"
                  ? "#ffffff"
                  : "#721c24",
            }}
          >
            {row.original.role === "admin" ? "Админ" : "Пользователь"}
          </span>
        ),
      },
      status: {
        accessorKey: "status",
        header: "Статус",
        size: 100,
        cell: ({ row }) => (
          <span
            style={{
              padding: "4px 8px",
              borderRadius: "4px",
              backgroundColor:
                row.original.status === "active"
                  ? theme === "dark"
                    ? "#155724"
                    : "#d4edda"
                  : theme === "dark"
                  ? "#721c24"
                  : "#f8d7da",
              color:
                row.original.status === "active"
                  ? theme === "dark"
                    ? "#ffffff"
                    : "#155724"
                  : theme === "dark"
                  ? "#ffffff"
                  : "#721c24",
            }}
          >
            {row.original.status === "active" ? "Активен" : "Заблокирован"}
          </span>
        ),
      },
      password: {
        accessorKey: "password",
        header: "Пароль",
        size: 120,
        cell: ({ row }) => (
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <span
              style={{
                padding: "2px 6px",
                backgroundColor: theme === "dark" ? "#34495e" : "#f8f9fa",
                borderRadius: "3px",
                fontFamily: "monospace",
              }}
            >
              {row.original.password}
            </span>
            {currentUser?.role === "admin" && (
              <button
                onClick={() => handleChangePassword(row.original.id)}
                style={{
                  padding: "2px 4px",
                  backgroundColor: theme === "dark" ? "#3498db" : "#1976d2",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Изм
              </button>
            )}
          </div>
        ),
      },
      actions: {
        accessorKey: "actions",
        header: "Действия",
        size: 150,
        cell: ({ row }) =>
          currentUser?.role === "admin" ? (
            <div style={{ display: "flex", gap: "4px" }}>
              {row.original.id !== currentUser?.id && (
                <>
                  <button
                    onClick={() => handleBlockUser(row.original.id)}
                    style={{
                      padding: "4px 8px",
                      backgroundColor:
                        row.original.status === "active"
                          ? theme === "dark"
                            ? "#e74c3c"
                            : "#dc3545"
                          : theme === "dark"
                          ? "#27ae60"
                          : "#28a745",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    {row.original.status === "active" ? "Блок" : "Разбл"}
                  </button>
                  <button
                    onClick={() => handleDeleteUser(row.original.id)}
                    style={{
                      padding: "4px 8px",
                      backgroundColor: theme === "dark" ? "#6c757d" : "#6c757d",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    Удалить
                  </button>
                </>
              )}
            </div>
          ) : (
            "Нет доступа"
          ),
      },
    };

    return userColumnOrder
      .filter((colId) => baseColumns[colId])
      .map((colId) => baseColumns[colId]);
  }, [theme, currentUser, userColumnOrder]);

  const feedbackColumns = useMemo(() => {
    const baseColumns = {
      id: { accessorKey: "id", header: "ID", size: 70 },
      userName: { accessorKey: "userName", header: "Пользователь", size: 120 },
      userEmail: { accessorKey: "userEmail", header: "Email", size: 150 },
      message: {
        accessorKey: "message",
        header: "Сообщение",
        size: 200,
        cell: ({ row }) => (
          <div style={{ maxHeight: "40px", overflow: "auto" }}>
            {row.original.message}
          </div>
        ),
      },
      rating: {
        accessorKey: "rating",
        header: "Оценка",
        size: 80,
        cell: ({ row }) => (
          <span style={{ color: "#f39c12" }}>
            {"★".repeat(row.original.rating)}
            {"☆".repeat(5 - row.original.rating)}
          </span>
        ),
      },
      createdAt: {
        accessorKey: "createdAt",
        header: "Дата",
        size: 100,
        cell: ({ row }) => (
          <span>
            {new Date(row.original.createdAt).toLocaleDateString("ru-RU")}
          </span>
        ),
      },
      actions: {
        accessorKey: "actions",
        header: "Действия",
        size: 100,
        cell: ({ row }) =>
          currentUser?.role === "admin" ? (
            <button
              onClick={() => handleDeleteFeedback(row.original.id)}
              style={{
                padding: "4px 8px",
                backgroundColor: theme === "dark" ? "#e74c3c" : "#dc3545",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Удалить
            </button>
          ) : (
            "Нет доступа"
          ),
      },
    };

    return feedbackColumnOrder
      .filter((colId) => baseColumns[colId])
      .map((colId) => baseColumns[colId]);
  }, [theme, currentUser, feedbackColumnOrder]);

  const userTable = useReactTable({
    data: users,
    columns: userColumns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const feedbackTable = useReactTable({
    data: feedbacks,
    columns: feedbackColumns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const renderTable = (table, type) => {
    const isUserTable = type === "users";
    const data = isUserTable ? users : feedbacks;
    const columnsCount = table.getAllColumns().length;

    return (
      <div>
        <div
          style={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            gap: "10px",
            marginBottom: "15px",
          }}
        >
          <input
            type="text"
            placeholder="Поиск..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            style={styles.searchInput}
          />
          {isUserTable && currentUser?.role === "admin" && (
            <button onClick={handleAddUser} style={styles.button}>
              + Добавить пользователя
            </button>
          )}
        </div>

        <div style={styles.tableContainer}>
          <table
            style={{
              ...styles.table,
              // Динамическая ширина для горизонтального скролла
              minWidth: isMobile
                ? `${columnsCount * 120}px` // Пример: 120px на колонку
                : "100%",
              width: isMobile ? "auto" : "100%",
            }}
          >
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header, index) => (
                    <DraggableColumnHeader
                      key={header.id}
                      header={header}
                      isMobile={isMobile}
                      theme={theme}
                      index={index}
                      onDragStart={(e, colId, idx) =>
                        handleDragStart(e, colId, idx, type)
                      }
                      onDrop={(e, colId, idx) =>
                        handleDrop(e, colId, idx, type)
                      }
                      isDragging={draggedColumn.type === type}
                    />
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row, rowIndex) => (
                <tr
                  key={row.id}
                  style={{
                    backgroundColor:
                      rowIndex % 2 === 0
                        ? theme === "dark"
                          ? "rgba(255,255,255,0.02)"
                          : "rgba(0,0,0,0.01)"
                        : "transparent",
                  }}
                >
                  {row.getVisibleCells().map((cell, index) => (
                    <td
                      key={cell.id}
                      style={{
                        ...styles.td,
                        ...(isMobile && index === 0 ? styles.firstColumn : {}),
                        // Минимальная ширина ячеек
                        minWidth: isMobile ? "100px" : "120px",
                      }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {isMobile && (
          <>
            <div
              style={{
                textAlign: "center",
                padding: "10px",
                fontSize: "12px",
                color: theme === "dark" ? "#bdc3c7" : "#666",
                backgroundColor:
                  theme === "dark"
                    ? "rgba(255,255,255,0.05)"
                    : "rgba(0,0,0,0.03)",
                borderRadius: "4px",
                marginTop: "5px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
            >
              <span>←</span>
              <span>Скроллируйте вправо для просмотра всех колонок</span>
              <span>→</span>
            </div>
            <div
              style={{
                marginTop: "10px",
                fontSize: "12px",
                color: theme === "dark" ? "#95a5a6" : "#666",
                textAlign: "center",
                padding: "8px",
                backgroundColor:
                  theme === "dark"
                    ? "rgba(52, 152, 219, 0.1)"
                    : "rgba(25, 118, 210, 0.1)",
                borderRadius: "4px",
              }}
            >
              💡{" "}
              {isUserTable
                ? "Первая колонка (ID) зафиксирована. Тапните и удерживайте заголовок для перетаскивания."
                : "Используйте горизонтальный скролл для навигации."}
            </div>
          </>
        )}
      </div>
    );
  };

  if (!currentUser) {
    return (
      <div style={styles.container}>
        <h2 style={styles.title}>Лабораторная работа 8</h2>
        <div
          style={{
            padding: "40px",
            textAlign: "center",
            backgroundColor: theme === "dark" ? "#2c3e50" : "#fff3cd",
            borderRadius: "8px",
          }}
        >
          <h3>Создан администратор!</h3>
          <p>Email: admin@example.com</p>
          <p>Пароль: admin123</p>
          <button
            onClick={() => {
              const adminUser = {
                id: "admin_1",
                name: "Администратор",
                email: "admin@example.com",
                role: "admin",
                status: "active",
                password: "admin123",
              };
              localStorage.setItem("currentUser", JSON.stringify(adminUser));
              setCurrentUser(adminUser);
            }}
            style={{ ...styles.button, marginTop: "20px" }}
          >
            Войти как администратор
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Лабораторная работа 8</h2>

      <div
        style={{
          display: "flex",
          flexWrap: isMobile ? "wrap" : "nowrap",
          gap: isMobile ? "4px" : "10px",
          marginBottom: "20px",
        }}
      >
        {["users", "feedbacks"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={styles.tabButton(activeTab === tab)}
          >
            {tab === "users" ? "Пользователи" : "Отзывы"}
          </button>
        ))}
      </div>

      {activeTab === "users" && (
        <div>
          <h3 style={{ marginBottom: "16px" }}>
            Управление пользователями ({users.length})
          </h3>
          {currentUser.role === "admin" ? (
            users.length > 0 ? (
              renderTable(userTable, "users")
            ) : (
              <div style={{ textAlign: "center", padding: "40px" }}>
                <p>Нет пользователей.</p>
                <button onClick={handleAddUser} style={styles.button}>
                  Добавить пользователя
                </button>
              </div>
            )
          ) : (
            <div
              style={{
                padding: "20px",
                textAlign: "center",
                backgroundColor: theme === "dark" ? "#2c3e50" : "#fff3cd",
                borderRadius: "4px",
              }}
            >
              <p>
                <strong>Доступ запрещен</strong>
              </p>
              <p>Требуются права администратора</p>
            </div>
          )}
        </div>
      )}

      {activeTab === "feedbacks" && (
        <div>
          <h3 style={{ marginBottom: "16px" }}>
            Управление отзывами ({feedbacks.length})
          </h3>
          {currentUser.role === "admin" ? (
            feedbacks.length > 0 ? (
              renderTable(feedbackTable, "feedbacks")
            ) : (
              <div style={{ textAlign: "center", padding: "40px" }}>
                Нет отзывов.
              </div>
            )
          ) : (
            <div
              style={{
                padding: "20px",
                textAlign: "center",
                backgroundColor: theme === "dark" ? "#2c3e50" : "#fff3cd",
                borderRadius: "4px",
              }}
            >
              <p>
                <strong>Доступ запрещен</strong>
              </p>
              <p>Требуются права администратора</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Lab8;
