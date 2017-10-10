function makeVisualization(){//create  visualization

    var mark_attr = document.getElementById("Mark")
                    .options[document.getElementById("Mark").selectedIndex].value;//to store selected value from dropdown menu of mark
    var x_attr = document.getElementById("X_axis")
                    .options[document.getElementById("X_axis").selectedIndex].value;//to store selected valeue from dropdown menu of Xaxis
    var y_attr = document.getElementById("Y_axis")
                    .options[document.getElementById("Y_axis").selectedIndex].value;//Yaxis
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
    svg.append("text")//labbeling x axis
        .attr("transform",
              "translate(" + (width/2) + " ," +
                             (height + margin.top+10) + ")")
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

}

function makeScale(attr, type){//function to make scale
    var dstring = [];//domain for ordinal scale
    if(attr == "name" || attr == "mfr" || attr == "type" || attr == "shelf"){//if attributes are ordinal
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
        var scale = d3.scaleBand()
                .domain(dstring);//domain data
        if(type == "x")//if we are making scale for xAxis
                scale.range([0,width]);//pixel range
        else if(type == "y")//for yAxis
                scale.range([height,0]);
        return scale;
    }
    else{//if attributes are nominal
        var lowerBound = findMin(attr);
        var upperBound = findMax(attr);
    
        var scale = d3.scaleLinear()
                    .domain([lowerBound, upperBound]);//domain range
        if(type == "x")//if we are making scale for xAxis
                    scale.range([0,width]);//pixel range
        else if(type == "y")//for yAxis
                    scale.range([height,0]);
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
            min = cerealRecords[i][attr];
    }
    return max;
}