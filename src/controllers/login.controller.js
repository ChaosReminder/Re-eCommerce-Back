const User = require("../models/User");
const CryptoJS = require("crypto-js");
const generarJWT = require("../helper/generateJWT");
const generateId = require("../helper/generateId");
//REGISTRAR USUARIO
const registerPost = async (req, res) => {
  const { username, email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists)
    return res.status(400).json({ error: true, msg: "usuario ya registrado" });
  try {
    const encriptPassword = CryptoJS.AES.encrypt(
      password,
      process.env.SECURITY_PASS
    );
    const user = new User({ username, email, password: encriptPassword });
    const userSave = await user.save();

    res.status(200).json(userSave);
  } catch (error) {
    console.log(error);
  }
};
//CONFIRMAR USUARIO}

const confirmUser = async (req, res) => {
  const { token } = req.params;

  try {
    const confirmedUser = await User.findOne({ token });
    if (!confirmedUser) {
      return res.status(400).json({ msg: "token no valido" });
    } else {
      confirmedUser.token = null;
      confirmedUser.confirmed = true;
      await confirmedUser.save();

      res.json({ msg: "usuario registrado correctamente" });
    }
  } catch (error) {
    console.log(error);
  }
};

//AUTENTICAR USUARIO
const authenticate = async (req, res) => {
  const user = await User.findOne({ username: req.body.username });
  if(!user) return res.status(401).send("¡Usuario no existe!");
  if (user.confirmed === false) {
    return res.status(401).send("¡Usuario no confirmado!");
  } else {
    const hashPass = CryptoJS.AES.decrypt(
      user?.password,
      process.env.SECURITY_PASS
    );
    const originalPassword = hashPass.toString(CryptoJS.enc.Utf8);
    const inputPass = req.body.password;
    if (originalPassword !== inputPass) return res.status(401).json({ msg: "¡Password inválido!" })
      else res.status(200).json({
          token: generarJWT(user.id),
          error: false,
          msg: "Usuario habilitado para loguearse",
        });
  }
};

//CAMBIAR CONTRASEÑA
const changePassword = async (req, res) => {
  const { email } = req.body;
  const inputPass = req.body.password;
  const user = await User.findOne({ email });
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
    res.status(500).json({ error: true, msg: "Contraseña incorrecta" });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (!userExists) {
      return res.status(401).json({ error: true, msg: "el email no existe" });
    }

    userExists.token = generateId();
    await userExists.save();
    res.json({ msg: "Hemos enviado un email con las instrucciones" });
  } catch (error) {
    console.log(error);
  }
};

const checkToken = async (req, res) => {
  const { token } = req.params;
  const validateToken = await User.findOne({ token });
  if (validateToken) {
    res.json({ msg: "Token aprobado" });
  } else {
    return res.status(400).json({ error: true, msg: "Token inválido" });
  }
};

const newPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  const user = await User.findOne({ token });
  try {
    user.token = null;
    user.password = password;
    await user.save();

    res.json({ msg: "Password modificado con éxito" });
  } catch (error) {
    res.status(500).json({ error: true, msg: "Error al guardar" });
  }
  if (!user) {
    return res
      .status(400)
      .json({ error: true, msg: "Hubo un error con el usuario" });
  }
};

module.exports = {
  registerPost,
  confirmUser,
  authenticate,
  changePassword,
   forgotPassword,
   checkToken,
   newPassword
};
