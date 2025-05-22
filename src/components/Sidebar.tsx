import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false); 

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <h2 onClick={toggleSidebar} className="menu-toggle">
        Menú
      </h2>
      <Link to="/">Dashboard</Link>
      <Link to="/crear-tarifa">Tarifas</Link>
      <Link to="/">Adicionales</Link>
      <Link to="/">Reportes</Link>
      <Link to="/">Configuración</Link>
      <Link to="/">Cerrar Sesión</Link>
    </aside>
  );
};

export default Sidebar;
