/**
 * @flow
 */

import MarkdownIt from 'markdown-it'

const md = new MarkdownIt()

export function renderMarkdown(markdown: string, env: ?Object): string {
  return md.render(markdown, env)
}
