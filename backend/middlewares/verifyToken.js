import jwt from "jsonwebtoken";
const { verify } = jwt;

export function verifyToken(req, res, next) {
  //get token from cookie
  const encodedToken = req.cookies.token;
  //if encodedtoken not found
  if (encodedToken === undefined) {
    res.status(401).json({ message: "Unauthorized" });
  } else {
    try {
      //verify token
      let decodedToken = verify(encodedToken, "abcdef"  );
      console.log("decode token is",decodedToken)
      //forward req to next
      req.user=decodedToken;
      next();
    } catch (err) {
      res.status(401).json({ message: "Session expired" });
    }
  }
}