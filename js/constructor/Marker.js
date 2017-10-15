var Marker = function (DOM) {
  this.DOM = DOM;
  this.px = {x: null, y: null};
  this.degree = {lon: null, lat: null},
  this.wgs84 = {x: null, y: null},
  this.translate = {
    zoom: {x: 0, y: 0},
    move: {x: 0, y: 0}
  };
  this.marking = function (x, y) {
    this.DOM.style.display = 'block';
    this.DOM.style.left = x + 'px';
    this.DOM.style.top = y + 'px';
  };
};
Marker.prototype.set_px = set_px;
Marker.prototype.set_degree = set_degree;
Marker.prototype.set_wgs84 = set_wgs84;
Marker.prototype.degree_to_px = degree_to_px;
Marker.prototype.total_translate = total_translate;
Marker.prototype.set_translate_initialize = set_translate_initialize;