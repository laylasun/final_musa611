function reCenter_sea(){
  seamap.setView(sea_map_center,zoomlevel);
}
function reCenter_phl(){
  phlmap.setView(phl_map_center,zoomlevel+1);
}

var sea_all_url = "https://"+cartoUserName+".carto.com/api/v2/sql?format="+format+"&q="+sea_sql1,
    sea_all_url2 = "https://"+cartoUserName+".carto.com/api/v2/sql?format="+format+"&q="+sea_sql2,
    sea_all_url3= "https://"+cartoUserName+".carto.com/api/v2/sql?format="+format+"&q="+sea_sql3;
var phl_all_url = "https://"+cartoUserName+".carto.com/api/v2/sql?format="+format+"&q="+phl_sql1,
    phl_all_url2= "https://"+cartoUserName+".carto.com/api/v2/sql?format="+format+"&q="+phl_sql2,
    phl_all_url3="https://"+cartoUserName+".carto.com/api/v2/sql?format="+format+"&q="+phl_sql3;
//console.log(sea_all_url);
$(document).ready(function(){
  $.ajax(sea_all_url).done(function(data){
    sea_allblocks=L.geoJson(data, {
      style: defaultsty
    }).addTo(seamap);
  });

  $.ajax(phl_all_url).done(function(data){
    phl_allblocks=L.geoJson(data, {
      style: defaultsty
    }).addTo(phlmap);
  });

  $.ajax(sea_all_url2).done(function(data){
    sea_intersect1=L.geoJson(data, {
      style: defaultsty_inters1
    });
  });

  $.ajax(phl_all_url2).done(function(data){
    phl_intersect1=L.geoJson(data, {
      style: defaultsty_inters1
    });
  });

  $.ajax(sea_all_url3).done(function(data){
    sea_intersect2=L.geoJson(data, {
      style: defaultsty_inters2
    });
  });

  $.ajax(phl_all_url3).done(function(data){
    phl_intersect2=L.geoJson(data, {
      style: defaultsty_inters2
    });
  });


  $('#k3').click(function(){
    if(activeControl.length >0){
      seamap.removeControl(_.last(activeControl));
      activeControl=activeControl.slice(1);
    }
    sea_allblocks.setStyle(cluster3);
    sea_allblocks.addTo(seamap);
    sea_legend1.addTo(seamap);
    activeControl.push(sea_legend1);
  });

  $('#k6').click(function(){
    if(activeControl.length >0){
      seamap.removeControl(_.last(activeControl));
      activeControl=activeControl.slice(1);
    }

    sea_allblocks.setStyle(cluster6);
    sea_allblocks.addTo(seamap);
    sea_legend2.addTo(seamap);

    activeControl.push(sea_legend2);
  });

  $('#k29').click(function(){
    if(activeControl.length >0){
      seamap.removeControl(_.last(activeControl));
      activeControl=activeControl.slice(1);
    }

    sea_allblocks.setStyle(cluster29);
    sea_allblocks.addTo(seamap);
    sea_legend3.addTo(seamap);
    activeControl.push(sea_legend3);
  });

  $('#k39').click(function(){
    if(activeControl.length >0){
      seamap.removeControl(_.last(activeControl));
      activeControl=activeControl.slice(1);
    }

    sea_allblocks.setStyle(cluster39);
    sea_allblocks.addTo(seamap);
    sea_legend4.addTo(seamap);
    activeControl.push(sea_legend4);
  });

  $('#k3p').click(function(){
    if(activeControlP.length >0){
      phlmap.removeControl(_.last(activeControlP));
      activeControlP=activeControlP.slice(1);
    }
    phl_allblocks.setStyle(cluster3);
    phl_allblocks.addTo(phlmap);
    phl_legend1.addTo(phlmap);
    activeControlP.push(phl_legend1);
  });
  $('#k6p').click(function(){
    if(activeControlP.length >0){
      phlmap.removeControl(_.last(activeControlP));
      activeControlP=activeControlP.slice(1);
    }
    phl_allblocks.setStyle(cluster6);
    phl_allblocks.addTo(phlmap);
    phl_legend2.addTo(phlmap);
    activeControlP.push(phl_legend2);
  });

  $('#k29p').click(function(){
    if(activeControlP.length >0){
      phlmap.removeControl(_.last(activeControlP));
      activeControlP=activeControlP.slice(1);
    }
    phl_allblocks.setStyle(cluster29);
    phl_allblocks.addTo(phlmap);
    phl_legend3.addTo(phlmap);
    activeControlP.push(phl_legend3);
  });

  $('#k39p').click(function(){
    if(activeControlP.length >0){
      phlmap.removeControl(_.last(activeControlP));
      activeControlP=activeControlP.slice(1);
    }
    phl_allblocks.setStyle(cluster39);
    phl_allblocks.addTo(phlmap);
    phl_legend4.addTo(phlmap);
    activeControlP.push(phl_legend4);
  });

  $('#intersect1').click(function(){
    if(activeControlP.length >0){
      phlmap.removeControl(_.last(activeControlP));
      activeControlP=activeControlP.slice(1);
    }
    if (activeControl.length>0) {
      seamap.removeControl(_.last(activeControl));
      activeControl=activeControl.slice(1);
    }

    // remove layer - intersect2 if active on the map
    if(intersected.length>0){
      _.each(intersected, function(l){
        if(l._leaflet_id==sealeafletid2){seamap.removeLayer(l); intersected=intersected.slice(1);}
        if(l._leaflet_id==phlleafletid2){phlmap.removeLayer(l); intersected=intersected.slice(1);}
      });
    }

    seamap.removeLayer(sea_allblocks);
    intersected.push(sea_intersect1);
    sea_intersect1.addTo(seamap);

    // zoom to the layer center
    var bounds = sea_intersect1.getBounds(),
        sea_zmcenter1= bounds.getCenter();
    seamap.setView(sea_zmcenter1, 13);

    phlmap.removeLayer(phl_allblocks);
    intersected.push(phl_intersect1);
    phl_intersect1.addTo(phlmap);

    // zoom to the layer center
    var boundsp=phl_intersect1.getBounds(),
        phl_zmcenter1 = boundsp.getCenter();
    phlmap.setView(phl_zmcenter1, 14);

    console.log(intersected[0]._leaflet_id, intersected[1]._leaflet_id); //196;45
    sealeafletid1=intersected[0]._leaflet_id;
    phlleafletid1=intersected[1]._leaflet_id;
  });

  $('#intersect2').click(function(){
    if(activeControlP.length >0){
      phlmap.removeControl(_.last(activeControlP));
      activeControlP=activeControlP.slice(1);
    }
    if (activeControl.length>0) {
      seamap.removeControl(_.last(activeControl));
      activeControl=activeControl.slice(1);
    }
    // remove layer - intersect1 if active on the map
    if(intersected.length>0){
      _.each(intersected, function(l){
        if(l._leaflet_id==sealeafletid1){seamap.removeLayer(l); intersected=intersected.slice(1);}
        if(l._leaflet_id==phlleafletid1){phlmap.removeLayer(l); intersected=intersected.slice(1);}
      });
    }

    seamap.removeLayer(sea_allblocks);
    intersected.push(sea_intersect2);
    sea_intersect2.addTo(seamap);

    // zoom to the layer center
    var bounds = sea_intersect2.getBounds(),
        sea_zmcenter2 = bounds.getCenter();
    seamap.setView(sea_zmcenter2, 13);

    phlmap.removeLayer(phl_allblocks);
    intersected.push(phl_intersect2);
    phl_intersect2.addTo(phlmap);

    // zoom to the layer center
    var boundsp=phl_intersect2.getBounds(),
        phl_zmcenter2 = boundsp.getCenter();
    phlmap.setView(phl_zmcenter2, 13);

    console.log(intersected[0]._leaflet_id, intersected[1]._leaflet_id);
    sealeafletid2=intersected[0]._leaflet_id;
    phlleafletid2=intersected[1]._leaflet_id;
  });
});

