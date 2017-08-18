var AesUtil = function(keySize, iterationCount) {
	this.keySize = keySize / 32;
	this.iterationCount = iterationCount;
};

AesUtil.prototype.generateKey = function(salt, passPhrase) {
	var key = CryptoJS.PBKDF2(passPhrase, CryptoJS.enc.Hex.parse(salt), {
		keySize : this.keySize,
		iterations : this.iterationCount
	});
	return key;
}

AesUtil.prototype.encrypt = function(salt, iv, passPhrase, plainText) {
	var key = this.generateKey(salt, passPhrase);
	var encrypted = CryptoJS.AES.encrypt(plainText, key, {
		iv : CryptoJS.enc.Hex.parse(iv)
	});
	return encrypted.ciphertext.toString(CryptoJS.enc.Base64);
}

function encryptAES(salt,iv,passPhrase,data){
	var keySize = 128;
	var iterationCount = 100;
	var aesUtil = new AesUtil(keySize, iterationCount);
	var encrypt = aesUtil.encrypt(salt, iv, passPhrase, data);
	return encrypt;
}

function getIv(){
	return CryptoJS.lib.WordArray.random(128/8).toString(CryptoJS.enc.Hex);
}

function getSalt(){
	return CryptoJS.lib.WordArray.random(128/8).toString(CryptoJS.enc.Hex);
}

function getPassPhrase(){
	return new Date().valueOf()+"";
}
