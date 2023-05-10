const CryptoJS = require("crypto-js");

const key = CryptoJS.enc.Utf8.parse("1234567890000000"); //16位
const iv = CryptoJS.enc.Utf8.parse("1234567890000000");
// 加密方法
// export function encrypt(word) {
//   let encrypted = "";
//   if (typeof word == "string") {
//     const srcs = CryptoJS.enc.Utf8.parse(word);
//     encrypted = CryptoJS.AES.encrypt(srcs, key, {
//       // iv: [],
//       mode: CryptoJS.mode.ECB,
//       padding: CryptoJS.pad.Pkcs7,
//     });
//   } else if (typeof word == "object") {
//     //对象格式的转成json字符串
//     const data = JSON.stringify(word);
//     const srcs = CryptoJS.enc.Utf8.parse(data);
//     encrypted = CryptoJS.AES.encrypt(srcs, key, {
//       // iv: iv,
//       iv: [],
//       mode: CryptoJS.mode.ECB,
//       padding: CryptoJS.pad.Pkcs7,
//     });
//   }
//   return encrypted.ciphertext.toString(CryptoJS.enc.Base64);
// }

// // 解密方法
// export function decrypt(word) {
//   // console.log('data', word)
//   const decrypt = CryptoJS.AES.decrypt(word, key, {
//     // iv: iv,
//     iv: [],
//     mode: CryptoJS.mode.ECB,
//     padding: CryptoJS.pad.Pkcs7,
//   });
//   const decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
//   return decryptedStr.toString();
// }

//解密方法
export function decrypt(word) {
  var decrypt = CryptoJS.AES.decrypt(word, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  });
  return CryptoJS.enc.Utf8.stringify(decrypt).toString();
}

// 加密方法
export function encrypt(word) {
  var encrypted = CryptoJS.AES.encrypt(word, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  });
  return encrypted.toString();
}
