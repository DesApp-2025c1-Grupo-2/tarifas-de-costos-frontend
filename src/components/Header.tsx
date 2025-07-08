import React from "react";
import { Box, Typography } from "@mui/material";

const headerStyles = {
  backgroundColor: "#1B2A41",
  color: "white",
  width: "100%",
  height: "60px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: { xs: "0 10px", md: "0 20px" },
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  boxSizing: "border-box",
  zIndex: 9999,
};

const Header: React.FC = () => (
  <Box component="header" sx={headerStyles}>
    <Box>
      <Typography variant="h6" component="div">
        <a href="/" style={{ all: "unset", cursor: "pointer" }}>
          Acme SRL - Sistema de Tarifas
        </a>
      </Typography>
    </Box>
  </Box>
);

interface HeaderConMenuProps {
  onImagenClick: () => void;
}

const HeaderConMenu: React.FC<HeaderConMenuProps> = ({ onImagenClick }) => (
  <Box component="header" sx={headerStyles}>
    <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
      <Box
        component="img"
        src="/img/menu.png"
        alt="Menú"
        sx={{
          cursor: "pointer",
          width: "30px",
          height: "30px",
          filter: "brightness(0) invert(1)",
          marginRight: "20px",
        }}
        onClick={onImagenClick}
      />
      <Typography
        variant="h6"
        component="span"
        sx={{
          fontSize: "1.1rem",
          fontWeight: 600,
          color: "white",
        }}
      >
        <a href="/" style={{ all: "unset", cursor: "pointer" }}>
          Acme SRL - Sistema de Tarifas
        </a>
      </Typography>
    </Box>
  </Box>
);

export default Header;
export { HeaderConMenu };
export type { HeaderConMenuProps };
