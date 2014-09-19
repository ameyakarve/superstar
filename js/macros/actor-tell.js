macro say {
  rule {$d: lit ! $m} => {this.tell(this.name, $d, $m);}
  rule {$d: expr ! $m} => {this.tell(this.name, $d, $m);}
  rule {$d: ident ! $m} => {this.tell(this.name, $d, $m);}
}

export say;