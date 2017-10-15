var map_canvas_event_initialize = function (map_canvas) {
  var mt = map_transform;
  var mk = marker;
  var f_info = focus_info;

  map_canvas.addEventListener('mouseup', function (event) {
    const TARGET = event.currentTarget;

    TARGET.className = 'mouse-up';
    
    if (TARGET.className === 'mouse-up' && map_move_status) {
      map_move_status = false;
      side_render(mt, mk, f_info);
    }
    else {
      const f_px = {x: focus_info.px.x, y: focus_info.px.y};
      const scale_ratio = mt.render_scale + (mt.scale - mt.render_scale) / mt.render_scale;
      const marker_px_x = f_px.x + (event.clientX - mt.translate.zoom.x - mt.translate.move.x - f_px.x) / scale_ratio;
      const marker_px_y = f_px.y + (event.clientY - mt.translate.zoom.y - mt.translate.move.y - f_px.y) / scale_ratio;
      const marker_wgs84 = px_to_wgs84(marker_px_x, marker_px_y, focus_info);
      const marker_degree = wgs2latlon(marker_wgs84.x, marker_wgs84.y);

      mk.set_px(marker_px_x, marker_px_y);
      mk.set_degree(marker_degree);
      mk.set_wgs84(marker_wgs84);
      mk.translate.zoom = {
        x: event.clientX - marker_px_x,
        y: event.clientY - marker_px_y
      };
      mk.set_translate_initialize(['move']);
      mk.marking(event.clientX, event.clientY);
      marker_coordinate_setting(mk.degree, mk.wgs84);
    }
  });
  
  map_canvas.addEventListener('mousedown', function (event) {
    const TARGET = event.currentTarget;
    TARGET.className = 'mouse-down';
  });

  map_canvas.addEventListener('mousemove', (function (event) {
    // debouncing
    var timer = null;
    var mt = map_transform;
    var mk = marker;
    var f_info = focus_info;

    return function (event) {
      if (mt.status) {
        const TARGET = event.currentTarget;

        if (TARGET.className === 'mouse-down') {
          map_move_status = true;

          timer ? clearTimeout(timer) : undefined;
          timer = setTimeout(function () {
          }, 300);

          mt.translate.move.x += event.movementX;
          mt.translate.move.y += event.movementY;

          var total_translate = mt.total_translate();

          map_context.save();
          map_context.clearRect(0, 0, map_canvas.width, map_canvas.height);
          map_context.translate(total_translate.x, total_translate.y);
          map_context.scale(mt.scale, mt.scale);
          map_context.drawImage(copy_canvas, -f_info.abs_gap_focus_px.x, -f_info.abs_gap_focus_px.y);
          map_context.restore();

          // 좌표계 계산 - Focus 기준
          focus_coordinate_calculate(mt.translate.zoom, mt.translate.move, f_info);

          // marker 계산
          if (mk.DOM.style.display) {
            mk.translate.move.x += event.movementX;
            mk.translate.move.y += event.movementY;

            var marker_total_translate = mk.total_translate();
            mk.marking(marker_total_translate.x, marker_total_translate.y);
          }
        }
      }
    };
  })());

  map_canvas.addEventListener('mousewheel', (function (event) {
    // debouncing
    var timer = null;
    var mt = map_transform;
    var mk = marker;
    var f_info = focus_info;
    return mouse_wheel_event(event, timer, mt, mk, f_info);
  })());

  map_canvas.addEventListener('DOMMouseScroll', (function (event) {
    // debouncing
    var timer = null;
    var mt = map_transform;
    var mk = marker;
    var f_info = focus_info;
    return mouse_wheel_event(event, timer, mt, mk, f_info);
  })());

  map_canvas.addEventListener('dblclick', (function (event) {
  })());

  window.addEventListener('resize', (function () {
    var timer = null;
    var f_info = focus_info;

    return function (event) {
      timer ? clearTimeout(timer) : undefined;
      timer = setTimeout(function () {
        var last_map_width = map_canvas.width;
        var last_map_height = map_canvas.height;

        var half_width_gap = (VIEW_DOM.view.offsetWidth - last_map_width) / 2;
        var half_height_gap = (VIEW_DOM.view.offsetHeight - last_map_height) / 2;

        mt.translate.move.x += half_width_gap;
        mt.translate.move.y += half_height_gap;

        // global variable reset
        map_canvas.width = VIEW_DOM.view.offsetWidth;
        map_canvas.height = VIEW_DOM.view.offsetHeight;
        f_info.set_px(VIEW_DOM.view.offsetWidth/2, VIEW_DOM.view.offsetHeight/2);
        view_tile = {
          half_horizontal: Math.ceil( (VIEW_DOM.view.offsetWidth/2) / TILE_SIZE) + 1,
          half_vertical: Math.ceil( (VIEW_DOM.view.offsetHeight/2) / TILE_SIZE) + 1
        };

        var total_translate = mt.total_translate();

        map_context.save();
        map_context.clearRect(0, 0, map_canvas.width, map_canvas.height);
        map_context.translate(total_translate.x, total_translate.y);
        map_context.scale(mt.scale, mt.scale);
        map_context.drawImage(copy_canvas, -f_info.abs_gap_focus_px.x, -f_info.abs_gap_focus_px.y);
        map_context.restore();
      }, 500);
    };
  })());
};


