import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { getTaskByIdAsync, uploadTaskPhotosAsync, selectCurrentTask, selectTasksLoading, selectTasksError } from '../../store/slices/taskSlice';

export default function AddPhotosPage() {
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const task = useAppSelector(selectCurrentTask);
  const isLoading = useAppSelector(selectTasksLoading);
  const error = useAppSelector(selectTasksError);
  
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    if (taskId) {
      dispatch(getTaskByIdAsync(parseInt(taskId)));
    }
  }, [dispatch, taskId]);

  useEffect(() => {
    // Clean up preview URLs when component unmounts
    return () => {
      previewUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    const validFiles: File[] = [];
    const newPreviewUrls: string[] = [];

    Array.from(files).forEach(file => {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert(`${file.name} is not an image file. Please select only image files.`);
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert(`${file.name} is too large. Please select files smaller than 10MB.`);
        return;
      }

      validFiles.push(file);
      newPreviewUrls.push(URL.createObjectURL(file));
    });

    // Check total files limit (max 10 images)
    if (selectedFiles.length + validFiles.length > 10) {
      alert('You can upload a maximum of 10 images per task.');
      return;
    }

    setSelectedFiles(prev => [...prev, ...validFiles]);
    setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    handleFileSelect(files);
  };

  const removeFile = (index: number) => {
    URL.revokeObjectURL(previewUrls[index]);
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (!taskId || selectedFiles.length === 0) return;

    setUploading(true);
    try {
      await dispatch(uploadTaskPhotosAsync({
        taskId: parseInt(taskId),
        photos: selectedFiles
      })).unwrap();

      // Clear selected files after successful upload
      setSelectedFiles([]);
      previewUrls.forEach(url => URL.revokeObjectURL(url));
      setPreviewUrls([]);

      // Navigate back to task details
      navigate(`/customer/tasks/${taskId}`);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  if (isLoading && !task) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading task...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">⚠️</div>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Task not found</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="inline-flex items-center text-gray-600 hover:text-gray-900"
              >
                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Add Photos</h1>
                <p className="mt-2 text-gray-600">Add images to help taskers understand your task better.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Task Info */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">{task.title}</h2>
          <p className="text-gray-600">{task.description}</p>
        </div>

        {/* Upload Area */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Upload Images</h3>
            <p className="text-sm text-gray-600">
              Add up to 10 images (JPG, PNG, GIF). Maximum file size: 10MB per image.
            </p>
          </div>

          {/* Drag and Drop Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive
                ? 'border-blue-400 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div className="mt-4">
              <label htmlFor="file-upload" className="cursor-pointer">
                <span className="mt-2 block text-sm font-medium text-gray-900">
                  Drag and drop images here, or{' '}
                  <span className="text-blue-600 hover:text-blue-500">browse</span>
                </span>
                <input
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  className="sr-only"
                  multiple
                  accept="image/*"
                  onChange={(e) => handleFileSelect(e.target.files)}
                />
              </label>
              <p className="mt-1 text-xs text-gray-500">PNG, JPG, GIF up to 10MB each</p>
            </div>
          </div>

          {/* Selected Files Preview */}
          {selectedFiles.length > 0 && (
            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-900 mb-4">
                Selected Images ({selectedFiles.length}/10)
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={previewUrls[index]}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button
                      onClick={() => removeFile(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ×
                    </button>
                    <p className="mt-1 text-xs text-gray-600 truncate">{file.name}</p>
                    <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(1)} MB</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-8 flex justify-end space-x-4">
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              onClick={handleUpload}
              disabled={selectedFiles.length === 0 || uploading}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Uploading...
                </>
              ) : (
                `Upload ${selectedFiles.length} Image${selectedFiles.length !== 1 ? 's' : ''}`
              )}
            </button>
          </div>

          {/* Tips */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h4 className="text-sm font-medium text-blue-800">Tips for better images</h4>
                <ul className="mt-2 text-sm text-blue-700 list-disc list-inside space-y-1">
                  <li>Take clear, well-lit photos that show the task area or items clearly</li>
                  <li>Include multiple angles to give taskers a complete view</li>
                  <li>Show any specific details or problem areas that need attention</li>
                  <li>Remove any personal or sensitive information from photos</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
