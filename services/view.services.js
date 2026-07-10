import {ShowAllComments,ShowAllMessages,ShowAllOrders, ShowAllPromotions, ShowOneProduct} from "../repositories/viewQu";

export async function GetAllComments() {
    const result = await ShowAllComments();
    return result
}

export async function GetAllOrders() {
    const result = await ShowAllOrders();
    return result
}

export async function GetAllMessages() {
    const result = await ShowAllMessages();
    return result
}

export async function GetAllPromotions() {
    const result = await ShowAllPromotions();
    return result
}

export async function GetOneProduct(link,amount) {
    const result = await ShowOneProduct(link);
    const price = result[0].price;
    const totalPrice = (price * amount);
    return {
        result:result,
        totalPrice:totalPrice
    };
}