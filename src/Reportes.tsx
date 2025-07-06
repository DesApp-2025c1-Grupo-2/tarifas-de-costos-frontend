import React, { useState } from 'react';
import { Tabs, Tab, Box } from '@mui/material';
import Sidebar from './components/Sidebar';
import { HeaderConMenu } from './components/Header';
import CatalogoAdicionales from './components/reportes/CatalogoAdicionales';
import ComparativaZonasCostos from './components/reportes/ComparativaZonasCostos';
import { FrecuenciaAdicionalesReporte } from './components/reportes/FrecuenciaAdicionalesReporte';
import { TransportistasMasUtilizadosReporte } from './components/reportes/TransportistasMasUtilizadosReporte';
import './css/App.css';
import './css/CrearTarifa.css';

const Reportes: React.FC = () => {
  const [sidebarAbierta, setSidebarAbierta] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);

  const toggleSidebar = () => {
    setSidebarAbierta(prev => !prev);
  };

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  return (
    <div className="app">
      <HeaderConMenu onImagenClick={toggleSidebar} />
      {sidebarAbierta && <Sidebar isOpen={sidebarAbierta} toggleSidebar={toggleSidebar} />}

      <div className="content-area">
        <h1>Reportes Generales</h1>

        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabIndex}
            onChange={handleTabChange}
            aria-label="tabs reportes"
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
          >
            <Tab label="Comparativa Zonas y Costos" />
            <Tab label="Catálogo de Adicionales" />
            <Tab label="Frecuencia de Adicionales" />
            <Tab label="Transportistas Más Utilizados" />
          </Tabs>
        </Box>

        <Box sx={{ mt: 2 }}>
          {tabIndex === 0 && <ComparativaZonasCostos />}
          {tabIndex === 1 && <CatalogoAdicionales />}
          {tabIndex === 2 && <FrecuenciaAdicionalesReporte />}
          {tabIndex === 3 && <TransportistasMasUtilizadosReporte />}
        </Box>
      </div>
    </div>
  );
};

export default Reportes;