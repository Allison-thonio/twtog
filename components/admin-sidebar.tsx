"use client"

import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import { cn } from "@/lib/utils"
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    Users,
    Settings,
    LogOut,
    Image as ImageIcon,
    BarChart3
} from "lucide-react"
import { Button } from "@/components/ui/button"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
    onLogout?: () => void
}

export function AdminSidebar({ className, onLogout, ...props }: SidebarProps) {
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const currentTab = searchParams.get("tab") || "dashboard"

    const routes = [
        {
            label: "Dashboard",
            icon: LayoutDashboard,
            href: "/admin/dashboard",
            active: !searchParams.get("tab") || searchParams.get("tab") === "dashboard",
        },
        {
            label: "Products",
            icon: Package,
            href: "/admin/dashboard?tab=products",
            active: currentTab === "products",
        },
        {
            label: "Orders",
            icon: ShoppingCart,
            href: "/admin/dashboard?tab=orders",
            active: currentTab === "orders",
        },
        {
            label: "Analytics",
            icon: BarChart3,
            href: "/admin/dashboard?tab=analytics",
            active: currentTab === "analytics",
        },
        {
            label: "Site Images",
            icon: ImageIcon,
            href: "/admin/dashboard?tab=site-images",
            active: currentTab === "site-images",
        },
    ]

    return (
        <div className={cn("pb-12 min-h-screen border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60", className)} {...props}>
            <div className="space-y-4 py-4">
                <div className="px-3 py-2">
                    <div className="flex items-center gap-2 px-4 mb-10">
                        <span className="swanky-brand text-2xl tracking-[0.2em] text-foreground">TWT</span>
                        <span className="text-[10px] uppercase tracking-widest font-bold text-primary px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20">Admin</span>
                    </div>
                    <div className="space-y-1">
                        {routes.map((route) => (
                            <Button
                                key={route.href}
                                variant={route.active ? "secondary" : "ghost"}
                                className={cn(
                                    "w-full justify-start transition-all duration-200",
                                    route.active
                                        ? "bg-primary/10 text-primary hover:bg-primary/15 font-medium"
                                        : "hover:bg-muted/50 text-muted-foreground hover:text-foreground"
                                )}
                                asChild
                            >
                                <Link href={route.href}>
                                    <route.icon className={cn("mr-2 h-4 w-4", route.active && "text-primary")} />
                                    {route.label}
                                </Link>
                            </Button>
                        ))}
                    </div>
                </div>
                <div className="px-3 py-2 mt-auto">
                    <div className="space-y-1">
                        <Button variant="ghost" className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10" onClick={onLogout}>
                            <LogOut className="mr-2 h-4 w-4" />
                            Logout
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
