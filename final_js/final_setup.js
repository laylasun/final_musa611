/*
	1. Seperate base maps need to be set up in order to let both maps open up at the same time
*/
var sea_map_center=[47.636161, -122.337476],
		phl_map_center=[39.952408, -75.160393],
		amazongo_coor=[47.616404, -122.339864],
		zoomlevel=12;

function onClick(e) {
    seamap.setView(amazongo_coor,16);
}
var	amazongo0 = L.marker([47.616404, -122.339864])
		.bindPopup('<b>Amazon Go</b><br>2131 7th Ave<br>Seattle, WA 98121')
		.on('click', onClick),
		layer1=L.layerGroup([amazongo0]);

var CartoDB_DarkMatter = L.tileLayer('http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png', {
	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
	subdomains: 'abcd',
	maxZoom: 19
}),
CartoDB_DarkMatter1 = L.tileLayer('http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png', {
	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
	subdomains: 'abcd',
	maxZoom: 19
}),

OpenStreetMap_Mapnik = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}),

OpenStreetMap_Mapnik1 = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
});

var seamap = L.map('sea_map', {
  center: sea_map_center,
  zoom: 12,
  layers: [CartoDB_DarkMatter,OpenStreetMap_Mapnik]
});

var baseMaps = {
    "<span style='color: black'>Dark Gray</span>": CartoDB_DarkMatter,
    "<span style='color: orange'>Streets</span>": OpenStreetMap_Mapnik
};
var overlayMaps = {
    "Amazon Go": layer1
};
L.control.layers(baseMaps, overlayMaps).addTo(seamap);

var	phlmap = L.map('phl_map', {
	  center: phl_map_center,
	  zoom: 13,
	  layers: [CartoDB_DarkMatter1,OpenStreetMap_Mapnik1]
	});
	var baseMaps1 = {
	    "<span style='color: black'>Dark Gray</span>": CartoDB_DarkMatter1,
	    "<span style='color: orange'>Streets</span>": OpenStreetMap_Mapnik1
	};
L.control.layers(baseMaps1).addTo(phlmap);

// Define SQLsss
var cartoUserName = 'laylasun';
var format = "GeoJSON";
var sea_sql1 = "SELECT * FROM sea1695blks_withalldata";
var phl_sql1="SELECT * FROM phl1339blks_withalldata";
var	sea_allblocks, phl_allblocks, sea_intersect1, sea_intersect2, phl_intersect1, phl_intersect2;
var activeControl=[], activeControlP=[];

var sea_sql2 = "SELECT cartodb_id, the_geom, the_geom_webmercator, cl3,cl6,cl29,cl39 FROM sea1695blks_withalldata WHERE cl3=2 AND cl6=2 AND cl29=11",
		sea_sql3 = "SELECT cartodb_id, the_geom, the_geom_webmercator, cl3,cl6,cl29,cl39 FROM sea1695blks_withalldata WHERE cl3=2 AND cl6=2 AND (cl39=9 OR cl39=11)",
		phl_sql2 = "SELECT cartodb_id, the_geom, the_geom_webmercator, cl3,cl6,cl29,cl39 FROM phl1339blks_withalldata WHERE cl3=2 AND cl6=2 AND cl29=11",
		phl_sql3 = "SELECT cartodb_id, the_geom, the_geom_webmercator, cl3,cl6,cl29,cl39 FROM phl1339blks_withalldata WHERE cl3=2 AND cl6=2 AND (cl39=9 OR cl39=11)";

// setup array and placeholders for leaflet ids to avoid mismatch..
var intersected = [],
		sealeafletid1, sealeafletid2, phlleafletid1, phlleafletid2;
		// intersectedLayerGroup = L.layerGroup(intersected);
//Style setupts
var defaultsty= {weight: 0.5, color: "white", fillColor: "darkblue", fillOpacity: 0.8},
		defaultsty_inters1 = {weight: 0.5, color: "white", fillColor: "purple", fillOpacity: 0.8},
		defaultsty_inters2 = {weight: 0.5, color: "white", fillColor: "#ff009a", fillOpacity: 0.8};

