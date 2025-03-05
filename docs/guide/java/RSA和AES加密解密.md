---
title: RSA和AES加密解密
sidebar: auto
categories: java
tags:
  - java
---





## 加密算法介绍



AES：对称加密算法，使用相同密钥进行加密解密，密钥长度为128位 192位 256位，适合处理大量数据

RSA：非对称加密算法，有一对密钥 分为公钥和私钥，公钥加密 私钥解密，密钥长度通常为2048，适合用于数字签名



### 区别

| 特性     | AES                 | RSA                      |
| -------- | ------------------- | ------------------------ |
| 加密类型 | 对称加密            | 非对称加密               |
| 密钥管理 | 加解密用同一个密钥  | 公钥加密，私钥解密       |
| 加密速度 | 较快                | 较慢                     |
| 密钥长度 | 128位、192位、256位 | 2048位                   |
| 安全性   | 密钥必须保密        | 公钥可公开，私钥必须保密 |
| 场景     | 数据加密、文件加密  | 数字签名、身份验签       |





## AES使用

AES分组模式：

- ECB：每块明文独立加密。方式简单**安全性低**。
- CBC：每块明文加密前与前一个密文块进行异或操作。指定一个偏移量**IV**确保每次加密得到不同密文
- CFB：将前一块密文作为输入 生成伪随机数，然后与明文块异或操作。



AES填充方式：

AES分组通常为**16字节(128位)**，但是明文可能并不正好为16倍数，通常要进行填充。

- PKCS5Padding：填充的每个值为剩余填充的字节数
- PKCS7Padding：与PKCS5Padding类似，但是可用于大于8字节分组的加密
- NoPadding：不进行填充，但要求输入的明文长度为分组大小的整倍数。



```java
//密钥 
private static String APP_KEY = "TEST123456";

/**
 * 生成AES密钥
 */
public static void generateAesKey() {
    try {
        KeyGenerator keyGenerator = KeyGenerator.getInstance("AES");
        keyGenerator.init(128);
        SecretKey secretKey = keyGenerator.generateKey();
        System.out.println("AES密钥：" + Base64.getEncoder().encodeToString(secretKey.getEncoded()));
    } catch (NoSuchAlgorithmException e) {
        e.printStackTrace();
    }
}

/**
 * 根据AES密钥生成Key对象
 * @param keyBytes 原AES密钥
 */
public static Key getKey(byte[] keyBytes) {
    int base = 16;
    //判断密钥长度是否是16倍数，通常密钥长度为128位、192位 和256位
    if (keyBytes.length % base != 0) {
        //keyBytes 不是16倍数，填充新组
        int groups = keyBytes.length / base + 1;
        byte[] temp = new byte[groups * base];
        Arrays.fill(temp, (byte) 0);
        //keyBytes内容复制到temp中
        System.arraycopy(keyBytes, 0, temp, 0, keyBytes.length);
        keyBytes = temp;
    }
    //指定加密算法，创建密钥对象
    return new SecretKeySpec(keyBytes, "AES");
}

/**
 * AES加密
 * @param data 待加密的数据
 * @return 加密后数据
 */
public static String aesEcbEncrypt(String data) {
    try {
        Key key = getKey(APP_KEY.getBytes());
        Security.addProvider(new BouncyCastleProvider());
        Cipher cipher = Cipher.getInstance("AES/ECB/PKCS7Padding", "BC");
        cipher.init(Cipher.ENCRYPT_MODE, key);
        byte[] bytes = cipher.doFinal(data.getBytes());
        String encodeBody = new String(Base64.getEncoder().encode(bytes));
        return encodeBody;
    } catch (Exception e) {
        System.out.println("加密失败：" + e);
        return null;
    }
}

/**
 * AES解密
 * @param data 待解密的数据
 * @return 原始数据
 */
public static String aesEcbDecrypt(String data) {
    try {
        byte[] decode = Base64.getDecoder().decode(data.getBytes());
        Key key = getKey(APP_KEY.getBytes());
        Security.addProvider(new BouncyCastleProvider());
        Cipher cipher = Cipher.getInstance("AES/ECB/PKCS7Padding", "BC");
        cipher.init(Cipher.DECRYPT_MODE, key);
        byte[] bytes = cipher.doFinal(decode);
        String decodeBody = new String(bytes);
        return decodeBody;
    } catch (Exception e) {
        System.out.println("加密失败：" + e);
        return null;
    }
}
```





## RSA使用



