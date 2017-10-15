
var set_px = function (x, y) {
  this.px.x = x;
  this.px.y = y;
};

var set_degree = function (degree) {
  this.degree.lon = degree.lon;
  this.degree.lat = degree.lat;
};

var set_wgs84 = function (wgs84) {
  this.wgs84.x = wgs84.x;
  this.wgs84.y = wgs84.y;
};

var total_translate = function () {
  return {
    x: this.px.x + this.translate.zoom.x + this.translate.move.x,
    y: this.px.y + this.translate.zoom.y + this.translate.move.y
  };
};

var degree_to_px = function (degree, focus_info) {
  const PX_BY_WGS84 = focus_info.PX_BY_WGS84;
  const absolute_focus_wgs84 = focus_info.absolute_focus_wgs84;

  const target_wgs84 = latlon2wgs(degree.lon, degree.lat);
  const absolute_target_wgs84 = calc_absolute_wgs(target_wgs84);

  const gap_px_x = (absolute_target_wgs84.x - focus_info.abs_focus_wgs84.x) / PX_BY_WGS84;
  const gap_px_y = (absolute_target_wgs84.y - focus_info.abs_focus_wgs84.y) / PX_BY_WGS84;

  this.px = {
    x: Math.round(focus_info.px.x + gap_px_x),
    y: Math.round(focus_info.px.y + gap_px_y)
  };
};


var px_to_wgs84 = function (x, y, focus_info) {
  const PX_BY_WGS84 = focus_info.PX_BY_WGS84;
  const absolute_focus_wgs84 = focus_info.abs_focus_wgs84;

  const gap_px_x = (x - focus_info.px.x);
  const gap_px_y = (y - focus_info.px.y);
  const absolute_target_wgs84 = {
    x: absolute_focus_wgs84.x + (gap_px_x * PX_BY_WGS84),
    y: absolute_focus_wgs84.y + (gap_px_y * PX_BY_WGS84)
  };
  return {
    x: absolute_target_wgs84.x - HALF_WGS84_SIZE,
    y: HALF_WGS84_SIZE - absolute_target_wgs84.y
  };
};

var calc_absolute_wgs = function (wgs84) {
  return {
    x: HALF_WGS84_SIZE + wgs84.x,
    y: HALF_WGS84_SIZE - wgs84.y
  };
};

var get_focus_tile_number = function (focus_info) {
  return {
    x: Math.floor(focus_info.abs_focus_wgs84.x / focus_info.TILE_UNIT_BY_WGS84),
    y: Math.floor(focus_info.abs_focus_wgs84.y / focus_info.TILE_UNIT_BY_WGS84)
  };
};

var get_abs_gap_focus_px = function (focus_info) {
  var f_info = focus_info;
  return {
    x: Math.round((f_info.abs_focus_wgs84.x - (f_info.tile_number.x * f_info.TILE_UNIT_BY_WGS84)) / f_info.PX_BY_WGS84),
    y: Math.round((f_info.abs_focus_wgs84.y - (f_info.tile_number.y * f_info.TILE_UNIT_BY_WGS84)) / f_info.PX_BY_WGS84)
  };
};

var set_translate_initialize = function (property) {
  let that = this;
  property.forEach(function (p) {
    that.translate[p] = {x: 0, y: 0};
  });
};

var view_render = function (f_info, mt, tile_count) {
  var zoom_level = f_info.ZOOM_LEVEL;
  var count_obj = {count: 0, total: tile_count};

  for (var y = -view_tile.half_vertical; y <= view_tile.half_vertical; y++) {
    if (2**zoom_level > Math.abs(y)) {
      for (var x = -view_tile.half_horizontal; x <= view_tile.half_horizontal; x++) {
        if (2**zoom_level > Math.abs(x)) {
          var number_x = x + f_info.tile_number.x;
          var number_y = y + f_info.tile_number.y;
          zoom_draw_tile_image(f_info, mt, x, y, number_x, number_y, count_obj);
        }
      }
    }
  }
};