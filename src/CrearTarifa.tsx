import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import { HeaderConMenu } from './components/Header';
import FormularioNuevaTarifa from './components/FormularioNuevaTarifa';

const CrearTarifa: React.FC = () => {
    const [sidebarAbierta, setSidebarAbierta] = useState(false);

    const toggleSidebar = () => {
        setSidebarAbierta(prev => !prev);
    };

    return (
        <div className="app flex">
            {/* Sidebar solo se muestra si está abierta */}
            {sidebarAbierta && <Sidebar />}

            <div className="flex-1">
                <HeaderConMenu onImagenClick={toggleSidebar} />
                <FormularioNuevaTarifa />
            </div>
        </div>
    );
};

export default CrearTarifa;