import { Link as RouterLink, useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Link,
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

  useEffect(() => {
    if (isExternal) {
      setIsActive(false);
      return;
    }
    const currentPathname = location.pathname;
    // Manejo especial para la ruta raíz
    if (link === "" && currentPathname === "/") {
      setIsActive(true);
      return;
    }
    const targetPath = `/${link}`;
    setIsActive(link ? currentPathname.startsWith(targetPath) : false);
  }, [location, link, isExternal]);

  const activeColor = "white";
  const inactiveColor = "#5A5A65";

  const buttonContent = (
    <ListItemButton
      onClick={onClick}
      selected={isActive}
      sx={{
        borderRadius: 2,
        minHeight: 48,
        justifyContent: isCollapsed ? "center" : "initial",
        px: 2.5,
        pl: isSubmenu && !isCollapsed ? 4 : 2.5, // Indentación para submenú
        mb: 1,
        color: "text.secondary",
        "&.Mui-selected": {
          backgroundColor: "primary.main",
          color: "white",
          "&:hover": {
            backgroundColor: "primary.dark",
          },
        },
        "&:hover": {
          backgroundColor: "action.hover",
        },
      }}
    >
      <ListItemIcon
        sx={{
          minWidth: 0,
          mr: isCollapsed ? "auto" : 3,
          justifyContent: "center",
          color: isActive ? activeColor : inactiveColor,
        }}
      >
        <IconComponent color={isActive ? activeColor : inactiveColor} />
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

  return (
    <ListItem disablePadding sx={{ display: "block" }}>
      <Tooltip title={isCollapsed ? title : ""} placement="right">
        {isExternal ? (
          <Link
            href={link}
            target="_self" // Cambiado para navegar en la misma pestaña
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