function color_k36(n){
	return n === 1	? "#7a0177" :
				 n === 2	?	"#41b6c4" :
				 n === 3	? "#f768a1" :
				 n === 4	? "#fa9fb5" :
				 n === 5	? "#fcc5c0" :
				 n === 6	?	"#feebe2" :
				 						"white"  ;
}

var cluster3 = function(feature){
	return{
		fillColor: color_k36(feature.properties.cl3),
		weight: 0.5,
		opacity: 0.7,
		color:"white",
		fillOpacity: 0.9
	};
};

var cluster6 = function(feature){
	return{
		fillColor: color_k36(feature.properties.cl6),
		weight: 0.5,
		opacity: 0.7,
		color:"white",
		fillOpacity: 0.9
	};
};

var sea_legend1 = L.control({position: 'bottomright'});
sea_legend1.onAdd = function (seamap) {

    var div = L.DomUtil.create('div', 'legend'),
        clusters3 = [1, 2, 3],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
		div.innerHTML = '<span style="font-size:12px; font-weight:bold">Cluster ID<br>(K=3)</span>'+'<br>';
		for (var i = 0; i < clusters3.length; i++) {
			if(clusters3[i]===2){
				div.innerHTML +=
						'<i style="background:' + color_k36(clusters3[i]) + '"></i> ' +
						'<span style="font-weight: bold">'+clusters3[i] +' (T)</span>' +'<br>';
			}else{
				div.innerHTML +=
						'<i style="background:' + color_k36(clusters3[i]) + '"></i> ' +
						clusters3[i] + '<br>';
			}
    }
    return div;
};

var sea_legend2 = L.control({position: 'bottomright'});
sea_legend2.onAdd = function (seamap) {

    var div = L.DomUtil.create('div', 'legend'),
        clusters6 = [1,2,3,4,5,6],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
		div.innerHTML = '<span style="font-size:12px; font-weight:bold">Cluster ID<br>(K=6)</span>'+'<br>';
		for (var i = 0; i < clusters6.length; i++) {
			if(clusters6[i]===2){
				div.innerHTML +=
						'<i style="background:' + color_k36(clusters6[i]) + '"></i> ' +
						'<span style="font-weight: bold">'+clusters6[i] +' (T)</span>' +'<br>';
			}else{
				div.innerHTML +=
						'<i style="background:' + color_k36(clusters6[i]) + '"></i> ' +
						clusters6[i] + '<br>';
			}
  }
    return div;
};

function color_k29(n){
	return n === 1	? "#7a0177" :
				 n === 11	?	"#41b6c4" :
				 n === 16	? "#f768a1" :
				 						"#d3f2a3" ;
}
var cluster29 = function(feature){
	return{
		fillColor: color_k29(feature.properties.cl29),
		weight: 0.5,
		opacity: 0.7,
		color:"white",
		fillOpacity: 0.9
	};
};

var sea_legend3 = L.control({position: 'bottomright'});
sea_legend3.onAdd = function (seamap) {

    var div = L.DomUtil.create('div', 'legend'),
        clusters29 = [1, 11, 16],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
		div.innerHTML = '<span style="font-size:12px; font-weight:bold">Cluster ID<br>(K=29)</span>'+'<br>';
		for (var i = 0; i <= clusters29.length; i++) {
			if(i==clusters29.length){
				div.innerHTML+=
				'<i style="background:' + "#d3f2a3" + '"></i> ' + 'others';
			}else if(clusters29[i]===11){
				div.innerHTML +=
						'<i style="background:' + color_k29(clusters29[i]) + '"></i> ' +
						'<span style="font-weight: bold">'+clusters29[i] +' (T)</span>' +'<br>';
			}else{
				div.innerHTML +=
						'<i style="background:' + color_k29(clusters29[i]) + '"></i> ' +
						clusters29[i] + '<br>';
			}
    }
    return div;
};

