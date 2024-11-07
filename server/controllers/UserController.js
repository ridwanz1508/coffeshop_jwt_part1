import userModels from '../models/UserModel.js';
import bcrypt, { genSalt, hash } from 'bcrypt';
import jwt from 'jsonwebtoken';

export const getUser = async(req, res) => {
    try {
        const Users = await userModels.findAll({
            attributes: ['id', 'fname', 'femail']
        });
        res.json(Users);
    } catch (error) {
        console.log(error);
    }
}

export const Register = async(req, res) => {
    const { name, email, username, password, confPassword } = req.body;
    const emailDb = await userModels.findAll({
        where: {
            femail: email
        }
    });
    if (emailDb.length > 0) return res.status(400).json({msg: 'Email has been available'});
    if (password !== confPassword) return res.status(400).json({ msg: 'Passwords do not match!' });
    
    try {
        const salt = await bcrypt.genSalt(10); // Generate salt with 10 rounds
        const hashPassword = await bcrypt.hash(password, salt);
        await userModels.create({
            fname: name, 
            femail: email,
            fusername: username,
            fpassword: hashPassword
        });
        res.json({ msg: 'Registered Successfully!' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Internal Server Error' });
    }
}

export const Login = async(req, res)=> {
    try {
        const userLogin = await userModels.findAll({
            where: {
                femail: req.body.email
            }
        });
        if (userLogin.length === 0) {
            return res.status(404).json({msg: 'Email not found'});
        }

        // email found, pass (client) match with server
        const passDb = userLogin[0].fpassword; 
        const passReq = req.body.password; 
        const matchPass = await bcrypt.compare(passReq, passDb);
        if (!matchPass) return res.status(400).json({msg: 'Password is wrong!'});

        const userId = userLogin[0].id;
        const name = userLogin[0].fname;
        const email = userLogin[0].femail;
        const accessToken = jwt.sign({userId, name, email}, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '20s'
        });
        const refreshToken = jwt.sign({userId, name, email}, process.env.REFRESH_TOKEN_SECRET, {
            expiresIn: '1d'
        });
        await userModels.update({frefresh_token: refreshToken}, {
            where: {
                id: userId
            }
        });
        // after token saved in db, httpOnly cookie will be sent to client
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000
        });
        res.json({ accessToken });
    } catch (error) {
        console.log(error);
        res.status(500).json({msg: 'Server Error'});  
    }
}

export const Logout = async(req, res)=> {
    try {
        const refreshTokenDelete = req.cookies.refreshToken;
        if (!refreshTokenDelete) return res.sendStatus(204);

        const userData = await userModels.findAll({
            where: {
                frefresh_token: refreshTokenDelete
            }
        });
        if (!userData[0]) return res.sendStatus(404); 

        const userId = userData[0].id;
        await userModels.update({ frefresh_token: null }, {
            where: {
                id: userId
            }
        });
        res.clearCookie('refreshToken');
        return res.sendStatus(200);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
}
