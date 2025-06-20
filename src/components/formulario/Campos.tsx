import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { Input, InputAdornment } from '@mui/material';

type TextProps = {
    label: string;
    value: string;
    onChange: (val: string) => void;
  };

export const BasicTextFields: React.FC<TextProps> = ({ label, value, onChange }) => (
    <Box sx={{ mb: 1 }}>
      <TextField
        fullWidth
        label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        margin="normal"
      />
    </Box>
  );

export type Opcion = {
    id: string | number;
    nombre: string;
  };
  
type SelectProps = {
    label: string;
    opciones: Opcion[];
    value: string;
    onChange: (val: string) => void;
  };
  
  export const BasicSelect: React.FC<SelectProps> = ({ label, opciones, value, onChange }) => {
    return (
      <Box sx={{ mb: 1 }}>
        <FormControl fullWidth margin="normal">
          <InputLabel>{label}</InputLabel>
          <Select
            value={value}
            label={label}
            onChange={(e) => onChange(e.target.value)}
          >
            {opciones.map((op) => (
              <MenuItem key={op.id} value={String(op.id)}>
                {op.nombre}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    );
  };

interface NumberFieldProps {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
}

export const NumberField: React.FC<NumberFieldProps> = ({ label, value, onChange }) => {
  return (
    <FormControl fullWidth sx={{ m: 1, my: 2 }} variant="standard" >
      <InputLabel htmlFor="costoBase">{label}</InputLabel>
      <Input
        id="costoBase"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        type='number'
        startAdornment={<InputAdornment position="start">$</InputAdornment>}
      />
    </FormControl>
  )
}

type Res = {
    nombre: string;
    value: string; // o number, según el caso
  };

export const Resultado: React.FC<Res> = ({ nombre, value }) => {
  return (
    <Box sx={{ mb: 2 }}>
        <FormControl fullWidth sx={{ m: 1, my: 2}} variant="standard">
            <InputLabel htmlFor="standard-adornment-amount">{nombre}</InputLabel>
            <Input
                id="standard-adornment-amount"
                startAdornment={<InputAdornment position="start">$</InputAdornment>}
                slotProps={{
                    input: {
                      readOnly: true,
                    },
                  }}
            />
        </FormControl>
    </Box>
  )
}