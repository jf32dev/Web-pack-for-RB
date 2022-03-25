/**
 *
 * BIGTINCAN - CONFIDENTIAL
 *
 * All Rights Reserved.
 *
 * NOTICE: All information contained herein is, and remains the property of BigTinCan Mobile Pty Ltd and its suppliers,
 * if any. The intellectual and technical concepts contained herein are proprietary to BigTinCan Mobile Pty Ltd and its
 * suppliers and may be covered by U.S. and Foreign Patents, patents in process, and are protected by trade secret or
 * copyright law. Dissemination of this information or reproduction of this material is strictly forbidden unless prior
 * written permission is obtained from BigTinCan Mobile Pty Ltd.
 *
 * @package style-guide
 * @copyright 2010-2018 BigTinCan Mobile Pty Ltd
 * @author Jason Huang <jason.huang@bigtincan.com>
 */

/* eslint-disable no-plusplus */

function writeUTFBytes(dataview, offset, string) {
  for (let i = 0; i < string.length; i++) {
    dataview.setUint8(offset + i, string.charCodeAt(i));
  }
}

function mergeBuffers(buffer, length) {
  const result = new Float64Array(length);
  let offset = 0;
  for (let i = 0; i < buffer.length; i++) {
    const inner = buffer[i];
    result.set(inner, offset);
    offset += inner.length;
  }
  return result;
}

function interleave(left) {
  const length = left.length;// + right.length;
  const result = new Float64Array(length);
  let inputIndex = 0;
  for (let i = 0; i < length;) {
    result[i++] = left[inputIndex];
    //result[i++] = right[inputIndex];
    inputIndex++;
  }
  return result;
}

function encodeWAV(interleaved, sampleRate, volume = 1) {
  const buffer = new ArrayBuffer(44 + interleaved.length * 2);
  const view = new DataView(buffer);
  const sampleRateTmp = sampleRate;
  const sampleBits = 16;
  const channelCount = 1;

  writeUTFBytes(view, 0, 'RIFF');
  view.setUint32(4, 44 + interleaved.length * 2, true);
  writeUTFBytes(view, 8, 'WAVE');

  writeUTFBytes(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, channelCount, true);
  view.setUint32(24, sampleRateTmp, true);
  view.setUint32(28, sampleRateTmp * channelCount * (sampleBits / 8), true);
  view.setUint16(32, channelCount * (sampleBits / 8), true);
  view.setUint16(34, sampleBits, true);

  writeUTFBytes(view, 36, 'data');
  view.setUint32(40, interleaved.length * 2, true);

  interleaved.forEach((sample, index) => {
    view.setInt16(44 + (index * 2), sample * (0x7fff * volume), true);
  });

  const audioData = new Blob([view], { type: 'audio/wav' });
  return audioData;
}

function downSampleBuffer(buffer, rate, sampleRate) {
  if (rate >= sampleRate) {
    return buffer;
  }

  const sampleRateRatio = sampleRate / rate;
  const newLength = Math.round(buffer.length / sampleRateRatio);
  const result = new Float32Array(newLength);
  let offsetResult = 0;
  let offsetBuffer = 0;
  while (offsetResult < result.length) {
    const nextOffsetBuffer = Math.round((offsetResult + 1) * sampleRateRatio);
    let accum = 0;
    let count = 0;
    for (let i = offsetBuffer; i < nextOffsetBuffer && i < buffer.length; i++) {
      accum += buffer[i];
      count++;
    }
    result[offsetResult] = accum / count;
    offsetResult++;
    offsetBuffer = nextOffsetBuffer;
  }
  return result;
}

export default function exportWAV(buffers, bufferLength, sampleRate, rate) {
  const bufferL = mergeBuffers(buffers[0], bufferLength);
  //const bufferR = mergeBuffers(buffers[1], bufferLength);
  const interleaved = interleave(bufferL);//, bufferR);
  const downSampledBuffer = downSampleBuffer(interleaved, rate, sampleRate);
  return encodeWAV(downSampledBuffer, rate);
}
