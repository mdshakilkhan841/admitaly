import { NextResponse } from "next/server";
import dbConnect from "@/lib/database";
import Promotion from "@/models/promotion";
import { authenticateUser } from "@/lib/authenticate-user";
import { uploadImage } from "@/lib/cloudinary";
import mongoose from "mongoose";

export async function GET(request: Request): Promise<NextResponse> {
    try {
        const authResponse = await authenticateUser(request);
        if (authResponse) return authResponse;

        await dbConnect();
        const promotions = await Promotion.find({}).sort({ order: 1 });
        return NextResponse.json(promotions);
    } catch (error) {
        return NextResponse.json(
            { error: (error as Error).message },
            { status: 500 }
        );
    }
}

export async function POST(request: Request): Promise<NextResponse> {
    try {
        const authResponse = await authenticateUser(request);
        if (authResponse) return authResponse;

        await dbConnect();

        const formData = await request.formData();
        const file = formData.get("file") as File | null;
        const type = formData.get("type") as string;
        const href = formData.get("href") as string;
        const textDesign = formData.get("textDesign") as string;
        const status = formData.get("status") as string;

        // Either file or textDesign must be provided
        if (!file && !textDesign) {
            return NextResponse.json(
                { error: "Either image file or text design must be provided" },
                { status: 400 }
            );
        }

        // Determine order: place at the end
        const last = await Promotion.findOne()
            .sort({ order: -1 })
            .select("order");
        const nextOrder = (last?.order ?? 0) + 1;

        // Upload image if file is provided
        let imageUrl = "";
        let imagePublicId = "";

        if (file) {
            const buffer = Buffer.from(await file.arrayBuffer());
            const uploadResult = await uploadImage(buffer, "promotions");
            imageUrl = uploadResult.secure_url;
            imagePublicId = uploadResult.public_id;
        }

        // Create promotion document
        const promotion = await Promotion.create({
            type: type || "promo",
            href: href || "",
            image: imageUrl || undefined,
            imagePublicId: imagePublicId || undefined,
            textDesign: textDesign || "",
            status: status || "active",
            order: nextOrder,
        });

        return NextResponse.json(promotion, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { error: (error as Error).message },
            { status: 500 }
        );
    }
}

export async function PATCH(request: Request): Promise<NextResponse> {
    try {
        const authResponse = await authenticateUser(request);
        if (authResponse) return authResponse;

        await dbConnect();

        const body = await request.json();
        const { order } = body;

        if (!Array.isArray(order)) {
            return NextResponse.json(
                { error: "Invalid input: 'order' must be an array of ids." },
                { status: 400 }
            );
        }

        // Validate all IDs are valid MongoDB ObjectIds
        const validIds = order.map((id: string) => {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                throw new Error(`Invalid promotion ID: ${id}`);
            }
            return new mongoose.Types.ObjectId(id);
        });

        // Bulk update orders
        const bulkOps = validIds.map(
            (id: mongoose.Types.ObjectId, idx: number) => ({
                updateOne: {
                    filter: { _id: id },
                    update: { $set: { order: idx } },
                },
            })
        );

        if (bulkOps.length > 0) {
            const result = await Promotion.bulkWrite(bulkOps);
            // console.log("Bulk write result:", result);
        }

        return NextResponse.json({ message: "Order updated successfully" });
    } catch (error) {
        console.error("PATCH error:", error);
        return NextResponse.json(
            { error: (error as Error).message },
            { status: 500 }
        );
    }
}

export async function DELETE(request: Request): Promise<NextResponse> {
    try {
        const authResponse = await authenticateUser(request);
        if (authResponse) return authResponse;

        const { ids } = await request.json();

        if (!Array.isArray(ids) || ids.length === 0) {
            return NextResponse.json(
                { error: "Invalid input: 'ids' must be a non-empty array." },
                { status: 400 }
            );
        }

        await dbConnect();

        // Get promotions to delete their images from Cloudinary
        const promotions = await Promotion.find({ _id: { $in: ids } });
        const { deleteImage } = await import("@/lib/cloudinary");

        for (const promotion of promotions) {
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
        }

        const result = await Promotion.deleteMany({
            _id: { $in: ids },
        });

        return NextResponse.json({
            message: `${result.deletedCount} promotions deleted successfully.`,
        });
    } catch (error) {
        return NextResponse.json(
            { error: (error as Error).message },
            { status: 500 }
        );
    }
}
