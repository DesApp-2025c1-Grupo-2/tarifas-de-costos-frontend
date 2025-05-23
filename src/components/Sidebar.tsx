import React from 'react';
import { Link } from 'react-router-dom';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void; // Mantengo esto por si en el futuro decides tener un botón de cerrar dentro del sidebar
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      {/* He quitado el h2 que decía "Menú" y tenía un onClick. 
        Ahora el botón de las tres rayitas en el Header es el único que abre y cierra.
        Si quieres un título "Menú" sin que sea clickeable:
      */}
      <h2 style={{paddingLeft: "0.4em"}}>Menú Principal</h2>
      
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