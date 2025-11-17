import React, { useState, useEffect } from "react";
import {
  Box,
  Drawer,
  Toolbar,
  useTheme,
  useMediaQuery,
  List,
  Tooltip,
  Divider, // Importamos el Divider
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Home, Route, ClipboardList, Coins } from "lucide-react";
import { sidebarMenus } from "../../lib/sidebarMenus";
import DropdownMenu from "./DropDownMenus";
import OptionMenu from "./OptionMenu";

interface SidebarProps {
  isVisible: boolean;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
  isCollapsed: boolean;
}

const drawerWidth = 240;
const collapsedDrawerWidth = 80;

type SidebarMenuKey = keyof typeof sidebarMenus;

export default function Sidebar({
  isVisible,
  setIsVisible,
  isCollapsed,
}: SidebarProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();

  const [openSection, setOpenSection] = useState<string | null>(
    "Gestión de Costos"
  );

  const menuItems = [
    { key: "inicio", src: Home, title: "Inicio" },
    { key: "viajes", src: Route, title: "Gestión de Viajes" },
    { key: "remitos", src: ClipboardList, title: "Gestión de Remitos" },
    { key: "costos", src: Coins, title: "Gestión de Costos" },
  ];

  const getItems = (key: SidebarMenuKey) => {
    return sidebarMenus[key] || [];
  };

  const handleLogoClick = () => {
    window.location.href = "https://gestion-de-viajes.vercel.app/";
  };

  const selectOption = () => {
    if (isMobile) {
      setIsVisible(false);
    }
  };

  useEffect(() => {
    const isCostosApp =
      window.location.host.includes("tarifas-de-costo") ||
      window.location.port === "8080";
    if (isCostosApp) {
      setOpenSection("Gestión de Costos");
    }
  }, []);

  const drawerContent = (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        backgroundColor: "#FFFFFF",
      }}
    >
      <Toolbar
        sx={{
          justifyContent: "center",
          minHeight: "90px",
          cursor: "pointer",
          mb: 1.5,
        }}
        onClick={handleLogoClick}
      >
        <Tooltip
          title={isCollapsed ? "Ir a la página de inicio" : ""}
          placement="right"
        >
          {/* --- INICIO DE LA MODIFICACIÓN --- */}
          <Box
            component="img"
            src={isCollapsed ? "/img/logo_chico.jpg" : "/img/logo.jpeg"}
            alt="Gestión de viajes logo con camión naranja sobre fondo blanco, transmite profesionalismo y confianza"
            sx={{
              minHeight: "48px",
              margin: "12px auto",
              width: isCollapsed ? "48px" : "90%",
              transition: "all 0.3s ease-in-out",
              maxHeight: "140px",
            }}
          />
          {/* --- FIN DE LA MODIFICACIÓN --- */}
        </Tooltip>
      </Toolbar>

      <Divider />

      <List sx={{ flexGrow: 1, p: 1, pt: 2, overflowY: "auto" }}>
        {menuItems.map((item) => {
          if (item.key === "inicio") {
            return (
              <OptionMenu
                key={item.key}
                IconComponent={item.src}
                title={item.title}
                isCollapsed={isCollapsed}
                link={"https://gestion-de-viajes.vercel.app/"}
                isExternal={true}
                onClick={selectOption}
              />
            );
          }
          return (
            <DropdownMenu
              key={item.key}
              IconComponent={item.src}
              isCollapsed={isCollapsed}
              title={item.title}
              items={getItems(item.key as SidebarMenuKey)}
              onClick={selectOption}
              isOpen={openSection === item.title}
              onToggle={() =>
                setOpenSection((prev) =>
                  prev === item.title ? null : item.title
                )
              }
            />
          );
        })}
      </List>
    </Box>
  );

  return (
    <Drawer
      variant={isMobile ? "temporary" : "permanent"}
      open={isMobile ? isVisible : true}
      onClose={() => setIsVisible(false)}
      sx={{
        width: isMobile
          ? drawerWidth
          : isCollapsed
          ? collapsedDrawerWidth
          : drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: isMobile
            ? drawerWidth
            : isCollapsed
            ? collapsedDrawerWidth
            : drawerWidth,
          boxSizing: "border-box",
          backgroundColor: "white",
          borderRight: { xs: "none", md: "1px solid #e0e0e0" },
          boxShadow: "1px 0 5px rgba(131, 131, 131, 0.1)",
          transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          overflowX: "hidden",
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
}
