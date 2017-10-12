function loadData() {

    function init() {//called when page is loaded

        var xHttp = new XMLHttpRequest();//http request handler
        xHttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {//if the record is good
                var records = this.responseText.split("\n");//array for each entry
                records.pop(records.length - 1);//droping last empty record
                for (i = 0; i < records.length; i++) {
                    var individualRec = records[i].split(" ");//to separate values in perticular entry
                    var j = 0;

                    cerealRecords.push(new cereal(individualRec[j], individualRec[j + 1], individualRec[j + 2], parseFloat(individualRec[j + 3]),
                        parseFloat(individualRec[j + 4]), parseFloat(individualRec[j + 5]), parseFloat(individualRec[j + 6]),
                        parseFloat(individualRec[j + 7]), parseFloat(individualRec[j + 8]), parseFloat(individualRec[j + 9]),
                        parseFloat(individualRec[j + 10]), parseFloat(individualRec[j + 11]), parseFloat(individualRec[j + 12]),
                        parseFloat(individualRec[j + 13]), parseFloat(individualRec[j + 14])));//making new cereal object and pushing to array

                }
            }
        };

        xHttp.open("GET", "cereal.csv", true);
        xHttp.send();

    }

    window.onload = init;//calling init when page is loaded

}