import Link from "next/link"

export function LandingPageFooter() {
  return (
    <footer className="relative overflow-hidden pt-32 pb-12">
      <div className="absolute top-0 left-0 h-px w-full bg-linear-to-r from-transparent via-neutral-800 to-transparent" />

      <div className="relative z-10 container mx-auto px-6">
        <div className="mb-20 grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link
              href="/"
              className="mb-6 block text-2xl font-bold tracking-tight"
            >
              Ordering
            </Link>
            <p className="leading-relaxed text-neutral-600">
              Your destination for premium products and seamless shopping
              experiences.
            </p>
          </div>

          <div>
            <h4 className="mb-6 font-semibold">Shop</h4>
            <ul className="space-y-4 text-neutral-500">
              <li>
                <Link href="#" className="transition-colors hover:text-white">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link href="#" className="transition-colors hover:text-white">
                  Best Sellers
                </Link>
              </li>
              <li>
                <Link href="#" className="transition-colors hover:text-white">
                  Sale
                </Link>
              </li>
              <li>
                <Link href="#" className="transition-colors hover:text-white">
                  Collections
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-6 font-semibold">Support</h4>
            <ul className="space-y-4 text-neutral-500">
              <li>
                <Link href="#" className="transition-colors hover:text-white">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="#" className="transition-colors hover:text-white">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link href="#" className="transition-colors hover:text-white">
                  Returns
                </Link>
              </li>
              <li>
                <Link href="#" className="transition-colors hover:text-white">
                  Track Order
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-6 font-semibold">Contact</h4>
            <p className="mb-4 text-neutral-500">
              Questions? We&apos;re here to help.
            </p>
            <a
              href="mailto:support@ordering.com"
              className="text-xl font-medium transition-colors hover:text-neutral-400"
            >
              support@ordering.com
            </a>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between border-t border-neutral-900 pt-8 text-sm text-neutral-600 md:flex-row">
          <p>&copy; 2025 Ordering. All rights reserved.</p>
          <div className="mt-4 flex items-center gap-6 md:mt-0">
            <Link href="#" className="transition-colors hover:text-white">
              Privacy Policy
            </Link>
            <Link href="#" className="transition-colors hover:text-white">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
