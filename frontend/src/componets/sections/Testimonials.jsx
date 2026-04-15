import React from 'react';
const TESTIMONIALS = [
  {
    quote: "The real-time code execution was a game changer. My candidate could see results instantly, which made the conversation way more productive than whiteboard sessions.",
    name: "Arjun Kapoor",
    role: "Senior Engineer @ Google",
    initials: "AK",
    color: "green",  
  },
  {
    quote: "I used Code_Tester to prep for my FAANG loop. The practice mode with AI feedback helped me improve my time complexity by catching patterns I was missing.",
    name: "Sarah Reeves",
    role: "Software Dev @ Meta",
    initials: "SR",
    color: "blue",
  },
  {
    quote: "Room locking and session recordings made our remote hiring process feel structured and fair. The auto feedback report saves us 30 minutes per debrief.",
    name: "Maya Patel",
    role: "Engineering Manager @ Stripe",
    initials: "MP",
    color: "purple",
  },
];

const Testimonials = () => {
  return (
    <section className="py-20 bg-zinc-950 border-t border-zinc-800">
      <div className="max-w-6xl mx-auto px-6 reveal">
        {/* Header */}
        <div className="text-center md:text-left mb-12">
          <div className="font-mono text-xs tracking-[0.125em] uppercase text-green-500 mb-3">
            Testimonials
          </div>
          <h2 className="text-4xl text-white/80 md:text-5xl font-bold tracking-tighter leading-tight">
            Trusted by Engineers<br />at Top Companies
          </h2>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((testimonial) => (
            <div
              key={testimonial.name}
              className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 transition-all duration-300 hover:border-zinc-700 group"
            >
              {/* Star Rating */}
              <div className="text-orange-400 text-xl mb-6">★★★★★</div>

              {/* Quote */}
              <blockquote className="text-zinc-200 text-[15px] leading-relaxed mb-8 font-light italic">
                <span className="text-green-500 text-4xl leading-none mr-1 align-super">“</span>
                {testimonial.quote}
              </blockquote>

              {/* Author Info */}
              <div className="flex items-center gap-4">
                {/* Avatar */}
                <div
                  className={`w-11 h-11 rounded-2xl flex items-center justify-center font-mono font-bold text-sm flex-shrink-0
                    ${testimonial.color === 'green' && 'bg-green-500/10 text-green-400'}
                    ${testimonial.color === 'blue' && 'bg-blue-500/10 text-blue-400'}
                    ${testimonial.color === 'purple' && 'bg-purple-500/10 text-purple-400'}
                  `}
                >
                  {testimonial.initials}
                </div>
                {/* Name & Role */}
                <div>
                  <div className="font-semibold text-white">{testimonial.name}</div>
                  <div className="text-zinc-500 text-sm font-mono tracking-tight">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;