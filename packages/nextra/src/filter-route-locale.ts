import type { PageMapItem } from './types'

export default function filterRouteLocale(
  pageMap: PageMapItem[],
  locale: string,
  defaultLocale: string
): PageMapItem[] {
  const isDefaultLocale = !locale || locale === defaultLocale

  const filteredPageMap = []

  // We fallback to the default locale
  const fallbackPages: Record<string, PageMapItem | null> = {}

  for (const page of pageMap) {
    if (page.children) {
      filteredPageMap.push({
        ...page,
        children: filterRouteLocale(page.children, locale, defaultLocale)
      })
      continue
    }

    const localDoesMatch =
      (!page.locale && isDefaultLocale) ||
      page.locale === locale ||
      page.name === 'meta.json'

    if (localDoesMatch) {
      fallbackPages[page.name] = null
      filteredPageMap.push(page)
    } else {
      if (
        fallbackPages[page.name] !== null &&
        (!page.locale || page.locale === defaultLocale)
      ) {
        fallbackPages[page.name] = page
      }
    }
  }

  for (const name in fallbackPages) {
    if (fallbackPages[name]) {
      filteredPageMap.push(fallbackPages[name] as PageMapItem)
    }
  }

  return filteredPageMap
}
