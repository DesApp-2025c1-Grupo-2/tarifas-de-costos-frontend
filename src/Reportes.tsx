
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import { HeaderConMenu } from './components/Header';
import CatalogoAdicionales from './components/reportes/CatalogoAdicionales'; 
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
                <CatalogoAdicionales /> 
            </div>
        </div>
    );
};

export default Reportes;