function color_k39(n){
	return n === 9	? "#7a0177" :
				 n === 12	?	"#41b6c4" :
				 n === 11	? "#f768a1" :
				 						"#d3f2a3" ;
}
var cluster39 = function(feature){
	return{
		fillColor: color_k39(feature.properties.cl39),
		weight: 0.5,
		opacity: 0.7,
		color:"white",
		fillOpacity: 0.9
	};
};

var sea_legend4 = L.control({position: 'bottomright'});
sea_legend4.onAdd = function (seamap) {

    var div = L.DomUtil.create('div', 'legend'),
        clusters39 = [9, 11, 12],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
		div.innerHTML = '<span style="font-size:12px; font-weight:bold">Cluster ID<br>(K=39)</span>'+'<br>';
		for (var i = 0; i <= clusters39.length; i++) {
			if(i==clusters39.length){
				div.innerHTML+=
				'<i style="background:' + "#d3f2a3" + '"></i> ' + 'others';
			}else if(clusters39[i]===12){
				div.innerHTML +=
						'<i style="background:' + color_k39(clusters39[i]) + '"></i> ' +
						'<span style="font-weight: bold">'+clusters39[i] +' (T)</span>' +'<br>';
			}else{
				div.innerHTML +=
						'<i style="background:' + color_k39(clusters39[i]) + '"></i> ' +
						clusters39[i] + '<br>';
			}
    }
    return div;
};

// All Philly's legends have to be made separately....
var phl_legend1 = L.control({position: 'bottomright'}),
 		phl_legend2 = L.control({position: 'bottomright'}),
		phl_legend3 = L.control({position: 'bottomright'}),
		phl_legend4= L.control({position: 'bottomright'});

phl_legend1.onAdd = function (phlmap) {

    var div = L.DomUtil.create('div', 'legend'),
        clusters3 = [1, 2, 3],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
		div.innerHTML = '<span style="font-size:12px; font-weight:bold">Cluster ID<br>(K=3)</span>'+'<br>';
		for (var i = 0; i < clusters3.length; i++) {
			if(clusters3[i]===2){
				div.innerHTML +=
						'<i style="background:' + color_k36(clusters3[i]) + '"></i> ' +
						'<span style="font-weight: bold">'+clusters3[i] +' (T)</span>' +'<br>';
			}else{
				div.innerHTML +=
						'<i style="background:' + color_k36(clusters3[i]) + '"></i> ' +
						clusters3[i] + '<br>';
			}
    }
    return div;
};
phl_legend2.onAdd = function (phlmap) {

    var div = L.DomUtil.create('div', 'legend'),
        clusters6 = [1,2,3,4,5,6],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
		div.innerHTML = '<span style="font-size:12px; font-weight:bold">Cluster ID<br>(K=6)</span>'+'<br>';
		for (var i = 0; i < clusters6.length; i++) {
			if(clusters6[i]===2){
				div.innerHTML +=
						'<i style="background:' + color_k36(clusters6[i]) + '"></i> ' +
						'<span style="font-weight: bold">'+clusters6[i] +' (T)</span>' +'<br>';
			}else{
				div.innerHTML +=
						'<i style="background:' + color_k36(clusters6[i]) + '"></i> ' +
						clusters6[i] + '<br>';
			}
  }
    return div;
};

