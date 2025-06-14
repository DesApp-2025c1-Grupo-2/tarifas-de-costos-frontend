import { GridColDef } from '@mui/x-data-grid';

export type Entidad = 'tarifa' | 'transportista' | 'tipoDeVehiculo' | 'tipoDeCarga';

export const columnas: Record<Entidad, GridColDef[]> = {

    tarifa: [
        { field: 'transportista', headerName: 'Transportista', width: 130 },
        { field: 'tipoDeVehiculo', headerName: 'Tipo de vehiculo', width: 130 },
        { field: 'zona', headerName: 'Zona', width: 130 },
        { field: 'carga', headerName: 'Carga', width: 130 },
        {
            field: 'total',
            headerName: 'Total',
            type: 'number',
            width: 160,
        },
    ],

    transportista: [
        { field: 'contactoNombre', headerName: 'Nombre', width: 130 },
        { field: 'nombreEmpresa', headerName: 'Empresa', width: 130 },
        { field: 'contactoEmail', headerName: 'Correo', width: 180 },
        {
        field: 'contactoTelefono',
        headerName: 'Teléfono',
        type: 'number',
        width: 160,
        },
    ],

    tipoDeVehiculo: [
        { field: 'nombre', headerName: 'Nombre', width: 130 },
        {
        field: 'capacidadPesoKG',
        headerName: 'Capacidad de Peso (KG)',
        width: 160,
        },
        {
        field: 'capacidadVolumenM3',
        headerName: 'Capacidad de Volumen (M3)',
        width: 160,
        },
        { field: 'descripcion', headerName: 'Descripcion', width: 130 }
    ],

    tipoDeCarga: [
        { field: 'nombre', headerName: 'Nombre', width: 130 },
        { field: 'descripcion', headerName: 'Descripcion', width: 130 }
    ]
}
