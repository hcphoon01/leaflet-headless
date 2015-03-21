'use strict';

var fs = require('fs');
var L = require('../index.js');
var chai = require('chai').should();

describe('Leaflet-headless', function () {
	var element, map;

	beforeEach(function () {
		element = document.createElement('div');
		element.id = 'map';
		element.style.width = '1024px';
		element.style.height = '1024px';
		document.body.appendChild(element);

		map = L.map('map');
	});
	afterEach(function () {
		map.remove();
	});

	describe('basic functions', function () {
		it('has a size', function () {
			map.setView([52, 4], 10);

			var size = map.getSize();
			size.x.should.equal(1024);
			size.y.should.equal(1024);
		});

		it('map with marker', function () {
			map.setView([52, 4], 10);

			var marker = L.marker([52, 4]).addTo(map);

			map.hasLayer(marker).should.be.true;
		});

		it('is pannable', function () {
			var lat = 52,
			    lng = 4;

			map.setView([lat, lng], 5);

			map.panBy([200, 0]);

			var center = map.getCenter();
			center.lat.should.be.closeTo(lat, 0.1);
			center.lng.should.greaterThan(lng);
		});

		it('map with tilelayer', function () {
			map.setView([52, 4], 10);

			L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
				attribution: '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
					'<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
			}).addTo(map);
		});

		it('has working imagePath', function () {
			var path = L.Icon.Default.imagePath + '/';

			fs.existsSync(path + 'layers.png').should.be.true;
			fs.existsSync(path + 'marker-icon.png').should.be.true;

		});

	});

	describe('Advanced functions', function () {
		describe('examples', function () {
			var leafletImageExample = require('../examples/leaflet-image/index.js');

			it('runs + wrote to file', function (done) {
				leafletImageExample(function (testFilename) {
					fs.existsSync(testFilename).should.be.true;
					done();
				});
			});
			var choroplethExample = require('../examples/choropleth/index.js');

			it('runs + wrote to file', function (done) {
				choroplethExample(function (testFilename) {
					fs.existsSync(testFilename).should.be.true;
					done();
				});
			});
		});
	});
});
