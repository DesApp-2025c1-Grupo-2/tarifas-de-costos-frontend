import { createTheme, ThemeOptions } from "@mui/material/styles";


const customPalette = {
  primary: { main: '#E65F2B' }, 
  text: { primary: '#5A5A65' },
  background: {
    default: '#F6F7FB', 
    paper: '#FFFFFF',   
  },
  grey: {
    100: '#F6F7FB', 
    200: '#C7C7C7', 
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
};

export const customMuiTheme = createTheme({
  palette: customPalette,

  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h2: {
      fontSize: '2rem',
      fontWeight: 700,
      color: customPalette.text.primary,
    },
    h5: {
      fontWeight: 700,
       color: customPalette.text.primary,
    },
    h6: {
      fontWeight: 600,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  components: {

    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: customPalette.background.default,
        },
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: customPalette.background.paper,
        },
      },
    },

    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 600,
          color: customPalette.text.primary,
          backgroundColor: customPalette.grey[100],
          borderBottom: `1px solid ${customPalette.grey[200]}`,
        },
        body: {
          color: customPalette.text.primary,
          borderBottom: `1px solid ${customPalette.grey[200]}`,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: customPalette.grey[200],
            },
            '&:hover fieldset': {
              borderColor: customPalette.primary.main,
            },
            '&.Mui-focused fieldset': {
              borderColor: customPalette.primary.main,
            },
          },
        },
      },
    },
   
    MuiButton: {
      styleOverrides: {
        containedPrimary: {
          borderRadius: '8px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
        outlined: {
          borderRadius: '8px',
        }
      },
    },
  },
} as ThemeOptions);