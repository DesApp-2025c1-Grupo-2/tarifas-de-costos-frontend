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
  isSubmenu = false,
}: OptionMenuProps) {
  const location = useLocation();
  const [isActive, setIsActive] = useState(false);
  const theme = useTheme(); // <-- Obtenemos el tema

  // --- INICIO DE LA MODIFICACIÓN DE COLORES ---
  // Invertimos la lógica para que el Sidebar mantenga los colores originales
  const colorFondoSidebar = theme.palette.secondary.main; // <-- ÁMBAR (ahora es secondary)
  const colorTextoActivo = theme.palette.primary.main; // <-- NARANJA (ahora es primary)
  const colorGris = "#5A5A65"; // Gris (texto inactivo/hover)
  // --- FIN DE LA MODIFICACIÓN DE COLORES ---

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
        py: 0.5, // <-- MODIFICACIÓN: Añadido padding vertical

        // 1. Estado Inactivo (Default)
        color: colorGris,
        backgroundColor: "transparent",
        "& .MuiListItemIcon-root": {
          color: colorGris,
        },

        // 2. Estado Activo (Fondo Ámbar, Texto Naranja)
        "&.Mui-selected": {
          backgroundColor: colorFondoSidebar, // <-- Ámbar
          color: colorTextoActivo, // <-- Naranja
          "& .MuiListItemIcon-root": {
            color: colorTextoActivo, // <-- Naranja
          },
        },

        // 3. Estado Hover (Inactivo) (Fondo Ámbar, Texto Gris)
        "&:hover": {
          backgroundColor: colorFondoSidebar, // <-- Ámbar
          color: colorGris,
          "& .MuiListItemIcon-root": {
            color: colorGris,
          },
        },

        // 4. Hover sobre un ítem Activo (Fondo Ámbar, Texto Naranja)
        "&.Mui-selected:hover": {
          backgroundColor: colorFondoSidebar, // <-- Ámbar
          color: colorTextoActivo, // <-- Naranja
          "& .MuiListItemIcon-root": {
            color: colorTextoActivo, // <-- Naranja
          },
        },
      }}
    >
      <ListItemIcon
        sx={{
          minWidth: 0,
          mr: isCollapsed ? "auto" : 3,
          justifyContent: "center",
          color: "inherit", // Hereda el color del ListItemButton
        }}
      >
        <IconComponent />
      </ListItemIcon>
      <ListItemText
        primary={title}
        sx={{
          opacity: isCollapsed ? 0 : 1,
          color: "inherit", // Hereda el color del ListItemButton
          "& .MuiTypography-root": {
            fontWeight: isActive ? 500 : 400,
            fontSize: "0.875rem", // <-- Letra más chica (14px)
          },
        }}
      />
    </ListItemButton>
  );

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
