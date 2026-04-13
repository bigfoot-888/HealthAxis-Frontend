import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // global src
      '@appointments': path.resolve(__dirname, 'src/features/appointments'),
      '@auth': path.resolve(__dirname, 'src/features/auth'),
      '@agendas': path.resolve(__dirname, 'src/features/agendas'),
      '@users': path.resolve(__dirname, 'src/features/users'),
      '@patients': path.resolve(__dirname, 'src/features/patients'),
      '@clinical-records': path.resolve(__dirname, 'src/features/clinical-records'),
      '@diagnoses': path.resolve(__dirname, 'src/features/clinical-records/diagnoses'),
      '@treatments': path.resolve(__dirname, 'src/features/clinical-records/treatments'),
      '@clinical-documents': path.resolve(__dirname, 'src/features/clinical-records/clinical-documents'),
      '@patient-flows': path.resolve(__dirname, 'src/features/patient-flows'),
      '@dashboards': path.resolve(__dirname, 'src/features/dashboards'),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})