```java
    /**
     * RSA私钥
     */
    private static String PRIVATE_KEY_STR = "MIICdwIBADANBgkqhkiG9w0BAQEFAASCAmEwggJdAgEAAoGBAImdJE8Bt0rfmlDByOsav0eeOwX+4Wvzu53e52/ORwW1N7xCG5kGSExAfAcwyw4Owibd8/967pA4WNho03/tHjmFOH1SNPGf5flZNDldhVqjveqtyHYIpZnmNWYN6NoP6ZlbeQ8Z1F8m0biD0rZSgOgM+s73qd5yv9AM22uBtWrZAgMBAAECgYAjRJ61kN8E1WGbKM7xUh2LoUXHN5dWL1T6FNKDmP4ivFrYaKjiAvYsdKpUvXCM3cNsap3J8BuL4qUCcXsi4gZInXpBUOwaLCoOp4X0UJeV5PYfKHQP8JsfTd3RIZDKYhQ6vapKo3NtgA8CD6Pr7o2mj+UibjPZp2ZaI1D3HMbHsQJBAOT95r6W2dEAQFJsQtRr1MpBVIY61/a5m95RiPX7r/oKrAqt23ZLB0q5WlMh+NWWPSqA3heH0NToLnn4NraGFq8CQQCZ2DS8v6N6stVaHRNF6msjQaE2E0A7VSlc+5hVDAOxilp6eriFJLu7Oe2qeNcOa6gOf8Ifv2kzRacoRSScZPj3AkEA05PJBGYLITHzPHStFun+9VWBjHiIHH4Ih1SckHMZeJUturxCnzzZovA5hcBI0sf7Ae+JxQIHMQDKGIX/v4uLHwJALZGQ7WeGMM3PzEVYdBkfau4BplbFa82p1tTfJjHM1kW4zxaSmT1sLeTWtOveJ3NT8Bd/lI/JxVoYTSFN2tU9uQJBAIvidLrVhqd+TtZm1/UrgZn5HltBoqAHOg2USU5a7bGkfimFUVYb/92zDzuLEMjBAmXHIae6T85l2YMATtQtjag=";
    /**
     * RSA公钥
     */
    private static String PUBLIC_KEY_STR = "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCJnSRPAbdK35pQwcjrGr9HnjsF/uFr87ud3udvzkcFtTe8QhuZBkhMQHwHMMsODsIm3fP/eu6QOFjYaNN/7R45hTh9UjTxn+X5WTQ5XYVao73qrch2CKWZ5jVmDejaD+mZW3kPGdRfJtG4g9K2UoDoDPrO96necr/QDNtrgbVq2QIDAQAB";
    
    
/**
 * 生成RSA公私钥对
 */
public static void generatorRsaKey() throws NoSuchAlgorithmException {
    KeyPairGenerator keyPairGenerator = KeyPairGenerator.getInstance("RSA");
    keyPairGenerator.initialize(2048);
    KeyPair keyPair = keyPairGenerator.genKeyPair();
    PrivateKey privateKey = keyPair.getPrivate();
    PublicKey publicKey = keyPair.getPublic();

    //转换为base64编码
    Base64.Encoder encoder = Base64.getEncoder();
    System.out.println("privateKey=" + encoder.encodeToString(privateKey.getEncoded()));
    System.out.println("publicKey=" + encoder.encodeToString(publicKey.getEncoded()));
}



/**
 * 得到私钥
 *
 */
public static PrivateKey getPrivateKey(String privateKeyStr) throws Exception {

    byte[] keyBytes;
    //base64解码
    keyBytes = Base64.getDecoder().decode(privateKeyStr.getBytes());

    PKCS8EncodedKeySpec keySpec = new PKCS8EncodedKeySpec(keyBytes);

    KeyFactory keyFactory = KeyFactory.getInstance("RSA");
    return keyFactory.generatePrivate(keySpec);
}

/**
 * 得到公钥
 *
 */
public static PublicKey getPublicKey(String publicKeyStr) throws Exception {

    byte[] keyBytes;
    //base64解码
    keyBytes = Base64.getDecoder().decode(publicKeyStr.getBytes());

    X509EncodedKeySpec keySpec = new X509EncodedKeySpec(keyBytes);

    KeyFactory keyFactory = KeyFactory.getInstance("RSA");
    return keyFactory.generatePublic(keySpec);
}


/**
 * 生成签名
 */
public static String generateSignature(String data) {
    try {
		PrivateKey privateKey = getPrivateKey(PRIVATE_KEY_STR);

		Signature signature = Signature.getInstance("SHA256withRSA");
        signature.initSign(privateKey);
        signature.update(data.getBytes());
        byte[] signedData = signature.sign();
        return Base64.getEncoder().encodeToString(signedData);
    } catch (Exception e) {
        e.printStackTrace();
    }
    return null;
}

/**
 * 验证签名
 * @param data 原始数据
 * @param signature 签名数据
 */
public static boolean verifySignature(String data, String signature) {
    try {
		PublicKey publicKey = getPublicKey(PUBLIC_KEY_STR);
		Signature sign = Signature.getInstance("SHA256withRSA");
        sign.initVerify(publicKey);
        sign.update(data.getBytes());
        byte[] signatureBytes = Base64.getDecoder().decode(signature);
        return sign.verify(signatureBytes);
    } catch (Exception e) {
        e.printStackTrace();
    }
    return false;
}   

```

