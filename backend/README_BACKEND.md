# 🔧 VisionText AI - Backend

Backend API desarrollado con FastAPI para extracción de texto con OCR y análisis con NLP.

---

## 📋 Descripción

API REST que procesa documentos PDF e imágenes para:
- Extraer texto mediante OCR (Tesseract + OpenCV)
- Analizar el contenido con NLP (spaCy, KeyBERT, Transformers)
- Identificar entidades nombradas (personas, organizaciones, lugares)
- Extraer palabras clave relevantes
- Generar resúmenes automáticos

---

## 🛠️ Stack Tecnológico

| Componente | Tecnología | Versión |
|------------|------------|---------|
| Framework | FastAPI | 0.104.1 |
| Server | Uvicorn | 0.24.0 |
| OCR Engine | Tesseract | Latest |
| OCR Wrapper | pytesseract | 0.3.10 |
| Image Processing | OpenCV | 4.8.1 |
| PDF Processing | pdfplumber | 0.10.3 |
| NLP Framework | spaCy | 3.7.2 |
| Keywords | KeyBERT | 0.8.4 |
| Summarization | Transformers | 4.35.2 |
| Deep Learning | PyTorch | 2.1.1 |
| Logging | Loguru | 0.7.2 |
| Cloud | AWS Boto3 | 1.29.7 |

---

## 📂 Estructura del Proyecto

```
backend/
├── app/
│   ├── __init__.py          # Package initialization
│   ├── main.py              # FastAPI app y endpoints
│   ├── ocr.py               # Módulo de extracción de texto (OCR)
│   ├── nlp.py               # Módulo de análisis NLP
│   ├── models.py            # Schemas Pydantic (request/response)
│   └── utils.py             # Funciones auxiliares y validaciones
│
├── .ebextensions/
│   └── python.config        # Configuración AWS Elastic Beanstalk
│
├── application.py           # Punto de entrada para AWS EB
├── requirements.txt         # Dependencias Python
├── Procfile                 # Comando de ejecución para AWS
├── runtime.txt              # Versión de Python (3.11)
└── README_BACKEND.md        # Esta documentación
```

---

## 🚀 Instalación

### Requisitos Previos

- Python 3.10 o superior
- Tesseract OCR instalado en el sistema
- Poppler utils (para conversión PDF a imagen)

### 1. Instalar Tesseract OCR

#### Ubuntu/Debian:
```bash
sudo apt-get update
sudo apt-get install -y tesseract-ocr tesseract-ocr-spa tesseract-ocr-eng poppler-utils
```

#### CentOS/RHEL/Amazon Linux:
```bash
sudo yum install -y tesseract tesseract-langpack-spa tesseract-langpack-eng poppler-utils
```

#### macOS:
```bash
brew install tesseract tesseract-lang poppler
```

#### Windows:
1. Descargar desde: https://github.com/UB-Mannheim/tesseract/wiki
2. Instalar y agregar al PATH
3. Instalar Poppler: https://github.com/oschwartz10612/poppler-windows/releases/

### 2. Configurar Entorno Python

```bash
# Crear entorno virtual
python3 -m venv venv

# Activar entorno virtual
source venv/bin/activate  # Linux/macOS
# O en Windows:
venv\Scripts\activate

# Actualizar pip
pip install --upgrade pip

# Instalar dependencias
pip install -r requirements.txt
```

### 3. Descargar Modelos de spaCy

```bash
# Modelo español (12 MB)
python -m spacy download es_core_news_sm

# Modelo inglés (12 MB)
python -m spacy download en_core_web_sm
```

### 4. Verificar Instalación

```bash
# Verificar Tesseract
tesseract --version
tesseract --list-langs  # Debe mostrar 'spa' y 'eng'

# Verificar modelos spaCy
python -c "import spacy; print(spacy.load('es_core_news_sm'))"
python -c "import spacy; print(spacy.load('en_core_web_sm'))"
```

---

## ▶️ Ejecución

### Desarrollo Local

```bash
# Activar entorno virtual
source venv/bin/activate

# Opción 1: Con uvicorn (recomendado para desarrollo)
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Opción 2: Con el script application.py
python application.py

# Opción 3: En otro puerto
uvicorn app.main:app --reload --port 8080
```

### Producción

