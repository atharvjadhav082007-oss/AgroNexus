import { Star, Quote } from "lucide-react";

export default function TestimonialsSection() {
  const testimonials = [
    {
      name: "Ramesh Yadav",
      village: "Rohtak, Haryana",
      quote: "KhetSeva saved my mustard harvest. The rainfall alert came 3 days early, giving me plenty of time to safely harvest and store my crops.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop",
    },
    {
      name: "Harpreet Singh",
      village: "Bhatinda, Punjab",
      quote: "The soil compatibility report suggested Soybean instead of my traditional crops. My farm yield went up by 25% this season!",
      rating: 5,
      image: "https://images.unsplash.com/photo-1628157582853-a796fa650a6a?q=80&w=150&auto=format&fit=crop",
    },
    {
      name: "Ananth Gowda",
      village: "Mandya, Karnataka",
      quote: "The government schemes advisor is outstanding. I received a ₹4,500 seed subsidy recommendation that I would have completely missed otherwise.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop",
    },
  ];

  return (
    <section className="py-20 bg-gray-50 border-t border-gray-100 relative overflow-hidden">
      {/* Decorative Blur */}
      <div className="absolute top-1/3 right-10 w-60 h-60 bg-green-50 rounded-full blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold text-[#2E7D32] uppercase tracking-widest block mb-3">Testimonials</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            Voices of Resilient Farmers
          </h2>
          <p className="mt-4 text-sm sm:text-base text-gray-500 font-medium">
            Hear from farmers who are leveraging data intelligence to protect their livelihoods and increase their profits.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, index) => (
            <div
              key={index}
              className="bg-white border border-gray-150 rounded-[22px] p-7 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between relative"
            >
              {/* Quote Icon overlay */}
              <Quote className="absolute top-6 right-6 w-8 h-8 text-green-50 stroke-[1.5]" />

              <div className="space-y-5">
                {/* Stars */}
                <div className="flex space-x-1">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4.5 h-4.5 text-amber-400 fill-amber-400" />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-sm text-gray-600 leading-relaxed italic font-normal text-left">
                  "{t.quote}"
                </p>
              </div>

              {/* Author Info */}
              <div className="flex items-center space-x-3.5 pt-6 mt-6 border-t border-gray-50">
                <img
                  src={t.image}
                  alt={t.name}
                  className="w-11 h-11 rounded-full object-cover object-center shadow-inner border border-gray-100"
                />
                <div className="text-left leading-tight">
                  <span className="block text-sm font-bold text-gray-900">{t.name}</span>
                  <span className="block text-[11px] text-gray-400 font-semibold">{t.village}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
