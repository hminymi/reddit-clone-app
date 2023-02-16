import { Request, Response, Router } from "express";
import userMiddleware from "../middlewares/user";
import authMiddleware from "../middlewares/auth";

const router = Router();

const vote = async (req:Request, res:Response) => {};

router.post("/", userMiddleware, authMiddleware, vote);

export default router;