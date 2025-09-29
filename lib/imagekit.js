export const uploadToImageKit = async (file, fileName) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("fileName", fileName);

    const reponse = await fetch("/api/imagekit/upload", {
      method: "POST",
      body: formData,
    });

    if (!reponse.ok) {
      const errorData = await reponse.json();
      throw new Error(errorData.error || "Failed to upload image");
    }

    const result = await reponse.json();

    return {
      success: true,
      data: {
        fileId: result.fileId,
        name: result.name,
        url: result.url,
        size: result.size,
        width: result.width,
        height: result.height,
      },
    };
  } catch (error) {
    console.error("Upload to ImageKit failed:", error);
    return { success: false, error: error.message || "Upload failed" };
  }
};
