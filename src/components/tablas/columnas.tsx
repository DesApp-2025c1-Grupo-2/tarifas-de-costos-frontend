import { GridColDef, GridValidRowModel } from "@mui/x-data-grid";
import { Tarifa } from "../../services/tarifaService";

export type Entidad =
  | "tarifa"
  | "transportista"
  | "tipoDeVehiculo"
  | "tipoDeCarga"
  | "zona"
  | "adicional"
  | "combustible";

export const columnas: Record<Entidad, GridColDef[]> = {
  tarifa: [
    { field: "id", headerName: "ID", flex: 0 },
    { field: "nombreTarifa", headerName: "Tarifa", flex: 1 },
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
    {
      field: "provincias",
      headerName: "Provincias",
      flex: 1,
      valueGetter: (
        _value,
        row: GridValidRowModel & { provincias?: unknown }
      ) => {
        const { provincias } = row;

        if (!Array.isArray(provincias)) {
          return "";
        }

        return provincias
          .map((provincia) => {
            if (typeof provincia === "string") {
              return provincia;
            }

            if (
              provincia &&
              typeof provincia === "object" &&
              "nombre" in provincia &&
              typeof (provincia as { nombre?: unknown }).nombre === "string"
            ) {
              return (provincia as { nombre: string }).nombre;
            }

            return "";
          })
          .filter((nombre) => nombre.length > 0)
          .join(", ");
      },
    },
  ],

  adicional: [
    { field: "id", headerName: "ID", flex: 0 },
    { field: "nombre", headerName: "Nombre", flex: 1 },
    { field: "descripcion", headerName: "Descripción", flex: 1 },
    { field: "costoDefault", headerName: "Costo", type: "number", flex: 0 },
  ],

  combustible: [
    { field: "id", headerName: "ID", flex: 0.5 },
    { field: "fecha", headerName: "Fecha de Carga", flex: 1 },
    { field: "vehiculoNombre", headerName: "Vehículo", flex: 1.5 },
    {
      field: "costoTotal",
      headerName: "Costo Total",
      type: "number",
      flex: 1,
      valueFormatter: (value) => `$${((value as number) || 0).toFixed(2)}`,
    },
  ],
};
