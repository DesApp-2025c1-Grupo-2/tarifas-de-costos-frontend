import React from "react";
import { Link } from "react-router-dom";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  return (
    <aside className={`sidebar ${isOpen ? "open" : ""}`}>
      <h2 style={{ paddingLeft: "0.8em" }}>Menú Principal</h2>

      <Link to="/reportes">Reportes</Link>
      <Link to="/crear-tarifa">Tarifas</Link>
      <Link to="/crear-adicional">Adicionales</Link>
      <Link to="/crear-transportista">Transportistas</Link>
      <Link to="/crear-vehiculo">Vehiculos</Link>
      <Link to="/crear-zona">Zonas</Link>
      <Link to="/crear-carga">Carga</Link>
    </aside>
  );
};

export default Sidebar;
