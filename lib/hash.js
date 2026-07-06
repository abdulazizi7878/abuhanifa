import bcrypt from "bcryptjs";


export async function Hash(password) {
    const hashed = await bcrypt.hash(password,10);
    return hashed;
}

export async function PasswordCompare(password,hashedPassword) {
    const result = await bcrypt.compare(password,hashedPassword);
    return result;
}