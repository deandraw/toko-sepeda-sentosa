'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';

interface GalleryImage {
    id: string;
    url: string;
}

interface ImageGalleryClientProps {
    images: GalleryImage[];
    productName: string;
}

export default function ImageGalleryClient({ images, productName }: ImageGalleryClientProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
    };

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    const handleThumbnailClick = (index: number) => {
        setCurrentIndex(index);
    };

    const currentImage = images[currentIndex] || { url: '/placeholder-image.jpg' };

    return (
        <div className="flex flex-col space-y-4">
            {/* Main Image View */}
            <div className="relative aspect-square sm:aspect-video lg:aspect-square w-full rounded-2xl overflow-hidden bg-white border border-zinc-200 group shadow-sm transition-all duration-300">
                <Image
                    src={currentImage.url}
                    alt={`${productName} - Gambar ${currentIndex + 1}`}
                    fill
                    className="object-contain"
                    priority
                />

                {/* Navigation Arrows for Multiple Images */}
                {images.length > 1 && (
                    <>
                        <button
                            onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-white/80 hover:bg-white text-zinc-800 shadow-md backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all focus:opacity-100"
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); handleNext(); }}
                            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-white/80 hover:bg-white text-zinc-800 shadow-md backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all focus:opacity-100"
                        >
                            <ChevronRight className="w-6 h-6" />
                        </button>
                    </>
                )}

                {/* Fullscreen Button */}
                <button
                    onClick={() => setIsFullscreen(true)}
                    className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-white/80 hover:bg-white text-zinc-800 shadow-sm backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all focus:opacity-100"
                >
                    <Maximize2 className="w-5 h-5" />
                </button>
            </div>

            {/* Thumbnail Strip */}
            {images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar">
                    {images.map((img, idx) => (
                        <button
                            key={img.id}
                            onClick={() => handleThumbnailClick(idx)}
                            className={`relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all ${idx === currentIndex
                                    ? 'border-blue-600 shadow-md ring-2 ring-blue-600/20'
                                    : 'border-transparent hover:border-zinc-300 opacity-70 hover:opacity-100 bg-white shadow-sm'
                                }`}
                        >
                            <Image
                                src={img.url}
                                alt={`Thumbnail ${idx + 1}`}
                                fill
                                className="object-cover"
                            />
                        </button>
                    ))}
                </div>
            )}

            {/* Fullscreen Modal overlay */}
            {isFullscreen && (
                <div
                    className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 sm:p-8"
                    onClick={() => setIsFullscreen(false)}
                >
                    <div className="relative w-full h-full max-w-6xl max-h-[90vh]">
                        <Image
                            src={currentImage.url}
                            alt={`${productName} Fullscreen`}
                            fill
                            className="object-contain"
                        />
                        {images.length > 1 && (
                            <>
                                <button
                                    onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                                    className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                                >
                                    <ChevronLeft className="w-8 h-8" />
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleNext(); }}
                                    className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                                >
                                    <ChevronRight className="w-8 h-8" />
                                </button>
                            </>
                        )}
                        <button
                            className="absolute top-4 right-4 text-white p-2 bg-white/10 hover:bg-white/20 rounded-full"
                            onClick={(e) => { e.stopPropagation(); setIsFullscreen(false); }}
                        >
                            Tutup
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
