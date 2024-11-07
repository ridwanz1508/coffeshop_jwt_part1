import models from '../models/UserModel.js';
import jwt from 'jsonwebtoken';

export const refreshTokenUser = async (req, res) => {
    try {
        const refreshTokenUser = req.cookies.refreshToken;
        if (!refreshTokenUser) return res.sendStatus(401);
        const userData = await models.findAll({
            where: {
                frefresh_token: refreshTokenUser
            }
        });
        if (!userData[0]) return res.sendStatus(403);
        // token (client) and token (db) is match, then verify token!
        jwt.verify(refreshTokenUser, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
            if (err) return res.sendStatus(403);
            const userId = userData[0].id;
            const name = userData[0].fname;
            const email = userData[0].femail;
            const accessToken = jwt.sign({ userId, name, email }, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: '20s'
            });
            res.json({accessToken});
        })
    } catch (error) {
        console.log(error);
    }
}

