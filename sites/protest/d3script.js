d3.csv("data/india_vs_us.csv").then(dataset => {
  const w1 = 800;
  const h1 = 400;
  const margin = 10;

  const svg1 = d3.select("#no1")
                 .attr("width",w1)
                 .attr("height",h1)

  const palette1 = d3.scaleOrdinal()
                     .domain(["a","b"])
                     .range(["#ff9a30","#b22f34"]);

  const fi = dataset[0]["Farmers"]
  const fus = dataset[1]["Farmers"]
  const li = dataset[0]["Land"]
  const lus = dataset[1]["Land"]
  const countries = ["India","U.S."]
  const countries2 = ["U.S.","India"]

  const tt1 = d3.select("#tt1")

  var pie = d3.pie();
  var farmers = [fi,fus]
  var land = [li,lus]
  const fArcs = pie(farmers);
  const lArcs = pie(land);

  svg1.append("g")
      .attr("transform","translate(" + w1/4 + "," + h1/2 + ")")
      .selectAll("pie")
      .data(fArcs)
      .enter()
      .append("path")
      .attr("d",d3.arc()
                  .innerRadius(0)
                  .outerRadius(100))
      .attr("class","pie1")
      .attr("fill",(d,i) => palette1(i))
      .attr("stroke","white")
      .style("stroke-width", "2px")
      .on("mouseover", (event, d) => {
        tt1.transition()
           .style("opacity",1)
           .style("left", (event.pageX) + "px")
           .style("top", (event.pageY) + "px")
           .text(d3.format(",")(d.data) + " farmers in " + countries[d.index])
      })
      .on("mousemove", (event, d) => {
        tt1.style("left", (event.pageX) + "px")
           .style("top", (event.pageY) + "px")
      })
      .on("mouseout", (event, d) => {
        tt1.transition()
           .style("opacity",0)
      });

  svg1.append("g")
      .attr("transform","translate(" + w1/4*3 + "," + h1/2 + ")")
      .selectAll("pie2")
      .data(lArcs)
      .enter()
      .append("path")
      .attr("d",d3.arc()
                  .innerRadius(0)
                  .outerRadius(100))
      .attr("class","pie1")
      .attr("fill",(d,i) => palette1(i))
      .attr("stroke","white")
      .style("stroke-width", "2px")
      .on("mouseover", (event, d) => {
        tt1.transition()
           .style("opacity",1)
           .style("left", (event.pageX) + "px")
           .style("top", (event.pageY) + "px")
           .text("average farm size in " + countries2[d.index] + ": " + d.data + " hectares")
      })
      .on("mousemove", (event, d) => {
        tt1.style("left", (event.pageX) + "px")
           .style("top", (event.pageY) + "px")
      })
      .on("mouseout", (event, d) => {
        tt1.transition()
           .style("opacity",0)
      });

  svg1.append("text")
      .attr("transform","translate(" + w1/2 + "," + h1/8 + ")")
      .attr("text-anchor", "middle")
      .attr("class","ctitle")
      .text("agriculture in india vs. the united states");

  svg1.append("text")
      .attr("transform","translate(" + w1/4 + "," + h1/8*7 + ")")
      .attr("text-anchor", "middle")
      .attr("class","cstitle")
      .text("number of farmers");

  svg1.append("text")
      .attr("transform","translate(" + w1/4*3 + "," + h1/8*7 + ")")
      .attr("text-anchor", "middle")
      .attr("class","cstitle")
      .text("average farm size");

});
