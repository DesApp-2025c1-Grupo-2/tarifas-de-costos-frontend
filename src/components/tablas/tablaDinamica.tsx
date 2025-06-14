import React from "react";

interface TablaDinamicaProps<T> {
  titulo: string;
  columnas: string[];
  datos: T[];
  mensaje?: string;
  condicionVacio: string;
  renderFila: (dato: T, index: number) => React.ReactNode;
}

function TablaDinamica<T>({
  titulo,
  columnas,
  datos,
  mensaje,
  condicionVacio,
  renderFila,
}: TablaDinamicaProps<T>) {
  return (
    <div className="transportista-list">
      {mensaje && <div className="mensaje-exito">{mensaje}</div>}
      <h2>{titulo}</h2>
      {datos.length === 0 ? (
        <p>{condicionVacio}</p>
      ) : (
        <table>
          <thead>
            <tr>
              {columnas.map((col, index) => (
                <th key={index}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {datos.map((dato, index) => renderFila(dato, index))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default TablaDinamica;