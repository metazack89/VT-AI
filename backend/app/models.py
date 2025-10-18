"""
Modelos Pydantic para validación y serialización de datos
"""

from pydantic import BaseModel, Field
from typing import List, Optional

class HealthResponse(BaseModel):
    """Modelo para respuestas de health check"""
    status: str
    message: str
    version: str

class Entidad(BaseModel):
    """Modelo para entidades reconocidas (NER)"""
    texto: str = Field(..., description="Texto de la entidad")
    tipo: str = Field(..., description="Tipo de entidad (PER, ORG, LOC, etc.)")
    
class PalabraClave(BaseModel):
    """Modelo para palabras clave extraídas"""
    keyword: str = Field(..., description="Palabra o frase clave")
    score: float = Field(..., description="Puntuación de relevancia (0-1)")

class ProcessResponse(BaseModel):
    """Modelo para respuesta del endpoint /procesar"""
    success: bool = Field(default=True, description="Estado del procesamiento")
    filename: str = Field(..., description="Nombre del archivo procesado")
    texto_extraido: str = Field(..., description="Texto extraído (primeros 5000 caracteres)")
    texto_completo_length: int = Field(..., description="Longitud total del texto extraído")
    entidades: List[Entidad] = Field(default_factory=list, description="Entidades reconocidas")
    palabras_clave: List[PalabraClave] = Field(default_factory=list, description="Palabras clave extraídas")
    resumen: str = Field(..., description="Resumen generado del texto")
    idioma_detectado: str = Field(..., description="Idioma del documento (es/en)")
    
    class Config:
        json_schema_extra = {
            "example": {
                "success": True,
                "filename": "documento.pdf",
                "texto_extraido": "Este es un texto de ejemplo...",
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
        }