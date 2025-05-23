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
  <header className="header flex justify-between items-center p-4 shadow bg-custom-dark-blue">
    <div className="flex items-center"> 
      <img
        src="/img/menu.png"
        alt="Menú"
        className="headerConMenu-icon"
        onClick={onImagenClick}
      />
      {/* <strong>
        <div className="empresa">
          <a href="/" style={{ all: "unset", cursor: "pointer", color: 'white' }}>
            Acme SRL - Sistema de Tarifas
          </a>
        </div>
      </strong> */}
    </div>

    <div className="usuario" style={{color: 'white'}}>Usuario: Juan Pérez</div>
  </header>
  
);

export default Header;
export { HeaderConMenu };
export type { HeaderConMenuProps };