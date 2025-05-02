import { Button } from "@/components/ui/button"

export default function PotentialSection() {
  return (
    <section className="container px-4 md:px-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="space-y-4">
          <h2 className="text-3xl font-bold">Let's Unlock Your Full Potential</h2>
          <p className="text-gray-500">
            Ready to study smarter, not harder? Tell us what you want to learn and get a customized learning path that
            grows with you — powered by AI.
          </p>
          <Button className="bg-black text-white hover:bg-gray-800">Build My Learning Plan</Button>
        </div>
        <div className="flex justify-center">
          <div className="relative w-64 h-64">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 bg-gray-200 rounded-full"></div>
              <div className="absolute w-16 h-16 bg-black rounded-full flex items-center justify-center">
                <div className="w-8 h-8 bg-white rounded-full"></div>
              </div>
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="text-4xl">✨</div>
              </div>
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/4">
                <div className="w-16 h-16 bg-[#9efa35] rotate-45"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
