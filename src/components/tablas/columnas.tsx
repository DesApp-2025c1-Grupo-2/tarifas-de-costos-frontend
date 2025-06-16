import { GridColDef } from '@mui/x-data-grid';
import {Tarifa} from '../../services/tarifaService';

export type Entidad = 'tarifa' | 'transportista' | 'tipoDeVehiculo' | 'tipoDeCarga' | 'zona';

export const columnas: Record<Entidad, GridColDef[]> = {

    tarifa: [
        { field: 'transportistaNombre', headerName: 'Transportista', flex: 1 },
        { field: 'tipoVehiculoNombre', headerName: 'Tipo de vehículo', flex: 1 },
        { field: 'zonaNombre', headerName: 'Zona', flex: 1 },
        { field: 'tipoCargaNombre', headerName: 'Carga', flex: 1 },
        {
          field: 'valorBase',
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
    ],

    zona: [
        { field: 'nombre', headerName: 'Nombre', flex: 1 },
        { field: 'descripcion', headerName: 'Descripcion', flex: 1 },
        { field: 'regionMapa', headerName: 'Region', flex: 1 }
    ]
}
