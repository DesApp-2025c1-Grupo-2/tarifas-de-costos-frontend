import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export const estiloBoton: React.CSSProperties = {
    padding: '0.5rem 1rem',
    marginTop: '16px',
    backgroundColor: '#1B2A41',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    display: 'inline-block',
    textDecoration: 'none',
    textAlign: 'center'
};

interface BotonProps {
    to: string;
    texto: string;
}

////////// CREAR NUEVA TARIFA //////////

const Boton: React.FC<BotonProps> = ({ to, texto }) => (
    <Link to={to} style={estiloBoton}>
        {texto}
    </Link>
);

export const BotonTarifas: React.FC = () => (
    <Boton to='./tarifas' texto='Tarifas' />
);

////////// GUARDAR //////////

export const BotonGuardar: React.FC = () => (
    <button style={{
        padding: '0.5rem 1rem',
        marginTop: '16px',
        backgroundColor: '#1B2A41',
        color: '#fff',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer'
    }}>
        Guardar
    </button>
);

// lo movi para que esten todos los botones juntos
export const BotonNuevaTarifa: React.FC = () => (
    <Link to="/crear-tarifa">
        <button style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#1B2A41',
            marginLeft: '24px',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
        }}>
            + Nueva Tarifa
        </button>
    </Link>
);