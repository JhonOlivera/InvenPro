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
- Angular
- TypeScript
## ✨ Funcionalidades
 
- [x] Gestión de categorías de productos
- [x] Gestión de proveedores
- [x] Gestión de productos (con relación a categoría y proveedor)
- [x] Alertas de stock bajo
- [ ] Gestión de usuarios con roles (Admin / Empleado)
- [ ] Movimientos de inventario (entradas / salidas)
- [ ] Frontend en Angular
## 📁 Estructura del proyecto
 
```
InvenPro/
├── invenpro-backend/     # API REST con Spring Boot
│   └── src/main/java/com/invenpro/invenpro_backend/
│       ├── controller/   # Endpoints REST
│       ├── service/      # Lógica de negocio
│       ├── repository/   # Acceso a datos (JPA)
│       ├── model/entity/ # Entidades JPA
│       ├── dto/          # Objetos de transferencia
│       └── mapper/       # Conversión Entity <-> DTO
└── invenpro-frontend/    # Cliente Angular (próximamente)
```
 
## ⚙️ Instalación y ejecución
 
### Requisitos previos
 
- Java 25
- Maven 3.9+
- MySQL Server 8+
- Node.js 20+ y Angular CLI (para el frontend)
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
 
   El backend quedará disponible en `http://localhost:8080`.
 
## 🔌 Endpoints disponibles
 
### Categorías
| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/api/categorias` | Listar todas |
| GET | `/api/categorias/{id}` | Buscar por id |
| POST | `/api/categorias` | Crear |
| PUT | `/api/categorias/{id}` | Actualizar |
| DELETE | `/api/categorias/{id}` | Eliminar |
 
### Proveedores
| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/api/proveedores` | Listar todos |
| GET | `/api/proveedores/{id}` | Buscar por id |
| POST | `/api/proveedores` | Crear |
| PUT | `/api/proveedores/{id}` | Actualizar |
| DELETE | `/api/proveedores/{id}` | Eliminar |
 
### Productos
| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/api/productos` | Listar todos |
| GET | `/api/productos/{id}` | Buscar por id |
| POST | `/api/productos` | Crear |
| PUT | `/api/productos/{id}` | Actualizar |
| DELETE | `/api/productos/{id}` | Eliminar |
| GET | `/api/productos/stock-bajo` | Productos con stock por debajo del mínimo |
 
## 🌱 Flujo de trabajo Git
 
Este proyecto sigue buenas prácticas de control de versiones:
 
- Una rama por funcionalidad (`feature/nombre-corto`)
- Commits siguiendo [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `chore:`, `refactor:`, `docs:`)
- Pull Request obligatorio antes de mergear a `main`
## 👤 Autor
 
**Jhon Edwin Olivera Duarte**
Estudiante de Ingeniería de Sistemas — Universidad de Ibagué
[GitHub](https://github.com/JhonOlivera) · [LinkedIn](https://linkedin.com/in/jhon-edwin-olivera-duarte-25a05b344)

