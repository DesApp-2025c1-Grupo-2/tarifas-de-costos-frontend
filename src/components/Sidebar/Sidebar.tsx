import React, { useEffect, useState } from "react";
import { Box, List, IconButton, Typography, Drawer, useTheme, useMediaQuery } from "@mui/material";
import { ChevronLeft, ChevronRight } from "lucide-react";
import HomeIcon from "./icons/HomeIcon";
import DriverIcon from "./icons/DriverIcon";
import VehicleIcon from "./icons/VehicleIcon";
import DepotIcon from "./icons/DepotIcon";
import TripIcon from "./icons/TripIcon";
import CompanyIcon from "./icons/CompanyIcon";
import OptionMenu from "./OptionMenu";

interface SidebarProps {
  isVisible: boolean;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

  const menuItems = [
    { src: HomeIcon, title: "Inicio", link: "" },
    { src: TripIcon, title: "Tarifas", link: "tarifas" },
    { src: CompanyIcon, title: "Reportes", link: "reportes" },
    { src: CompanyIcon, title: "Combustible", link: "combustible"},
    { src: DriverIcon, title: "Adicionales", link: "adicionales" }, 
    { src: CompanyIcon, title: "Transportistas", link: "transportistas" },
    { src: VehicleIcon, title: "Vehículos", link: "vehiculos" },
    { src: DepotIcon, title: "Zonas", link: "zonas" },
    { src: CompanyIcon, title: "Cargas", link: "tipos-de-carga" },
  ];

const drawerWidth = 256; 
const collapsedDrawerWidth = 80; 

export default function Sidebar({ isVisible, setIsVisible }: SidebarProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleToggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleSelectOption = () => {
    if (isMobile) {
      setIsVisible(false);
    }
  };

  const drawerContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '64px',
          px: 2,
          borderBottom: `1px solid ${theme.palette.grey[200]}`,
        }}
      >
        <Typography 
          variant="h6" 
          component="h1"
          noWrap
          sx={{
            fontWeight: 700,
            color: 'text.primary',
            opacity: isCollapsed ? 0 : 1,
            transition: 'opacity 0.3s ease',
          }}
        >
          Logística Acme SRL
        </Typography>
      </Box>

      <List sx={{ flexGrow: 1, p: 1 }}>
        {menuItems.map((item) => (
          <OptionMenu
            key={item.title}
            isCollapsed={isCollapsed}
            onClick={handleSelectOption}
            IconComponent={item.src}
            title={item.title}
            link={item.link}
          />
        ))}
      </List>

      {!isMobile && (
        <Box sx={{ p: 1, borderTop: `1px solid ${theme.palette.grey[200]}` }}>
          <IconButton
            onClick={handleToggleCollapse}
            sx={{ width: '100%', borderRadius: 2 }}
          >
            {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
          </IconButton>
        </Box>
      )}
    </Box>
  );

  return (
    <Drawer
      variant={isMobile ? "temporary" : "permanent"}
      open={isMobile ? isVisible : true}
      onClose={() => setIsVisible(false)}
      sx={{
        width: isMobile ? drawerWidth : (isCollapsed ? collapsedDrawerWidth : drawerWidth),
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: isMobile ? drawerWidth : (isCollapsed ? collapsedDrawerWidth : drawerWidth),
          boxSizing: 'border-box',
          backgroundColor: 'background.paper',
          borderRight: `1px solid ${theme.palette.grey[200]}`,
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          overflowX: 'hidden'
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
}

