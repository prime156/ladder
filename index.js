//

var width = 640;
var height = 960;
var label = 120;

var svg = d3.select('svg').attr('width', width).attr('height', height);

var g = svg.append('g').attr('transform', 'translate(' + label + ',0)');

var cluster = d3.cluster().size([height, width - label * 2]);

var stratify = d3.stratify()
   .id(function(d) {
      return d.host;
   })
   .parentId(function(d) {
      return d.parent;
   });

d3.json('data.json', function(error, data) {

   var root = stratify(data)
      .sort(function(a, b) {
         return (a.height - b.height) || a.id.localeCompare(b.id);
      });

   cluster(root);

   root.each(function(d) {
      console.log(d);
   })



   var link0 = g.selectAll(".link-0")
      .data(root.descendants().slice(1))
      .enter()
      .append("path")
      .attr("class", "link link-0")
      .attr("d", function(d) {
         return "M" + d.y + "," + d.x +
            "C" + (d.parent.y + 100) + "," + d.x +
            " " + (d.parent.y + 100) + "," + d.parent.x +
            " " + d.parent.y + "," + d.parent.x;
      })

   var link1 = g.selectAll(".link-1")
      .data(root.descendants().slice(1))
      .enter()
      .append("path")
      .attr("class", "link link-1")
      .attr("d", function(d) {
         var pdx = dx = 6;
         var pdy = dy = 3;

         console.log(d.partner);

         if (d.data.partner === undefined) {
            dx = dy = 0;
         }

         return "M" + (d.y + dy) + "," + (d.x + dx) +
            "C" + (d.parent.y + 100 + pdy) + "," + (d.x + dx) +
            " " + (d.parent.y + 100 + pdy) + "," + (d.parent.x + pdx) +
            " " + (d.parent.y + pdy) + "," + (d.parent.x + pdx);
      });

   var node = g.selectAll(".node")
      .data(root.descendants())
      .enter().append("g")
      .attr("class", function(d) {
         return "node" + (d.children ? " node--internal" : " node--leaf");
      })
      .attr("transform", function(d) {
         return "translate(" + d.y + "," + d.x + ")";
      })

   node.append("circle")
      .attr("r", 2.5);

   node.append("text")
      .attr("dy", 3)
      .attr("x", function(d) {
         return d.children ? -8 : 8;
      })
      .style("text-anchor", function(d) {
         return d.children ? "end" : "start";
      })
      .text(function(d) {
         return d.id.substring(d.id.lastIndexOf(".") + 1);
      });
});
