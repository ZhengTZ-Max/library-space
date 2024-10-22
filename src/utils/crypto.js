/*
 *  crypto.js
 **/

// npm install crypto-js

/**
 * AES 对称加密（不安全）
 */
// let CryptoJS = require("crypto-js");
import CryptoJS from 'crypto-js'

export default {
  /**
   * 接口数据加密函数
   * @param str string 需加密的json字符串
   * @param key string 加密key(16位)
   * @param iv string 加密向量(16位)
   * @return string 加密密文字符串
   */
  encrypt(str, key, iv) {
    //密钥16位
    var key = CryptoJS.enc.Utf8.parse(key);
    //加密向量16位
    var iv = CryptoJS.enc.Utf8.parse(iv);
    var encrypted = CryptoJS.AES.encrypt(str, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
    return encrypted.toString();
  },

  /**
   * 接口数据解密函数
   * @param str string 已加密密文
   * @param key string 加密key(16位)
   * @param iv string 加密向量(16位)
   * @returns {*|string} 解密之后的json字符串
   */
  decrypt(str, KEY, IV) {
    var key = CryptoJS.enc.Utf8.parse(KEY);
    var iv = CryptoJS.enc.Utf8.parse(IV);
    var decrypt = CryptoJS.AES.decrypt(str, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
    return decrypt.toString(CryptoJS.enc.Utf8);
  },
};
