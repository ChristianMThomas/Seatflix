const Homepg = () => {
  return (
    <main className="relative">
      {/* Hero Pattern Background */}
      <div className="pattern opacity-40" />

      <div className="wrapper">
        {/* Hero Section */}
        <header className="animate-fade-in">
          <div className="text-center space-y-6">
            <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-600 bg-clip-text text-transparent">
              Mind-Forge
            </h1>
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              SeatFlix
            </h2>
            <p className="text-xl md:text-2xl text-light-200 max-w-3xl mx-auto">
              Your premium streaming experience awaits
            </p>
          </div>

          <div className="mt-12 animate-slide-in-up">
            <img
              src="hero-img.png"
              alt="SeatFlix Hero"
              className="rounded-2xl shadow-2xl border border-purple-500/30 animate-float"
            />
          </div>
        </header>

        {/* Features Section */}
        <section className="mt-20 animate-slide-in-up delay-200">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">
              Why Choose SeatFlix?
            </h2>
            <p className="text-light-200 text-lg">
              Experience entertainment like never before
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-purple-500/20">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white text-center mb-3">
                Unlimited Streaming
              </h3>
              <p className="text-light-200 text-center">
                Access thousands of movies and shows anytime, anywhere
              </p>
            </div>

            {/* Feature 2 */}
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-purple-500/20">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white text-center mb-3">
                Smart Recommendations
              </h3>
              <p className="text-light-200 text-center">
                Personalized content suggestions based on your preferences
              </p>
            </div>

            {/* Feature 3 */}
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-purple-500/20">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-500 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white text-center mb-3">
                Safe & Secure
              </h3>
              <p className="text-light-200 text-center">
                Your privacy and data security are our top priorities
              </p>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="mt-20 animate-slide-in-up delay-400">
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-10 md:p-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-8">
              About SeatFlix
            </h2>
            <div className="max-w-4xl mx-auto space-y-6 text-light-200 text-lg leading-relaxed">
              <p>
                At Mind-Forge, we are committed to providing a <span className="text-purple-400 font-semibold">safe and trustworthy streaming experience</span>. Your privacy is safeguarded with industry-leading encryption, and your data is handled responsibly in compliance with privacy laws.
              </p>
              <p>
                All content on our platform is carefully curated to ensure a <span className="text-purple-400 font-semibold">premium entertainment experience</span> for all users. Stream with confidence, knowing your safety is our top priority.
              </p>
              <p className="text-center pt-6 text-light-100 italic">
                Thank you for choosing SeatFlix - ©️ Mind-Forge 2025
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="mt-20 mb-20 text-center animate-slide-in-up delay-600">
          <div className="backdrop-blur-xl bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-3xl p-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Start Watching?
            </h2>
            <p className="text-light-200 text-lg mb-8">
              Discover your next favorite movie or show today
            </p>
            <a
              href="/Search"
              className="inline-block px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/50"
            >
              Browse Content
            </a>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Homepg;
