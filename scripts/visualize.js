function makeVisualization(){//create  visualization

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
    
    var xScale = makeScale(x_attr,"x");//making x scale
    var yScale = makeScale(y_attr,"y");//making y scale
    var xAxis = d3.axisBottom(xScale);//X-axis
    var yAxis = d3.axisLeft(yScale);//Y-axis

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
              "translate(" + (width/2) + " ," +
                             (height + margin.top) + ")")
        .style("text-anchor", "middle")
        .text(xLabel);

    svg.append("g")//attaching y axis
        .call(yAxis);
    svg.append("text")//labelling y axis
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x",0 - (height / 2))
        .attr("dy", "1em")
          .style("text-anchor", "middle")
          .text(yLabel);
    
    var markDomain = makeOrdinalValueList(mark_attr);

    cerealRecords.forEach(function(d) {//for each record
    
            var val = d[mark_attr];
            var plots = svg.selectAll(".plot") //making Scatterplot
            .data(cerealRecords)
            .enter().append("path")
            .attr("d", makeMark(mark_attr,val,markDomain))
            .attr("transform", "translate(" + xScale(d[x_attr]) + "," + yScale(d[y_attr]) + ")");
        });

    
}

function makeScale(attr, type){//function to make scale
    
    if(attr == "name" || attr == "mfr" || attr == "type" || attr == "shelf" || attr == "vitamins"){//if attributes are ordinal
        var dstring = makeOrdinalValueList(attr);//domain for ordinal scale
        var scale = d3.scaleBand()
                .padding(1)//as there will be no tick for 0 on ordinal scale
                .domain(dstring);//domain data
        if(type == "x")//if we are making scale for xAxis
                scale.range([0,width]);//pixel range
        else if(type == "y")//for yAxis
                scale.range([height,0]);//pixel range
        return scale;
    }
    else{//if attributes are nominal
        var lowerBound = findMin(attr);//lowest value of attribute
        var upperBound = findMax(attr);//highest
    
        var scale = d3.scaleLinear()
                    .domain([lowerBound, upperBound]);//domain range
        if(type == "x")//if we are making scale for xAxis
                    scale.range([0,width]);//pixel range
        else if(type == "y")//for yAxis
                    scale.range([height,0]);//pixel range
        return scale;
    }
}

function findMin(attr){//to find minimum value in given attribute
    var min = cerealRecords[0][attr];
    for(i=0; i<cerealRecords.length;i++){//checking all the records
        if(cerealRecords[i][attr] < min)
            min = cerealRecords[i][attr];
    }
    return min;
}
function findMax(attr){//to find minimum value in given attribute
    var max = cerealRecords[0][attr];
    for(i=0; i<cerealRecords.length;i++){//checking all the records
        if(cerealRecords[i][attr] > max)
            max = cerealRecords[i][attr];
    }
    return max;
}
function makeOrdinalValueList(attr){//to make a list of ordinal attribute domain//if data is continuous this will bin it
    var dstring = [];//domain for ordinal scale
    if(attr == "name" || attr == "mfr" || attr == "type" || attr == "shelf" || attr == "vitamins"){//if attributes are ordinal
        for(i=0; i<cerealRecords.length;i++){//checking all the records
            var flag = true;
            for(j=0;j<dstring.length;j++){
                if(dstring[j] == cerealRecords[i][attr]){//if the records is previously noted for doain
                    flag = false;
                    break;
                }
                    
            }
            if(flag){//only when the domain value is unseen before
                dstring.push(cerealRecords[i][attr]);//pushing values for domain
            }
            
        }
        dstring.sort();
        return dstring;
    }
    else{
        var lowerBound = findMin(attr);//lowest value of attribute
        var upperBound = findMax(attr);//highest
        var intervalSize = (upperBound-lowerBound)/7; //binning attribute in 7 groups (7 is number of marks i am using)
        var intervalIncrement = lowerBound;
        for(i=0;i<8;i++){//for entering intervals to dstring
            if(i == 7){//the last value is upperbound (to deal with the remainder)
                dstring.push(upperBound);
            }
            else{
                dstring.push(intervalIncrement);
                intervalIncrement++;
            }
        }
        return dstring;//for data of range[200,600] it will make intervals as [200,257,314...542,600]
    }
}
function makeMark(attr, value, dstring){
    if(attr == "name" || attr == "mfr" || attr == "type" || attr == "shelf" || attr == "vitamins"){//if attributes are ordinal
        for(i=0; i<dstring.length;i++){
            if(dstring[i] == value){
                return d3.symbol().type(d3.symbols[i]);
            }
        }
    }
    else{
        for(i=0;i<7;i++){
            if(value <= dstring[i+1]){//the upperbound of an interval is exclusive and lower bound is inclusive //though for first interval lowerbound will also be inclusive
                return d3.symbol().type(d3.symbols[i]);
            }
        }
    }
    
}