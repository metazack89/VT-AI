"""
Punto de entrada para AWS Elastic Beanstalk
Este archivo debe estar en la raíz del proyecto backend/
"""

from app.main import app

# AWS Elastic Beanstalk busca una variable 'application'
application = app

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(application, host="0.0.0.0", port=8000)