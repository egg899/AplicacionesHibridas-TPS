import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config();
// const secretKey = 'SECRETA';
const secretKey = process.env.SECRET_KEY;
//const secretKey = 'SECRETA';

const authenticateToken = (req, res, next) => {
    const getToken = req.headers.authorization;

    if(getToken){
        const token = getToken.split(" ")[1];
        jwt.verify(token, secretKey, (err, payload) => {
            if(err) {
                return res.sendStatus(403);
            }
            req.user = {id: payload.id, email:payload.email};
            next();
        })
    }//if getToken

};//authenticateToken


//module.exports = authenticateToken;
export default authenticateToken;