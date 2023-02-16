import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../entities/User";

export default async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Subs를 생성할 수 있는 유저인지 체크하기 위해 유저 정보 조회 (토큰 이용)
        const token = req.cookies.token;
        console.log(token);
        if (!token) return next();

        const { userName }: any = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findOneBy({ userName });
        console.log(user);

        // 유저 정보가 없을 경우 throw error
        if (!user) throw new Error('Unauthenticated');

        // res.local.user에 유저 정보 저장
        res.locals.user = user;
        return next();
    } catch (error) {
        console.log(error);
        return res.status(400).json({ error: 'Something went wrong' });
    }
};