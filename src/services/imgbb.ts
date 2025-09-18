const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY;

export const uploadImageToImgBB = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("image", file);
  formData.append("key", IMGBB_API_KEY);

  try {
    const response = await fetch("https://api.imgbb.com/1/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Error uploading image to ImgBB");
    }

    const data = await response.json();
    return data.data.url;
  } catch (error) {
    console.error("ImgBB upload error:", error);
    throw new Error("Failed to upload image");
  }
};
