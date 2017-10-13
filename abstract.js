
function set_px (x, y) {
  this.px.x = x;
  this.px.y = y;
}

function set_degree (degree) {
  this.degree.lon = degree.lon;
  this.degree.lat = degree.lat;
}

function set_wgs84 (wgs84) {
  this.wgs84.x = wgs84.x;
  this.wgs84.y = wgs84.y;
}

function degree_to_px (degree, current_info) {
  const PX_BY_WGS84 = current_info.PX_BY_WGS84;
  const absolute_focus_wgs84 = current_info.absolute_focus_wgs84;

  const target_wgs84 = latlon2wgs(degree.lon, degree.lat);
  const absolute_target_wgs84 = calc_absolute_wgs(target_wgs84);

  const gap_px_x = (absolute_target_wgs84.x - absolute_focus_wgs84.x) / PX_BY_WGS84;
  const gap_px_y = (absolute_target_wgs84.y - absolute_focus_wgs84.y) / PX_BY_WGS84;

  this.px = {
    x: Math.round(focus_px_by_view.x + gap_px_x),
    y: Math.round(focus_px_by_view.y + gap_px_y)
  };
}




function px_to_wgs84 (x, y, current_info) {
  const PX_BY_WGS84 = current_info.PX_BY_WGS84;
  const absolute_focus_wgs84 = current_info.absolute_focus_wgs84;

  const gap_px_x = (x - current_info.focus_px.x);
  const gap_px_y = (y - current_info.focus_px.y);
  const absolute_target_wgs84 = {
    x: absolute_focus_wgs84.x + (gap_px_x * PX_BY_WGS84),
    y: absolute_focus_wgs84.y + (gap_px_y * PX_BY_WGS84)
  };
  return {
    x: absolute_target_wgs84.x - HALF_WGS84_SIZE,
    y: HALF_WGS84_SIZE - absolute_target_wgs84.y
  };
}

function calc_absolute_wgs (wgs84) {
  return {
    x: HALF_WGS84_SIZE + wgs84.x,
    y: HALF_WGS84_SIZE - wgs84.y
  }
}

function calc_focus_px (DOM) {
  return {
    x: Math.round(DOM.offsetWidth/2),
    y: Math.round(DOM.offsetHeight/2)
  };
}