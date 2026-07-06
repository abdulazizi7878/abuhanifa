import {ShowAllComments,ShowAllOrders} from "../repositories/viewQu";

export async function GetAllComments() {
    const result = await ShowAllComments();
    return result
}

export async function GetAllOrders() {
    const result = await ShowAllOrders();
    return result
}