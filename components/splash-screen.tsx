"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "./ui/button"
import { ChevronRight, ChevronLeft } from "lucide-react"

interface SplashCard {
  title: string
  description: string
  image: string
}

const splashCards: SplashCard[] = [
  {
    title: "Welcome to TWT",
    description: "Your one-stop shop for amazing fashion",
    image: "/splash/welcome.jpg", // Add your image paths
  },
  {
    title: "Shop the Latest Trends",
    description: "Discover new arrivals and trending styles",
    image: "/splash/trends.jpg",
  },
  {
    title: "Fast & Secure Checkout",
    description: "Easy payment options and quick delivery",
    image: "/splash/secure.jpg",
  },
]

export default function SplashScreen() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [hasSeen, setHasSeen] = useState(false)
  const [direction, setDirection] = useState(0)

  useEffect(() => {
    // Check if user has seen the splash screen
    const splashSeen = localStorage.getItem("splashSeen")
    if (splashSeen) {
      setHasSeen(true)
    }
  }, [])

  const handleNext = () => {
    setDirection(1)
    if (currentIndex === splashCards.length - 1) {
      // Last card - mark as seen and redirect
      localStorage.setItem("splashSeen", "true")
      setHasSeen(true)
    } else {
      setCurrentIndex((prev) => prev + 1)
    }
  }

  const handlePrevious = () => {
    setDirection(-1)
    setCurrentIndex((prev) => Math.max(0, prev - 1))
  }

  const handleSkip = () => {
    localStorage.setItem("splashSeen", "true")
    setHasSeen(true)
  }

  // Handle swipe gestures
  const swipeConfidenceThreshold = 10000
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity
  }

  const paginate = (newDirection: number) => {
    if (newDirection === 1 && currentIndex < splashCards.length - 1) {
      handleNext()
    } else if (newDirection === -1 && currentIndex > 0) {
      handlePrevious()
    }
  }

  if (hasSeen) {
    window.location.href = "/"
    return null
  }

  return (
    <div className="fixed inset-0 bg-background flex flex-col items-center justify-center">
      <div className="w-full max-w-md px-4">
        <div className="relative h-[500px] w-full overflow-hidden rounded-lg">
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={{
                enter: (direction: number) => ({
                  x: direction > 0 ? 1000 : -1000,
                  opacity: 0
                }),
                center: {
                  zIndex: 1,
                  x: 0,
                  opacity: 1
                },
                exit: (direction: number) => ({
                  zIndex: 0,
                  x: direction < 0 ? 1000 : -1000,
                  opacity: 0
                })
              }}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 }
              }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={1}
              onDragEnd={(e, { offset, velocity }) => {
                const swipe = swipePower(offset.x, velocity.x)

                if (swipe < -swipeConfidenceThreshold) {
                  paginate(1)
                } else if (swipe > swipeConfidenceThreshold) {
                  paginate(-1)
                }
              }}
              className="absolute w-full h-full"
            >
              <div className="relative h-full w-full flex flex-col items-center justify-center text-center p-6 bg-card rounded-lg shadow-lg">
                <div className="w-full h-48 mb-6 bg-muted rounded-lg">
                  {/* Replace with actual image */}
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    [Image Placeholder]
                  </div>
                </div>
                <h2 className="text-2xl font-bold mb-4">{splashCards[currentIndex].title}</h2>
                <p className="text-muted-foreground mb-8">{splashCards[currentIndex].description}</p>
                <div className="flex gap-2 mb-4">
                  {splashCards.map((_, index) => (
                    <div
                      key={index}
                      className={`h-2 rounded-full transition-all ${index === currentIndex ? "w-8 bg-primary" : "w-2 bg-muted"
                        }`}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex items-center justify-between mt-8">
          {currentIndex > 0 ? (
            <Button variant="outline" onClick={handlePrevious}>
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
          ) : (
            <Button variant="ghost" onClick={handleSkip}>
              Skip
            </Button>
          )}

          <Button onClick={handleNext}>
            {currentIndex === splashCards.length - 1 ? (
              "Get Started"
            ) : (
              <>
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}