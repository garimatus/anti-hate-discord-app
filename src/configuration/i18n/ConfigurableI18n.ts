import { I18n } from 'i18n'

export class ConfigurableI18n extends I18n {
  private static instance: ConfigurableI18n
  private static url: URL = new URL('../../locales', import.meta.url)
  constructor() {
    super({
      locales: ['en', 'es'],
      directory: ConfigurableI18n.url.pathname,
      defaultLocale: 'en',
      autoReload: false,
      updateFiles: false,
      syncFiles: false,
    })
  }

  public static getInstance(): ConfigurableI18n {
    if (!ConfigurableI18n.instance) {
      ConfigurableI18n.instance = new ConfigurableI18n()
    }
    return ConfigurableI18n.instance
  }

  public static setConfig(config: Record<string, any>): void {
    ConfigurableI18n.getInstance().configure({ ...config })
  }

  public static setLocale(locale: string): void {
    if (ConfigurableI18n.instance.getLocales().includes(locale)) {
      ConfigurableI18n.setLocale(locale)
    } else {
      console.warn(
        `Locale ${locale} is not supported. Falling back to default locale.`
      )
      ConfigurableI18n.setLocale(ConfigurableI18n.instance.getLocale())
    }
  }
}

export default ConfigurableI18n.getInstance()
