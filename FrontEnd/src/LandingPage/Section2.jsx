import React from 'react';
import { FiClock, FiCalendar, FiHeart, FiShield, FiCloud } from 'react-icons/fi';

const Section2 = () => {
  const features = [
    {
      icon: FiClock,
      title: 'Schedule Future Delivery',
      desc: 'Set the perfect date for your memories to arrive.',
    },
    {
      icon: FiCalendar,
      title: 'Curate Special Moments',
      desc: 'Upload photos, videos, and messages that capture the essence of your life.',
    },
    {
      icon: FiHeart,
      title: 'Share with Loved Ones',
      desc: 'Invite family and friends to contribute to your shared time capsule.',
    },
    {
      icon: FiShield,
      title: 'Securely Preserved',
      desc: 'Your memories are encrypted and stored safely for generations.',
    },
  ];

  const LeftCard = [
    'Legal complications accessing accounts after someone passes',
    'Limited scheduling and delivery options',
    'Automatic account deletion after periods of inactivity',
    'No emotional context or intentional timing capabilities',
  ];

  const RightCard = [
    "Emotional timing that ensures your messages arrive at life's most meaningful moments",
    'Intentional delivery designed for maximum impact when your loved ones need support',
    'A powerful, nostalgic experience that preserves the authentic you',
    "Your data is yours alone - we don't mine it for advertising",
  ];

  return (
    <div className="w-full bg-[#f2eee3] py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-blue-950 text-center lg:text-center">
          Send a message to the future
        </h1>

        <p className="mt-5 text-center text-lg text-[#666666] max-w-2xl mx-auto font-serif font-[550]">
          Because the people you love deserve to feel your presence, even when you're not there
        </p>

        {/* Features Grid */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="rounded-2xl bg-[#cbe2d4] shadow p-6 sm:p-8 flex flex-col font-serif font-bold">
                <div className="h-10 w-10 rounded-lg flex items-center justify-center">
                  <Icon className="text-[#025622]" size={25} />
                </div>
                <h3 className="mt-6 text-xl sm:text-2xl font-semibold text-slate-900">
                  {feature.title}
                </h3>
                <p className="mt-3 text-slate-600 text-sm sm:text-base">{feature.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Preserve What Matters */}
        <div className="mt-16">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-blue-950 text-center lg:text-center">
            Preserve What Truly Matters
          </h1>
          <p className="mt-5 text-center lg:text-center text-lg text-[#666666] max-w-5xl mx-auto lg:mx-20 px-2 font-serif font-[550]">
            We're not just cloud storage. We're the feeling you get when you stumble across an old
            home video and suddenly time stands still. Only now, it's delivered with intention—on a
            future date of your choosing—so that someone you love can feel that same magic,
            exactly when they need it most.
          </p>
          <h1 className="mt-4 text-center lg:text-center text-lg text-[#025622] font-semibold italic max-w-4xl mx-auto lg:mx-20 px-2">
            "We grow one memory at a time."
          </h1>
        </div>

        {/* Left vs Right Cards */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Card */}
          <div className="bg-[#cbe2d4] rounded-2xl p-6 sm:p-8 shadow-sm ring-1 ring-black/5">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-12 w-12 flex items-center justify-center">
                <FiCloud className="text-[#025622]" size={24} />
              </div>
              <h2 className="text-2xl font-serif font-bold text-slate-900">Traditional Cloud Storage Falls Short</h2>
            </div>
            <ul className="space-y-3 mb-6">
              {LeftCard.map((item, index) => (
                <li key={index} className="flex items-start gap-3 font-serif font-bold">
                  <div className="w-2 h-2 bg-[#025622] rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-slate-700 leading-relaxed text-sm sm:text-base">{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-[#025622] italic text-base sm:text-lg font-serif font-bold">
              This isn't a platform for clicks. It's a vault for your love.
            </p>
          </div>

          {/* Right Card */}
          <div className="bg-[#cbe2d4] rounded-2xl p-6 sm:p-8 shadow-sm ring-1 ring-black/5 font-serif font-bold">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-12 w-12 flex items-center justify-center">
                <FiHeart className="text-[#025622]" size={24} />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Virtual Time Capsule Delivers What Matters</h2>
            </div>
            <ul className="space-y-3 mb-6">
              {RightCard.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#025622] rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-slate-700 leading-relaxed text-sm sm:text-base">{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-[#025622] italic text-base sm:text-lg font-serif font-bold">
              Because your story doesn't end when you do.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Section2;
