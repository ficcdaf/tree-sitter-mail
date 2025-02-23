/**
 * @file Email parser
 * @author Steven Xu <stevenxxiu@gmail.com>
 * @author Daniel Fichtinger <daniel@ficd.ca>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

const SPECIAL = /[()<>@,;:\\".\[\]]/
const CTL = /[\x00-\x1f\x7f]/
const NEWLINE = /\r?\n/
const EMAIL = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/

export default grammar({
  name: 'mail',
  extras: (_$) => [' '],

  rules: {
    source_file: ($) => seq($._headers, optional(seq($.body_separator, $.body))),

    _headers: ($) => repeat1(seq($._header, NEWLINE)),

    _header: ($) => choice(prec(1, $.header_email), prec(1, $.header_subject), $.header_other),
    header_email: ($) =>
      seq($.header_field_email, $.header_separator, optional($.atom_block), optional($.email)),
    header_other: ($) => seq($.header_field, $.header_separator, $.header_unstructured),
    header_subject: ($) => seq($.header_field_subject, $.header_separator, $.header_unstructured),

    header_separator: (_$) => ':',
    header_field: (_$) => new RegExp(`[^${CTL.source.slice(1, -1)}\\s:]+`),
    header_field_email: (_$) => choice('From', 'To', 'Cc', 'Bcc', 'Reply-To'),
    header_field_subject: (_$) => 'Subject',
    header_unstructured: (_$) => /.*/,

    atom_block: ($) => repeat1(choice($.atom, $.quoted_string)),
    atom: (_$) => new RegExp(`[^${SPECIAL.source.slice(1, -1)}\\s${CTL.source.slice(1, -1)}]+`),
    quoted_string: (_$) => /"[^"\\\n]+"/,
    email_delimiter: (_$) => choice(token('>'), token('<')),
    email_address: (_$) => EMAIL,
    // email_block: (_$) => /<[^<>]+>/,
    email: ($) => seq(
      $.email_delimiter,
      $.email_address,
      $.email_delimiter,
    ),

    body_separator: (_$) => NEWLINE,
    body: ($) => repeat1(choice(
      prec(3, $._empty_line),
      prec(2, $.quote_block),
      prec(1, $.body_block),
    )),

    // quote_block: ($) => prec.left(repeat1($._quoted_line)),
    quote_block: ($) => prec.right(seq($._quoted_line, repeat($._quoted_line))),
    _quoted_line: ($) =>
      seq(
        $.quote_marker,
        $.quote_contents,
        NEWLINE
      ),
    quote_marker: (_$) => token('>'),
    quote_contents: (_$) => token(/[^\r\n]*/),
    body_block: ($) => prec.left(repeat1($._body_line)),
    _body_line: (_$) => seq(/[^\r\n>].*/, NEWLINE),
    _empty_line: (_$) => NEWLINE,

  },
})
