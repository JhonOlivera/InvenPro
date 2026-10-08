# InvenPro
 
Sistema de gestión de inventario desarrollado con Spring Boot, Angular y MySQL.
 
## 📋 Descripción
 
InvenPro es una aplicación fullstack para la gestión de inventario, que permite administrar productos, categorías, proveedores, movimientos de stock y usuarios con distintos niveles de acceso.
 
## 🚀 Tecnologías
 
**Backend**
- Java 25
- Spring Boot 4.1.1
- Spring Data JPA
- Spring Security
- MySQL
- Lombok
- Maven
**Frontend**
- Angular 21 (standalone components, signals, control flow `@if`/`@for`)
- TypeScript
## ✨ Funcionalidades

- [x] Gestión de categorías de productos
- [x] Gestión de proveedores
- [x] Gestión de productos (con relación a categoría y proveedor)
- [x] Alertas de stock bajo
- [x] Gestión de usuarios con roles (Admin / Empleado)
- [x] Movimientos de inventario (entradas / salidas)
- [x] Frontend en Angular (CRUD completo de las 5 entidades + dashboard)
## 📁 Estructura del proyecto

```
InvenPro/
├── invenpro-backend/      # API REST con Spring Boot
│   └── src/main/java/com/invenpro/invenpro_backend/
│       ├── controller/    # Endpoints REST
│       ├── service/       # Lógica de negocio
│       ├── repository/    # Acceso a datos (JPA)
│       ├── model/entity/  # Entidades JPA
│       ├── dto/           # Objetos de transferencia
│       └── mapper/        # Conversión Entity <-> DTO
└── invenpro-frontend/     # Cliente Angular
    └── src/app/
        ├── core/shell/    # Shell, AuthService, guards (auth/admin), interceptor
        ├── shared/        # Modelos, servicios y componentes reutilizables
        └── features/      # Un directorio por entidad: list, form y service
```

## ⚙️ Instalación y ejecución

### Requisitos previos

- Java 25
- Maven 3.9+
- MySQL Server 8+
- Node.js 20+ y Angular CLI 21 (para el frontend)

### Backend

1. Clona el repositorio:
```bash
   git clone https://github.com/JhonOlivera/InvenPro.git
   cd InvenPro/invenpro-backend
```

2. Crea la base de datos en MySQL:
```sql
   CREATE DATABASE IF NOT EXISTS invenpro
     CHARACTER SET utf8mb4
     COLLATE utf8mb4_unicode_ci;
```

3. Configura tus credenciales en `src/main/resources/application.properties`:
```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/invenpro
   spring.datasource.username=root
   spring.datasource.password=TU_PASSWORD
```

4. Ejecuta el proyecto:
```bash
   ./mvnw spring-boot:run
```

   El backend quedará disponible en `http://localhost:8080`. En el primer arranque se crea automáticamente un usuario ADMIN de prueba:

   ```
   email: admin@invenpro.com
   password: admin123
   ```

### Frontend

El backend solo permite CORS desde `http://localhost:4200`, así que el frontend **debe** levantarse en ese puerto exacto.

1. Instala las dependencias:
```bash
   cd InvenPro/invenpro-frontend
   npm install
```

2. (Opcional) Revisa la URL de la API en `src/environments/environment.ts` — por defecto apunta a `http://localhost:8080/api`.

3. Ejecuta el servidor de desarrollo:
```bash
   ng serve --port 4200
```

   La aplicación quedará disponible en `http://localhost:4200`. Inicia sesión con el usuario ADMIN de prueba (o el que hayas creado) — la autenticación es HTTP Basic, sin tokens ni refresh.

4. Antes de dar por cerrado cualquier cambio en el frontend, verifica que compile:
```bash
   ng build
```

## 🔌 Endpoints disponibles

### Autenticación — `/api/auth` (HTTP Basic)
| Método | Endpoint | Descripción | Rol |
|---|---|---|---|
| GET | `/api/auth/me` | Datos del usuario autenticado (nombre, email, rol) | Cualquiera autenticado |

### Categorías — `/api/categorias`
| Método | Endpoint | Descripción | Rol |
|---|---|---|---|
| GET | `/api/categorias` | Listar todas | Cualquiera autenticado |
| GET | `/api/categorias/{id}` | Buscar por id | Cualquiera autenticado |
| POST | `/api/categorias` | Crear | Cualquiera autenticado |
| PUT | `/api/categorias/{id}` | Actualizar | Cualquiera autenticado |
| DELETE | `/api/categorias/{id}` | Eliminar (409 si tiene productos asociados) | Cualquiera autenticado |

