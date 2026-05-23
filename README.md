= Guía de instalación

Los repositorios con el código fuente se pueden encontrar en:

- *Backend*: https://github.com/bigfoot-888/HealthAxis-Backend
- *Frontend*: https://github.com/bigfoot-888/HealthAxis-Frontend

== 1. Requisitos previos

El sistema ha sido probado en un entorno con:

- Node.js
- npm
- PostgreSQL
- Redis

Antes de ejecutar el proyecto, es necesario tener PostgreSQL y Redis instalados y en ejecución.

- *Node.js*: https://nodejs.org/
- *PostgreSQL*: https://www.postgresql.org/download/
- *Redis*: https://redis.io/downloads/

== 2. Clonado de repositorios

Crea una carpeta donde almacenar el proyecto y ejecuta en la terminal los siguientes comandos.

#figure(
```bash
git clone https://github.com/bigfoot-888/HealthAxis-Frontend.git frontend
```
)

#figure(
```bash
git clone https://github.com/bigfoot-888/HealthAxis-Backend.git backend
```
)

== 3. Configuración del frontend

#figure(
```bash
cd frontend
npm install
```
)

== 4. Ejecución del frontend

#figure(
```bash
npm run dev
```
)

La aplicación estará disponible en:

`http://localhost:5173`

== 5. Credenciales

Con los datos inicializados en el backend, utiliza las siguientes credenciales para iniciar sesión:

- *Email*: `david@gmail.com`
- *Contraseña*: `password123`
