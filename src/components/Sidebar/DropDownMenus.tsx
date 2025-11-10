import React from "react";
import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  List,
  Tooltip,
} from "@mui/material";
// Se eliminan 'useLocation' y 'useTheme'
import OptionMenu from "./OptionMenu";
// Se elimina ChevronDown/Up

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
  // La categoría padre (este componente) SIEMPRE es gris.
  const inactiveColor = "#5A5A65";

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
              backgroundColor: "transparent", // Fondo siempre transparente
              "&:hover": {
                backgroundColor: "action.hover", // Hover gris claro
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
              {/* El ícono del padre siempre es gris */}
              <IconComponent color={inactiveColor} />
            </ListItemIcon>
            <ListItemText
              primary={title}
              sx={{
                opacity: isCollapsed ? 0 : 1,
                // El texto del padre siempre es gris
                color: "text.secondary",
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
