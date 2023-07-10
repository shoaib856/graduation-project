function base64ToImg(base64String) {
  const byteString = atob(base64String);
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ia], { type: "image/png" });
}

export default base64ToImg;
