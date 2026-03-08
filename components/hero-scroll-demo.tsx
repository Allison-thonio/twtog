"use client";
import React, { useEffect, useState } from "react";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import { fetchSiteImages } from "@/app/actions";

export function HeroScrollDemo() {
    const [images, setImages] = useState<string[]>([]);

    useEffect(() => {
        const loadImages = async () => {
            const siteImages = await fetchSiteImages();
            const scrollImages = [];
            if (siteImages.scroll1) scrollImages.push(siteImages.scroll1);
            if (siteImages.scroll2) scrollImages.push(siteImages.scroll2);
            if (siteImages.scroll3) scrollImages.push(siteImages.scroll3);
            if (siteImages.scroll4) scrollImages.push(siteImages.scroll4);

            if (scrollImages.length === 0) {
                // Default fallback images
                setImages([
                    "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?q=80&w=2832&auto=format&fit=crop",
                    "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=2787&auto=format&fit=crop",
                    "https://images.unsplash.com/photo-1488161628813-04466f872be2?q=80&w=2864&auto=format&fit=crop",
                    "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=2940&auto=format&fit=crop"
                ]);
            } else {
                setImages(scrollImages);
            }
        };
        loadImages();
    }, []);

    return (
        <div className="flex flex-col overflow-hidden bg-background">
            <ContainerScroll
                titleComponent={
                    <div className="mb-10">
                        <span className="swanky-brand text-3xl md:text-5xl text-primary mb-6 block tracking-widest">
                            THE COLLECTION
                        </span>
                        <h2 className="text-4xl md:text-7xl font-light text-foreground tracking-tight leading-tight">
                            Experience Artistry <br />
                            <span className="font-serif italic text-primary/80 mt-2 block">
                                In Every Thread
                            </span>
                        </h2>
                        <p className="mt-8 text-xl text-muted-foreground font-light max-w-2xl mx-auto leading-relaxed">
                            A curated selection of timeless pieces, designed for those who value elegance and sustainability.
                        </p>
                    </div>
                }
            >
                <div className="grid grid-cols-2 gap-4 h-full p-2 md:p-4 bg-background">
                    {images.map((src, idx) => (
                        <div key={idx} className="relative overflow-hidden rounded-xl h-full group">
                            <img
                                src={src}
                                alt={`TWT Collection - Piece ${idx + 1}`}
                                className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                                draggable={false}
                            />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                        </div>
                    ))}
                    {images.length === 1 && (
                        <div className="col-span-1 bg-muted rounded-xl flex items-center justify-center text-muted-foreground italic">
                            Experience the fullness of TWT
                        </div>
                    )}
                </div>
            </ContainerScroll>
        </div>
    );
}
