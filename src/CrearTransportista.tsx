import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import { HeaderConMenu } from './components/Header';
import { FormCrearTransportista } from './components/formulario/TransportistaForm';
import './css/App.css';
import './css/CrearTarifa.css';

const CrearTransportista: React.FC = () => {
    const [sidebarAbierta, setSidebarAbierta] = useState(false);

    const toggleSidebar = () => {
        setSidebarAbierta(prev => !prev);
    };

    return (
        <div className="app">
            
            <HeaderConMenu onImagenClick={toggleSidebar} /> 

            
            {sidebarAbierta && <Sidebar isOpen={sidebarAbierta} toggleSidebar={toggleSidebar} />} 
            
            <div className="content-area">
                <FormCrearTransportista />
            </div>
        </div>
    );
};

export default CrearTransportista;