import { UpdateProduct } from "../repositories/updateQu";

export async function EditProduct(name,price,description,link) {
    const response = await UpdateProduct(name,price,description,link);
    return response
}