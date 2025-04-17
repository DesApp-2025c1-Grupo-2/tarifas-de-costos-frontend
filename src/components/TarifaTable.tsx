import React from 'react';

const TarifaTable: React.FC = () => (
  <section className="card">
    <h3>Tarifas de Costo</h3>
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Zona</th>
          <th>Vehículo</th>
          <th>Costo Base</th>
          <th>Adicionales</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>TC-001</td>
          <td>AMBA</td>
          <td>Camión Mediano</td>
          <td>$45,000</td>
          <td>$5,000</td>
          <td>$50,000</td>
        </tr>
        <tr>
          <td>TC-052</td>
          <td>BsAs-Rosario</td>
          <td>Camión Grande</td>
          <td>$95,000</td>
          <td>$8,000</td>
          <td>$103,000</td>
        </tr>
      </tbody>
    </table>
  </section>
);

export default TarifaTable;