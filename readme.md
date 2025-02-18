# Tree-sitter Grammar for Mail

## Point Of This Fork

I created this fork mainly to add `.eml` support to Helix. However, the original grammar is a bit lacking so I've also decided to expand it a bit, to support things like unique highlighting for quoted replies in the body text.

Although at the time of forking, the grammar was using ABI 14, tree-sitter's default is 15. So, I decided it would be better for me to maintain an ABI 14 version of the grammar which we can be confident won't be upgraded (and thus exclude Helix support).

## _lazy.nvim_ Install

Add to _tree-sitter_ config:

```lua
{
  'nvim-treesitter/nvim-treesitter',
  -- ...
  dependencies = {
    'stevenxxiu/tree-sitter-mail',
  },
  -- ...
}
```

To parse the body, in e.g. _Markdown_, add to `~/.config/nvim/after/queries/mail/injections.scm`:

```query
((body) @injection.content
 (#set! injection.language "markdown"))
```
