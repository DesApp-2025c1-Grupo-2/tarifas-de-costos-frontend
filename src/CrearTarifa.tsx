import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import { HeaderConMenu } from './components/Header';
import FormularioNuevaTarifa from './components/FormularioNuevaTarifa';
import './App.css'; 

const CrearTarifa: React.FC = () => {
    const [sidebarAbierta, setSidebarAbierta] = useState(false);

    const toggleSidebar = () => {
        setSidebarAbierta(prev => !prev);
    };

    return (
        <div className="app">
            
            <HeaderConMenu onImagenClick={toggleSidebar} /> 

            
            {sidebarAbierta && <Sidebar isOpen={sidebarAbierta} toggleSidebar={toggleSidebar} />} 

            <div className="content-area"> 
                <FormularioNuevaTarifa />
            </div>
        </div>
    );
};

export default CrearTarifa;