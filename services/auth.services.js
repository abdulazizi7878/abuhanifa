import { ShowUserByEmail } from "../repositories/authQu";
import {PasswordCompare} from "../lib/hash";
import { CreateToken } from "../lib/jwt";

export async function LogIn(email,password){
    try {
        const user = await ShowUserByEmail(email);
        const result = await PasswordCompare(password,user[0][0].password);
        const token = await CreateToken({id:user[0][0].id,role:"admin"})
        if (result === true) {
        return {
            success:true,
            message:"Sigin successfully",
            token: token
        };                  
        } else {
            return{
                success:false,
                message:"Invalid credentials",
                user:password
            }
        }
  

    } catch(err){
        return{
            success:false,
            message: "SERVER ERROR",
        }
    }

}