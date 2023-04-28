import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head >
          <link
              href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css"
              rel="stylesheet"
              integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC"
              crossOrigin="anonymous"
          />
          {/* eslint-disable-next-line @next/next/no-sync-scripts */}
          <script
              src="https://code.jquery.com/jquery-3.3.1.slim.min.js"
              integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo"
              crossOrigin="anonymous"
          ></script>
          {/* eslint-disable-next-line @next/next/no-sync-scripts */}
          <script
              src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.3/dist/umd/popper.min.js"
              integrity="sha384-SqhtCGtVSGc5x5xZRE5HtkjCrz7Vr/5Iu6eVHHshkjL9Xnv39BDnHywjggN7ZzNG"
              crossOrigin="anonymous"
          ></script>
          {/* eslint-disable-next-line @next/next/no-sync-scripts */}
          <script
              src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js"
              integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM"
              crossOrigin="anonymous"
          ></script>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
