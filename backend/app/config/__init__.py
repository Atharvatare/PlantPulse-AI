import os
from dotenv import load_dotenv

load_dotenv()


USE_MONGO = False


class BaseConfig:
    MONGODB_URI = os.getenv('MONGODB_URI', 'mongodb://localhost:27017/plantpulse')
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'plantpulse-jwt-secret-key-32bytes!!!!')
    OPENAI_API_KEY = os.getenv('OPENAI_API_KEY', '')
    JWT_ACCESS_TOKEN_EXPIRES = 86400
    JWT_TOKEN_LOCATION = ['headers']
    JWT_HEADER_NAME = 'Authorization'
    JWT_HEADER_TYPE = 'Bearer'
    CORS_ORIGINS = ['*']


class ProductionConfig(BaseConfig):
    FLASK_ENV = 'production'
    DEBUG = False


class DevelopmentConfig(BaseConfig):
    FLASK_ENV = 'development'
    DEBUG = True


class TestingConfig(BaseConfig):
    FLASK_ENV = 'testing'
    DEBUG = True
    TESTING = True
    MONGODB_URI = 'mongodb://localhost:27017/plantpulse_test'
