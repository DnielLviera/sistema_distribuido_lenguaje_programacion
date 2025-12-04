# Sistema Distribuido – Plataforma de Inventario

Proyecto académico basado en un sistema distribuido compuesto por 3 microservicios
desarrollados en diferentes lenguajes y tecnologías, los cuales trabajan en conjunto
para gestionar autenticación de usuarios e inventario de productos.


# Arquitectura del Sistema

El sistema está compuesto por los siguientes microservicios:

# Auth Service – FastAPI (Python)
Servicio encargado de la *gestión de usuarios y autenticación*.

Responsabilidades:

- Registro de usuarios
- Inicio de sesión (login)
- Generación de tokens JWT
- Envío de correos electrónicos de verificación
- Encriptación de contraseñas usando **bcrypt**
- Persistencia de usuarios mediante **SQLAlchemy**

Tecnologías:

- Python
- FastAPI
- SQLAlchemy
- Bcrypt
- PyJWT
- pymail
- PostgreSQL


# Inventory Service – Rust
Servicio encargado de la gestión del inventario.

Responsabilidades:

- Administración del inventario
- Control de stock
- Registro de movimientos
- Consulta de disponibilidad de productos

Tecnologías:

- Rust
- Actix/Web o framework HTTP equivalente
- JSON REST API


# Product Service – Laravel (PHP)
Servicio responsable del CRUD de productos.

Responsabilidades:

- Crear productos
- Consultar listado de productos
- Editar productos
- Eliminar productos

Tecnologías:

- PHP
- Laravel
- MySQL / PostgreSQL
- REST API


# Diagrama General

text
[ Cliente ]
     │
     ▼
[ FastAPI - Auth Service ]
     │ (valida JWT)
     ▼
[ Laravel - Product Service ] ←→ [ Rust - Inventory Service ]

#  Rutas de los Microservicios

A continuación se muestran las principales rutas expuestas por cada
microservicio junto con su propósito.

# Auth Service – FastAPI (puerto 8000)

POST /users/register
Registro de nuevos usuarios.

POST /users/login
Inicio de sesión y generación de token JWT.

POST /users/verify
Envío y verificación de correo electrónico.


# Product Service – Laravel (puerto 8002)

GET /products
Obtiene el listado de productos.

GET /products/{id}
Consulta un producto específico.

POST /products
Crea un nuevo producto.

PUT /products/{id}
Actualiza los datos de un producto existente.

DELETE /products/{id}
Elimina un producto.

# Inventory Service – Rust (puerto 8001)

GET /inventory
Consulta el inventario completo.

GET /inventory/{id}
Consulta la disponibilidad de un producto.

POST /inventory
Registra entradas o salidas de inventario.

PUT /inventory/{id}
Actualiza el stock de un producto.

