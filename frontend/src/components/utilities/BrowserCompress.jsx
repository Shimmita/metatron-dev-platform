import imageCompression from "browser-image-compression";

async function BrowserCompress(file) {
  try {
    // Compress the image
    const compressedFile = await imageCompression(file, {
      maxSizeMB: 1, // Maximum size in MB
      maxWidthOrHeight: 500, // Maximum width or height in pixels
      useWebWorker: true, // Enable multi-threading
    });

    // return the compressed file
    return compressedFile;
  } catch (error) {
    console.log("something went wrong while compressing the file", error);
  }
}

export default BrowserCompress;
