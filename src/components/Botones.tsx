import React, { useState } from 'react';
import { Link } from 'react-router-dom';

////////// CREAR NUEVA TARIFA //////////

export const BotonNuevaTarifa: React.FC = () => (
    <Link to='./crear-tarifa'>
        <button style={{
            padding: '0.5rem 1rem',
            marginTop: '16px',
            backgroundColor: '#1B2A41',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
        }}>
            + Nueva Tarifa
        </button>
    </Link>
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