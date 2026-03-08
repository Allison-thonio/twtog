"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SearchBar } from "@/components/search-bar"
import Link from "next/link"
import Header from "@/components/header"
import Navbar from "../../components/navbar"
import Footer from "../../components/footer"
import { Filter, Grid, List } from "lucide-react"

import { fetchProducts } from "@/app/actions"

export default function ShopPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [priceRange, setPriceRange] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("newest")
  const [products, setProducts] = useState<any[]>([])
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchProducts()
      setProducts(data || [])
    }
    loadData()
  }, [])

  // Filter products based on selected filters
  const filteredProducts = products.filter((product) => {
    if (selectedCategory !== "all" && product.category !== selectedCategory) return false

    if (priceRange !== "all") {
      const price = product.price
      switch (priceRange) {
        case "under-50":
          if (price >= 50) return false
          break
        case "50-100":
          if (price < 50 || price > 100) return false
          break
        case "100-200":
          if (price < 100 || price > 200) return false
          break
        case "over-200":
          if (price <= 200) return false
          break
      }
    }

    return true
  })

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price
      case "price-high":
        return b.price - a.price
      case "name":
        return a.name.localeCompare(b.name)
      case "newest":
      default:
        return b.id - a.id
    }
  })

  // Clear filters handler
  const clearFilters = () => {
    setSelectedCategory("all")
    setPriceRange("all")
    setSortBy("newest")
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background">
        {/* Main shop content */}
        <div className="bg-background py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h1 className="text-5xl md:text-7xl font-extralight text-foreground mb-6 tracking-tighter uppercase">The Collection</h1>
              <div className="w-24 h-px bg-primary/40 mx-auto mb-6" />
              <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed font-light italic text-lg">
                "Modern essentials, thoughtfully crafted for the conscious curator."
              </p>
            </div>
            {/* Category Pills */}
            <div className="flex justify-center space-x-6 mb-8">
              {[
                { key: "all", label: "All" },
                { key: "women", label: "Women" },
                { key: "men", label: "Men" },
              ].map((category) => (
                <button
                  key={category.key}
                  onClick={() => setSelectedCategory(category.key)}
                  className={`px-6 py-2 text-sm tracking-widest uppercase transition-colors ${selectedCategory === category.key
                    ? "text-primary border-b-2 border-primary"
                    : "text-muted-foreground hover:text-foreground"
                    }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-border">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="text-muted-foreground hover:text-foreground"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
              <Select value={priceRange} onValueChange={setPriceRange}>
                <SelectTrigger className="w-40 border-border bg-card">
                  <SelectValue placeholder="Price" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Prices</SelectItem>
                  <SelectItem value="under-50">Under $50</SelectItem>
                  <SelectItem value="50-100">$50 - $100</SelectItem>
                  <SelectItem value="100-200">$100 - $200</SelectItem>
                  <SelectItem value="over-200">Over $200</SelectItem>
                </SelectContent>
              </Select>
              {(selectedCategory !== "all" || priceRange !== "all") && (
                <Button variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground/60">
                  Clear
                </Button>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <p className="text-sm text-muted-foreground">
                {sortedProducts.length} {sortedProducts.length === 1 ? "item" : "items"}
              </p>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40 border-border bg-card">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="name">Name: A to Z</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex border border-border rounded overflow-hidden">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className={`p-2 ${viewMode === "grid" ? "bg-primary/10 text-primary" : "text-muted-foreground"}`}
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className={`p-2 ${viewMode === "list" ? "bg-primary/10 text-primary" : "text-muted-foreground"}`}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
          {products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground mb-4 text-lg">No products available yet.</p>
              <p className="text-sm text-muted-foreground/60">Products added by the admin will appear here.</p>
            </div>
          ) : sortedProducts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground mb-4 text-lg">No products found matching your filters.</p>
              <Button variant="outline" onClick={clearFilters} className="border-primary/50 text-primary bg-primary/5 hover:bg-primary/10">
                Clear Filters
              </Button>
            </div>
          ) : (
            <div
              className={
                viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8" : "space-y-6"
              }
            >
              {sortedProducts.map((product: any) => (
                <div key={product.id} className="group">
                  <Link href={`/product/${product.id}`}>
                    {viewMode === "grid" ? (
                      <div className="bg-card/30 rounded-xl overflow-hidden border border-border/20">
                        <div className="relative overflow-hidden bg-muted">
                          <img
                            src={product.image || "/placeholder.svg?height=400&width=300&text=Product"}
                            alt={product.name}
                            className="w-full h-96 object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                        <div className="p-4 bg-card">
                          <h3 className="font-light text-foreground mb-1 group-hover:text-primary transition-colors text-lg">
                            {product.name}
                          </h3>
                          <p className="text-primary font-medium text-sm">${product.price}</p>
                          {product.category && (
                            <p className="text-muted-foreground text-[10px] mt-1 uppercase tracking-[0.2em]">{product.category}</p>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="flex gap-6 bg-card p-6 group-hover:bg-muted/30 transition-colors border border-border/20 rounded-xl">
                        <div className="w-32 h-40 bg-muted rounded-lg overflow-hidden">
                          <img
                            src={product.image || "/placeholder.svg?height=160&width=128&text=Product"}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-light text-foreground text-lg mb-2 group-hover:text-primary transition-colors">
                            {product.name}
                          </h3>
                          <p className="text-primary font-medium mb-2">${product.price}</p>
                          {product.description && (
                            <p className="text-muted-foreground text-sm leading-relaxed mb-2 line-clamp-2">{product.description}</p>
                          )}
                          {product.category && (
                            <Badge variant="outline" className="text-xs text-primary/80 border-primary/30 bg-primary/5">
                              {product.category}
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  )
}