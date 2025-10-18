# 🚀 VisionText AI

**Sistema de extracción de texto y análisis con IA para documentos PDF e imágenes**

Proyecto desarrollado para Hackathon 2025 | Stack: FastAPI + React + AWS

---

## 📋 Descripción

VisionText AI es una aplicación completa que permite:

- ✅ **Extraer texto** desde archivos PDF o imágenes usando **OCR (Tesseract + OpenCV)**
- ✅ **Analizar texto** con técnicas de **NLP** (spaCy, KeyBERT, Transformers)
- ✅ **Identificar entidades** (personas, organizaciones, lugares)
- ✅ **Extraer palabras clave** relevantes
- ✅ **Generar resúmenes** automáticos
- ✅ **API REST** con FastAPI
- ✅ **Frontend moderno** con React + TailwindCSS
- ✅ **Desplegado en AWS** Elastic Beanstalk

---

## 🏗️ Arquitectura del Sistema

```
┌─────────────────┐      ┌──────────────────┐      ┌─────────────────┐
│   Frontend      │─────▶│   Backend API    │─────▶│   AWS Services  │
│ React + Tailwind│      │   FastAPI        │      │  Elastic Beanstalk│
└─────────────────┘      └──────────────────┘      └─────────────────┘
                                │
                                ├─ OCR: Tesseract + OpenCV
                                ├─ NLP: spaCy + KeyBERT
                                └─ Resumen: BART (Transformers)
```

---

## 🛠️ Stack Tecnológico

### Backend
- **Framework**: FastAPI 0.104+
- **OCR**: Tesseract OCR, pytesseract, OpenCV, pdfplumber
- **NLP**: spaCy (es_core_news_sm, en_core_web_sm), KeyBERT, Transformers (BART)
- **Infraestructura**: AWS Elastic Beanstalk, Python 3.11

### Frontend
- **Framework**: React 18
- **Estilos**: TailwindCSS 3.4
- **Build Tool**: Vite 5
- **Despliegue**: Vercel / S3 + CloudFront (opcional)

---

## 📦 Instalación y Ejecución

### 1. **Backend (FastAPI)**

```bash
# Navegar a la carpeta backend
cd backend

# Crear entorno virtual
python3 -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate

# Instalar dependencias
pip install -r requirements.txt

# Descargar modelos de spaCy
python -m spacy download es_core_news_sm
python -m spacy download en_core_web_sm

# Instalar Tesseract OCR (sistema)
# Ubuntu/Debian:
sudo apt-get install tesseract-ocr tesseract-ocr-spa tesseract-ocr-eng poppler-utils

# macOS:
brew install tesseract tesseract-lang poppler

# Windows: Descargar desde https://github.com/UB-Mannheim/tesseract/wiki

# Ejecutar servidor
python application.py
# O con uvicorn:
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**API disponible en**: http://localhost:8000

**Documentación automática**: http://localhost:8000/docs

---

### 2. **Frontend (React)**

```bash
# Navegar a la carpeta frontend
cd frontend

# Instalar dependencias
npm install

# Crear archivo .env (opcional)
echo "VITE_API_URL=http://localhost:8000" > .env

# Ejecutar en desarrollo
npm run dev
```

**Frontend disponible en**: http://localhost:3000

---

## ☁️ Despliegue en AWS

### Requisitos previos
```bash
# Instalar AWS CLI
pip install awscli awsebcli

# Configurar credenciales
aws configure
# AWS Access Key ID: [TU_KEY]
# AWS Secret Access Key: [TU_SECRET]
# Default region: us-east-1
```

### Despliegue Backend en Elastic Beanstalk

```bash
cd backend

# Inicializar EB
eb init -p python-3.11 visiontext-ai --region us-east-1

# Crear entorno
eb create visiontext-env --instance-type t2.micro

# Desplegar
eb deploy

# Verificar estado
eb status

# Abrir en navegador
eb open
```

**Nota**: El archivo `.ebextensions/python.config` instala automáticamente Tesseract y los modelos de spaCy.

### Despliegue Frontend en Vercel (Opcional)

```bash
cd frontend

# Instalar Vercel CLI
npm install -g vercel

# Desplegar
vercel

