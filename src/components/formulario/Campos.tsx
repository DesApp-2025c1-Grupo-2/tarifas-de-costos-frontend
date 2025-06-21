import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Autocomplete from '@mui/material/Autocomplete';
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
  
type AutocompleteFieldProps = {
  label: string;
  opciones: Opcion[];
  value: string;
  onChange: (val: string) => void;
};

  
export const BasicAutocomplete: React.FC<AutocompleteFieldProps> = ({ label, opciones, value, onChange }) => {
  const selectedOption = opciones.find((op) => String(op.id) === value) || null;

  return (
    <Box sx={{ mb: 1 }}>
      <Autocomplete
        options={opciones}
        getOptionLabel={(option: Opcion) => option.nombre}
        value={selectedOption}
        onChange={(_, newValue) => {
          onChange(newValue ? String(newValue.id) : '');
        }}
        isOptionEqualToValue={(option, val) => String(option.id) === String(val.id)}
        renderInput={(params) => <TextField {...params} label={label} fullWidth />}
      />
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