import React from 'react';
import { Link } from 'react-router-dom';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <h2 style={{paddingLeft: "0.4em"}}>Menú Principal</h2>
      
      {/* <Link to="/">Dashboard</Link> */}
      <Link to="/crear-tarifa">Tarifas</Link>
      <Link to="/">Adicionales</Link>
      <Link to="/crear-transportista">Transportistas</Link>
      <Link to="/crear-vehiculo">Vehiculos</Link>
      <Link to="/crear-zona">Zonas</Link>
      <Link to="/crear-carga">Cargas</Link>
      <Link to="/">Cerrar Sesión</Link>
    </aside>
  );
};

export default Sidebar;