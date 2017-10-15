var Cursor = function () {
  this.last = {x: null, y: null};
  this.current = {x: null, y: null};
  this.real = {x: null, y: null};
  this.reset = function () {
    this.last = {x: null, y: null};
    this.current = {x: null, y: null};
    this.real = {x: null, y: null};
  };
};