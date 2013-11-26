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
var init=function(){
  var width = window.screen.width,
    height = window.screen.height;

  var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

  var force = d3.layout.force()
    .gravity(0.05)
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
      .attr("class", function(d){
        if (d.priority===0){
          return "jumpGate";
        }else if(d.priority===6){
          return "linkValue6";
        }else if(d.priority===7){
          return "linkValue7";
        }else if(d.priority>=8){
          return "linkValue8";
        }else{
          return "link";
        }
      });

  var node = svg.selectAll(".node")
      .data(nodes)
      .enter().append("g")
      .attr("class", "node")
      .attr("r", 5.25)
      .call(force.drag);



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
      .attr("stroke","white")
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
};
