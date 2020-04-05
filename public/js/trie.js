class TrieNode {
    constructor(key){
      this.key = key;
      this.parent = null;
      this.children = {};
      this.end = false;
    }
    
    getWord() {
    var output = [];
    var node = this;
    
    while (node !== null) {
      output.unshift(node.key);
      node = node.parent;
    }
    
    return output.join('');
    }
    
  }
  
  
  class Trie {
    constructor(){
      this.root = new TrieNode(null);
    }
    
    insert(product){
      var word = product.name.toUpperCase();
      var node = this.root; 
      for(var i = 0; i < word.length; i++) {
      if (!node.children[word[i]]) {
        node.children[word[i]] = new TrieNode(word[i]);
        node.children[word[i]].parent = node;
      }
      node = node.children[word[i]];
      
      if (i == word.length-1) {
        node.end = true;
        node.id = product._id;
        node.qty = product.qty;
        node.mrp = product.mrp;
        node.purchasePrice = product.purchasePrice;
        node.salesDiscount = product.salesDiscount;
        node.salesPrice = product.salesPrice;
        node.locations = product.locations;
      }
    }
    }
    
    findAllWords(node,arr) {
      if (node.end) {
          arr.unshift(
                  {
                    id: node.id,
                    qty: node.qty, 
                    name: node.getWord(),
                    locations: node.locations, 
                    mrp: node.mrp, 
                    purchasePrice: node.purchasePrice, 
                    salesDiscount: node.salesDiscount,
                    salesPrice: node.salesPrice
                  }
                  );
    }
    for (var child in node.children) {
      this.findAllWords(node.children[child], arr);
    }
    }
    
    find(prefix){
      var node = this.root;
      var output = [];
    for(var i = 0; i < prefix.length; i++) {
      if (node.children[prefix[i]]) {
        node = node.children[prefix[i]];
      } else {
        return output;
      }
    }
    
    this.findAllWords(node, output);
    return output;
    }
  }
