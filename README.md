# TaskManager Pro - Solemne 2

Proyecto para la asignatura de Aplicaciones y Tecnología de la Web.
El objetivo es crear una aplicación para gestionar tareas (TaskManager Pro) usando un stack moderno.

## Integrantes
- Nicolás (Estudiante)

## Descripción
La aplicación permite administrar tareas de un equipo. Se pueden crear, editar, eliminar y listar tareas.
También tiene un Dashboard con gráficos simples para ver el progreso.

## Tecnologías Usadas
- **Backend**: Node.js con Express.
- **Base de Datos**: SQLite (se guarda en un archivo local).
- **Frontend**: Angular (versión 19).
- **Contenedores**: Docker.

## Cómo ejecutarlo

### Requisitos
Tener instalado Node.js y, si se desea usar contenedores, Docker.

### Pasos para ejecutar (Local)
1. **Backend**:
   Entra a la carpeta `backend` y ejecuta:
   ```
   npm install
   node server.js
   ```
   El servidor corre en el puerto 3000.

2. **Frontend**:
   Entra a la carpeta `frontend` y ejecuta:
   ```
   npm install
   npm start
   ```
   La app abre en el puerto 4200.

### Usando Docker
Si se desea usar Docker, solo ejecutar:
```
docker build -t taskmanager .
docker run -p 3000:3000 taskmanager
```
Y abrir `http://localhost:3000` en el navegador.

## Funcionalidades
- CRUD completo de tareas.
- Buscador y filtros por estado/prioridad.
- Cálculo automático de días restantes.
- Interfaz responsive.

Espero que les guste. Saludos!