"""
VisionText AI - API Principal
FastAPI backend para procesamiento de documentos con OCR y NLP
"""

from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from typing import Optional
import uvicorn
from loguru import logger
import sys

from .ocr import extract_text_from_file
from .nlp import analyze_text
from .models import ProcessResponse, HealthResponse
from .utils import validate_file, save_temp_file, cleanup_temp_file

# Configuración de logging
logger.remove()
logger.add(sys.stdout, format="<green>{time:YYYY-MM-DD HH:mm:ss}</green> | <level>{level: <8}</level> | {message}")

# Inicializar FastAPI
app = FastAPI(
    title="VisionText AI API",
    description="API para extracción de texto con OCR y análisis con NLP",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configurar CORS (permite acceso desde frontend React)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En producción, especificar dominios exactos
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ========== ENDPOINTS ==========

@app.get("/", response_model=HealthResponse)
async def root():
    """
    Endpoint raíz - verificación de estado del servicio
    """
    return HealthResponse(
        status="online",
        message="VisionText AI API está funcionando correctamente",
        version="1.0.0"
    )

@app.get("/health", response_model=HealthResponse)
async def health_check():
    """
    Health check para AWS Elastic Beanstalk
    """
    return HealthResponse(
        status="healthy",
        message="Todos los servicios operativos",
        version="1.0.0"
    )

@app.post("/procesar", response_model=ProcessResponse)
async def procesar_documento(
    file: UploadFile = File(..., description="Archivo PDF o imagen (max 10MB)"),
    idioma: str = Form("es", description="Idioma del documento (es/en)")
):
    """
    Endpoint principal: Procesa un documento con OCR y NLP
    
    Args:
        file: Archivo PDF o imagen (JPG, PNG, etc.)
        idioma: Código de idioma ('es' para español, 'en' para inglés)
    
    Returns:
        JSON con texto extraído, entidades, palabras clave y resumen
    """
    temp_path = None
    
    try:
        logger.info(f"📄 Procesando archivo: {file.filename} | Idioma: {idioma}")
        
        # 1. Validar archivo (tipo, tamaño)
        validate_file(file)
        
        # 2. Guardar archivo temporalmente
        temp_path = await save_temp_file(file)
        logger.info(f"💾 Archivo guardado temporalmente en: {temp_path}")
        
        # 3. Extraer texto con OCR
        logger.info("🔍 Iniciando extracción de texto (OCR)...")
        texto_extraido = extract_text_from_file(temp_path, file.filename)
        
        if not texto_extraido or len(texto_extraido.strip()) < 10:
            raise HTTPException(
                status_code=400,
                detail="No se pudo extraer texto suficiente del documento. Verifica la calidad de la imagen o PDF."
            )
        
        logger.info(f"✅ Texto extraído: {len(texto_extraido)} caracteres")
        
        # 4. Analizar texto con NLP
        logger.info("🧠 Iniciando análisis NLP...")
        resultados_nlp = analyze_text(texto_extraido, idioma)
        
        # 5. Construir respuesta
        response = ProcessResponse(
            success=True,
            filename=file.filename,
            texto_extraido=texto_extraido[:5000],  # Limitar a 5000 caracteres para respuesta
            texto_completo_length=len(texto_extraido),
            entidades=resultados_nlp["entidades"],
            palabras_clave=resultados_nlp["palabras_clave"],
            resumen=resultados_nlp["resumen"],
            idioma_detectado=idioma
        )
        
        logger.info("✅ Procesamiento completado exitosamente")
        return response
        
    except HTTPException as he:
        logger.error(f"❌ Error HTTP: {he.detail}")
        raise he
        
    except Exception as e:
        logger.error(f"❌ Error inesperado: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error al procesar el documento: {str(e)}"
        )
        
    finally:
        # 6. Limpiar archivo temporal
        if temp_path:
            cleanup_temp_file(temp_path)
            logger.info("🗑️ Archivo temporal eliminado")

@app.get("/idiomas")
async def obtener_idiomas():
    """
    Retorna los idiomas soportados
    """
    return {
        "idiomas": [
            {"code": "es", "name": "Español"},
            {"code": "en", "name": "English"}
        ]
    }

# ========== EJECUCIÓN LOCAL ==========
if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )