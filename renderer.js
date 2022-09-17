/**
 * This file is loaded via the <script> tag in the index.html file and will
 * be executed in the renderer process for that window. No Node.js APIs are
 * available in this process because `nodeIntegration` is turned off and
 * `contextIsolation` is turned on. Use the contextBridge API in `preload.js`
 * to expose Node.js functionality from the main process.
 */

document.getElementById("start_record").addEventListener("click", async (e) => {
  const sid = await window.requires.prepare_record();
  if(sid){
    const video = document.getElementById("video");
    const vstream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        mandatory: {
          chromeMediaSource: 'desktop',
          chromeMediaSourceId: sid,
        }
      }
    });
    const chunks = [];
    video.srcObject = vstream;
    video.onloadedmetadata = e => video.play();
    const recorder = new MediaRecorder(vstream, {mimeType: "video/webm"});
    recorder.addEventListener("dataavailable", e => chunks.push(e.data));
    recorder.addEventListener("stop", async (e) => {
      const a = document.createElement("a");
      a.href = URL.createObjectURL(new Blob(chunks));
      a.download = "test.webm";
      a.click();
      URL.revokeObjectURL(a.href);
    });
    recorder.start(100);
    await new Promise(r => setTimeout(r, 5000));
    recorder.stop();
  }else{
    alert("Record Window Not Found!");
  }
});