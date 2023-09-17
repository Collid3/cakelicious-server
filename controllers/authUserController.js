const User = require("../model/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const rolesList = require("../config/roles_list");

// LOG IN
const handleLogin = async (req, res) => {
  const { email, password } = req.body;
  if (!email && !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  if (!password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  if (!email) {
    return res.status(400).json({ error: "Invalid Email address" });
  }

  try {
    const selectedUser = await User.findOne({ email: email }).exec();
    if (!selectedUser) {
      return res.status(401).json({ error: "Incorrect email or password" });
    }

    const match = await bcrypt.compare(password, selectedUser.password);
    if (!match)
      return res.status(403).json({ error: "Incorrect email or Password" });

    const roles = Object.values(selectedUser.roles);

    const userInfo = { email: email, roles: roles };

    const accessToken = jwt.sign(
      { userInfo },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "2h",
      }
    );

    const refreshToken = jwt.sign({ email }, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: "1d",
    });

    selectedUser.refreshToken = refreshToken;
    await selectedUser.save();

    res.cookie("jwt", refreshToken, { expiresIn: "10h" });
    if (roles.indexOf(rolesList.Admin) !== -1) {
      return res.json({ accessToken, email, admin: true });
    }

    return res.json({ accessToken, email });
  } catch (err) {
    console.log(err);
    return res.json({ message: err });
  }
};

// LOGOUT
const handleLogout = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt)
    return res.status(401).json({ error: "Refresh token not found" });
  const refreshToken = cookies.jwt;

  const selectedUser = await User.findOne({
    refreshToken: refreshToken,
  }).exec();
  if (!selectedUser) return res.status(401).json({ error: "User not found" });
  selectedUser.refreshToken = "";
  await selectedUser.save();
  res.clearCookie("jwt");
  return res.json({ success: "User successfully logged out" });
};

module.exports = { handleLogin, handleLogout };
