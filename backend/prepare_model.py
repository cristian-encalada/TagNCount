import os
import urllib.request
import torch

# Set environment variable to allow loading models with weights_only=False
os.environ["TORCH_WARN_ONLY_WEIGHTS_ONLY_LOAD"] = "1"

# Download the model file manually
model_path = "yolov8n.pt"
if not os.path.exists(model_path):
    print(f"Downloading YOLO model to {model_path}...")
    url = "https://github.com/ultralytics/assets/releases/download/v0.0.0/yolov8n.pt"
    urllib.request.urlretrieve(url, model_path)
    print("Download completed!")

# Verify the file exists
print(f"Model file exists: {os.path.exists(model_path)}")
print(f"Model file size: {os.path.getsize(model_path)} bytes")

# Just download the model and make it available
# We'll load it in the actual application with the proper settings
print("Model preparation completed!") 