### Proveedores — `/api/proveedores`
| Método | Endpoint | Descripción | Rol |
|---|---|---|---|
| GET | `/api/proveedores` | Listar todos | Cualquiera autenticado |
| GET | `/api/proveedores/{id}` | Buscar por id | Cualquiera autenticado |
| POST | `/api/proveedores` | Crear | Cualquiera autenticado |
| PUT | `/api/proveedores/{id}` | Actualizar | Cualquiera autenticado |
| DELETE | `/api/proveedores/{id}` | Eliminar (409 si tiene productos asociados) | Cualquiera autenticado |

### Productos — `/api/productos`
| Método | Endpoint | Descripción | Rol |
|---|---|---|---|
| GET | `/api/productos` | Listar todos | Cualquiera autenticado |
| GET | `/api/productos/paginado?pagina=&tamano=` | Listado paginado (no usado aún por el frontend) | Cualquiera autenticado |
| GET | `/api/productos/{id}` | Buscar por id | Cualquiera autenticado |
| POST | `/api/productos` | Crear | Cualquiera autenticado |
| PUT | `/api/productos/{id}` | Actualizar | Cualquiera autenticado |
| DELETE | `/api/productos/{id}` | Eliminar | Cualquiera autenticado |
| GET | `/api/productos/stock-bajo` | Productos con stock ≤ stock mínimo | Cualquiera autenticado |

### Movimientos de inventario — `/api/movimientos`
| Método | Endpoint | Descripción | Rol |
|---|---|---|---|
| GET | `/api/movimientos` | Listar todos | Cualquiera autenticado |
| GET | `/api/movimientos/producto/{productoId}` | Historial de un producto | Cualquiera autenticado |
| POST | `/api/movimientos` | Registrar ENTRADA/SALIDA (ajusta el stock del producto; 409 si la SALIDA deja stock negativo) | Cualquiera autenticado |

No hay `PUT`/`DELETE`: es un registro de auditoría inmutable por diseño.

### Usuarios — `/api/usuarios`
| Método | Endpoint | Descripción | Rol |
|---|---|---|---|
| GET | `/api/usuarios` | Listar todos | **ADMIN** |
| GET | `/api/usuarios/{id}` | Buscar por id | **ADMIN** |
| POST | `/api/usuarios` | Crear (password obligatoria, ≥ 6 caracteres) | **ADMIN** |
| PUT | `/api/usuarios/{id}` | Actualizar (password opcional: vacía = no cambiarla) | **ADMIN** |
| DELETE | `/api/usuarios/{id}` | Eliminar | **ADMIN** |

Todos los demás endpoints solo exigen una sesión autenticada (`EMPLEADO` o `ADMIN`); el frontend oculta y bloquea la sección de Usuarios para quien no sea ADMIN, pero la regla real la impone `@PreAuthorize("hasRole('ADMIN')")` en el backend.

## 🚧 Pendientes / mejoras futuras

- **Sin tests automatizados** (unit ni e2e) en frontend ni backend.
- El frontend no usa aún `/api/productos/paginado`; la lista de productos carga todo con `GET /api/productos`. Si el catálogo crece mucho, migrar a paginación real.
- `/api/movimientos` no pagina ni ordena — el frontend pide todo y ordena/recorta en el cliente (dashboard y lista). Con mucho volumen, convendría un endpoint paginado/ordenado en el backend.
- El interceptor del frontend solo reacciona a `401` (sesión inválida → logout + redirect a `/login`). Un `403` (rol insuficiente) se muestra como error genérico en el componente en vez de una redirección dedicada.
- Un ADMIN puede quitarse a sí mismo el rol ADMIN desde el formulario de edición (sí está protegido no poder *eliminarse* a sí mismo, pero no degradarse de rol).
- `SecurityConfig` permite CORS desde `http://localhost:4200` y también `http://localhost:62885` — este segundo origen parece residuo de pruebas de una sesión anterior; revisar si sigue siendo necesario.
- Sin manejo de concurrencia optimista: si dos personas editan el mismo producto o registran movimientos a la vez, gana el último `save()`.
- Sin recuperación de contraseña propia; solo un ADMIN puede cambiar la contraseña de otro usuario desde el CRUD.

## 🌱 Flujo de trabajo Git
 
Este proyecto sigue buenas prácticas de control de versiones:
 
- Una rama por funcionalidad (`feature/nombre-corto`)
- Commits siguiendo [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `chore:`, `refactor:`, `docs:`)
- Pull Request obligatorio antes de mergear a `main`
## 👤 Autor
 
**Jhon Edwin Olivera Duarte**
Estudiante de Ingeniería de Sistemas — Universidad de Ibagué
[GitHub](https://github.com/JhonOlivera) · [LinkedIn](https://linkedin.com/in/jhon-edwin-olivera-duarte-25a05b344)

