import React from 'react';

const Header: React.FC = () => (
  <header className="header">
    <div className="header-content">
      <strong>
        <div className='empresa'> 
        <a href="/" style={{
          all: "unset", 
          cursor: 'pointer'}}>
            Acme SRL - Sistema de Tarifas
        </a>
        </div>
      </strong>
    </div>
    <div className="usuario">Usuario: Juan Pérez</div>
  </header>
);

interface HeaderConMenuProps {
  onImagenClick: () => void;
}

const HeaderConMenu: React.FC<HeaderConMenuProps> = ({ onImagenClick }) => (
  <header className="header">
    <div className="headerConMenu">
      <img
        src="/img/menu.png"
        alt="Menú"
        className="headerConMenu-icon"
        onClick={onImagenClick}
      />

      <span className="headerConMenu-title">
        <a href="/" style={{ all: "unset", cursor: "pointer" }}>
          Acme SRL - Sistema de Tarifas
        </a>
      </span>
    </div>

    <div className="usuario text-sm">Usuario: Juan Pérez</div>
  </header>
);

export default Header;
export { HeaderConMenu };
export type { HeaderConMenuProps };