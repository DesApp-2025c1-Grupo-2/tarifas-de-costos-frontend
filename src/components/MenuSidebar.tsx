import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar: React.FC = () => (
  <aside className="sidebar">
    <h2><Link to="/">Menú</Link></h2>
    <Link to="/">Dashboard</Link>
    <Link to="/crear-tarifa">Tarifas</Link>
    <Link to="/">Adicionales</Link>
    <Link to="/">Reportes</Link>
    <Link to="/">Configuración</Link>
    <Link to="/">Cerrar Sesión</Link>
  </aside>
);

export default Sidebar;