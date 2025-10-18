"""
Módulo OCR - Extracción de texto desde PDFs e imágenes
Tecnologías: Tesseract OCR, OpenCV, pdfplumber
"""

import pytesseract
import cv2
import numpy as np
from PIL import Image
import pdfplumber
from pdf2image import convert_from_path
from pathlib import Path
from loguru import logger
from typing import Optional

# Configuración de Tesseract (ajustar path si es necesario en AWS)
# En AWS Linux, Tesseract suele estar en /usr/bin/tesseract
try:
    pytesseract.pytesseract.tesseract_cmd = '/usr/bin/tesseract'
except:
    pass  # Usar configuración por defecto

def preprocess_image(image_path: str) -> np.ndarray:
    """
    Pre-procesa imagen para mejorar resultados de OCR
    
    Args:
        image_path: Ruta a la imagen
        
    Returns:
        Imagen procesada como array NumPy
    """
    # Cargar imagen con OpenCV
    img = cv2.imread(image_path)
    
    # Convertir a escala de grises
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    
    # Aplicar umbralización adaptativa (mejora contraste)
    thresh = cv2.adaptiveThreshold(
        gray, 255, 
        cv2.ADAPTIVE_THRESH_GAUSSIAN_C, 
        cv2.THRESH_BINARY, 11, 2
    )
    
    # Reducir ruido con filtro de desenfoque
    denoised = cv2.fastNlMeansDenoising(thresh, h=10)
    
    return denoised

def extract_text_from_image(image_path: str, lang: str = "spa") -> str:
    """
    Extrae texto de una imagen usando Tesseract OCR
    
    Args:
        image_path: Ruta a la imagen
        lang: Idioma para OCR (spa=español, eng=inglés)
        
    Returns:
        Texto extraído
    """
    try:
        logger.info(f"🖼️ Procesando imagen: {image_path}")
        
        # Pre-procesar imagen
        processed_img = preprocess_image(image_path)
        
        # Configurar Tesseract para mejor precisión
        custom_config = r'--oem 3 --psm 6'  # LSTM OCR Engine, asume bloque uniforme de texto
        
        # Extraer texto
        texto = pytesseract.image_to_string(
            processed_img,
            lang=lang,
            config=custom_config
        )
        
        return texto.strip()
        
    except Exception as e:
        logger.error(f"❌ Error en OCR de imagen: {str(e)}")
        raise Exception(f"Error al procesar imagen con OCR: {str(e)}")

def extract_text_from_pdf(pdf_path: str) -> str:
    """
    Extrae texto de un PDF (con OCR si es necesario)
    
    Args:
        pdf_path: Ruta al archivo PDF
        
    Returns:
        Texto extraído completo
    """
    try:
        logger.info(f"📄 Procesando PDF: {pdf_path}")
        texto_total = []
        
        # Intentar extracción directa (PDFs con texto seleccionable)
        with pdfplumber.open(pdf_path) as pdf:
            for i, page in enumerate(pdf.pages):
                texto = page.extract_text()
                if texto:
                    texto_total.append(texto)
                    logger.info(f"✅ Página {i+1}: Texto extraído directamente")
        
        # Si se extrajo texto, retornar
        if texto_total:
            return "\n\n".join(texto_total)
        
        # Si no hay texto (PDF escaneado), usar OCR
        logger.info("🔍 PDF sin texto seleccionable, aplicando OCR...")
        return extract_text_from_pdf_with_ocr(pdf_path)
        
    except Exception as e:
        logger.error(f"❌ Error al procesar PDF: {str(e)}")
        raise Exception(f"Error al procesar PDF: {str(e)}")

def extract_text_from_pdf_with_ocr(pdf_path: str, lang: str = "spa") -> str:
    """
    Convierte PDF a imágenes y aplica OCR a cada página
    
    Args:
        pdf_path: Ruta al archivo PDF
        lang: Idioma para OCR
        
    Returns:
        Texto extraído de todas las páginas
    """
    try:
        # Convertir PDF a imágenes (DPI 300 para buena calidad)
        imagenes = convert_from_path(pdf_path, dpi=300)
        
        textos = []
        for i, img in enumerate(imagenes):
            logger.info(f"🔍 Aplicando OCR a página {i+1}/{len(imagenes)}")
            
            # Convertir PIL Image a array NumPy
            img_array = np.array(img)
            
            # Aplicar OCR
            custom_config = r'--oem 3 --psm 6'
            texto = pytesseract.image_to_string(
                img_array,
                lang=lang,
                config=custom_config
            )
            
            textos.append(texto.strip())
        
        return "\n\n".join(textos)
        
    except Exception as e:
        logger.error(f"❌ Error en OCR de PDF: {str(e)}")
        raise Exception(f"Error al aplicar OCR al PDF: {str(e)}")

def extract_text_from_file(file_path: str, filename: str) -> str:
    """
    Función principal: detecta tipo de archivo y extrae texto
    
    Args:
        file_path: Ruta al archivo temporal
        filename: Nombre original del archivo
        
    Returns:
        Texto extraído
    """
    extension = Path(filename).suffix.lower()
    
    # Determinar idioma (por ahora hardcodeado, se puede pasar como parámetro)
    lang = "spa"  # Cambiar a "eng" si es necesario
    
    if extension == '.pdf':
        return extract_text_from_pdf(file_path)
    elif extension in ['.jpg', '.jpeg', '.png', '.bmp', '.tiff', '.tif']:
        return extract_text_from_image(file_path, lang)
    else:
        raise Exception(f"Formato de archivo no soportado: {extension}")