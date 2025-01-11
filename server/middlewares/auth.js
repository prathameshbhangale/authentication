import { verifyToken } from "../utils/jwt.js";

export const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success:false, message: 'Authorization token required' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    console.log(req.user)
    next();
  } catch (err) {
    res.status(401).json({success:false, message: 'Invalid or expired token' });
  }
};