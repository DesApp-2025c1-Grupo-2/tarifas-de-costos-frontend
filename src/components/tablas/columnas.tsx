// src/components/tablas/columnas.tsx

import { GridColDef } from "@mui/x-data-grid";
import { Tarifa } from "../../services/tarifaService";

export type Entidad =
  | "tarifa"
  | "transportista"
  | "tipoDeVehiculo"
  | "tipoDeCarga"
  | "zona"
  | "adicional";

export const columnas: Record<Entidad, GridColDef[]> = {
  tarifa: [
    { field: "id", headerName: "ID", flex: 0 },
    { field: "nombre", headerName: "Tarifa", flex: 1 },
    { field: "transportistaNombre", headerName: "Transportista", flex: 1 },
    { field: "tipoVehiculoNombre", headerName: "Tipo de vehículo", flex: 1 },
    { field: "zonaNombre", headerName: "Zona", flex: 1 },
    { field: "tipoCargaNombre", headerName: "Carga", flex: 1 },
    {
      field: "valorBase",
      headerName: "Costo Base",
      type: "number",
      flex: 1,
    },
    {
      field: "total",
      headerName: "Costo Total",
      type: "number",
      flex: 1,
    },
  ],

  transportista: [
    { field: "id", headerName: "ID", flex: 0 },
    { field: "cuit", headerName: "CUIT", flex: 1 },
    { field: "contactoNombre", headerName: "Nombre", flex: 1 },
    { field: "nombreEmpresa", headerName: "Empresa", flex: 1 },
    { field: "contactoEmail", headerName: "Correo", flex: 1 },
    {
      field: "contactoTelefono",
      headerName: "Teléfono",
      type: "number",
      flex: 1,
    },
  ],

  tipoDeVehiculo: [
    { field: "id", headerName: "ID", flex: 0 },
    { field: "nombre", headerName: "Nombre", flex: 1 },
    {
      field: "capacidadPesoKG",
      headerName: "Capacidad de Peso (KG)",
      flex: 1,
    },
    {
      field: "capacidadVolumenM3",
      headerName: "Capacidad de Volumen (M3)",
      flex: 1,
    },
    { field: "descripcion", headerName: "Descripcion", flex: 1 },
  ],

  tipoDeCarga: [
    { field: "id", headerName: "ID", flex: 0 },
    { field: "nombre", headerName: "Nombre", flex: 1 },
    { field: "descripcion", headerName: "Descripcion", flex: 1 },
  ],

  zona: [
    { field: "id", headerName: "ID", flex: 0 },
    { field: "nombre", headerName: "Nombre", flex: 1 },
    { field: "descripcion", headerName: "Descripcion", flex: 1 },
    { field: "regionMapa", headerName: "Region", flex: 1 },
  ],

  adicional: [
    { field: "id", headerName: "ID", flex: 0 },
    { field: "nombre", headerName: "Nombre", flex: 1 },
    { field: "descripcion", headerName: "Descripción", flex: 1 },
    { field: "costoDefault", headerName: "Costo", type: "number", flex: 0 },
  ],
};
