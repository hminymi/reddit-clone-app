import { isEmpty, validate } from 'class-validator';
import { Request, Response, Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';
import userMiddleware from '../middlewares/user';
import authMiddleware from '../middlewares/auth';
import User from '../entities/User';

const mapErrors = (errors: Object[]) => {
    return errors.reduce((prev: any, err: any) => {
        prev[err.property] = Object.entries(err.constraints)[0][1];
        return prev;
    }, {});
}

const me = async (_: Request, res: Response) => {
  return res.json(res.locals.user);
};

const register = async (req: Request, res: Response) => {
    const { email, userName, password } = req.body;

    try {
        let errors: any = {};

        // email과 userName이 이미 가입된 상태인지 확인
        const hasEmail = await User.findOneBy({ email });
        const hasUser = await User.findOneBy({ userName });

        if (hasEmail) errors.email = '이미 사용된 이메일 주소입니다.';
        if (hasUser) errors.userName = '이미 사용중인 이름입니다.';

        // 이미 가입된 사용자일 경우 에러 리턴
        if (Object.keys(errors).length > 0) {
            return res.status(400).json(errors);
        }

        // 회원 정보를 담기 위한 객체 생성
        const user = new User();
        user.email = email;
        user.userName = userName;
        user.password = password;

        // Entity 내 정해진 조건으로 유효성 검사
        errors = await validate(user);

        if (errors.length > 0) {
            return res.status(400).json(mapErrors(errors))
        };

        // user table에 회원 정보 저장
        await user.save();

        return res.json(user);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error });
    }
}

const login = async (req: Request, res: Response) => {
    const { email, userName, password } = req.body;

    try {
        let errors: any = {};

        // ID/PW가 입력되지 않은 경우 에러 리턴
        if (isEmpty(userName)) errors.userName = '사용자 이름을 입력해주세요.';
        if (isEmpty(password)) errors.password = '비밀번호를 입력해주세요.';
        if (Object.keys(errors).length > 0) {
            return res.status(400).json(errors);
        }

        // 유저 네임으로 유저 정보 조회
        const user = await User.findOneBy({ userName });
        if (!user) return res.status(400).json({ error: '아이디 또는 비밀번호를 확인해주세요.' });

        // 해당 유저의 비밀번호와 입력받은 비밀번호가 일치하는지 확인
        const matchPassword = await bcrypt.compare(password, user.password);
        if (!matchPassword) {
            return res.status(400).json({ error: '아이디 또는 비밀번호를 확인해주세요.' });
        }

        // ID/PW 모두 일치할 경우 토큰 생성
        const token = jwt.sign({ userName }, process.env.JWT_SECRET);

        // 쿠키 저장
        res.set('Set-Cookie', cookie.serialize('token', token, {
            httpOnly: true,
            maxAge: 60 * 60 * 24 * 7,
            path: '/',
        }));

        return res.json({ user, token });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error });
    }
}

const logout = async (_: Request, res: Response) => {
  res.set(
    'Set-Cookie',
    cookie.serialize('token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      expires: new Date(0),
      path: '/',
    })
  );
  res.status(200).json({ success: true });
};

const router = Router();
router.get('/me', userMiddleware, authMiddleware, me);
router.post('/register', register);
router.post('/login', login);
router.post('/logout', userMiddleware, authMiddleware, logout);

export default router;