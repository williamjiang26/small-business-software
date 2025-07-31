import * as React from "react";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "../../../node_modules/next/image";

export default function ImageCarousel({ images }) {
  return (
    <Carousel className="w-full max-w-xs">
      <CarouselContent>
        {images.map((image) => (
          <CarouselItem key={image.id}>
            <Card>
              <CardContent className="flex aspect-square items-center justify-center p-1">
                <Image
                  src={image.url}
                  alt="item"
                  className="w-full h-full object-cover"
                />
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="absolute left-1 top-1/2 -translate-y-1/2 z-10" />
      <CarouselNext className="absolute right-1 top-1/2 -translate-y-1/2 z-10" />
    </Carousel>
  );
}
