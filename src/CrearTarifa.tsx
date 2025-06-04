import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import { HeaderConMenu } from './components/Header';
import { FormCrearTarifa } from './components/formulario/Formularios';
import './css/App.css';
import './css/CrearTarifa.css';

const CrearTarifa: React.FC = () => {
  const [sidebarAbierta, setSidebarAbierta] = useState(false);

  const toggleSidebar = () => {
    setSidebarAbierta(prev => !prev);
  };

  return (
    <div className="app" style={{ overflow: 'hidden' }}>
      <HeaderConMenu onImagenClick={toggleSidebar} />
      {sidebarAbierta && <Sidebar isOpen={sidebarAbierta} toggleSidebar={toggleSidebar} />}
      <div className="content-area" style={{ overflow: 'hidden' }}>
        <FormCrearTarifa />
      </div>
    </div>
  );
};

export default CrearTarifa;