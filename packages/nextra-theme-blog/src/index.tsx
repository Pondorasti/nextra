import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import { ThemeProvider, useTheme } from 'next-themes'
import { ReactCusdis } from 'react-cusdis'
import Meta from './meta'
import Nav from './nav'
import MDXTheme, { HeadingContext } from './mdx-theme'

import traverse from './utils/traverse'
import getTags from './utils/get-tags'
import sortDate from './utils/sort-date'
import type { PageMapItem, PageOpt } from 'nextra'
import type { NextraBlogTheme } from './types'

// comments
const Cusdis = dynamic(
  // @ts-ignore
  () => import('react-cusdis').then(mod => mod.ReactCusdis),
  { ssr: false }
) as typeof ReactCusdis

interface LayoutProps {
  config: NextraBlogTheme
  postList: JSX.Element | null
  back: string
  navPages: PageMapItem[]
  hasH1: boolean
  contentNodes: React.ReactNode
  comments: boolean
  pageTitle: string
  meta: {
    author: string
    date: string
    tag: string
    type: string
    [key: string]: any
  }
}
const Layout = ({
  config,
  meta,
  navPages,
  postList,
  back,
  pageTitle,
  hasH1,
  contentNodes,
  comments
}: LayoutProps) => {
  const type = meta.type || 'post'
  const ref = React.useRef<HTMLHeadingElement>(null)
  return (
    <>
      <Head>
        <title>
          {pageTitle}
          {config.titleSuffix}
        </title>
        {config.head
          ? config.head({ title: `${pageTitle} ${config.titleSuffix}`, meta })
          : null}
      </Head>
      <article className="container prose prose-sm md:prose dark:prose-dark">
        <HeadingContext.Provider value={ref}>
          {hasH1 ? <h1 ref={ref}></h1> : <h1>{pageTitle}</h1>}
          {type === 'post' ? (
            <Meta {...meta} back={back} config={config} />
          ) : (
            <Nav navPages={navPages} config={config} />
          )}
          <MDXTheme>
            {contentNodes}
            {type === 'post' ? config.postFooter : null}
            {type === 'post' ? comments : null}
          </MDXTheme>
          {postList}
          {config.footer}
        </HeadingContext.Provider>
      </article>
    </>
  )
}

const NextraBlog = (opts: PageOpt, _config: NextraBlogTheme) => {
  const router = useRouter()
  const { theme, resolvedTheme } = useTheme()
  const config: NextraBlogTheme = Object.assign(
    {
      readMore: 'Read More →',
      footer: (
        <small style={{ display: 'block', marginTop: '8rem' }}>
          CC BY-NC 4.0 2020 © Shu Ding.
        </small>
      ),
      titleSuffix: null,
      postFooter: null
    },
    _config
  )

  // gather info for tag/posts pages
  let posts: PageMapItem[]
  let navPages: PageMapItem[] = []
  const type = opts.meta.type || 'post'
  const route = opts.route

  // This only renders once per page
  if (type === 'posts' || type === 'tag' || type === 'page') {
    posts = []
    // let's get all posts
    traverse(opts.pageMap, page => {
      if (
        page.frontMatter &&
        ['page', 'posts'].includes(page.frontMatter.type)
      ) {
        if (page.route === route) {
          navPages.push({ ...page, active: true })
        } else {
          navPages.push(page)
        }
      }
      if (page.children) return
      if (page.name.startsWith('_')) return
      if (
        type === 'posts' &&
        !page.route.startsWith(route === '/' ? route : route + '/')
      )
        return
      if (
        type !== 'page' &&
        (!page.frontMatter ||
          !page.frontMatter.type ||
          page.frontMatter.type === 'post')
      ) {
        posts.push(page)
      }
    })
    posts = posts.sort(sortDate)
    navPages = navPages.sort(sortDate)
  }

  // back button
  let back: React.ReactNode = null
  if (type !== 'post') {
    back = null
  } else {
    const parentPages: PageMapItem[] = []
    traverse(opts.pageMap, page => {
      if (
        route !== page.route &&
        (route + '/').startsWith(page.route === '/' ? '/' : page.route + '/')
      ) {
        parentPages.push(page)
      }
    })
    const parentPage = parentPages
      .reverse()
      .find(page => page.frontMatter && page.frontMatter.type === 'posts')
    if (parentPage) {
      back = parentPage.route
    }
  }

  return (props: any) => {
    const { query } = router
    const tagName = type === 'tag' ? query.tag : null
    const pageTitle = opts.meta.title || opts.titleText || ''

    let comments

    if (config.cusdis) {
      if (!config.cusdis.appId) {
        console.warn('[cusdis]', '`appId` is required')
      } else {
        comments = (
          <Cusdis
            lang={config.cusdis.lang}
            style={{
              marginTop: '4rem'
            }}
            attrs={{
              host: config.cusdis.host || 'https://cusdis.com',
              appId: config.cusdis.appId,
              pageId: router.pathname,
              pageTitle,
              theme:
                theme === 'dark' || resolvedTheme === 'dark' ? 'dark' : 'light'
            }}
          />
        )
      }
    }

    const postList = posts ? (
      <ul>
        {posts.map(post => {
          if (tagName) {
            const tags = getTags(post)
            if (!Array.isArray(tagName) && !tags.includes(tagName)) {
              return null
            }
          } else if (type === 'tag') {
            return null
          }

          const postTitle =
            (post.frontMatter ? post.frontMatter.title : null) || post.name
          const postDate = post.frontMatter ? (
            <time className="post-item-date">
              {new Date(post.frontMatter.date).toDateString()}
            </time>
          ) : null
          const postDescription =
            post.frontMatter && post.frontMatter.description ? (
              <p className="post-item-desc">
                {post.frontMatter.description}
                {config.readMore ? (
                  <Link href={post.route}>
                    <a className="post-item-more">{config.readMore}</a>
                  </Link>
                ) : null}
              </p>
            ) : null

          return (
            <div key={post.route} className="post-item">
              <h3>
                <Link href={post.route}>
                  <a className="post-item-title">{postTitle}</a>
                </Link>
              </h3>
              {postDescription}
              {postDate}
            </div>
          )
        })}
      </ul>
    ) : null
    return (
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem={true}
      >
        <Layout
          config={config}
          postList={postList}
          navPages={navPages}
          back={back}
          pageTitle={pageTitle}
          contentNodes={props.children}
          comments={comments}
          {...opts}
          {...props}
        />
      </ThemeProvider>
    )
  }
}

export default NextraBlog
