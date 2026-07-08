import { LogIn } from "../../services/auth.services"

export default async function handler(req,res) {



    const {username,password} = req.body;
   
    try{
        const response = await LogIn(username,password);

        if (response.success == true) {
            res.setHeader(
                'Set-Cookie',
                 `token=${response.token}; path=/; HttpOnly; Secure; SameSite=Strict`
            )

            res.status(200).json({
                success:true,
                message:"sign in successful"
            })

            return;
        } else {
            res.status(200).json({
                success:false,
                message:"Invalid credentials",
            })            
        }


    } catch(err){

        res.status(500).json({
            success:false,
            message:"server error",
            error:err.message
        })
    }
}