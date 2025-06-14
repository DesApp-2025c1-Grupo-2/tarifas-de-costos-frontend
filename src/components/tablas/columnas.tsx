import { GridColDef } from '@mui/x-data-grid';

export type Entidad = 'tarifa' | 'transportista' | 'tipoDeVehiculo' | 'tipoDeCarga';

export const columnas: Record<Entidad, GridColDef[]> = {

    tarifa: [
        { field: 'transportista', headerName: 'Transportista', flex: 1 },
        { field: 'tipoDeVehiculo', headerName: 'Tipo de vehiculo', flex: 1 },
        { field: 'zona', headerName: 'Zona', flex: 1 },
        { field: 'carga', headerName: 'Carga', flex: 1 },
        {
            field: 'total',
            headerName: 'Total',
            type: 'number',
            flex: 1,
        },
    ],

    transportista: [
        { field: 'contactoNombre', headerName: 'Nombre', flex: 1 },
        { field: 'nombreEmpresa', headerName: 'Empresa', flex: 1 },
        { field: 'contactoEmail', headerName: 'Correo', flex: 1 },
        {
        field: 'contactoTelefono',
        headerName: 'Teléfono',
        type: 'number',
        flex: 1,
        },
    ],

    tipoDeVehiculo: [
        { field: 'nombre', headerName: 'Nombre', flex: 1 },
        {
        field: 'capacidadPesoKG',
        headerName: 'Capacidad de Peso (KG)',
        flex: 1,
        },
        {
        field: 'capacidadVolumenM3',
        headerName: 'Capacidad de Volumen (M3)',
        flex: 1,
        },
        { field: 'descripcion', headerName: 'Descripcion', flex: 1 }
    ],

    tipoDeCarga: [
        { field: 'nombre', headerName: 'Nombre', flex: 1 },
        { field: 'descripcion', headerName: 'Descripcion', flex: 1 }
    ]
}
