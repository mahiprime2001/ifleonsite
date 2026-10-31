"use client";

import { Star, Quote, User } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { motion } from "framer-motion";
import { ScrollReveal } from "./animations/ScrollReveal";
import "swiper/css";
import "swiper/css/pagination";
import type { Testimonial } from "../lib/api";

/* Testimonials are loaded on the server (lib/content.ts) and passed in. */
export const Testimonials = ({ testimonials }: { testimonials: Testimonial[] }) => {

  return (
    <section
      id="testimonials"
      className="relative py-20 md:py-24 bg-gradient-to-b from-paper via-paper-2 to-paper text-white overflow-hidden"
    >
      <div className="absolute inset-0 iso-grid-bg opacity-25 pointer-events-none" />
      <div className="absolute inset-0 mesh-bg opacity-30 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="up">
          <div className="text-center mb-12 md:mb-16">
            <p className="text-sm font-bold text-brand-700 tracking-[0.3em] uppercase mb-3">
              Testimonials
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold text-ink mb-4 leading-tight">
              What our{" "}
              <span className="text-gradient-iflo">clients say</span>
            </h2>
            <p className="text-base md:text-xl text-ink-2 max-w-3xl mx-auto">
              Honest feedback from clients who partnered with IFLEON for AI, DevOps,
              cloud, and digital transformation solutions.
            </p>
          </div>
        </ScrollReveal>

        {testimonials.length > 0 ? (
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
            className="!pb-12 !pt-5"
          >
            {testimonials.map((testimonial) => {
              const rating = Math.min(5, Math.max(0, Number(testimonial.rating ?? 5) || 0));
              const role = [testimonial.role, testimonial.company].filter(Boolean).join(", ");

              return (
                <SwiperSlide key={testimonial.id}>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -8 }}
                    transition={{ type: "spring", stiffness: 200, damping: 22 }}
                    className="relative bg-white border border-line backdrop-blur-md rounded-2xl p-6 md:p-8 h-full flex flex-col justify-between hover:bg-paper-2 hover:border-brand-600/40 hover:shadow-2xl transition-all"
                  >
                    <div className="absolute -top-3 -left-3 w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-brand-700 to-brand-500 shadow-lg">
                      <Quote className="h-5 w-5 text-white" />
                    </div>

                    <div>
                      <p className="text-ink mb-6 mt-2 leading-relaxed text-base md:text-lg">
                        &quot;{testimonial.quote}&quot;
                      </p>

                      <div className="flex items-center gap-1 mb-5">
                        {[...Array(rating)].map((_, i) => (
                          <Star
                            key={i}
                            className="h-4 w-4 text-amber-400 fill-current"
                          />
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pt-4 border-t border-line">
                      {testimonial.avatarUrl ? (
                        <img
                          src={testimonial.avatarUrl}
                          alt={testimonial.name}
                          className="w-11 h-11 rounded-full object-cover border-2 border-line-strong shadow-sm"
                        />
                      ) : (
                        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-brand-700 to-brand-500 flex items-center justify-center shadow-sm">
                          <User className="h-5 w-5 text-white" />
                        </div>
                      )}

                      <div>
                        <div className="font-bold text-ink text-sm md:text-base">
                          {testimonial.name}
                        </div>
                        <div className="text-ink-3 text-xs md:text-sm">
                          {role}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        ) : (
          <p className="text-center text-ink-3">
            No testimonials available at the moment.
          </p>
        )}
      </div>
    </section>
  );
};
