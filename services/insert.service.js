import {InsertMessage, InsertOrder, InsertProduct, InsertPromotion} from "../repositories/insertQu";
import { randomUUID } from "crypto";

export async function EnterOrder(name,phone_number,location,job,job_type,comment) {

    if(!name) throw new Error("Enter a valid Name!");
    if(phone_number.length > 12 || phone_number.length < 10) throw new Error("Enter a valid Phone Number!");
    if(!location) throw new Error("Enter a valid Location!");
    if(!job) throw new Error("Enter a valid Job Name!");
    if(!job_type) throw new Error("Enter a valid Job Type!");

    const response = await InsertOrder(name,phone_number,location,job,job_type,comment);
    return response;
}

export async function EnterMessage(name,email,message) {
    if(!name) throw new Error("Enter a valid Name");
    if (!email) throw new Error("Enter a valid Email");
    if(!message) throw new Error("Enter a valid Message");

    const response = await InsertMessage(name,email,message);
    return response;
}

export async function EnterPromotion(name,email,phone_number,title,description,image,owner_link) {
    if(!name) throw new Error("Enter a valid Name");
    if (!email) throw new Error("Enter a valid Email");
    if(!phone_number) throw new Error("Enter a valid Phone Number");
    if(!title) throw new Error("Enter a valid Title");
    if(!description) throw new Error("Enter a valid Description");
    if(!image) throw new Error("Enter a valid image");
    if(!owner_link) throw new Error("Enter a valid Owner's Link");

    const link = await randomUUID(); 

    const response = await InsertPromotion(name,email,phone_number,title,description,image,link,owner_link);
    return response;
}

export async function EnterProduct(name,price,description,image) {
    if(!name) throw new Error("Enter a valid Name");
    if (!price) throw new Error("Enter a valid Price");
    if(!description) throw new Error("Enter a valid Description");
    if(!image) throw new Error("Enter a valid image");
    let link = await randomUUID();

    const response = await InsertProduct(name,price,description,image,link);

    return response;
}