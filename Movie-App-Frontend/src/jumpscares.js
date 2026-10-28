// Scares, one picked at random each time. Assets live in public/. An entry with an image flashes
// it full screen with its sound; a sound-only entry just plays out of nowhere. An image without a
// sound gets a synthesized scream; entries with a sound never use it, even if the file fails.
export const SCARES = [
  { image: "/scares/door-open.jpg", sound: "/audio/door-creak-long.mp3" },
  { image: "/scares/freddy.jpg", sound: "/audio/freddys-laugh.mp3" },
  { image: "/jumpscare1.jpg", sound: "/audio/thump.mp3" },
  { sound: "/audio/i-see-you.mp3" },
  { sound: "/audio/knock.mp3" },
];

export const randomScare = () => SCARES[Math.floor(Math.random() * SCARES.length)];

// Load the assets ahead of time so the scare appears on the very first frame instead of
// popping in while the image downloads
export const preloadScares = () => {
  SCARES.forEach(({ image, sound }) => {
    if (image) new Image().src = image;
    if (sound) {
      const audio = new Audio();
      audio.preload = "auto";
      audio.src = sound;
    }
  });
};