$('#seareset').click(function(){
  if(activeControl.length >0){
    seamap.removeControl(_.last(activeControl));
    activeControl=activeControl.slice(1);
  }
  sea_allblocks.setStyle(defaultsty);
  sea_allblocks.addTo(seamap);
});

$('#phlreset').click(function(){
  if(activeControlP.length >0){
    phlmap.removeControl(_.last(activeControlP));
    activeControlP=activeControlP.slice(1);
  }
  phl_allblocks.setStyle(defaultsty);
  phl_allblocks.addTo(phlmap);
})

//Section 2
var sea2_url0="https://"+cartoUserName+".carto.com/api/v2/sql?format="+format+"&q="+sea2_sql0,
    phl2_url0="https://"+cartoUserName+".carto.com/api/v2/sql?format="+format+"&q="+phl2_sql0;

$(document).ready(function(){
  $.ajax(sea2_url0).done(function(data){
    sea_allFeatures=L.geoJson(data, {
      style: defaultsty_sec2
    }).addTo(seamap2);
  });

  $.ajax(phl2_url0).done(function(data){
    phl_allFeatures=L.geoJson(data, {
      style: defaultsty_sec2
    }).addTo(phlmap2);
  });

  $('#bothmapreset').click(function(){

    $("#select_cat").val("");
    $('#select_subcat').replaceWith("<div id='select_subcat'></div>");
    $('#subselect').replaceWith("<div id='subselect'></div>");
    $('#legendfortwo').replaceWith("<div id='legendfortwo'></div>");

    sea_allFeatures.setStyle(defaultsty_sec2);
    phl_allFeatures.setStyle(defaultsty_sec2);
  });

//category and subselection start here....
$("#select_cat").on("change", function(){
  selection.val=$("#select_cat").val();
  if(selection.val==='1'){
    $('#select_subcat').replaceWith(subselection.title);
    $('#subselect').replaceWith(subselection.vehicle);
    $('#legendfortwo').replaceWith("<div id='legendfortwo'></div>");
    //Selection for Vehicle topic
    $("#select_v").on("change", function(){
      selection.subval_v=$("#select_v").val();

      if(selection.subval_v==='1'){
        console.log(velcutoffs[0].vehl1[0]);
        sea_allFeatures.setStyle(style_vehl1);
        phl_allFeatures.setStyle(style_vehl1);
        $('#legendfortwo').replaceWith(subselection.v_legend1);
      }else if (selection.subval_v==='2') {
        sea_allFeatures.setStyle(style_vehl2);
        phl_allFeatures.setStyle(style_vehl2);
        $('#legendfortwo').replaceWith(subselection.v_legend2);
      }else if (selection.subval_v ==='3') {
        sea_allFeatures.setStyle(style_vehl3);
        phl_allFeatures.setStyle(style_vehl3);
        $('#legendfortwo').replaceWith(subselection.v_legend3);
      }else{
        sea_allFeatures.setStyle(style_vehl4);
        phl_allFeatures.setStyle(style_vehl4);
        $('#legendfortwo').replaceWith(subselection.v_legend4);
      }
    });
  }else{
    $('#select_subcat').replaceWith(subselection.title);
    $('#subselect').replaceWith(subselection.building);
    $('#legendfortwo').replaceWith("<div id='legendfortwo'></div>");
    //Selection for building topic
    $("#select_b").on("change",function(){
      selection.subval_b=$("#select_b").val();

      if(selection.subval_b==='1'){
        sea_allFeatures.setStyle(style_bld1);
        phl_allFeatures.setStyle(style_bld1);
      $('#legendfortwo').replaceWith(subselection.b_legend1);
      }else{
        sea_allFeatures.setStyle(style_bld2);
        phl_allFeatures.setStyle(style_bld2);
        $('#legendfortwo').replaceWith(subselection.b_legend2);
      }
    });
  } //--> else: subselection appending ends

});//-->category selection function ends

  $('#bothmaprecenter').click(function(){
    seamap2.setView(sea_map_center, 12);
    phlmap2.setView(phl_map_center,13);
  });

});//---> section2 doc.ready ends