```bash
# Sin reload, con workers
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

**API disponible en**: http://localhost:8000

**Documentación interactiva**: http://localhost:8000/docs

---

## 📡 API Endpoints

### 1. Health Check

**GET** `/health`

Verifica que el servicio está operativo.

**Respuesta**:
```json
{
  "status": "healthy",
  "message": "Todos los servicios operativos",
  "version": "1.0.0"
}
```

### 2. Procesar Documento

**POST** `/procesar`

Procesa un documento PDF o imagen con OCR y NLP.

**Parámetros** (multipart/form-data):
| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `file` | File | Sí | Archivo PDF o imagen (max 10MB) |
| `idioma` | String | No | Idioma: `es` (default) o `en` |

**Ejemplo con cURL**:
```bash
curl -X POST "http://localhost:8000/procesar" \
  -F "file=@documento.pdf" \
  -F "idioma=es"
```

**Ejemplo con Python**:
```python
import requests

url = "http://localhost:8000/procesar"
files = {'file': open('documento.pdf', 'rb')}
data = {'idioma': 'es'}

response = requests.post(url, files=files, data=data)
print(response.json())
```

**Respuesta exitosa (200)**:
```json
{
  "success": true,
  "filename": "documento.pdf",
  "texto_extraido": "Texto extraído del documento...",
  "texto_completo_length": 1500,
  "entidades": [
    {
      "texto": "Madrid",
      "tipo": "LOC"
    },
    {
      "texto": "Universidad Complutense",
      "tipo": "ORG"
    }
  ],
  "palabras_clave": [
    {
      "keyword": "inteligencia artificial",
      "score": 0.85
    },
    {
      "keyword": "procesamiento",
      "score": 0.72
    }
  ],
  "resumen": "El documento presenta un análisis sobre...",
  "idioma_detectado": "es"
}
```

**Errores posibles**:
- `400`: Archivo no válido o muy grande
- `500`: Error interno al procesar

### 3. Idiomas Disponibles

**GET** `/idiomas`

Lista los idiomas soportados.

**Respuesta**:
```json
{
  "idiomas": [
    {"code": "es", "name": "Español"},
    {"code": "en", "name": "English"}
  ]
}
```

---

## 🧪 Testing

### Tests Manuales

```bash
# Health check
curl http://localhost:8000/health

# Procesar PDF de prueba
curl -X POST "http://localhost:8000/procesar" \
  -F "file=@test.pdf" \
  -F "idioma=es"

# Procesar imagen
curl -X POST "http://localhost:8000/procesar" \
  -F "file=@imagen.jpg" \
  -F "idioma=en"
```

### Tests Automatizados

```bash
# Instalar pytest
pip install pytest pytest-cov

# Ejecutar tests
pytest tests/

# Con coverage
pytest --cov=app tests/

# Test específico
pytest tests/test_api.py -v
```

---

## 🏗️ Arquitectura

### Pipeline de Procesamiento

```
1. RECEPCIÓN
   ↓
   Validar archivo (tipo, tamaño)
   ↓
   Guardar temporalmente
   
2. EXTRACCIÓN (OCR)
   ↓
   ¿Es PDF?
   ├─→ Sí: ¿Tiene texto?
   │    ├─→ Sí: pdfplumber
   │    └─→ No: pdf2image → Tesseract
   └─→ No (imagen): OpenCV → Tesseract
   
3. ANÁLISIS (NLP)
   ↓
   spaCy: Extraer entidades (NER)
   ↓
   KeyBERT: Extraer palabras clave
   ↓
   BART: Generar resumen
   
4. RESPUESTA
   ↓
   Construir JSON con resultados
   ↓
   Limpiar archivos temporales
```

### Módulos

#### `main.py` - API Principal
- Definición de endpoints REST
- Configuración CORS
- Manejo de errores
- Orquestación del pipeline

#### `ocr.py` - Extracción de Texto
- `extract_text_from_file()`: Punto de entrada
- `extract_text_from_pdf()`: PDFs con texto
- `extract_text_from_image()`: Imágenes
- `preprocess_image()`: Mejora calidad OCR

#### `nlp.py` - Análisis de Texto
- `analyze_text()`: Punto de entrada
- `extract_entities()`: Named Entity Recognition
- `extract_keywords()`: Extracción de keywords
- `generate_summary()`: Resumen automático

#### `models.py` - Schemas
- Modelos Pydantic para validación
- Schemas de request/response
- Documentación automática

#### `utils.py` - Utilidades
- Validación de archivos
- Gestión de archivos temporales
- Funciones auxiliares

---

## ⚙️ Configuración

### Variables de Entorno

```bash
# Opcional: Configurar nivel de log
export LOG_LEVEL=INFO  # DEBUG, INFO, WARNING, ERROR

