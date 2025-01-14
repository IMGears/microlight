
export const metadata = {
  title: "Microlight",
  description: "Simple single server task runner",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
