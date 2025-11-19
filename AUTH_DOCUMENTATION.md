# Arquitectura de Autenticación - NexusFlow

Sistema completo de autenticación implementado con **Passport.js** (sesiones) para vistas web y **JWT** para API REST.

---

## Características Implementadas

### Autenticación Web (Passport + Sesiones)
- Login con email/username y contraseña
- Registro de nuevos usuarios
- Sesiones persistentes con MongoDB
- Middleware de protección de rutas
- Flash messages para errores/éxitos
- Logout seguro
- Hash de contraseñas con bcrypt

### API REST (JWT)
- Endpoint de login que devuelve token JWT
- Endpoint de registro con token
- Middleware de validación de tokens
- Protección de rutas API
- Validación de roles
- Endpoints de perfil y cambio de contraseña

### Seguridad
- Contraseñas hasheadas con bcrypt (10 rounds)
- Tokens JWT firmados con secret
- Sesiones encriptadas
- Validación de campos
- Protección CSRF (cookies httpOnly)

---

## Instalación y Configuración

### 1. Instalar Dependencias

Las dependencias ya fueron instaladas:
```bash
npm install
```

Dependencias nuevas agregadas:
- `bcrypt` - Hash de contraseñas
- `passport` - Autenticación
- `passport-local` - Estrategia local
- `jsonwebtoken` - Tokens JWT
- `express-session` - Manejo de sesiones
- `connect-mongo` - Almacenamiento de sesiones en MongoDB
- `connect-flash` - Mensajes flash

### 2. Configurar Variables de Entorno

Agrega en el archivo `.env` las nuevas variables:
```env
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_clickwave2025
SESSION_SECRET=your_super_secret_session_key_change_this_in_production_clickwave2025
```

**IMPORTANTE**: En producción, cambia estos secrets por valores aleatorios y seguros.

### 3. Inicializar Base de Datos

Ejecuta el script de seed para crear roles y usuarios de prueba:

```bash
node seed.js
```

Esto creará:
- **Roles**: admin, manager, user
- **Usuario Admin**:
  - Email: `admin@clickwave.com`
  - Password: `admin123`
- **Usuario Test**:
  - Email: `test@clickwave.com`
  - Password: `test123`

---

## Iniciar la Aplicación

```bash
npm run dev
```

El servidor inicia en `http://localhost:4000`

---

## Uso de Autenticación Web

### Login
1. Ir a `http://localhost:4000/`
2. Ingresar email/username y contraseña
3. Redirige al dashboard

### Creación de Usuarios
**IMPORTANTE:** Solo los administradores pueden crear usuarios a través de:
1. **Crear Usuario Directo**: `/users/new` - Formulario completo de usuario
2. **Crear Empleado**: `/employees/new` - Crea automáticamente el usuario asociado

**No hay registro público.** La creación de usuarios está restringida a administradores autenticados.

### Rutas Protegidas
Todas las rutas de administración ahora requieren autenticación:
- `/admin/dashboard`
- `/clients`, `/projects`, `/employees`, etc.
- `/profile` - Perfil de usuario

### Logout
- Enlace en el dashboard: `http://localhost:4000/logout`

---

## Uso de API REST (JWT)

### 1. Login y Obtener Token

```bash
POST http://localhost:4000/api/auth/login
Content-Type: application/json

{
  "email": "admin@clickwave.com",
  "password": "admin123"
}
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Login exitoso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "username": "admin",
    "email": "admin@clickwave.com",
    "role": "admin"
  }
}
```

### 2. Usar el Token en Peticiones

```bash
GET http://localhost:4000/api/auth/profile
Authorization: Bearer <TU_TOKEN_AQUI>
```

### 3. Registro vía API

```bash
POST http://localhost:4000/api/auth/register
Content-Type: application/json

{
  "username": "nuevouser",
  "email": "nuevo@clickwave.com",
  "password": "password123"
}
```

### 4. Endpoints API Disponibles

#### Públicos (no requieren token)
- `POST /api/auth/login` - Login

#### Protegidos (requieren token JWT)
- `GET /api/auth/validate` - Validar token
- `GET /api/auth/profile` - Obtener perfil
- `PUT /api/auth/profile` - Actualizar perfil
- `PUT /api/auth/change-password` - Cambiar contraseña

#### Ejemplo con rol específico
- `GET /api/auth/admin-only` - Solo administradores

---

## Estructura de Archivos Creados/Modificados

```
src/
├── config/
│   ├── passport.js          NUEVO - Configuración de Passport
│   └── jwtMiddleware.js     NUEVO - Middleware JWT
│
├── controllers/
│   ├── AuthController.js    NUEVO - Controlador auth web
│   └── ApiAuthController.js NUEVO - Controlador auth API
│
├── middleware/
│   └── authMiddleware.js    NUEVO - Middlewares de autenticación
│
├── models/
│   └── UserModel.js         MODIFICADO - Hash de contraseñas
│
├── routes/
│   ├── auth-routes.js       NUEVO - Rutas web de auth
│   └── api-auth-routes.js   NUEVO - Rutas API de auth
│
└── app.js                   MODIFICADO - Sesiones y Passport

views/
├── index.pug               MODIFICADO - Login actualizado
├── register.pug            NUEVO - Registro
├── profile.pug             NUEVO - Perfil de usuario
├── error403.pug            NUEVO - Acceso denegado
└── admin.pug               MODIFICADO - Info usuario + logout

.env                        MODIFICADO - Secrets agregados
seed.js                     NUEVO - Script de inicialización
```

