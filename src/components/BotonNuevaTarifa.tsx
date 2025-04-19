import React from 'react';
import { Link } from 'react-router-dom';

const BotonNuevaTarifa: React.FC = () => (
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

export default BotonNuevaTarifa;
