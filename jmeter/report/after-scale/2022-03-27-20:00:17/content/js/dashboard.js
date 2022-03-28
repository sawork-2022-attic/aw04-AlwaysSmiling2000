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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.6927719298245614, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.8642857142857143, 500, 1500, "query-1"], "isController": false}, {"data": [0.9191176470588235, 500, 1500, "query-2"], "isController": false}, {"data": [0.9012345679012346, 500, 1500, "query-3"], "isController": false}, {"data": [0.8802816901408451, 500, 1500, "query-4"], "isController": false}, {"data": [0.5222666666666667, 500, 1500, "add-message"], "isController": false}, {"data": [0.7473333333333333, 500, 1500, "visite-root"], "isController": false}, {"data": [0.7345333333333334, 500, 1500, "add-message-1"], "isController": false}, {"data": [0.752, 500, 1500, "add-message-0"], "isController": false}, {"data": [0.8082191780821918, 500, 1500, "query-10"], "isController": false}, {"data": [0.8475609756097561, 500, 1500, "query-9"], "isController": false}, {"data": [0.9, 500, 1500, "query-5"], "isController": false}, {"data": [0.8972602739726028, 500, 1500, "query-6"], "isController": false}, {"data": [0.8626373626373627, 500, 1500, "query-7"], "isController": false}, {"data": [0.8947368421052632, 500, 1500, "query-8"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 14250, 0, 0.0, 749.9147368421003, 0, 11394, 402.0, 1905.0, 2506.899999999998, 4100.49, 111.151845120629, 104.86811717793265, 21.704187828580455], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["query-1", 70, 0, 0.0, 325.75714285714287, 1, 2997, 197.5, 798.8, 986.1000000000006, 2997.0, 0.6616819956328989, 0.09369520445973666, 0.0794793803348111], "isController": false}, {"data": ["query-2", 68, 0, 0.0, 238.3088235294117, 1, 1304, 100.0, 693.9, 796.55, 1304.0, 0.6421455215071533, 0.09092880919779027, 0.07713271400916002], "isController": false}, {"data": ["query-3", 81, 0, 0.0, 312.8518518518518, 1, 2790, 203.0, 602.6, 870.3999999999984, 2790.0, 0.7513705555504021, 0.10639524468242999, 0.09025251790302682], "isController": false}, {"data": ["query-4", 71, 0, 0.0, 302.3521126760562, 1, 2397, 97.0, 997.4, 1235.999999999999, 2397.0, 0.6866736945946207, 0.09723406808224609, 0.08248131292493979], "isController": false}, {"data": ["add-message", 3750, 0, 0.0, 1201.058933333334, 1, 11394, 898.0, 2691.9, 3299.3499999999995, 5898.49, 29.252082748291677, 41.507105696550596, 9.54120667766545], "isController": false}, {"data": ["visite-root", 2250, 0, 0.0, 636.7346666666663, 0, 10477, 297.0, 1601.0, 2190.0, 3700.0, 17.550975834256388, 21.030319676399007, 1.919637981871792], "isController": false}, {"data": ["add-message-1", 3750, 0, 0.0, 632.613066666666, 0, 8003, 300.0, 1606.0, 2194.45, 3796.959999999999, 30.006961615094703, 35.95560732589961, 3.2820114266509828], "isController": false}, {"data": ["add-message-0", 3750, 0, 0.0, 568.3205333333348, 0, 4894, 295.0, 1593.0, 2095.0, 3058.579999999991, 29.273319126015785, 6.460713010233952, 6.346364107397953], "isController": false}, {"data": ["query-10", 73, 0, 0.0, 475.90410958904096, 1, 2996, 205.0, 1484.2000000000025, 2523.6, 2996.0, 0.6860773293735081, 0.0978196192270822, 0.08307967660382323], "isController": false}, {"data": ["query-9", 82, 0, 0.0, 346.1341463414636, 1, 2705, 99.0, 795.0, 2004.35, 2705.0, 0.7684594262794381, 0.108815055479022, 0.0923051849925497], "isController": false}, {"data": ["query-5", 65, 0, 0.0, 294.9538461538461, 1, 2305, 102.0, 835.5999999999999, 995.4, 2305.0, 0.6190299324781197, 0.08765560567317124, 0.07435613446758664], "isController": false}, {"data": ["query-6", 73, 0, 0.0, 275.095890410959, 1, 1508, 97.0, 801.6, 1194.6, 1508.0, 0.6886727483702985, 0.09751713722040357, 0.08272143364213545], "isController": false}, {"data": ["query-7", 91, 0, 0.0, 351.31868131868134, 1, 1997, 200.0, 979.7999999999997, 1500.4, 1997.0, 0.8512230485010055, 0.12053451370375567, 0.10224651852111688], "isController": false}, {"data": ["query-8", 76, 0, 0.0, 342.0526315789473, 1, 5196, 195.0, 598.2, 1836.6499999999924, 5196.0, 0.7030657366463764, 0.09955520684934041, 0.08445027891357842], "isController": false}]}, function(index, item){
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
