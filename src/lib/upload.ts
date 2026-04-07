import cloudinary from "./cloudinary";

export const uploadToCloudinary = async (fileUrl: string | null, folder: string) => {
  if (!fileUrl) return fileUrl;
  
  // Only upload if it's a base64 data URL
  if (!fileUrl.startsWith("data:")) return fileUrl;

  try {
    const uploadRes = await cloudinary.uploader.upload(fileUrl, {
      folder: `portfolio/${folder}`,
      resource_type: "auto", // Automatically detect image, video, or raw (raw for PDF etc)
    });
    return uploadRes.secure_url;
  } catch (err) {
    console.error(`Cloudinary Upload Error (${folder}):`, err);
    return fileUrl; // Fallback to original (which is base64, might fail DB limit though)
  }
};
