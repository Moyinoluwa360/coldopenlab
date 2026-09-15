import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

/** Public-site chrome: header nav, main landmark and footer. */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <Header />
      <main id="main" tabIndex={-1}>
        {children}
      </main>
      <Footer />
    </>
  );
}
