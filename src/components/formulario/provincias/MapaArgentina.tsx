import React from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { Box } from "@mui/material";

// Ruta al archivo de coordenadas que guardaste en la carpeta 'public'
const geoUrl = "/provincias.json";

interface MapaArgentinaProps {
  provinciasSeleccionadas: { nombre: string }[];
}

export const MapaArgentina: React.FC<MapaArgentinaProps> = ({
  provinciasSeleccionadas,
}) => {
  // Creamos un Set con los nombres para que la búsqueda sea más eficiente
  const nombresSeleccionados = new Set(
    provinciasSeleccionadas.map((p) => p.nombre)
  );

  return (
    <Box
      sx={{ border: "1px solid #ccc", borderRadius: "8px", overflow: "hidden" }}
    >
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: 800,
          center: [-64, -40], // Centra el mapa en Argentina
        }}
        style={{ width: "100%", height: "auto" }}
      >
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const nombreProvincia = geo.properties.nombre;
              const estaSeleccionada =
                nombresSeleccionados.has(nombreProvincia);

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  style={{
                    default: {
                      fill: estaSeleccionada ? "#E65F2B" : "#D6D6DA", // Naranja si está seleccionada
                      outline: "none",
                      stroke: "#FFF",
                      strokeWidth: 0.75,
                    },
                    hover: {
                      fill: "#F5A623", // Color al pasar el mouse
                      outline: "none",
                    },
                    pressed: {
                      fill: "#E65F2B",
                      outline: "none",
                    },
                  }}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>
    </Box>
  );
};
