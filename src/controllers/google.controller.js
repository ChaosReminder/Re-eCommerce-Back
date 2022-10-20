const Google = require("../models/Google");
const CryptoJS = require("crypto-js");
const generateId = require("../helper/generateId");
const User = require("../models/User");

const registerGoogle = async (req, res) => {
  const { username, email, image, confirmed, token } = req.body;

  const userExists = await User.findOne({ email });
  const userName = await User.findOne({ username });
  const googleExists = await Google.findOne({ email });
  const googleName = await Google.findOne({ username });

  if (userExists || userName || googleExists || googleName)
    return res.status(403).json({ error: true, msg: "usuario ya registrado" });

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
    console.log("MATEO TOMA MATE", error);
  }
};

const authenticateG = async (req, res) => {
  const user = await Google.findOne({ username: req.body.username });
  if (!user) return res.status(401).send({ msg: "Hubo un error." });
  if (user.email && user.confirmed === true) {
    res.status(200).json({
      token: generarJWT(user.id),
      error: false,
      msg: "Usuario habilitado para loguearse",
    });
  }
  if (user.confirmed === false) {
    return res.status(401).send({ msg: "¡Usuario no confirmado!" });
  } else {
    const hashPass = CryptoJS.AES.decrypt(
      user?.password,
      process.env.SECURITY_PASS
    );
    const originalPassword = hashPass.toString(CryptoJS.enc.Utf8);
    const inputPass = req.body.password;
    if (originalPassword !== inputPass)
      return res.status(401).json({ msg: "¡Password inválido!" });
    else
      res.status(200).json({
        token: generarJWT(user.id),
        error: false,
        msg: "Usuario habilitado para loguearse",
      });
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
  authenticateG,
  changeGooglePwd,
};
