// type Text = {
//     nombre: string;
//     tipo: string;
//   };
  
// export const TextInput = ({ nombre, tipo }: { nombre: string; tipo: string }) => {
//   return (
//     <div className="text-field">
//       <label htmlFor={nombre.replace(/\s+/g, '-').toLowerCase()}>
//         {nombre}:
//       </label>
//       <input
//         type={tipo}
//         id={nombre.replace(/\s+/g, '-').toLowerCase()}
//         name={nombre}
//         className="text-field"
//         required
//       />
//     </div>
//   );
// };
  
// type Select = {
//     nombre: string;
//     opciones: Array<string>;
// };
  
// export const SelectField: React.FC<Select> = ({ nombre, opciones }) => {
//     const name = nombre;
  
//     return (
//       <div className='text-field'>
//         <label htmlFor={nombre} className="label-espaciada">{nombre}</label>
//         <select id={name} className='select-field'>
//             <option value='default' selected>-</option>
//             {opciones.map((e) => 
//                 <option value={e}>{e}</option>
//             )}
//         </select>
//       </div>
//     );
// };

// type Options = {
//     opciones: Array<string>;
// };

// export const ChipBlock: React.FC<Options> = ({ opciones }) => {
//     const op = opciones;

//     return (
//         <div>
//             <label>Requisitos especiales</label>
//             {opciones.map((e, index) => 
//                 <Chip id={e} nombre={e} key={index}/>
//             )}
//         </div>
//     )
// };

// type ChipOp = {
//     id: string;
//     nombre: string;
// };

// const Chip: React.FC<ChipOp> = ({ id, nombre }) => {

//     return (
//         <div className="div-margin-top">
//             <input type='checkbox' id={String(id)} name={nombre} value={nombre}/>
//             <label htmlFor={nombre}>{nombre}</label>
//         </div>
//     )
// }

// type Res = {
//     nombre: string;
// };

// export const CostoBase: React.FC<Res> = ({ nombre }) => {
//     return (
//         <div className='result'>
//             <p>COSTO BASE</p>
//             <input  type="number" />
//         </div>
//     )
// }

// export const Resultado: React.FC<Res> = ({ nombre }) => {
//     return (
//         <div className='result'>
//             <p>{nombre}</p>
//             <p>$$$</p>
//         </div>
//     )
// }

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