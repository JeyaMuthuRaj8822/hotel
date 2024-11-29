const jwt=require('jsonwebtoken');
const dotenv=require('dotenv')
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET; 

const verifyAdmin = (req, res, next) => {//
    const token = req.headers['authorization']?.split(' ')[1];
    //console.log('Verifying Token:', token);
    if (!token) {
        return res.status(403).send('Token is required for authentication');
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).send('Invalid Token');
        }
        req.id = decoded.id;
        req.name = decoded.name; // Accessing user email
        req.role = decoded.role;
        //console.log(req.id);
        console.log(req.name);
        
        next(); 
    });
};

module.exports=verifyAdmin;