phl_legend3.onAdd = function (phlmap) {

    var div = L.DomUtil.create('div', 'legend'),
        clusters29 = [1, 11, 16],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
		div.innerHTML = '<span style="font-size:12px; font-weight:bold">Cluster ID<br>(K=29)</span>'+'<br>';
		for (var i = 0; i <= clusters29.length; i++) {
			if(i==clusters29.length){
				div.innerHTML+=
				'<i style="background:' + "#d3f2a3" + '"></i> ' + 'others';
			}else if(clusters29[i]===11){
				div.innerHTML +=
						'<i style="background:' + color_k29(clusters29[i]) + '"></i> ' +
						'<span style="font-weight: bold">'+clusters29[i] +' (T)</span>' +'<br>';
			}else{
				div.innerHTML +=
						'<i style="background:' + color_k29(clusters29[i]) + '"></i> ' +
						clusters29[i] + '<br>';
			}
    }
    return div;
};
phl_legend4.onAdd = function (phlmap) {

    var div = L.DomUtil.create('div', 'legend'),
        clusters39 = [9, 11, 12],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
		div.innerHTML = '<span style="font-size:12px; font-weight:bold">Cluster ID<br>(K=39)</span>'+'<br>';
		for (var i = 0; i <= clusters39.length; i++) {
			if(i==clusters39.length){
				div.innerHTML+=
				'<i style="background:' + "#d3f2a3" + '"></i> ' + 'others';
			}else if(clusters39[i]===12){
				div.innerHTML +=
						'<i style="background:' + color_k39(clusters39[i]) + '"></i> ' +
						'<span style="font-weight: bold">'+clusters39[i] +' (T)</span>' +'<br>';
			}else{
				div.innerHTML +=
						'<i style="background:' + color_k39(clusters39[i]) + '"></i> ' +
						clusters39[i] + '<br>';
			}
    }
    return div;
};

// Section 2 ....
var sea_allFeatures, phl_allFeatures;
var selection={
	"val": undefined,
	"subval_v": undefined,
	"subval_b":undefined
};

var subselection={
	"title":"<div id='select_subcat' style='font-size: 12px;padding: 7px 2px 2px 2px'>Select a topic:</div>",
	"vehicle": "<div id='subselect'><select id='select_v' style='font-size:11px; padding:3px;'><option value='' disabled selected>Topics</option><option value='1'>Daytime Vehicle Counts</option><option value='2'>Daytime Vehicle $ Exposure</option><option value='3'>Night-time Vehicle Counts</option><option value='4'>Night-time Vehicle $ Exposure</option></select></div>",
	"building": "<div id='subselect'><select id='select_b' style='font-size:11px; padding:3px;'><option value='' disabled selected>Topics</option><option value='1'>Total # of Buildings</option><option value='2'>Total $ Exposure</option></select></div>",
	"v_legend1":"<div id='legendfortwo'><div><div id='a' style='background-color: #c4e6c3'></div><div id='range'> 0 - 130</div></div><div><div id='a' style='background-color: #80c799'></div><div id='range'> 131 - 413</div></div><div><div id='a' style='background-color: #4da284'></div><div id='range'> 414 - 1121</div></div><div><div id='a' style='background-color: #2d7974'></div><div id='range'> 1122 - 3000</div></div><div><div id='a' style='background-color: #1d4f60'></div><div id='range'> 3001 - 6000</div></div></div>",
	"v_legend2":"<div id='legendfortwo'><div><div id='a' style='background-color: #fff7f3'></div><div id='range'> $0 </div></div><div><div id='a' style='background-color: #e7e1ef'></div><div id='range'> $0 - 27k </div></div><div><div id='a' style='background-color: #d4b9da'></div><div id='range'> $27k - 81k</div></div><div><div id='a' style='background-color: #c994c7'></div><div id='range'> $81k - 189k</div></div><div><div id='a' style='background-color: #df65b0'></div><div id='range'> $189k -  251k</div></div><div><div id='a' style='background-color: #e7298a'></div><div id='range'> $251k - 534k</div></div><div><div id='a' style='background-color: #ce1256'></div><div id='range'> $534k - 1.3M </div></div><div><div id='a' style='background-color: #91003f'></div><div id='range'> $1.3M - 126M</div></div></div>",
	"v_legend3":"<div id='legendfortwo'><div><div id='a' style='background-color: #f7fcb9'></div><div id='range'> 0 - 62</div></div><div><div id='a' style='background-color: #c4e6c3'></div><div id='range'> 63 - 167</div></div><div><div id='a' style='background-color: #80c799'></div><div id='range'> 168 - 341</div></div><div><div id='a' style='background-color: #4da284'></div><div id='range'> 342 - 750</div></div><div><div id='a' style='background-color: #2d7974'></div><div id='range'> 751 - 1037</div></div><div><div id='a' style='background-color: #1d4f60'></div><div id='range'> 1038 - 2228</div></div></div>",
	"v_legend4":"<div id='legendfortwo'><div><div id='a' style='background-color: #d4b9da'></div><div id='range'> $0 - 725k</div></div><div><div id='a' style='background-color: #c994c7'></div><div id='range'> $725k - 2.24M</div></div><div><div id='a' style='background-color: #df65b0'></div><div id='range'> $2.24M - 5.65M</div></div><div><div id='a' style='background-color: #e7298a'></div><div id='range'> $5.65M - 11.8M</div></div><div><div id='a' style='background-color: #ce1256'></div><div id='range'> $11.8M - 27.7M </div></div><div><div id='a' style='background-color: #91003f'></div><div id='range'> $27.7M - 32M</div></div></div>",
	"b_legend1":"<div id='legendfortwo'><div><div id='a' style='background-color: #fdd0a2'></div><div id='range'> 0 - 7</div></div><div><div id='a' style='background-color: #fdae6b'></div><div id='range'> 8 - 18</div></div><div><div id='a' style='background-color: #fd8d3c'></div><div id='range'> 19 - 36</div></div><div><div id='a' style='background-color:  #f16913'></div><div id='range'> 37 - 62</div></div><div><div id='a' style='background-color:  #d94801'></div><div id='range'> 63 - 120</div></div><div><div id='a' style='background-color: #8c2d04'></div><div id='range'> 121 - 195</div></div></div>",
	"b_legend2":"<div id='legendfortwo'><div><div id='a' style='background-color: #fee5d9'></div><div id='range'> $0 - 34k</div></div><div><div id='a' style='background-color: #fcbba1'></div><div id='range'> $34k - 51k</div></div><div><div id='a' style='background-color: #fc9272'></div><div id='range'> $51k - 116k</div></div><div><div id='a' style='background-color: #fb6a4a'></div><div id='range'> $116k - 276k</div></div><div><div id='a' style='background-color: #ef3b2c'></div><div id='range'> $276k - 583</div></div><div><div id='a' style='background-color: #cb181d'></div><div id='range'> $583k - 820k</div></div><div><div id='a' style='background-color: #99000d'></div><div id='range'> $820k - 1.3M</div></div></div>"

};

