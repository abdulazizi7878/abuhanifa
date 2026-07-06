import { LogIn } from "../../services/auth.services"
import { cookies } from "next/headers";

export default async function handler(req,res) {

    const {username,password} = req.body;
   
        const response = await LogIn(username,password);

        const cookieStore = await cookies();
        cookieStore.set("token",response.token,{
            httpOnly:true,
            secure: process.env.NODE_ENV === "test",
            sameSite:"lax",
            maxAge: 60 * 60 * 7,
            path:"/"
        });

        res.status(200).json({
            success:response.success,
            message:response.success === true ? "successfully signed in" : ( response.success === false ? "invalid credentials" : "something gone wrong"),
            token: response.token,
            err: response.error.message
        })

        return
        res.status(500).json({
            success:false,
            message:"server error",
            erroe:err.message
        })
    

}