var mouse_wheel_event = function (event, timer, mt, mk, f_info) {
  return function (event) {
    if (mt.status) { 
      const TARGET = event.currentTarget;
      var minimum_status = false;

      timer ? clearTimeout(timer) : undefined;
      timer = setTimeout(function () {
        var scale = Math.floor(Math.log2(mt.scale));
        var target_scale = scale >= 0 ? scale : scale + 1;
        var remainder = mt.scale - (2**target_scale);

        if (!minimum_status) {
          if (Math.abs(target_scale) >= 1) {
            f_info.ZOOM_LEVEL += target_scale;
            mt.scale = 1 + (remainder / (2**target_scale));
            mt.status_converter(false);
            var tile_count = (2*view_tile.half_horizontal + 1) * (2*view_tile.half_vertical + 1);
            zoom_render(f_info, mt, tile_count);
          }
        }
        else {
          f_info.ZOOM_LEVEL = 3;
          mt.scale = 1;
          f_info.degree = FIRST_DEGREE;
          mt.status_converter(false);
          var tile_count = (2*view_tile.half_horizontal + 1) * (2*view_tile.half_vertical + 1);
          zoom_render(f_info, mt, tile_count);
        }
      }, 300);

      if (cursor.current.x === event.clientX - mt.translate.move.x && cursor.current.y === event.clientY - mt.translate.move.y) {
        var wheel_delta = event.wheelDelta ? event.wheelDelta * 0.0005 : -event.detail * 0.008;
        var last_scale = mt.scale;

        if ( (last_scale + wheel_delta) <= 0.07) {
          minimum_status = true;
          return ;
        }
        
        mt.scale += wheel_delta;
        mt.translate.focus.x -= TARGET.offsetWidth/2 * wheel_delta;
        mt.translate.focus.y -= TARGET.offsetHeight/2 * wheel_delta;

        var variation_zoom_x = (cursor.real.x - f_info.px.x) / mt.render_scale * wheel_delta;
        var variation_zoom_y = (cursor.real.y - f_info.px.y) / mt.render_scale * wheel_delta;

        mt.translate.zoom.x -= variation_zoom_x;
        mt.translate.zoom.y -= variation_zoom_y;

        var total_translate = mt.total_translate();

        map_context.save();
        map_context.clearRect(0, 0, map_canvas.width, map_canvas.height);
        map_context.translate(total_translate.x, total_translate.y);
        map_context.scale(mt.scale, mt.scale);
        map_context.drawImage(copy_canvas, -f_info.abs_gap_focus_px.x, -f_info.abs_gap_focus_px.y);
        map_context.restore();
        
        // 좌표계 계산 - Focus 기준
        focus_coordinate_calculate(mt.translate.zoom, mt.translate.move, f_info);
        
        // marker 계산
        if (mk.DOM.style.display) {
          mk.translate.zoom.x -= (cursor.real.x - mk.px.x) / mt.render_scale * wheel_delta;
          mk.translate.zoom.y -= (cursor.real.y - mk.px.y) / mt.render_scale * wheel_delta;

          var marker_total_translate = mk.total_translate();
          mk.marking(marker_total_translate.x, marker_total_translate.y);
        }
      }
      else {
        const scale_ratio = mt.render_scale + (mt.scale - mt.render_scale) / mt.render_scale;
        cursor.last = {
          x: cursor.current.x ? cursor.current.x : event.clientX - mt.translate.move.x,
          y: cursor.current.y ? cursor.current.y : event.clientY - mt.translate.move.y
        };
        cursor.current = {
          x: event.clientX - mt.translate.move.x,
          y: event.clientY - mt.translate.move.y
        };
        cursor.real = {
          x: cursor.real.x ? cursor.real.x + (cursor.current.x - cursor.last.x) / scale_ratio : cursor.current.x,
          y: cursor.real.y ? cursor.real.y + (cursor.current.y - cursor.last.y) / scale_ratio : cursor.current.y
        };
      }
    }
  }
};