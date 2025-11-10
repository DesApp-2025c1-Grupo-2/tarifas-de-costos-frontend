import { Link as RouterLink, useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Link,
  useTheme, // <-- Importamos useTheme
} from "@mui/material";

interface OptionMenuProps {
  isCollapsed: boolean;
  onClick: () => void;
  title: string;
  link?: string;
  isExternal?: boolean;
  IconComponent: React.ElementType;
  isSubmenu?: boolean;
}

export default function OptionMenu({
  isCollapsed,
  onClick,
  IconComponent,
  title,
  link = "",
  isExternal = false,
  isSubmenu = false, // <-- Esta prop es la clave
}: OptionMenuProps) {
  const location = useLocation();
  const [isActive, setIsActive] = useState(false);
  const theme = useTheme(); // <-- Obtenemos el tema

  useEffect(() => {
    if (isExternal) {
      setIsActive(false);
      return;
    }
    const currentPathname = location.pathname;
    const targetPath = `/${link}`;

    if (link === "" && currentPathname === "/") {
      setIsActive(true);
      return;
    }
    if (link === "tarifas" && currentPathname === "/") {
      setIsActive(true);
      return;
    }

    setIsActive(link ? currentPathname.startsWith(targetPath) : false);
  }, [location, link, isExternal]);

  // --- INICIO DE LA CORRECCIÓN ---

  // Colores para el estado ACTIVO o HOVER DE SUBMENÚ
  const activeBackgroundColor = theme.palette.primary.main; // Ámbar
  const activeColor = "white"; // Blanco

  // Colores para el estado INACTIVO
  const inactiveColor = "#5A5A65"; // Gris
  const inactiveHoverColor = theme.palette.action.hover; // Gris claro

  const buttonContent = (
    <ListItemButton
      onClick={onClick}
      selected={isActive} // Controla el estado "activo"
      sx={{
        borderRadius: 2,
        minHeight: 48,
        justifyContent: isCollapsed ? "center" : "initial",
        px: 2.5,
        pl: isSubmenu && !isCollapsed ? 4 : 2.5,
        mb: 1,
        color: "text.secondary", // Color de texto por defecto (gris)

        "& .MuiListItemIcon-root": {
          color: inactiveColor, // Ícono gris por defecto
        },

        // Estilo cuando está ACTIVO (selected={true})
        // (Esto se aplica a "Inicio" o "Tarifas" si están activos)
        "&.Mui-selected": {
          backgroundColor: activeBackgroundColor, // Fondo Ámbar
          color: activeColor, // Texto Blanco
          "& .MuiListItemIcon-root": {
            color: activeColor, // Ícono Blanco
          },
          "&:hover": {
            backgroundColor: theme.palette.primary.dark, // Ámbar más oscuro
          },
        },

        // Estilo cuando pasas el mouse (HOVER) y NO está activo
        "&:hover": {
          // Si es Submenú ("Tarifas"), pon fondo Ámbar/texto Blanco
          // Si NO es Submenú ("Inicio"), pon fondo Gris Claro/texto Gris
          backgroundColor: isSubmenu
            ? activeBackgroundColor
            : inactiveHoverColor,
          color: isSubmenu ? activeColor : inactiveColor,
          "& .MuiListItemIcon-root": {
            color: isSubmenu ? activeColor : inactiveColor,
          },
        },
      }}
    >
      <ListItemIcon
        sx={{
          minWidth: 0,
          mr: isCollapsed ? "auto" : 3,
          justifyContent: "center",
        }}
      >
        <IconComponent />
      </ListItemIcon>
      <ListItemText
        primary={title}
        sx={{
          opacity: isCollapsed ? 0 : 1,
          "& .MuiTypography-root": {
            fontWeight: isActive ? 500 : 400,
          },
        }}
      />
    </ListItemButton>
  );

  // --- FIN DE LA CORRECCIÓN ---

  return (
    <ListItem disablePadding sx={{ display: "block" }}>
      <Tooltip title={isCollapsed ? title : ""} placement="right">
        {isExternal ? (
          <Link
            href={link}
            target="_self"
            rel="noopener noreferrer"
            underline="none"
            color="inherit"
          >
            {buttonContent}
          </Link>
        ) : (
          <RouterLink
            to={`/${link}`}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            {buttonContent}
          </RouterLink>
        )}
      </Tooltip>
    </ListItem>
  );
}
