const API_BASE_URL = import.meta.env.VITE_SEATFLIX_API_URL;

const MAX_INPUT_BYTES = 15 * 1024 * 1024;
const OUTPUT_SIZE = 512;

// Avatars are full R2 URLs; legacy ones were API-relative "/uploads/..."; the default is a bare "user.png"
export const avatarUrl = (profilePic) => {
  if (profilePic?.startsWith("http")) return profilePic;
  if (profilePic?.startsWith("/")) return `${API_BASE_URL}${profilePic}`;
  return "/user.png";
};

export const hasCustomAvatar = (profilePic) => !!profilePic && profilePic !== "user.png";

// Center-crop to a square and re-encode as a JPEG of at most 512px. This keeps uploads small
// and strips EXIF metadata (including GPS location) before the photo leaves the browser.
export const prepareAvatar = (file) =>
  new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      reject(new Error("Please choose an image file."));
      return;
    }
    if (file.size > MAX_INPUT_BYTES) {
      reject(new Error("That image is too large. Please choose one under 15 MB."));
      return;
    }

    const url = URL.createObjectURL(file);
    const image = new Image();

    image.onload = () => {
      const side = Math.min(image.naturalWidth, image.naturalHeight);
      const size = Math.min(OUTPUT_SIZE, side);
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;

      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#16161f"; // backfill transparent PNGs, since JPEG has no alpha
      ctx.fillRect(0, 0, size, size);
      ctx.drawImage(
        image,
        (image.naturalWidth - side) / 2,
        (image.naturalHeight - side) / 2,
        side,
        side,
        0,
        0,
        size,
        size
      );
      URL.revokeObjectURL(url);

      canvas.toBlob(
        (blob) => (blob ? resolve(blob) : reject(new Error("Couldn't process that image."))),
        "image/jpeg",
        0.9
      );
    };

    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Couldn't read that image. Try a JPG, PNG or WebP."));
    };

    image.src = url;
  });
