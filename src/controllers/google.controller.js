const Google = require("../models/Google");
const CryptoJS = require("crypto-js");
const generateId = require("../helper/generateId");

const registerGoogle = async (req, res) => {
  const { username, email, image, confirmed, token } = req.body;

  const userExists = await User.findOne({ email });
  const userName = await User.findOne({ username });
  const googleExists = await Google.findOne({ email });
  const googleName = await Google.findOne({ username });

  if (userExists || userName || googleExists || googleName)
    return res.status(400).json({ error: true, msg: "usuario ya registrado" });
  try {
    const password = generateId();
    const user = new Google({
      username,
      email,
      password,
      confirmed,
      token,
      image,
    });
    await user.save();

    return res.status(200).json({ error: false, msg: "registrado" });
  } catch (error) {
    console.log(error);
  }
};

const changeGooglePwd = async (req, res) => {
  const { id } = req.params;
  const inputPass = req.body.password;
  const user = await Google.findOne({ id });
  if (!user) {
    return res.status(403).json({ error: true, msg: "FORBIDDEN" });
  }
  const hashPass = CryptoJS.AES.decrypt(
    user.password,
    process.env.SECURITY_PASS
  );
  const oldPass = hashPass.toString(CryptoJS.enc.Utf8);

  if (inputPass === oldPass) {
    let { newPass } = req.body;
    const updatedPassword = CryptoJS.AES.encrypt(
      newPass,
      process.env.SECURITY_PASS
    );
    user.password = updatedPassword;
    user.save();
    return res.status(200).json({ msg: "Contraseña actualizada" });
  } else {
    return res.status(500).json({ error: true, msg: "Contraseña incorrecta" });
  }
};

module.exports = {
  registerGoogle,
  changeGooglePwd,
};
