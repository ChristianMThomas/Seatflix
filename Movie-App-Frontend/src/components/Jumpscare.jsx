import { useEffect } from "react";

const DURATION = 2400;
const SCARE_VOLUME = 0.7;

// Fallback scream for when no jumpscare sound has been added: a falling, distorted sawtooth
// layered over a burst of filtered noise
const synthScream = () => {
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return;
  const ctx = new AudioCtx();
  const now = ctx.currentTime;
  const length = 2.2;

  const out = ctx.createGain();
  out.gain.setValueAtTime(0.0001, now);
  out.gain.exponentialRampToValueAtTime(0.8 * SCARE_VOLUME, now + 0.01);
  out.gain.setValueAtTime(0.8 * SCARE_VOLUME, now + 0.9);
  out.gain.exponentialRampToValueAtTime(0.0001, now + length);
  out.connect(ctx.destination);

  const shriek = ctx.createOscillator();
  shriek.type = "sawtooth";
  shriek.frequency.setValueAtTime(1500, now);
  shriek.frequency.exponentialRampToValueAtTime(900, now + 0.9);
  shriek.frequency.exponentialRampToValueAtTime(240, now + length);
  const wobble = ctx.createOscillator();
  const wobbleDepth = ctx.createGain();
  wobble.frequency.value = 28;
  wobbleDepth.gain.value = 110;
  wobble.connect(wobbleDepth).connect(shriek.frequency);
  shriek.connect(out);

  const noise = ctx.createBufferSource();
  const buffer = ctx.createBuffer(1, ctx.sampleRate * length, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  noise.buffer = buffer;
  const band = ctx.createBiquadFilter();
  band.type = "bandpass";
  band.frequency.setValueAtTime(3200, now);
  band.frequency.exponentialRampToValueAtTime(600, now + length);
  noise.connect(band).connect(out);

  [shriek, wobble, noise].forEach((node) => {
    node.start(now);
    node.stop(now + length);
  });
  setTimeout(() => ctx.close(), (length + 0.2) * 1000);
};

// Lomando-style scare: no build-up, the face is simply there on the next frame with its sound.
// Sound-only scares show nothing and end when the sound does.
const Jumpscare = ({ scare, onDone }) => {
  const { image, sound: soundSrc } = scare;

  useEffect(() => {
    let finished = false;
    const finish = () => {
      finished = true;
      onDone();
    };

    let sound = null;
    if (soundSrc) {
      sound = new Audio(soundSrc);
      sound.volume = SCARE_VOLUME;
      // The synthesized scream belongs to soundless scares only, so a file that fails just stays silent
      sound.play().catch(() => {
        if (!image) finish();
      });
    } else {
      synthScream();
    }

    let timer;
    if (image) timer = setTimeout(finish, DURATION);
    else sound.addEventListener("ended", finish);

    return () => {
      clearTimeout(timer);
      sound?.removeEventListener("ended", finish);
      // Once the face is gone its sound rings out on its own; only cut it if the scare was interrupted
      if (!finished) sound?.pause();
    };
  }, [image, soundSrc, onDone]);

  if (!image) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black overflow-hidden cursor-pointer" role="presentation" onClick={onDone}>
      <img src={image} alt="" draggable="false" className="absolute inset-0 w-full h-full object-cover select-none animate-scare-jolt" />
      {/* Darken the edges so the face fills the view */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(0,0,0,0.85)_100%)]" />
    </div>
  );
};

export default Jumpscare;
