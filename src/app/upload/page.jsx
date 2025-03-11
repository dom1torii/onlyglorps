// src/app/upload/page.js
'use client'; // Mark this as a Client Component
import { useEffect } from 'react';
import { useSession } from 'next-auth/react';

import { useState } from 'react';

export default function UploadPage() {
  const [name, setName] = useState('');
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [previewUrl, setPreviewUrl] = useState(null); // State for image preview URL
  

  // Handle file input change
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);

      // Generate a preview URL for the selected file
      const fileUrl = URL.createObjectURL(selectedFile);
      setPreviewUrl(fileUrl);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', name);
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload file');
      }

      const result = await response.json();
      if (result.success) {
        setMessage('Image uploaded successfully!');
        // Clear the form and preview after successful upload
        setName('');
        setFile(null);
        setPreviewUrl(null);
      } else {
        setMessage('Failed to upload image.');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      setMessage('An error occurred while uploading the file.');
    }
  };

    const { data: session } = useSession();
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      if (session) {
        // Fetch subscription status from the API route
        fetch('/api/subscription')
          .then((response) => response.json())
          .then((data) => {
            setIsSubscribed(data.isSubscribed);
            setLoading(false);
          })
          .catch((error) => {
            console.error('Error:', error);
            setLoading(false);
          });
      }
    }, [session]);
  
    if (!session) {
      return <p>Please log in to view your profile.</p>;
    }
  
    if (loading) {
      return <p>Loading subscription status...</p>;
    }

  return (
    <div className='w-full min-h-[calc(100vh-5rem)] flex items-center justify-center flex-col gap-4'>
      <h1 className='text-5xl py-5'>Upload your glorp</h1>
      {isSubscribed ? (
        <form onSubmit={handleSubmit} className='flex flex-col gap-3 items-center'>
            <div>
            <label>Image Name: </label>
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className='bg-[#19230b] rounded-md p-2'
                placeholder='Input image name'
            />
            </div>
            <div>
            <label>Choose Image: </label>
            <input
                type="file"
                onChange={handleFileChange} // Use the new handler
                accept="image/*" // Allow only image files
                required
                className='bg-[#19230b] rounded-md p-2 cursor-pointer'
            />
            </div>
            {/* Display the image preview */}
            {previewUrl && (
            <div>
                <h2 className='text-center'>Preview:</h2>
                <img
                src={previewUrl}
                alt="Preview"
                style={{ maxWidth: '100%', height: 'auto', maxHeight: '300px' }}
                className='rounded-md'
                />
            </div>
            )}
            <button type="submit" className='bg-[#19230b] rounded-md p-2 cursor-pointer hover:bg-[#17200b]'>Upload</button>
        </form>
      ) : (
        <div>Subscribe to be able to upload</div>
      )}

      {message && <p>{message}</p>}
    </div>
  );
}