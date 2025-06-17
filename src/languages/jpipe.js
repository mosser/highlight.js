/*
Language: JPipe
Author: Darshan Shah <darshanvshah2@gmail.com>
Category: common
Website: https://www.jpipe.org/
*/

/** @type LanguageFn */
export default function(hljs) {
    const IDENT = '[A-Za-z_][A-Za-z0-9_]*';
  
    // top-level keywords and built-ins
    const KEYWORDS = {
      keyword:
        'load composition justification',
      built_in:
        'assemble refine hook supports',
    };
  
    return {
      name: 'JPipe',
      aliases: ['jpipe'],
      keywords: KEYWORDS,
      contains: [
        // comments
        hljs.C_LINE_COMMENT_MODE,
        hljs.C_BLOCK_COMMENT_MODE,
  
        // strings
        hljs.QUOTE_STRING_MODE,
  
        // numbers
        {
          className: 'number',
          variants: [{ begin: '\\b\\d+(\\.\\d+)?\\b' }]
        },
  
        // punctuation
        { className: 'punctuation', begin: /[{}():,]/, relevance: 0 },
  
        // 1) load statements: load "path"
        {
          className: 'keyword',
          begin: /\bload\b/,
          end: /$/,
          contains: [ hljs.QUOTE_STRING_MODE ]
        },
  
        // 2) composition block header
        {
          className: 'title',
          begin: /\bcomposition\b\s*\{/,
          end: /\{/,
          excludeEnd: true
        },
  
        // 3) justification header with assemble/refine
        {
          className: 'title.class',
          begin: new RegExp(
            '\\bjustification\\b\\s+' + IDENT +
            '\\s+is\\s+' + IDENT + '\\s*\\([^)]*\\)\\s*\\{'
          ),
          end: /\{/,
          excludeEnd: true,
          keywords: 'justification'
        },
  
        // 4) inner field-assignments: key: "value"
        {
          begin: '\\b(?:strategy|conclusion|hook)\\b\\s*:',
          end: /$/,
          keywords: 'strategy conclusion hook',
          contains: [ hljs.QUOTE_STRING_MODE ]
        },
  
        // 5) provenance relations: ev1 supports strat2
        {
          begin: IDENT + '\\s+supports\\s+' + IDENT,
          end: /$/,
          keywords: 'supports'
        },
  
        // 6) bare identifiers (evidence IDs, etc.)
        {
          className: 'variable',
          begin: '\\b' + IDENT + '\\b'
        }
      ]
    };
  }
  