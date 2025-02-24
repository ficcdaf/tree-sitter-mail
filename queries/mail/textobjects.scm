(atom_block
  (atom) @entry.inside) @entry.around

(email_address) @entry.around

(quoted_block)+ @comment.around
; ((quote_marker)+(quote_contents)+)+ @comment.around

(body_block)+ @function.around
