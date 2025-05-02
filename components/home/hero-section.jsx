import { Button } from "@/components/ui/button"

export default function HeroSection() {
  return (
    <section className="container px-4 py-12 md:px-6 md:py-16 lg:py-20">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-12 items-center">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
            Learning That <br />
            Adapts to You
          </h1>
          <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Our AI-powered learning platform helps students master any subject — from coding and math to science and
            more — by adapting in real-time to their performance and learning needs.
          </p>
          <div className="flex flex-col gap-2 min-[400px]:flex-row">
            <Button className="bg-black text-white hover:bg-gray-800">Start Learning Smarter</Button>
          </div>
        </div>
        <div className="flex justify-center">
          <div className="relative w-full max-w-[500px] aspect-square">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-full h-full">
                <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 border-2 border-black rounded-full animate-[spin_20s_linear_infinite]"></div>
                <div className="absolute top-1/3 left-1/3 w-1/3 h-1/3 border-2 border-[#9efa35] rounded-full animate-[spin_15s_linear_infinite_reverse]"></div>

                <div className="absolute top-1/4 right-1/4 w-12 h-12 bg-black rounded-full flex items-center justify-center"></div>
                <div className="absolute bottom-1/4 left-1/4 w-8 h-8 bg-[#9efa35] rounded-full"></div>

                <div className="absolute top-1/2 right-1/3 w-10 h-10 bg-white border-2 border-black rounded-full flex items-center justify-center">
                  <div className="w-5 h-5 text-black">❤️</div>
                </div>

                <div className="absolute bottom-1/3 right-1/4 w-10 h-10 bg-white border-2 border-black rounded-full flex items-center justify-center">
                  <div className="w-5 h-5 text-black">▶️</div>
                </div>

                <div className="absolute bottom-1/4 right-1/3 w-10 h-10 bg-white border-2 border-black rounded-full flex items-center justify-center">
                  <div className="w-5 h-5 text-black">📍</div>
                </div>

                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-4xl">★</div>
                <div className="absolute bottom-1/4 right-1/4 text-2xl">★</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
