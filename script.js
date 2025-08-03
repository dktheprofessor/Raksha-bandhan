// index.html functionality
document.addEventListener('DOMContentLoaded', function() {
  // Form handling code (same as previous index.js)
  const form = document.getElementById('rakhiForm');
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Generate URL
    const baseUrl = window.location.href.split('index.html')[0] + 'rakhi.html';
    const url = new URL(baseUrl);
    
    url.searchParams.set('name', document.getElementById('name').value);
    url.searchParams.set('msg', document.getElementById('message').value);
    url.searchParams.set('rakhi', document.getElementById('rakhi').value);
    
    document.getElementById('generatedLink').innerHTML = `
      <a href="${url.href}" target="_blank">${url.href}</a>
    `;
    document.getElementById('resultContainer').style.display = 'block';
  });
});

// rakhi.html functionality
if (document.querySelector('.input_video')) {
  const hands = new Hands({
    locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
  });

  hands.setOptions({
    maxNumHands: 1,
    modelComplexity: 1,
    minDetectionConfidence: 0.7,
    minTrackingConfidence: 0.7
  });

  const videoElement = document.querySelector('.input_video');
  const canvasElement = document.querySelector('.output_canvas');
  const canvasCtx = canvasElement.getContext('2d');
  
  // Get URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const rakhiImg = new Image();
  rakhiImg.src = urlParams.get('rakhi') || 'rakhi1.png';

  let camera;
  hands.onResults((results) => {
    // Hand detection and rakhi placement logic
    if (results.multiHandLandmarks) {
      const landmarks = results.multiHandLandmarks[0];
      const wrist = landmarks[0];
      
      // Draw rakhi on wrist position
      const x = wrist.x * canvasElement.width;
      const y = wrist.y * canvasElement.height;
      
      canvasCtx.drawImage(rakhiImg, x-50, y-50, 100, 100);
    }
  });

  document.getElementById('startBtn').addEventListener('click', () => {
    camera = new Camera(videoElement, {
      onFrame: async () => {
        await hands.send({ image: videoElement });
      },
      width: 640,
      height: 480
    });
    camera.start();
  });
}