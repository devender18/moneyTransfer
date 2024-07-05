const JWT_Password = require("./config")
const jwt = require('jsonwebtoken');
function authMiddleware(req,res,next){
    const authorization = req.headers.authorization;

    if (!authorization || authorization.split(" ")[0] != 'Bearer' ){
        return res.status(403).json({
            msg : "authorization failed!"
        })
    }

    const token = authorization.split(" ")[1]
    

    try{
        const decode = jwt.verify(token,JWT_Password);
        req.userId = decode.userId
        next();
    }catch(error){
        res.status(403).json({
            msg : "token verification failed"
        })
    }
}


module.exports = authMiddleware;