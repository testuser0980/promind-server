const jwt = require("jsonwebtoken");
const JWT_SEC = "promind__@&12fgeap!*ald";

const fetchUser = (req, res, next) => {
  try {
    const token = req.header('authToken')
    if(!token){
        return res.status(402).send({success: false, message: 'Please login to access this resource'})
    }
    const data = jwt.verify(token, JWT_SEC)
    req.user = data.user
    next()
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .send({ success: false, message: "Internal server error" });
  }
};

module.exports = fetchUser