import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase";

export const uploadProfilePhoto = async (file, userId) => {
    if (!file) throw new Error("No file selected");
  
    const storageRef = ref(storage, `profile_photos/${userId}`); 
  
    try {
      const snapshot = await uploadBytes(storageRef, file);
      

      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
    } catch (error) {
      console.error("Upload error:", error);
      throw error;
    }
  };
  