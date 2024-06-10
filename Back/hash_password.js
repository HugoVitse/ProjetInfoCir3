const crypto = require('crypto');

function hash_password(password){
    const hashedpassword = crypto.createHash('sha256');
    hashedpassword.update(password)
    return hashedpassword.digest("hex")
}

module.exports = hash_password;