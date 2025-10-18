# 📘 Documentación API - VisionText AI

API REST para extracción de texto con OCR y análisis con NLP.

**Base URL**: `http://localhost:8000` (desarrollo)  
**Base URL Producción**: `https://visiontext-env.XXXXX.elasticbeanstalk.com`

---

## 🔍 Endpoints Disponibles

### 1. Health Check

#### `GET /`

Verifica que la API está en línea.

**Respuesta**:
```json
{
  "status": "online",
  "message": "VisionText AI API está funcionando correctamente",
  "version": "1.0.0"
}
```

---

### 2. Health Check (AWS)

#### `GET /health`

Health check para AWS Elastic Beanstalk.

**Respuesta**:
```json
{
  "status": "healthy",
  "message": "Todos los servicios operativos",
  "version": "1.0.0"
}
```

---

### 3. Procesar Documento

#### `POST /procesar`

Procesa un documento PDF o imagen con OCR y NLP.

**Headers**:
```
Content-Type: multipart/form-data
```

**Parámetros** (form-data):

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `file` | File | Sí | Archivo PDF o imagen (max 10MB) |
| `idioma` | String | No | Idioma del documento: `es` (default) o `en` |

**Formatos aceptados**:
- PDF: `.pdf`
- Imágenes: `.jpg`, `.jpeg`, `.png`, `.bmp`, `.tiff`, `.tif`

**Ejemplo (cURL)**:
```bash
curl -X POST "http://localhost:8000/procesar" \
  -F "file=@documento.pdf" \
  -F "idioma=es"
```

**Ejemplo (JavaScript)**:
```javascript
const formData = new FormData();
formData.append('file', fileInput.files[0]);
formData.append('idioma', 'es');

const response = await fetch('http://localhost:8000/procesar', {
  method: 'POST',
  body: formData
});

const result = await response.json();
console.log(result);
```

**Ejemplo (Python)**:
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
  "texto_extraido": "Este es el texto extraído del documento...",
  "texto_completo_length": 1500,
  "entidades": [
    {
      "texto": "Madrid",
      "tipo": "LOC"
    },
    {
      "texto": "Universidad Complutense",
      "tipo": "ORG"
    },
    {
      "texto": "Juan Pérez",
      "tipo": "PER"
    }
  ],
  "palabras_clave": [
    {
      "keyword": "inteligencia artificial",
      "score": 0.85
    },
    {
      "keyword": "procesamiento de lenguaje",
      "score": 0.78
    },
    {
      "keyword": "machine learning",
      "score": 0.72
    }
  ],
  "resumen": "El documento presenta un análisis sobre la aplicación de técnicas de inteligencia artificial en el procesamiento de documentos digitales, enfocándose en OCR y NLP.",
  "idioma_detectado": "es"
}
```

**Errores posibles**:

| Código | Descripción | Respuesta |
|--------|-------------|-----------|
| 400 | Archivo no válido | `{"detail": "Tipo de archivo no permitido..."}` |
| 400 | Archivo muy grande | `{"detail": "Archivo demasiado grande. Tamaño máximo: 10 MB"}` |
| 400 | No se extrajo texto | `{"detail": "No se pudo extraer texto suficiente del documento..."}` |
| 500 | Error interno | `{"detail": "Error al procesar el documento: ..."}` |

---

### 4. Obtener Idiomas Soportados

#### `GET /idiomas`

Lista los idiomas disponibles para procesamiento.

**Respuesta**:
```json
{
  "idiomas": [
    {
      "code": "es",
      "name": "Español"
    },
    {
      "code": "en",
      "name": "English"
    }
  ]
}
```

---

## 📊 Modelos de Datos

### Entidad

```typescript
{
  texto: string;      // Texto de la entidad
  tipo: string;       // Tipo: PER, ORG, LOC, MISC, etc.
}
```

**Tipos de entidades (español)**:
- `PER`: Persona
- `ORG`: Organización
- `LOC`: Lugar/Ubicación
- `MISC`: Miscelánea

**Tipos de entidades (inglés)**:
- `PERSON`: Persona
- `ORG`: Organización
- `GPE`: Entidad Geopolítica
- `DATE`: Fecha
- `MONEY`: Cantidad monetaria

### Palabra Clave

```typescript
{
  keyword: string;    // Palabra o frase clave
  score: number;      // Puntuación de relevancia (0-1)
}
```

### Respuesta de Procesamiento

```typescript
{
  success: boolean;
  filename: string;
  texto_extraido: string;          // Primeros 5000 caracteres
  texto_completo_length: number;   // Longitud total
  entidades: Entidad[];
  palabras_clave: PalabraClave[];
  resumen: string;
  idioma_detectado: string;        // 'es' o 'en'
}
```

---

## 🔐 Seguridad

### Límites de Tasa (Rate Limiting)

Actualmente **no implementado**. Para producción, considerar:
- Máximo 100 requests por hora por IP
- Máximo 10 archivos por minuto

### Validaciones

1. **Tamaño de archivo**: Máximo 10 MB
2. **Tipos permitidos**: Solo PDF e imágenes comunes
3. **Timeout**: 120 segundos máximo de procesamiento

---

## 🧪 Casos de Uso

### Caso 1: Extraer texto de factura escaneada

```bash
curl -X POST "http://localhost:8000/procesar" \
  -F "file=@factura.jpg" \
  -F "idioma=es"
