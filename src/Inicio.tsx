import { useNavigate } from "react-router-dom";
import Header from "./components/Header";
import { Box, Button } from "@mui/material";

const Inicio = () => {
  const navigate = useNavigate();

  const handleGenerarTarifa = () => {
    navigate("./generar-tarifa");
  };

  return (
    <Box>
      <Header />
      <Box component="main">
        <Box
          component="img"
          src="/img/Logo.png"
          alt="Logo Acme SRL"
          sx={{
            width: "min(90%, 500px)",
            height: "auto",
            display: "block",
            margin: "40px auto",
            objectFit: "contain",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: "80px",
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          <Button
            type="button"
            onClick={handleGenerarTarifa}
            sx={{
              backgroundColor: "#ff7300",
              color: "white",
              fontSize: "1.1rem",
              fontWeight: 600,
              padding: "12px 28px",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
              transition: "background-color 0.3s ease, transform 0.2s ease",
              "&:hover": {
                backgroundColor: "#324A72",
                transform: "translateY(-2px)",
              },
            }}
          >
            Inicio
          </Button>
        </Box>
      </Box>
      <Box
        component="footer"
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          height: "60px",
          backgroundColor: "#1B2A41",
          zIndex: 1000,
          boxShadow: "0 -2px 10px rgba(0, 0, 0, 0.1)",
        }}
      ></Box>
    </Box>
  );
};

export default Inicio;