var velcutoffs=[
	{"vehl1": [130,413,1121,3000,6000]},
	{"vehl2": [0,27029,81087,189203,250867,534260,1331778,126479573]},
	{"vehl3": [0, 62,167,341,750,1037,2228]},
	{"vehl4": [0,725824,2245912,5648782,11799134,27716906,32058532]},
	{"vehl1c": ["#c4e6c3", "#80c799", "#4da284", "#2d7974","#1d4f60"]},
	{"vehl2c": ["#fff7f3", "#e7e1ef", "#d4b9da", "#c994c7","#df65b0","#e7298a","#ce1256","#91003f"]},
	{"vehl3c": ["#f7fcb9", "#c4e6c3", "#80c799", "#4da284", "#2d7974","#1d4f60"]},
	{"vehl4c": ["#d4b9da", "#c994c7","#df65b0","#e7298a","#ce1256","#91003f"]},
];

var bldcutoffs=[
	{"bld1": [0, 7, 18, 36, 62, 120, 195]}, //bld counts cutoffs 6
	{"bld2": [0, 34263, 51468, 116147, 275989, 582602, 820424, 1312912]}, //bld $ Exposure cutoffs 7
	{"bld1c": ["#fdd0a2", "#fdae6b","#fd8d3c","#f16913","#d94801","#8c2d04"]}, //bld counts
	{"bld2c": ["#fee5d9", "#fcbba1","#fc9272","#fb6a4a","#ef3b2c","#cb181d","#99000d"]} //bld $ Exposure
];

var defaultsty_sec2 = {weight: 0.8, color: "#d34f2a",opacity:0.5, fillColor: "#485978", fillOpacity: 0.8};
function onClick1(e) {
    seamap2.setView(amazongo_coor,16);
}
var	amazongo = L.marker([47.616404, -122.339864])
		.bindPopup('<b>Amazon Go</b><br>2131 7th Ave<br>Seattle, WA 98121')
		.on('click', onClick1),
		layer2=L.layerGroup([amazongo]);

