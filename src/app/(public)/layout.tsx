import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col relative w-full overflow-x-hidden">
      <Navbar />
      <main className="flex-1 flex flex-col w-full relative z-10">{children}</main>
      <Footer />
    </div>
  )
}
