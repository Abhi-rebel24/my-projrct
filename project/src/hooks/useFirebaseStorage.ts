import { useState, useEffect } from 'react';
import { 
  ref, 
  uploadBytesResumable, 
  getDownloadURL, 
  listAll, 
  getMetadata 
} from 'firebase/storage';
import { storage } from '../config/firebase';
import { FileItem, UploadProgress, FolderType } from '../types';

export const useFirebaseStorage = () => {
  const [files, setFiles] = useState<Record<FolderType, FileItem[]>>({
    public: [],
    private: []
  });
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress[]>([]);

  const uploadFile = (file: File, folder: FolderType): Promise<string> => {
    return new Promise((resolve, reject) => {
      const fileName = `${Date.now()}_${file.name}`;
      const storageRef = ref(storage, `${folder}/${fileName}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      const progressItem: UploadProgress = {
        fileName: file.name,
        progress: 0,
        isComplete: false
      };

      setUploadProgress(prev => [...prev, progressItem]);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(prev =>
            prev.map(item =>
              item.fileName === file.name
                ? { ...item, progress: Math.round(progress) }
                : item
            )
          );
        },
        (error) => {
          setUploadProgress(prev =>
            prev.filter(item => item.fileName !== file.name)
          );
          reject(error);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            setUploadProgress(prev =>
              prev.map(item =>
                item.fileName === file.name
                  ? { ...item, isComplete: true }
                  : item
              )
            );
            
            setTimeout(() => {
              setUploadProgress(prev =>
                prev.filter(item => item.fileName !== file.name)
              );
            }, 2000);
            
            await fetchFiles(folder);
            resolve(downloadURL);
          } catch (error) {
            reject(error);
          }
        }
      );
    });
  };

  const fetchFiles = async (folder: FolderType) => {
    setLoading(true);
    try {
      const listRef = ref(storage, folder);
      const result = await listAll(listRef);
      
      const filePromises = result.items.map(async (itemRef) => {
        const [url, metadata] = await Promise.all([
          getDownloadURL(itemRef),
          getMetadata(itemRef)
        ]);
        
        const isImage = metadata.contentType?.startsWith('image/') || false;
        
        return {
          id: itemRef.name,
          name: itemRef.name.split('_').slice(1).join('_'),
          url,
          size: metadata.size,
          type: metadata.contentType || 'unknown',
          uploadedAt: new Date(metadata.timeCreated),
          isImage
        };
      });
      
      const fileList = await Promise.all(filePromises);
      setFiles(prev => ({ ...prev, [folder]: fileList }));
    } catch (error) {
      console.error('Error fetching files:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchFiles('public');
  }, []);

  return {
    files,
    loading,
    uploadProgress,
    uploadFile,
    fetchFiles
  };
};