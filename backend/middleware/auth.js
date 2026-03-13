const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
	// Get token from header
	const token = req.header('x-auth-token') || req.headers['authorization'];
	if (!token) {
		return res.status(401).json({ msg: 'No token, authorization denied' });
	}
	try {
		// Remove 'Bearer ' if present
		const actualToken = token.startsWith('Bearer ') ? token.slice(7) : token;
		const decoded = jwt.verify(actualToken, process.env.JWT_SECRET);
		req.user = decoded;
		next();
	} catch (err) {
		res.status(401).json({ msg: 'Token is not valid' });
	}
};
