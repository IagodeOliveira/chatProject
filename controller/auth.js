const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
    const token = req.header('authorization-token');
    if(!token || token === 'null') {
        return res.status(401).send('Restricted Area');
    }  

    try {
        const userVerified = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = userVerified;
        next();
    } catch(err) {
        return res.status(401).send('Restricted Area');
    }
}