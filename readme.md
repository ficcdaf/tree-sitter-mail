# Tree-sitter Grammar for Mail

## Point Of This Fork

I created this fork mainly to add `.eml` support to Helix. However, the original grammar is a bit lacking so I've also decided to expand it a bit, to support things like unique highlighting for quoted replies in the body text.

Although at the time of forking, the grammar was using ABI 14, tree-sitter's default is 15. So, I decided it would be better for me to maintain an ABI 14 version of the grammar which we can be confident won't be upgraded.

## Improvements Over Original

- Added support for carriage return (`\r\n`) newlines.
  - The previous parser broke if line endings weren't UNIX style.
  - Carriage returns are very common in email files.
  - They're also used by External Editor Revived, which is the primary use case for this parser.
- Added rules for quoted blocks.
  - Quoted blocks are used in reply emails.
  - Users may want to highlight these differently.
  - This also opens the door to text object queries for easily operating on quote blocks.

## Planned Improvements

- Support nested quote blocks.
- Add distinction between email address marker `<>` and the actual address string.
  - Allows the marker to be highlighted differently, helps for cleaner reading of the file.
