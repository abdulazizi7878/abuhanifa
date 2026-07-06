import jwt from "jsonwebtoken";

export async function CreateToken(payload) {
    let key = process.env.KEY;
    const token = await jwt.sign(payload,key,{
        expiresIn:"7d"
    })
    return token;
}