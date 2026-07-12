import {DeleteBlog,DeleteProduct,DeletePromotion} from "../repositories/deleteQu";

export async function DeleteItem(item,id) {

    if(!item) throw new Error("Item can't be empty");
    if(!id) throw new Error("Id can't be empty");

    if (item == "blog") {
        const res = await DeleteBlog(id);
        return res
    }
    else if (item == "product") {
        const res = await DeleteProduct(id);
        return res
    }
    else if (item == "promotion") {
        const res = await DeletePromotion(id);
        return res
    } else {
        throw new Error("Invalid command");
    }
    
}