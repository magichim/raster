
var zoom_render = function (f_info, mt, tile_count) {
  zoom_set_base_value(f_info, mt);
  copy_context.clearRect(0, 0, copy_canvas.width, copy_canvas.height);
  view_render(f_info, mt, tile_count);
};




var zoom_draw_tile_image = function (f_info, mt, count_x, count_y, num_x, num_y, count_obj) {
  var zoom_level = f_info.ZOOM_LEVEL;
  var mod_num_x = num_x >= 0 ? num_x % (2 ** zoom_level) : (num_x % (2 ** zoom_level)) + (2 ** zoom_level);
  var mod_num_y = num_y >= 0 ? num_y % (2 ** zoom_level) : (num_y % (2 ** zoom_level)) + (2 ** zoom_level);

  const temp_image_tag = document.createElement('img');
  const relative_gap_px = {
    x: -f_info.abs_gap_focus_px.x + f_info.px.x + (count_x * TILE_SIZE),
    y: -f_info.abs_gap_focus_px.y + f_info.px.y + (count_y * TILE_SIZE)
  };
  const temp_relative_gap_px = {
    x: f_info.px.x + (count_x * TILE_SIZE),
    y: f_info.px.y + (count_y * TILE_SIZE)
  };

  var total_translate_x = mt.translate.focus.x + mt.translate.move.x;
  var total_translate_y = mt.translate.focus.y + mt.translate.move.y;
  const cname = TILE_URL_CNAME[Math.floor(Math.random()*10%3)];
  const tile_image_url = `https://${cname}.${TILE_IMAGE_URL}/${zoom_level}/${mod_num_x}/${mod_num_y}.png`;
  
  temp_image_tag.crossOrigin = 'anonymous';
  temp_image_tag.src = tile_image_url;
  temp_image_tag.onload = function () {
    count_obj.count++;
    map_context.save();
    map_context.translate(total_translate_x, total_translate_y);
    map_context.scale(mt.scale, mt.scale);
    map_context.drawImage(temp_image_tag, relative_gap_px.x, relative_gap_px.y, TILE_SIZE, TILE_SIZE);
    copy_context.drawImage(temp_image_tag, temp_relative_gap_px.x, temp_relative_gap_px.y, TILE_SIZE, TILE_SIZE);
    map_context.restore();

    if (count_obj.count >= (count_obj.total-5)) {
      mt.status_converter(true);
    }
  }
};




var zoom_set_base_value = function (f_info, mt) {
  f_info.TILE_UNIT_BY_WGS84 = WGS84_SIZE / (2 ** f_info.ZOOM_LEVEL);
  f_info.PX_BY_WGS84 = f_info.TILE_UNIT_BY_WGS84 / TILE_SIZE;
  f_info.wgs84 = latlon2wgs(f_info.degree.lon, f_info.degree.lat);

  f_info.abs_focus_wgs84 = calc_absolute_wgs(f_info.wgs84);
  f_info.tile_number = get_focus_tile_number(f_info);  
  f_info.abs_gap_focus_px = get_abs_gap_focus_px(f_info);
  
  mt.translate.focus = {
    x: (VIEW_DOM.view.offsetWidth / 2) * (1 - mt.scale),
    y: (VIEW_DOM.view.offsetHeight / 2) * (1 - mt.scale)
  };
  mt.set_translate_initialize(['zoom', 'move']);
  mt.render_scale = mt.scale;
  
  cursor.reset();

  // marker 계산
  const marker_px_x = marker.px.x + marker.translate.zoom.x + marker.translate.move.x;
  const marker_px_y = marker.px.y + marker.translate.zoom.y + marker.translate.move.y;
  marker.set_px(marker_px_x, marker_px_y);
  marker.set_translate_initialize(['zoom', 'move']);
};