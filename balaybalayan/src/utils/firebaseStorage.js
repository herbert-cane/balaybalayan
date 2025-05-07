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
  export const uploadDormLogo = async (file, userId) => {
    if (!file) throw new Error("No file selected");
  
    const storageRef = ref(storage, `dorm_logos/${userId}`); 
  
    try {
      const snapshot = await uploadBytes(storageRef, file);
      

      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
    } catch (error) {
      console.error("Upload error:", error);
      throw error;
    }
  };  export const uploadCarouselPic = async (file, userId) => {
    if (!file) throw new Error("No file selected");
  
    const storageRef = ref(storage, `dorm_carousel_pic/${userId}`); 
  
    try {
      const snapshot = await uploadBytes(storageRef, file);
      

      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
    } catch (error) {
      console.error("Upload error:", error);
      throw error;
    }
  };

export const uploadForm5 = async (file, userId) => {
  if (!file) return '';
  
  const storageRef = ref(storage, `form5/${userId}/${file.name}`);
  await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(storageRef);
  return downloadURL;
};