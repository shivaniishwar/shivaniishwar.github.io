const i1 = "#7C9D53";
const i2 = "#D16014";
const i3 = "#2E5266";
const i4 = "#6C0E23";
const y = "#D4CB68";
const o = "#6C0E23";
const n1 = "#aaaaaa";
const n2 = "#dddddd";

d3.csv("data/india_vs_us.csv").then(dataset => {
  const w1 = window.innerWidth/3*2;
  const h1 = w1/2;
  const m = w1/40;

  const svg1 = d3.select("#no1")
                 .attr("width",w1)
                 .attr("height",h1);

  const palette1 = d3.scaleOrdinal()
                      .domain(["a","b","c"])
                      .range([i1,i2,n1]);
  const scaleX = d3.scaleLinear()
                   .domain([0,1])
                   .range([m, w1/2-(2*m)]);
  const scaleY = d3.scaleBand()
                   .domain(d3.range(dataset.length))
                   .range([(3*m), h1-m]);

  const tt1 = d3.select("#tt1");

  const stack = d3.stack()
                  .keys(["Farmers_Percent","Agri_Percent","Other_Percent"]);
  const series = stack(dataset);

  const grp = svg1.selectAll()
                  .data(series)
                  .enter()
                  .append("g")
                  .style("fill", (d,i) => palette1(i));

  const label = {0.08695624543: " are farmers",0.493: " work in agriculture",0.41999999999999993: " do not work in agriculture", 0.007854921984: " are farmers",0.010271821059999998: " work in agriculture",0.9818732570000002: " do not work in agriculture"}

  grp.selectAll("rect")
     .data(d => d)
     .enter()
     .append("rect")
     .attr("class","bar")
     .attr("x",d => scaleX(d[0]))
     .attr("y",(d,i) => scaleY(i))
     .attr("width",d => scaleX(d[1])-scaleX(d[0]))
     .attr("height",scaleY.bandwidth()-(2*m))
     .on("mouseover", (event, d) => {
       tt1.transition()
          .style("opacity",1)
          .style("left", (event.pageX)+10 + "px")
          .style("top", (event.pageY)+10 + "px")
          .text(d3.format(".0%")(d[1]-d[0]) + " of people in " + d["data"]["Country"] + label[(d[1]-d[0])])
     })
     .on("mousemove", (event, d) => {
       tt1.style("left", (event.pageX)+10 + "px")
          .style("top", (event.pageY)+10 + "px")
     })
     .on("mouseout", (event, d) => {
       tt1.transition()
          .style("opacity",0)
     });

  svg1.append("image")
      .attr("x",w1/2-m)
      .attr("y",scaleY(0)+m)
      .attr("width",90)
      .attr("height",60)
      .attr("href","img/in.png");
  svg1.append("image")
      .attr("x",w1/2-m)
      .attr("y",scaleY(1)+m)
      .attr("width",90)
      .attr("height",60)
      .attr("href","img/us.png");

  svg1.append("circle")
      .attr("cx",w1/5*3)
      .attr("cy",scaleY(0))
      .attr("r",5)
      .attr("fill",i3)
      .attr("style","opacity: 75%;");
  svg1.append("text")
      .attr("x",w1/5*3 + 10)
      .attr("y",scaleY(0) + 4)
      .attr("class","cstitle")
      .attr("text-anchor","left")
      .text("= 1 hectare")

  for (i = 0; i < 2; i++) {
    svg1.append("circle")
        .attr("cx",w1/5*3 + (15*i))
        .attr("cy",scaleY(0) + h1/8)
        .attr("r",5)
        .attr("fill",i3)
        .attr("style","opacity: 75%;")
        .on("mouseover", (event, d) => {
          tt1.transition()
             .style("opacity",1)
             .style("left", (event.pageX)+10 + "px")
             .style("top", (event.pageY)+10 + "px")
             .text("Indian farms average 2.3 hectares")
        })
        .on("mousemove", (event, d) => {
          tt1.style("left", (event.pageX)+10 + "px")
             .style("top", (event.pageY)+10 + "px")
        })
        .on("mouseout", (event, d) => {
          tt1.transition()
             .style("opacity",0)
        });
  }

  const row = 22
  for (i = 0; i < dataset[1]["Land"]; i++) {
    svg1.append("circle")
        .attr("cx",w1/5*3 + (15*(i%row)))
        .attr("cy",scaleY(1) - h1/16 + (15*Math.floor(i/row)))
        .attr("r",5)
        .attr("fill",i3)
        .attr("style","opacity: 75%;")
        .on("mouseover", (event, d) => {
          tt1.transition()
             .style("opacity",1)
             .style("left", (event.pageX)+10 + "px")
             .style("top", (event.pageY)+10 + "px")
             .text("American farms average 250 hectares")
        })
        .on("mousemove", (event, d) => {
          tt1.style("left", (event.pageX)+10 + "px")
             .style("top", (event.pageY)+10 + "px")
        })
        .on("mouseout", (event, d) => {
          tt1.transition()
             .style("opacity",0)
        });
  }

  svg1.append("rect")
      .attr("x",m)
      .attr("y",(2*m))
      .attr("height",h1-(4*m))
      .attr("width",1);

  svg1.append("text")
      .attr("class","ctitle")
      .attr("x",(w1/2))
      .attr("y",(1.5*m))
      .attr("text-anchor","middle")
      .text("an agricultural economy built on small farms")
});

