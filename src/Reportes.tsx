import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import { HeaderConMenu } from './components/Header';
import CatalogoAdicionales from './components/reportes/CatalogoAdicionales'; 
import ComparativaZonasCostos from './components/reportes/ComparativaZonasCostos';
import  {FrecuenciaAdicionalesReporte}  from './components/reportes/FrecuenciaAdicionalesReporte';
import './css/App.css';
import './css/CrearTarifa.css'; 

const Reportes: React.FC = () => {
    const [sidebarAbierta, setSidebarAbierta] = useState(false);

    const toggleSidebar = () => {
        setSidebarAbierta(prev => !prev);
    };

    return (
        <div className="app">
            <HeaderConMenu onImagenClick={toggleSidebar} /> 
            
            {sidebarAbierta && <Sidebar isOpen={sidebarAbierta} toggleSidebar={toggleSidebar} />} 
            
            <div className="content-area">
                <h1>Reportes Generales</h1>
                <ComparativaZonasCostos /> 
                <CatalogoAdicionales /> 
                <FrecuenciaAdicionalesReporte />
            </div>
        </div>
    );
};

export default Reportes;