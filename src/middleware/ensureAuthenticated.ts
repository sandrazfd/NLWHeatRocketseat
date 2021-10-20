import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";

interface IPayload {
    sub: string
}

export function ensureAuthenticated(request: Request, response: Response, next: NextFunction) {
    const authToken = request.headers.authorization;

    if (!authToken) {
        return response.status(401).json({
            errorCode: "token.invalid",
        });

    }

    // Bearer 3546546354354684543546854
    //[0] bearer
    //[1] 3574673574686537435743574
    const [, token] = authToken.split(" ")
    try {
        const { sub } = verify(token, process.env.jwt_secret) as IPayload
        request.user_id = sub;

        return next();
    } catch (err) {
        return response.status(401).json({ errorCode: "token.expired" })
    }

}