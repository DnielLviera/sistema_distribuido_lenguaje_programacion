# Inventory Management System

A modern Vue 3 frontend application for inventory management with role-based access control and multi-microservice integration.

## Features

- **Authentication System**: Registration, login, and email verification with random codes
- **Role-Based Access**: Two user types - Manager (full control) and Checker (view-only)
- **Protected Routes**: Vue Router guards for authenticated and role-specific pages
- **Inventory Management**: 
  - Managers can create, update, delete products and adjust stock
  - Checkers can view inventory and stock levels
- **Global API Configuration**: Centralized configuration for all three microservices
- **Modern UI**: Dark theme with Tailwind CSS

## Project Structure

\`\`\`
src/
├── config/
│   └── api.ts                 # Global API configuration
├── stores/
│   ├── auth.ts               # Authentication store (Pinia)
│   └── inventory.ts          # Inventory store (Pinia)
├── router/
│   └── index.ts              # Vue Router configuration with guards
├── pages/
│   ├── LoginPage.vue
│   ├── RegisterPage.vue
│   ├── VerifyEmailPage.vue
│   ├── ManagerDashboard.vue
│   ├── CheckerDashboard.vue
│   ├── ProductsPage.vue
│   └── NotFoundPage.vue
├── App.vue
├── main.ts
└── style.css
\`\`\`

## Installation

1. **Clone the repository** (or create from this template)
2. **Install dependencies**:
   \`\`\`bash
   npm install
   \`\`\`

3. **Configure API Base URL**:
   Create a `.env` file in the root directory:
   \`\`\`
   VITE_API_BASE_URL=http://your-api-url:3000
   \`\`\`

4. **Start the development server**:
   \`\`\`bash
   npm run dev
   \`\`\`

5. **Build for production**:
   \`\`\`bash
   npm run build
   \`\`\`

## API Integration

### Microservice 1: Stock Management
\`\`\`
GET  /GET /inventory
GET  /GET /inventory/{product_id}
POST /POST /inventory/{product_id}/increase
POST /POST /inventory/{product_id}/decrease
\`\`\`

### Microservice 2: Authentication
\`\`\`
POST /users/registro        (Register with email verification)
POST /users/login           (Login)
POST /users/verify          (Email verification with code)
\`\`\`

### Microservice 3: Product Management
\`\`\`
GET    /api/products
POST   /api/products
GET    /api/products/{id}
PUT    /api/products/{id}
PATCH  /api/products/{id}
DELETE /api/products/{id}
\`\`\`

## Configuration

All API endpoints are configured in `src/config/api.ts`. The `API_CONFIG` object contains all three microservice endpoints. Modify the base URL in `.env` to point to your actual API server.

## User Roles

- **Manager**: Can view dashboard, manage products (CRUD), and adjust stock levels
- **Checker**: Can view inventory, search products, and check stock levels (read-only)

## Route Protection

Routes are protected using Vue Router guards:
- Authentication is required for dashboard pages
- Role-based access control ensures managers can only access manager dashboard
- Unverified emails redirect to verification page

## Technologies

- **Vue 3**: Composition API
- **Pinia**: State management
- **Vue Router 4**: Client-side routing
- **Axios**: HTTP client
- **Tailwind CSS**: Styling
- **TypeScript**: Type safety
- **Vite**: Build tool

## License

MIT
