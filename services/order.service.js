import {InsertOrder} from "../repositories/orderQu";

export async function EnterOrder(name,phone_number,location,job,job_type,comment) {

    if(!name) throw new Error("Enter a valid Name!");
    if(phone_number.length > 12 || phone_number.length < 10) throw new Error("Enter a valid Phone Number!");
    if(!location) throw new Error("Enter a valid Location!");
    if(!job) throw new Error("Enter a valid Job Name!");
    if(!job_type) throw new Error("Enter a valid Job Type!");

    const response = await InsertOrder(name,phone_number,location,job,job_type,comment);
    return response;
}