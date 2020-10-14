import JsEncrypt from 'jsencrypt'

// 加密方法
export const RSAencrypt = (val, key) => {
  let jse = new JsEncrypt()
  jse.setPublicKey(key)
  return jse.encrypt(val)
}

// 解密方法
export const RSAdecrypt = (val, key) => {
  let jse = new JsEncrypt()
  jse.setPrivateKey(key)
  return jse.decrypt(val)
}
