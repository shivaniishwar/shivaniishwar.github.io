d3.csv("data/india_vs_us.csv").then(dataset => {
  const w1 = window.innerWidth/3*2;
  const h1 = w1/2;

  const svg1 = d3.select("#no1")
                 .attr("width",w1)
                 .attr("height",h1);

  const palette_i = d3.scaleOrdinal()
                      .domain(["a","b","c"])
                      .range(["#0a8901","#ff9a30","#aaaaaa"]);

  const palette_u = d3.scaleOrdinal()
                      .domain(["a","b","c"])
                      .range(["#F2C57C","#80CED7","#aaaaaa"]);

  const palette1 = d3.scaleOrdinal()
                     .domain(["a","b"])
                     .range(["#0a8901","#F2C57C"]);

  const scale1 = d3.scaleLinear()
                   .domain([100000000,2000000000])
                   .range([h1/8,h1/8*3]);

  const li = dataset[0]["Land"]
  const lus = dataset[1]["Land"]
  const countries = ["U.S.","India"]

  const tt1 = d3.select("#tt1");

  var pie = d3.pie();
  var land = [li,lus]
  const lArcs = pie(land);

  const fi = dataset[0]["Farmers_Percent"]
  const ai = dataset[0]["Agri_Percent"]
  const oi = dataset[0]["Other_Percent"]
  const label_i = [" of Indians work in agriculture"," of Indians don't work in agriculture"," of Indians are farmers"]

  var a_india = [fi,ai,oi]
  const iArcs = pie(a_india);

  svg1.append("g")
      .attr("transform","translate(" + w1/6 + "," + h1/2 + ")")
      .selectAll("pie1")
      .data(iArcs)
      .enter()
      .append("path")
      .attr("d",d3.arc()
                  .innerRadius(0)
                  .outerRadius(scale1(dataset[0]["Population"])))
      .attr("class","pie1")
      .attr("fill",(d,i) => palette_i(i))
      .on("mouseover", (event, d) => {
        tt1.transition()
           .style("opacity",1)
           .style("left", (event.pageX)+10 + "px")
           .style("top", (event.pageY)+10 + "px")
           .text(d3.format(".0%")(d.data) + label_i[d.index])
      })
      .on("mousemove", (event, d) => {
        tt1.style("left", (event.pageX)+10 + "px")
           .style("top", (event.pageY)+10 + "px")
      })
      .on("mouseout", (event, d) => {
        tt1.transition()
           .style("opacity",0)
      });

  const fu = dataset[1]["Farmers_Percent"]
  const au = dataset[1]["Agri_Percent"]
  const ou = dataset[1]["Other_Percent"]
  const label_u = [" of Americans don't work in agriculture"," of Americans work in agriculture"," of Americans are farmers"]

  var a_us = [fu,au,ou]
  const uArcs = pie(a_us);

  svg1.append("g")
      .attr("transform","translate(" + w1/2 + "," + h1/2 + ")")
      .selectAll("pie2")
      .data(uArcs)
      .enter()
      .append("path")
      .attr("d",d3.arc()
                  .innerRadius(0)
                  .outerRadius(scale1(dataset[1]["Population"])))
      .attr("class","pie1")
      .attr("fill",(d,i) => palette_u(i))
      .on("mouseover", (event, d) => {
        tt1.transition()
           .style("opacity",1)
           .style("left", (event.pageX)+10 + "px")
           .style("top", (event.pageY)+10 + "px")
           .text(d3.format(".0%")(d.data) + label_u[d.index])
      })
      .on("mousemove", (event, d) => {
        tt1.style("left", (event.pageX)+10 + "px")
           .style("top", (event.pageY)+10 + "px")
      })
      .on("mouseout", (event, d) => {
        tt1.transition()
           .style("opacity",0)
      });

  svg1.append("g")
      .attr("transform","translate(" + w1/6*5 + "," + h1/2 + ")")
      .selectAll("pie3")
      .data(lArcs)
      .enter()
      .append("path")
      .attr("d",d3.arc()
                  .innerRadius(0)
                  .outerRadius(100))
      .attr("class","pie1")
      .attr("fill",(d,i) => palette1(i))
      .on("mouseover", (event, d) => {
        tt1.transition()
           .style("opacity",1)
           .style("left", (event.pageX)+10 + "px")
           .style("top", (event.pageY)+10 + "px")
           .text("average farm size in " + countries[d.index] + ": " + d.data + " hectares")
      })
      .on("mousemove", (event, d) => {
        tt1.style("left", (event.pageX)+10 + "px")
           .style("top", (event.pageY)+10 + "px")
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
      .attr("transform","translate(" + w1/6*5 + "," + h1/8*7 + ")")
      .attr("text-anchor", "middle")
      .attr("class","cstitle")
      .text("average farm size");

  svg1.append("text")
      .attr("transform","translate(" + w1/6 + "," + h1/8*7 + ")")
      .attr("text-anchor", "middle")
      .attr("class","cstitle")
      .text("indian agriculture by population");

  svg1.append("text")
      .attr("transform","translate(" + w1/2 + "," + h1/8*7 + ")")
      .attr("text-anchor", "middle")
      .attr("class","cstitle")
      .text("U.S. agriculture by population");
});

d3.csv("data/protest_count.csv").then(dataset => {
  const w2 = window.innerWidth/4*3;
  const h2 = w2/2;
  const m = 50;

  const svg2 = d3.select("#no2")
                 .attr("width",w2)
                 .attr("height",h2);

  const color = "#0a8901"
  var parseTime = d3.timeParse("%d %B %Y")

  svg2.append("text")
      .attr("transform","translate(" + w2/2 + "," + (m-10) + ")")
      .attr("text-anchor","middle")
      .attr("class","ctitle")
      .text("protests related to the farmers' movement");

  const scaleX = d3.scaleLinear()
                   .domain([parseTime("8 August 2020"),parseTime("13 February 2021")])
                   .range([m,w2-m]);
  const scaleY = d3.scaleLinear()
                   .domain([0,260])
                   .range([h2-m,m]);
  const scaleR = d3.scaleLinear()
                   .domain([0,300])
                   .range([1.5,6]);
  const bottomAxis = d3.axisBottom().scale(scaleX);
  const leftAxis = d3.axisLeft().scale(scaleY);

  svg2.append("g")
      .attr("transform", "translate(0," + (h2-m) + ")")
      .call(bottomAxis);
  svg2.append("g")
      .attr("transform", "translate(" + m + ",0)")
      .call(leftAxis);

  const tt2 = d3.select("#tt2");
  const b1 = d3.select("#b1");
  const b2 = d3.select("#b2");
  const b3 = d3.select("#b3");

  var line1 = "M" + scaleX(parseTime(dataset[0]["Date"])) + "," + scaleY(dataset[0]["Events"])

  for (i = 0; i < dataset.length; i++) {
    add = " L" + scaleX(parseTime(dataset[i]["Date"])) + "," + scaleY(dataset[i]["Events"])
    line1 += add;
  };

  const v1 = "M" + scaleX(parseTime("25 September 2020")) + "," + scaleY(260) + " L" + scaleX(parseTime("25 September 2020")) + "," + scaleY(0)
  const v2 = "M" + scaleX(parseTime("8 December 2020")) + "," + scaleY(260) + " L" + scaleX(parseTime("8 December 2020")) + "," + scaleY(0)
  const v3 = "M" + scaleX(parseTime("6 February 2021")) + "," + scaleY(260) + " L" + scaleX(parseTime("6 February 2021")) + "," + scaleY(0)

  svg2.append("g")
      .append("path")
      .attr("d",v1)
      .attr("class","vert")
      .on("mouseover", (event, d) => {
        b1.transition()
          .style("opacity",1)
          .style("left", (event.pageX)+10 + "px")
          .style("top", (event.pageY)+10 + "px")
      })
      .on("mousemove", (event, d) => {
        b1.style("left", (event.pageX)+10 + "px")
           .style("top", (event.pageY)+10 + "px")
      })
      .on("mouseout", (event, d) => {
        b1.transition()
           .style("opacity",0)
      });

  svg2.append("g")
      .append("path")
      .attr("d",v2)
      .attr("class","vert")
      .on("mouseover", (event, d) => {
        b2.transition()
          .style("opacity",1)
          .style("left", (event.pageX)+10 + "px")
          .style("top", (event.pageY)+10 + "px")
      })
      .on("mousemove", (event, d) => {
        b2.style("left", (event.pageX)+10 + "px")
           .style("top", (event.pageY)+10 + "px")
      })
      .on("mouseout", (event, d) => {
        b2.transition()
           .style("opacity",0)
      });

  svg2.append("g")
      .append("path")
      .attr("d",v3)
      .attr("class","vert")
      .on("mouseover", (event, d) => {
        b3.transition()
          .style("opacity",1)
          .style("left", (event.pageX)+10 + "px")
          .style("top", (event.pageY)+10 + "px")
      })
      .on("mousemove", (event, d) => {
        b3.style("left", (event.pageX)+10 + "px")
           .style("top", (event.pageY)+10 + "px")
      })
      .on("mouseout", (event, d) => {
        b3.transition()
           .style("opacity",0)
      });

  svg2.append("g")
      .append("path")
      .attr("d",line1)
      .style("fill","none")
      .style("stroke","black");

  svg2.append("g")
      .selectAll("circle")
      .data(dataset)
      .enter()
      .append("circle")
      .attr("cx",d => scaleX(parseTime(d.Date)))
      .attr("cy",d => scaleY(d.Events))
      .attr("r",d => scaleR(d.Events))
      .attr("fill",color)
      .attr("class","point1")
      .on("mouseover", (event, d) => {
        tt2.transition()
           .style("opacity",1)
           .style("left", (event.pageX)+10 + "px")
           .style("top", (event.pageY)+10 + "px")
           .text(d.Date + ": " + d.Events + " protests")
      })
      .on("mousemove", (event, d) => {
        tt2.style("left", (event.pageX)+10 + "px")
           .style("top", (event.pageY)+10 + "px")
      })
      .on("mouseout", (event, d) => {
        tt2.transition()
           .style("opacity",0)
      });
});

d3.csv("data/protest_violence.csv").then(dataset => {
  const w3 = window.innerWidth/3;
  const h3 = w3;
  const m = 50;

  const svg3 = d3.select("#no3")
                 .attr("width",w3)
                 .attr("height",h3);

  const tt3 = d3.select("#tt3")

  var pie = d3.pie();
  const data = [dataset[0]["Events"],dataset[1]["Events"],dataset[2]["Events"],dataset[3]["Events"]]
  const vLabels = [dataset[0]["Type"],dataset[1]["Type"],dataset[2]["Type"],dataset[3]["Type"]]
  var vArcs = pie(data);

  var vPalette = d3.scaleOrdinal()
                   .domain(["a","b","c","d"])
                   .range(["#0a8901","#ff9a30","#000089","#aaaaaa"])

  svg3.append("g")
      .attr("transform","translate(" + w3/2 + "," + h3/2 + ")")
      .selectAll("donut")
      .data(vArcs)
      .enter()
      .append("path")
      .attr("d",d3.arc()
                  .innerRadius(w3/6)
                  .outerRadius(w3/3))
      .attr("class","donut")
      .attr("fill",(d,i) => vPalette(i))
      .on("mouseover", (event, d) => {
        tt3.transition()
           .style("opacity",1)
           .style("left", (event.pageX)+10 + "px")
           .style("top", (event.pageY)+10 + "px")
           .text(vLabels[d.index] + ": " + d3.format(",")(d.data))
      })
      .on("mousemove", (event, d) => {
        tt3.style("left", (event.pageX)+10 + "px")
           .style("top", (event.pageY)+10 + "px")
      })
      .on("mouseout", (event, d) => {
        tt3.transition()
           .style("opacity",0)
      });

  svg3.append("circle")
      .attr("cx",w3/2)
      .attr("cy",h3/2)
      .attr("r",10)
      .attr("fill","red")
      .attr("class","dot")
      .on("mouseover", (event, d) => {
        d3.select(".dot").attr("fill-opacity","0.7")
        tt3.transition()
           .style("opacity",1)
           .style("left", (event.pageX)+10 + "px")
           .style("top", (event.pageY)+10 + "px")
           .text(vLabels[3] + ": 1")
      })
      .on("mousemove", (event, d) => {
        tt3.style("left", (event.pageX)+10 + "px")
           .style("top", (event.pageY)+10 + "px")
      })
      .on("mouseout", (event, d) => {
        d3.select(".dot").attr("fill-opacity","1")
        tt3.transition()
           .style("opacity",0)
      });

  svg3.append("text")
      .attr("transform","translate(" + w3/2 + "," + m + ")")
      .attr("text-anchor","middle")
      .attr("class","ctitle")
      .text("protest violence in the farmers' movement");
});

d3.csv("data/main_tweets.csv").then(dataset => {
  const w4 = window.innerWidth/4*3;
  const h4 = w4/2;
  const m = 50;

  const svg4 = d3.select("#no4")
                 .attr("width",w4)
                 .attr("height",h4);

  const palette = ["#0a8901","#ff9a30"]
  var parseTime = d3.timeParse("%d %B %Y")

  svg4.append("text")
      .attr("transform","translate(" + w4/2 + "," + (m-10) + ")")
      .attr("text-anchor","middle")
      .attr("class","ctitle")
      .text("tweets about the farmers' protests");

  const scaleX = d3.scaleLinear()
                   .domain([parseTime("8 August 2020"),parseTime("13 February 2021")])
                   .range([m,w4-m]);
  const scaleY = d3.scaleLinear()
                   .domain([0,62000])
                   .range([h4-m,m]);
  const bottomAxis = d3.axisBottom().scale(scaleX);
  const leftAxis = d3.axisLeft().scale(scaleY);

  svg4.append("g")
      .attr("transform", "translate(0," + (h4-m) + ")")
      .call(bottomAxis);
  svg4.append("g")
      .attr("transform", "translate(" + m + ",0)")
      .call(leftAxis);

  const b4 = d3.select("#b4");

  var line1 = "M" + scaleX(parseTime(dataset[0]["Date"])) + "," + scaleY(dataset[0]["BB"])
  var line2 = "M" + scaleX(parseTime(dataset[0]["Date"])) + "," + scaleY(dataset[0]["FP"])

  for (i = 0; i < dataset.length; i++) {
    add1 = " L" + scaleX(parseTime(dataset[i]["Date"])) + "," + scaleY(dataset[i]["BB"])
    line1 += add1;
    add2 = " L" + scaleX(parseTime(dataset[i]["Date"])) + "," + scaleY(dataset[i]["FP"])
    line2 += add2;
  };

  const c1 = "M" + scaleX(parseTime("2 February 2021")) + "," + scaleY(62000) + " L" + scaleX(parseTime("2 February 2021")) + "," + scaleY(0);

  svg4.append("g")
      .append("path")
      .attr("d",c1)
      .attr("class","vert")
      .on("mouseover", (event, d) => {
        b4.transition()
          .style("opacity",1)
          .style("left", (event.pageX)+10 + "px")
          .style("top", (event.pageY)+10 + "px")
      })
      .on("mousemove", (event, d) => {
        b4.style("left", (event.pageX)+10 + "px")
           .style("top", (event.pageY)+10 + "px")
      })
      .on("mouseout", (event, d) => {
        b4.transition()
           .style("opacity",0)
      });
  svg4.append("g")
      .append("path")
      .attr("d",line1)
      .style("fill","none")
      .style("stroke-width","2px")
      .style("stroke",palette[0]);
  svg4.append("g")
      .append("path")
      .attr("d",line2)
      .style("fill","none")
      .style("stroke-width","2px")
      .style("stroke",palette[1]);
});
