import setting from '@/config/settings'
export const getPageTitle = pageTitle => {
  if (pageTitle) {
    return `${pageTitle} - ${setting.title}`
  }
  return `${setting.title}`
}