d3.csv("data/protest_count.csv").then(dataset => {
  const w2 = window.innerWidth/4*3;
  const h2 = w2/2;
  const m = 50;

  const svg2 = d3.select("#no2")
                 .attr("width",w2)
                 .attr("height",h2);

  const color = i1
  var parseTime = d3.timeParse("%d %B %Y")

  svg2.append("text")
      .attr("transform","translate(" + w2/2 + "," + (m-10) + ")")
      .attr("text-anchor","middle")
      .attr("class","ctitle")
      .text("a timeline of the farmers' movement");

  const scaleX = d3.scaleLinear()
                   .domain([parseTime("8 August 2020"),parseTime("1 May 2021")])
                   .range([m,w2-m]);
  const scaleY = d3.scaleLinear()
                   .domain([0,260])
                   .range([h2-m,m]);
  const scaleR = d3.scaleLinear()
                   .domain([0,300])
                   .range([1.5,6]);

  const tt2 = d3.select("#tt2");
  const b1 = d3.select("#b1");
  const b2 = d3.select("#b2");
  const b3 = d3.select("#b3");
  const b4 = d3.select("#bn");

  var line1 = "M" + scaleX(parseTime(dataset[0]["Date"])) + "," + scaleY(dataset[0]["Events"])

  for (i = 0; i < dataset.length; i++) {
    add = " L" + scaleX(parseTime(dataset[i]["Date"])) + "," + scaleY(dataset[i]["Events"])
    line1 += add;
  };

  const v1 = "M" + scaleX(parseTime("25 September 2020")) + "," + scaleY(260) + " L" + scaleX(parseTime("25 September 2020")) + "," + scaleY(0)
  const v2 = "M" + scaleX(parseTime("8 December 2020")) + "," + scaleY(260) + " L" + scaleX(parseTime("8 December 2020")) + "," + scaleY(0)
  const v3 = "M" + scaleX(parseTime("6 February 2021")) + "," + scaleY(260) + " L" + scaleX(parseTime("6 February 2021")) + "," + scaleY(0)
  const v4 = "M" + scaleX(parseTime("26 March 2021")) + "," + scaleY(260) + " L" + scaleX(parseTime("26 March 2021")) + "," + scaleY(0)

  svg2.append("rect")
      .attr("x",scaleX(parseTime("8 August 2020")))
      .attr("y",h2-m)
      .attr("width",scaleX(parseTime("1 September 2020")) - scaleX(parseTime("8 August 2020")))
      .attr("height",15)
      .attr("fill",n1);
  svg2.append("rect")
      .attr("x",scaleX(parseTime("1 September 2020")))
      .attr("y",h2-m)
      .attr("width",scaleX(parseTime("1 October 2020")) - scaleX(parseTime("1 September 2020")))
      .attr("height",15)
      .attr("fill",n2);
  svg2.append("rect")
      .attr("x",scaleX(parseTime("1 October 2020")))
      .attr("y",h2-m)
      .attr("width",scaleX(parseTime("1 November 2020")) - scaleX(parseTime("1 October 2020")))
      .attr("height",15)
      .attr("fill",n1);
  svg2.append("rect")
      .attr("x",scaleX(parseTime("1 November 2020")))
      .attr("y",h2-m)
      .attr("width",scaleX(parseTime("1 December 2020")) - scaleX(parseTime("1 November 2020")))
      .attr("height",15)
      .attr("fill",n2);
  svg2.append("rect")
      .attr("x",scaleX(parseTime("1 December 2020")))
      .attr("y",h2-m)
      .attr("width",scaleX(parseTime("1 January 2021")) - scaleX(parseTime("1 December 2020")))
      .attr("height",15)
      .attr("fill",n1);
  svg2.append("rect")
      .attr("x",scaleX(parseTime("1 January 2021")))
      .attr("y",h2-m)
      .attr("width",scaleX(parseTime("1 February 2021")) - scaleX(parseTime("1 January 2021")))
      .attr("height",15)
      .attr("fill",n2);
  svg2.append("rect")
      .attr("x",scaleX(parseTime("1 February 2021")))
      .attr("y",h2-m)
      .attr("width",scaleX(parseTime("1 March 2021")) - scaleX(parseTime("1 February 2021")))
      .attr("height",15)
      .attr("fill",n1);
  svg2.append("rect")
      .attr("x",scaleX(parseTime("1 March 2021")))
      .attr("y",h2-m)
      .attr("width",scaleX(parseTime("1 April 2021")) - scaleX(parseTime("1 March 2021")))
      .attr("height",15)
      .attr("fill",n2);
  svg2.append("rect")
      .attr("x",scaleX(parseTime("1 April 2021")))
      .attr("y",h2-m)
      .attr("width",scaleX(parseTime("1 May 2021")) - scaleX(parseTime("1 April 2021")))
      .attr("height",15)
      .attr("fill",n1);

  svg2.append("rect")
      .attr("x",m)
      .attr("y",h2-m)
      .attr("width",w2-(2*m))
      .attr("height",1);

  svg2.append("text")
      .attr("x",scaleX(parseTime("20 August 2020")))
      .attr("y",h2-m+12)
      .attr("text-anchor","middle")
      .attr("class","cstitle")
      .text("August");
  svg2.append("text")
      .attr("x",scaleX(parseTime("16 September 2020")))
      .attr("y",h2-m+12)
      .attr("text-anchor","middle")
      .attr("class","cstitle")
      .text("September");
  svg2.append("text")
      .attr("x",scaleX(parseTime("16 October 2020")))
      .attr("y",h2-m+12)
      .attr("text-anchor","middle")
      .attr("class","cstitle")
      .text("October");
  svg2.append("text")
      .attr("x",scaleX(parseTime("16 November 2020")))
      .attr("y",h2-m+12)
      .attr("text-anchor","middle")
      .attr("class","cstitle")
      .text("November");
  svg2.append("text")
      .attr("x",scaleX(parseTime("17 December 2020")))
      .attr("y",h2-m+12)
      .attr("text-anchor","middle")
      .attr("class","cstitle")
      .text("December");
  svg2.append("text")
      .attr("x",scaleX(parseTime("17 January 2021")))
      .attr("y",h2-m+12)
      .attr("text-anchor","middle")
      .attr("class","cstitle")
      .text("January");
  svg2.append("text")
      .attr("x",scaleX(parseTime("15 February 2021")))
      .attr("y",h2-m+12)
      .attr("text-anchor","middle")
      .attr("class","cstitle")
      .text("February");
  svg2.append("text")
      .attr("x",scaleX(parseTime("17 March 2021")))
      .attr("y",h2-m+12)
      .attr("text-anchor","middle")
      .attr("class","cstitle")
      .text("March");
  svg2.append("text")
      .attr("x",scaleX(parseTime("16 April 2021")))
      .attr("y",h2-m+12)
      .attr("text-anchor","middle")
      .attr("class","cstitle")
      .text("April");

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
      .attr("d",v4)
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
  const h3 = w3*0.8;
  const m = 25;

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
                   .range([i1,i2,i3,i4])

  svg3.append("g")
      .attr("transform","translate(" + w3/2 + "," + (h3/2+m) + ")")
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
      .attr("cy",(h3/2+m))
      .attr("r",10)
      .attr("fill",i4)
      .attr("class","donut")
      .on("mouseover", (event, d) => {
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
      .text("what counts as excessive force?");
});

d3.csv("data/main_tweets.csv").then(dataset => {
  const w4 = window.innerWidth/4*3;
  const h4 = w4/2;
  const m = 50;

  const svg4 = d3.select("#no4")
                 .attr("width",w4)
                 .attr("height",h4);

  const palette = [i1,i2]
  var parseTime = d3.timeParse("%d %B %Y")

  svg4.append("text")
      .attr("transform","translate(" + w4/2 + "," + (m-10) + ")")
      .attr("text-anchor","middle")
      .attr("class","ctitle")
      .text("meanwhile on twitter...");

  const scaleX = d3.scaleLinear()
                   .domain([parseTime("8 August 2020"),parseTime("1 May 2021")])
                   .range([m,w4-m]);
  const scaleY = d3.scaleLinear()
                   .domain([0,62000])
                   .range([h4-m,m]);

  const t1 = d3.select("#t1");
  const t2 = d3.select("#t2");
  const t3 = d3.select("#t3");
  const t4 = d3.select("#t4");

  var line1 = "M" + scaleX(parseTime(dataset[0]["Date"])) + "," + scaleY(dataset[0]["BB"])
  var line2 = "M" + scaleX(parseTime(dataset[0]["Date"])) + "," + scaleY(dataset[0]["FP"])

  for (i = 0; i < dataset.length; i++) {
    add1 = " L" + scaleX(parseTime(dataset[i]["Date"])) + "," + scaleY(dataset[i]["BB"])
    line1 += add1;
    add2 = " L" + scaleX(parseTime(dataset[i]["Date"])) + "," + scaleY(dataset[i]["FP"])
    line2 += add2;
  };

  const c1 = "M" + scaleX(parseTime("25 September 2020")) + "," + scaleY(62000) + " L" + scaleX(parseTime("25 September 2020")) + "," + scaleY(0);
  const c2 = "M" + scaleX(parseTime("8 December 2020")) + "," + scaleY(62000) + " L" + scaleX(parseTime("8 December 2020")) + "," + scaleY(0);
  const c3 = "M" + scaleX(parseTime("2 February 2021")) + "," + scaleY(62000) + " L" + scaleX(parseTime("2 February 2021")) + "," + scaleY(0);
  const c4 = "M" + scaleX(parseTime("26 March 2021")) + "," + scaleY(62000) + " L" + scaleX(parseTime("26 March 2021")) + "," + scaleY(0);

  svg4.append("g")
      .append("path")
      .attr("d",c1)
      .attr("class","vert")
      .on("mouseover", (event, d) => {
        t1.transition()
          .style("opacity",1)
          .style("left", (event.pageX)+10 + "px")
          .style("top", (event.pageY)+10 + "px")
      })
      .on("mousemove", (event, d) => {
        t1.style("left", (event.pageX)+10 + "px")
           .style("top", (event.pageY)+10 + "px")
      })
      .on("mouseout", (event, d) => {
        t1.transition()
          .style("opacity",0)
        t1.style("left", "-1000px")
          .style("top", "-1000px")
      });
  svg4.append("g")
      .append("path")
      .attr("d",c2)
      .attr("class","vert")
      .on("mouseover", (event, d) => {
        t2.transition()
          .style("opacity",1)
          .style("left", (event.pageX)+10 + "px")
          .style("top", (event.pageY)+10 + "px")
      })
      .on("mousemove", (event, d) => {
        t2.style("left", (event.pageX)+10 + "px")
           .style("top", (event.pageY)+10 + "px")
      })
      .on("mouseout", (event, d) => {
        t2.transition()
          .style("opacity",0)
        t2.style("left", "-1000px")
          .style("top", "-1000px")
      });
  svg4.append("g")
      .append("path")
      .attr("d",c3)
      .attr("class","vert")
      .on("mouseover", (event, d) => {
        t3.transition()
          .style("opacity",1)
          .style("left", (event.pageX)+10 + "px")
          .style("top", (event.pageY)+10 + "px")
      })
      .on("mousemove", (event, d) => {
        t3.style("left", (event.pageX)+10 + "px")
           .style("top", (event.pageY)+10 + "px")
      })
      .on("mouseout", (event, d) => {
        t3.transition()
          .style("opacity",0)
        t3.style("left", "-1000px")
          .style("top", "-1000px")
      });
  svg4.append("g")
      .append("path")
      .attr("d",c4)
      .attr("class","vert")
      .on("mouseover", (event, d) => {
        t4.transition()
          .style("opacity",1)
          .style("left", (event.pageX)+10 + "px")
          .style("top", (event.pageY)+10 + "px")
      })
      .on("mousemove", (event, d) => {
        t4.style("left", (event.pageX)+10 + "px")
           .style("top", (event.pageY)+10 + "px")
      })
      .on("mouseout", (event, d) => {
        t4.transition()
          .style("opacity",0)
        t4.style("left", "-1000px")
          .style("top", "-1000px")
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

  svg4.append("rect")
      .attr("x",scaleX(parseTime("8 August 2020")))
      .attr("y",h4-m)
      .attr("width",scaleX(parseTime("1 September 2020")) - scaleX(parseTime("8 August 2020")))
      .attr("height",15)
      .attr("fill",n1);
  svg4.append("rect")
      .attr("x",scaleX(parseTime("1 September 2020")))
      .attr("y",h4-m)
      .attr("width",scaleX(parseTime("1 October 2020")) - scaleX(parseTime("1 September 2020")))
      .attr("height",15)
      .attr("fill",n2);
  svg4.append("rect")
      .attr("x",scaleX(parseTime("1 October 2020")))
      .attr("y",h4-m)
      .attr("width",scaleX(parseTime("1 November 2020")) - scaleX(parseTime("1 October 2020")))
      .attr("height",15)
      .attr("fill",n1);
  svg4.append("rect")
      .attr("x",scaleX(parseTime("1 November 2020")))
      .attr("y",h4-m)
      .attr("width",scaleX(parseTime("1 December 2020")) - scaleX(parseTime("1 November 2020")))
      .attr("height",15)
      .attr("fill",n2);
  svg4.append("rect")
      .attr("x",scaleX(parseTime("1 December 2020")))
      .attr("y",h4-m)
      .attr("width",scaleX(parseTime("1 January 2021")) - scaleX(parseTime("1 December 2020")))
      .attr("height",15)
      .attr("fill",n1);
  svg4.append("rect")
      .attr("x",scaleX(parseTime("1 January 2021")))
      .attr("y",h4-m)
      .attr("width",scaleX(parseTime("1 February 2021")) - scaleX(parseTime("1 January 2021")))
      .attr("height",15)
      .attr("fill",n2);
  svg4.append("rect")
      .attr("x",scaleX(parseTime("1 February 2021")))
      .attr("y",h4-m)
      .attr("width",scaleX(parseTime("1 March 2021")) - scaleX(parseTime("1 February 2021")))
      .attr("height",15)
      .attr("fill",n1);
  svg4.append("rect")
      .attr("x",scaleX(parseTime("1 March 2021")))
      .attr("y",h4-m)
      .attr("width",scaleX(parseTime("1 April 2021")) - scaleX(parseTime("1 March 2021")))
      .attr("height",15)
      .attr("fill",n2);
  svg4.append("rect")
      .attr("x",scaleX(parseTime("1 April 2021")))
      .attr("y",h4-m)
      .attr("width",scaleX(parseTime("1 May 2021")) - scaleX(parseTime("1 April 2021")))
      .attr("height",15)
      .attr("fill",n1);

  svg4.append("rect")
      .attr("x",m)
      .attr("y",h4-m)
      .attr("width",w4-(2*m))
      .attr("height",1);

  svg4.append("text")
      .attr("x",scaleX(parseTime("20 August 2020")))
      .attr("y",h4-m+12)
      .attr("text-anchor","middle")
      .attr("class","cstitle")
      .text("August");
  svg4.append("text")
      .attr("x",scaleX(parseTime("16 September 2020")))
      .attr("y",h4-m+12)
      .attr("text-anchor","middle")
      .attr("class","cstitle")
      .text("September");
  svg4.append("text")
      .attr("x",scaleX(parseTime("16 October 2020")))
      .attr("y",h4-m+12)
      .attr("text-anchor","middle")
      .attr("class","cstitle")
      .text("October");
  svg4.append("text")
      .attr("x",scaleX(parseTime("16 November 2020")))
      .attr("y",h4-m+12)
      .attr("text-anchor","middle")
      .attr("class","cstitle")
      .text("November");
  svg4.append("text")
      .attr("x",scaleX(parseTime("17 December 2020")))
      .attr("y",h4-m+12)
      .attr("text-anchor","middle")
      .attr("class","cstitle")
      .text("December");
  svg4.append("text")
      .attr("x",scaleX(parseTime("17 January 2021")))
      .attr("y",h4-m+12)
      .attr("text-anchor","middle")
      .attr("class","cstitle")
      .text("January");
  svg4.append("text")
      .attr("x",scaleX(parseTime("15 February 2021")))
      .attr("y",h4-m+12)
      .attr("text-anchor","middle")
      .attr("class","cstitle")
      .text("February");
  svg4.append("text")
      .attr("x",scaleX(parseTime("17 March 2021")))
      .attr("y",h4-m+12)
      .attr("text-anchor","middle")
      .attr("class","cstitle")
      .text("March");
  svg4.append("text")
      .attr("x",scaleX(parseTime("16 April 2021")))
      .attr("y",h4-m+12)
      .attr("text-anchor","middle")
      .attr("class","cstitle")
      .text("April");
});

d3.csv("data/volume_compare.csv").then(dataset => {
  const w5 = window.innerWidth/3;
  const h5 = w5*1.25;
  const m = 50;

  const svg5 = d3.select("#no5")
                 .attr("width",w5)
                 .attr("height",h5);

  const scaleX = d3.scaleBand()
                   .domain(dataset.map(d => d.Movement))
                   .range([m,w5-m])
                   .paddingInner(0.1);
  const scaleY = d3.scaleLinear()
                   .domain([0,0.19])
                   .range([h5-m,m]);
  const bottomAxis = d3.axisBottom().scale(scaleX);
  const palette_m = d3.scaleOrdinal()
                      .domain(["a","b","c","d"])
                      .range([i1,i2,y,o]);
  const grad = d3.scaleOrdinal()
                      .domain(["a","b","c","d"])
                      .range(["url(#g1)","url(#g2)","url(#g3)","url(#g4)"])
  const b5 = d3.select("#b5")
  const pt1 = d3.select("#pt1")
  const pt2 = d3.select("#pt2")
  const label = {"Farmers' movement":"Indian farmers' movement (2020-2021)","2016 strike":"Indian national strike (2016)","Gilets Jaunes":"Gilets Jaunes or Yellow Vests movement (2018-2019)","Occupy Wall Street":"Occupy Wall Street movement (2011-2012)"}
  const desc = {"Farmers' movement":"December 8, 2020: A national strike drew participation estimated to be between 200 and 250 million people. This amounts to about 14 to 18 percent of the Indian population.","2016 strike":"September 2, 2016: Indian workers protested other laws passed by the Modi government with another national strike. This set the previous record for \"biggest protest in history,\" with an estimated 150 to 180 million people participating, or about 12 percent of India's population at the time.","Gilets Jaunes":"The Yellow Vests movement was a worker's movement in France, primarily protesting laws passed by President Emmanuel Macron's government. On November 17, 2018, an estimated 282,000 people protested, or about 0.4% of France's population.","Occupy Wall Street":"The Occupy movement grew out of American workers' discontent with Wall Street in 2011 and 2012. On May 1, 2012, between 50 and 100 thousand New Yorkers demonstrated in the city's financial district. This amounts to about 1 percent of the city's population at the time."}

  svg5.selectAll()
      .data(dataset)
      .enter()
      .append("rect")
      .attr("x",d => scaleX(d.Movement))
      .attr("y",d => scaleY(d.norm_low))
      .attr("width",scaleX.bandwidth())
      .attr("height",d => (h5-m) - scaleY(+d.norm_low))
      .attr("fill",(d,i) => palette_m(i))
      .on("mouseover", (event, d) => {
        b5.transition()
          .style("opacity",1)
          .style("left", (event.pageX)+10 + "px")
          .style("top", (event.pageY)+10 + "px")
        pt1.text(label[d.Movement]);
        pt2.text(desc[d.Movement]);
      })
      .on("mousemove", (event, d) => {
        b5.style("left", (event.pageX)+10 + "px")
           .style("top", (event.pageY)+10 + "px")
      })
      .on("mouseout", (event, d) => {
        b5.transition()
           .style("opacity",0)
      });

  svg5.selectAll()
      .data(dataset)
      .enter()
      .append("rect")
      .attr("x",d => scaleX(d.Movement))
      .attr("y",d => scaleY(d.norm_high))
      .attr("width",scaleX.bandwidth())
      .attr("height",d => scaleY(d.norm_low) - scaleY(d.norm_high)+1)
      .attr("fill",(d,i) => grad(i))
      .on("mouseover", (event, d) => {
        b5.transition()
          .style("opacity",1)
          .style("left", (event.pageX)+10 + "px")
          .style("top", (event.pageY)+10 + "px")
        pt1.text(label[d.Movement]);
        pt2.text(desc[d.Movement]);
      })
      .on("mousemove", (event, d) => {
        b5.style("left", (event.pageX)+10 + "px")
           .style("top", (event.pageY)+10 + "px")
      })
      .on("mouseout", (event, d) => {
        b5.transition()
           .style("opacity",0)
      });

  svg5.append("g")
      .attr("transform", "translate(0," + (h5-m) + ")")
      .call(bottomAxis);

  svg5.append("text")
      .attr("transform","translate(" + w5/2 + "," + (m-10) + ")")
      .attr("text-anchor","middle")
      .attr("class","ctitle")
      .text("who showed up?");
  svg5.append("text")
      .attr("transform","translate(" + w5/2 + "," + (m+5) + ")")
      .attr("text-anchor","middle")
      .attr("class","cstitle")
      .text("(protesters as % of population)")
});

d3.csv("data/tweets_compare.csv").then(dataset => {
  const w6 = window.innerWidth/3;
  const h6 = w6*1.25;
  const m = 50;

  const svg6 = d3.select("#no6")
                 .attr("width",w6)
                 .attr("height",h6);

  const scaleX = d3.scaleBand()
                   .domain(dataset.map(d => d.hashtag))
                   .range([m,w6-m])
                   .paddingInner(0.1);
  const scaleY = d3.scaleLinear()
                   .domain([0,250000])
                   .range([h6-m,m]);
  const bottomAxis = d3.axisBottom().scale(scaleX);
  const palette_m = d3.scaleOrdinal()
                      .domain(["a","b","c","d"])
                      .range([i1,i2,y,o]);

  const b6 = d3.select("#b6")
  const pt3 = d3.select("#pt3")
  const pt4 = d3.select("#pt4")
  const label = {"Farmers' movement":"#bharatbandh and #farmerprotest, 2020-2021","2016 strike":"#bharatbandh, 2016","Gilets Jaunes":"#giletsjaunes, 2018-2019","Occupy Wall Street":"#occupywallstreet, 2011-2012"}

  svg6.selectAll()
      .data(dataset)
      .enter()
      .append("rect")
      .attr("x",d => scaleX(d.hashtag))
      .attr("y",d => scaleY(d.norm))
      .attr("width",scaleX.bandwidth())
      .attr("height",d => (h6-m) - scaleY(+d.norm))
      .attr("fill",(d,i) => palette_m(i))
      .on("mouseover", (event, d) => {
        b6.transition()
          .style("opacity",1)
          .style("left", (event.pageX)+10 + "px")
          .style("top", (event.pageY)+10 + "px")
        pt3.text(label[d.hashtag]);
        pt4.text(d3.format(",")(d.tweets) + " tweets in " + d.months + " months, averaging " + d3.format(",")(d3.format(".0f")(d.norm)) + " tweets per month")
      })
      .on("mousemove", (event, d) => {
        b6.style("left", (event.pageX)+10 + "px")
           .style("top", (event.pageY)+10 + "px")
      })
      .on("mouseout", (event, d) => {
        b6.transition()
           .style("opacity",0)
      });
  svg6.append("g")
      .attr("transform", "translate(0," + (h6-m) + ")")
      .call(bottomAxis);

  svg6.append("text")
      .attr("transform","translate(" + w6/2 + "," + (m-10) + ")")
      .attr("text-anchor","middle")
      .attr("class","ctitle")
      .text("who spoke out?");
  svg6.append("text")
      .attr("transform","translate(" + w6/2 + "," + (m+5) + ")")
      .attr("text-anchor","middle")
      .attr("class","cstitle")
      .text("(tweets per month)")
});

d3.csv("data/crops.csv").then(dataset => {
  const w7 = window.innerWidth/3;
  const h7 = w7*0.8;
  const m = 25;

  const sm = d3.select("#sm")
               .attr("width",w7)
               .attr("height",h7);
  var pie = d3.pie();
  const number = [dataset[0]['number'],dataset[1]['number'],dataset[2]['number'],dataset[3]['number']]
  const type = [dataset[0]['type'],dataset[2]['type'],dataset[1]['type'],dataset[3]['type']]
  const desc = [dataset[0]['desc'],dataset[2]['desc'],dataset[1]['desc'],dataset[3]['desc']]

  const cArcs = pie(number);
  var cPalette = d3.scaleOrdinal()
                   .domain(["a","b","c","d"])
                   .range([i1,i2,i3,i4])
  const ttsm = d3.select("#ttsm")

  sm.append("g")
    .attr("transform","translate(" + w7/2 + "," + (h7/2+m) + ")")
    .selectAll("cArcs")
    .data(cArcs)
    .enter()
    .append("path")
    .attr("d",d3.arc()
                .innerRadius(w7/6)
                .outerRadius(w7/3))
    .attr("class","donut")
    .attr("fill",(d,i) => cPalette(i))
    .on("mouseover", (event, d) => {
      ttsm.transition()
         .style("opacity",1)
         .style("left", (event.pageX)+10 + "px")
         .style("top", (event.pageY)+10 + "px")
         .text(d.data + " " + type[d.index] + ", " + desc[d.index])
    })
    .on("mousemove", (event, d) => {
      ttsm.style("left", (event.pageX)+10 + "px")
         .style("top", (event.pageY)+10 + "px")
    })
    .on("mouseout", (event, d) => {
      ttsm.transition()
         .style("opacity",0)
    });

  sm.append("text")
      .attr("transform","translate(" + w7/2 + "," + m + ")")
      .attr("text-anchor","middle")
      .attr("class","ctitle")
      .text("what does the msp system support?");
});
