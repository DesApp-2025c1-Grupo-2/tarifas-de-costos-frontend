import React, { useState } from 'react';
import '../../css/CrearTarifa.css'; 


interface AdicionalFormProps {
    onSubmit: (adicionalData: { nombre: string; costoDefault: number; descripcion: string }) => void;
}

export const AdicionalForm: React.FC<AdicionalFormProps> = ({ onSubmit }) => {
    const [nombre, setNombre] = useState('');
    const [costoDefault, setCostoDefault] = useState<number | ''>('');
    const [descripcion, setDescripcion] = useState('');
    const [errores, setErrores] = useState<{ [key: string]: string }>({});

    const validarFormulario = () => {
        const nuevosErrores: { [key: string]: string } = {};
        if (!nombre.trim()) {
            nuevosErrores.nombre = 'El nombre es obligatorio.';
        }
        if (costoDefault === '' || isNaN(Number(costoDefault)) || Number(costoDefault) < 0) {
            nuevosErrores.costoDefault = 'El costo por defecto debe ser un número positivo.';
        }

        setErrores(nuevosErrores);
        return Object.keys(nuevosErrores).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validarFormulario()) {
            onSubmit({
                nombre,
                costoDefault: Number(costoDefault),
                descripcion,
            });

            setNombre('');
            setCostoDefault('');
            setDescripcion('');
            setErrores({});
        } else {
            console.log('Formulario con errores, por favor corregir.');
        }
    };

    return (
        <div className="form-container">
            <form onSubmit={handleSubmit} className="form">
                <div className="form-group">
                    <label htmlFor="nombre">Nombre del Adicional:</label>
                    <input
                        type="text"
                        id="nombre"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        className={errores.nombre ? 'input-error' : ''}
                    />
                    {errores.nombre && <p className="error-message">{errores.nombre}</p>}
                </div>

                <div className="form-group">
                    <label htmlFor="costoDefault">Costo por Defecto:</label>
                    <input
                        type="number"
                        id="costoDefault"
                        value={costoDefault}
                        onChange={(e) => setCostoDefault(e.target.value === '' ? '' : Number(e.target.value))}
                        className={errores.costoDefault ? 'input-error' : ''}
                    />
                    {errores.costoDefault && <p className="error-message">{errores.costoDefault}</p>}
                </div>

                <div className="form-group">
                    <label htmlFor="descripcion">Descripción (Opcional):</label>
                    <textarea
                        id="descripcion"
                        value={descripcion}
                        onChange={(e) => setDescripcion(e.target.value)}
                        rows={3}
                    ></textarea>
                </div>

                <button type="submit" className="submit-button">
                    Crear Adicional
                </button>
            </form>
        </div>
    );
};