// src/components/tablas/columnas.tsx

import { GridColDef } from "@mui/x-data-grid";

export type Entidad =
  | "vehiculo"
  | "transportista"
  | "zona"
  | "tipoDeCarga"
  | "combustible"
  | "tarifa"
  | "adicional"
  | "tipoDeVehiculo";

type Columnas = Record<Entidad, GridColDef[]>;

const formatCurrency = (value: number | any) => {
  const number = Number(value) || 0;
  return `$${number.toLocaleString("es-AR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
};

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
    { field: "cuit", headerName: "CUIT", flex: 1 },
    
    { field: "nombre_comercial", headerName: "Nombre Comercial", flex: 1.5 },
    {
      field: "contactoNombre",
      headerName: "Nombre de Contacto",
      flex: 1.5,
      valueGetter: (value, row) => row.contacto?.nombre || "N/A",
    },
    {
      field: "contactoEmail",
      headerName: "Email",
      flex: 1.5,
      valueGetter: (value, row) => row.contacto?.email || "N/A",
    },
    {
      field: "contactoTelefono",
      headerName: "Teléfono",
      flex: 1,
      valueGetter: (value, row) => row.contacto?.telefono?.numero || "N/A",
    },
  ],
  zona: [
    { field: "id", headerName: "ID", flex: 0.5 },
    { field: "nombre", headerName: "Nombre", flex: 1.5 },
    { field: "descripcion", headerName: "Descripción", flex: 2 },
    {
      field: "provincias",
      headerName: "Provincias",
      flex: 2.5,
      sortable: false,
      renderCell: (params) => {
        if (Array.isArray(params.value) && params.value.length > 0) {
          return params.value
            .map((p: { nombre: string }) => p.nombre)
            .join(", ");
        }
        return "Sin provincias asignadas";
      },
    },
  ],
  tipoDeCarga: [
    { field: "id", headerName: "ID", flex: 0.5 },
    { field: "nombre", headerName: "Nombre", flex: 2 },
    { field: "descripcion", headerName: "Descripción", flex: 3 },
  ],
  combustible: [
    { field: "id", headerName: "ID", flex: 0.5 },
    {
      field: "fecha",
      headerName: "Fecha de Carga",
      flex: 1.5,
      valueFormatter: (value) =>
        new Date(value as string).toLocaleString("es-AR"),
    },
    { field: "vehiculoNombre", headerName: "Vehículo", flex: 1.5 },
    { field: "numeroTicket", headerName: "Nro. Ticket", flex: 1 },
    {
      field: "litrosCargados",
      headerName: "Litros Cargados",
      type: "number",
      flex: 1,
    },
    {
      field: "precioTotal",
      headerName: "Precio Total",
      type: "number",
      flex: 1,
      valueFormatter: (value) => formatCurrency(value),
    },
  ],
  tarifa: [
    { field: "id", headerName: "ID", flex: 0.5 },
    { field: "nombreTarifa", headerName: "Tarifa", flex: 1.5 },
    { field: "transportistaNombre", headerName: "Transportista", flex: 1.5 },
    { field: "tipoVehiculoNombre", headerName: "Tipo de vehículo", flex: 1.5 },
    { field: "zonaNombre", headerName: "Zona", flex: 1 },
    { field: "tipoCargaNombre", headerName: "Carga", flex: 1 },
    {
      field: "valorBase",
      headerName: "Costo Base",
      type: "number",
      flex: 1,
      valueFormatter: (value) => formatCurrency(value),
    },
    {
      field: "total",
      headerName: "Costo Total",
      type: "number",
      flex: 1,
      valueFormatter: (value) => formatCurrency(value),
    },
  ],
  adicional: [
    { field: "id", headerName: "ID", flex: 0.5 },
    { field: "nombre", headerName: "Nombre", flex: 1.5 },
    { field: "descripcion", headerName: "Descripción", flex: 2 },
    {
      field: "costoDefault",
      headerName: "Costo Base",
      type: "number",
      flex: 1,
      valueFormatter: (value) => formatCurrency(value),
    },
    {
      field: "cantidad",
      headerName: "Veces Utilizado",
      type: "number",
      flex: 1,
    },
  ],
  tipoDeVehiculo: [
    { field: "id", headerName: "ID", flex: 0.5 },
    { field: "nombre", headerName: "Nombre", flex: 1.5 },
    { field: "descripcion", headerName: "Descripción", flex: 2 },
    {
      field: "licencia_permitida",
      headerName: "Licencia Permitida",
      flex: 1,
    },
  ],
};