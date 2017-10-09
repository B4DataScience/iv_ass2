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

    console.log(mark_attr,x_attr,y_attr,brightness_attr,color_attr);
    

}
function makeScale(){

}