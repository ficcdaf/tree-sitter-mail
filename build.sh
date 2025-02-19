#!/bin/sh

tree-sitter generate --abi 14 && tree-sitter build
tree-sitter test

