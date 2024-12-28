# Proyecto API con Docker, Prisma y Jest para el reto de Guros

Este proyecto es una API que usa Docker para contenerizar la aplicación, Prisma para interactuar con una base de datos PostgreSQL, y Jest para las pruebas. A continuación, se encuentran las instrucciones para configurar y ejecutar el proyecto, así como para ejecutar las pruebas.

## Requisitos

Asegúrate de tener instalados los siguientes programas en tu sistema:

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/)
- [Node.js](https://nodejs.org/) (para desarrollo y pruebas locales si no usas contenedores)
- [npm](https://www.npmjs.com/) (gestor de paquetes de Node.js)

## Configuración del proyecto

### 1. Clonar el repositorio

Clona este repositorio en tu máquina local:

```bash
git clone https://github.com/xFerchoVJ/challenge-guros/tree/master
```
```bash
cd challenge-guros
```

### 2. Crear el archivo .env

Copia el archivo .env.example a un nuevo archivo .env:

```bash
cp .env.example .env
```

Edita el archivo .env con los valores correctos para tu entorno. Asegúrate de configurar correctamente las credenciales de la base de datos y otros parámetros de entorno

### 3. Construir y ejecutar los contenedores
Asegúrate de que Docker y Docker Compose estén instalados y corriendo en tu máquina. Luego, ejecuta el siguiente comando para construir las imágenes y levantar los contenedores:

```bash
docker-compose up -d --build
```

### 4. Accede a la API
http://localhost:{puerto}/api/v1
