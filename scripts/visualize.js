function makeVisualization() {//create  visualization

    var mark_attr = document.getElementById("Mark")
        .options[document.getElementById("Mark").selectedIndex].value;//to store selected value from dropdown menu of mark
    var x_attr = document.getElementById("X_axis")
        .options[document.getElementById("X_axis").selectedIndex].value;//to store selected valeue from dropdown menu of Xaxis
    var y_attr = document.getElementById("Y_axis")
        .options[document.getElementById("Y_axis").selectedIndex].value;//Yaxis
    var size_attr = document.getElementById("Size")
        .options[document.getElementById("Size").selectedIndex].value;//Size
    var brightness_attr = document.getElementById("Brightness")
        .options[document.getElementById("Brightness").selectedIndex].value;//Brighness
    var color_attr = document.getElementById("Color")
        .options[document.getElementById("Color").selectedIndex].value;//Color
    var xLabel = document.getElementById("X_axis")
        .options[document.getElementById("X_axis").selectedIndex].text;//getting label for xAxis
    var yLabel = document.getElementById("Y_axis")
        .options[document.getElementById("Y_axis").selectedIndex].text;//getting label for yAxis

    var xScale = makeScale(x_attr, "x");//making x scale
    var yScale = makeScale(y_attr, "y");//making y scale
    var xAxis = d3.axisBottom(xScale);//X-axis
    var yAxis = d3.axisLeft(yScale);//Y-axis

    if(size_attr == "none"){
        var sizeScale = function (asd){ return 100};//a dummy function to return default value of size if no attribute is selected for size
    }
    else{
        var sizeScale = makeSizeScale(size_attr);
    }
    
    
    var svg = d3.select("body").append("svg")//as a canvas to make a graph on
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");


    svg.append("g")//attaching x axis
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);
    //.selectAll("text")
    //.attr("transform", "translate(0", + height + ")")
    //.attr("transform", "rotate(90)");

    svg.append("text")//labbeling x axis
        .attr("transform",
        "translate(" + (width / 2) + " ," +
        (height + margin.top) + ")")
        .style("text-anchor", "middle")
        .text(xLabel);

    svg.append("g")//attaching y axis
        .call(yAxis);
    svg.append("text")//labelling y axis
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text(yLabel);

    var div = d3.select("body").append("div")
                .attr("class","tooltip")
                .style("opacity",0);
    var markDomain = makeOrdinalValueList(mark_attr);



    cerealRecords.forEach(function (d) {//for each record

        if(d[x_attr] != -1 && d[y_attr] != -1 && d[size_attr] != -1 && d[mark_attr] != -1 && d[color_attr] != -1 && d[brightness_attr] != -1){//droping missing data
            var plots = svg.selectAll(".plot") //making Scatterplot
            .data(cerealRecords)
            .enter().append("path")
            .attr("transform", "translate(" + xScale(d[x_attr]) + "," + yScale(d[y_attr]) + ")")
            .attr("d", makeMark(mark_attr, d[mark_attr], markDomain).size(sizeScale(d[size_attr])))
            .attr("fill", makeColor(color_attr, d[color_attr], brightness_attr, d[brightness_attr]))
            .on("mouseover", function(){
                div.transition()
                    .duration(200)
                    .style("opacity", .9);
                div.html("name: " + d.name + "<br>Manufacturer: " + d.mfr + "<br>Type: " + d.type + "<br>calories: " + d.calories + 
                                "<br>Protein: " + d.protein + "<br>fat: " + d.fat + "<br>Sodium: " + d.sodium + 
                                "<br>Fiber: "  + d.fiber + "<br>Carbohydrates: " + d.carbo + "<br>Sugar: " + d.sugars +
                                "<br>Shelf: " + d.shelf + "<br>Potassium: " + d.potass + "<br>vitamins: " + d.vitamins + "<br>Weight: "
                                + d.weight + "<br>Cups: " + d.cups )
                        .style("left", (d3.event.pageX) + "px")
                        .style("top", (d3.event.pageY) + "px");
                        
            })
            .on("mouseout",function(){
                div.transition()
                        .duration(200)
                        .style("opacity", 0);
            });
        }

    });


}

