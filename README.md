# 🚀 VisionText AI

<div align="center">

![VisionText AI](https://img.shields.io/badge/VisionText-AI-blue?style=for-the-badge)
![Python](https://img.shields.io/badge/Python-3.11-3776AB?style=for-the-badge&logo=python&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![FastAPI](https://img.shields.io/badge/FastAPI-0.104-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![AWS](https://img.shields.io/badge/AWS-Elastic_Beanstalk-FF9900?style=for-the-badge&logo=amazon-aws&logoColor=white)

**Sistema inteligente de extracción y análisis de texto con IA**

[Demo en Vivo](#) • [Documentación](#-documentación) • [Instalación](#-instalación-rápida) • [API](#-api-reference)

</div>

---

## 📋 Descripción

**VisionText AI** es una aplicación completa de procesamiento de documentos que combina **OCR (Optical Character Recognition)** y **NLP (Natural Language Processing)** para extraer y analizar texto de PDFs e imágenes de forma inteligente.

### ✨ Características Principales

- 🔍 **OCR Avanzado**: Extrae texto de PDFs e imágenes con Tesseract + OpenCV
- 🧠 **Análisis NLP**: Identifica entidades, palabras clave y genera resúmenes automáticos
- 🌐 **API REST**: Backend robusto con FastAPI, documentación automática
- 💻 **Frontend Moderno**: Interfaz React + TailwindCSS, drag & drop, vista previa
- ☁️ **Cloud Ready**: Desplegable en AWS Elastic Beanstalk
- 🌍 **Multiidioma**: Soporte para español e inglés
- 📊 **Exportación**: Descarga resultados en JSON o CSV
- 📝 **Historial**: Mantén registro de documentos procesados

---

## 🎯 ¿Qué Hace VisionText AI?

```
📄 DOCUMENTO (PDF/Imagen)
        ↓
    🔍 OCR
        ↓
📝 TEXTO EXTRAÍDO
        ↓
    🧠 NLP
        ↓
┌─────────────────┬─────────────────┬─────────────────┐
│  👤 ENTIDADES   │  🔑 KEYWORDS    │  📋 RESUMEN     │
│  Personas       │  Conceptos      │  Automático     │
│  Organizaciones │  Temas clave    │  150 tokens     │
│  Lugares        │  Relevancia     │                 │
└─────────────────┴─────────────────┴─────────────────┘
```

### Ejemplo Real

**Input**: Factura escaneada en PDF

**Output**:
```json
{
  "texto_extraido": "FACTURA Nº 2024-001...",
  "entidades": [
    {"texto": "Acme Corp", "tipo": "ORG"},
    {"texto": "Madrid", "tipo": "LOC"},
    {"texto": "$1,500", "tipo": "MONEY"}
  ],
  "palabras_clave": [
    {"keyword": "servicios profesionales", "score": 0.89},
    {"keyword": "consultoría", "score": 0.76}
  ],
  "resumen": "Factura de servicios profesionales..."
}
```

---

## 🏗️ Arquitectura del Sistema

```
┌──────────────────────────────────────────────────────────────┐
│                      👤 USUARIO                               │
└────────────────────┬─────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              🎨 FRONTEND (React + Vite)                      │
│  • Upload drag & drop      • Vista previa archivos          │
│  • Selector de idioma      • Resultados visuales            │
│  • Historial procesados    • Descarga JSON/CSV              │
└────────────────────┬────────────────────────────────────────┘
                     │ HTTP POST /procesar
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              ⚡ BACKEND API (FastAPI)                        │
│  ┌──────────────┐         ┌──────────────┐                 │
│  │   🔍 OCR     │         │   🧠 NLP     │                 │
│  │ • Tesseract  │ Texto   │ • spaCy      │                 │
│  │ • OpenCV     │────────▶│ • KeyBERT    │                 │
│  │ • pdfplumber │         │ • BART       │                 │
│  └──────────────┘         └──────────────┘                 │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              ☁️ AWS ELASTIC BEANSTALK                        │
│  • EC2 Instances    • Load Balancer    • Auto Scaling      │
└─────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Stack Tecnológico

### Backend
| Tecnología | Propósito | Versión |
|------------|-----------|---------|
| **Python** | Lenguaje principal | 3.11 |
| **FastAPI** | Framework API REST | 0.104+ |
| **Tesseract** | Motor OCR | Latest |
| **OpenCV** | Procesamiento de imágenes | 4.8+ |
| **spaCy** | NLP & NER | 3.7+ |
| **KeyBERT** | Extracción keywords | 0.8+ |
| **Transformers** | Resumen (BART) | 4.35+ |
| **PyTorch** | Deep Learning | 2.1+ |

### Frontend
| Tecnología | Propósito | Versión |
|------------|-----------|---------|
| **React** | UI Framework | 18.2 |
| **Vite** | Build Tool | 5.0 |
| **TailwindCSS** | Estilos | 3.4 |

### Infraestructura
| Tecnología | Propósito |
|------------|-----------|
| **AWS Elastic Beanstalk** | Hosting backend |
| **Vercel** | Hosting frontend (opcional) |
| **S3** | Almacenamiento (opcional) |

---

## 📦 Instalación Rápida

### Opción 1: Script Automático (Recomendado) ⚡

```bash
# Clonar o crear el proyecto
git clone https://github.com/tu-usuario/visiontext-ai.git
cd visiontext-ai

# Ejecutar script de instalación
chmod +x setup.sh
./setup.sh

# ¡Listo! Todo instalado en 5 minutos
```

### Opción 2: Instalación Manual 🔧

#### Backend (Python)

```bash
# 1. Instalar Tesseract OCR
# Ubuntu/Debian:
sudo apt-get install tesseract-ocr tesseract-ocr-spa tesseract-ocr-eng poppler-utils

# macOS:
brew install tesseract tesseract-lang poppler

# 2. Configurar backend
cd backend
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# 3. Descargar modelos NLP
python -m spacy download es_core_news_sm
python -m spacy download en_core_web_sm
```

#### Frontend (React)

```bash
cd frontend
npm install
echo "VITE_API_URL=http://localhost:8000" > .env
```

---

## ▶️ Ejecutar la Aplicación

### Terminal 1: Backend

```bash
cd backend
source venv/bin/activate  # Windows: venv\Scripts\activate
python application.py
```

✅ **Backend**: http://localhost:8000  
📚 **API Docs**: http://localhost:8000/docs

### Terminal 2: Frontend

```bash
cd frontend
npm run dev
```

✅ **Frontend**: http://localhost:3000

---

## 🎮 Uso del Sistema

### 1. Interfaz Web

1. **Abrir** http://localhost:3000
2. **Arrastrar** o seleccionar un archivo (PDF o imagen)
3. **Seleccionar** idioma (Español/English)
4. **Procesar** y esperar resultados
5. **Visualizar**: texto, entidades, keywords, resumen
6. **Descargar** resultados en JSON o CSV

### 2. API REST

```bash
# Health check
curl http://localhost:8000/health

# Procesar documento
curl -X POST "http://localhost:8000/procesar" \
  -F "file=@documento.pdf" \
  -F "idioma=es"
```

### 3. Python Client

```python
import requests

url = "http://localhost:8000/procesar"
files = {'file': open('documento.pdf', 'rb')}
data = {'idioma': 'es'}

response = requests.post(url, files=files, data=data)
result = response.json()

print(f"Texto extraído: {result['texto_extraido'][:200]}...")
print(f"Entidades: {len(result['entidades'])}")
print(f"Keywords: {len(result['palabras_clave'])}")
```

---

## 📡 API Reference

### Endpoints Principales

#### `POST /procesar`

Procesa un documento con OCR y NLP.

**Request**:
```bash
Content-Type: multipart/form-data

file: [archivo PDF o imagen, max 10MB]
idioma: "es" | "en"
```

**Response**:
```json
{
  "success": true,
  "filename": "documento.pdf",
  "texto_extraido": "...",
  "texto_completo_length": 1500,
  "entidades": [...],
  "palabras_clave": [...],
  "resumen": "...",
  "idioma_detectado": "es"
}
```

Ver documentación completa: [docs/API_DOCS.md](docs/API_DOCS.md)

---

## ☁️ Despliegue en AWS

### Despliegue Rápido

```bash
# Instalar herramientas
pip install awsebcli

# Configurar AWS
aws configure

# Desplegar backend
cd backend
eb init -p python-3.11 visiontext-ai
eb create visiontext-env
eb deploy

# Obtener URL
eb open
```

**Guía completa**: [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)

---

## 📊 Características Técnicas

### Formatos Soportados
- 📄 **PDFs**: Con texto seleccionable o escaneados
- 🖼️ **Imágenes**: JPG, PNG, BMP, TIFF

### Límites
- **Tamaño máximo**: 10 MB por archivo
- **Idiomas**: Español, Inglés
- **Timeout**: 120 segundos

### Modelos NLP

| Modelo | Propósito | Tamaño |
|--------|-----------|--------|
| `es_core_news_sm` | NER español | 12 MB |
| `en_core_web_sm` | NER inglés | 12 MB |
| `all-MiniLM-L6-v2` | Keywords | 80 MB |
| `facebook/bart-large-cnn` | Resumen | 1.6 GB |

---

## 🧪 Testing

```bash
# Backend tests
cd backend
pytest tests/

# Frontend tests
cd frontend
npm run test

# Test E2E manual
./scripts/test_e2e.sh
```

---

## 📁 Estructura del Proyecto

```
visiontext-ai/
├── backend/                 # API FastAPI
│   ├── app/
│   │   ├── main.py          # Endpoints y app principal
│   │   ├── ocr.py           # Módulo OCR
│   │   ├── nlp.py           # Módulo NLP
│   │   ├── models.py        # Schemas Pydantic
│   │   └── utils.py         # Utilidades
│   ├── .ebextensions/       # Config AWS EB
│   ├── requirements.txt     # Dependencias Python
│   └── application.py       # Entry point AWS
│
├── frontend/                # App React
│   ├── src/
│   │   ├── components/      # Componentes React
│   │   ├── App.jsx          # Componente principal
│   │   └── main.jsx         # Entry point
│   ├── package.json         # Dependencias npm
│   └── vite.config.js       # Config Vite
│
├── docs/                    # Documentación
│   ├── ARCHITECTURE.md      # Arquitectura técnica
│   ├── DEPLOYMENT.md        # Guía despliegue AWS
│   └── API_DOCS.md          # Documentación API
│
├── README.md                # Este archivo
├── QUICKSTART.md            # Guía rápida
├── HACKATHON_PLAN.md        # Plan de 8 horas
└── setup.sh                 # Script de instalación
```

---

## 🐛 Troubleshooting

### Error: "Tesseract not found"

```bash
# Ubuntu/Debian
sudo apt-get install tesseract-ocr

# macOS
brew install tesseract

# Windows: Descargar desde
# https://github.com/UB-Mannheim/tesseract/wiki
```

### Error