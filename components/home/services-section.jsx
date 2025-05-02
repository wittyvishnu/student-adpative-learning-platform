import Link from "next/link"
import { ArrowRight } from "lucide-react"

export default function ServicesSection() {
  return (
    <section className="container px-4 md:px-6">
      <div className="space-y-8">
        <div className="inline-block bg-[#9efa35] px-4 py-1 text-lg font-medium">Services</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border rounded-lg p-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="inline-block bg-[#9efa35] px-3 py-1 text-sm font-medium">Personalized Assessments</div>
              <div className="h-32 flex items-center justify-center">
                <div className="relative w-24 h-24">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 border-2 border-black rounded-full"></div>
                    <div className="absolute top-0 right-0 w-4 h-4">+</div>
                    <div className="absolute bottom-0 left-0 w-4 h-4">+</div>
                    <div className="absolute bottom-1/4 right-1/4 w-6 h-6 bg-white border border-black rounded-full flex items-center justify-center">
                      <div className="w-3 h-3 text-black">😃</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <Link href="#" className="flex items-center gap-2 text-sm font-medium">
              <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center">
                <ArrowRight className="h-3 w-3" />
              </div>
              Learn more
            </Link>
          </div>
          <div className="border rounded-lg p-6 flex flex-col justify-between bg-[#9efa35]">
            <div className="space-y-4">
              <div className="inline-block bg-black text-white px-3 py-1 text-sm font-medium">Real-Time Feedback</div>
              <div className="h-32 flex items-center justify-center">
                <div className="w-32 h-24 bg-white rounded border border-black p-2">
                  <div className="flex justify-between mb-2">
                    <div className="w-2 h-2 bg-black rounded-full"></div>
                    <div className="w-2 h-2 bg-black rounded-full"></div>
                    <div className="w-2 h-2 bg-black rounded-full"></div>
                  </div>
                  <div className="flex justify-center">
                    <div className="w-8 h-8 bg-white border border-black rounded-full flex items-center justify-center">
                      <div className="w-4 h-4 text-black">😃</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <Link href="#" className="flex items-center gap-2 text-sm font-medium">
              <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center">
                <ArrowRight className="h-3 w-3" />
              </div>
              Learn more
            </Link>
          </div>
          <div className="border rounded-lg p-6 flex flex-col justify-between bg-[#1c1c24] text-white">
            <div className="space-y-4">
              <div className="inline-block bg-white text-black px-3 py-1 text-sm font-medium">Weakness Detection</div>
              <div className="h-32 flex items-center justify-center">
                <div className="w-24 h-24 bg-white rounded border border-gray-300">
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-12 h-12 text-black">🎯</div>
                  </div>
                </div>
              </div>
            </div>
            <Link href="#" className="flex items-center gap-2 text-sm font-medium text-white">
              <div className="w-6 h-6 rounded-full bg-white text-black flex items-center justify-center">
                <ArrowRight className="h-3 w-3" />
              </div>
              Learn more
            </Link>
          </div>
          <div className="border rounded-lg p-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="inline-block bg-[#9efa35] px-3 py-1 text-sm font-medium">Analytics and Tracking</div>
              <div className="h-32 flex items-center justify-center">
                <div className="w-32 h-24 bg-white rounded border border-gray-300 p-2">
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="space-y-2 w-full">
                      <div className="w-full h-2 bg-gray-200 rounded"></div>
                      <div className="w-3/4 h-2 bg-gray-200 rounded"></div>
                      <div className="w-1/2 h-2 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <Link href="#" className="flex items-center gap-2 text-sm font-medium">
              <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center">
                <ArrowRight className="h-3 w-3" />
              </div>
              Learn more
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
