feather.replace();

if (!navigator.mediaDevices && !navigator.mediaDevices.getUserMedia) {
  alert("Media devices is not supported");
}

const controls = document.querySelector(".controls");
const cameraOptions = document.querySelector(".video-options>select");
const video = document.querySelector("video");
const canvas = document.querySelector("canvas");
const buttons = [...controls.querySelectorAll("button")];
const textArea = document.getElementById("recognitionLog");

let streamStarted = false;
let streamInterval;

const [play, pause] = buttons;

const constraints = {
  video: {
    width: {
      min: 1280,
      ideal: 1920,
      max: 2560,
    },
    height: {
      min: 720,
      ideal: 1080,
      max: 1440,
    },
  },
};

cameraOptions.onchange = () => {
  const updatedConstraints = {
    ...constraints,
    deviceId: {
      exact: cameraOptions.value,
    },
  };

  startStream(updatedConstraints);
};

play.onclick = () => {
  if (streamStarted) {
    video.play();
    play.classList.add("d-none");
    pause.classList.remove("d-none");
    return;
  }

  const updatedConstraints = {
    ...constraints,
    deviceId: {
      exact: cameraOptions.value,
    },
  };

  startStream(updatedConstraints);
};

const pauseStream = () => {
  video.pause();
  play.classList.remove("d-none");
  pause.classList.add("d-none");
  streamStarted = false;
  clearInterval(streamInterval);
};

const capturePicture = () => {
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas.getContext("2d").drawImage(video, 0, 0);
  return canvas.toDataURL("image/jpeg");
};

const performRecognition = async () => {
  await recognize(capturePicture());
};

const recognize = async (imageData) => {
  try {
    const res = await fetch("/recognize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageData }),
    });

    const content = await res.json();
    console.log(content);

    if (content.message.length >= 1) textArea.value = content.message;
  } catch (error) {
    console.error(error.message || error);
  }
};

pause.onclick = pauseStream;

const startStream = async (constraints) => {
  streamStarted = true;
  const stream = await navigator.mediaDevices.getUserMedia(constraints);
  handleStream(stream);
  streamInterval = setInterval(await performRecognition, 4000);
};

const handleStream = (stream) => {
  video.srcObject = stream;
  play.classList.add("d-none");
  pause.classList.remove("d-none");
};

const getCameraSelection = async () => {
  const devices = await navigator.mediaDevices.enumerateDevices();
  const videoDevices = devices.filter((device) => device.kind === "videoinput");
  const options = videoDevices.map((videoDevice) => {
    return `<option value="${videoDevice.deviceId}">${videoDevice.label}</option>`;
  });

  if (videoDevices.length <= 1) {
    cameraOptions.hidden = true;
    return;
  }
  cameraOptions.innerHTML = options.join("");
};

getCameraSelection();
