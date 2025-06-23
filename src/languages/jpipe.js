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
    built_in: 'assemble',
    title: 'justification pattern load composition'
  };

  return {
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

      // 2) explicit "x supports y" pattern
      {
        begin: IDENT + '\\s+supports\\s+' + IDENT,
        end: /$/,
        keywords: { built_in: 'supports' }
      },

      // 3) relations: "X supports Y", "X is Y", "X refines Y"
      {
        match: new RegExp(`(${IDENT})\\s+(supports|is|refines)\\s+(${IDENT})`),
        scope: {
          1: 'variable',   // X
          2: 'built_in',   // supports/is/refines
          3: 'variable'    // Y
        }
      },

      // 4) standalone built-in keywords (must come before title blocks)
      {
        match: /\b(supports|is|refines|assemble)\b/,
        className: 'built_in'
      },

      // 5) function calls like refine(peer_buddy, recruitment)
      {
        match: /\b(refine)\s*\(/,
        scope: {
          1: 'keyword'
        }
      },

      // 6) justification blocks with title
      {
        className: 'title',
        begin: /\bjustification\b/,
        end: /[{(]/,
        returnEnd: true,
        contains: [
          {
            className: 'variable',
            begin: new RegExp('(?<=\\bjustification\\s+)' + IDENT),
            relevance: 0
          }
        ]
      },

      // 7) pattern blocks
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

      // 8) composition blocks
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

      // 9) load statements
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

      // 10) function parameters (variables inside parentheses)
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
