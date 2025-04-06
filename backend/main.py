from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from ultralytics import YOLO
import cv2
import numpy as np
from typing import List, Dict
import os
import base64
from pydantic import BaseModel
import torch
from ultralytics.nn.tasks import DetectionModel
import torch.serialization
import uuid

# Patch torch.load to force weights_only=False for this specific application
original_torch_load = torch.load

def torch_load_with_weights_only_false(f, *args, **kwargs):
    # Force weights_only=False for our trusted model
    kwargs['weights_only'] = False
    return original_torch_load(f, *args, **kwargs)

# Apply the patch globally
torch.load = torch_load_with_weights_only_false

app = FastAPI(title="TagNCount API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize model as None
model = None

@app.on_event("startup")
async def startup_event():
    global model
    try:
        # Add any required classes to safe globals
        torch.serialization.add_safe_globals([DetectionModel])
        
        # Load the YOLO model with our patched torch.load
        model = YOLO("yolov8n.pt")
        print("Model loaded successfully!")
    except Exception as e:
        print(f"Error loading model: {str(e)}")
        raise

class DetectionResult(BaseModel):
    class_name: str
    confidence: float
    count: int

class AnalysisResponse(BaseModel):
    detections: List[DetectionResult]
    total_objects: int
    annotated_image: str
    image_id: str

@app.post("/analyze", response_model=AnalysisResponse)
async def analyze_image(file: UploadFile = File(...)):
    try:
        if model is None:
            return JSONResponse(
                status_code=503,
                content={"message": "Model is not ready yet"}
            )

        # Read the uploaded file
        contents = await file.read()
        nparr = np.frombuffer(contents, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        # Create a unique ID for this image
        image_id = str(uuid.uuid4())
        
        # Run YOLO detection
        results = model(img)
        
        # Process results
        detections = {}
        for result in results:
            boxes = result.boxes
            for box in boxes:
                class_id = int(box.cls[0])
                class_name = model.names[class_id]
                confidence = float(box.conf[0])
                
                if class_name not in detections:
                    detections[class_name] = {
                        "class_name": class_name,
                        "confidence": confidence,
                        "count": 1
                    }
                else:
                    detections[class_name]["count"] += 1
                    detections[class_name]["confidence"] = max(
                        detections[class_name]["confidence"],
                        confidence
                    )
        
        # Get the annotated image (plot=True will draw bounding boxes)
        annotated_img = results[0].plot()
        
        # Convert the annotated image to base64 for sending to frontend
        _, buffer = cv2.imencode('.jpg', annotated_img)
        annotated_image_b64 = base64.b64encode(buffer).decode('utf-8')
        
        # Convert to list and calculate total
        detection_list = list(detections.values())
        total_objects = sum(det["count"] for det in detection_list)
        
        return AnalysisResponse(
            detections=detection_list,
            total_objects=total_objects,
            annotated_image=annotated_image_b64,
            image_id=image_id
        )
        
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"message": f"Error processing image: {str(e)}"}
        )

@app.get("/health")
async def health_check():
    return {"status": "healthy" if model is not None else "initializing"} 