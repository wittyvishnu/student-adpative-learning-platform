import Link from "next/link"

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <div className="flex items-center">
        <span className="text-2xl font-bold">
          <span className="inline-block mr-1">◼</span>Positivus
        </span>
      </div>
    </Link>
  )
}
