import React from "react";
import { Link, useLocation } from "react-router-dom";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import AssessmentIcon from "@mui/icons-material/Assessment";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import MapIcon from "@mui/icons-material/Map";
import InventoryIcon from "@mui/icons-material/Inventory";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const drawerWidth = 240;

const menuItems = [
  { text: "Reportes", icon: <AssessmentIcon />, path: "/reportes" },
  { text: "Tarifas", icon: <AttachMoneyIcon />, path: "/crear-tarifa" },
  {
    text: "Adicionales",
    icon: <AddCircleOutlineIcon />,
    path: "/crear-adicional",
  },
  {
    text: "Transportistas",
    icon: <LocalShippingIcon />,
    path: "/crear-transportista",
  },
  { text: "Vehiculos", icon: <DirectionsCarIcon />, path: "/crear-vehiculo" },
  { text: "Zonas", icon: <MapIcon />, path: "/crear-zona" },
  { text: "Carga", icon: <InventoryIcon />, path: "/crear-carga" },
];

const Sidebar: React.FC<SidebarProps> = ({ open, onClose }) => {
  const location = useLocation();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  const drawer = (
    <Box sx={{ backgroundColor: "#F39237", height: "100%", color: "black" }}>
      <Toolbar />
      <List>
        {menuItems.map(({ text, icon, path }) => (
          <ListItem key={text} disablePadding>
            <ListItemButton
              component={Link}
              to={path}
              onClick={!isDesktop ? onClose : undefined}
              selected={location.pathname === path}
              sx={{
                "&:hover": {
                  backgroundColor: "#FFB74D",
                },
                "&.Mui-selected": {
                  backgroundColor: "#FFB74D",
                  "&:hover": {
                    backgroundColor: "#FFB74D",
                  },
                },
                "& .MuiListItemIcon-root": {
                  color: "inherit",
                },
              }}
            >
              <ListItemIcon>{icon}</ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { md: open ? drawerWidth : 0 }, flexShrink: { md: 0 } }}
    >
      <Drawer
        variant={isDesktop ? "persistent" : "temporary"}
        open={open}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "block" },
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            backgroundColor: "#F39237",
            color: "black",
          },
        }}
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

export default Sidebar;
export type { SidebarProps };