```

**Resultado esperado**:
- Texto extraído con OCR
- Entidades: empresa, NIF, cantidades monetarias
- Palabras clave: productos/servicios mencionados

### Caso 2: Analizar documento académico en inglés

```bash
curl -X POST "http://localhost:8000/procesar" \
  -F "file=@paper.pdf" \
  -F "idioma=en"
```

**Resultado esperado**:
- Texto del PDF
- Entidades: autores, universidades, términos técnicos
- Resumen del abstract o introducción

### Caso 3: Procesar contrato legal

```bash
curl -X POST "http://localhost:8000/procesar" \
  -F "file=@contrato.pdf" \
  -F "idioma=es"
```

**Resultado esperado**:
- Texto completo del contrato
- Entidades: nombres de partes, empresas, lugares
- Palabras clave: términos legales importantes

---

## 📈 Rendimiento

| Tipo de Documento | Tamaño | Tiempo Promedio |
|-------------------|--------|-----------------|
| Imagen JPG (1 página) | 500 KB | 3-5 segundos |
| PDF con texto (10 páginas) | 2 MB | 5-8 segundos |
| PDF escaneado (10 páginas) | 5 MB | 15-25 segundos |

**Factores que afectan el rendimiento**:
- Calidad de la imagen (mayor calidad = más tiempo de OCR)
- Número de páginas
- Complejidad del texto
- Carga del servidor

---

## 🐛 Debugging

### Activar logs detallados

Agregar variable de entorno:
```bash
export LOG_LEVEL=DEBUG
```

### Ver logs en AWS

```bash
eb logs --stream
```

### Probar endpoint localmente

```python
# test_api.py
import requests

url = "http://localhost:8000/procesar"
files = {'file': open('test.pdf', 'rb')}
data = {'idioma': 'es'}

try:
    response = requests.post(url, files=files, data=data, timeout=60)
    response.raise_for_status()
    print(response.json())
except requests.exceptions.HTTPError as e:
    print(f"Error HTTP: {e}")
    print(f"Respuesta: {response.text}")
except requests.exceptions.Timeout:
    print("Timeout: El servidor no respondió a tiempo")
except Exception as e:
    print(f"Error: {e}")
```

---

## 📚 Documentación Interactiva

Acceder a la documentación automática de FastAPI:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

Permite probar los endpoints directamente desde el navegador.

---

## 🔄 Versionado

**Versión actual**: 1.0.0

Cambios en versiones futuras:
- **1.1.0**: Soporte para más idiomas (francés, alemán)
- **1.2.0**: Almacenamiento en S3
- **1.3.0**: Rate limiting y autenticación
- **2.0.0**: Procesamiento asíncrono con colas

---

## 💡 Ejemplos Avanzados

### Procesar múltiples archivos (batch)

```python
import requests
import concurrent.futures

def procesar_archivo(filepath):
    url = "http://localhost:8000/procesar"
    with open(filepath, 'rb') as f:
        files = {'file': f}
        data = {'idioma': 'es'}
        response = requests.post(url, files=files, data=data)
        return response.json()

archivos = ['doc1.pdf', 'doc2.pdf', 'doc3.pdf']

with concurrent.futures.ThreadPoolExecutor(max_workers=3) as executor:
    resultados = executor.map(procesar_archivo, archivos)
    
for resultado in resultados:
    print(f"Archivo: {resultado['filename']}")
    print(f"Resumen: {resultado['resumen']}\n")
```

### Integración con Node.js

```javascript
const FormData = require('form-data');
const fs = require('fs');
const axios = require('axios');

async function procesarDocumento(filepath, idioma = 'es') {
  const form = new FormData();
  form.append('file', fs.createReadStream(filepath));
  form.append('idioma', idioma);

  try {
    const response = await axios.post(
      'http://localhost:8000/procesar',
      form,
      { headers: form.getHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error('Error:', error.response.data);
    throw error;
  }
}

// Usar
procesarDocumento('documento.pdf', 'es')
  .then(resultado => console.log(resultado))
  .catch(err => console.error(err));
```

---

¿Preguntas? Consulta el README principal o abre un issue en GitHub.