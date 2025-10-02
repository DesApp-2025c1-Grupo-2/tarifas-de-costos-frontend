import React from "react";
import {
  Box,
  List,
  Drawer,
  Toolbar,
  useTheme,
  useMediaQuery,
  Divider,
} from "@mui/material";
import HomeIcon from "./icons/HomeIcon";
import DriverIcon from "./icons/DriverIcon";
import VehicleIcon from "./icons/VehicleIcon";
import DepotIcon from "./icons/DepotIcon";
import TripIcon from "./icons/TripIcon";
import CompanyIcon from "./icons/CompanyIcon";
import LocalGasStationOutlinedIcon from "@mui/icons-material/LocalGasStationOutlined";
import OptionMenu from "./OptionMenu";

interface SidebarProps {
  isVisible: boolean;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
  isCollapsed: boolean;
}

const menuItems = [
  {
    IconComponent: HomeIcon,
    title: "Inicio",
    link: "https://gestion-de-viajes.vercel.app/",
    isExternal: true,
  },
  { IconComponent: TripIcon, title: "Tarifas", link: "tarifas" },
  { IconComponent: CompanyIcon, title: "Reportes", link: "reportes" },
  {
    IconComponent: LocalGasStationOutlinedIcon,
    title: "Combustible",
    link: "combustible",
  },
  { IconComponent: DriverIcon, title: "Adicionales", link: "adicionales" },
  {
    IconComponent: CompanyIcon,
    title: "Transportistas",
    link: "transportistas",
  },
  { IconComponent: VehicleIcon, title: "Vehículos", link: "vehiculos" },
  { IconComponent: DepotIcon, title: "Cargas", link: "tipos-de-carga" },
  { IconComponent: CompanyIcon, title: "Zonas", link: "zonas" },
];

const drawerWidth = 256;
const collapsedDrawerWidth = 80;

export default function Sidebar({
  isVisible,
  setIsVisible,
  isCollapsed,
}: SidebarProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const drawerContent = (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        backgroundColor: "#FFFFFF",
      }}
    >
      <Box sx={{ pt: 2, pb: 1, textAlign: "center" }}>
        <Toolbar sx={{ justifyContent: "center", minHeight: "80px" }}>
          <Box
            component="img"
            src={"/img/acmelogo.png"}
            alt="Logística ACME"
            sx={{
              width: isCollapsed ? 60 : 200,
              transition: "width 0.2s ease-in-out",
            }}
          />
        </Toolbar>
      </Box>

      <Divider sx={{ mx: 2, mb: 2 }} />

      <List sx={{ flexGrow: 1, p: 1, pt: 0 }}>
        {menuItems.map((item) => (
          <OptionMenu
            key={item.title}
            isCollapsed={isCollapsed}
            onClick={() => isMobile && setIsVisible(false)}
            IconComponent={item.IconComponent}
            title={item.title}
            link={item.link}
            isExternal={item.isExternal}
          />
        ))}
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
          borderRight: { xs: "none" },
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
