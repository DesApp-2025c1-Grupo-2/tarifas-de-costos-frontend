import React from 'react';

const Filtros: React.FC = () => (
  <section className="card filters">
    <h3>Filtros</h3>
    <label htmlFor="vehiculo">Tipo de Vehículo</label>
    <select id="vehiculo">
      <option>Todos</option>
      <option>Camioneta</option>
      <option>Camión Mediano</option>
      <option>Camión Grande</option>
    </select>

    <label htmlFor="carga">Tipo de Carga</label>
    <select id="carga">
      <option>Todos</option>
      <option>General</option>
      <option>Refrigerada</option>
      <option>Peligrosa</option>
    </select>

    <label htmlFor="zona">Zona de Viaje</label>
    <select id="zona">
      <option>Todas</option>
      <option>AMBA</option>
      <option>BsAs-Rosario</option>
    </select>

    <label htmlFor="fecha">Fecha de vigencia</label>
    <input type="date"></input>

    <label htmlFor="ordenar">Ordenar segun</label>
    <select id="ordenar">
    <option></option>
          <option>ID</option>
          <option>Zona</option>
          <option>Vehículo</option>
          <option>Costo Base</option>
          <option>Adicionales</option>
          <option>Total</option>
    </select>
  </section>
);

export default Filtros;
