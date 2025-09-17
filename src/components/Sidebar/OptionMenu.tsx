import { Link as RouterLink, useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { ListItem, ListItemButton, ListItemIcon, ListItemText, Tooltip } from "@mui/material";

interface OptionMenuProps {
  isCollapsed: boolean;
  onClick: () => void;
  title: string;
  link?: string;
  IconComponent: React.FC<{ color?: string }>;
}

export default function OptionMenu({ isCollapsed, onClick, IconComponent, title, link = "" }: OptionMenuProps) {
  const location = useLocation();
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const currentPathname = location.pathname;
    const targetPath = `/${link}`;

    if (link === "") {
      setIsActive(currentPathname === "/");
    } else {
      setIsActive(currentPathname.startsWith(targetPath));
    }
  }, [location, link]);

  const activeColor = "#E65F2B";
  const inactiveColor = "#5A5A65";

  return (
    <ListItem disablePadding sx={{ display: 'block' }}>
      <Tooltip title={isCollapsed ? title : ""} placement="right">
        <ListItemButton
          component={RouterLink}
          to={`/${link}`}
          onClick={onClick}
          selected={isActive}
          sx={{
            borderRadius: 2,
            minHeight: 48,
            justifyContent: isCollapsed ? 'center' : 'initial',
            px: 2.5,
            '&.Mui-selected': {
              backgroundColor: '#FFEBE2',
              color: activeColor,
              '&:hover': {
                backgroundColor: '#FADFD1',
              },
            },
            color: inactiveColor,

            '&:hover': {
              backgroundColor: '#FFEBE2',
              color: activeColor,
              '& .MuiListItemIcon-root svg': {
                 fill: activeColor, 
              }
            },
          }}
        >
          <ListItemIcon sx={{ minWidth: 0, mr: isCollapsed ? 0 : 3, justifyContent: 'center' }}>
            <IconComponent color={isActive ? activeColor : inactiveColor} />
          </ListItemIcon>
          <ListItemText
            primary={title}
            sx={{
              opacity: isCollapsed ? 0 : 1,
              '& .MuiTypography-root': {
                fontWeight: isActive ? 600 : 500,
              }
            }}
          />
        </ListItemButton>
      </Tooltip>
    </ListItem>
  );
}