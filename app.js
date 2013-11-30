//Get data from Firebase
var nodes,links=[],tempLinks,tempWidth=-6;
var nodeRef = new Firebase("https://adastragames.firebaseio.com/aarra2/nodes");
var linkRef = new Firebase("https://adastragames.firebaseio.com/aarra2/links");
      nodeRef.on('value',function(snapshot){
        nodes = snapshot.val();

        linkRef.on('value',function(snapshot2){
          tempLinks = snapshot2.val();
          for (var i in tempLinks){
            var linkObject ={};
            linkObject.source = nodes[tempLinks[i][0]];
            linkObject.target = nodes[tempLinks[i][1]];
            linkObject.weight = 4;
            linkObject.priority = tempLinks[i][2];
            links.push(linkObject);
          }
          init();
        });
      });

//populate list of system names



//svg drawing
var init=function(){
    

  var svg = d3.select("#myCanvas").append("svg");
  var width = $( "#myCanvas" ).width();
      height = $( "#myCanvas" ).height();
  var force = d3.layout.force()
    .gravity(0.1)
    //.distance(100)
    .distance(function(l){
      return l.priority*25;
    })
    .linkStrength(0.1)
    .charge(-150)
    .size([width, height])
    .nodes(nodes)
    .links(links)
    .start();

  var link = svg.selectAll(".link")
      .data(links)
      .enter().append("line")
      .attr('data-source', function(d){return d.source.sysName})
      .attr('data-target', function(d){return d.target.sysName})
      .attr("class", function(d){
        if (d.priority===0){
          return "link jumpGate";
        }else if(d.priority===6){
          return "link linkValue6";
        }else if(d.priority===7){
          return "link linkValue7";
        }else if(d.priority>=8){
          return "link linkValue8";
        }else{
          return "link";
        }
      });

  var node = svg.selectAll(".node")
      .data(nodes)
      .enter().append("g")
      .attr("class", "node")
      .attr("r", 5.25)
      .call(force.drag)
      .attr('data-sysName', function(d){return d.sysName});



  node.append("image")
      .attr("xlink:href", function(d){
        var value;
        if (d.push===2){
          value = 'http://cuthalion.ca/Aarra-map/img/push3.png';
        }else if (d.push===3){
          value = 'http://cuthalion.ca/Aarra-map/img/push3.png';
        }else if (d.push===4){
          value = 'http://cuthalion.ca/Aarra-map/img/push4.png';
        }else if (d.push===5){
          value = 'http://cuthalion.ca/Aarra-map/img/push5.png';
        }else{
          value = 'http://cuthalion.ca/Aarra-map/img/spark1.png';
        }
        return value;
      })
      .attr("x", -16)
      .attr("y", -16)
      .attr("width", 32)
      .attr("height", 32);

  node.append("image")
      .attr("xlink:href", function(d){
          //console.log(d.gbyEcon);
        var value;
        if(!d.gbyEcon){
          return;
        }else if (d.gbyEcon[0]===1&&d.gbyEcon[1]===0){
          value = 'http://cuthalion.ca/Aarra-map/img/green.svg';
        }else if (d.gbyEcon[0]===0&&d.gbyEcon[1]===1){
          value = 'http://cuthalion.ca/Aarra-map/img/brown.svg';
        }else if (d.gbyEcon[0]===1&&d.gbyEcon[1]===1){
          tempWidth = 24;
          value = 'http://cuthalion.ca/Aarra-map/img/greenandbrown.svg';
        }else if(d.gbyEcon[2]===1){
          value = 'http://cuthalion.ca/Aarra-map/img/yellow.svg';
        }
        return value;
      })
      .attr("x", tempWidth/2*-1)
      .attr("y", 8)
      .attr("height", 12)
      .attr("width", tempWidth);


  node.append("text")
      .text(function(d) {return d.sysName;})
      .attr("dx", function(d){return d.sysName.length* -2.5;})
      .attr("dy", function(d){
        if(!d.gbyEcon){
          return 18;
        }else{
          return 30;}});


  force.on("tick", function() {
    node.attr("cx", function(d) { d.x = Math.max(6, Math.min(width - 6, d.x)); })
        .attr("cy", function(d) { d.y = Math.max(6, Math.min(height - 6, d.y)); });
    link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
  });

    var systemName=[];
    for (var i = nodes.length - 1; i >= 0; i--) {
      systemName[i]=nodes[i].sysName;
    };
    systemName.sort();
    for (var i = systemName.length - 1; i >= 0; i--) {
      $( "#systemSelect" ).prepend( "<option>"+systemName[i]+"</option>" );
    };

  $( "#systemSelect" )
    .change(function() {
      $( "select option:selected" ).each(function() {
        var str = $( this ).text();
        console.log(str);
        d3.selectAll('.link').classed('hilightLink',false);
        d3.selectAll('[data-source=str]').classed('hilightLink',true);
        d3.selectAll('[data-target=str]').classed('hilightLink',true);
        d3.selectAll('.node').classed('hilightNode',false);
        d3.selectAll('[sysName=str]').classed('hilightLink',true);
        // $( ".link").classed('highlight', 'False');
        // $( ".link[data-source~=str]" ).classed('highlight', 'True');
        // $( ".link[data-target~=str]" ).classed('highlight', 'True');
        // $( ".node").classed('highlight', 'False');
        // $( ".node[data-sysName~=str]" ).classed('highlight', 'True');
      });
    })
    .trigger( "change" );
};
