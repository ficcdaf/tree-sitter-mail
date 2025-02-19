/**
 * @file Email parser
 * @author Steven Xu <stevenxxiu@gmail.com>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

const SPECIAL = /[()<>@,;:\\".\[\]]/
const CTL = /[\x00-\x1f\x7f]/

export default grammar({
  name: 'mail',
  extras: (_$) => [' '],

  rules: {
    source_file: ($) => seq($._headers, optional(seq($.body_separator, $.body))),

    _headers: ($) => repeat1(seq($._header, '\n')),

    _header: ($) => choice(prec(1, $.header_email), prec(1, $.header_subject), $.header_other),
    header_email: ($) =>
      seq($.header_field_email, $.header_separator, repeat(choice($.atom, $.quoted_string)), optional($.email)),
    header_other: ($) => seq($.header_field, $.header_separator, $.header_unstructured),
    header_subject: ($) => seq($.header_field_subject, $.header_separator, $.header_unstructured),

    header_separator: (_$) => ':',
    header_field: (_$) => new RegExp(`[^${CTL.source.slice(1, -1)}\\s:]+`),
    header_field_email: (_$) => choice('From', 'To', 'Cc', 'Bcc', 'Reply-To'),
    header_field_subject: (_$) => 'Subject',
    header_unstructured: (_$) => /.*/,

    atom: (_$) => new RegExp(`[^${SPECIAL.source.slice(1, -1)}\\s${CTL.source.slice(1, -1)}]+`),
    quoted_string: (_$) => /"[^"\\\n]+"/,
    email: (_$) => /<[^<>]+>/,

    body_separator: (_$) => /\n/,
    body: ($) => repeat1(choice($.quoted_line, $.body_line)),
    body_line: (_$) => /[^\n]+/,
    quoted_line: (_$) => />.*/,
  },
})