var seamap2=L.map('sea_map2', {
	center:sea_map_center,
	zoom:12
});

var CartoDB_Positron1 = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
	subdomains: 'abcd',
	maxZoom: 19
}).addTo(seamap2);

var overlayMaps2 = {
    "Amazon Go": layer2
};

L.control.layers(overlayMaps2).addTo(seamap2);

var phlmap2=L.map('phl_map2', {
	center:phl_map_center,
	zoom:13
});

var CartoDB_Positron2 = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
	subdomains: 'abcd',
	maxZoom: 19
}).addTo(phlmap2);

var sea2_sql0 = "SELECT cartodb_id, the_geom, the_geom_webmercator, totalday, daytotalve, totalnight, nighttot_6, totalexpos,totalcount FROM sea1695blks_withalldata",
		phl2_sql0 = "SELECT cartodb_id, the_geom, the_geom_webmercator, totalday, daytotalve, totalnight, nighttot_6, totalexpos,totalcount FROM phl1339blks_withalldata";

function color_vehl1(n){
	return n <=	velcutoffs[0].vehl1[0] ? velcutoffs[4].vehl1c[0]:
				 n > velcutoffs[0].vehl1[0] && n <= velcutoffs[0].vehl1[1]	? velcutoffs[4].vehl1c[1]:
				 n > velcutoffs[0].vehl1[1] && n <= velcutoffs[0].vehl1[2]	? velcutoffs[4].vehl1c[2]:
				 n > velcutoffs[0].vehl1[2] && n <= velcutoffs[0].vehl1[3]	? velcutoffs[4].vehl1c[3]:
				 n > velcutoffs[0].vehl1[3] && n <= velcutoffs[0].vehl1[4]	? velcutoffs[4].vehl1c[4]:
				 n > velcutoffs[0].vehl1[4] && n <= velcutoffs[0].vehl1[5]	?	velcutoffs[4].vehl1c[5]:
				 																													"white";
}
var style_vehl1 = function(feature){
	return{
		fillColor: color_vehl1(feature.properties.totalday),
		weight: 0.5,
		opacity: 0,
		color:"white",
		fillOpacity: 0.9
	};
};
function color_vehl2(n){
	return n ===	velcutoffs[1].vehl2[0] 															? velcutoffs[5].vehl2c[0]:
				 n > velcutoffs[1].vehl2[0] && n <= velcutoffs[1].vehl2[1]	? velcutoffs[5].vehl2c[1]:
				 n > velcutoffs[1].vehl2[1] && n <= velcutoffs[1].vehl2[2]	? velcutoffs[5].vehl2c[2]:
				 n > velcutoffs[1].vehl2[2] && n <= velcutoffs[1].vehl2[3]	? velcutoffs[5].vehl2c[3]:
				 n > velcutoffs[1].vehl2[3] && n <= velcutoffs[1].vehl2[4]	? velcutoffs[5].vehl2c[4]:
				 n > velcutoffs[1].vehl2[4] && n <= velcutoffs[1].vehl2[5]	?	velcutoffs[5].vehl2c[5]:
				 n > velcutoffs[1].vehl2[5] && n <= velcutoffs[1].vehl2[6]	?	velcutoffs[5].vehl2c[6]:
				 n > velcutoffs[1].vehl2[6] && n <= velcutoffs[1].vehl2[7]	?	velcutoffs[5].vehl2c[7]:
				 																													"white";
}
var style_vehl2 = function(feature){
	return{
		fillColor: color_vehl2(feature.properties.daytotalve),
		weight: 0.5,
		opacity: 0,
		color:"white",
		fillOpacity: 0.9
	};
};
function color_vehl3(n){
	return n > velcutoffs[2].vehl3[0] && n <= velcutoffs[2].vehl3[1]	? velcutoffs[6].vehl3c[0]:
				 n > velcutoffs[2].vehl3[1] && n <= velcutoffs[2].vehl3[2]	? velcutoffs[6].vehl3c[1]:
				 n > velcutoffs[2].vehl3[2] && n <= velcutoffs[2].vehl3[3]	? velcutoffs[6].vehl3c[2]:
				 n > velcutoffs[2].vehl3[3] && n <= velcutoffs[2].vehl3[4]	? velcutoffs[6].vehl3c[3]:
				 n > velcutoffs[2].vehl3[4] && n <= velcutoffs[2].vehl3[5]	?	velcutoffs[6].vehl3c[4]:
				 n > velcutoffs[2].vehl3[5] && n <= velcutoffs[2].vehl3[6]	?	velcutoffs[6].vehl3c[5]:
				 																													"white";
}
var style_vehl3 = function(feature){
	return{
		fillColor: color_vehl3(feature.properties.totalnight),
		weight: 0.5,
		opacity: 0,
		color:"white",
		fillOpacity: 0.9
	};
};
function color_vehl4(n){
	return n > velcutoffs[3].vehl4[0] && n <= velcutoffs[3].vehl4[1]	? velcutoffs[7].vehl4c[0]:
				 n > velcutoffs[3].vehl4[1] && n <= velcutoffs[3].vehl4[2]	? velcutoffs[7].vehl4c[1]:
				 n > velcutoffs[3].vehl4[2] && n <= velcutoffs[3].vehl4[3]	? velcutoffs[7].vehl4c[2]:
				 n > velcutoffs[3].vehl4[3] && n <= velcutoffs[3].vehl4[4]	? velcutoffs[7].vehl4c[3]:
				 n > velcutoffs[3].vehl4[4] && n <= velcutoffs[3].vehl4[5]	?	velcutoffs[7].vehl4c[4]:
				 n > velcutoffs[3].vehl4[5] && n <= velcutoffs[3].vehl4[6]	?	velcutoffs[7].vehl4c[5]:
				 																													"white";
}
var style_vehl4 = function(feature){
	return{
		fillColor: color_vehl4(feature.properties.nighttot_6),
		weight: 0.5,
		opacity: 0,
		color:"white",
		fillOpacity: 0.9
	};
};

