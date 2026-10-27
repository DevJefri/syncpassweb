# SyncPass

React + Vite + TypeScript + Tailwind + wouter, con login y registro contra AWS Cognito (aws-amplify v6).

## Ejecutar

```bash
npm install
# completa .env con tu User Pool ID y App Client ID
npm run dev
```

Abre http://localhost:5173

## Rutas

- `/`          Home
- `/login`     Inicio de sesión (correo + contraseña)
- `/register`  Registro + confirmación con código enviado por correo

## Cognito: qué necesita el User Pool

- Inicio de sesión con **correo** (email como username/alias).
- Atributo **`name` obligatorio** (se pide en el registro y en el primer login de usuarios creados por admin).
- Un **App client público** (sin client secret) con el flujo `ALLOW_USER_SRP_AUTH` habilitado.
- Verificación de correo activada (envía el código de confirmación).
- Para tu BFF: el token se obtiene con `fetchAuthSession()` (`tokens.accessToken`) de `aws-amplify/auth`.
