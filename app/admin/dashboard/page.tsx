"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet"
import { AdminAuthGuard } from "@/components/admin-auth-guard"
import { getSiteImage } from "@/lib/utils"
import { AdminSidebar } from "@/components/admin-sidebar"
import { useRouter, useSearchParams } from "next/navigation"
import { fetchProducts, upsertProduct, removeProduct, fetchOrders, fetchSiteImages, updateSiteImages } from "@/app/actions"
import { type Product, type Order } from "@/lib/db"
import {
  Package,
  Users,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  Eye,
  Edit,
  Trash2,
  Plus,
  Upload,
  Save,
  X,
  Menu,
  Search,
  Filter
} from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area
} from "recharts"

export default function AdminDashboard() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentTab = searchParams.get("tab") || "dashboard"

  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalRevenue: 0,
  })
  const [recentOrders, setRecentOrders] = useState<Order[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [showAddProduct, setShowAddProduct] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    stock: "",
    description: "",
    category: "",
    sku: "",
    specifications: {} as { [key: string]: string },
    image: null as File | null,
    brand: "TWT",
  })
  const [specKey, setSpecKey] = useState("")
  const [specValue, setSpecValue] = useState("")
  const [siteImages, setSiteImages] = useState<{ [k: string]: string }>({})
  const [currency, setCurrency] = useState<string>("USD")

  // Mock Data for Charts
  const salesData = [
    { name: "Jan", total: Math.floor(Math.random() * 5000) + 1000 },
    { name: "Feb", total: Math.floor(Math.random() * 5000) + 1000 },
    { name: "Mar", total: Math.floor(Math.random() * 5000) + 1000 },
    { name: "Apr", total: Math.floor(Math.random() * 5000) + 1000 },
    { name: "May", total: Math.floor(Math.random() * 5000) + 1000 },
    { name: "Jun", total: Math.floor(Math.random() * 5000) + 1000 },
  ]

  useEffect(() => {
    loadDashboardData()
    const savedCurrency = localStorage.getItem("adminCurrency") || "USD"
    setCurrency(savedCurrency)
  }, [])

  const loadDashboardData = async () => {
    const savedProducts = await fetchProducts()
    const savedOrders = await fetchOrders()
    const savedSiteImages = await fetchSiteImages()

    setProducts(savedProducts)
    setRecentOrders(savedOrders)
    setSiteImages(savedSiteImages)
    setStats({
      totalProducts: savedProducts.length,
      totalOrders: savedOrders.length,
      totalCustomers: savedOrders.length > 0 ? new Set(savedOrders.map((o: any) => o.customer)).size : 0,
      totalRevenue: savedOrders.reduce((sum: number, order: any) => sum + order.total, 0),
    })
  }

  const handleLogout = () => {
    localStorage.removeItem("adminAuth")
    router.push("/admin/login")
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setNewProduct({ ...newProduct, image: file })
    }
  }

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.price || !newProduct.stock) {
      alert("Please fill in all required fields")
      return
    }

    const product: Product = {
      id: Date.now(),
      name: newProduct.name,
      price: Number.parseFloat(newProduct.price),
      stock: Number.parseInt(newProduct.stock),
      status: "active",
      description: newProduct.description,
      category: newProduct.category,
      brand: newProduct.brand || "TTTSL",
      sku: newProduct.sku || `SKU-${Date.now()}`,
      specifications: newProduct.specifications,
      // For now, we still use blob URL for immediate preview, but in real app this should be uploaded
      // Since we can't easily upload files to disk in this environment without more setup, 
      // we'll convert to base64 for the JSON DB
      image: newProduct.image ? await convertToBase64(newProduct.image) : null,
    }

    await upsertProduct(product)
    await loadDashboardData()
    resetForm()
  }

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product)
    setNewProduct({
      name: product.name,
      price: product.price.toString(),
      stock: product.stock.toString(),
      description: product.description || "",
      category: product.category || "",
      sku: product.sku || "",
      specifications: product.specifications || {},
      image: null,
      brand: product.brand || "TTTSL",
    })
    setShowAddProduct(true)
  }

  const handleSaveEdit = async () => {
    if (!editingProduct || !newProduct.name || !newProduct.price || !newProduct.stock) {
      alert("Please fill in all required fields")
      return
    }

    const updatedProduct: Product = {
      ...editingProduct,
      name: newProduct.name,
      price: Number.parseFloat(newProduct.price),
      stock: Number.parseInt(newProduct.stock),
      description: newProduct.description,
      category: newProduct.category,
      brand: newProduct.brand || editingProduct.brand,
      sku: newProduct.sku,
      specifications: newProduct.specifications,
      image: newProduct.image ? await convertToBase64(newProduct.image) : editingProduct.image,
    }

    await upsertProduct(updatedProduct)
    await loadDashboardData()
    resetForm()
  }

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = error => reject(error)
    })
  }

  const resetForm = () => {
    setEditingProduct(null)
    setNewProduct({
      name: "",
      price: "",
      stock: "",
      description: "",
      category: "",
      sku: "",
      specifications: {},
      image: null,
      brand: "TWT",
    })
    setShowAddProduct(false)
  }

  const handleDeleteProduct = async (productId: number) => {
    if (confirm("Are you sure you want to delete this product?")) {
      await removeProduct(productId)
      await loadDashboardData()
    }
  }

  const handleAddSpecification = () => {
    if (specKey && specValue) {
      setNewProduct({
        ...newProduct,
        specifications: {
          ...newProduct.specifications,
          [specKey]: specValue,
        },
      })
      setSpecKey("")
      setSpecValue("")
    }
  }

  const handleRemoveSpecification = (key: string) => {
    const newSpecs = { ...newProduct.specifications }
    delete newSpecs[key]
    setNewProduct({ ...newProduct, specifications: newSpecs })
  }

  const handleSiteImageUpload = (key: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      setSiteImages((prev) => ({ ...prev, [key]: reader.result as string }))
    }
    reader.readAsDataURL(file)
  }

  const handleSaveSiteImages = async () => {
    await updateSiteImages(siteImages)
    alert("Site images saved.")
  }

  const handleResetSiteImage = (key: string) => {
    const copy = { ...siteImages }
    delete copy[key]
    setSiteImages(copy)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-emerald-100 text-emerald-800 border-emerald-200"
      case "processing": return "bg-amber-100 text-amber-800 border-amber-200"
      case "shipped": return "bg-blue-100 text-blue-800 border-blue-200"
      case "low-stock": return "bg-rose-100 text-rose-800 border-rose-200"
      default: return "bg-slate-100 text-slate-800 border-slate-200"
    }
  }

  const currencySymbols: { [k: string]: string } = {
    USD: "$", NGN: "₦", EUR: "€", GBP: "£",
  }

  const formatAmount = (amount: number) => {
    const symbol = currencySymbols[currency] || "$"
    return `${symbol}${Number(amount || 0).toLocaleString()}`
  }

  const handleCurrencyChange = (value: string) => {
    setCurrency(value)
    localStorage.setItem("adminCurrency", value)
  }

  const renderContent = () => {
    switch (currentTab) {
      case "products":
        return (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-3xl font-light tracking-tight">
                  <span className="swanky-brand text-xl font-light tracking-[0.2em] text-foreground">TWT</span>
                </h2>
                <p className="text-muted-foreground">Manage your inventory and catalog.</p>
              </div>
              <Button onClick={() => setShowAddProduct(true)} className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Plus className="mr-2 h-4 w-4" /> Add Product
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <Card key={product.id} className="overflow-hidden group hover:shadow-lg transition-all duration-300 border-border/50 bg-card">
                  <div className="aspect-square relative bg-muted/30 overflow-hidden">
                    {product.image ? (
                      <img src={product.image} alt={product.name} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="flex items-center justify-center w-full h-full text-muted-foreground/30">
                        <Package className="w-12 h-12" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Button size="icon" variant="secondary" className="h-9 w-9 rounded-full" onClick={() => handleEditProduct(product)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="icon" variant="destructive" className="h-9 w-9 rounded-full" onClick={() => handleDeleteProduct(product.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="absolute top-2 right-2">
                      <Badge variant={product.stock > 0 ? "secondary" : "destructive"} className="backdrop-blur-md bg-white/80">
                        {product.stock} left
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="mb-2">
                      <h3 className="font-medium truncate" title={product.name}>{product.name}</h3>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">{product.category || "Uncategorized"}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-lg">{formatAmount(product.price)}</span>
                      <Badge variant="outline" className={getStatusColor(product.status)}>{product.status}</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {products.length === 0 && (
                <div className="col-span-full flex flex-col items-center justify-center py-12 text-muted-foreground border-2 border-dashed rounded-lg bg-card">
                  <Package className="w-12 h-12 mb-4 opacity-20" />
                  <p>No products found. Start by adding one.</p>
                </div>
              )}
            </div>
          </div>
        )
      case "analytics":
        return (
          <div className="space-y-6 animate-in fade-in duration-500">
            <h2 className="text-3xl font-light tracking-tight">Analytics</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4 border-border/50 shadow-sm bg-card">
                <CardHeader>
                  <CardTitle>Revenue Overview</CardTitle>
                  <CardDescription>Monthly revenue performance for the current year.</CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                  <ResponsiveContainer width="100%" height={350}>
                    <AreaChart data={salesData}>
                      <defs>
                        <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                      <Tooltip
                        contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                        itemStyle={{ color: 'hsl(var(--foreground))' }}
                      />
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.4} />
                      <Area type="monotone" dataKey="total" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorTotal)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              <Card className="col-span-3 border-border/50 shadow-sm bg-card">
                <CardHeader>
                  <CardTitle>Top Performing Categories</CardTitle>
                  <CardDescription>Distribution of sales by category.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                    <p>More data needed to generate pie chart.</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )
      case "site-images":
        return (
          <div className="space-y-6 animate-in fade-in duration-500">
            <h2 className="text-3xl font-light tracking-tight">Site Assets</h2>
            <Card className="border-border/50 shadow-sm bg-card">
              <CardHeader>
                <CardTitle>Global Images</CardTitle>
                <CardDescription>Manage images used across the storefront (Hero, Banners, etc).</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {[
                    { key: "hero1", label: "Homepage Hero Banner" },
                    { key: "scroll1", label: "Hero Scroll - Image 1" },
                    { key: "scroll2", label: "Hero Scroll - Image 2" },
                    { key: "scroll3", label: "Hero Scroll - Image 3" },
                    { key: "scroll4", label: "Hero Scroll - Image 4" },
                    { key: "stack1", label: "Intro Stack Card 1" },
                    { key: "stack2", label: "Intro Stack Card 2" },
                    { key: "stack3", label: "Intro Stack Card 3" },
                    { key: "logo", label: "Site Logo" },
                  ].map((item) => (
                    <div key={item.key} className="space-y-3 group">
                      <div className="flex items-center justify-between">
                        <Label className="text-base font-medium">{item.label}</Label>
                        <Button variant="ghost" size="sm" onClick={() => handleResetSiteImage(item.key)} className="text-xs h-7">Reset Default</Button>
                      </div>
                      <div className="aspect-video bg-muted/50 rounded-lg overflow-hidden relative border border-border transition-all hover:border-primary/50">
                        <img src={siteImages[item.key] || getSiteImage(item.key)} alt={item.label} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <p className="text-white text-sm mb-3 font-medium">Change Image</p>
                          <div className="flex gap-2">
                            <Label htmlFor={`upload-${item.key}`} className="cursor-pointer bg-white text-black px-4 py-2 rounded-full hover:bg-white/90 text-sm font-medium transition-transform hover:scale-105 active:scale-95">
                              Upload New
                            </Label>
                            <Input id={`upload-${item.key}`} type="file" className="hidden" accept="image/*" onChange={(e) => handleSiteImageUpload(item.key, e)} />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-8 flex justify-end">
                  <Button onClick={handleSaveSiteImages} size="lg" className="px-8"><Save className="mr-2 h-4 w-4" /> Save All Changes</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )
      case "orders":
        return (
          <div className="space-y-6 animate-in fade-in duration-500">
            <h2 className="text-3xl font-light tracking-tight">Orders</h2>
            <Card className="border-border/50 shadow-sm bg-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Recent Orders</CardTitle>
                    <CardDescription>Manage and track customer orders.</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm"><Filter className="w-4 h-4 mr-2" /> Filter</Button>
                    <Button variant="outline" size="sm">Export</Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {recentOrders.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                    <ShoppingCart className="w-12 h-12 mb-4 opacity-20" />
                    <p>No orders placed yet.</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {recentOrders.map((order: any) => (
                      <div key={order.id} className="flex items-center justify-between p-4 hover:bg-muted/50 rounded-lg transition-colors border-b border-border/40 last:border-0">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                            {order.customer.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-sm">{order.id}</p>
                            <p className="text-xs text-muted-foreground">{order.customer}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <Badge variant="outline" className={getStatusColor(order.status)}>{order.status}</Badge>
                          <div className="text-right min-w-[80px]">
                            <p className="font-medium text-sm">{formatAmount(order.total)}</p>
                            <p className="text-[10px] text-muted-foreground">{order.date}</p>
                          </div>
                          <Button variant="ghost" size="icon" className="h-8 w-8"><Eye className="w-4 h-4 text-muted-foreground" /></Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )
      default: // Dashboard
        const statsData = [
          { label: "Total Revenue", value: formatAmount(stats.totalRevenue), icon: DollarSign, trend: "+20.1%" },
          { label: "Active Products", value: stats.totalProducts, icon: Package, trend: "+12 new products" },
          { label: "Total Orders", value: stats.totalOrders, icon: ShoppingCart, trend: "+19%" },
          { label: "Active Customers", value: stats.totalCustomers, icon: Users, trend: "+201 since last hour" },
        ]
        return (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h2 className="text-3xl font-light tracking-tight">Dashboard</h2>
                <p className="text-muted-foreground">Overview of your store's performance.</p>
              </div>
              <div className="flex items-center gap-2">
                <Select value={currency} onValueChange={handleCurrencyChange}>
                  <SelectTrigger className="w-[100px]">
                    <SelectValue>{currency}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD ($)</SelectItem>
                    <SelectItem value="NGN">NGN (₦)</SelectItem>
                    <SelectItem value="EUR">EUR (€)</SelectItem>
                    <SelectItem value="GBP">GBP (£)</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline">Download Report</Button>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {statsData.map((stat, index) => (
                <Card key={stat.label} className="border-border/50 bg-card overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                        <h3 className="text-3xl font-bold mt-1 text-foreground">{stat.value}</h3>
                      </div>
                      <div className={cn("p-3 rounded-xl bg-primary/10 text-primary border border-primary/20")}>
                        <stat.icon size={24} />
                      </div>
                    </div>
                    <div className="mt-4 flex items-center text-xs">
                      <TrendingUp size={14} className="text-primary mr-1" />
                      <span className="text-primary font-medium">{stat.trend}</span>
                      <span className="text-muted-foreground ml-1">vs last month</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4 border-border/50 shadow-sm bg-card">
                <CardHeader>
                  <CardTitle>Sales Overview</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                  <ResponsiveContainer width="100%" height={350}>
                    <LineChart data={salesData}>
                      <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                      <Tooltip
                        contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                      />
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.4} />
                      <Line type="monotone" dataKey="total" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4, fill: "hsl(var(--primary))" }} activeDot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              <Card className="col-span-3 border-border/50 shadow-sm bg-card">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest actions on your store.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    {recentOrders.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-4">No recent activity.</p>
                    ) : (
                      recentOrders.slice(0, 5).map((order: any) => (
                        <div key={order.id} className="flex items-center">
                          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                            <ShoppingCart className="w-4 h-4 text-primary" />
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm font-medium leading-none">New order from {order.customer}</p>
                            <p className="text-xs text-muted-foreground">{order.date}</p>
                          </div>
                          <div className="ml-auto font-medium text-sm">+{formatAmount(order.total)}</div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )
    }
  }

  return (
    <AdminAuthGuard>
      <div className="flex min-h-screen bg-background font-sans">
        {/* Desktop Sidebar */}
        <div className="hidden md:block w-64 shrink-0 sticky top-0 h-screen overflow-y-auto border-r border-border/50">
          <AdminSidebar onLogout={handleLogout} />
        </div>

        {/* Mobile Sidebar Trigger */}
        <div className="md:hidden fixed top-4 left-4 z-50">
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetContent side="left" className="p-0 w-64">
              <AdminSidebar onLogout={handleLogout} onClick={() => setSidebarOpen(false)} />
            </SheetContent>
          </Sheet>
          <Button variant="outline" size="icon" onClick={() => setSidebarOpen(true)} className="bg-background/80 backdrop-blur-md">
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-background">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>

        {/* Add/Edit Product Sheet */}
        <Sheet open={showAddProduct} onOpenChange={setShowAddProduct}>
          <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
            <SheetHeader className="mb-6">
              <SheetTitle className="text-2xl font-light">{editingProduct ? "Edit Product" : "Add New Product"}</SheetTitle>
              <SheetDescription>
                Fill in the details below to {editingProduct ? "update the" : "create a new"} product.
              </SheetDescription>
            </SheetHeader>

            <div className="grid gap-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="productName">Name</Label>
                  <Input id="productName" value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} placeholder="Product Name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="productBrand">Brand</Label>
                  <Select value={newProduct.brand} onValueChange={(value) => setNewProduct({ ...newProduct, brand: value })}>
                    <SelectTrigger><SelectValue placeholder="Select brand" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="TTTSL">TTTSL</SelectItem>
                      <SelectItem value="Swanky by Ellery">Swanky by Ellery</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="productPrice">Price</Label>
                  <Input id="productPrice" type="number" value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} placeholder="0.00" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="productStock">Stock</Label>
                  <Input id="productStock" type="number" value={newProduct.stock} onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })} placeholder="0" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="productSku">SKU</Label>
                  <Input id="productSku" value={newProduct.sku} onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })} placeholder="Auto" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="productCategory">Category</Label>
                <Select value={newProduct.category} onValueChange={(value) => setNewProduct({ ...newProduct, category: value })}>
                  <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="women">Women</SelectItem>
                    <SelectItem value="men">Men</SelectItem>
                    <SelectItem value="unisex">Unisex</SelectItem>
                    <SelectItem value="accessories">Accessories</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="productDescription">Description</Label>
                <Textarea id="productDescription" value={newProduct.description} onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })} placeholder="Product description..." rows={4} />
              </div>

              <div className="space-y-2">
                <Label>Image</Label>
                <div className="flex items-center gap-4 p-4 border border-dashed rounded-lg bg-muted/30">
                  {newProduct.image ? (
                    <div className="relative w-20 h-20 rounded-md overflow-hidden">
                      <img src={URL.createObjectURL(newProduct.image)} alt="Preview" className="w-full h-full object-cover" />
                      <button onClick={() => setNewProduct({ ...newProduct, image: null })} className="absolute top-0 right-0 bg-black/50 text-white p-1"><X className="w-3 h-3" /></button>
                    </div>
                  ) : editingProduct?.image ? (
                    <div className="relative w-20 h-20 rounded-md overflow-hidden">
                      <img src={editingProduct.image} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-20 h-20 bg-muted rounded-md flex items-center justify-center">
                      <Package className="w-8 h-8 text-muted-foreground/50" />
                    </div>
                  )}
                  <div className="flex-1">
                    <Input id="imageUpload" type="file" accept="image/*" onChange={handleImageUpload} className="text-sm" />
                    <p className="text-xs text-muted-foreground mt-1">Recommended: 800x800px, JPG or PNG.</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Specifications</Label>
                <div className="flex gap-2">
                  <Input placeholder="Material" value={specKey} onChange={(e) => setSpecKey(e.target.value)} className="flex-1" />
                  <Input placeholder="100% Cotton" value={specValue} onChange={(e) => setSpecValue(e.target.value)} className="flex-1" />
                  <Button type="button" onClick={handleAddSpecification} size="icon" variant="secondary"><Plus className="w-4 h-4" /></Button>
                </div>
                <div className="space-y-2 mt-2">
                  {Object.entries(newProduct.specifications).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between text-sm p-2 bg-muted/50 rounded-md border border-border/50">
                      <span><span className="font-medium">{key}:</span> {value}</span>
                      <button onClick={() => handleRemoveSpecification(key)} className="text-muted-foreground hover:text-destructive"><X className="w-3 h-3" /></button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <SheetFooter className="mt-4">
              <Button variant="outline" onClick={resetForm}>Cancel</Button>
              <Button onClick={editingProduct ? handleSaveEdit : handleAddProduct}>{editingProduct ? "Save Changes" : "Create Product"}</Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
    </AdminAuthGuard>
  )
}