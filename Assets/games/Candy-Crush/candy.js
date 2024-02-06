

var Candy = function(color, id)
{
 Object.defineProperty(this, 'color', {value: color, writable: false});
 Object.defineProperty(this, 'id', {value: id, writable: false});

 // Two mutable properties
 this.row = null;
 this.col = null;

 ////////////////////////////////////////////////
 // Public methods
 //
 this.toString = function()
 {
   var name = this.color;
   return name;
 }
};

Candy.colors = [
  'red',
  'yellow',
  'green',
  'orange',
  'blue',
  'purple'
];
