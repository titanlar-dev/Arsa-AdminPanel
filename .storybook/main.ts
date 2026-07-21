import type { StorybookConfig } from '@storybook/react-vite'

const config = {
  framework: '@storybook/react-vite',

  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],

  addons: [
    '@chromatic-com/storybook',
    '@storybook/addon-vitest',
    '@storybook/addon-a11y',
    '@storybook/addon-docs',
    '@storybook/addon-mcp',
  ],

  /**
   * Sidebar filtre menüsünde varsayılan olarak hariç tutulan tag'ler.
   *
   * Not: `admin-panel` tag'i bilerek buraya eklenmedi — preview.tsx'te her story'ye
   * uygulandığı için ona göre filtrelemek hiçbir şeyi elemezdi. O tag yalnızca
   * AI manifest'inde kaynağı işaretlemek için duruyor.
   */
  tags: {
    experimental: { defaultFilterSelection: 'exclude' },
    deprecated: { defaultFilterSelection: 'exclude' },
  },

  /** AI/MCP için component manifest üretimini açar (React-only, preview aşamasında). */
  features: {
    componentsManifest: true,
  },

  staticDirs: ['../public'],

  /**
   * GitHub Pages project site'ı kökten değil alt yoldan servis edilir
   * (https://aliiball.github.io/ilan-admin-panel/). Base ayarlanmazsa asset'ler
   * `/` kökünden istenir, hepsi 404 olur ve boş sayfa gelir.
   *
   * Yalnızca STORYBOOK_BASE_PATH tanımlıysa devreye girer; lokal `storybook dev`
   * bu env'i vermez, dolayısıyla etkilenmez. Değer Pages workflow'unda geçilir.
   */
  viteFinal: async (config) => {
    if (process.env.STORYBOOK_BASE_PATH) {
      config.base = process.env.STORYBOOK_BASE_PATH
    }
    /*
      Üretim CSS küçültmesini kapat.

      esbuild küçültücüsü, `backdrop-filter` + `-webkit-backdrop-filter` çiftini
      "yinelenen" görüp **standart `backdrop-filter`'ı düşürüyor, yalnız `-webkit-`
      versiyonunu bırakıyordu**. Firefox `-webkit-backdrop-filter` tanımadığından
      DynamicIsland'ın cam efekti Firefox'ta üretimde kayboluyordu (yerel `storybook
      dev` küçültmediği için orada çalışıyordu — asıl fark buydu). `cssTarget` ayarı
      bunu engellemedi. Küçültmeyi kapatmak vanilla-extract'in ürettiği her iki
      kuralı da aynen korur; üç motorda ve eski Safari'de cam efekti çalışır. Bir
      bileşen kütüphanesi vitrini için CSS boyutu artışı önemsiz.
    */
    config.build = { ...config.build, cssMinify: false }
    return config
  },
} satisfies StorybookConfig

export default config
