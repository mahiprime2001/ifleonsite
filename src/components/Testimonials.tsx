import React, { useEffect, useState } from 'react';
import { Star, Quote } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

interface Testimonial {
  id: number;
  acf: {
    name: string;
    title: string;
    quote: string;
    rating: number;
    image: { url: string };
  };
}

export const Testimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await fetch('https://ifleon.com/wp-json/wp/v2/testimonials?_embed&acf_format=standard');
        const data = await res.json();
        if (Array.isArray(data)) {
          setTestimonials(data);
        } else {
          console.error('Unexpected testimonial data:', data);
        }
      } catch (error) {
        console.error('Failed to fetch testimonials:', error);
      }
    };
    fetchTestimonials();
  }, []);

  return (
    <section id="testimonials" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            What Our Clients Say
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Don't just take our word for it. Here's what industry leaders say about 
            working with TechFlow Consulting.
          </p>
        </div>

        {testimonials.length > 0 ? (
          <Swiper
            modules={[Autoplay, Pagination]}
            autoplay={{ delay: 5000 }}
            loop={testimonials.length > 2}
            pagination={{ clickable: true }}
            spaceBetween={30}
            breakpoints={{
              1024: { slidesPerView: 3 },
              768: { slidesPerView: 2 },
              0: { slidesPerView: 1 }
            }}
          >
            {testimonials.map((testimonial, index) => (
              <SwiperSlide key={index}>
                <div className="bg-gray-50 rounded-2xl p-8 relative hover:shadow-lg transition-shadow duration-300 h-full flex flex-col justify-between">
                  <div>
                    <Quote className="h-8 w-8 text-blue-600 mb-4" />
                    <p className="text-gray-700 mb-6 leading-relaxed text-lg">
                      "{testimonial.acf.quote}"
                    </p>
                    <div className="flex items-center space-x-1 mb-4">
                      {[...Array(Number(testimonial.acf.rating))].map((_, i) => (
                        <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <img
  src={testimonial.acf.image?.url}
  alt={testimonial.acf.name}
  className="w-12 h-12 rounded-full object-cover border border-gray-200 shadow-sm"
/>

                    <div>
                      <div className="font-semibold text-gray-900">{testimonial.acf.name}</div>
                      <div className="text-gray-600 text-sm">{testimonial.acf.title}</div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <p className="text-center text-gray-500">Loading testimonials...</p>
        )}
      </div>
    </section>
  );
};
