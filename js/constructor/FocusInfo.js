var Focus_Info = function (degree, zoom_level) {
  this.degree = degree;
  this.wgs84 = latlon2wgs(degree.lon, degree.lat);
  this.ZOOM_LEVEL = zoom_level;
  this.TILE_UNIT_BY_WGS84 = WGS84_SIZE / (2**zoom_level);
  this.PX_BY_WGS84 = this.TILE_UNIT_BY_WGS84 / TILE_SIZE;
  this.abs_focus_wgs84 = calc_absolute_wgs(this.wgs84);
  this.px = {x: null, y: null};
  this.tile_number = get_focus_tile_number(this);
  this.abs_gap_focus_px = get_abs_gap_focus_px(this);
};

Focus_Info.prototype.set_px = set_px;