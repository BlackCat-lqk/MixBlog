/**
 * 简单异或加密/解密函数
 * @param text 要加密/解密的文本
 * @param key 加密密钥
 */
export const simpleXOR = (text: string, key: string): string => {
  return text.split('').map((char, index) =>
    String.fromCharCode(char.charCodeAt(0) ^ key.charCodeAt(index % key.length))
  ).join('');
};

/**
 * Base64编码包装
 */
export const encodeCredentials = (email: string, password: string, key: string): string => {
  const encrypted = simpleXOR(password, key);
  return btoa(JSON.stringify({ email, encrypted }));
};

/**
 * Base64解码和解密
 */
export const decodeCredentials = (encoded: string, key: string): { email: string; password: string } | null => {
  try {
    const { email, encrypted } = JSON.parse(atob(encoded));
    return {
      email,
      password: simpleXOR(encrypted, key)
    };
  } catch (e) {
    console.error('解密失败', e);
    return null;
  }
};
