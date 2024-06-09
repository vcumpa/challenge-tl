const jwt = require('jwt-simple');
const moment = require('moment');
const secret = 'mi_password';

exports.createToken = function(data) {
    const payload = {
        sub: data.username,
        iat: moment().unix(),
        exp: moment().add(14, 'days').unix(),
    };
    return jwt.encode(payload, secret);
};

exports.ensureAuth = function(req, res, next) {
    if (process.env.NODE_ENV !== 'test') {
        return next();
    }

    if (!req.headers.authorization) {
        return res.status(403).send({ message: 'No token provided.' });
    }

     // Obtiene solo el token sin el prefijo "Bearer"
    const token = req.headers.authorization.split(' ')[1];

    //Validar si existe token
    if (!token) {
        return res.status(403).send({ message: 'Invalid token format.' });
    }

    //Validar si el token ha expirado o es inválido
    try {
        const payload = jwt.decode(token, secret);
        if (payload.exp <= moment().unix()) {
            return res.status(401).send({ message: 'Token expired.' });
        }
    } catch (ex) {
        return res.status(404).send({ message: 'Invalid token.' });
    }
    
    //Pasar datos de payload
    req.data = payload;
    
    next();
};
