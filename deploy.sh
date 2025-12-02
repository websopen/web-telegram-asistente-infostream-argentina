#!/bin/bash

# Script de deployment para InfoStream Argentina Web Card
# Uso: ./deploy.sh

set -e

echo "🚀 InfoStream Argentina - Deployment Script"
echo "=============================================="

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Directorios
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$PROJECT_DIR"

echo ""
echo -e "${BLUE}📂 Directorio del proyecto:${NC} $PROJECT_DIR"
echo ""

# Paso 1: Verificar que estamos en un repositorio git
if [ ! -d ".git" ]; then
    echo -e "${YELLOW}⚙️  Inicializando repositorio Git...${NC}"
    git init
    echo -e "${GREEN}✅ Git inicializado${NC}"
else
    echo -e "${GREEN}✅ Repositorio Git detectado${NC}"
fi

# Paso 2: Agregar archivos
echo ""
echo -e "${BLUE}📝 Agregando archivos...${NC}"
git add .

# Paso 3: Commit
echo ""
read -p "📝 Mensaje del commit (Enter para usar mensaje por defecto): " COMMIT_MSG
if [ -z "$COMMIT_MSG" ]; then
    COMMIT_MSG="Update: $(date +%Y-%m-%d)"
fi

git commit -m "$COMMIT_MSG" || echo -e "${YELLOW}⚠️  No hay cambios para commitear${NC}"

# Paso 4: Verificar remoto
echo ""
if git remote | grep -q "origin"; then
    echo -e "${GREEN}✅ Remoto 'origin' configurado${NC}"
    REMOTE_URL=$(git remote get-url origin)
    echo -e "${BLUE}   URL: ${REMOTE_URL}${NC}"
else
    echo -e "${YELLOW}⚙️  Configurando remoto...${NC}"
    read -p "Ingresa la URL del repositorio GitHub: " REPO_URL
    git remote add origin "$REPO_URL"
    echo -e "${GREEN}✅ Remoto agregado${NC}"
fi

# Paso 5: Push
echo ""
echo -e "${BLUE}📤 Subiendo cambios a GitHub...${NC}"

# Verificar si estamos en la rama main o master
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "main" ] && [ "$CURRENT_BRANCH" != "master" ]; then
    echo -e "${YELLOW}⚙️  Cambiando a rama 'main'...${NC}"
    git branch -M main
fi

git push -u origin main || {
    echo -e "${YELLOW}⚠️  Error al hacer push. ¿Ya existe el repositorio remoto?${NC}"
    echo -e "${YELLOW}   Intentando push --force-with-lease...${NC}"
    git push --force-with-lease -u origin main
}

echo ""
echo -e "${GREEN}✅ Cambios subidos a GitHub exitosamente!${NC}"
echo ""
echo "=============================================="
echo -e "${GREEN}✅ Deployment completado!${NC}"
echo "=============================================="
echo ""
echo "📋 Próximos pasos:"
echo ""
echo "1. Ve a Cloudflare Pages: https://dash.cloudflare.com/"
echo "2. Click en 'Create a project' → 'Connect to Git'"
echo "3. Selecciona el repositorio que acabas de subir"
echo "4. Configura el build:"
echo "   - Framework preset: Vite"
echo "   - Build command: npm run build"
echo "   - Build output directory: dist"
echo "5. Click en 'Save and Deploy'"
echo ""
echo -e "${BLUE}🌐 Tu app estará disponible en:${NC} https://infostream.pages.dev"
echo ""
echo -e "${YELLOW}📝 No olvides configurar la URL en:${NC}"
echo "   - App.tsx (apiBaseUrl)"
echo "   - BotFather (Menu Button URL)"
echo ""
