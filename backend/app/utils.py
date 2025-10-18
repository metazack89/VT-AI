"""
Utilidades y funciones auxiliares
"""

import os
import tempfile
from pathlib import Path
from fastapi import UploadFile, HTTPException
from loguru import logger

# Configuración
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB en bytes
ALLOWED_EXTENSIONS = {'.pdf', '.jpg', '.jpeg', '.png', '.bmp', '.tiff', '.tif'}
ALLOWED_MIME_TYPES = {
    'application/pdf',
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/bmp',
    'image/tiff'
}

def validate_file(file: UploadFile) -> None:
    """
    Valida el archivo subido (tipo y tamaño)
    
    Args:
        file: Archivo subido por el usuario
        
    Raises:
        HTTPException: Si el archivo no es válido
    """
    # Validar extensión
    extension = Path(file.filename).suffix.lower()
    if extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Tipo de archivo no permitido. Extensiones válidas: {', '.join(ALLOWED_EXTENSIONS)}"
        )
    
    # Validar tamaño (leer en chunks para no cargar todo en memoria)
    file.file.seek(0, 2)  # Mover al final del archivo
    file_size = file.file.tell()  # Obtener posición (tamaño)
    file.file.seek(0)  # Volver al inicio
    
    if file_size > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=400,
            detail=f"Archivo demasiado grande. Tamaño máximo: {MAX_FILE_SIZE / (1024*1024):.1f} MB"
        )
    
    logger.info(f"✅ Archivo validado: {file.filename} ({file_size / 1024:.1f} KB)")

async def save_temp_file(file: UploadFile) -> str:
    """
    Guarda el archivo subido en un directorio temporal
    
    Args:
        file: Archivo subido
        
    Returns:
        Ruta al archivo temporal
    """
    try:
        # Obtener extensión original
        extension = Path(file.filename).suffix
        
        # Crear archivo temporal con la misma extensión
        with tempfile.NamedTemporaryFile(
            delete=False,
            suffix=extension
        ) as temp_file:
            # Leer y escribir en chunks (eficiente para archivos grandes)
            content = await file.read()
            temp_file.write(content)
            temp_path = temp_file.name
        
        logger.info(f"💾 Archivo guardado en: {temp_path}")
        return temp_path
        
    except Exception as e:
        logger.error(f"❌ Error al guardar archivo temporal: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error al guardar el archivo: {str(e)}"
        )

def cleanup_temp_file(file_path: str) -> None:
    """
    Elimina un archivo temporal
    
    Args:
        file_path: Ruta al archivo temporal
    """
    try:
        if os.path.exists(file_path):
            os.remove(file_path)
            logger.info(f"🗑️ Archivo temporal eliminado: {file_path}")
    except Exception as e:
        logger.warning(f"⚠️ No se pudo eliminar archivo temporal: {str(e)}")

def truncate_text(texto: str, max_chars: int = 5000) -> str:
    """
    Trunca texto a un número máximo de caracteres
    
    Args:
        texto: Texto a truncar
        max_chars: Número máximo de caracteres
        
    Returns:
        Texto truncado con indicador si fue cortado
    """
    if len(texto) <= max_chars:
        return texto
    
    return texto[:max_chars] + "\n\n[... texto truncado ...]"