

import { useNavigate } from "react-router-dom";
import Header from "./components/Header";

const Inicio = () => {
  const navigate = useNavigate();

  const handleGenerarTarifa = () => {
    navigate("./generar-tarifa");
  };

  return (
    <div>
      <Header />
      <main>
        <img
          src="/img/Logo.png"
          alt="Logo Acme SRL"
          className="logo-acme"
        />
        <div className="boton-contenedor">
          <button type="button" className="boton-Inicio" onClick={handleGenerarTarifa}>
              Inicio
          </button>
        </div>
      </main>
      <footer className="footer-franja"></footer>
    </div>
  );
};

export default Inicio;