function color_bld1(n){
	return n > bldcutoffs[0].bld1[0] && n <= bldcutoffs[0].bld1[1]	? bldcutoffs[2].bld1c[0]:
				 n > bldcutoffs[0].bld1[1] && n <= bldcutoffs[0].bld1[2]	? bldcutoffs[2].bld1c[1]:
				 n > bldcutoffs[0].bld1[2] && n <= bldcutoffs[0].bld1[3]	? bldcutoffs[2].bld1c[2]:
				 n > bldcutoffs[0].bld1[3] && n <= bldcutoffs[0].bld1[4]	? bldcutoffs[2].bld1c[3]:
				 n > bldcutoffs[0].bld1[4] && n <= bldcutoffs[0].bld1[5]	?	bldcutoffs[2].bld1c[4]:
				 n > bldcutoffs[0].bld1[5] && n <= bldcutoffs[0].bld1[6]	?	bldcutoffs[2].bld1c[5]:
				 																													"white";
}
var style_bld1 = function(feature){
	return{
		fillColor: color_bld1(feature.properties.totalcount),
		weight: 0.5,
		opacity: 0,
		color:"white",
		fillOpacity: 0.9
	};
};
function color_bld2(n){
	return n > bldcutoffs[1].bld2[0] && n <= bldcutoffs[1].bld2[1]	? bldcutoffs[3].bld2c[0]:
				 n > bldcutoffs[1].bld2[1] && n <= bldcutoffs[1].bld2[2]	? bldcutoffs[3].bld2c[1]:
				 n > bldcutoffs[1].bld2[2] && n <= bldcutoffs[1].bld2[3]	? bldcutoffs[3].bld2c[2]:
				 n > bldcutoffs[1].bld2[3] && n <= bldcutoffs[1].bld2[4]	? bldcutoffs[3].bld2c[3]:
				 n > bldcutoffs[1].bld2[4] && n <= bldcutoffs[1].bld2[5]	?	bldcutoffs[3].bld2c[4]:
				 n > bldcutoffs[1].bld2[5] && n <= bldcutoffs[1].bld2[6]	?	bldcutoffs[3].bld2c[5]:
				 n > bldcutoffs[1].bld2[6] && n <= bldcutoffs[1].bld2[7]	?	bldcutoffs[3].bld2c[5]:
				 																													"white";
}
var style_bld2 = function(feature){
	return{
		fillColor: color_bld2(feature.properties.totalexpos),
		weight: 0.5,
		opacity: 0,
		color:"white",
		fillOpacity: 0.9
	};
};
// Section 3
var CartoDB_Positron3 = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
	subdomains: 'abcd',
	maxZoom: 19
}),
CartoDB_DarkMatter3 = L.tileLayer('http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png', {
	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
	subdomains: 'abcd',
	maxZoom: 19
});

