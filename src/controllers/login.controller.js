const User = require("../models/User");
const CryptoJS = require("crypto-js");
const generarJWT = require("../helper/generateJWT");
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
//CONFIRMAR USUARIO
const confirmUser = async (req, res) => {
    const {token} = req.params
  
  try {
    const confirmedUser = await User.findOne({token})
    if(!confirmedUser){
      
        return res.status(400).json({msg: 'token no valido'})
    }else {

        confirmedUser.token = null
        confirmedUser.confirmed = true
        await confirmedUser.save()

        res.json({msg: 'usuario registrado correctamente'})
    }
  } catch (error) {
    console.log(error)

  }
};
//AUTENTICAR USUARIO
const authenticate = async (req, res) => {
    const user = await User.findOne({ username: req.body.username });
    !user && res.status(401).send("¡Usuario no existe!");
    if (user.confirmed === false) {
      return res.status(401).send("¡Usuario no confirmado!");
    } else {
      const hashPass = CryptoJS.AES.decrypt(
        user.password,
        process.env.SECURITY_PASS
      );
      const originalPassword = hashPass.toString(CryptoJS.enc.Utf8);
      const inputPass = req.body.password;
      originalPassword !== inputPass
        ? res.status(401).json({ msg: "¡Password inválido!" })
        : res.status(200).json({
            token: generarJWT(user.id),
            error: false,
            msg: "Usuario habilitado para loguearse",
          });
  }}



const forgotPassword = () => {};

module.exports = {
  registerPost,
  confirmUser,
  authenticate,
  changePassword,
  forgotPassword,
};
