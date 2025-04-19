import React from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import FormularioNuevaTarifa from './components/FormularioNuevaTarifa';

const CrearTarifa: React.FC = () => {
    return (
        <div className="app">
            <Header />
            <Sidebar />
            <FormularioNuevaTarifa />
        </div>
    );
};

export default CrearTarifa;