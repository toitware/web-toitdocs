import .other as other
import system show BITS-PER-BYTE

/**
Toitdoc for main pkg library.
Reference $other.B.
Reference to self $A.
Reference to core-library: $string
Reference to imported core-library: $BITS-PER-BYTE
*/

foo str/string -> string: return str
bar a/A -> A: return a

class A:
