# InfoStream Argentina - Web Card Telegram

Aplicación web de noticias y análisis de contenido de Argentina, accesible vía Telegram WebApp y web remota.

## 🎯 Características

- **YouTube**: Resúmenes de videos con timestamps interactivos
- **X (Twitter)**: Timeline de tweets destacados
- **Finanzas**: Noticias financieras en tiempo real
- **Acceso dual**: Telegram WebApp + Web remota
- **Autenticación segura**: Sistema de códigos de asociación
- **Máximo 5 usuarios** por tarjeta/bot

## 🚀 Deployment en Cloudflare Pages

### Paso 1: Preparar el repositorio

```bash
cd /home/nico/Escritorio/omniii/frontends/web-telegram-asistente-infostream-argentina

# Inicializar git si no lo está
git init

# Agregar archivos
git add .
git commit -m "Initial commit: InfoStream Argentina Web Card"

# Crear repositorio en GitHub y subir
git remote add origin https://github.com/TU_USUARIO/infostream-argentina.git
git branch -M main
git push -u origin main
```

### Paso 2: Deploy en Cloudflare Pages

1. Ve a [Cloudflare Pages](https://dash.cloudflare.com/)
2. Click en "Create a project" → "Connect to Git"
3. Autoriza GitHub y selecciona el repositorio `infostream-argentina`
4. Configuración del build:
   - **Framework preset**: Vite
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
5. Variables de entorno (opcional):
   - `NODE_ENV`: `production`
6. Click en "Save and Deploy"

### Paso 3: Configurar dominio personalizado (opcional)

1. En Cloudflare Pages, ve a tu proyecto
2. Click en "Custom domains"
3. Agrega `infostream.pages.dev` o tu dominio personalizado

## 🔧 Configuración del Backend

Una vez deployado, actualiza la URL del backend en `App.tsx`:

```typescript
apiBaseUrl: 'https://api.websopen.com/api/v1', // Tu URL del backend
cardId: '29', // ID del bot en la base de datos
```

## 🤖 Configuración del Bot de Telegram

### Bot Token
```
8551698788:AAGprPLIP1nW0LUYyBZS-m76UNGI9_1SJbI
```

### Comandos del bot
```
/start - Mostrar botón de Web App o pedir código
/asociar CODIGO - Asociar usuario con código
/mis_webapps - Ver tus webapps asociadas
/help - Mostrar ayuda
```

### Configurar WebApp URL en BotFather

1. Habla con [@BotFather](https://t.me/BotFather)
2. Envía `/setmenubutton`
3. Selecciona tu bot
4. Envía la URL de tu Cloudflare Pages: `https://infostream.pages.dev`

## 📱 Flujo de Usuario

### 1. Desde el Panel Admin (web-admin)

1. Ve a **Telethon → Web** (sección de tarjetas web)
2. Selecciona la tarjeta "InfoStream Argentina"
3. Click en **"Generar Código"**
4. Se genera un código como: `OMNI-ABC12345`
5. Comparte este código con el usuario (máximo 5 usuarios)

### 2. Usuario en Telegram

1. Usuario abre el bot: `@tu_bot`
2. Envía `/start`
3. El bot responde pidiendo el código
4. Usuario envía: `/asociar OMNI-ABC12345`
5. El bot valida el código y muestra botón "🚀 Abrir InfoStream"
6. Usuario click en el botón
7. Se abre la webapp con autenticación automática

### 3. Desde la Web (opcional)

1. Usuario accede directamente a `https://infostream.pages.dev?access_token=CODIGO`
2. La webapp valida con el backend
3. Usuario accede a la aplicación

## 🔐 Seguridad

- **Validación Telegram**: initData firmado por Telegram
- **Código de asociación**: Verificado en el backend
- **Límite de usuarios**: Máximo 5 por tarjeta/bot
- **JWT tokens**: Sesiones seguras

## 🛠️ Desarrollo Local

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Build para producción
npm run build
```

### Variables de entorno locales

Crea un archivo `.env`:

```env
VITE_API_URL=http://localhost:5005/api/v1
VITE_BOT_ID=29
```

## 📊 Estructura del Proyecto

```
web-telegram-asistente-infostream-argentina/
├── components/
│   ├── BottomNav.tsx       # Navegación inferior
│   ├── YouTubeTab.tsx      # Tab de YouTube
│   ├── XTab.tsx            # Tab de Twitter/X
│   └── FinanceTab.tsx      # Tab de Finanzas
├── telegramAuth.ts         # Sistema de autenticación
├── App.tsx                 # Componente principal
├── index.html              # HTML base
├── vite.config.ts          # Configuración de Vite
└── README.md               # Este archivo
```

## 🔄 Actualizaciones

Para actualizar la webapp:

```bash
git add .
git commit -m "Update: descripción de cambios"
git push
```

Cloudflare Pages desplegará automáticamente los cambios.

## 📝 Notas Importantes

1. **Límite de usuarios**: Cada tarjeta/bot soporta máximo 5 usuarios
2. **Múltiples tarjetas**: Si necesitas más usuarios, crea más bots/tarjetas
3. **URL compartida**: Todas las tarjetas apuntan a la misma URL de Cloudflare
4. **Autenticación única**: Cada usuario tiene su propio token JWT

## 🐛 Troubleshooting

### El bot no responde

1. Verifica que el bot esté activo en el backend
2. Reinicia cerebro-core: `docker restart omniii-cerebro-core-1`
3. Verifica los logs: `docker logs omniii-cerebro-core-1 --tail 100`

### Error de autenticación en la webapp

1. Verifica que la URL del backend sea correcta en `App.tsx`
2. Verifica que el `cardId` coincida con el ID del bot en la BD
3. Abre la consola del navegador para ver errores

### Código de asociación no funciona

1. Verifica que no se hayan excedido los 5 usuarios
2. Verifica que el código no esté expirado
3. Regenera el código desde el panel admin

## 📞 Soporte

Para problemas o preguntas, contacta al administrador del sistema.

---

**Desarrollado para el sistema OMNIII**
