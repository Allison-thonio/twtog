"use server"

import { getProducts, saveProduct, deleteProduct, getOrders, getSiteImages, saveSiteImages, Product } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"

/**
 * Server-side security guard to ensure only authorized admins 
 * can perform sensitive operations.
 */
async function isAdmin() {
    const session = cookies().get("admin_session")
    return session?.value === "true"
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
