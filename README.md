# Guía de instalación

Los repositorios con el código fuente se pueden encontrar en:

- Backend: [HealthAxis-Backend](https://github.com/bigfoot-888/HealthAxis-Backend)
- Frontend: [HealthAxis-Frontend](https://github.com/bigfoot-888/HealthAxis-Frontend)

## 1. Requisitos previos

El sistema ha sido probado en un entorno con:

- Node.js
- npm
- PostgreSQL
- Redis

Antes de ejecutar el proyecto, es necesario tener PostgreSQL y Redis instalados y en ejecución.

- Node.js: https://nodejs.org/
- PostgreSQL: https://www.postgresql.org/download/
- Redis: https://redis.io/downloads/

## 2. Clonado de repositorios

Crea una carpeta donde almacenar el proyecto y ejecuta en la terminal los siguientes comandos:

```bash
git clone https://github.com/bigfoot-888/HealthAxis-Frontend.git frontend
```

```bash
git clone https://github.com/bigfoot-888/HealthAxis-Backend.git backend
```

## 3. Configuración del frontend

```bash
cd frontend
npm install
```

## 4. Ejecución del frontend

```bash
npm run dev
```

La aplicación estará disponible en:

```text
http://localhost:5173
```

## 5. Credenciales

Con los datos inicializados en el backend, utiliza las siguientes credenciales para iniciar sesión:

- Email: `david@gmail.com`
- Contraseña: `password123`