var phlmap3=L.map('phl_map3', {
	center:phl_map_center,
	zoom:14,
	layers:[CartoDB_Positron3, CartoDB_DarkMatter3]
});
var baseMaps3 = {
		"<span style='color: gray'>Light Gray</span>": CartoDB_Positron3,
		"<span style='color: black'>Dark Gray</span>": CartoDB_DarkMatter3
};

var phl3_sql1="SELECT * FROM fishnet50_sa_41408_withscores",
		phl3_sql0="SELECT * FROM phl60blockgroups_retaildata_census";
var phl3_60blockgroups, phl3_filteredfishnet;
var drawFilter, inputFilter, bounds, inputFilterArr=[];

var drawedShape=[], filteredFishnets=[];
var drawControl = new L.Control.Draw({
	draw: {
		polyline: false,
		polygon: false,
		circle: false,
		marker: false,
		rectangle: true,
	}
});
phlmap3.addControl(drawControl);

//default fishnet is colored based on the scores
function color_scores(n){
	return n <= 0.002895 ? "#f7feae":
				 n >0.002895 && n<=0.008573? "#9bd8a4":
				 n >0.008573 && n<=0.018450? "#46aea0":
				 n >0.018450 && n<=0.038528? "#058092":
				 n >0.038528 && n<=0.079?		"#045275":
				 														"white";
}
var defaultsty_fishnet = function(feature){
	return{
		fillColor: color_scores(feature.properties.score),
		weight:0,
		opacity:0,
		fillOpacity: 0.8
	};
};

var phl3_legend = L.control({position: 'bottomright'});
phl3_legend.onAdd = function (phlmap3) {

    var div = L.DomUtil.create('div', 'legend'),
        cuts = [0.002895, 0.00857, 0.01845,0.03853,0.07892],
				colors=["#f7feae", "#9bd8a4", "#46aea0","#058092", "#045275"],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
		div.innerHTML = '<div style="font-size:12px; font-weight:bold; padding-bottom:5px;">Score Ranges</div>';
		for (var i = 0; i < cuts.length; i++) {
			if(i===0){
				div.innerHTML +=
						'<i style="background:' + colors[i] + '"></i> ' + '<span>>= </span>'
						+cuts[i] +'<br>';
			}else{
				div.innerHTML +=
						'<i style="background:' + colors[i] + '"></i> ' +
						cuts[i] + (cuts[i + 1] ? ' &ndash; ' + cuts[i + 1] + '<br>' : ' +');
			}
    }
    return div;
};

var phl3_fishnet_url0="https://"+cartoUserName+".carto.com/api/v2/sql?format="+format+"&q="+phl3_sql0;

$(document).ready(function(){
	$.ajax(phl3_fishnet_url0).done(function(data){
		phl3_60blockgroups=L.geoJson(data,{
			style:{weight: 0.8, color: "blue", fillColor: "", fillOpacity:0},
		}).addTo(phlmap3);
	});
});

var lcontrol=L.control.layers(baseMaps3);
lcontrol.addTo(phlmap3);
phl3_legend.addTo(phlmap3);
var section3inputs={
	"min": undefined,
	"cutoff": undefined
};

//section 4
