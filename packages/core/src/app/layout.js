import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });
import TopLoader from "@/components/TopLoader";
// import ServiceWorkerRegistration from "@/components/ServiceWorkerRegistration";
import NavbarContainer from "@/components/Navbar/NavbarContainer";

export const metadata = {
  title: "Microlight",
  description: "Simple single server task runner",
  // icons: {
  //   icon: [
  //     { url: '/favicon.ico' },
  //     { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
  //     { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
  //     { url: '/favicon-48x48.png', sizes: '48x48', type: 'image/png' },
  //   ],
  //   apple: [
  //     { url: '/apple-touch-icon.png' },
  //   ],
  // },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"/>
      </head>
      <body className={inter.className} style={{ margin: 0, padding: 0 }}>
        {/* <ServiceWorkerRegistration /> */}
        <TopLoader />
        <NavbarContainer>
          {children}
        </NavbarContainer>
      </body>
    </html>
  );
}
