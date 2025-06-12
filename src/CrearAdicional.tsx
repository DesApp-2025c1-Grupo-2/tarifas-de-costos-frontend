import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import { HeaderConMenu } from './components/Header';
import { AdicionalForm } from './components/formulario/AdicionalForm'; 
import "./css/CrearTarifa.css";
import "./css/App.css";

const CrearAdicional: React.FC = () => {
    const [sidebarAbierta, setSidebarAbierta] = useState(false);

    const toggleSidebar = () => {
        setSidebarAbierta(prev => !prev);
    };

    const handleCrearAdicional = (adicionalData: { nombre: string; costoDefault: number; descripcion: string }) => {
        console.log('Datos del adicional a crear (simulado):', adicionalData);
        alert(`Adicional "${adicionalData.nombre}" creado exitosamente (simulado)!`);
    };

    return (
        <div className="app">
            <HeaderConMenu onImagenClick={toggleSidebar} />
            {sidebarAbierta && <Sidebar isOpen={sidebarAbierta} toggleSidebar={toggleSidebar} />}
            <div className="content-area">
                <h2>Crear Nuevo Adicional</h2>
                <AdicionalForm onSubmit={handleCrearAdicional} />
            </div>
        </div>
    );
};

export default CrearAdicional;