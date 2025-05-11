import React from 'react';
import { Link } from 'react-router-dom';

type Props = {
    direccion: string;
    texto: string;
};

const Boton: React.FC<Props> = ({direccion, texto}) => (
    <Link to={direccion}>
        <button style={{
            padding: '0.5rem 1rem',
            marginTop: '16px',
            backgroundColor: '#1B2A41',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
        }}>
            {texto}
        </button>
    </Link>
);

export default Boton;
