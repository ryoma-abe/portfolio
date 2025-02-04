import { defineConfig } from 'astro/config'
import { URL } from './src/data/constants'
import tunnel from 'astro-tunnel'
import icon from 'astro-icon'
import { astroImageTools } from 'astro-imagetools'
import i18n from '@astrolicious/i18n'
import sitemap from 'astro-sitemap'
import playformCompress from '@playform/compress'
import compressor from 'astro-compressor'
import partytown from '@astrojs/partytown'

export default defineConfig({
  site: URL,
  server: {
    host: true
  },
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport'
  },
  compressHTML: false,
  integrations: [
    partytown({
      config: {
        debug: true,
        forward: ['dataLayer.push'],
        resolveUrl: (url, location, type) => {
          if (
            type === 'script' &&
            url.hostname.includes('googletagmanager.com')
          ) {
            return new URL(url.href)
          }
          return url
        }
      }
    }),
    tunnel(),
    icon({
      include: {
        local: {
          src: './src/icons',
          pattern: '**/*.svg'
        }
      }
    }),
    astroImageTools,
    i18n({
      defaultLocale: 'ja',
      locales: ['ja', 'en']
    }),
    sitemap({
      canonicalURL: URL,
      lastmod: new Date(),
      createLinkInHead: false,
      xmlns: {
        xhtml: true,
        news: false,
        video: false,
        image: false
      },
      i18n: {
        defaultLocale: 'ja',
        locales: {
          es: 'ja'
        }
      },
      serialize(item) {
        item.url = item.url.replace(/\/$/g, '')
        return item
      }
    }),
    playformCompress({
      HTML: {
        collapseBooleanAttributes: true,
        maxLineLength: 0,
        removeAttributeQuotes: false,
        removeComments: true,
        removeEmptyAttributes: true,
        removeOptionalTags: true,
        removeRedundantAttributes: true,
        useShortDoctype: true
      },
      JavaScript: {
        compress: {
          ecma: 2015
        },
        format: {
          comments: false,
          ecma: 2015
        },
        ecma: 2015,
        module: true
      },
      Image: false,
      SVG: false
    }),
    compressor()
  ]
})
