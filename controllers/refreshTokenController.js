const User = require("../model/User");
const jwt = require("jsonwebtoken");
const rolesList = require("../config/roles_list");

const handleRefresh = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies) {
    return res.status(400).json({ error: "cookies not found" });
  }

  const refreshToken = cookies.jwt;
  if (!refreshToken) {
    return res.status(401).json({ error: "User not logged in" });
  }

  const selectedUser = await User.findOne({ refreshToken: refreshToken });
  if (!selectedUser) {
    return res
      .status(403)
      .json({ error: "User with that refesh token is not found" });
  }

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ error: "Invalid refresh token" });

    const roles = Object.values(selectedUser.roles);

    const accessToken = jwt.sign(
      {
        userInfo: {
          email: decoded.email,
          roles: roles,
        },
      },
      process.env.ACCESS_TOKEN_SECRET
    );

    const newRefreshToken = jwt.sign(
      { email: decoded.email },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: "30d",
      }
    );

    selectedUser.refreshToken = newRefreshToken;
    selectedUser.save();
    res.cookie("jwt", newRefreshToken, { expiresIn: "10h" });
    if (roles.indexOf(rolesList.Admin) !== -1) {
      return res.json({ accessToken, email: selectedUser.email, admin: true });
    }

    return res.json({ accessToken, email });
  });
};

module.exports = handleRefresh;
