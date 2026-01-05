import useEmblaCarousel from "embla-carousel-react";
import AutoScroll from "embla-carousel-auto-scroll";
import { useEffect, useState } from "react";

const partners = [
  { name: "SulAmérica", logo: "/images/sulamerica.jpg" },
  { name: "Sompo Seguros", logo: "/images/sompo.jpg" },
  { name: "HDI Seguros", logo: "/images/hdi.jpg" },
  { name: "Bradesco Seguros", logo: "/images/bradesco.jpg" },
  { name: "Suhai Seguradora", logo: "/images/suhai.jpg" },
  { name: "Porto Seguro", logo: "/images/porto_seguro.jpg" },
  { name: "Liberty Seguros", logo: "/images/liberty.jpg" },
  { name: "Aliro Seguro", logo: "/images/aliro.jpg" },
  { name: "Tokio Marine", logo: "/images/tokio_marine.jpg" },
  { name: "Mapfre", logo: "/images/mapfre.jpg" },
  { name: "Azul Seguros", logo: "/images/azul.jpg" },
  { name: "Allianz", logo: "/images/allianz.jpg" },
  { name: "Darwin Seguros", logo: "/images/darwin.png" },
];

export default function PartnersCarousel() {
  const [emblaRef] = useEmblaCarousel(
    { loop: true, dragFree: true },
    [AutoScroll({ speed: 1, stopOnInteraction: false })]
  );

  return (
    <div className="w-full py-12 bg-slate-50 overflow-hidden">
      <div className="container mb-8 text-center">
        <h3 className="text-xl font-heading font-semibold text-muted-foreground">
          Parceiros das melhores seguradoras do Brasil
        </h3>
      </div>
      
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex touch-pan-y">
          {partners.map((partner, index) => (
            <div 
              key={index} 
              className="flex-[0_0_160px] min-w-0 mx-6 flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-500 opacity-60 hover:opacity-100"
            >
              <div className="h-16 w-32 relative flex items-center justify-center bg-white rounded-lg shadow-sm p-2">
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
