import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import { HeaderConMenu } from './components/Header';
import './css/App.css';
import './css/CrearTarifa.css';

const Reportes: React.FC = () => {
    const [sidebarAbierta, setSidebarAbierta] = useState(false);

    const toggleSidebar = () => {
        setSidebarAbierta(prev => !prev);
    };

    return (
        <div className="app">
            
            <HeaderConMenu onImagenClick={toggleSidebar} /> 

            
            {sidebarAbierta && <Sidebar isOpen={sidebarAbierta} toggleSidebar={toggleSidebar} />} 
            
            <div className="content-area">
                <h1>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ex est optio rerum, animi dolorum hic repellendus! Corrupti odit possimus illum labore ea nobis cum distinctio voluptatibus? Exercitationem quia dolorem quisquam?</h1>
            </div>
        </div>
    );
};

export default Reportes;