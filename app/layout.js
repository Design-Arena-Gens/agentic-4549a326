export const metadata = {
  title: "Conway's Game of Life",
  description: "Interactive implementation of Conway's Game of Life",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  );
}
