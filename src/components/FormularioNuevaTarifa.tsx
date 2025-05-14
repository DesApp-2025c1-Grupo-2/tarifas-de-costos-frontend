
import '../CrearTarifa.css';
import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';

const FormularioNuevaTarifa: React.FC = () => {
  const [mostrarMensaje, setMostrarMensaje] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log('Formulario guardado (simulado)');
    setMostrarMensaje(true);
    setTimeout(() => {
      navigate('/'); 
    }, 1200);
  };

  return (
    <div className="crear-tarifa">
      <h2>Gestionar Tarifa para nuevo viaje</h2>
      <form className="formulario-tarifa" onSubmit={handleSubmit}>
        <label>Tipo de Vehículo</label>
        <select>
          <option>Camioneta</option>
          <option>Camión Mediano</option>
          <option>Camión Grande</option>
        </select>

        <label>Zona</label>
        <select>
          <option>AMBA</option>
          <option>BsAs-Rosario</option>
        </select>

        <label>Tipo de Carga</label>
        <select>
          <option>Regular</option>
          <option>Refrigerada</option>
          <option>Peligrosa</option>
        </select>

        <label>Peso Estimado</label>
        <input type="text" />

        <label>Volumen Estimado</label>
        <input type="number" />

        <label> Requisitos especiales</label>
        <input type="text" />

        <label>Transportista</label>
        <input type="text" placeholder="Nombre de la empresa" />

        <label>Costo Base</label>
        <input type="number" placeholder="$" />

        <label>Adicionales</label>
        <select>
        </select>

        <button type="submit">Guardar Tarifa</button>
      </form>

      {mostrarMensaje && (
        <div className="mensaje-exito">
          Su registro se ha guardado con éxito!
        </div>
      )}
    </div>
  );
};

export default FormularioNuevaTarifa;