# Jill's Sandwich — Panel de Administración

**Grupo:** Dillinger Systems  
**Integrantes:** Emiliano García · Giuliana Fragapane · Hiro Cruz  
**Trabajo Práctico Integrador** — Gestión de Desarrollo de Software · Tecnicatura en Programación (4° Semestre)

Sistema web de gestión integral para restaurantes. Permite administrar pedidos, clientes, menú, mesas y ventas desde un panel centralizado, con autenticación segura y verificación adicional para operaciones sensibles.

---

## Informe Técnico

[https://drive.google.com/file/d/15zjwHGHLNEHQWSPfXynZBopaJh3G1IA7/view?usp=drive_link](https://drive.google.com/file/d/15zjwHGHLNEHQWSPfXynZBopaJh3G1IA7/view?usp=drive_link)

---

## Demo en línea

| Recurso | URL |
|---------|-----|
| **App desplegada** | `https://proyecto-de-gestion-de-restaurante.vercel.app` |


**Repositorios:** [Frontend](https://github.com/EmiG4rcia/ProyectoDeGestionDeRestaurante-Front) · [Backend](https://github.com/EmiG4rcia/ProyectoDeGestionDeRestaurante-Back)

### Credenciales para probar la demo

| Campo | Valor |
|-------|-------|
| Usuario | `admin` |
| Contraseña | `admin1234` |
| Contraseña de ventas | `ventas1234` |

> **Contraseña de ventas:** además del login habitual, el panel solicita esta contraseña extra al acceder al módulo de **Ventas**, al **crear o eliminar pedidos** y al **dar de alta o baja clientes**. Es una segunda verificación de seguridad; el sistema la pide en un modal y emite un token temporal (15 minutos). No reemplaza la contraseña de acceso al panel.

---

## ¿Qué podés hacer en la aplicación?

| Módulo | Descripción |
|--------|-------------|
| **Dashboard** | Resumen en tiempo real: pedidos del día, pendientes, clientes, ítems del menú, estado de mesas e ítems no disponibles |
| **Pedidos** | CRUD completo, filtros por estado, flujo de estados (pendiente → confirmado → preparando → listo → entregado → cancelado) |
| **Clientes** | Alta, edición y baja de clientes registrados (requiere contraseña de ventas) |
| **Menú** | Gestión de platos con precio, categoría, descripción y disponibilidad |
| **Mesas** | Control de mesas (disponible / ocupada) y consulta de QR por mesa |
| **Ventas** | Resumen de ingresos, registro de pagos y confirmación con token secundario |

La comunicación con el servidor pasa por la API REST del backend. Usamos **Axios** con interceptores JWT para enviar los tokens de autenticación, y **TanStack Query** para cachear y sincronizar los datos. Las operaciones sensibles de ventas requieren la **doble verificación** con el `sales_token`.

---

## Ejecución local

### Requisitos previos

- [Node.js](https://nodejs.org/) ≥ 20
- [pnpm](https://pnpm.io/) ≥ 9
- Backend FastAPI corriendo en `http://127.0.0.1:8000` (ver [repositorio del backend](https://github.com/EmiG4rcia/ProyectoDeGestionDeRestaurante-Back))

### Instalación

```bash
# 1. Clonar el repositorio
git clone https://github.com/EmiG4rcia/ProyectoDeGestionDeRestaurante-Front.git
cd ProyectoDeGestionDeRestaurante-Front

# 2. Instalar dependencias
pnpm install

# 3. Configurar variables de entorno
cp .env.example .env
# Editar .env si el backend corre en otra URL

# 4. Iniciar en modo desarrollo
pnpm dev
```

La aplicación estará disponible en **http://localhost:5173**.

> Las credenciales de la demo en producción están en la sección inicial de este README. Para entorno local, usá las definidas al ejecutar `setup_db.py` en el backend (o las de demo si las configuraste igual).

### Scripts disponibles

| Comando | Descripción |
|---------|-------------|
| `pnpm dev` | Servidor de desarrollo con hot reload |
| `pnpm build` | Compila TypeScript y genera build de producción en `dist/` |
| `pnpm preview` | Previsualiza el build de producción localmente |
| `pnpm lint` | Ejecuta ESLint sobre el código fuente |

---

## Stack tecnológico

### Frontend (este repositorio)

| Tecnología | Uso |
|------------|-----|
| [React 19](https://react.dev/) | UI declarativa con componentes funcionales |
| [TypeScript](https://www.typescriptlang.org/) | Tipado estático |
| [Vite 8](https://vite.dev/) | Bundler y dev server |
| [Tailwind CSS 4](https://tailwindcss.com/) | Estilos utility-first |
| [React Router 7](https://reactrouter.com/) | Navegación SPA |
| [TanStack Query 5](https://tanstack.com/query) | Cache y sincronización de datos del servidor |
| [Axios](https://axios-http.com/) | Cliente HTTP con interceptores JWT |

### Backend (repositorio separado)

| Tecnología | Uso |
|------------|-----|
| [FastAPI](https://fastapi.tiangolo.com/) | API REST |
| [SQLAlchemy](https://www.sqlalchemy.org/) | ORM |
| JWT | Autenticación (`access_token` + `sales_token`) |

Repositorio backend: [`ProyectoDeGestionDeRestaurante-Back`](https://github.com/EmiG4rcia/ProyectoDeGestionDeRestaurante-Back) · API en producción: [`https://proyectodegestionderestaurante-back-production.up.railway.app/docs`](https://proyectodegestionderestaurante-back-production.up.railway.app/docs)

---

## Estructura del proyecto

```
src/
├── api/           # Clientes HTTP (axios) por dominio
├── auth/          # Contexto de autenticación y hooks
├── components/    # UI reutilizable (botones, modales, layout, tabla)
├── hooks/         # Custom hooks con React Query
├── pages/         # Páginas por ruta
├── routes/        # Configuración de React Router
└── types/         # Interfaces TypeScript compartidas
```

---

## Variables de entorno

| Variable | Descripción | Valor por defecto |
|----------|-------------|-------------------|
| `VITE_API_URL` | URL base de la API FastAPI | `http://127.0.0.1:8000` |

En **Vercel**, configurar `VITE_API_URL` con la URL pública del backend en Railway:

```
https://proyectodegestionderestaurante-back-production.up.railway.app
```

> Vite inyecta las variables `VITE_*` en **tiempo de compilación**. En producción, el valor debe apuntar al backend desplegado en Railway.

---

## Despliegue

### Frontend — Vercel (recomendado)

1. Conectar el repositorio en [vercel.com](https://vercel.com)
2. Framework preset: **Vite**
3. Build command: `pnpm build`
4. Output directory: `dist`
5. Agregar variable de entorno `VITE_API_URL` con la URL del backend en Railway

El archivo `vercel.json` ya incluye rewrites para el routing SPA.

**Demo en producción:** `https://proyecto-de-gestion-de-restaurante.vercel.app`

### Backend — Railway

El backend se despliega en [Railway](https://railway.com/) con deploy automático al hacer push a `main`. Configurar `CORS_ORIGINS` con la URL del frontend en Vercel.

**Demo en producción (Swagger):** `https://proyectodegestionderestaurante-back-production.up.railway.app/docs`

### CI/CD — GitHub Actions

El pipeline en `.github/workflows/` ejecuta automáticamente:

- **CI** (`ci.yml`): lint + build en cada push y PR a `main` / `master`
- **Deploy** (`deploy.yml`): deploy automático a Vercel en push a `main` / `master` (requiere secrets de Vercel)

Secrets necesarios en GitHub → Settings → Secrets and variables → Actions:

| Secret | Descripción |
|--------|-------------|
| `VERCEL_TOKEN` | Token de API de Vercel |
| `VERCEL_ORG_ID` | ID de organización en Vercel |
| `VERCEL_PROJECT_ID` | ID del proyecto en Vercel |

---

## Herramientas de IA utilizadas

Este proyecto fue desarrollado en equipo con **Desarrollo Ágil Asistido por IA** como parte del TP Integrador de Gestión de Desarrollo de Software.

| Herramienta | Rol en el proyecto |
|-------------|-------------------|
| **Claude** (chat web Pro) | Generación del código frontend: estructura, componentes, hooks, integración con la API y estilos |
| **Cursor** | Documentación, organización del repositorio, CI/CD y preparación para despliegue |

---

## Repositorios relacionados

| Repo | Enlace | Demo |
|------|--------|------|
| **Frontend** (este repo) | [ProyectoDeGestionDeRestaurante-Front](https://github.com/EmiG4rcia/ProyectoDeGestionDeRestaurante-Front) | `https://proyecto-de-gestion-de-restaurante.vercel.app` |
| **Backend** | [ProyectoDeGestionDeRestaurante-Back](https://github.com/EmiG4rcia/ProyectoDeGestionDeRestaurante-Back) | `https://proyectodegestionderestaurante-back-production.up.railway.app/docs` |

---

## Licencia

Este proyecto es de código abierto con fines académicos.
