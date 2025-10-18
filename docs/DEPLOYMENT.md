# 📦 Guía de Despliegue - VisionText AI

Esta guía detalla paso a paso cómo desplegar VisionText AI en AWS Elastic Beanstalk.

---

## 📋 Requisitos Previos

### 1. Cuenta AWS
- Crear cuenta en [aws.amazon.com](https://aws.amazon.com)
- Activar capa gratuita (Free Tier) si es nueva

### 2. Credenciales IAM
- Ir a AWS Console → IAM → Users
- Crear usuario con permisos:
  - `AWSElasticBeanstalkFullAccess`
  - `AmazonS3FullAccess` (opcional)
- Descargar Access Key ID y Secret Access Key

### 3. Herramientas locales
```bash
# Instalar AWS CLI
pip install awscli

# Instalar EB CLI
pip install awsebcli

# Verificar instalación
aws --version
eb --version
```

---

## 🚀 Despliegue Backend (Elastic Beanstalk)

### Paso 1: Configurar AWS CLI

```bash
aws configure
```

Ingresar:
- **AWS Access Key ID**: `[TU_ACCESS_KEY]`
- **AWS Secret Access Key**: `[TU_SECRET_KEY]`
- **Default region name**: `us-east-1`
- **Default output format**: `json`

### Paso 2: Preparar código backend

```bash
cd backend

# Verificar que existen estos archivos:
ls application.py requirements.txt Procfile runtime.txt .ebextensions/
```

### Paso 3: Inicializar Elastic Beanstalk

```bash
eb init

# Responder:
# - Select a default region: us-east-1 (N. Virginia)
# - Application name: visiontext-ai
# - Platform: Python
# - Platform version: Python 3.11
# - Do you want to set up SSH: No (opcional: Yes para debugging)
```

### Paso 4: Crear entorno

```bash
eb create visiontext-env \
  --instance-type t2.micro \
  --platform "python-3.11" \
  --region us-east-1
```

**Nota**: Este proceso toma 5-10 minutos.

### Paso 5: Configurar variables de entorno (opcional)

```bash
eb setenv \
  AWS_REGION=us-east-1 \
  LOG_LEVEL=INFO
```

### Paso 6: Desplegar

```bash
# Primera vez
eb deploy

# Actualizaciones posteriores
eb deploy
```

### Paso 7: Verificar despliegue

```bash
# Ver estado
eb status

# Ver logs en tiempo real
eb logs --stream

# Abrir en navegador
eb open
```

**URL del backend**: `http://visiontext-env.XXXXX.us-east-1.elasticbeanstalk.com`

---

## 🎨 Despliegue Frontend (Vercel)

### Opción A: Deploy automático con Vercel

```bash
cd frontend

# Instalar Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Seguir instrucciones interactivas:
# - Set up and deploy? Yes
# - Which scope? [Tu cuenta]
# - Link to existing project? No
# - Project name: visiontext-ai-frontend
# - Directory: ./
# - Override settings? No
```

### Configurar variable de entorno en Vercel

1. Ir a [vercel.com/dashboard](https://vercel.com/dashboard)
2. Seleccionar proyecto `visiontext-ai-frontend`
3. Settings → Environment Variables
4. Agregar:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://visiontext-env.XXXXX.us-east-1.elasticbeanstalk.com`
5. Redeploy: `vercel --prod`

### Opción B: Deploy en S3 + CloudFront

```bash
cd frontend

# Build de producción
npm run build

# Instalar AWS CLI si no lo tienes
pip install awscli

# Crear bucket S3
aws s3 mb s3://visiontext-ai-frontend

# Configurar como sitio web
aws s3 website s3://visiontext-ai-frontend \
  --index-document index.html \
  --error-document index.html

# Subir archivos
aws s3 sync dist/ s3://visiontext-ai-frontend --acl public-read

# Configurar política pública
aws s3api put-bucket-policy \
  --bucket visiontext-ai-frontend \
  --policy file://bucket-policy.json
```

**bucket-policy.json**:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::visiontext-ai-frontend/*"
    }
  ]
}
```

**URL del frontend**: `http://visiontext-ai-frontend.s3-website-us-east-1.amazonaws.com`

---

## 🔧 Troubleshooting Común

### Error: "Health status is Severe"

```bash
# Ver logs
eb logs

# Verificar instalación de Tesseract
eb ssh
sudo yum list installed | grep tesseract
exit

# Redeployar
eb deploy
```

### Error: "502 Bad Gateway"

```bash
# Verificar que uvicorn está corriendo
eb ssh
ps aux | grep uvicorn

# Revisar logs
sudo tail -f /var/log/web.stdout.log
```

### Error: "Module not found" (spaCy models)

Verificar que `.ebextensions/python.config` contiene:
```yaml
commands:
  03_download_spacy_models:
    command: "python -m spacy download es_core_news_sm && python -m spacy download en_core_web_sm"
```

### Timeout al procesar archivos grandes

Aumentar timeout en `.ebextensions/python.config`:
```yaml
option_settings:
  aws:elasticbeanstalk:command:
    Timeout: 300
```

---

## 💰 Estimación de Costos (AWS Free Tier)

Para un hackathon (uso de 1-2 días):

| Servicio | Costo |
|----------|-------|
| EC2 t2.micro | Gratis (750 hrs/mes) |
| Elastic Beanstalk | Gratis |
| S3 (5 GB) | Gratis |
| Transfer de datos (15 GB) | Gratis |
| **Total estimado** | **$0.00** |

**⚠️ Importante**: Eliminar recursos después del hackathon para evitar cargos:

```bash
# Terminar entorno
eb terminate visiontext-env

# Eliminar aplicación
eb terminate --all
```

---

## 📊 Monitoreo

### Métricas en AWS Console

1. Ir a Elastic Beanstalk Console
2. Seleccionar `visiontext-env`
3. Ver métricas:
   - CPU Utilization
   - Request Count
   - Response Time
   - Health Status

### Logs

```bash
# Stream en tiempo real
eb logs --stream

# Descargar logs
eb logs --zip

# Logs de aplicación
eb ssh
sudo tail -f /var/log/web.stdout.log
```

---

## 🔄 Actualización y Rollback

### Actualizar código

```bash
# Hacer cambios en el código
git add .
git commit -m "Update feature X"

# Deploy
eb deploy
```

### Rollback a versión anterior

```bash
# Listar versiones
aws elasticbeanstalk describe-application-versions \
  --application-name visiontext-ai

# Hacer rollback
eb deploy --version <version-label>
```

---

## ✅ Checklist Pre-Presentación

- [ ] Backend desplegado y accesible
- [ ] Frontend desplegado y conectado al backend
- [ ] Probar endpoint `/health` responde 200
- [ ] Probar subida de PDF de prueba
- [ ] Probar subida de imagen de prueba
- [ ] Verificar que funciona en español e inglés
- [ ] URLs anotadas para la demo
- [ ] Screenshots de resultados preparados

---

## 📞 Comandos Útiles de Referencia

```bash
# Estado del entorno
eb status

# Abrir en navegador
eb open

# Ver logs
eb logs

# SSH al servidor
eb ssh

# Configurar variable de entorno
eb setenv KEY=VALUE

# Escalar instancias
eb scale 2

# Terminar entorno
eb terminate
```

---

¡Listo para presentar! 