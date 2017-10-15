var side_render = function (mt, mk, f_info) {
  var moving_x_axis = Math.floor( (mt.translate.zoom.x + mt.translate.move.x) / (mt.scale * TILE_SIZE*(3/4)) );
  var moving_y_axis = Math.floor( (mt.translate.zoom.y + mt.translate.move.y) / (mt.scale * TILE_SIZE*(3/4)) );
  
  moving_x_axis < 0 ? moving_x_axis++ : undefined;
  moving_y_axis < 0 ? moving_y_axis++ : undefined;

  if (Math.abs(moving_x_axis) > 0) {
    if (moving_x_axis > 0) {
      var before_abs_gap_px = f_info.abs_gap_focus_px;
      move_set_base_value(mt, mk, f_info);
      modify_copy_canvas(copy_canvas, copy_context, mt.translate.move, before_abs_gap_px, f_info.abs_gap_focus_px);
      mt.translate.move = {x: 0, y: 0};

      for (var y = -view_tile.half_vertical; y <= view_tile.half_vertical; y++) {
        for (var x = 0; x > -3; x--) {
          move_draw_tile_image(f_info, x, y, (x + f_info.tile_number.x), (y + f_info.tile_number.y));
        }
      }
    }
    else {
      var before_abs_gap_px = f_info.abs_gap_focus_px;
      move_set_base_value(mt, mk, f_info);
      modify_copy_canvas(copy_canvas, copy_context, mt.translate.move, before_abs_gap_px, f_info.abs_gap_focus_px);
      mt.translate.move = {x: 0, y: 0};

      for (var y = -view_tile.half_vertical; y <= view_tile.half_vertical; y++) {
        for (var x = 0; x < 3; x++) {
          move_draw_tile_image(f_info, x, y, (x + f_info.tile_number.x), (y + f_info.tile_number.y));
        }
      }
    }
  }
  
  if (Math.abs(moving_y_axis) > 0) {
    if (moving_y_axis > 0) {
      var before_abs_gap_px = f_info.abs_gap_focus_px;
      move_set_base_value(mt, mk, f_info);
      modify_copy_canvas(copy_canvas, copy_context, mt.translate.move, before_abs_gap_px, f_info.abs_gap_focus_px);
      mt.translate.move = {x: 0, y: 0};

      for (var y = 0; y > -2; y--) {
        for (var x = -view_tile.half_horizontal; x <= view_tile.half_horizontal; x++) {
          move_draw_tile_image(f_info, x, y, (x + f_info.tile_number.x), (y + f_info.tile_number.y));
        }
      }
    }
    else {
      var before_abs_gap_px = f_info.abs_gap_focus_px;
      move_set_base_value(mt, mk, f_info);
      modify_copy_canvas(copy_canvas, copy_context, mt.translate.move, before_abs_gap_px, f_info.abs_gap_focus_px);
      mt.translate.move = {x: 0, y: 0};

      for (var y = 0; y < 2; y++) {
        for (var x = -view_tile.half_horizontal; x <= view_tile.half_horizontal; x++) {
          move_draw_tile_image(f_info, x, y, (x + f_info.tile_number.x), (y + f_info.tile_number.y));
        }
      }
    }
  }
};


var move_draw_tile_image = function (focus_info, count_x, count_y, num_x, num_y) {
  var zoom_level = focus_info.ZOOM_LEVEL;
  var mod_num_x = num_x >= 0 ? num_x % (2 ** zoom_level) : (num_x % (2 ** zoom_level)) + (2 ** zoom_level);
  var mod_num_y = num_y >= 0 ? num_y % (2 ** zoom_level) : (num_y % (2 ** zoom_level)) + (2 ** zoom_level);

  const temp_image_tag = document.createElement('img');
  const relative_gap_px = {
    x: -focus_info.abs_gap_focus_px.x + focus_info.px.x + (count_x * TILE_SIZE),
    y: -focus_info.abs_gap_focus_px.y + focus_info.px.y + (count_y * TILE_SIZE)
  };
  const temp_relative_gap_px = {
    x: focus_info.px.x + (count_x * TILE_SIZE),
    y: focus_info.px.y + (count_y * TILE_SIZE)
  };

  var mt = map_transform;
  var total_translate_x = mt.translate.focus.x;
  var total_translate_y = mt.translate.focus.y;

  const cname = TILE_URL_CNAME[Math.floor(Math.random()*10%3)];
  const tile_image_url = `https://${cname}.${TILE_IMAGE_URL}/${zoom_level}/${mod_num_x}/${mod_num_y}.png`;
  temp_image_tag.crossOrigin = 'anonymous';
  temp_image_tag.src = tile_image_url;
  temp_image_tag.onload = function () {
    map_context.save();
    map_context.translate(total_translate_x, total_translate_y);
    map_context.scale(mt.scale, mt.scale);
    map_context.drawImage(temp_image_tag, relative_gap_px.x, relative_gap_px.y, TILE_SIZE, TILE_SIZE);
    copy_context.drawImage(temp_image_tag, temp_relative_gap_px.x, temp_relative_gap_px.y, TILE_SIZE, TILE_SIZE);
    map_context.restore();
  }
};

var modify_copy_canvas = function (target_canvas, target_context, move_translate, before, after) {
  var temp_canvas = document.createElement('canvas');
  temp_context = temp_canvas.getContext('2d');
  temp_canvas.width = target_canvas.width;
  temp_canvas.height = target_canvas.height;
  temp_context.drawImage(target_canvas, 0, 0);
  target_context.clearRect(0, 0, target_canvas.width, target_canvas.height);
  target_context.drawImage(temp_canvas, move_translate.x - before.x + after.x, move_translate.y - before.y + after.y);
};

var move_set_base_value = function (mt, mk, f_info) {
  f_info.abs_focus_wgs84 = calc_absolute_wgs(f_info.wgs84);
  f_info.tile_number = get_focus_tile_number(f_info);
  f_info.abs_gap_focus_px = get_abs_gap_focus_px(f_info);

  marker_total_translate = mk.total_translate();
  mk.set_px(marker_total_translate.x, marker_total_translate.y);
  mk.set_translate_initialize(['move']);
};