import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });
import "./globals.css";
import TopLoader from "@/components/TopLoader";
// import ServiceWorkerRegistration from "@/components/ServiceWorkerRegistration";
import NavbarContainer from "@/components/Navbar/NavbarContainer";

export const metadata = {
  title: "Microlight",
  description: "Simple single server task runner",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} m-0 p-0`}>
        {/* <ServiceWorkerRegistration /> */}
        <TopLoader />
        <NavbarContainer>
          {children}
        </NavbarContainer>
      </body>
    </html>
  );
}
