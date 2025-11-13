import React, { useMemo } from "react";
import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  List,
  Tooltip,
  useTheme, // Importar useTheme
} from "@mui/material";
import { useLocation } from "react-router-dom"; // Importar useLocation
import OptionMenu from "./OptionMenu";

interface DropdownMenuProps {
  IconComponent: React.ElementType;
  title: string;
  items: {
    src: React.ElementType;
    title: string;
    link?: string;
    isExternal?: boolean;
  }[];
  isCollapsed: boolean;
  onClick: () => void;
  isOpen: boolean;
  onToggle: () => void;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({
  IconComponent,
  title,
  items,
  isCollapsed,
  onClick,
  isOpen,
  onToggle,
}) => {
  const location = useLocation();
  const theme = useTheme();

  // --- INICIO DE LA MODIFICACIÓN DE COLORES ---
  // Invertimos la lógica para que el Sidebar mantenga los colores originales
  const colorFondoSidebar = theme.palette.secondary.main; // <-- ÁMBAR (ahora es secondary)
  const colorTextoActivo = theme.palette.primary.main; // <-- NARANJA (ahora es primary)
  const colorGris = "#5A5A65"; // Gris (texto inactivo/hover)
  // --- FIN DE LA MODIFICACIÓN DE COLORES ---

  const shouldHighlightParent = useMemo(() => {
    const currentPath = location.pathname;

    let isChildActive = false;
    if (currentPath === "/" && title === "Gestión de Costos") {
      const tarifasItem = items.find((item) => item.link === "tarifas");
      if (tarifasItem) isChildActive = true;
    } else {
      isChildActive = items.some(
        (item) =>
          item.link &&
          !item.isExternal &&
          item.link !== "" &&
          currentPath.startsWith(`/${item.link}`)
      );
    }

    // Devolver true SÓLO si el hijo está activo Y el menú está cerrado
    return isChildActive && !isOpen;
  }, [location.pathname, items, title, isOpen]); // <-- Se añade 'isOpen' a las dependencias

  return (
    <>
      <ListItem disablePadding sx={{ display: "block" }}>
        <Tooltip title={isCollapsed ? title : ""} placement="right">
          <ListItemButton
            onClick={onToggle}
            sx={{
              minHeight: 48,
              justifyContent: isCollapsed ? "center" : "initial",
              px: 2.5,
              mb: 1,
              borderRadius: 2,
              py: 0.5, // <-- MODIFICACIÓN: Añadido padding vertical

              // 1. Estado Inactivo (Default)
              backgroundColor: "transparent",
              color: colorGris,
              "& .MuiListItemIcon-root": { color: colorGris },

              // 2. Estado Activo (si hijo activo Y CERRADO)
              ...(shouldHighlightParent && {
                backgroundColor: colorFondoSidebar, // <-- Ámbar
                color: colorTextoActivo, // <-- Naranja
                "& .MuiListItemIcon-root": { color: colorTextoActivo }, // <-- Naranja
              }),

              // 3. Estado Hover (Inactivo)
              "&:hover": {
                backgroundColor: colorFondoSidebar, // <-- Ámbar
                color: colorGris,
                "& .MuiListItemIcon-root": { color: colorGris },
              },

              // 4. Estado Hover (Activo)
              ...(shouldHighlightParent && {
                "&:hover": {
                  backgroundColor: colorFondoSidebar, // <-- Ámbar
                  color: colorTextoActivo, // <-- Naranja
                  "& .MuiListItemIcon-root": {
                    color: colorTextoActivo, // <-- Naranja
                  },
                },
              }),
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
                  fontSize: "0.875rem", // <-- Letra más chica (14px)
                },
              }}
            />
          </ListItemButton>
        </Tooltip>
      </ListItem>
      <Collapse in={isOpen && !isCollapsed} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {items.map((item, index) => (
            <OptionMenu
              key={index}
              IconComponent={item.src}
              title={item.title}
              isCollapsed={isCollapsed}
              link={item.link}
              onClick={onClick}
              isSubmenu={true}
              isExternal={item.link?.startsWith("http")}
            />
          ))}
        </List>
      </Collapse>
    </>
  );
};

export default DropdownMenu;
