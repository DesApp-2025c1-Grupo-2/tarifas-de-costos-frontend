import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default ({ mode }) => {
  // Carga las variables de entorno del archivo .env según el modo (development, production)
  const env = loadEnv(mode, process.cwd(), '');

  return defineConfig({
    plugins: [react()],
    server: {
      proxy: {
        // Redirige las peticiones que empiezan por /api
        '/api': {
          // Usa la variable cargada desde tu archivo .env
          target: env.VITE_API_BASE_URL,
          changeOrigin: true,
          secure: false,
          // Opcional: reescribe la ruta para quitar /api si tu backend no lo espera
          // rewrite: (path) => path.replace(/^/api/, ''), 
        },
      },
      host: '0.0.0.0',
      port: 8080,
    },
  });
};
