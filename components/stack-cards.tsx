"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { X, ArrowRight } from "lucide-react"
import { getSiteImage } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

type Product = {
  id: number
  name: string
  image?: string | null
  description?: string
}

export default function StackCards() {
  const [visible, setVisible] = useState(false)
  const [cards, setCards] = useState<Product[]>([])
  const [index, setIndex] = useState(0)

  useEffect(() => {
    try {
      const seen = localStorage.getItem("seenStackCards")
      if (seen === "true") return
      const saved = JSON.parse(localStorage.getItem("adminProducts") || "[]") as Product[]
      const mapped = (saved || []).map((p: any) => ({
        id: p.id,
        name: p.name,
        image: p.image,
        description: p.description
      }))

      if (mapped.length === 0) {
        // fallback placeholders
        setCards([
          {
            id: 1,
            name: "New Collection",
            image: getSiteImage("stack1"),
            description: "Discover our latest arrivals for the season."
          },
          {
            id: 2,
            name: "Featured",
            image: getSiteImage("stack2"),
            description: "Handpicked styles just for you."
          },
          {
            id: 3,
            name: "Best Seller",
            image: getSiteImage("stack3"),
            description: "Our most loved pieces."
          },
        ])
      } else {
        setCards(mapped.slice(0, 3))
      }

      setVisible(true)
    } catch (e) {
      // if any error, don't block the home page
      setVisible(false)
    }
  }, [])

  const handleSkip = () => {
    localStorage.setItem("seenStackCards", "true")
    setVisible(false)
  }

  const handleNext = () => {
    if (index < cards.length - 1) {
      setIndex((i) => i + 1)
    } else {
      handleSkip()
    }
  }

  if (!visible) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-md px-4 h-[70vh] flex flex-col items-center justify-center">

        <div className="absolute top-4 right-4 z-50">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSkip}
            className="text-white hover:bg-white/20 rounded-full"
          >
            <X className="w-6 h-6" />
          </Button>
        </div>

        <div className="relative w-full h-full flex items-center justify-center">
          <AnimatePresence>
            {cards.map((card, i) => {
              // Only render current and next few cards
              if (i < index) return null;

              const isFront = i === index;
              const offset = i - index;

              // Limit rendered stack depth
              if (offset > 2) return null;

              return (
                <motion.div
                  key={card.id}
                  initial={{ scale: 0.9, y: 20, opacity: 0 }}
                  animate={{
                    scale: 1 - offset * 0.05,
                    y: offset * 15,
                    opacity: 1 - offset * 0.2,
                    zIndex: cards.length - i
                  }}
                  exit={{ x: -300, opacity: 0, rotate: -10 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  drag={isFront ? "x" : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  onDragEnd={(_, info) => {
                    if (info.offset.x < -100) {
                      handleNext();
                    }
                  }}
                  className="absolute w-full h-[500px] bg-card rounded-2xl overflow-hidden shadow-2xl border border-border/50"
                >
                  <div className="relative h-3/4 w-full">
                    <img
                      src={card.image || "/placeholder.svg"}
                      alt={card.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  </div>

                  <div className="h-1/4 p-6 flex flex-col justify-between bg-card">
                    <div>
                      <h3 className="text-2xl font-light tracking-tight mb-1">{card.name}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">{card.description || "Experience the essence of style."}</p>
                    </div>

                    <div className="flex justify-between items-center mt-4">
                      <div className="flex gap-1">
                        {cards.map((_, idx) => (
                          <div
                            key={idx}
                            className={`h-1.5 rounded-full transition-all duration-300 ${idx === index ? "w-6 bg-primary" : "w-1.5 bg-muted"}`}
                          />
                        ))}
                      </div>
                      <Button onClick={handleNext} className="rounded-full px-6" variant="swanky">
                        {index === cards.length - 1 ? "Start Shopping" : "Next"} <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
