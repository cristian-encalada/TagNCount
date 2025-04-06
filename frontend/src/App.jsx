import React, { useState, useRef, useEffect } from 'react';

const Logo = ({ darkMode }) => (
  <div className="flex items-center">
    <img 
      src={darkMode ? "/logo-dark.svg" : "/logo.svg"}
      alt="TagNCount Logo" 
      className="mr-3 h-10" 
    />
    <span className={`text-4xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
      TagNCount
    </span>
  </div>
);

function App() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [darkMode, setDarkMode] = useState(false); // Default to light mode
  const fileInputRef = useRef(null);
  
  // Apply theme class to body on mount and when theme changes
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);
  
  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };
  
  const onFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      files.forEach(file => handleFile(file));
    }
  };

  const handleFile = (file) => {
    // Only process image files
    if (!file.type.startsWith('image/')) {
      return;
    }
    
    // Create preview immediately
    const reader = new FileReader();
    reader.onload = () => {
      // Add new image to the list with a pending status
      const newImage = {
        id: Date.now().toString(),
        originalSrc: reader.result,
        file: file,
        name: file.name,
        loading: true,
        error: null,
        results: null,
        annotatedSrc: null
      };
      
      setImages(prevImages => [...prevImages, newImage]);
      
      // Upload and analyze the image
      analyzeImage(newImage);
    };
    reader.readAsDataURL(file);
  };
  
  const analyzeImage = async (imageData) => {
    setLoading(true);
    
    try {
      const formData = new FormData();
      formData.append('file', imageData.file);
      
      const response = await fetch('http://localhost:8000/analyze', {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      
      // Update the images array with the analysis results
      setImages(prevImages => prevImages.map(img => 
        img.id === imageData.id ? {
          ...img,
          loading: false,
          results: data,
          annotatedSrc: `data:image/jpeg;base64,${data.annotated_image}`
        } : img
      ));
    } catch (err) {
      console.error('Error analyzing image:', err);
      
      // Update the image with error information
      setImages(prevImages => prevImages.map(img => 
        img.id === imageData.id ? {
          ...img,
          loading: false,
          error: 'Error analyzing image'
        } : img
      ));
    } finally {
      setLoading(false);
    }
  };
  
  const removeImage = (id) => {
    setImages(prevImages => prevImages.filter(img => img.id !== id));
  };

  // Drag and drop handlers
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) setIsDragging(true);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    files.forEach(file => handleFile(file));
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <div className={`min-h-screen transition-colors duration-200 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'}`}>
      <div className="py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <Logo darkMode={darkMode} />
            <button 
              onClick={toggleTheme}
              className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 text-yellow-300' : 'bg-gray-200 text-gray-800'}`}
              aria-label="Toggle dark/light mode"
            >
              {darkMode ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
          </div>
          
          <div className={`rounded-lg shadow-lg p-6 mb-8 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div 
              className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors
                ${isDragging 
                  ? 'border-blue-500 bg-blue-900/20' 
                  : darkMode 
                    ? 'border-gray-600 hover:border-gray-500' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              onDragEnter={handleDragEnter}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={triggerFileInput}
            >
              <input 
                type="file" 
                accept="image/*" 
                onChange={onFileChange}
                className="hidden"
                multiple
                ref={fileInputRef}
              />
              
              <div className="flex flex-col items-center justify-center">
                <svg className={`w-16 h-16 mb-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                
                {loading ? (
                  <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Analyzing image(s)...</p>
                ) : (
                  <>
                    <p className={`text-lg font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      Drag and drop your images here
                    </p>
                    <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                      or click to browse your files
                    </p>
                    <p className={`text-sm mt-2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                      Supports: JPG, PNG, GIF, etc.
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>

          {images.length > 0 && (
            <div className="grid grid-cols-1 gap-8">
              {images.map(image => (
                <div key={image.id} className={`rounded-lg shadow-lg p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className={`text-2xl font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      {image.name}
                    </h2>
                    <button 
                      onClick={() => removeImage(image.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Remove
                    </button>
                  </div>
                  
                  {image.loading ? (
                    <div className="text-center p-4">
                      <p>Analyzing image...</p>
                    </div>
                  ) : image.error ? (
                    <div className="bg-red-900/20 border border-red-500 text-red-400 px-4 py-3 rounded mb-4">
                      {image.error}
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div>
                          <h3 className={`text-lg font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Original Image</h3>
                          <img
                            src={image.originalSrc}
                            alt="Original"
                            className="max-w-full h-auto rounded-lg"
                          />
                        </div>
                        
                        {image.annotatedSrc && (
                          <div>
                            <h3 className={`text-lg font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Detected Objects</h3>
                            <img
                              src={image.annotatedSrc}
                              alt="Annotated"
                              className="max-w-full h-auto rounded-lg"
                            />
                          </div>
                        )}
                      </div>
                      
                      {image.results && (
                        <div>
                          <h3 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>Analysis Results</h3>
                          <p className={`text-lg mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            Total objects detected: <span className="font-bold">{image.results.total_objects}</span>
                          </p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {image.results.detections.map((detection, index) => (
                              <div
                                key={index}
                                className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}
                              >
                                <h4 className={`font-semibold text-lg capitalize ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                                  {detection.class_name}
                                </h4>
                                <p>Count: {detection.count}</p>
                                <p>Confidence: {(detection.confidence * 100).toFixed(1)}%</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;