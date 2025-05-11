import React from 'react';

const Header: React.FC = () => (
  <header className="header">
    <div>
      <strong>
        <a href="/" style={{
          all: "unset", 
          cursor: 'pointer'}}>
            Acme SRL - Sistema de Tarifas
        </a>
      </strong>
    </div>
    <div>Usuario: Juan Pérez</div>
  </header>
);

export default Header;
