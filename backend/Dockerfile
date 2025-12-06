FROM python:3.11-slim

WORKDIR /app

# Библиотеки для работы с Postgres (psycopg2, sqlalchemy+postgresql и т.п.)
RUN apt-get update && apt-get install -y gcc libpq-dev && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Файл называется server.py, в нём есть app = FastAPI()
CMD ["uvicorn", "server:app", "--host", "0.0.0.0", "--port", "8000"]