---

## Protección de Rutas

### Rutas Web (Sesiones)

Todas las rutas de vistas ahora usan el middleware `isAuthenticated`:

```javascript
import { isAuthenticated, hasRole } from './middleware/authMiddleware.js';

// Ruta protegida simple
app.get('/clients', isAuthenticated, ClientController.getAllView);

// Ruta protegida por rol
app.get('/admin/settings', isAuthenticated, hasRole('admin'), ...);
```

### Rutas API (JWT)

Para proteger rutas de API, importa el middleware:

```javascript
import { requireToken, requireRole } from './config/jwtMiddleware.js';

// En tus archivos de rutas API
router.get('/api/clientes', requireToken, ...);
router.delete('/api/users/:id', requireToken, requireRole('admin'), ...);
```

---

## Probar la Implementación

### Con el Navegador
1. Abrir `http://localhost:4000`
2. Iniciar sesión con `admin@clickwave.com` / `admin123`
3. Navegar por el dashboard
4. Visitar `/profile`
5. Cierrar sesión

### Con Postman/Thunder Client

**Colección de Pruebas:**

1. **Login**
   ```
   POST http://localhost:4000/api/auth/login
   Body: { "email": "admin@clickwave.com", "password": "admin123" }
   ```

2. **Obtener Perfil** (copia el token del paso anterior)
   ```
   GET http://localhost:4000/api/auth/profile
   Headers: Authorization: Bearer <TOKEN>
   ```

3. **Validar Token**
   ```
   GET http://localhost:4000/api/auth/validate
   Headers: Authorization: Bearer <TOKEN>
   ```

---

## Flujo de Autenticación

### Flujo Web (Passport)
```
Usuario → Login Form → POST /login 
  → Passport verifica credenciales
  → Crea sesión en MongoDB
  → Serializa usuario
  → Redirige a /admin/dashboard
```

### Flujo API (JWT)
```
Cliente → POST /api/auth/login
  → Verifica credenciales
  → Genera token JWT
  → Devuelve token
  
Cliente → GET /api/... (con token en header)
  → Middleware verifica token
  → Adjunta usuario a req.user
  → Continúa a la ruta
```

---

## Personalización

### Agregar Campos al Usuario
Modifica `src/models/UserModel.js`:
```javascript
const userSchema = new mongoose.Schema({
  // ... campos existentes
  phone: { type: String },
  avatar: { type: String },
  // ...
});
```

### Cambiar Tiempo de Expiración del Token
En `src/config/jwtMiddleware.js`:
```javascript
export const generateToken = (userId, expiresIn = '30d') => {
  // Cambia '7d' a '30d', '1h', etc.
};
```

### Agregar Permisos Granulares
En `src/middleware/authMiddleware.js`:
```javascript
export const hasPermission = (permission) => {
  return (req, res, next) => {
    if (req.user.permissions.includes(permission)) {
      return next();
    }
    res.status(403).render('error403', { ... });
  };
};
```

---

## Notas Importantes

1. **Sesiones vs JWT**: 
   - Usa sesiones (Passport) para vistas web renderizadas
   - Usa JWT para APIs consumidas por apps móviles/SPA

2. **Seguridad**:
   - Los tokens JWT no se pueden revocar fácilmente
   - Las sesiones se pueden eliminar del lado del servidor
   - Considera implementar refresh tokens en producción

3. **Producción**:
   - Usa HTTPS siempre
   - Cambia los secrets en `.env`
   - Configura `secure: true` en las cookies de sesión
   - Implementa rate limiting
   - Considera agregar 2FA

---

## Troubleshooting

### Error: "JsonWebTokenError: invalid token"
- Verifica que el token esté en el formato correcto: `Bearer <token>`
- Asegúrate de que `JWT_SECRET` sea el mismo entre peticiones

### Error: "Session not found"
- Verifica que MongoDB esté corriendo
- Revisa la conexión en `MONGO_URI_ATLAS`
- Limpia las sesiones viejas en la colección `sessions`

### No redirige después del login
- Verifica que Passport esté configurado correctamente
- Revisa los middlewares en `app.js`
- Comprueba que las sesiones estén habilitadas

---

## Recursos Adicionales

- [Passport.js Documentation](http://www.passportjs.org/)
- [JWT.io](https://jwt.io/)
- [Express Sessions](https://github.com/expressjs/session)
- [Bcrypt Documentation](https://github.com/kelektiv/node.bcrypt.js)


