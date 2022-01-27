export default {
  github: 'https://github.com/numel007/recipes',
  docsRepositoryBase: 'https://github.com/numel007/recipes',
  titleSuffix: ' – Cookbook',
  logo: (
    <>
      <span className="font-extrabold">Cookbook</span>
      <span className="mr-2 ml-2 text-gray-500 font-normal hidden md:inline">
        One stop shop for cooking
      </span>
    </>
  ),
  search: true,
  unstable_flexsearch: true,
  unstable_stork: false,
  unstable_faviconGlyph: '🧂',
  prevLinks: true,
  nextLinks: true,
  floatTOC: true,
  feedbackLink: 'Question? Give us feedback →',
  feedbackLabels: 'feedback',
  footer: false,
  footerEditLink: 'Edit this page on GitHub',
  footerText: <>MIT {new Date().getFullYear()} © Alexandru Turcanu.</>
}
