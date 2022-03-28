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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.6539298245614035, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.9080459770114943, 500, 1500, "query-1"], "isController": false}, {"data": [0.8802816901408451, 500, 1500, "query-2"], "isController": false}, {"data": [0.8783783783783784, 500, 1500, "query-3"], "isController": false}, {"data": [0.8910256410256411, 500, 1500, "query-4"], "isController": false}, {"data": [0.43533333333333335, 500, 1500, "add-message"], "isController": false}, {"data": [0.7215555555555555, 500, 1500, "visite-root"], "isController": false}, {"data": [0.7122666666666667, 500, 1500, "add-message-1"], "isController": false}, {"data": [0.73, 500, 1500, "add-message-0"], "isController": false}, {"data": [0.7974683544303798, 500, 1500, "query-10"], "isController": false}, {"data": [0.8787878787878788, 500, 1500, "query-9"], "isController": false}, {"data": [0.9074074074074074, 500, 1500, "query-5"], "isController": false}, {"data": [0.8703703703703703, 500, 1500, "query-6"], "isController": false}, {"data": [0.7867647058823529, 500, 1500, "query-7"], "isController": false}, {"data": [0.9153846153846154, 500, 1500, "query-8"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 14250, 0, 0.0, 903.5756491228038, 1, 16163, 595.0, 1904.8999999999996, 2644.7999999999083, 4996.959999999999, 93.46223469842853, 93.95049673333094, 18.82649786553572], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["query-1", 87, 0, 0.0, 342.16091954022977, 2, 1299, 294.0, 697.4, 996.6, 1299.0, 0.7467939363765901, 0.1407531540241034, 0.09334924204707376], "isController": false}, {"data": ["query-2", 71, 0, 0.0, 402.056338028169, 2, 1997, 300.0, 803.8, 1200.0, 1997.0, 0.5877434789447108, 0.1107758705432902, 0.07346793486808884], "isController": false}, {"data": ["query-3", 74, 0, 0.0, 397.7027027027028, 3, 3003, 302.0, 700.5, 917.25, 3003.0, 0.6223508040099576, 0.11729854020890804, 0.07779385050124471], "isController": false}, {"data": ["query-4", 78, 0, 0.0, 359.0384615384616, 6, 1599, 299.0, 703.0, 811.1499999999994, 1599.0, 0.6441064262002676, 0.12139896509438637, 0.08051330327503345], "isController": false}, {"data": ["add-message", 3750, 0, 0.0, 1442.0895999999948, 7, 16163, 1002.0, 2802.9, 3599.0, 7095.49, 24.595647554208806, 37.3248879565772, 8.262600350242021], "isController": false}, {"data": ["visite-root", 2250, 0, 0.0, 771.1515555555555, 1, 15632, 404.0, 1597.0, 2102.0, 3952.9599999999773, 14.770273020291073, 18.390534891077444, 1.687619085326226], "isController": false}, {"data": ["add-message-1", 3750, 0, 0.0, 756.617333333333, 1, 10980, 497.0, 1599.9, 2102.0, 4302.0, 25.46135984030635, 31.7019921816651, 2.909159278628753], "isController": false}, {"data": ["add-message-0", 3750, 0, 0.0, 685.388266666666, 1, 7602, 403.0, 1499.0, 2097.45, 4496.409999999998, 24.611628502234737, 6.705149767912344, 5.45589811524149], "isController": false}, {"data": ["query-10", 79, 0, 0.0, 534.2658227848101, 7, 2695, 300.0, 1294.0, 2399.0, 2695.0, 0.6555635772195806, 0.12396355865219447, 0.08258564595832607], "isController": false}, {"data": ["query-9", 66, 0, 0.0, 498.2121212121213, 99, 5996, 348.5, 825.9000000000004, 1068.1999999999998, 5996.0, 0.5309819948832645, 0.10007766114499027, 0.06637274936040805], "isController": false}, {"data": ["query-5", 81, 0, 0.0, 413.83950617283944, 2, 6096, 298.0, 595.4, 788.5999999999992, 6096.0, 0.6459433164803265, 0.12174517586006157, 0.08074291456004083], "isController": false}, {"data": ["query-6", 81, 0, 0.0, 501.92592592592575, 4, 5998, 297.0, 1136.7999999999993, 1477.4999999999984, 5998.0, 0.6500906916643927, 0.12252685887815214, 0.08126133645804909], "isController": false}, {"data": ["query-7", 68, 0, 0.0, 542.4264705882355, 1, 3696, 301.0, 900.0, 2708.5499999999993, 3696.0, 0.5537639662529723, 0.10437152879572624, 0.06922049578162155], "isController": false}, {"data": ["query-8", 65, 0, 0.0, 363.1538461538462, 1, 6095, 200.0, 697.4, 798.1, 6095.0, 0.5183454413512069, 0.09769596697342084, 0.06479318016890087], "isController": false}]}, function(index, item){
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
