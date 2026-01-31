/**
 * Image Upload Utility for Firebase Storage
 */

import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../config/firebase';

/**
 * Uploads an image file to Firebase Storage
 * @param file - The image file to upload
 * @param path - Storage path (e.g., 'products/123' or 'categories/456')
 * @returns The public download URL of the uploaded image
 */
export const uploadImage = async (
  file: File,
  path: string
): Promise<string> => {
  try {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      throw new Error('File must be an image');
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new Error('Image size must be less than 5MB');
    }

    // Create storage reference
    const timestamp = Date.now();
    const fileName = `${timestamp}_${file.name}`;
    const storageRef = ref(storage, `${path}/${fileName}`);

    // Upload file
    await uploadBytes(storageRef, file);

    // Get download URL
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error: any) {
    console.error('Error uploading image:', error);
    throw new Error(error.message || 'Failed to upload image');
  }
};

/**
 * Uploads multiple images
 * @param files - Array of image files
 * @param path - Storage path
 * @returns Array of download URLs
 */
export const uploadMultipleImages = async (
  files: File[],
  path: string
): Promise<string[]> => {
  try {
    const uploadPromises = files.map((file) => uploadImage(file, path));
    const urls = await Promise.all(uploadPromises);
    return urls;
  } catch (error: any) {
    console.error('Error uploading images:', error);
    throw new Error(error.message || 'Failed to upload images');
  }
};

/**
 * Deletes an image from Firebase Storage
 * @param url - The download URL of the image to delete
 */
export const deleteImage = async (url: string): Promise<void> => {
  try {
    // Validate URL is a string
    if (!url) {
      console.warn('deleteImage called with empty/null URL, skipping');
      return;
    }
    
    if (typeof url !== 'string') {
      console.warn('deleteImage called with non-string URL:', typeof url, url);
      return;
    }

    // Trim and validate
    const trimmedUrl = url.trim();
    if (!trimmedUrl) {
      console.warn('deleteImage called with empty string URL, skipping');
      return;
    }

    // Check if it's a Firebase Storage URL
    if (!trimmedUrl.includes('firebasestorage.googleapis.com')) {
      // Not a Firebase Storage URL, skip deletion (not an error)
      console.log('URL is not a Firebase Storage URL, skipping deletion:', trimmedUrl);
      return;
    }

    // Extract path from URL
    // Firebase Storage URLs format: https://firebasestorage.googleapis.com/v0/b/{bucket}/o/{path}?alt=media&token=...
    try {
      const urlObj = new URL(trimmedUrl);
      
      // Extract path from pathname: /v0/b/{bucket}/o/{encodedPath}
      // The path after /o/ is URL encoded
      const pathname = urlObj.pathname;
      const oIndex = pathname.indexOf('/o/');
      
      if (oIndex === -1) {
        console.warn('Invalid Firebase Storage URL format - /o/ not found:', trimmedUrl);
        return;
      }
      
      // Get everything after /o/ (before query string if any)
      const afterO = pathname.substring(oIndex + 3); // +3 to skip '/o/'
      const encodedPath = afterO.split('?')[0]; // Remove query string if present
      
      if (!encodedPath) {
        console.warn('Invalid Firebase Storage URL format - no path after /o/:', trimmedUrl);
        return;
      }
      let decodedPath: string;
      
      try {
        decodedPath = decodeURIComponent(encodedPath);
      } catch (decodeError) {
        // If decode fails, try using the encoded path directly
        console.warn('Error decoding path, using encoded path:', decodeError);
        decodedPath = encodedPath;
      }

      // Create reference and delete
      const imageRef = ref(storage, decodedPath);
      await deleteObject(imageRef);
      console.log('Successfully deleted image:', decodedPath);
    } catch (urlError: any) {
      console.warn('Error parsing/deleting image URL:', urlError);
      console.warn('URL was:', trimmedUrl);
      // Don't throw - just log and continue
      return;
    }
  } catch (error: any) {
    console.error('Error deleting image:', error);
    // Don't throw - let the caller handle it if needed
    // This prevents deletion failures from blocking category deletion
  }
};