//Section 3
var phl3_fishnet_url1="https://"+cartoUserName+".carto.com/api/v2/sql?format="+format+"&q="+phl3_sql1;

phlmap3.on('draw:created', function (e) {
    var type = e.layerType; // The type of shape
    var layer = e.layer; // The Leaflet layer for the shape
    var id = L.stamp(layer); // The unique Leaflet ID for the layer
    drawedShape.push(layer);
    _.each(drawedShape,function(shape){
      if(shape._leaflet_id !== undefined){
        phlmap3.removeLayer(shape);
      }
    });

    layer.addTo(phlmap3);
    bounds=layer.getBounds();

    drawFilter=function(feature){
      return bounds.contains([feature.properties.lat, feature.properties.lng]);
  }

  $(document).ready(function(){
    $.ajax(phl3_fishnet_url1).done(function(data){
      phl3_filteredfishnet=L.geoJson(data,{
        filter: drawFilter,
        style:  defaultsty_fishnet
      }).addTo(phlmap3);
      filteredFishnets.push(phl3_filteredfishnet);

      $('#clear').click(function(){
        _.each(filteredFishnets,function(t){
          console.log(t._leaflet_id);
          phlmap3.removeLayer(t);
        });
        _.each(drawedShape,function(shape){
            phlmap3.removeLayer(shape);
        });
      });

    });
  });
}); //---> draw shape ends

