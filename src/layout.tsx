import Script from 'next/script'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>
        {children}

        {/* --- Google Analytics 設置 --- */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-R95RXEFDYX"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-R95RXEFDYX');
          `}
        </Script>
      </body>
    </html>
  );
}