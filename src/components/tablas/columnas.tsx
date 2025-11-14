// src/components/tablas/columnas.tsx

import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";

// Asegúrate de que todas tus entidades estén listadas aquí
export type Entidad =
  | "vehiculo"
  | "transportista"
  | "zona" // <-- Entidad relevante
  | "tipoDeCarga"
  | "combustible"
  | "tarifa"
  | "adicional"
  | "tipoDeVehiculo";

type Columnas = Record<Entidad, GridColDef[]>;

// Tu función para formatear moneda (mantenida como estaba)
const formatCurrency = (value: number | any) => {
  const number = Number(value) || 0;
  return `$${number.toLocaleString("es-AR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
};

export const columnas: Columnas = {
  vehiculo: [
    //{ field: "id", headerName: "ID", flex: 0.5 },
    { field: "patente", headerName: "Patente", flex: 1 },
    { field: "marca", headerName: "Marca", flex: 1 },
    { field: "modelo", headerName: "Modelo", flex: 1 },
  ],
  transportista: [
    //{ field: "id", headerName: "ID", flex: 0.5 },
    { field: "cuit", headerName: "CUIT", flex: 1 },
    { field: "nombre_comercial", headerName: "Nombre Comercial", flex: 1.5 }, // Campo del DTO
    {
      field: "contactoNombre",
      headerName: "Nombre de Contacto",
      flex: 1.5,
      valueGetter: (_value, row) => row.contacto?.nombre || "N/A", // Acceder a través de 'contacto'
    },
    {
      field: "contactoEmail",
      headerName: "Email",
      flex: 1.5,
      valueGetter: (_value, row) => row.contacto?.email || "N/A", // Acceder a través de 'contacto'
    },
    {
      field: "contactoTelefono",
      headerName: "Teléfono",
      flex: 1,
      valueGetter: (_value, row) => row.contacto?.telefono?.numero || "N/A", // Acceder anidado
    },
  ],
  tipoDeVehiculo: [
    //{ field: "id", headerName: "ID", flex: 0.5 },
    { field: "nombre", headerName: "Nombre", flex: 1.5 },
    { field: "descripcion", headerName: "Descripción", flex: 2 },
    { field: "licencia_permitida", headerName: "Licencia Permitida", flex: 1 },
  ],
  tipoDeCarga: [
    //{ field: "id", headerName: "ID", flex: 0.5 },
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
        value ? new Date(value as string).toLocaleString("es-AR") : "N/A",
    },
    { field: "vehiculoNombre", headerName: "Vehículo", flex: 1.5 }, // Asume que este campo se añade en el frontend
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
    //{ field: "id", headerName: "ID", flex: 0.5 },
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
    //{ field: "id", headerName: "ID", flex: 0.5 },
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
    }, // Asume que este campo se añade en el frontend
  ],

  // --- DEFINICIÓN CORREGIDA PARA 'zona' ---
  zona: [
    //{ field: "id", headerName: "ID", flex: 0.5 },
    { field: "nombre", headerName: "Nombre", flex: 1.5 },
    { field: "descripcion", headerName: "Descripción", flex: 2 },
    {
      // **CAMBIO 1: Usar el campo del DTO**
      field: "provinciasNombres",
      headerName: "Provincias",
      flex: 2.5,
      sortable: false, // Es difícil ordenar por un array
      // **CAMBIO 2: renderCell espera string[]**
      renderCell: (
        params: GridRenderCellParams<any, string[] | null | undefined>
      ) => {
        const nombres = params.value; // nombres es string[] o null/undefined
        // Verificar que sea un array y tenga elementos
        if (Array.isArray(nombres) && nombres.length > 0) {
          // Unir los nombres con coma y espacio
          return nombres.join(", ");
        }
        // Si no hay provincias o el array está vacío
        return "Sin provincias asignadas";
      },
      // --- FIN CAMBIOS ---
    },
  ],
};
