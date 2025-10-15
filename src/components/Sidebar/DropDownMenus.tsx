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
import { useLocation } from "react-router-dom";
import OptionMenu from "./OptionMenu";
import { ChevronDown, ChevronUp } from "lucide-react";

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
  const isLocationSection = items.some(
    (item) =>
      item.link && !item.isExternal && location.pathname.includes(item.link)
  );

  const activeColor = "#E65F2B";
  const inactiveColor = "#5A5A65";
  const headerIsActive = isLocationSection && !isOpen;

  return (
    <>
      <ListItem disablePadding sx={{ display: "block" }}>
        <Tooltip title={isCollapsed ? title : ""} placement="right">
          <ListItemButton
            onClick={onToggle}
            sx={{
              minHeight: 48,
              justifyContent: "initial",
              px: 2.5,
              mb: 1,
              borderRadius: 2,
              backgroundColor: headerIsActive ? "action.hover" : "transparent",
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
              }}
            >
              <IconComponent
                color={headerIsActive ? activeColor : inactiveColor}
              />
            </ListItemIcon>
            <ListItemText
              primary={title}
              sx={{
                opacity: isCollapsed ? 0 : 1,
                color: headerIsActive ? activeColor : "text.secondary",
              }}
            />
            {!isCollapsed &&
              (isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />)}
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
