import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import { Box, Button, Toolbar, Typography } from "@mui/material";

const Inicio = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  const handleGenerarTarifa = () => {
    navigate("./tarifas");
  };

  return (
    <Box>
      <Box component="main">
        <Toolbar />
        <Box
          component="img"
          src="/img/acmelogo.png"
          alt="Logo Acme SRL"
          sx={{
            width: "min(90%, 500px)",
            height: "auto",
            display: "block",
            margin: "40px auto",
            marginTop: "80px",
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
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
              ...theme.typography.button,
              padding: "12px 28px",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
              transition: "background-color 0.3s ease, transform 0.2s ease",
              "&:hover": {
                backgroundColor: "#C94715",
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
          backgroundColor: "#F39237",
          color: "#000",
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 -2px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Typography variant="body2" sx={{ color: "inherit" }}>
          © {new Date().getFullYear()} Acme SRL. Todos los derechos reservados.
        </Typography>
      </Box>
    </Box>
  );
};

export default Inicio;
