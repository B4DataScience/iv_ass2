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

    var xScale = makeScale(x_attr);
    xScale.range([0,width]);//pixel range
    var svg = d3.select("body").append("svg")//as a canvas to make a graph on
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

    var xAxis = d3.axisBottom(xScale);//X-axis
    svg.append("g")//attaching x axis
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

}

function makeScale(x_attr){//function to make scale
    var dstring = [];//domain for ordinal scale
    if(x_attr == "name" || x_attr == "mfr" || x_attr == "type" || x_attr == "shelf"){//if attributes are ordinal
        for(i=0; i<cerealRecords.length;i++){//checking all the records
            var flag = true;
            for(j=0;j<dstring.length;j++){
                if(dstring[j] == cerealRecords[i][x_attr]){//if the records is previously noted for doain
                    flag = false;
                    break;
                }
                    
            }
            if(flag){//only when the domain value is unseen before
                dstring.push(cerealRecords[i][x_attr]);//pushing values for domain
            }
            
        }
        dstring.sort();
        var xScale = d3.scaleBand()
                .domain(dstring)//domain data
                .range([0,width]);//pixel range
        return xScale;
    }
    else{//if attributes are nominal
        var lowerBound = findMin(x_attr);
        var upperBound = findMax(x_attr);
        console.log(lowerBound);
        console.log(upperBound);
        var xScale = d3.scaleLinear()
                    .domain([lowerBound, upperBound])//domain range
                    .range([0,width]);//pixel range
        return xScale;
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