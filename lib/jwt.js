import jwt from "jsonwebtoken";


let key = process.env.KEY;

export async function CreateToken(payload) {
    const token = await jwt.sign(payload,key,{
        expiresIn:"7d"
    })
    return token;
}

export async function VeriifyToken(payload) {
    const result = await jwt.verify(payload,key);
    return result
}