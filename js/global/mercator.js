// web mercator - WGS84 UTM (also known as WGS 1984, EPSG:4326) projection

var latlon2wgs = function(lon, lat) {
	var x = lon * 20037508.342789244 / 180;
	var y = Math.log(Math.tan((90 + lat) * Math.PI / 360)) / (Math.PI / 180);
	y = y * 20037508.34 / 180;

	return {x: x % 20037508.342789244, y: y};
};

var wgs2latlon = function(x, y) {
	var lon = x * 180 / 20037508.342789244;
	var lat = Math.atan(Math.exp(y * Math.PI / 20037508.342789244)) * 360 / Math.PI - 90;

	return {lon: lon % 180, lat: lat};
};