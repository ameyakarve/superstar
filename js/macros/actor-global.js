macro sayG {
  rule {$n: lit ! $d: lit ! $m} => {tell($n, $d, $m);}
  rule {$n: lit ! $d: expr ! $m} => {tell($n, $d, $m);}
  rule {$n: lit ! $d: ident ! $m} => {tell($n, $d, $m);}	
}

export sayG;