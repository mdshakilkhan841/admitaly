import {
    v2 as cloudinary,
    UploadApiResponse,
    UploadApiErrorResponse,
    DeleteApiResponse,
} from "cloudinary";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadImage(
    fileBuffer: Buffer,
    folder: string = "promoImages"
): Promise<UploadApiResponse> {
    return new Promise<UploadApiResponse>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: folder,
                resource_type: "image",
            },
            (error?: UploadApiErrorResponse, result?: UploadApiResponse) => {
                if (error) return reject(error);
                if (!result)
                    return reject(
                        new Error("Cloudinary upload returned no result")
                    );
                resolve(result);
            }
        );

        uploadStream.end(fileBuffer);
    });
}

export async function deleteImage(
    publicId: string
): Promise<DeleteApiResponse> {
    try {
        const result: DeleteApiResponse = await cloudinary.uploader.destroy(
            publicId
        );
        return result;
    } catch (error) {
        console.error("Error deleting image from Cloudinary:", error);
        throw error;
    }
}