function makeScale(attr, type) {//function to make scale

    if (attr == "name" || attr == "mfr" || attr == "type" || attr == "shelf" || attr == "vitamins") {//if attributes are ordinal
        var dstring = makeOrdinalValueList(attr);//domain for ordinal scale
        var scale = d3.scaleBand()
            .padding(1)//as there will be no tick for 0 on ordinal scale
            .domain(dstring);//domain data
        if (type == "x")//if we are making scale for xAxis
            scale.range([0, width]);//pixel range
        else if (type == "y")//for yAxis
            scale.range([height, 0]);//pixel range
        return scale;
    }
    else {//if attributes are nominal
        var lowerBound = findMin(attr);//lowest value of attribute
        var upperBound = findMax(attr);//highest

        var scale = d3.scaleLinear()
            .domain([lowerBound, upperBound]);//domain range
        if (type == "x")//if we are making scale for xAxis
            scale.range([0, width]);//pixel range
        else if (type == "y")//for yAxis
            scale.range([height, 0]);//pixel range
        return scale;
    }
}
function makeSizeScale(attr) {
    if (attr == "name" || attr == "mfr" || attr == "type" || attr == "shelf" || attr == "vitamins") {
        var sizeScale = d3.scaleBand()
            .domain(makeOrdinalValueList(attr))
            .range([40, 240]);
    }
    else {
        var sizeScale = d3.scaleLinear()//to size the nominal attribute 
            .domain([findMin(attr), findMax(attr)])
            .range([40, 400]);
    }
    return sizeScale;

}
function makeColor(c_attr, c_value, b_attr, b_value) {

    var hue, saturation, bright;
    saturation = 100;//gives most saturated color
    //for color
    if (c_attr == "name" || c_attr == "mfr" || c_attr == "type" || c_attr == "shelf" || c_attr == "vitamins") {//for ordinal attribute
        if (c_attr == "none") {//if no attribute is assigned for color
            hue = 240;// default color will be blue
        }
        else {
            var cDomain = makeOrdinalValueList(c_attr);//domain list of color attribute
            

            colorScale = d3.scaleBand()//color scale for nominal attributes
                .domain(cDomain)
                .range([150, 0]);//hue value of green to red
            hue = colorScale(c_value);
        }
    }
    else//for nominal attributes
    {
        if (c_attr == "none") {//if no attribute is assigned for color
            hue = 240;// default color will be blue
        }
        else {
            colorScale = d3.scaleLinear()//color scale for nominal attributes
                .domain([findMin(c_attr), findMax(c_attr)])
                .range([150, 0]);//hue value of green to red
            hue = colorScale(c_value);
        }
    }
    //now for brighness
    if (b_attr == "name" || b_attr == "mfr" || b_attr == "type" || b_attr == "shelf" || b_attr == "vitamins") {//for ordinal attribute
        var bDomain = makeOrdinalValueList(b_attr);//domain list of brightness attribute
        if (b_attr == "none") {
            bright = 50; //default brightness 0=black 100=white
        }
        else {
            bScale = d3.scaleBand()
                .domain(bDomain)
                .range([75, 0]);//0=darkest 100=lightest 
            bright = bScale(b_value);
        }
    }
    else{//for nominal attributes
    
        if (b_attr == "none") {
            bright = 50; //default brightness 0=black 100=white
        }
        else {
            bScale = d3.scaleLinear()
                .domain([findMin(b_attr), findMax(b_attr)])
                .range([75, 0]);//0=darkest 100=lightest 
            bright = bScale(b_value);
        }
    }
    
    return "hsl(" + hue + "," + saturation + "%," + bright + "%)";
}
function findMin(attr) {//to find minimum value in given attribute
    var min = cerealRecords[0][attr];
    for (i = 0; i < cerealRecords.length; i++) {//checking all the records
        if (cerealRecords[i][attr] != -1) {//skip the missing data
            if (cerealRecords[i][attr] < min)
                min = cerealRecords[i][attr];
        }
    }
    return min;
}
function findMax(attr) {//to find minimum value in given attribute
    var max = cerealRecords[0][attr];
    for (i = 0; i < cerealRecords.length; i++) {//checking all the records
        if (cerealRecords[i][attr] > max)
            max = cerealRecords[i][attr];
    }
    return max;
}
function makeOrdinalValueList(attr) {//to make a list of ordinal attribute domain//if data is continuous this will bin it
    var dstring = [];//domain for ordinal scale
    if (attr == "name" || attr == "mfr" || attr == "type" || attr == "shelf" || attr == "vitamins") {//if attributes are ordinal
        for (i = 0; i < cerealRecords.length; i++) {//checking all the records
            var flag = true;
            for (j = 0; j < dstring.length; j++) {
                if (dstring[j] == cerealRecords[i][attr]) {//if the records is previously noted for doain
                    flag = false;
                    break;
                }

            }
            if (flag) {//only when the domain value is unseen before
                dstring.push(cerealRecords[i][attr]);//pushing values for domain
            }

        }
        dstring.sort();
        return dstring;
    }
    else {
        var lowerBound = findMin(attr);//lowest value of attribute
        var upperBound = findMax(attr);//highest
        var intervalSize = (upperBound - lowerBound) / 7; //binning attribute in 7 groups (7 is number of marks i am using)
        var intervalIncrement = lowerBound;
        for (i = 0; i < 8; i++) {//for entering intervals to dstring
            if (i == 7) {//the last value is upperbound (to deal with the remainder)
                dstring.push(upperBound);
            }
            else {
                dstring.push(intervalIncrement);
                intervalIncrement++;
            }
        }
        return dstring;//for data of range[200,600] it will make intervals as [200,257,314...542,600]
    }
}
function makeMark(attr, value, dstring) {
    if (attr == "name" || attr == "mfr" || attr == "type" || attr == "shelf" || attr == "vitamins") {//if attributes are ordinal
        for (i = 0; i < dstring.length; i++) {
            if (dstring[i] == value) {//value matched index in the symbol array will help to keep trak of symbol assigned
                return d3.symbol().type(d3.symbols[i]);
            }
        }
    }
    else {
        for (i = 0; i < 7; i++) {
            if (value <= dstring[i + 1]) {//the upperbound of an interval is exclusive and lower bound is inclusive //though for first interval lowerbound will also be inclusive
                return d3.symbol().type(d3.symbols[i]);
            }
        }
    }

}