import { NextResponse } from 'next/server';
import { stripe } from "@/lib/stripe";
import { z } from "zod";

export const dynamic = "force-dynamic";

const corsHeaders = {
    "Access-Control-Allow-Origin": process.env.NEXT_PUBLIC_APP_URL || "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
}

const CheckoutItemSchema = z.object({
    name: z.string(),
    price: z.number().positive(),
    quantity: z.number().int().positive(),
    image: z.string().url().optional().or(z.literal("")).or(z.null()),
});

const CheckoutSchema = z.object({
    items: z.array(CheckoutItemSchema),
});

export async function OPTIONS() {
    return NextResponse.json({}, { headers: corsHeaders })
}

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const result = CheckoutSchema.safeParse(body)

        if (!result.success) {
            return NextResponse.json({ error: "Invalid request data", details: result.error.format() }, { status: 400 })
        }

        const { items } = result.data

        if (!stripe || !process.env.STRIPE_SECRET_KEY) {
            return NextResponse.json({ error: "Stripe is not configured" }, { status: 500 })
        }

        const line_items: any[] = []

        items.forEach((item) => {
            const product_data: any = {
                name: item.name,
            }
            if (item.image && item.image.startsWith('http')) {
                product_data.images = [item.image]
            }

            line_items.push({
                quantity: item.quantity,
                price_data: {
                    currency: 'USD',
                    product_data,
                    unit_amount: Math.round(item.price * 100),
                },
            })
        })

        const session = await stripe.checkout.sessions.create({
            line_items,
            mode: 'payment',
            billing_address_collection: 'required',
            phone_number_collection: {
                enabled: true,
            },
            success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout?success=1`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout?canceled=1`,
        })

        return NextResponse.json({ url: session.url }, { headers: corsHeaders })
    } catch (err: any) {
        console.error("[CHECKOUT_POST]", err)
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}
