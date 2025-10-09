import React from "react";
import { Box } from "@mui/material";

interface MapaArgentinaProps {
  provinciasSeleccionadas: { nombre: string }[];
}

// Coordenadas de Argentina (aprox. centro)
const ARGENTINA_CENTER_LAT = -34.6;
const ARGENTINA_CENTER_LNG = -58.5;
const ZOOM_LEVEL = 4;

export const MapaArgentina: React.FC<MapaArgentinaProps> = ({
  provinciasSeleccionadas,
}) => {
  // La URL de incrustación de Google Maps
  const embedUrl = `https://maps.google.com/maps?q=${ARGENTINA_CENTER_LAT},${ARGENTINA_CENTER_LNG}&z=${ZOOM_LEVEL}&output=embed`;

  return (
    <Box
      sx={{
        border: "none",
        outline: "none",
        borderRadius: "8px",
        overflow: "hidden",
        height: "100%",
        width: "100%",
      }}
    >
      <iframe
        width="100%"
        height="100%"
        style={{ border: "none", outline: "none" }}
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
        src={embedUrl}
        title="Mapa de Argentina para guía"
      />
    </Box>
  );
};
