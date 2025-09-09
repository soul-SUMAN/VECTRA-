
export default function Home() {
  return (
    <>
        <div>
                
            <div className="relative "
            style={
                {backgroundImage: "url('/cars.png')",
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                height: '75vh',
                }
            }>
            <div className="absolute inset-0 backdrop-blur-xl bg-black/10 z-0"></div>
            <div className="relative z-10 max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-22">
                    
            <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center ">
                <h1 className="text-4xl sm:text-6xl font-bold text-gray-800  dark:text-orange-500 text-shadow-yellow-500 ">
                    Drive Your Journey
                </h1>

                <p className="mt-3 text-gray-600 dark:text-amber-300 text-lg sm:text-md font-medium text-shadow-black">
                Rent the car you love. When you need it, where you need it.
                </p>

                <div className="mt-7 sm:mt-12 mx-auto max-w-xl relative">
                    {/* Form */}
                    <form>
                    <div className="relative z-10 flex gap-x-3 p-3 bg-white border border-gray-200 rounded-lg shadow-lg shadow-gray-100 dark:bg-neutral-900 dark:border-neutral-700 dark:shadow-gray-900/20">
                        <div className="w-full">
                        <label htmlFor="hs-search-article-1" className="block text-sm text-gray-700 font-medium dark:text-white"><span className="sr-only">Search cars</span></label>
                        <input type="text" name="hs-search-article-1" id="hs-search-article-1" className="py-2.5 px-4 block w-full border-transparent rounded-lg focus:border-yellow-500 focus:ring-yellow-500 dark:bg-neutral-900 dark:border-transparent dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600" placeholder="Search car" />
                        </div>
                        <div>
                        <a className="size-11 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-yellow-500 text-white hover:bg-yellow-600 focus:outline-hidden focus:bg-yellow-600 disabled:opacity-50 disabled:pointer-events-none" href="#">
                            <svg className="shrink-0 size-5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                        </a>
                        </div>
                        
                    </div>
                        <div
                            id="date-range-picker"
                            date-rangepicker="true"
                            className="flex items-center gap-3 mt-3 justify-center"
                          >
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <svg
                                  className="w-4 h-4 text-gray-500 dark:text-gray-400"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4Z M0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Z M5 10h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                                </svg>
                              </div>
                              <input
                                id="datepicker-range-start"
                                name="start"
                                type="text"
                                placeholder="Pickup date"
                                className="pl-10 py-2.5 px-4 flex-1 border border-gray-300 rounded-lg shadow-sm 
                                          focus:ring-yellow-500 focus:border-yellow-500 
                                          dark:bg-neutral-800 dark:border-neutral-700 dark:text-white"
                              />
                            </div>

                            <span className="text-gray-500">to</span>

                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <svg
                                  className="w-4 h-4 text-gray-500 dark:text-gray-400"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4Z M0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Z M5 10h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                                </svg>
                              </div>
                              <input
                                id="datepicker-range-end"
                                name="end"
                                type="text"
                                placeholder="Drop-off date"
                                className="pl-10 py-2.5 px-4 flex-1 border border-gray-300 rounded-lg shadow-sm 
                                          focus:ring-yellow-500 focus:border-yellow-500 
                                          dark:bg-neutral-800 dark:border-neutral-700 dark:text-white"
                              />
                            </div>
                          </div>

                    </form>
                    {/* End Form */}

                    {/* SVG Element */}
                    <div className="hidden md:block absolute top-0 end-0 -translate-y-12 translate-x-20">
                    <svg className="w-16 h-auto text-orange-500" width="121" height="135" viewBox="0 0 121 135" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 16.4754C11.7688 27.4499 21.2452 57.3224 5 89.0164" stroke="currentColor" strokeWidth="10" strokeLinecap="round"/>
                        <path d="M33.6761 112.104C44.6984 98.1239 74.2618 57.6776 83.4821 5" stroke="currentColor" strokeWidth="10" strokeLinecap="round"/>
                        <path d="M50.5525 130C68.2064 127.495 110.731 117.541 116 78.0874" stroke="currentColor" strokeWidth="10" strokeLinecap="round"/>
                    </svg>
                    </div>
                    {/* End SVG Element */}

                    {/* SVG Element */}
                    <div className="hidden mb-16 md:block absolute bottom-0 start-0 translate-y-10 -translate-x-32">
                    <svg className="w-40 h-auto text-cyan-500" width="347" height="188" viewBox="0 0 347 188" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4 82.4591C54.7956 92.8751 30.9771 162.782 68.2065 181.385C112.642 203.59 127.943 78.57 122.161 25.5053C120.504 2.2376 93.4028 -8.11128 89.7468 25.5053C85.8633 61.2125 130.186 199.678 180.982 146.248L214.898 107.02C224.322 95.4118 242.9 79.2851 258.6 107.02C274.299 134.754 299.315 125.589 309.861 117.539L343 93.4426" stroke="currentColor" strokeWidth="7" strokeLinecap="round"/>
                    </svg>
                    </div>
                    {/* End SVG Element */}
                </div>

                <div className="mt-5 sm:mt-10">

                   
                      
                          {/* Stats / Highlights */}
                    <div className="w-full flex justify-center sm:gap-15 gap-5 text-shadow-orange-400">
                      <div className="flex-col">
                        <h3 className="text-gray-900 dark:text-white text-3xl font-bold">500+</h3>
                        <h6 className="text-gray-500 dark:text-gray-400 text-sm">Available Cars</h6>
                      </div>
                      <div className="flex-col">
                        <h4 className="text-gray-900 dark:text-white text-3xl font-bold">1k+</h4>
                        <h6 className="text-gray-500 dark:text-gray-400 text-sm">Happy Customers</h6>
                      </div>
                      <div className="flex-col">
                        <h4 className="text-gray-900 dark:text-white text-3xl font-bold">24/7</h4>
                        <h6 className="text-gray-500 dark:text-gray-400 text-sm">Customer Support</h6>
                      </div>
                    </div>
                  

                </div>
                </div>
            </div>
            </div>
            
            </div>

        </div>








 <section className="py-24 relative bg-gray-50 dark:bg-neutral-900">
      <div className="w-full max-w-7xl px-4 md:px-6 lg:px-8 mx-auto grid lg:grid-cols-2 gap-12 items-center">
        
        {/* LEFT SIDE → Car Image */}
        <div className="flex justify-center">
          <img
            src="/car-togather.png"
            alt="About Vectra"
            className="rounded-xl object-cover shadow-xl max-h-[400px]"
          />
        </div>

        {/* RIGHT SIDE → About Content */}
        <div className="flex flex-col gap-6">
          <h2 className="text-4xl sm:text-5xl font-bold text-orange-500 dark:text-orange-400">
            About VECTRA
          </h2>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
            At <span className="font-semibold">VECTRA</span>, we believe renting a car should be
            simple, affordable, and stress-free. Our platform brings together
            a wide range of cars — from luxury sedans to budget-friendly compacts —
            ensuring that you always find the perfect ride for every journey.
          </p>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            Powered by modern AI features, VECTRA helps you get personalized car
            recommendations, predicts rental demand, and even assists with smart
            pricing — so both customers and providers benefit.
          </p>

          {/* Stats */}
          <div className="flex gap-10 mt-4">
            <div>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white">500+</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Cars Available</p>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white">1k+</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Satisfied Users</p>
            </div>
          </div>

          {/* Read More */}
          <button className="mt-6 sm:w-fit w-full px-6 py-3 bg-yellow-500 hover:bg-yellow-600 transition-all duration-300 rounded-lg text-white font-medium">
            Read More
          </button>
        </div>
      </div>
    </section>







     <section className="py-24 relative bg-gray-50 dark:bg-neutral-900">
      <div className="w-full max-w-6xl px-4 md:px-6 lg:px-8 mx-auto grid lg:grid-cols-2 gap-12">
        
        {/* LEFT SIDE → Info */}
        <div className="flex flex-col gap-6">
          <h2 className="text-4xl sm:text-5xl font-bold text-orange-500 dark:text-orange-400">
            Get in Touch
          </h2>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
            Have a question, feedback, or need support?  
            Our team is here <span className="font-semibold">24/7</span> to assist you.  
            Reach out to us and we’ll get back to you quickly.
          </p>

          <div className="mt-6 space-y-4">
            <p className="flex items-center text-gray-700 dark:text-gray-300">
              📍 <span className="ml-2">123 Car Street, Kolkata, India</span>
            </p>
            <p className="flex items-center text-gray-700 dark:text-gray-300">
              📞 <span className="ml-2">+91 98765 43210</span>
            </p>
            <p className="flex items-center text-gray-700 dark:text-gray-300">
              📧 <span className="ml-2">support@vectra.com</span>
            </p>
          </div>
        </div>

        {/* RIGHT SIDE → Contact Form */}
        <div className="bg-white dark:bg-neutral-800 shadow-lg rounded-xl p-8">
          <form className="space-y-5">
            <div>
              <label className="block text-gray-700 dark:text-gray-200 font-medium mb-1">
                Name
              </label>
              <input
                type="text"
                placeholder="Your name"
                className="w-full p-3 rounded-lg border border-gray-300 focus:ring-yellow-500 focus:border-yellow-500 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-gray-700 dark:text-gray-200 font-medium mb-1">
                Email
              </label>
              <input
                type="email"
                placeholder="Your email"
                className="w-full p-3 rounded-lg border border-gray-300 focus:ring-yellow-500 focus:border-yellow-500 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-gray-700 dark:text-gray-200 font-medium mb-1">
                Message
              </label>
              <textarea
                placeholder="Write your message..."
                rows="4"
                className="w-full p-3 rounded-lg border border-gray-300 focus:ring-yellow-500 focus:border-yellow-500 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full px-6 py-3 bg-yellow-500 hover:bg-yellow-600 transition-all duration-300 rounded-lg text-white font-medium"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </section>

    </>
  )
}
