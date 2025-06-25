/*
Language: JPipe
Author: Darshan Shah <darshanvshah2@gmail.com>
Category: common
Website: https://www.jpipe.org/
*/

/** @type {import('highlight.js').LanguageFn} */
export default function(hljs) {
  // identifier regex
  const IDENT = '[A-Za-z_][A-Za-z0-9_]*';

  const KEYWORDS = {
    keyword: 'evidence sub conclusion strategy relation hook refine',
    built_in: 'assemble is',
    title: 'justification pattern load composition'
  };

  return {
    disableAutodetect: true,

    name: 'JPipe',
    aliases: ['jpipe'],
    keywords: KEYWORDS,
    contains: [
      // comments & strings
      hljs.C_LINE_COMMENT_MODE,
      hljs.C_BLOCK_COMMENT_MODE,
      hljs.QUOTE_STRING_MODE,

      // 1) compound keywords like "sub-conclusion" (must come first)
      {
        match: /\bsub-conclusion\b/,
        className: 'keyword'
      },

      // 2) refine function calls with parameters
      {
        match: /\brefine(?=\s*\()/,
        className: 'keyword'
      },

      // 3) explicit "x supports y" pattern
      {
        begin: IDENT + '\\s+supports\\s+' + IDENT,
        end: /$/,
        keywords: { built_in: 'supports' }
      },

      // 4) relations: "X supports Y", "X is Y"
      {
        match: new RegExp(`(${IDENT})\\s+(supports|is)\\s+(${IDENT})`),
        scope: {
          1: 'variable',   // X
          2: 'built_in',   // supports/is
          3: 'variable'    // Y
        }
      },

      // 5) justification blocks with title
      {
        begin: /\bjustification\s+([A-Za-z_][A-Za-z0-9_]*)/,
        returnBegin: true,
        end: /(?=\s(is|\{|\())|$/,
        contains: [
          { className: 'title', begin: /\bjustification\b/ },
          { className: 'variable', begin: new RegExp('(?<=\\bjustification\\s+)' + IDENT) }
        ]
      },

      // 6) pattern blocks
      {
        className: 'title',
        begin: /\bpattern\b/,
        end: /[{(]/,
        returnEnd: true,
        contains: [
          {
            className: 'variable',
            begin: new RegExp('(?<=\\bpattern\\s+)' + IDENT),
            relevance: 0
          }
        ]
      },

      // 7) composition blocks
      {
        className: 'title',
        begin: /\bcomposition\b/,
        end: /[{(]/,
        returnEnd: true,
        contains: [
          {
            className: 'variable',
            begin: new RegExp('(?<=\\bcomposition\\s+)' + IDENT),
            relevance: 0
          }
        ]
      },

      // 8) load statements
      {
        className: 'title',
        begin: /\bload\b/,
        end: /[{(]/,
        returnEnd: true,
        contains: [
          {
            className: 'string',
            begin: /"/,
            end: /"/
          }
        ]
      },

      // 9) standalone keywords (must come after specific patterns)
      {
        match: /\b(refine|evidence|conclusion|sub-conclusion|strategy|hook|relation)\b/,
        className: 'keyword'
      },

      // 10) standalone built-in keywords
      {
        match: /\b(supports|is|assemble)\b/,
        className: 'built_in'
      },

      // 11) function parameters (variables inside parentheses)
      {
        begin: /\(/,
        end: /\)/,
        contains: [
          {
            match: /\b[A-Za-z_][A-Za-z0-9_]*\b/,
            className: 'variable'
          },
          { className: 'punctuation', begin: /[,]/ }
        ]
      },

      // 11) numbers & punctuation
      { className: 'number',   begin: '\\b\\d+(?:\\.\\d+)?\\b' },
      { className: 'punctuation', begin: /[{}():,]/ }
    ]
  };
}
