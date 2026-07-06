import { randomUUID } from "crypto";
import fs from "fs/promises";


export async function uploadImage(req) {
    
    const data = await req?.formData();
    const file = data.image;
    const ext = req.name.split(".").pop();

    console.log(file);

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const fileName = `${randomUUID()}.${ext}`;

    await fs.writeFile(
        `public/uploads/${fileName}`,
        buffer
    );

    return Response.json({
        success:true,
    })
}