import { createTheme } from "@mui/material";
import type { PaletteOptions } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface PaletteOptions {
    actionButtons?: {
      details: {
        background: string;
        border: string;
        text: string;
      };
      edit: {
        background: string;
        border: string;
        text: string;
      };
      delete: {
        background: string;
        border: string;
        text: string;
      };
    };
  }
}

// --- Paleta de colores ---
const colorPrimario = '#ffe7c0ff';     // Naranja-Ámbar (para fondos de selección)
const colorSecundario = '#E65F2B'; // Naranja Fuerte (para texto/ícono sobre el ámbar)
// --- Fin Paleta de colores ---

export const customMuiTheme = createTheme({
  palette: {
    primary: {
      // --- INICIO DE LA MODIFICACIÓN ---
      main: colorSecundario, // NARANJA FUERTE
      // --- FIN DE LA MODIFICACIÓN ---
    },
    secondary: {
      // --- INICIO DE LA MODIFICACIÓN ---
      main: colorPrimario, // ÁMBAR
      // --- FIN DE LA MODIFICACIÓN ---
    },
    error: {
      main: '#DD5050',
    },
    warning: {
      main: '#E01414',
    },
    grey: {
      100: '#F6F7FB',
      200: '#C7C7C7',
    },
    success: {
      main: '#2F691D',
    },
    text: {
      primary: '#5A5A65',
    },

    actionButtons: {
      details: {
        background: '#F5F5F5',
        border: '#E0E0E0',
        text: '#333333',
      },
      edit: {
        background: '#DBEAFE',
        border: '#AFD1FF',
        text: '#214BD3',
      },
      delete: {
        background: 'rgba(255, 53, 53, 0.25)',
        border: '#FF9292',
        text: '#FF3535',
      }
    }
  },
  typography: {
    fontFamily: 'poppins',
    h2:{
      fontSize: '2rem',
      fontWeight: 900,
      color: "#5A5A65", // <-- CORRECCIÓN: Faltaba el #
    },
    button: {
      textTransform: 'none',
    },
  },
  components: {
    MuiTableContainer: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          boxShadow: "0px 0px 1px rgba(0, 0, 0, 0.1)", 
          border: "1px solid #e5e7eb" 
        },
      },
    },
    MuiTable:{
      styleOverrides: {
        root: {
          width: "100%",
          height: "100%",
          minWidth: 650,
          "& thead th": {
              backgroundColor: "#f5f6f7",
              color: "#5A5A65",
              fontWeight: 600,
              fontSize: "0.875rem",
              letterSpacing: 0.3,
              borderBottom: "1px solid #e5e7eb",
          },
          "& tbody td": {
              borderBottom: "1px solid #f0f0f0",
              fontSize: "0.9rem",
              color: "#5A5A65",
          },
          "& tbody tr:hover": {
              backgroundColor: "#FFFBEB", // Ámbar pálido para hover
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 600,
          fontSize: '0.875rem',
          color: "#5a5a65",
          border: "none",
          textAlign: "left",
          padding: "14px 18px",
        },
        body: {
          fontSize: '0.875rem',
          color: "#5A5A65",
          border: "none",
          padding: "20px 18px",
        },
      }
    },
    MuiTableRow: {
      styleOverrides: {
        head: {
          backgroundColor: "#f3f4f6",
          border: "none",
        },
        root : {
          borderTop: "0.5px solid #C7C7C7",
        }
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          //... (tus otras clases)
          "& .MuiOutlinedInput-root": {
            //... (tus otras reglas)
            "&:hover fieldset": {
              borderColor: colorSecundario, // Borde NARANJA en hover
            },
            "&.Mui-focused fieldset": {
              borderColor: colorSecundario, // Borde NARANJA en focus
            },
          },
        },
      },
    },
    MuiMenu:{
      styleOverrides:{
        paper:{
          maxHeight:200,
          overflowY:"auto",
          border: "1px solid #C7C7C7",
          boxShadow: "0px 2px 4px rgba(199, 199, 199, 1.00)",
        },
      },
    },
    MuiSelect:{
      styleOverrides:{
        root:{
          borderRadius:6,
          height:"48px",
          padding: "0px 0px",
          "& .MuiOutlinedInput-notchedOutline": { borderColor: "#c7c7c7" },
          "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#5A5A65" }
        },
        
      },
    },
    MuiMenuItem:{
      styleOverrides:{
        root:{
          "&:hover":{
            backgroundColor:"#e0e0e0"
          },
          color: "#5A5A65",
          fontSize: '0.900rem'
        }
      }
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: '12px',
          padding: '10px',
          boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          display: "flex",
          flexDirection: "column",
          width: "100%",
          minHeight: 150,
          boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
          overflow: "hidden",
          justifyContent: "space-between",
          '&:hover': { boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)" },
          transition: "box-shadow 0.3s ease",
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#E0E0E0", 
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#5A5A65", 
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: colorSecundario, // Borde NARANJA en focus
          },
        },
      },
    },
    MuiAutocomplete: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            //... (tus otras reglas)
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: colorSecundario, // Borde NARANJA en focus
            },
          },
        },
      },
    },

}});