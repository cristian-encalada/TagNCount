FROM python:3.9-slim

WORKDIR /app

# Install system dependencies including OpenGL
RUN apt-get update && apt-get install -y \
    libgl1-mesa-glx \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Create a non-root user
RUN useradd -m appuser && chown -R appuser:appuser /app

# Copy requirements first to leverage Docker cache
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Create a script to download and prepare the model
COPY prepare_model.py .
RUN python prepare_model.py

# Copy the rest of the application
COPY . .

# Switch to non-root user
USER appuser

# Use PORT environment variable with default to 8000
ENV PORT=8000
CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port ${PORT}"] 