# Opcional: Puerto personalizado
export PORT=8000

# AWS (si se usa S3)
export AWS_ACCESS_KEY_ID=your_key
export AWS_SECRET_ACCESS_KEY=your_secret
export AWS_REGION=us-east-1
```

### Configuración de Tesseract

Si Tesseract no está en el PATH, configurar en `ocr.py`:

```python
# Linux
pytesseract.pytesseract.tesseract_cmd = '/usr/bin/tesseract'

# macOS (Homebrew)
pytesseract.pytesseract.tesseract_cmd = '/usr/local/bin/tesseract'

# Windows
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
```

---

## ☁️ Despliegue en AWS Elastic Beanstalk

### Requisitos

```bash
# Instalar EB CLI
pip install awsebcli

# Configurar AWS
aws configure
```

### Despliegue

```bash
# Inicializar EB
eb init -p python-3.11 visiontext-ai --region us-east-1

# Crear entorno
eb create visiontext-env --instance-type t2.micro

# Deploy
eb deploy

# Ver logs
eb logs --stream

# Abrir en navegador
eb open

# Terminar (después del hackathon)
eb terminate visiontext-env
```

### Configuración AWS

El archivo `.ebextensions/python.config` instala automáticamente:
- Tesseract OCR
- Paquetes de idioma (español/inglés)
- Poppler utils
- Modelos de spaCy

---

## 🐛 Troubleshooting

### "Tesseract not found"

```bash
# Verificar instalación
tesseract --version

# Si no está, instalar según el OS (ver sección Instalación)
```

### "spaCy model not found"

```bash
# Descargar modelos
python -m spacy download es_core_news_sm
python -m spacy download en_core_web_sm

# Verificar
python -c "import spacy; spacy.load('es_core_news_sm')"
```

### "Module not found"

```bash
# Reinstalar dependencias
pip install -r requirements.txt

# Verificar entorno virtual está activado
which python  # Debe mostrar path del venv
```

### Timeout al procesar archivos

```python
# Aumentar timeout en uvicorn
uvicorn app.main:app --timeout-keep-alive 120
```

### Error de memoria con archivos grandes

```python
# En nlp.py, limitar tamaño del texto
doc = nlp(texto[:500000])  # Procesar solo primeros 500k caracteres
```

---

## 📊 Rendimiento

| Tipo de Documento | Tamaño | Tiempo Estimado |
|-------------------|--------|-----------------|
| Imagen JPG (1 página) | 500 KB | 3-5 segundos |
| PDF con texto (10 páginas) | 2 MB | 5-8 segundos |
| PDF escaneado (10 páginas) | 5 MB | 15-25 segundos |

**Factores**:
- Calidad de imagen (mayor calidad = más tiempo OCR)
- Número de páginas
- Complejidad del texto
- Recursos del servidor

---

## 🔐 Seguridad

### Validaciones Implementadas

1. **Tipo de archivo**: Solo PDF e imágenes permitidas
2. **Tamaño máximo**: 10 MB por archivo
3. **Archivos temporales**: Limpieza automática
4. **CORS**: Configurado para producción
5. **Path traversal**: Prevención con tempfile

### Recomendaciones para Producción

- Implementar rate limiting
- Agregar autenticación (JWT, API Keys)
- Usar HTTPS
- Validar y sanitizar nombres de archivo
- Implementar antivirus scanning
- Limitar CORS a dominios específicos

---

## 📈 Mejoras Futuras

- [ ] Procesamiento asíncrono con Celery
- [ ] Caché de resultados con Redis
- [ ] Almacenamiento en S3
- [ ] Soporte para más idiomas
- [ ] OCR mejorado con deep learning
- [ ] API de batch processing
- [ ] WebSockets para progreso en tiempo real
- [ ] Autenticación de usuarios
- [ ] Dashboard de analytics

---

## 📄 Licencia

MIT License - Ver LICENSE para detalles

---

## 👥 Créditos

Desarrollado por **VisionText AI Team** para Hackathon 2025

**Tecnologías utilizadas**:
- FastAPI: https://fastapi.tiangolo.com/
- Tesseract: https://github.com/tesseract-ocr/
- spaCy: https://spacy.io/
- KeyBERT: https://maartengr.github.io/KeyBERT/
- Transformers: https://huggingface.co/

---

## 📞 Soporte

- Documentación API: http://localhost:8000/docs
- GitHub Issues: [Reportar problema]
- Documentación principal: ../README.md

---

**¡Backend listo!** 🚀