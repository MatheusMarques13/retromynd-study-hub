const jwt = require('jsonwebtoken');

const SECRET = () => {
  const s = process.env.JWT_SECRET;
  if (!s) throw new Error('Missing JWT_SECRET env var');
  return s;
};

function signToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, name: user.display_name },
    SECRET(),
    { expiresIn: '30d' }
  );
}

function verifyToken(token) {
  try {
    return jwt.verify(token, SECRET());
  } catch {
    return null;
  }
}

function getUserFromReq(req) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return null;
  return verifyToken(auth.slice(7));
}

function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
}

module.exports = { signToken, verifyToken, getUserFromReq, cors };
