import { UpdateBlog, UpdateProduct, UpdatePromotion } from "../repositories/updateQu";

export async function EditProduct(name,price,description,link) {
    const response = await UpdateProduct(name,price,description,link);
    return response
}

export async function EditBlog(title,desciption,link) {
    const response = await UpdateBlog(title,desciption,link);
    return response
}

export async function EditPromotion(name,email,phone_number,title,description,owner_link,link) {
    const response = await UpdatePromotion(name,email,phone_number,title,description,owner_link,link);
    return response
}