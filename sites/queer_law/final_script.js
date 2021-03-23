d3.csv("final_data.csv").then(dataset => {

  // define variables

  const w = 1000;
  const h = 1000;
  const margin = 10;

  // intro view: svg

  const svg0 = d3.select("#intro")
                 .attr("width",w)
                 .attr("height",h);

  // first view: svg

  const svg1 = d3.select("#firstview")
                 .attr('width',w)
                 .attr('height',h);

 // second view: svg

 const svg2 = d3.select("#secondview")
                .attr('width',w)
                .attr('height',h);

  // third view: svg

  const svg3 = d3.select("#thirdview")
                 .attr('width',w)
                 .attr('height',h);

  // intro view: text

  d3.select("#introblock")
    .style("left", "280px")
    .style("top", "100px");

  // first view: sidebar

  d3.select("#firstblock")
    .style("left","20px")
    .style("top","1010px");

  // first view: data categories

  const posCat = ["Job","Union","Adopt","Hate","Incitement","Const","CTBan"];
  const neuCat = ["NeuCount"];
  const negCat = ["AllCrim","Death","MenCrim","Life"];

  const posDesc = {
    "Const":["constitutionally","protect queer citizens"],
    "Job":["protect queer citizens","from employment","discrimination"],
    "Hate":["criminalize","hate crimes against","queer citizens"],
    "Incitement":["criminalize incitement","of violence against","queer citizens"],
    "CTBan":["ban conversion","therapies"],
    "Union":["allow same-sex","marriages or","civil unions"],
    "Adopt":["allow same-sex","couples to","adopt children"]
  };

  const neuDesc =
    {"NeuCount":["have no laws protecting","(or criminalizing)","same-sex relationships"]};

  const negDesc = {
    "AllCrim":["criminalize all","same-sex","relationships"],
    "MenCrim":["criminalize same-sex","relationships","between men"],
    "Life":["punish same-sex","relations with","life in prison"],
    "Death":["punish same-sex","relations with death"]
  };

  // first view: population counts

  let allPop = 0
  for (x = 0; x < dataset.length; x ++) {
    allPop = allPop + parseInt(dataset[x]["Population"])
  }

  const posCount = [];
  const neuCount = [];
  const negCount = [];

  for (x = 0; x < posCat.length; x ++) {
    let cat = String(posCat[x]);
    posCount[x] = {};
    posCount[x][cat] = [0,allPop];
    for (y = 0; y < dataset.length; y ++) {
      if (dataset[y][cat] == 1) {
        posCount[x][cat][0] = posCount[x][cat][0] + parseInt(dataset[y]["Population"])
        posCount[x][cat][1] = posCount[x][cat][1] - parseInt(dataset[y]["Population"])
      }
    }
  }

  for (x = 0; x < neuCat.length; x ++) {
    let cat = String(neuCat[x]);
    neuCount[x] = {};
    neuCount[x][cat] = [0,allPop];
    for (y = 0; y < dataset.length; y ++) {
      if (dataset[y][cat] == 1) {
        neuCount[x][cat][0] = neuCount[x][cat][0] + parseInt(dataset[y]["Population"])
        neuCount[x][cat][1] = neuCount[x][cat][1] - parseInt(dataset[y]["Population"])
      }
    }
  }

  for (x = 0; x < negCat.length; x ++) {
    let cat = String(negCat[x]);
    negCount[x] = {};
    negCount[x][cat] = [0,allPop];
    for (y = 0; y < dataset.length; y ++) {
      if (dataset[y][cat] == 1) {
        negCount[x][cat][0] = negCount[x][cat][0] + parseInt(dataset[y]["Population"])
        negCount[x][cat][1] = negCount[x][cat][1] - parseInt(dataset[y]["Population"])
      }
    }
  }

  // first view: variables

  const pieSpace = (w-2*margin)/posCount.length;
  const pieHeight = pieSpace - margin;
  const posColor = '#E53194';
  const neuColor = '#999999';
  const negColor = '#2FD4EA';
  const arcs = d3.arc()
                 .innerRadius(0)
                 .outerRadius(pieHeight/2);

  // first view: creating pies

  function initialPies(data, color, yTranslate, direction, label) {

    if (yTranslate == 150) {
      svg1.append('text')
          .attr('class','title')
          .attr('x',500)
          .attr('y',50)
          .attr('text-anchor','middle')
          .text('PEOPLE LIVING IN PLACES THAT...');
    }

    let palette = d3.scaleOrdinal()
                       .domain(["A","B"])
                       .range([color,'#444444']);

    for (x = 0; x < data.length; x ++) {
      let string = String(Object.keys(data[x])[0]);
      let selection = String("g#" + string);
      let xTranslate = pieSpace/2 + pieSpace*x + margin;
      let labelCall = label[string];
      let pie = d3.pie()
                  .startAngle(direction*Math.PI);
      const pieRow = svg1.selectAll(selection)
                         .data(pie(data[x][string]))
                         .enter().append('g')
                         .attr('id',string)
                         .attr('class','arcs')
                         .attr('transform','translate(' + xTranslate + ',' + yTranslate + ')');
      pieRow.append('a')
            .attr('xlink:href','#secondview')
            .attr('class','pieClick')
            .append('path')
            .attr('fill', (d,i) => palette(i))
            .attr('d',arcs);
      for (y = 0; y < labelCall.length; y ++) {
        yText = 80 + 15*y;
        pieRow.append('text')
              .attr('transform','translate(0,' + yText + ')')
              .attr('class','pietext')
              .attr('text-anchor','middle')
              .text(labelCall[y]);
      }

    }

  }

  // first view: legend

  const legend = d3.select("#legendContainer")
                   .style("left","1050px")
                   .style("top","1350px");

  // first view: hover

  function pieHover(data, color, direction, label) {

    let pie = d3.pie()
                .startAngle(direction*Math.PI);

    const bigArc = d3.arc()
                   .innerRadius(0)
                   .outerRadius(125);

    let palette = d3.scaleOrdinal()
                    .domain(["A","B"])
                    .range([color,'#EEEEEE']);

    for (x = 0; x < data.length; x ++) {
      let string = String(Object.keys(data[x])[0]);
      let selection = String("g#" + string);

      let newData = data[x][string];

      let descText1 = "live in places that";
      let descText2 = label[string][0];
      let descText3 = label[string][1];
      let descText4 = label[string][2];

      let popRaw = data[x][string][0];
      let popCalc = Math.round(popRaw / 1000000);

      let popCaption = "";
      if (popCalc < 1000) {
        popCaption = String(popCalc) + " million people"
      } else {
        popBil = (Math.round(popCalc/100)) / 10
        popCaption = String(popBil) + " billion people"
      };

      let popPercent = Math.round((popRaw / allPop) * 100);
      let popBottom1 = "(" + d3.format(",")(popRaw) + " people, or";
      let popBottom2 = String(popPercent) + "% of the world's population)";

      svg1.selectAll(selection)
          .on("mouseover", (event, d) => {
            d3.select("#pieZoom")
              .attr('width',250)
              .attr('height',250)
              .selectAll(selection)
              .data(pie(newData))
              .enter().append('g')
              .attr('id',string)
              .attr('transform','translate(125,125)')
              .append('path')
              .attr('fill', (d,i) => palette(i))
              .attr('d',bigArc);
            d3.select("#tooltip")
              .transition()
              .style("opacity",1)
              .style("left", (event.pageX) + "px")
              .style("top", (event.pageY) + "px");
            d3.select("#pieNum")
              .text(popCaption)
              .style("color",palette);
            d3.select("#desc1")
              .text(descText1);
            d3.select("#desc2")
              .text(descText2);
            d3.select("#desc3")
              .text(descText3);
            d3.select("#desc4")
              .text(descText4);
            d3.select("#foot1")
              .text(popBottom1);
            d3.select("#foot2")
              .text(popBottom2);
            d3.select(".footer")
              .style("color",palette);
          })
          .on("mousemove", (event, d) => {
            d3.select("#tooltip")
              .style("left", (event.pageX) + "px")
              .style("top", (event.pageY) + "px")
          })
          .on("mouseout", (event, d) => {
            d3.selectAll("#pieZoom > *")
              .remove();
            d3.select("#tooltip")
              .transition()
              .style("opacity", 0)
              .style("left", 1200 + "px")
              .style("top", 1200 + "px");
          });
    }

  }

  // first -> second view: click

  const posLabel = {
    "Const":["CONSTITUTIONALLY PROTECT QUEER CITIZENS"],
    "Job":["PROTECT QUEER CITIZENS FROM EMPLOYMENT DISCRIMINATION"],
    "Hate":["CRIMINALIZE HATE CRIMES AGAINST QUEER CITIZENS"],
    "Incitement":["CRIMINALIZE INCITEMENT OF VIOLENCE AGAINST QUEER CITIZENS"],
    "CTBan":["BAN CONVERSION THERAPIES"],
    "Union":["ALLOW SAME-SEX MARRIAGES OR CIVIL UNIONS"],
    "Adopt":["ALLOW SAME-SEX COUPLES TO ADOPT CHILDREN"]
  };

  const neuLabel =
    {"NeuCount":["DON'T PROTECT OR CRIMINALIZE QUEER CITIZENS"]};

  const negLabel = {
    "AllCrim":["CRIMINALIZE ALL SAME-SEX RELATIONSHIPS"],
    "MenCrim":["CRIMINALIZE SAME-SEX RELATIONSHIPS BETWEEN MEN"],
    "Life":["PUNISH SAME-SEX RELATIONS WITH LIFE IN PRISON"],
    "Death":["PUNISH SAME-SEX RELATIONS WITH DEATH"]
  };

  function pieClick(data, label) {

    for (x = 0; x < data.length; x ++) {
      let string = String(Object.keys(data[x])[0]);
      let selection = String("g#" + string);

      svg1.selectAll(selection)
          .on('click', (event,d) => {
            d3.selectAll("#secondview > *")
              .remove();

            title1 = "PLACES THAT "
            title2 = label[string]

            genTitle = title1 + title2

            svg2.append('text')
                .attr('class','title')
                .attr('x',500)
                .attr('y',50)
                .attr('text-anchor','middle')
                .text(genTitle)

            svg2.append('text')
                .attr('class','columnLabel')
                .attr('x',516)
                .attr('y',100)
                .attr('text-anchor','middle')
                .text('IN THE GLOBAL NORTH')
            svg2.append('text')
                .attr('class','columnLabel')
                .attr('x',816)
                .attr('y',100)
                .attr('text-anchor','middle')
                .text('IN THE GLOBAL SOUTH')

            let a = 0;
            let b = 0;

            for (y = 0; y < dataset.length; y ++) {
              if (dataset[y]['Region'] == 'GN') {
                if (dataset[y][string] == 1) {
                  yTranslate = 108 + 18*a
                  textId = "n" + String(dataset[y]['Number'])
                  group = svg2.append("g")
                              .attr("transform","translate(400," + yTranslate + ")");
                  group.append("rect")
                       .attr("x",0)
                       .attr("y",0)
                       .attr("width",250)
                       .attr("height",18)
                       .attr("fill","#F1D235");
                  group.append("a")
                       .attr("xlink:href","#thirdview")
                       .append("text")
                       .text(dataset[y]['Country'])
                       .attr("x",0)
                       .attr("y",14)
                       .attr("font-size",15)
                       .attr("font-weight","bold")
                       .attr("id",textId);
                  a = a + 1;
                }
              } else {
                if (dataset[y][string] == 1) {
                  yTranslate = 108 + 18*b
                  textId = "n" + String(dataset[y]['Number'])
                  group = svg2.append("g")
                              .attr("transform","translate(700," + yTranslate + ")");
                  group.append("rect")
                       .attr("x",0)
                       .attr("y",0)
                       .attr("width",250)
                       .attr("height",18)
                       .attr("fill","#AB4BFF");
                  group.append("a")
                       .attr("xlink:href","#thirdview")
                       .append("text")
                       .text(dataset[y]['Country'])
                       .attr("x",0)
                       .attr("y",14)
                       .attr("font-size",15)
                       .attr("font-weight","bold")
                       .attr("id",textId);
                  b = b + 1;
                }
              }
            }

          });
    };

  }

  // second view: sidebar

  d3.select("#secondblock")
    .style("left","20px")
    .style("top","2010px");

  // second view: map

  d3.select(".map")
    .style("left","305px")
    .style("top","2150px");

  // second -> third view: click

  thirdLabel = {
    "Const":["constitutionally protects queer citizens"],
    "Job":["protects queer citizens from employment discrimination"],
    "Hate":["criminalizes hate crimes against queer citizens"],
    "Incitement":["criminalizes incitement of violence against queer citizens"],
    "CTBan":["bans conversion therapies"],
    "Union":["allows same-sex marriages or civil unions"],
    "Adopt":["allows same-sex couples to adopt children"],
    "NeuCount":["has no laws, positive or negative, pertaining to same-sex relationships"],
    "AllCrim":["criminalizes all same-sex relationships"],
    "MenCrim":["criminalizes same-sex relationships between men"],
    "Life":["punishes same-sex relations with life in prison"],
    "Death":["punishes same-sex relations with death"]
  };

  function countryClick() {

    const check = ["M0,27 L8,19 L20,30 L40,0 L50,7 L22,45 L0,27"];

    const dash = ["M0,20 L50,20 L50,30 L0,30 L0,20"]

    const xShape = ["M0,10 L10,0 L25,15 L40,0 L50,10 L35,25 L50,40 L40,50 L25,35 L10,50 L0,40 L15,25 L0,10"]

    svg2.on('click', (event,d) => {

        d3.selectAll('#thirdview > *')
          .remove();
        d3.selectAll('#detail > *')
          .remove();
        d3.selectAll('#blurb > *')
          .remove();

        let id = event.target.id.substring(1);
        let countryId = parseInt(id) - 1;
        let countryName = String(dataset[countryId]['Country'])
        let countryAlt = String(dataset[countryId]['AltName'])

        if (dataset[countryId]['Region'] == 'GN') {
          svg3.append('rect')
              .attr('x',200)
              .attr('y',20)
              .attr('width',600)
              .attr('height',40)
              .attr('fill','#F1D235');
        } else {
          svg3.append('rect')
              .attr('x',200)
              .attr('y',20)
              .attr('width',600)
              .attr('height',40)
              .attr('fill','#AB4BFF');
        }

        let titleText = "QUEER RIGHTS IN " + countryName.toUpperCase();
        svg3.append('text')
            .attr('class','title')
            .attr('x',500)
            .attr('y',50)
            .attr('text-anchor','middle')
            .text(titleText);

        countryDetail = ""

        if (countryAlt !== "") {
          countryDetail = countryName + " (" + countryAlt + "):";
        } else {
          countryDetail = countryName + ":";
        }

        d3.selectAll('#detail')
          .append('text')
          .text(countryDetail);

        d3.selectAll('#blurb')
          .append('text')
          .text(dataset[countryId]['Notes']);

        let s = 0;

        for (x = 0; x < posCat.length; x ++) {
          let catName = posCat[x];
          if (dataset[countryId][catName] == 1) {
            yCoord = 100 + 80*s
            svg3.append('path')
                .attr('d',check)
                .attr('transform','translate(200,'+yCoord+')')
                .attr('fill',posColor);
            svg3.append('text')
                .attr('x',260)
                .attr('y',yCoord+30)
                .attr('class','third')
                .text(countryName + " " + thirdLabel[catName]);
            s = s + 1;
          }
        }

        for (x = 0; x < neuCat.length; x ++) {
          let catName = neuCat[x];
          if (dataset[countryId][catName] == 1) {
            yCoord = 100 + 80*s
            svg3.append('path')
                .attr('d',dash)
                .attr('transform','translate(200,'+yCoord+')')
                .attr('fill',neuColor);
            svg3.append('text')
                .attr('x',260)
                .attr('y',yCoord+30)
                .attr('class','third')
                .text(countryName + " " + thirdLabel[catName]);
            s = s + 1;
          }
        }

        for (x = 0; x < negCat.length; x ++) {
          let catName = negCat[x];
          if (dataset[countryId][catName] == 1) {
            yCoord = 100 + 80*s
            svg3.append('path')
                .attr('d',xShape)
                .attr('transform','translate(200,'+yCoord+')')
                .attr('fill',negColor);
            svg3.append('text')
                .attr('x',260)
                .attr('y',yCoord+30)
                .attr('class','third')
                .text(countryName + " " + thirdLabel[catName]);
            s = s + 1;
          }
        }

    })

  }

  countryClick();

  // third view sidebar

  d3.select("#thirdblock")
    .style("left","20px")
    .style("top","3010px");

  // arrows

  const arrow = ["M0,20 L30,20 L20,10 L28,3 L50,25 L28,47 L20,40 L30,30 L0,30 L0,20"];

  fwd = svg0.selectAll("#arrow")
            .data(arrow)
            .enter()
            .append("svg")
            .attr("id","arrow")
            .attr("x","900px")
            .attr("y","600px")
            .attr("height","50px")
            .attr("width","50px");

  fwdPath = fwd.append("a")
               .attr("xlink:href","#firstview");

  fwdPath.append("path")
         .attr("d",arrow)
         .attr("fill","#AB4BFF");

  svg0.selectAll("#arrow")
      .on('click', (event,d) => {

        initialPies(posCount, posColor, 150, 8, posDesc);
        initialPies(neuCount, neuColor, 350, 0, neuDesc);
        initialPies(negCount, negColor, 550, 8, negDesc);

        pieHover(posCount, posColor, 8, posDesc);
        pieHover(neuCount, neuColor, 0, neuDesc);
        pieHover(negCount, negColor, 8, negDesc);

        pieClick(posCount, posLabel);
        pieClick(neuCount, neuLabel);
        pieClick(negCount, negLabel);

      })

  const backArrow = ["M0,25 L22,3 L30,10 L20,20 L50,20 L50,30 L20,30 L30,40 L22,47 L0,25"];

  const sideBar = d3.selectAll(".backArrow");

  const back = sideBar.selectAll("#backArrow")
                      .data(backArrow)
                      .enter()
                      .append("svg")
                      .attr("id","backArrow")
                      .attr("x","20px")
                      .attr("y","630px")
                      .attr("height","50px")
                      .attr("width","50px");

  const backPath = back.append("a")
                       .attr("xlink:href","#firstview");

  backPath.append("path")
         .attr("d",backArrow)
         .attr("fill",'#2FD4EA');

  const side2 = d3.selectAll(".back2");

  const back2 = side2.selectAll("#backYellow")
                     .data(backArrow)
                     .enter()
                     .append("svg")
                     .attr("id","backYellow")
                     .attr("x","80px")
                     .attr("y","630px")
                     .attr("height","50px")
                     .attr("width","50px");

  const backPath2 = back2.append("a")
                         .attr("xlink:href","#secondview");

  backPath2.append("path")
           .attr("d",backArrow)
           .attr("fill","#F1D235");

  // clear details on click backs

  d3.selectAll('#backArrow')
    .on('click', (event,d) => {
      d3.selectAll('#secondview > *')
        .remove();
      d3.selectAll('#thirdview > *')
        .remove();
      d3.selectAll('#detail > *')
        .remove();
      d3.selectAll('#blurb > *')
        .remove();
    });

    d3.selectAll('#backYellow')
      .on('click', (event,d) => {
        d3.selectAll('#thirdview > *')
          .remove();
        d3.selectAll('#detail > *')
          .remove();
        d3.selectAll('#blurb > *')
          .remove();
      });

  d3.selectAll('.rainbow')
    .on('click', (event,d) => {
      d3.selectAll('#firstview > *')
        .remove();
      d3.selectAll('#secondview > *')
        .remove();
      d3.selectAll('#thirdview > *')
        .remove();
      d3.selectAll('#detail > *')
        .remove();
      d3.selectAll('#blurb > *')
        .remove();
    });

});