# Configurar variable de entorno en Vercel Dashboard:
# VITE_API_URL=https://tu-api.elasticbeanstalk.com
```

---

## 🎯 Uso del Sistema

### 1. **API Backend**

#### Endpoint principal: `/procesar`

```bash
curl -X POST "http://localhost:8000/procesar" \
  -F "file=@documento.pdf" \
  -F "idioma=es"
```

**Respuesta JSON**:
```json
{
  "success": true,
  "filename": "documento.pdf",
  "texto_extraido": "Texto extraído del documento...",
  "texto_completo_length": 1500,
  "entidades": [
    {"texto": "Madrid", "tipo": "LOC"},
    {"texto": "Google", "tipo": "ORG"}
  ],
  "palabras_clave": [
    {"keyword": "inteligencia artificial", "score": 0.85},
    {"keyword": "procesamiento", "score": 0.72}
  ],
  "resumen": "El documento trata sobre...",
  "idioma_detectado": "es"
}
```

### 2. **Frontend Web**

1. Acceder a http://localhost:3000
2. Arrastrar o seleccionar un archivo (PDF o imagen)
3. Seleccionar idioma (Español/English)
4. Hacer clic en "Procesar Documento"
5. Ver resultados: texto, entidades, palabras clave y resumen
6. Descargar resultados en JSON o CSV

---

## 📂 Estructura del Proyecto

```
visiontext-ai/
├── backend/
│   ├── app/
│   │   ├── main.py           # API principal FastAPI
│   │   ├── ocr.py            # Módulo OCR
│   │   ├── nlp.py            # Módulo NLP
│   │   ├── models.py         # Modelos Pydantic
│   │   └── utils.py          # Utilidades
│   ├── application.py        # Punto de entrada AWS EB
│   ├── requirements.txt
│   ├── Procfile
│   ├── runtime.txt
│   └── .ebextensions/
│       └── python.config
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── UploadForm.jsx
│   │   │   ├── ResultsDisplay.jsx
│   │   │   ├── FilePreview.jsx
│   │   │   └── ProcessHistory.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
└── README.md
```

---

## 🧪 Testing

```bash
# Backend
cd backend
pytest tests/

# Frontend
cd frontend
npm run test
```

---

## 📊 Características Técnicas

- **Idiomas soportados**: Español, Inglés
- **Formatos aceptados**: PDF, JPG, PNG, BMP, TIFF
- **Tamaño máximo**: 10 MB por archivo
- **Modelos NLP**:
  - spaCy: `es_core_news_sm`, `en_core_web_sm`
  - KeyBERT: `all-MiniLM-L6-v2`
  - Resumen: `facebook/bart-large-cnn`

---

## 🔧 Troubleshooting

### Error: "Tesseract not found"
```bash
# Linux
sudo apt-get install tesseract-ocr

# macOS
brew install tesseract

# Windows: Agregar Tesseract al PATH
```

### Error: "spaCy model not found"
```bash
python -m spacy download es_core_news_sm
python -m spacy download en_core_web_sm
```

### Error: CORS en frontend
- Verificar que `VITE_API_URL` en `.env` apunte a la URL correcta del backend
- Verificar configuración CORS en `backend/app/main.py`

---

## 👥 Equipo

Desarrollado por **VisionText AI Team** para Hackathon 2025

---

## 📄 Licencia

MIT License - Ver archivo LICENSE para más detalles

---

## 🎓 Presentación para el Jurado

### Problema que resuelve
Muchas organizaciones tienen documentos en PDF o imágenes escaneadas que necesitan ser procesados y analizados rápidamente. VisionText AI automatiza completamente este proceso.

### Innovación técnica
- Pipeline completo de OCR + NLP en una sola aplicación
- Arquitectura escalable en AWS
- UI moderna y accesible
- Soporte multiidioma

### Valor diferencial
- Procesamiento en segundos
- Análisis inteligente con IA
- Exportación de datos en múltiples formatos
- Historial de procesamiento
- Totalmente funcional en 1 día de desarrollo

---

## 📞 Soporte

Para preguntas o problemas:
- **Email**: team@visiontext-ai.com
- **GitHub Issues**: [github.com/visiontext-ai/issues](https://github.com)

---

**¡Gracias por probar VisionText AI!** 🚀