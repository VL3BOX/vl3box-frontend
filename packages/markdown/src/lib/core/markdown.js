/**
 * @Author: HuaChao Chen <CHC>
 * @Date:   2017-05-03T00:31:20+08:00
 * @Email:  chenhuachaoxyz@gmail.com
 * @Filename: markdown.js
 * @Last modified by:   chc
 * @Last modified time: 2017-11-26T16:40:54+08:00
 * @License: MIT
 * @Copyright: 2017
 */

import MarkdownIt from 'markdown-it';
import emoji from 'markdown-it-emoji';
import sub from 'markdown-it-sub';
import sup from 'markdown-it-sup';
import deflist from 'markdown-it-deflist';
import abbr from 'markdown-it-abbr';
import footnote from 'markdown-it-footnote';
import insert from 'markdown-it-ins';
import mark from 'markdown-it-mark';
import taskLists from 'markdown-it-task-lists';
import container from 'markdown-it-container';

import hljsLangs from "../core/hljs/lang.hljs.js"; // Assuming hljsLangs is an imported module

import katex from 'markdown-it-katex-external';
import miip from 'markdown-it-images-preview';

const markdown_config = {
    html: true,        // Enable HTML tags in source
    xhtmlOut: true,    // Use '/' to close single tags (<br />).
    breaks: true,      // Convert '\n' in paragraphs into <br>
    langPrefix: 'language-',  // CSS language prefix for fenced blocks
    linkify: false,    // Auto-link URLs
    typographer: true,
    quotes: '“”‘’',
    highlight: function (str, lang) {
        if (lang && hljsLangs[lang]) {
            return '<pre><div class="hljs"><code class="' + lang + '">' + MarkdownIt.utils.escapeHtml(str) + '</code></div></pre>';
        }
        return '<pre><code class="' + lang + '">' + MarkdownIt.utils.escapeHtml(str) + '</code></pre>';
    }
};
// Initialize MarkdownIt with the configuration
const markdown = new MarkdownIt(markdown_config);

// Use plugins
markdown
    .use(emoji)
    .use(sub)
    .use(sup)
    .use(deflist)
    .use(abbr)
    .use(footnote)
    .use(insert)
    .use(mark)
    .use(taskLists)
    .use(container);

// add target="_blank" to all link
var defaultRender = markdown.renderer.rules.link_open || function(tokens, idx, options, env, self) {
    return self.renderToken(tokens, idx, options);
};
markdown.renderer.rules.link_open = function (tokens, idx, options, env, self) {
    // If you are sure other plugins can't add `target` - drop check below
    var aIndex = tokens[idx].attrIndex('target');

    if (aIndex < 0) {
        tokens[idx].attrPush(['target', '_blank']); // add new attribute
    } else {
        tokens[idx].attrs[aIndex][1] = '_blank';    // replace value of existing attr
    }

    // pass token to default renderer.
    return defaultRender(tokens, idx, options, env, self);
};
// math katex

markdown.use(emoji)
    .use(taskLists)
    .use(sup)
    .use(sub)
    .use(container)
    .use(container, 'hljs-left') /* align left */
    .use(container, 'hljs-center')/* align center */
    .use(container, 'hljs-right')/* align right */
    .use(deflist)
    .use(abbr)
    .use(footnote)
    .use(insert)
    .use(mark)
    .use(container)
    .use(miip)
    .use(katex)
export default markdown
