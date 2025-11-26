import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/database";
import Promotion from "@/models/promotion";
import { authenticateUser } from "@/lib/authenticate-user";
import { uploadImage, deleteImage } from "@/lib/cloudinary";

export async function PUT(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const authResponse = await authenticateUser(request);
        if (authResponse) return authResponse;

        const { id } = await context.params;

        await dbConnect();

        const formData = await request.formData();
        const file = formData.get("file") as File | null;
        const type = formData.get("type") as string;
        const href = formData.get("href") as string;
        const textDesign = formData.get("textDesign") as string;
        const status = formData.get("status") as string;

        const updateData: any = {
            type: type || "promo",
            href: href || "",
            textDesign: textDesign || "",
            status: status || "active",
        };

        // If a new file is provided, upload it and delete the old one
        if (file) {
            const promotion = await Promotion.findById(id);
            if (!promotion) {
                return NextResponse.json(
                    { error: "Promotion not found" },
                    { status: 404 }
                );
            }

            // Delete old image if it exists
            if (promotion.imagePublicId) {
                try {
                    await deleteImage(promotion.imagePublicId);
                } catch (error) {
                    console.error(
                        `Error deleting old image ${promotion.imagePublicId}:`,
                        error
                    );
                }
            }

            // Upload new image
            const buffer = Buffer.from(await file.arrayBuffer());
            const uploadResult = await uploadImage(buffer, "promotions");
            updateData.image = uploadResult.secure_url;
            updateData.imagePublicId = uploadResult.public_id;
        }

        const promotion = await Promotion.findByIdAndUpdate(id, updateData, {
            new: true,
        });

        if (!promotion) {
            return NextResponse.json(
                { error: "Promotion not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(promotion);
    } catch (error) {
        return NextResponse.json(
            { error: (error as Error).message },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const authResponse = await authenticateUser(request);
        if (authResponse) return authResponse;

        const { id } = await context.params;

        await dbConnect();

        const promotion = await Promotion.findById(id);
        if (!promotion) {
            return NextResponse.json(
                { error: "Promotion not found" },
                { status: 404 }
            );
        }

        // Delete image from Cloudinary if it exists
        if (promotion.imagePublicId) {
            try {
                await deleteImage(promotion.imagePublicId);
            } catch (error) {
                console.error(
                    `Error deleting image ${promotion.imagePublicId}:`,
                    error
                );
            }
        }

        await Promotion.deleteOne({ _id: id });

        return NextResponse.json({
            message: "Promotion deleted successfully",
        });
    } catch (error) {
        return NextResponse.json(
            { error: (error as Error).message },
            { status: 500 }
        );
    }
}
