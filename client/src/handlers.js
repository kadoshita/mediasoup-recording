export const onLoad = async (state, { $recStart }) => {
  console.log("loaded");
};

export const onClickMicCapture = async (
  state,
  { $micCapture, $micAudio, $recStart }
) => {
  console.log("capturing mic.");
  const ctx = new AudioContext();
  let fakeAudioBuffer = null;
  const res = await fetch('bgm.mp3');
  const arrayBuffer = await res.arrayBuffer();
  const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
  fakeAudioBuffer = audioBuffer;
  const source = ctx.createBufferSource();
  source.loop = true;
  source.buffer = fakeAudioBuffer;
  const mediaStreamDest = ctx.createMediaStreamDestination();
  source.connect(mediaStreamDest);
  source.start();
  const { stream } = mediaStreamDest;
  $micAudio.srcObject = stream;
  $micAudio.play();

  state.track = stream.getTracks()[0];
  $micCapture.disabled = true;

  console.log("captured!");
};

export const onClickRecStart = async (state, _, { tNum, pNum }) => {
  console.log(`add ${tNum} transports w/ ${pNum} producers`);
  const { client, track } = state;

  await client.start(track, { tNum, pNum });
};
