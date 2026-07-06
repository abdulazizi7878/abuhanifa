import { ShowUserByEmail } from "../repositories/authQu";
import {PasswordCompare} from "../lib/hash";
import { cookies } from "next/headers";
import { CreateToken } from "../lib/jwt";

export async function LogIn(email,password){
    try {
        const user = await ShowUserByEmail(email);
        const result = await PasswordCompare(password,user[0][0].password);
        const token = await CreateToken({id:user[0][0].id})
        if (result === true) {
            return {
                success:true,
                token: token
            };                  
        } else {
            return{
                success:false,
                token:token
            }
        }
  

    } catch(err){
        return{
            success:false,
            message: "SERVER ERROR",
            error:err
        }
    }

}