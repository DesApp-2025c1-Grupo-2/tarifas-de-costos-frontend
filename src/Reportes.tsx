import React, { useState } from "react";
import Sidebar from "./components/Sidebar/Sidebar";
import {
  Box,
  Paper,
  Typography,
  useMediaQuery,
  useTheme,
  IconButton,
  Tabs,
  Tab,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { ChevronLeft, ChevronRight } from "lucide-react";
import CatalogoAdicionales from "./components/reportes/CatalogoAdicionales";
// --- IMPORT ELIMINADO ---
// import ComparativaVehiculosCostos from "./components/reportes/ComparativaZonasCostos"; // El nombre del archivo sigue siendo el mismo
// --- FIN ---
import { TransportistasMasUtilizadosReporte } from "./components/reportes/TransportistasMasUtilizadosReporte";
import ComparativaCostosTransportistas from "./components/reportes/ComparativaCostosTransportistas";
import ComparativaAumentosReporte from "./components/reportes/ComparativaAumentosReporte";
import ReporteHistorialServicios from "./components/reportes/ReporteHistorialServicios";
import ReporteUsoCombustible from "./components/reportes/ReporteUsoCombustible";

const Reportes: React.FC = () => {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [tabIndex, setTabIndex] = useState(0);

  const handleToggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  const drawerWidth = 256;
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

      {!isMobile && (
        <IconButton
          onClick={handleToggleCollapse}
          sx={{
            position: "absolute",
            top: "28px",
            left: isCollapsed
              ? `${collapsedDrawerWidth}px`
              : `${drawerWidth}px`,
            transform: "translateX(-50%)",
            zIndex: 1301,
            backgroundColor: "white",
            border: `1px solid ${theme.palette.divider}`,
            boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
            transition: "left 0.2s ease-in-out",
            "&:hover": {
              backgroundColor: theme.palette.grey[100],
            },
          }}
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </IconButton>
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

      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: "100%", overflowX: "hidden" }}
      >
        <Paper
          sx={{
            p: { xs: 2, md: 4 },
            pt: { xs: 8, md: 4 },
            borderRadius: "8px",
            boxShadow: "none",
          }}
        >
          <Typography variant="h5" component="h1" gutterBottom sx={{ mb: 3 }}>
            Reportes Generales
          </Typography>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={tabIndex}
              onChange={handleTabChange}
              aria-label="tabs reportes"
              variant="scrollable"
              scrollButtons="auto"
              allowScrollButtonsMobile
            >
              {/* --- TAB ELIMINADA --- */}
              {/* <Tab label="Comparativa Vehículos y Costos" /> */}
              {/* --- FIN --- */}
              <Tab label="Uso de Combustible" />
              <Tab label="Catálogo de Adicionales" />
              <Tab label="Transportistas Más Utilizados" />
              <Tab label="Comparativa por Transportista" />
              <Tab label="Análisis de Aumentos" />
              <Tab label="Historial de Servicios" />
            </Tabs>
          </Box>
          <Box sx={{ mt: 2 }}>
            {/* --- COMPONENTES REORDENADOS (ÍNDICES CAMBIADOS) --- */}
            {tabIndex === 0 && <ReporteUsoCombustible />}
            {tabIndex === 1 && <CatalogoAdicionales />}
            {tabIndex === 2 && <TransportistasMasUtilizadosReporte />}
            {tabIndex === 3 && <ComparativaCostosTransportistas />}
            {tabIndex === 4 && <ComparativaAumentosReporte />}
            {tabIndex === 5 && <ReporteHistorialServicios />}
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default Reportes;