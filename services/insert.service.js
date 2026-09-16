
// file: services/insert.service.js

import { GetProductByName } from "../repositories/viewQu";
import {InsertMessage, InsertOrder, InsertOrderProduct, InsertProduct, InsertPromotion} from "../repositories/insertQu";
import { randomUUID } from "crypto";

export async function EnterOrder(
    name,
    contact_info,
    location,
    jobs,
    job_types,
    comment,
    attachment_url = null,
    attachment_public_id = null,
    attachment_original_name = null,
    attachment_mime_type = null,
    attachment_size = null,
    attachment_resource_type = null
) {
    if (!name || typeof name !== "string") {
        throw new Error("Enter a valid Name!");
    }

    if (!contact_info) {
        throw new Error(
            "Enter a valid contact information!"
        );
    }

    if (!location) {
        throw new Error("Enter a valid location!");
    }

    if (!Array.isArray(jobs) || jobs.length === 0) {
        throw new Error("Enter at least one Job!");
    }

    if (
        !Array.isArray(job_types) ||
        job_types.length === 0
    ) {
        throw new Error("Enter at least one Job Type!");
    }

    // Convert arrays to normal text
    const job = jobs.join(", ");
    const job_type = job_types.join(", ");

    const response = await InsertOrder(
        name,
        contact_info,
        location,
        job,
        job_type,
        comment,
        attachment_url,
        attachment_public_id,
        attachment_original_name,
        attachment_mime_type,
        attachment_size,
        attachment_resource_type
    );

    return response;
}

export async function EnterMessage(name,email,message) {
    if(!name) throw new Error("Enter a valid Name");
    if (!email) throw new Error("Enter a valid Email");
    if(!message) throw new Error("Enter a valid Message");

    const response = await InsertMessage(name,email,message);
    return response;
}

export async function EnterPromotion(name,title,description,image,publicId,resourceType) {
    if(!name) throw new Error("Enter a valid Name");
    if(!title) throw new Error("Enter a valid Title");
    if(!description) throw new Error("Enter a valid Description");
    if(!image) throw new Error("Enter a valid image");
    if(!publicId) throw new Error("Something went wrong");
    if(!resourceType) throw new Error("Something went wrong");

    const link = await randomUUID(); 

    const response = await InsertPromotion(name,title,description,image,link,publicId,resourceType);
    return response;
}

export async function EnterProduct(
    name,
    price,
    description,
    image,
    publicId,
    resourceType,
    category_id = null
) {
    if (!name) {
        throw new Error("Enter a valid Name");
    }

    if (!price) {
        throw new Error("Enter a valid Price");
    }

    if (!description) {
        throw new Error("Enter a valid Description");
    }

    if (!image) {
        throw new Error("Enter a valid image");
    }

    if (!publicId) {
        throw new Error("Something went wrong");
    }

    if (!resourceType) {
        throw new Error("Something went wrong");
    }

    const cleanName = name.trim();

    let finalName = cleanName;
    let counter = 1;

    while (await GetProductByName(finalName)) {
        finalName = `${cleanName}-${counter}`;
        counter++;
    }

    const link = await randomUUID();

    const response = await InsertProduct(
        finalName,
        price,
        description,
        image,
        link,
        publicId,
        resourceType,
        category_id
    );

    return response;
}

export async function EnterOrderProduct(name,phone_number,location,account_number,amount,image,product_id) {
    if(!name) throw new Error("Enter a valid Name");
    if (!phone_number) throw new Error("Enter a valid Phone Number");
    if (!location) throw new Error("Enter a valid Location");
    if(!account_number) throw new Error("Enter a valid Account Number");
    if(!image) throw new Error("Enter a valid image");
    if(!product_id) throw new Error("Refresh the page and order it again!");

    const response = await InsertOrderProduct(name,phone_number,location,account_number,amount,image,product_id);

    return response;
}