$(document).ready(function(){

// within button
  $('#within').click(function(){
    section3inputs.min=$('#minval').val();
    section3inputs.cutoff=$('#cutoff').val();
    if(section3inputs.min === section3inputs.cutoff){
      alert("Please enter two different values.");
    }else if(section3inputs.min > section3inputs.cutoff){
      if(inputFilterArr.length>0){
        phlmap3.removeLayer(phl3_allfishnet);
        inputFilterArr.slice(1);
      }
      inputFilter=function(feature){
        return feature.properties.score<=section3inputs.min && feature.properties.score>=section3inputs.cutoff;
      }
      $.ajax(phl3_fishnet_url1).done(function(data){
        phl3_allfishnet=L.geoJson(data,{
          filter: inputFilter,
          style:defaultsty_fishnet
        });
        inputFilterArr.push(phl3_allfishnet);
        phl3_allfishnet.addTo(phlmap3);
      });

    }else{
      if(inputFilterArr.length>0){
        phlmap3.removeLayer(phl3_allfishnet);
        inputFilterArr.slice(1);
      }
      inputFilter=function(feature){
        return feature.properties.score>=section3inputs.min && feature.properties.score<=section3inputs.cutoff;
      }
      $.ajax(phl3_fishnet_url1).done(function(data){
        phl3_allfishnet=L.geoJson(data,{
          filter: inputFilter,
          style:defaultsty_fishnet
        }).addTo(phlmap3);
        inputFilterArr.push(phl3_allfishnet);
      });
    }
}); //--> within button end

    // above the min. button
      $('#abovemin').click(function(){
        section3inputs.min=$('#minval').val();
        section3inputs.cutoff=$('#cutoff').val();

        if(section3inputs.min >= section3inputs.cutoff){ //cutoff as the min
          if(inputFilterArr.length>0){
            phlmap3.removeLayer(phl3_allfishnet);
            inputFilterArr.slice(1);
          }
          inputFilter=function(feature){
            return feature.properties.score>=section3inputs.cutoff;
          }
          $.ajax(phl3_fishnet_url1).done(function(data){
            phl3_allfishnet=L.geoJson(data,{
              filter: inputFilter,
              style:defaultsty_fishnet
            });
            inputFilterArr.push(phl3_allfishnet);
            phl3_allfishnet.addTo(phlmap3);
          });

        }else{
          if(inputFilterArr.length>0){
            phlmap3.removeLayer(phl3_allfishnet);
            inputFilterArr.slice(1);
          }
          inputFilter=function(feature){
            return feature.properties.score>=section3inputs.min;
          }
          $.ajax(phl3_fishnet_url1).done(function(data){
            phl3_allfishnet=L.geoJson(data,{
              filter: inputFilter,
              style:defaultsty_fishnet
            }).addTo(phlmap3);
            inputFilterArr.push(phl3_allfishnet);
          });
        }
  });//--> above min button end

  // above the cutoff button
    $('#abovecutoff').click(function(){
      section3inputs.min=$('#minval').val();
      section3inputs.cutoff=$('#cutoff').val();

      if(section3inputs.min >= section3inputs.cutoff){ //cutoff as the min
        if(inputFilterArr.length>0){
          phlmap3.removeLayer(phl3_allfishnet);
          inputFilterArr.slice(1);
        }
        inputFilter=function(feature){
          return feature.properties.score>=section3inputs.min;
        }
        $.ajax(phl3_fishnet_url1).done(function(data){
          phl3_allfishnet=L.geoJson(data,{
            filter: inputFilter,
            style:defaultsty_fishnet
          });
          inputFilterArr.push(phl3_allfishnet);
          phl3_allfishnet.addTo(phlmap3);
        });

      }else{
        if(inputFilterArr.length>0){
          phlmap3.removeLayer(phl3_allfishnet);
          inputFilterArr.slice(1);
        }
        inputFilter=function(feature){
          return feature.properties.score>=section3inputs.cutoff;
        }
        $.ajax(phl3_fishnet_url1).done(function(data){
          phl3_allfishnet=L.geoJson(data,{
            filter: inputFilter,
            style:defaultsty_fishnet
          }).addTo(phlmap3);
          inputFilterArr.push(phl3_allfishnet);
        });
      }
    }); //--> above cutoff

    $('#clearinputs').click(function(){
      phlmap3.setView(phl_map_center, 14);
      if(inputFilterArr.length>0){
        phlmap3.removeLayer(phl3_allfishnet);
        inputFilterArr.slice(1);
      }
    });
});

//Section 4
