import React from "react";
import Header from "./components/Header";
import Filtros from "./components/Filtros";
import { Box, Toolbar } from "@mui/material";

const Tarifas: React.FC = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        backgroundColor: "#f5f7fa",
      }}
    >
      <Header />
      <Box
        component="main"
        sx={{
          flex: 1,
          padding: "2rem",
          overflowY: "auto",
          paddingBottom: "100px",
        }}
      >
        <Toolbar />
        <Box sx={{ display: "block", gap: "2rem" }}>
          <Filtros />
          {/* <TarifaTable /> */}
        </Box>
      </Box>
    </Box>
  );
};

export default Tarifas;
