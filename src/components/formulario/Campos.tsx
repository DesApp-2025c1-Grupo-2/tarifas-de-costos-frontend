import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Autocomplete from "@mui/material/Autocomplete";
import { Input, InputAdornment } from "@mui/material";

// --- INICIO DE LA MODIFICACIÓN ---
// Se añade la propiedad opcional 'type'
type TextProps = {
  label: string;
  value: string;
  onChange: (val: string) => void;
  type?: "text" | "email" | "tel"; // Tipos permitidos
};

// Se pasa el 'type' al TextField de Material-UI
export const BasicTextFields: React.FC<TextProps> = ({
  label,
  value,
  onChange,
  type = "text",
}) => (
  <Box sx={{ mb: 1 }}>
    <TextField
      fullWidth
      label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      margin="normal"
      type={type} // <-- Aquí se usa el tipo
    />
  </Box>
);
// --- FIN DE LA MODIFICACIÓN ---

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

export const BasicAutocomplete: React.FC<AutocompleteFieldProps> = ({
  label,
  opciones,
  value,
  onChange,
}) => {
  const selectedOption = opciones.find((op) => String(op.id) === value) || null;

  return (
    <Box sx={{ mb: 1 }}>
      <Autocomplete
        options={opciones}
        getOptionLabel={(option: Opcion) => option.nombre}
        value={selectedOption}
        onChange={(_, newValue) => {
          onChange(newValue ? String(newValue.id) : "");
        }}
        isOptionEqualToValue={(option, val) =>
          String(option.id) === String(val.id)
        }
        renderInput={(params) => (
          <TextField {...params} label={label} fullWidth />
        )}
        renderOption={(props, option) => (
          <li {...props} key={option.id}>
            {option.nombre}
          </li>
        )}
      />
    </Box>
  );
};

interface NumberFieldProps {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
}

export const NumberField: React.FC<NumberFieldProps> = ({
  label,
  value,
  onChange,
}) => {
  return (
    <FormControl fullWidth sx={{ m: 1, my: 2 }} variant="standard">
      <InputLabel htmlFor="costoBase">{label}</InputLabel>
      <Input
        id="costoBase"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        type="number"
        startAdornment={<InputAdornment position="start">$</InputAdornment>}
      />
    </FormControl>
  );
};

type Res = {
  nombre: string;
  value: string;
};

export const Resultado: React.FC<Res> = ({ nombre, value }) => {
  return (
    <Box sx={{ mb: 2 }}>
      <FormControl fullWidth sx={{ m: 1, my: 2 }} variant="standard">
        <InputLabel htmlFor={`resultado-${nombre.toLowerCase()}`}>
          {nombre}
        </InputLabel>
        <Input
          id={`resultado-${nombre.toLowerCase()}`}
          value={value} // <-- Aquí pasamos el valor al input
          readOnly // <-- Se simplifica la propiedad de solo lectura
          startAdornment={<InputAdornment position="start">$</InputAdornment>}
        />
      </FormControl>
    </Box>
  );
};
