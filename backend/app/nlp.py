"""
Módulo NLP - Análisis de texto con spaCy, KeyBERT y Transformers
"""

import spacy
from keybert import KeyBERT
from transformers import pipeline
from loguru import logger
from typing import Dict, List
from .models import Entidad, PalabraClave

# ========== CARGA DE MODELOS (solo una vez al iniciar) ==========

# Modelos spaCy para NER (Named Entity Recognition)
nlp_es = None
nlp_en = None

# Modelo KeyBERT para extracción de palabras clave
kw_model = None

# Pipeline de resumen con BART
summarizer = None

def load_models():
    """
    Carga todos los modelos de NLP al iniciar la aplicación
    Se ejecuta una sola vez para optimizar rendimiento
    """
    global nlp_es, nlp_en, kw_model, summarizer
    
    if nlp_es is None:
        logger.info("📦 Cargando modelo spaCy español...")
        nlp_es = spacy.load("es_core_news_sm")
        
    if nlp_en is None:
        logger.info("📦 Cargando modelo spaCy inglés...")
        nlp_en = spacy.load("en_core_web_sm")
        
    if kw_model is None:
        logger.info("📦 Cargando KeyBERT...")
        kw_model = KeyBERT(model='all-MiniLM-L6-v2')
        
    if summarizer is None:
        logger.info("📦 Cargando modelo de resumen BART...")
        summarizer = pipeline(
            "summarization",
            model="facebook/bart-large-cnn",
            device=-1  # CPU (-1), cambiar a 0 para GPU
        )
    
    logger.info("✅ Todos los modelos NLP cargados correctamente")

# Cargar modelos al importar el módulo
try:
    load_models()
except Exception as e:
    logger.warning(f"⚠️ Error al cargar modelos: {e}. Se cargarán bajo demanda.")

def extract_entities(texto: str, idioma: str) -> List[Entidad]:
    """
    Extrae entidades nombradas (personas, organizaciones, lugares, etc.)
    
    Args:
        texto: Texto a analizar
        idioma: Código de idioma ('es' o 'en')
        
    Returns:
        Lista de entidades encontradas
    """
    try:
        # Seleccionar modelo según idioma
        nlp = nlp_es if idioma == "es" else nlp_en
        
        # Procesar texto (limitar a 1M de caracteres por rendimiento)
        doc = nlp(texto[:1000000])
        
        # Extraer entidades únicas
        entidades_dict = {}
        for ent in doc.ents:
            # Filtrar entidades muy cortas o genéricas
            if len(ent.text.strip()) > 2:
                key = f"{ent.text}_{ent.label_}"
                if key not in entidades_dict:
                    entidades_dict[key] = Entidad(
                        texto=ent.text,
                        tipo=ent.label_
                    )
        
        entidades = list(entidades_dict.values())
        logger.info(f"✅ Entidades extraídas: {len(entidades)}")
        
        return entidades[:50]  # Limitar a las 50 más relevantes
        
    except Exception as e:
        logger.error(f"❌ Error en extracción de entidades: {str(e)}")
        return []

def extract_keywords(texto: str, num_keywords: int = 10) -> List[PalabraClave]:
    """
    Extrae palabras clave más relevantes del texto
    
    Args:
        texto: Texto a analizar
        num_keywords: Número de palabras clave a extraer
        
    Returns:
        Lista de palabras clave con scores
    """
    try:
        # KeyBERT extrae n-gramas (frases de 1-3 palabras)
        keywords = kw_model.extract_keywords(
            texto,
            keyphrase_ngram_range=(1, 3),
            stop_words='english',  # También filtra en otros idiomas
            top_n=num_keywords,
            use_maxsum=True,  # Diversidad en resultados
            nr_candidates=20
        )
        
        # Convertir a modelo Pydantic
        palabras_clave = [
            PalabraClave(keyword=kw, score=round(score, 3))
            for kw, score in keywords
        ]
        
        logger.info(f"✅ Palabras clave extraídas: {len(palabras_clave)}")
        return palabras_clave
        
    except Exception as e:
        logger.error(f"❌ Error en extracción de keywords: {str(e)}")
        return []

def generate_summary(texto: str, max_length: int = 150, min_length: int = 50) -> str:
    """
    Genera un resumen del texto usando BART
    
    Args:
        texto: Texto a resumir
        max_length: Longitud máxima del resumen (en tokens)
        min_length: Longitud mínima del resumen (en tokens)
        
    Returns:
        Resumen generado
    """
    try:
        # BART tiene límite de 1024 tokens, hacer chunking si es necesario
        max_input_length = 1024
        
        if len(texto.split()) > max_input_length:
            # Tomar los primeros N tokens
            texto = ' '.join(texto.split()[:max_input_length])
            logger.warning(f"⚠️ Texto truncado a {max_input_length} tokens para resumen")
        
        # Generar resumen
        resumen = summarizer(
            texto,
            max_length=max_length,
            min_length=min_length,
            do_sample=False,
            truncation=True
        )
        
        texto_resumen = resumen[0]['summary_text']
        logger.info(f"✅ Resumen generado: {len(texto_resumen)} caracteres")
        
        return texto_resumen
        
    except Exception as e:
        logger.error(f"❌ Error al generar resumen: {str(e)}")
        # Fallback: primeras N palabras del texto
        palabras = texto.split()
        return ' '.join(palabras[:100]) + "..."

def analyze_text(texto: str, idioma: str) -> Dict:
    """
    Función principal: ejecuta análisis completo de NLP
    
    Args:
        texto: Texto a analizar
        idioma: Código de idioma ('es' o 'en')
        
    Returns:
        Diccionario con entidades, palabras clave y resumen
    """
    logger.info("🧠 Iniciando análisis NLP completo...")
    
    # 1. Extraer entidades nombradas
    entidades = extract_entities(texto, idioma)
    
    # 2. Extraer palabras clave
    palabras_clave = extract_keywords(texto, num_keywords=10)
    
    # 3. Generar resumen
    resumen = generate_summary(texto, max_length=150, min_length=50)
    
    resultados = {
        "entidades": entidades,
        "palabras_clave": palabras_clave,
        "resumen": resumen
    }
    
    logger.info("✅ Análisis NLP completado")
    return resultados