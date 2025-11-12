import React from "react";
import * as tipoVehiculoService from "../../services/tipoVehiculoService";
import DataTable from "../tablas/tablaDinamica";
import { TipoVehiculo } from "../../services/tipoVehiculoService";
import { useCrud } from "../hook/useCrud";
import { CrudService } from "../../services/crudService";
import { Box, Alert } from "@mui/material";

const servicioAdaptado: CrudService<TipoVehiculo> = {
  getAll: tipoVehiculoService.obtenerTiposVehiculo,
  create: tipoVehiculoService.crearTipoVehiculo,
  update: (id, data) => tipoVehiculoService.actualizarTipoVehiculo(id, data),
  remove: (id) => tipoVehiculoService.eliminarTipoVehiculo(id),
};

export const FormCrearTipoVehiculo: React.FC = () => {
  const { items, message, highlightedId } =
    useCrud<TipoVehiculo>(servicioAdaptado);

  return (
    <div>
      <DataTable
        entidad="tipoDeVehiculo"
        rows={items}
        highlightedId={typeof highlightedId === "string" ? highlightedId : null}
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
