
var Transform = function () {
  this.status = false;
  this.scale = 1;
  this.render_scale = 1;
  this.translate = {
    focus: {x: 0, y: 0},
    zoom: {x: 0, y: 0},
    move: {x: 0, y: 0}
  };
  this.status_converter = function (status) {
    this.status = status;
  };
  this.total_translate = function () {
    return {
      x: this.translate.focus.x + this.translate.zoom.x + this.translate.move.x,
      y: this.translate.focus.y + this.translate.zoom.y + this.translate.move.y
    };
  };
};

Transform.prototype.set_translate_initialize = set_translate_initialize;

