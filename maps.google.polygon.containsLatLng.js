// Poygon getBounds extension - google-maps-extensions
// http://code.google.com/p/google-maps-extensions/source/browse/google.maps.Polygon.getBounds.js
if (!google.maps.Polygon.prototype.getBounds) {
  google.maps.Polygon.prototype.getBounds = function(latLng) {
    var bounds = new google.maps.LatLngBounds();
    var paths = this.getPaths();
    var path;

    for (var p = 0; p < paths.getLength(); p++) {
      path = paths.getAt(p);
      for (var i = 0; i < path.getLength(); i++) {
        bounds.extend(path.getAt(i));
      }
    }

    return bounds;
  }
}

google.maps.MVCObject.prototype.containsPoint = function(latLng) {
	var lat, lng;

	if(arguments.length == 2 && typeof arguments[0] == 'number' && typeof arguments[1] == 'number') {
		lat = arguments[0];
		lng = arguments[1];
	} else if(arguments.length == 1) {
		var bounds = this.getBounds();

		if(bounds != null && !bounds.contains(latLng)) return false;

		lat = latLng.lat();
		lng = latLng.lng();
	} else {
		console.log("Error - wrong number of arguments");
	}

	var inPoly = false;

	if(this instanceof google.maps.Polygon) {
		// Raycast point in polygon method
		var numPaths = this.getPaths().getLength();
		for(var p = 0; p < numPaths; p++) {
			var path = this.getPaths().getAt(p);
			var numPoints = path.getLength();
			var j = numPoints-1;

			for(var i=0; i < numPoints; i++) {
				var vertex1 = path.getAt(i);
				var vertex2 = path.getAt(j);

				if (vertex1.lng() < lng && vertex2.lng() >= lng || vertex2.lng() < lng && vertex1.lng() >= lng) {
					if (vertex1.lat() + (lng - vertex1.lng()) / (vertex2.lng() - vertex1.lng()) * (vertex2.lat() - vertex1.lat()) < lat) {
					  inPoly = !inPoly;
					}
				}

				j = i;
			}
		}
	}
	else if(this instanceof google.maps.Circle) {
		src = this.getCenter();
		dest = new google.maps.LatLng(lat, lng);
		inPoly = google.maps.geometry.spherical.computeDistanceBetween(src, dest) <= this.radius;
	}

	return inPoly;
}
