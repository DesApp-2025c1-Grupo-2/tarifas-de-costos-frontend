import React from "react";
import { Link } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import MenuIcon from "@mui/icons-material/Menu";

interface HeaderProps {
  onMenuClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: "#F39237",
        color: "#000",
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar>
        {onMenuClick && (
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={onMenuClick}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
        )}
        <Box
          component={Link}
          to="/"
          sx={{
            display: "flex",
            alignItems: "center",
            textDecoration: "none",
            color: "inherit",
            flexGrow: 1,
          }}
        >
          <Box
            component="img"
            src="/img/Logo.png"
            alt="Logo de la empresa"
            sx={{ height: 40, mr: 2 }}
          />
          <Typography variant="h6" component="div" sx={{ color: "inherit" }}>
            Acme SRL - Sistema de Tarifas
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
export type { HeaderProps };
