import { useEffect, useState } from "react";
import { Star, Quote, User } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { motion } from "framer-motion";
import { ScrollReveal } from "./animations/ScrollReveal";
import { Parallax } from "./animations/Parallax";
import { SplitReveal } from "./motion/SplitReveal";
import "swiper/css";
import "swiper/css/pagination";

interface Testimonial {
  id: number;
  acf: {
    name: string;
    title: string;
    quote: string;
    rating: number;
    image?: { url?: string };
  };
}

export const Testimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await fetch(
          "https://ifleon.com/wp-json/wp/v2/testimonials?_embed&acf_format=standard",
        );
        const data = await res.json();
        if (Array.isArray(data)) setTestimonials(data);
      } catch (error) {
        console.error("Failed to fetch testimonials:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTestimonials();
  }, []);

  return (
    <section
      id="testimonials"
      className="relative py-20 md:py-24 bg-transparent overflow-hidden"
    >
      <Parallax
        offset={50}
        className="absolute inset-0 z-0 pointer-events-none"
        style={{ willChange: "transform" }}
      >
        <div className="absolute inset-0 iso-grid-bg opacity-25" />
      </Parallax>
      <Parallax
        offset={-50}
        className="absolute inset-0 z-0 pointer-events-none"
        style={{ willChange: "transform" }}
      >
        <div className="absolute inset-0 mesh-bg opacity-30" />
      </Parallax>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="up">
          <div className="text-center mb-12 md:mb-16">
            <p className="eyebrow mb-3">
              Testimonials
            </p>
            <SplitReveal as="h2" className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground mb-4 leading-tight">
              What our{" "}
              <span className="font-display text-gradient-iflo">clients say</span>
            </SplitReveal>
            <p className="text-base md:text-xl text-muted-foreground max-w-3xl mx-auto">
              Honest feedback from clients who partnered with IFLEON for AI, DevOps,
              cloud, and digital transformation solutions.
            </p>
          </div>
        </ScrollReveal>

        {loading ? (
          <p className="text-center text-muted-foreground">Loading testimonials…</p>
        ) : testimonials.length > 0 ? (
          <Swiper
            modules={[Autoplay, Pagination]}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            loop={testimonials.length > 2}
            pagination={{ clickable: true }}
            spaceBetween={24}
            breakpoints={{
              1024: { slidesPerView: 3 },
              768: { slidesPerView: 2 },
              0: { slidesPerView: 1 },
            }}
            className="!pb-12"
          >
            {testimonials.map((testimonial) => {
              const rating = Math.min(
                5,
                Math.max(0, Number(testimonial.acf.rating)),
              );
              const hasImage = Boolean(testimonial.acf.image?.url);

              return (
                <SwiperSlide key={testimonial.id}>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -8 }}
                    transition={{ type: "spring", stiffness: 200, damping: 22 }}
                    className="surface-card relative rounded-2xl p-6 md:p-8 h-full flex flex-col justify-between"
                  >
                    <div className="absolute -top-3 -left-3 w-10 h-10 rounded-xl flex items-center justify-center bg-primary shadow-card">
                      <Quote className="h-5 w-5 text-primary-foreground" />
                    </div>

                    <div>
                      <p className="text-foreground mb-6 mt-2 leading-relaxed text-base md:text-lg">
                        "{testimonial.acf.quote}"
                      </p>

                      <div className="flex items-center gap-1 mb-5">
                        {[...Array(rating)].map((_, i) => (
                          <Star
                            key={i}
                            className="h-4 w-4 text-warning fill-current"
                          />
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pt-4 border-t border-border">
                      {hasImage ? (
                        <img
                          src={testimonial.acf.image!.url}
                          alt={testimonial.acf.name}
                          className="w-11 h-11 rounded-full object-cover border-2 border-border shadow-sm"
                        />
                      ) : (
                        <div className="w-11 h-11 rounded-full bg-primary flex items-center justify-center shadow-sm">
                          <User className="h-5 w-5 text-primary-foreground" />
                        </div>
                      )}

                      <div>
                        <div className="font-bold text-foreground text-sm md:text-base">
                          {testimonial.acf.name}
                        </div>
                        <div className="text-muted-foreground text-xs md:text-sm">
                          {testimonial.acf.title}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        ) : (
          <p className="text-center text-muted-foreground">
            No testimonials available at the moment.
          </p>
        )}
      </div>
    </section>
  );
};
