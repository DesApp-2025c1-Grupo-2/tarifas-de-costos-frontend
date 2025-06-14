import React, { useState, useEffect, useRef } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { columnas, Entidad } from './columnas';
import { BotonEditar, BotonEliminar } from '../Botones';
import {
  obtenerTransportistas,
  crearTransportista,
  actualizarTransportista,
  eliminarTransportista,
  Transportista,
} from '../../services/transportistaService';


const tabla = (
  entidad: Entidad,
  handleEdit: (row: any) => void,
  handleDelete: (id: string) => void
): GridColDef[] => {
  const base = columnas[entidad];
  

  return [

    ...columnas[entidad],
    {
      field: 'acciones',
      headerName: 'Acciones',
      width: 250,
      renderCell: (params) => (
        <>
          <BotonEditar onClick={() => handleEdit(params.row)} children={undefined}/>
          <BotonEliminar onClick={() => handleDelete(params.row.id.toString())} children={undefined}/>
        </>
      ),
    }
  ]
}

interface DataTableProps {
  rows: any[];
  entidad: Entidad;
  handleEdit: (row: any) => void;
  handleDelete: (id: string) => void;
}

export default function DataTable({ rows, entidad, handleEdit, handleDelete }: DataTableProps) {
  return (
    <Paper sx={{ height: '100%', width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={tabla(entidad, handleEdit, handleDelete)}
        initialState={{ pagination: { paginationModel: { page: 0, pageSize: 5 } } }}
        pageSizeOptions={[5, 10]}
        sx={{ border: 0 }}
      />
    </Paper>
  );
}
