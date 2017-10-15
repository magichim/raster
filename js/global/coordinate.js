
const BOARD_DOM = {
  focus: {
    DEGREE: document.getElementById('focus-degree'),
    WGS84 : document.getElementById('focus-wgs84')
  },
  marker: {
    DEGREE: document.getElementById('marker-degree'),
    WGS84 : document.getElementById('marker-wgs84')
  }
};

var three_decimal_round = function (number) {
  return Math.round(number * 1000) /1000;
};

var focus_coordinate_setting = function (degree, wgs84) {
  [].slice.call(BOARD_DOM.focus.DEGREE.childNodes).filter(function (value) {
    return value.nodeType === 1;
  }).forEach(function (value, index) {
    index === 1 ? value.textContent = three_decimal_round(degree.lon) : 
      index === 2 ? value.textContent = three_decimal_round(degree.lat) : undefined;
  });
  [].slice.call(BOARD_DOM.focus.WGS84.childNodes).filter(function (value) {
    return value.nodeType === 1;
  }).forEach(function (value, index) {
    index === 1 ? value.textContent = three_decimal_round(wgs84.x) :
      index === 2 ? value.textContent = three_decimal_round(wgs84.y) : undefined;
  });
};

var marker_coordinate_setting = function (degree, wgs84) {
  [].slice.call(BOARD_DOM.marker.DEGREE.childNodes).filter(function (value) {
    return value.nodeType === 1;
  }).forEach(function (value, index) {
    index === 1 ? value.textContent = three_decimal_round(degree.lon) : 
      index === 2 ? value.textContent = three_decimal_round(degree.lat) : undefined;
  });
  [].slice.call(BOARD_DOM.marker.WGS84.childNodes).filter(function (value) {
    return value.nodeType === 1;
  }).forEach(function (value, index) {
    index === 1 ? value.textContent = three_decimal_round(wgs84.x) :
      index === 2 ? value.textContent = three_decimal_round(wgs84.y) : undefined;
  });
};

var focus_coordinate_calculate = function (zoom_translate, move_translate, focus_info) {
  var f_info = focus_info;
  var temp_x = f_info.abs_focus_wgs84.x - f_info.PX_BY_WGS84 * ((zoom_translate.x + move_translate.x) / map_transform.scale);
  var temp_y = f_info.abs_focus_wgs84.y - f_info.PX_BY_WGS84 * ((zoom_translate.y + move_translate.y) / map_transform.scale);

  temp_x < 0 ? temp_x = (WGS84_SIZE + temp_x) : undefined;
  temp_y < 0 ? temp_y = (WGS84_SIZE + temp_y) : undefined;

  temp_x = temp_x % WGS84_SIZE;
  temp_y = temp_y % WGS84_SIZE;

  f_info.wgs84 = {
    x: temp_x - HALF_WGS84_SIZE,
    y: HALF_WGS84_SIZE - temp_y
  };
  f_info.degree = wgs2latlon(f_info.wgs84.x, f_info.wgs84.y);
  f_info.tile_number = get_focus_tile_number(focus_info);
  focus_coordinate_setting(f_info.degree, f_info.wgs84);
};