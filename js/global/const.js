
const TILE_SIZE = 256;
const LONGITUDE = 180;
const LATITUDE = 90;
const WGS84_SIZE = 40075016.68557849;
const HALF_WGS84_SIZE = WGS84_SIZE/2;
const TILE_IMAGE_URL = 'tile.openstreetmap.org';

// tile url cname a, b, c load balancing.
const TILE_URL_CNAME = ['a', 'b', 'c'];

// width: -20037508.342789244 ~ 20037508.342789244, height: -20037508.342789244 ~ 20037508.342789244

// CUK :)
const FIRST_DEGREE = {
  lon: 126.80192470550537,
  lat: 37.48568790076625
};

const FIRST_ZOOM_LEVEL = 6;
