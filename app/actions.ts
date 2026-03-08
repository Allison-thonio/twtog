"use server"

import { getProducts, saveProduct, deleteProduct, getOrders, getSiteImages, saveSiteImages, Product } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

/**
 * Server-side security guard to ensure only authorized admins 
 * can perform sensitive operations.
 */
async function isAdmin() {
    const session = cookies().get("admin_session")
    return session?.value === "TWT_SECURE_SESSION"
}

export async function adminLogin(formData: any) {
    const { email, password, rememberMe } = formData;

    // Master credentials check
    const isValid = email.toLowerCase() === "twtog@mail.com" && password === "TWT";

    if (!isValid) return { error: "Invalid credentials" };

    const expiresAt = new Date(Date.now() + (rememberMe ? 30 * 24 * 60 * 60 * 1000 : 2 * 60 * 60 * 1000));

    cookies().set("admin_session", "TWT_SECURE_SESSION", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        expires: expiresAt,
        path: "/",
    });

    return { success: true };
}

export async function adminLogout() {
    cookies().delete("admin_session");
    revalidatePath("/admin");
    return { success: true };
}

export async function fetchProducts() {
    return await getProducts()
}

export async function upsertProduct(product: Product) {
    if (!(await isAdmin())) throw new Error("Unauthorized")

    await saveProduct(product)
    revalidatePath("/admin/dashboard")
    revalidatePath("/")
    revalidatePath("/shop")
    return { success: true }
}

export async function removeProduct(id: number) {
    if (!(await isAdmin())) throw new Error("Unauthorized")

    await deleteProduct(id)
    revalidatePath("/admin/dashboard")
    revalidatePath("/")
    revalidatePath("/shop")
    return { success: true }
}

export async function fetchOrders() {
    if (!(await isAdmin())) return []
    return await getOrders()
}

export async function fetchSiteImages() {
    return await getSiteImages()
}

export async function updateSiteImages(images: { [key: string]: string }) {
    if (!(await isAdmin())) throw new Error("Unauthorized")

    await saveSiteImages(images)
    revalidatePath("/")
    revalidatePath("/admin/dashboard")
    return { success: true }
}
