/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.681859649122807, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.9873417721518988, 500, 1500, "query-1"], "isController": false}, {"data": [0.952054794520548, 500, 1500, "query-2"], "isController": false}, {"data": [0.9929577464788732, 500, 1500, "query-3"], "isController": false}, {"data": [0.9936708860759493, 500, 1500, "query-4"], "isController": false}, {"data": [0.44506666666666667, 500, 1500, "add-message"], "isController": false}, {"data": [0.7491111111111111, 500, 1500, "visite-root"], "isController": false}, {"data": [0.7434666666666667, 500, 1500, "add-message-1"], "isController": false}, {"data": [0.7576, 500, 1500, "add-message-0"], "isController": false}, {"data": [0.9802631578947368, 500, 1500, "query-10"], "isController": false}, {"data": [0.9651162790697675, 500, 1500, "query-9"], "isController": false}, {"data": [0.9863013698630136, 500, 1500, "query-5"], "isController": false}, {"data": [0.9726027397260274, 500, 1500, "query-6"], "isController": false}, {"data": [0.9594594594594594, 500, 1500, "query-7"], "isController": false}, {"data": [0.9848484848484849, 500, 1500, "query-8"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 14250, 0, 0.0, 769.7044210526303, 1, 12665, 595.0, 1406.0, 1895.0, 4097.49, 111.52590922964946, 105.22105731453438, 21.777252798909004], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["query-1", 79, 0, 0.0, 103.78481012658226, 2, 701, 96.0, 205.0, 294.0, 701.0, 0.770003021530844, 0.10903363097848866, 0.09249059731278693], "isController": false}, {"data": ["query-2", 73, 0, 0.0, 208.6849315068493, 1, 3201, 97.0, 255.60000000000073, 1370.2999999999975, 3201.0, 0.6880236755544246, 0.09742522749549958, 0.08264346884100998], "isController": false}, {"data": ["query-3", 71, 0, 0.0, 113.67605633802813, 2, 700, 97.0, 205.6, 296.79999999999995, 700.0, 0.6892936196652557, 0.09760505356588094, 0.08279601095588521], "isController": false}, {"data": ["query-4", 79, 0, 0.0, 86.74683544303798, 3, 1100, 93.0, 196.0, 201.0, 1100.0, 0.7899131095579486, 0.11185293055263922, 0.09488214108948016], "isController": false}, {"data": ["add-message", 3750, 0, 0.0, 1254.3589333333332, 98, 12665, 1003.0, 1994.8000000000002, 2693.45, 5847.979999999978, 29.349612585113878, 41.64549520133834, 9.57301816741019], "isController": false}, {"data": ["visite-root", 2250, 0, 0.0, 648.9262222222234, 2, 12390, 497.0, 1105.0, 1396.0, 2695.4699999999993, 17.64802773485603, 21.146611358074562, 1.9302530334998784], "isController": false}, {"data": ["add-message-1", 3750, 0, 0.0, 625.4143999999991, 3, 6857, 497.0, 1194.9, 1406.0, 2950.9799999999777, 30.76973570848342, 36.86959542413003, 3.3654398431153743], "isController": false}, {"data": ["add-message-0", 3750, 0, 0.0, 628.8050666666669, 2, 8155, 493.0, 1107.0, 1403.4499999999998, 3499.0, 29.351909830933, 6.478058224405134, 6.363402326628052], "isController": false}, {"data": ["query-10", 76, 0, 0.0, 123.07894736842103, 3, 3100, 96.5, 191.89999999999998, 212.49999999999923, 3100.0, 0.7224197258607251, 0.10300124997623619, 0.08748051367844718], "isController": false}, {"data": ["query-9", 86, 0, 0.0, 168.47674418604646, 3, 2100, 97.5, 232.09999999999974, 428.44999999999834, 2100.0, 0.8310061938950034, 0.11767177550271042, 0.09981812680574746], "isController": false}, {"data": ["query-5", 73, 0, 0.0, 111.09589041095889, 2, 1799, 96.0, 197.0, 231.49999999999972, 1799.0, 0.6951321703359488, 0.0984318014635865, 0.08349732124152509], "isController": false}, {"data": ["query-6", 73, 0, 0.0, 155.9315068493151, 3, 2795, 97.0, 197.60000000000002, 297.3, 2795.0, 0.6939229460356087, 0.09826057341324537, 0.0833520726195116], "isController": false}, {"data": ["query-7", 74, 0, 0.0, 161.98648648648654, 3, 1597, 97.0, 205.5, 1498.5, 1597.0, 0.7101659293096996, 0.100560605224518, 0.08530313408700493], "isController": false}, {"data": ["query-8", 66, 0, 0.0, 111.43939393939392, 1, 1797, 97.0, 195.9, 303.2, 1797.0, 0.6352445210160063, 0.08995161674543056, 0.0763037852392273], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 14250, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
