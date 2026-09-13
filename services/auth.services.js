
// file: services/auth.services.js

import {
    ShowUserByEmail,
    ShowUserById,
    UpdateUserPassword,
} from "../repositories/authQu";

import {
    PasswordCompare,
    Hash,
} from "../lib/hash";

import {
    CreateToken,
    VeriifyToken
} from "../lib/jwt";


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

export async function ChangePassword(
    userId,
    currentPassword,
    newPassword
) {
    try {
        const user = await ShowUserById(userId);

        if (
            !user ||
            !user[0] ||
            user[0].length === 0
        ) {
            return {
                success: false,
                message: "User not found",
            };
        }

        const currentUser =
            user[0][0];

        const isCurrentPasswordCorrect =
            await PasswordCompare(
                currentPassword,
                currentUser.password
            );

        if (!isCurrentPasswordCorrect) {
            return {
                success: false,
                message:
                    "Current password is incorrect",
            };
        }

        const isSamePassword =
            await PasswordCompare(
                newPassword,
                currentUser.password
            );

        if (isSamePassword) {
            return {
                success: false,
                message:
                    "New password must be different from your current password",
            };
        }

        const hashedPassword =
            await Hash(newPassword);

        await UpdateUserPassword(
            userId,
            hashedPassword
        );

        return {
            success: true,
            message:
                "Password changed successfully",
        };
    } catch (err) {
        console.error(
            "CHANGE PASSWORD ERROR:",
            err
        );

        return {
            success: false,
            message: "SERVER ERROR",
        };
    }
}