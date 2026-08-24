import { ShowProductPreview } from "../../../repositories/viewQu";
export default async function handler(req, res) {
    const response = await ShowProductPreview();
    res.status(200).json(response);
}