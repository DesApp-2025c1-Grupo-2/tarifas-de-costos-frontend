import React from 'react';
import '../CrearTarifa.css';

const FormularioNuevaTarifa: React.FC = () => (
    <div className="crear-tarifa">
        <h2>Gestionar Tarifa para nuevo viaje</h2>
        <form className="formulario-tarifa">

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
    </div>
);

export default FormularioNuevaTarifa;