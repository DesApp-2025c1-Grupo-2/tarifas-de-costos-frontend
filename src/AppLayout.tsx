import React, { useState } from "react";
import Sidebar from "./components/Sidebar/Sidebar";
import {
  Box,
  Paper, // <-- Este 'Paper' ya no lo usamos para envolver
  useMediaQuery,
  useTheme,
  IconButton,
  Button,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleToggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const drawerWidth = 240;
  const collapsedDrawerWidth = 80;

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "#F6F7FB",
        position: "relative",
      }}
    >
      <Sidebar
        isVisible={sidebarVisible}
        setIsVisible={setSidebarVisible}
        isCollapsed={isCollapsed}
      />

      {/* ... (El código de los botones de colapso y menú móvil no cambia) ... */}
      {!isMobile && (
        <Button
          onClick={handleToggleCollapse}
          aria-label={isCollapsed ? "Expandir menú" : "Contraer menú"}
          sx={{
            position: "absolute",
            top: "28px",
            left: isCollapsed
              ? `${collapsedDrawerWidth}px`
              : `${drawerWidth}px`,
            transform: "translateX(-50%)",
            zIndex: 1301,
            backgroundColor: "white",
            padding: "4px",
            borderRadius: "50%",
            width: "max-content",
            border: "1px solid #d1d5db",
            minWidth: "1px",
            color: "#6b7280",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
            "&:hover": {
              backgroundColor: "#f3f4f6",
            },
            transition:
              "left 0.2s ease-in-out, background-color 0.2s ease-in-out",
          }}
        >
          {isCollapsed ? (
            <ChevronRight style={{ width: "16px", height: "16px" }} />
          ) : (
            <ChevronLeft style={{ width: "16px", height: "16px" }} />
          )}
        </Button>
      )}

      {isMobile && !sidebarVisible && (
        <IconButton
          aria-label="open drawer"
          onClick={() => setSidebarVisible(true)}
          sx={{
            position: "absolute",
            top: 16,
            left: 16,
            zIndex: 1300,
            border: `1px solid ${theme.palette.grey[400]}`,
            borderRadius: "8px",
            "&:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.04)",
            },
          }}
        >
          <MenuIcon sx={{ color: "text.primary" }} />
        </IconButton>
      )}

      {/* --- INICIO DE LA MODIFICACIÓN --- */}
      {/* Contenido principal (sin el <Paper> wrapper) */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3, // Padding general (como en Viajes)
          pt: { xs: 8, md: 3 }, // Padding top (8 en móvil para el botón, 3 en desktop)
          width: "100%",
          overflowX: "hidden",
        }}
      >
        {/* Ya no envolvemos {children} en un <Paper> */}
        {children}
      </Box>
      {/* --- FIN DE LA MODIFICACIÓN --- */}
    </Box>
  );
};

export default AppLayout;
