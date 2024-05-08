const jwt = require('jsonwebtoken');
const verifyTokenMethod = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const decodedToken = jwt.verify(token, 'your-secret-key');
        req.user = decodedToken;
        console.log(req.user.userEmail)
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
}
module.exports = verifyTokenMethod;