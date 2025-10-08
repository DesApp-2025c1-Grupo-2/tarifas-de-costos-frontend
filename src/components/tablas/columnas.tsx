// src/components/tablas/columnas.tsx

import { GridColDef } from "@mui/x-data-grid";

export type EntityName =
  | "vehiculo"
  | "transportista"
  | "zona"
  | "carga"
  | "combustible"
  | "tarifa"
  | "adicional"
  | "tipoVehiculo";

type Columnas = Record<EntityName, GridColDef[]>;

export const columnas: Columnas = {
  vehiculo: [
    { field: "id", headerName: "ID", flex: 0.5 },
    { field: "patente", headerName: "Patente", flex: 1 },
    { field: "marca", headerName: "Marca", flex: 1 },
    { field: "modelo", headerName: "Modelo", flex: 1 },
    { field: "anio", headerName: "Año", flex: 1 },
    { field: "tipoVehiculoNombre", headerName: "Tipo Vehículo", flex: 1.5 },
    {
      field: "capacidadCarga",
      headerName: "Capacidad Carga (kg)",
      flex: 1.5,
      type: "number",
    },
  ],
  transportista: [
    { field: "id", headerName: "ID", flex: 0.5 },
    { field: "cuit", headerName: "CUIT", flex: 1.5 },
    { field: "razonSocial", headerName: "Razón Social", flex: 2 },
    { field: "nombre", headerName: "Nombre", flex: 1.5 },
    { field: "apellido", headerName: "Apellido", flex: 1.5 },
  ],
  zona: [
    { field: "id", headerName: "ID", flex: 0.5 },
    { field: "nombre", headerName: "Nombre", flex: 2 },
    { field: "provincia", headerName: "Provincia", flex: 1.5 },
  ],
  carga: [
    { field: "id", headerName: "ID", flex: 0.5 },
    { field: "fecha", headerName: "Fecha", flex: 1.5 },
    { field: "tipo", headerName: "Tipo", flex: 1.5 },
    { field: "vehiculo", headerName: "Vehículo", flex: 2 },
    {
      field: "cantidad",
      headerName: "Cantidad (kg/m³)",
      flex: 1.5,
      type: "number",
    },
    {
      field: "costoTotal",
      headerName: "Costo Total",
      type: "number",
      flex: 1.5,
      valueFormatter: (value) => `$${((value as number) || 0).toFixed(2)}`,
    },
  ],
  // ------------------------------------------------------------------
  // CAMBIOS APLICADOS AQUÍ (Se añaden precioPorLitro y tipoCombustible)
  // ------------------------------------------------------------------
  combustible: [
    { field: "id", headerName: "ID", flex: 0.5 },
    {
      field: "fecha",
      headerName: "Fecha de Carga",
      flex: 1,
      valueFormatter: (value) =>
        new Date(value as string).toLocaleDateString("es-AR"),
    },
    { field: "vehiculoNombre", headerName: "Vehículo", flex: 1.5 },
    {
      field: "precioPorLitro",
      headerName: "Precio/Litro",
      type: "number",
      flex: 1,
      valueFormatter: (value) => `$${((value as number) || 0).toFixed(2)}`,
    },
    {
      field: "tipoCombustible",
      headerName: "Tipo Combustible",
      flex: 1,
    },
    {
      field: "costoTotal",
      headerName: "Costo Total",
      type: "number",
      flex: 1,
      valueFormatter: (value) => `$${((value as number) || 0).toFixed(2)}`,
    },
  ],
  // ------------------------------------------------------------------

  tarifa: [
    { field: "id", headerName: "ID", flex: 0.5 },
    { field: "zonaNombre", headerName: "Zona", flex: 1 },
    { field: "tipoVehiculoNombre", headerName: "Tipo Vehículo", flex: 1 },
    { field: "tipoCargaTarifaNombre", headerName: "Tipo Carga", flex: 1 },
    {
      field: "tipoCargaEspecificaNombre",
      headerName: "Carga Específica",
      flex: 1.5,
    },
    {
      field: "costoKm",
      headerName: "Costo/Km",
      type: "number",
      flex: 1,
      valueFormatter: (value) => `$${((value as number) || 0).toFixed(2)}`,
    },
  ],
  adicional: [
    { field: "id", headerName: "ID", flex: 0.5 },
    { field: "nombre", headerName: "Nombre", flex: 1.5 },
    { field: "frecuencia", headerName: "Frecuencia", flex: 1.5 },
    {
      field: "valor",
      headerName: "Valor",
      type: "number",
      flex: 1,
      valueFormatter: (value) => `$${((value as number) || 0).toFixed(2)}`,
    },
  ],
  tipoVehiculo: [
    { field: "id", headerName: "ID", flex: 0.5 },
    { field: "nombre", headerName: "Nombre", flex: 1.5 },
  ],
};
