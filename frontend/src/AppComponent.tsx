import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';

interface Detection {
  class_name: string;
  confidence: number;
  count: number;
}

interface AnalysisResponse {
  detections: Detection[];
  total_objects: number;
}

function App() {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<AnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onDrop = async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setLoading(true);
      setError(null);
      setResults(null);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Upload and analyze
      const formData = new FormData();
      formData.append('file', file);

      try {
        const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';
        const response = await axios.post<AnalysisResponse>(
          `${apiUrl}/analyze`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );
        setResults(response.data);
      } catch (err) {
        setError('Error analyzing image. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png']
    },
    maxFiles: 1
  });

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          TagNCount
        </h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
              ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}`}
          >
            <input {...getInputProps()} />
            {loading ? (
              <p className="text-gray-600">Analyzing image...</p>
            ) : isDragActive ? (
              <p className="text-blue-500">Drop the image here...</p>
            ) : (
              <p className="text-gray-600">
                Drag and drop an image here, or click to select one
              </p>
            )}
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {image && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Preview</h2>
            <img
              src={image}
              alt="Preview"
              className="max-w-full h-auto rounded-lg"
            />
          </div>
        )}

        {results && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Analysis Results</h2>
            <p className="text-lg mb-4">
              Total objects detected: <span className="font-bold">{results.total_objects}</span>
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {results.detections.map((detection, index) => (
                <div
                  key={index}
                  className="bg-gray-50 p-4 rounded-lg"
                >
                  <h3 className="font-semibold text-lg capitalize">
                    {detection.class_name}
                  </h3>
                  <p>Count: {detection.count}</p>
                  <p>Confidence: {(detection.confidence * 100).toFixed(1)}%</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App; 