# TagNCount - Object Detection and Counting System

TagNCount is a web application that uses computer vision to detect, label, and count objects in images. The system provides an interface where users can upload images and receive detailed analysis of the objects present in them.

## How It Works

1. **Frontend Interface**: Users can upload images through a drag-and-drop interface or by browsing their files.
2. **Image Processing Workflow**:
   - Images are sent to the backend API for analysis
   - The YOLOv8 model processes each image to detect objects
   - Results are returned to the frontend with:
     - Object counts by category
     - Confidence scores for each detection
     - Annotated image with bounding boxes around detected objects
3. **Results Display**: The application shows both the original and annotated images side by side, with a detailed breakdown of all detected objects.

## Features

- Upload and analyze images through drag-and-drop or file browser
- Real-time object detection using YOLOv8
- Object counting by category with confidence scores
- Side-by-side comparison of original and annotated images
- Clean and intuitive user interface with dark/light mode
- RESTful API backend

## Supported Object Categories

The application uses YOLOv8 with the [COCO dataset](https://docs.ultralytics.com/datasets/detect/coco/) pre-trained model, which can detect the following 80 object categories:

<table>
  <tr>
    <td>Person</td>
    <td>Bicycle</td>
    <td>Car</td>
    <td>Motorcycle</td>
    <td>Airplane</td>
  </tr>
  <tr>
    <td>Bus</td>
    <td>Train</td>
    <td>Truck</td>
    <td>Boat</td>
    <td>Traffic Light</td>
  </tr>
  <tr>
    <td>Fire Hydrant</td>
    <td>Stop Sign</td>
    <td>Parking Meter</td>
    <td>Bench</td>
    <td>Bird</td>
  </tr>
  <tr>
    <td>Cat</td>
    <td>Dog</td>
    <td>Horse</td>
    <td>Sheep</td>
    <td>Cow</td>
  </tr>
  <tr>
    <td>Elephant</td>
    <td>Bear</td>
    <td>Zebra</td>
    <td>Giraffe</td>
    <td>Backpack</td>
  </tr>
  <tr>
    <td>Umbrella</td>
    <td>Handbag</td>
    <td>Tie</td>
    <td>Suitcase</td>
    <td>Frisbee</td>
  </tr>
  <tr>
    <td>Skis</td>
    <td>Snowboard</td>
    <td>Sports Ball</td>
    <td>Kite</td>
    <td>Baseball Bat</td>
  </tr>
  <tr>
    <td>Baseball Glove</td>
    <td>Skateboard</td>
    <td>Surfboard</td>
    <td>Tennis Racket</td>
    <td>Bottle</td>
  </tr>
  <tr>
    <td>Wine Glass</td>
    <td>Cup</td>
    <td>Fork</td>
    <td>Knife</td>
    <td>Spoon</td>
  </tr>
  <tr>
    <td>Bowl</td>
    <td>Banana</td>
    <td>Apple</td>
    <td>Sandwich</td>
    <td>Orange</td>
  </tr>
  <tr>
    <td>Broccoli</td>
    <td>Carrot</td>
    <td>Hot Dog</td>
    <td>Pizza</td>
    <td>Donut</td>
  </tr>
  <tr>
    <td>Cake</td>
    <td>Chair</td>
    <td>Couch</td>
    <td>Potted Plant</td>
    <td>Bed</td>
  </tr>
  <tr>
    <td>Dining Table</td>
    <td>Toilet</td>
    <td>TV</td>
    <td>Laptop</td>
    <td>Mouse</td>
  </tr>
  <tr>
    <td>Remote</td>
    <td>Keyboard</td>
    <td>Cell Phone</td>
    <td>Microwave</td>
    <td>Oven</td>
  </tr>
  <tr>
    <td>Toaster</td>
    <td>Sink</td>
    <td>Refrigerator</td>
    <td>Book</td>
    <td>Clock</td>
  </tr>
  <tr>
    <td>Vase</td>
    <td>Scissors</td>
    <td>Teddy Bear</td>
    <td>Hair Drier</td>
    <td>Toothbrush</td>
  </tr>
</table>

**Limitations**: The model can only detect objects it was trained on. Objects not in this list (such as specific products, specialized equipment, or uncommon items) may not be detected or might be incorrectly classified as one of the known categories. For specialized detection needs, the model would need to be fine-tuned on custom datasets.

## Tech Stack

### Backend
- Python 3.9+
- FastAPI - High-performance REST API framework
- YOLOv8 - Deep learning-based Object detection model
- OpenCV - Computer Vision library
- Uvicorn - ASGI web server

### Frontend
- React - UI library
- JavaScript
- TailwindCSS - Utility-first CSS framework
- Fetch API for making HTTP requests

## Architecture

- **Backend**: A FastAPI server that hosts the YOLOv8 model and exposes an `/analyze` endpoint for image processing.
- **Frontend**: A React application that handles file uploads, displays results, and provides a responsive UI with dark/light mode toggle.
- **Docker**: Containerization for both frontend and backend services for easy deployment.

## Setup Instructions

### Prerequisites
- Docker and Docker Compose
- Node.js 16+
- Python 3.9+

### Running with Docker (Recommended)
1. Clone the repository
2. Run `docker-compose up --build`
3. Access the application at `http://localhost:3000`

### Manual Setup
1. Backend:
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   uvicorn main:app --reload
   ```

2. Frontend:
   ```bash
   cd frontend
   npm install
   npm start
   ```

## API Documentation
Once the backend is running, visit `http://localhost:8000/docs` for the API documentation.

## License
MIT 