# EcoTraker

## Requisitos

- Python 3.13+
- Node.js 22+
- npm

## Backend

Desde la raiz del proyecto:

```bash
cd backend
python -m pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

La API queda disponible en `http://127.0.0.1:8000`.

Para ejecutar las pruebas:

```bash
python manage.py test
```

## Aplicacion mobile/web

En otra terminal:

```bash
cd mobile
npm install
npm run web
```

Expo muestra la URL local, normalmente `http://localhost:8081`. Para usar Expo Go, escanea el QR que aparece en la terminal.

Configura `backend/.env` y `mobile/.env` a partir de los archivos `.env.example` cuando necesites valores locales.