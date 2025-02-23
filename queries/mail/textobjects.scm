(atom_block
  (atom) @entry.inside) @entry.around
(email_address) @entry.around
; (header_subject
;   (header_unstructured) @entry.around)
(header_unstructured) @entry.around

; (quote_contents) @comment.inside
(quote_block)+ @comment.around
