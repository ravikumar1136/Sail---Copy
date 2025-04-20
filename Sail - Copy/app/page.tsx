import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, CheckCircle, Shield, TrendingUp } from "lucide-react"

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-12">
      <section className="flex flex-col md:flex-row items-center justify-between gap-8 py-12">
        <div className="flex-1 space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Steel Solutions for a <span className="text-primary">Stronger</span> Tomorrow
          </h1>
          <p className="text-lg text-muted-foreground">
            SAIL is India's largest steel producer, offering high-quality steel products for various industries. Order
            your steel products online with our easy-to-use platform.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/order">
              <Button size="lg" className="gap-2">
                Place Order <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline">
                Login / Sign Up
              </Button>
            </Link>
          </div>
        </div>
        <div className="flex-1 flex justify-center">
          <div className="relative w-full max-w-md aspect-square">
            <Image src="/sailLogo.jpg" alt="SAIL Logo" fill className="object-contain" priority />
          </div>
        </div>
      </section>

      <section className="py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose SAIL?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card>
            <CardContent className="pt-6 flex flex-col items-center text-center">
              <CheckCircle className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Quality Assurance</h3>
              <p className="text-muted-foreground">
                Our steel products meet the highest quality standards and specifications.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 flex flex-col items-center text-center">
              <TrendingUp className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Industry Leader</h3>
              <p className="text-muted-foreground">
                With decades of experience, SAIL is India's largest steel producer.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 flex flex-col items-center text-center">
              <Shield className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Reliable Delivery</h3>
              <p className="text-muted-foreground">
                Our efficient supply chain ensures timely delivery of your orders.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Our Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            "Hot Rolled Coils",
            "Cold Rolled Coils",
            "Galvanized Products",
            "Plates",
            "Structural Steel",
            "Railway Products",
          ].map((product) => (
            <Card key={product}>
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold mb-2">{product}</h3>
                <p className="text-muted-foreground">
                  High-quality steel products for various industrial applications.
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}

