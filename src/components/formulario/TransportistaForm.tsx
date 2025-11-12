import React from "react";
import * as transportistaService from "../../services/transportistaService";
import DataTable from "../tablas/tablaDinamica";
import { Transportista } from "../../services/transportistaService";
import { useCrud } from "../hook/useCrud";
import { CrudService } from "../../services/crudService";
import { Box, Alert } from "@mui/material";

const servicioAdaptado: CrudService<Transportista> = {
  getAll: transportistaService.obtenerTransportistas,
  create: transportistaService.crearTransportista,
  update: transportistaService.actualizarTransportista,
  remove: transportistaService.eliminarTransportista,
};

export const FormCrearTransportista: React.FC = () => {
  const { items, message, highlightedId } =
    useCrud<Transportista>(servicioAdaptado);

  return (
    <div>
      <DataTable
        entidad="transportista"
        rows={items}
        highlightedId={typeof highlightedId === "number" ? highlightedId : null}
      />

      {message && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <Alert
            severity={message.severity}
            sx={{ width: "100%", maxWidth: "600px" }}
          >
            {message.text}
          </Alert>
        </Box>
      )}
    </div>
  );
};
