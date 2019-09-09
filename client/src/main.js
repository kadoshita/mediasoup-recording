import Recorder from "./recorder";
import Client from "./client";
import { onLoad, onClickMicCapture, onClickRecStart } from "./handlers";

(async () => {
  const recorder = new Recorder("http://localhost:2345");
  const client = new Client(recorder);

  const state = {
    track: null, // MediaStreamTrack to record
    client
  };

  const els = {
    $micCapture: document.querySelector("[data-mic-capture]"),
    $micAudio: document.querySelector("[data-mic-audio]"),
    $recStart: document.getElementById("record-start-button"),
    $transportsInput: document.getElementById("transports"),
    $producersInput: document.getElementById("producers")
  };

  // attach handlers
  els.$micCapture.onclick = () => onClickMicCapture(state, els);
  els.$recStart.onclick=()=>{
    const tNum=els.$transportsInput.value;
    const pNum=els.$producersInput.value;
    onClickRecStart(state, els, { tNum, pNum });
  };

  onLoad(state, els);
})();
