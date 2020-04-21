/**
 * Update XScale when changed
 * @param {void}
 * @return {void}
 */
function onXScaleChanged() {
    var select = d3.select('#xScaleSelect').node();
    // Get current value of select element, save to global chartScales
    chartScales.x = select.options[select.selectedIndex].value
    // Update chart
    updateChart();
}

/**
 * Update YScale when changed
 * @param {void}
 * @return {void}
 */
function onYScaleChanged() {
    var select = d3.select('#yScaleSelect').node();
    // Get current value of select element, save to global chartScales
    chartScales.y = select.options[select.selectedIndex].value
    console.log(chartScales.y);
    if(chartScales.y == "city08"){
        document.getElementsByClassName("title")[0].innerHTML = "City (MPG) Vs. Years";
    }else if(chartScales.y == "highway08"){
        document.getElementsByClassName("title")[0].innerHTML = "Highway (MPG) Vs. Years";
    }else if(chartScales.y == "fuelCost08"){
        document.getElementsByClassName("title")[0].innerHTML = "Fuel Cost (Dollars) Vs. Years";
    }
    updateChart();
}

/**
 * Load data and use this function to process each row
 * hide y label
 * @param {[String]} row data to be display at y-axis
 * @return {void}
 */
function dataPreprocessor(row) {
    return {
        'fuelType': row['fuelType'],
        'city08': +row['city08'],
        'highway08': +row['highway08'],
        'VClass': row['VClass'],
        'fuelCost08': +row['fuelCost08'],
        // 'score': +row['score'],
        
        // 'displacement (cc)': +row['displacement (cc)'],
        // 'power (hp)': +row['power (hp)'],
        // 'weight (lb)': +row['weight (lb)'],
        // '0-60 mph (s)': +row['0-60 mph (s)'],
        'year': +row['year']
    };
}

// Colors for different cars
var colors = {
    "Electricity": '#0dbd00',
    "CNG": '#0058bd',
    "Diesel": '#00bdb4',
    "Gasoline or E85": '#8b00bd',
    "Gasoline or natural gas": '#de0b91',
    "Midgrade": '#33FFFF',
    "Premium": '#de860b',
    "Else": '#ffa785'
    }

var svg = d3.select('svg#svgGraph')
    .attr('width', document.getElementById("svgGraph").clientWidth);

// SVG for keys
var keysSvg = d3.select("#keys")                

// SVG for axis
var underXAxis = d3.select('#xAxis');

// Get layout parameters
var svgWidth = +svg.attr('width');
var svgHeight = +svg.attr('height');

// padding in chart
var padding = {t: 40, r: 40, b: 40, l: 60};

// Compute chart dimensions
var chartWidth = svgWidth - padding.l - padding.r ;
var chartHeight = svgHeight - padding.t - padding.b;

// Create a group element for appending chart elements
var chartG = svg.append('g')
    .attr('transform', 'translate('+[padding.l, padding.t]+')');

// Create groups for the x- and y-axes
var xAxisG = chartG.append('g')
    .attr('id', 'xaxis')
    .attr('class', 'xaxis')
    .attr('transform', 'translate('+[0, chartHeight]+')');

// create y-axis
var yAxisG = chartG.append('g')
    .attr('class', 'y axis');

// Read CSV data
d3.csv('vehicles_parsed.csv', dataPreprocessor).then(function(dataset) {
    // **** Your JavaScript code goes here ****
    cars = dataset;
    xScale = d3.scaleLinear().range([0, chartWidth]);
    yScale = d3.scaleLinear().range([chartHeight, 0]);

    domainMap = {};

    dataset.columns.forEach(function(column) {
        domainMap[column] = d3.extent(dataset, function(data_element) {
            return data_element[column];
        });
    });

    chartScales = {x: 'year', y: 'city08'};
    underXAxis.append('button')
        .attr("id", "returnButton")
        .style("display", "none")
        .text("click here to return")
        .on("click", function() {
            updateChart();
        });
    updateChart();
});

/**
 * show return button
 * @param {void}
 * @return {void}
 */
function showReturnButton() {
    document.getElementById("returnButton").style.display = "inline";
}

/**
 * hide return button
 * @param {void}
 * @return {void}
 */
function hideReturnButton() {
    document.getElementById("returnButton").style.display = "none";
}

/**
 * show y label
 * @param {void}
 * @return {void}
 */
function showYLabel() {
    document.getElementById("yScaleSelect").style.display = "inline";
}

/**
 * hide y label
 * @param {void}
 * @return {void}
 */
function hideYLabel() {
    document.getElementById("yScaleSelect").style.display = "none";
}

/**
 * show sub y label
 * @param {void}
 * @return {void}
 */
function showSubYLabel() {
    document.getElementById("ySubgraph").style.display = "inline";
}

/**
 * hide sub y label
 * @param {void}
 * @return {void}
 */
function hideSubYLabel() {
    document.getElementById("ySubgraph").style.display = "none";
}

/**
 * Calls a makeSubGraph function and pass in selected year.
 * @param {void}
 * @return {void}
 */
function clickMe(year) {
    makeSubGraph(year);
}

/**
 * update chart for different y-axis
 * @param {void}
 * @return {void}
 */
function updateChart() {
    // vehicle set to add different type of vehicles
    vehicleSet = new Set()
    // feul set to add different type of fuels
    fuelSet = new Set()

    hideSubYLabel();
    showYLabel();
    hideReturnButton();
    document.getElementById("year").innerHTML = "Years";

    // remove all the elements from subgraph
    svg.selectAll(".bar").remove();
    d3.select('#keys').selectAll(".barCategory").remove();
    d3.select('#keys').selectAll(".myLabels").remove();

    // Draw and Update chart
    xScale.domain(domainMap[chartScales.x]).nice;
    yScale.domain(domainMap[chartScales.y]).nice;
    xScale.domain(domainMap[chartScales.x]);
    
    var timeAxis = d3.axisBottom(xScale).ticks(30).tickFormat(d3.format("d"));

    // show transitions when circles are being replaced
    xAxisG.transition()
    .duration(750)
    .call(timeAxis);

    d3.selectAll(".tick text")
    .style("cursor", "pointer")
    .on("click", function(d) {
        clickMe(d);
    });

    yAxisG.transition()
    .duration(750)
    .call(d3.axisLeft(yScale))
    .attr("transform", "translate(-20)");
    
    // append circles elements
    var dots = chartG.selectAll('.dot')
    .data(cars);
    var dotsEnter = dots.enter()
    .append('g')
    .attr('class', 'dot')
    .attr('transform', function(d) {
        var tx = xScale(d[chartScales.x]);
        var ty = yScale(d[chartScales.y]);
        return 'translate('+[tx, ty]+')';
    });

    // add colors to the circles
    dotsEnter.append('circle')
        .attr('r', 3)
        .style('fill', function(d) {
            vehicleSet.add(d.VClass)
            fuelSet.add(d.fuelType)
            if (d.fuelType == 'Electricity') {
                return colors["Electricity"];
            } else if (d.fuelType == 'CNG') {
                return colors["CNG"];
            } else if (d.fuelType == 'Diesel') {
                return colors["Diesel"];
            } else if (d.fuelType == "Gasoline or E85") {
                return colors["Gasoline or E85"];
            } else if (d.fuelType == "Gasoline or natural gas") {
                return colors["Gasoline or natural gas"];
            } else if (d.fuelType == "Midgrade") {
                return colors["Midgrade"];
            } else if (d.fuelType == "Premium") {
                return colors["Premium"];
            } else {
                return colors["Else"];
            } 
        });
    // add vehicle type text to each circles
    dotsEnter.append('text')
    .text(function(d) {
        return d.VClass
    })
    .on('mouseover', function(d) {
        d3.select(this).transition().style('opacity', 1)
    })
    .on('mouseout', function(d) {
        d3.select(this).transition().style('opacity', 0)
    })
    
    // transitions of circles
    dots.merge(dotsEnter)
    .transition()
    .duration(750)
    .attr('transform', function(d) {
        var tx = xScale(d[chartScales.x]);
        var ty = yScale(d[chartScales.y]);
        return 'translate('+[tx, ty]+')';
    });

    // array of different types of fuels
    var keys = Array.from(fuelSet)

    // draw graph on key dimensions
    keysSvg.selectAll(".category")
    .data(Object.keys(colors))
    .enter()
    .append("circle")
    .attr("class", "category")
    .attr("cx", 20)
    .attr('cy', function(d, i) {
        return (i + 1) * 15
    })
    .attr("r", 3)
    .style("fill", function(d) {
        return colors[d]
    })

    // add text for each key dimension
    keysSvg.selectAll(".myLables")
    .data(Object.keys(colors))
    .enter()
    .append("text")
    .attr("class", "myLables")
    .attr("x", 30)
    .attr('y', function(d, i) {
        return (i + 1) * 15
    })
    .style("fill", function(d) { return colors[d]} )
    .text(function(d) { return d })
    .attr("text-anchor", 'left')
    .style("alignment-baseline", "middle")
}

/**
 * Generates a sub graph
 * @param {int} year - year selected by a user
 * @return {void}
 */
function makeSubGraph(year) 
{
    // hide all unnecessay labels from main graph
    hideYLabel();
    showSubYLabel();
    showReturnButton();
    document.getElementById("year").innerHTML = year;

    // remove all the existing dots and key dimensions from previous graph
    svg.selectAll(".dot").remove();
    d3.select('#keys').selectAll(".category").remove();
    d3.select('#keys').selectAll(".myLables").remove();

    // initialize data structures for data which will be filtered soon
    var highway08Array = []
    var city08Array = []
    var fuelCost08Array = []
    var fuelSet = new Set()
    var vehicleSet = new Set()

    // initialize dictionary
    // fuelTypeHighwayDict looks like [key: 'Diesel',
    //                                 value: [21, 21, 18, 21, 27, 27, 33]]
    var fuelTypeHighwayDict = new Map();
    var fuelTypeCityDict = new Map();
    var fuelTypeCostDict = new Map();

    // filter data based on selected year and selected y-axis
    cars.forEach(function(d) {
        if (d.year == year) {
            if (chartScales.y == "city08") {
                if (!fuelTypeCityDict.has(d.fuelType)) {
                    fuelTypeCityDict.set(d.fuelType, new Array)
                }
                fuelTypeCityDict.get(d.fuelType).push(d.city08)
            } else if (chartScales.y == "highway08") {
                if (!fuelTypeHighwayDict.has(d.fuelType)) {
                    fuelTypeHighwayDict.set(d.fuelType, new Array)   
                }
                fuelTypeHighwayDict.get(d.fuelType).push(d.highway08)
            } else if (chartScales.y == 'fuelCost08') {
                if (!fuelTypeCostDict.has(d.fuelType)) {
                    fuelTypeCostDict.set(d.fuelType, new Array)
                }
                fuelTypeCostDict.get(d.fuelType).push(d.fuelCost08)
            }
            highway08Array.push(d.highway08)
            city08Array.push(d.city08)
            fuelCost08Array.push(d.fuelCost08)
            fuelSet.add(d.fuelType)
            vehicleSet.add(d.VClass)
        }
    })

    // Array of different fuel types
    fuelArr = Array.from(fuelSet)
    // Array of different vehicle types
    vehicleArr = Array.from(vehicleSet)

    // make a scale for sub graph
    secondScale = d3.scaleBand().range([0, chartWidth]).domain(fuelArr);
    if (chartScales.y == 'city08') {
        yScale.domain(d3.extent(city08Array))
    } else if (chartScales.y == 'highway08') {
        yScale.domain(d3.extent(highway08Array))
    } else if (chartScales.y == 'fuelCost08') {
        yScale.domain(d3.extent(fuelCost08Array))
    }

    // transition functions for y and x axis
    xAxisG.transition().duration(750).call(d3.axisBottom(secondScale));
    yAxisG.transition().duration(750).call(d3.axisLeft(yScale)).attr("transform", "translate(-20)");

    // bar position
    var currentBarPosition = 0
    // Draw City Average Bars
    if (chartScales.y == "city08") {
        chartG
        .selectAll(".bar")
        .data(fuelArr).enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", function(d, i) {
            var middlePadding = chartWidth / fuelArr.length
            var edgePadding = (chartWidth - (middlePadding * (fuelArr.length - 1))) / 2
            if (i == 0) {
                currentBarPosition += edgePadding
                return currentBarPosition - 10
            } else {
                currentBarPosition += middlePadding
                return currentBarPosition - 10
            }
        })
        .attr("y", function(d, i) {
            var arr = fuelTypeCityDict.get(d)
            var total = 0;
            for (var i = 0; i < arr.length; i++) {
                total += arr[i];
            }
            var arrAvg = total / arr.length
            return yScale(arrAvg)
        })
        .attr("width", 20)
        .attr('height', function(d, i) {
            var arr = fuelTypeCityDict.get(d)
            var total = 0;
            for (var i = 0; i < arr.length; i++) {
                total += arr[i];
            }
            var arrAvg = total / arr.length;
            return chartHeight - yScale(arrAvg)
        })
        .attr("fill", 'orange')
    }

    // Draw Highway average bars
    if (chartScales.y == 'highway08') {
        chartG
        .selectAll(".bar")
        .data(fuelArr).enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", function(d, i) {
            var middlePadding = chartWidth / fuelArr.length
            var edgePadding = (chartWidth - (middlePadding * (fuelArr.length - 1))) / 2
            if (i == 0) {
                currentBarPosition += edgePadding
                return currentBarPosition - 10
            } else {
                currentBarPosition += middlePadding
                return currentBarPosition - 10
            }
        })
        .attr("y", function(d, i) {
            var arr = fuelTypeHighwayDict.get(d)
            var total = 0;
            for (var i = 0; i < arr.length; i++) {
                total += arr[i];
            }
            var arrAvg = total / arr.length
            return yScale(arrAvg)
        })
        .attr("width", 20)
        .attr('height', function(d, i) {
            var arr = fuelTypeHighwayDict.get(d)
            var total = 0;
            for (var i = 0; i < arr.length; i++) {
                total += arr[i];
            }
            var arrAvg = total / arr.length;
            return chartHeight - yScale(arrAvg)
        })
        .attr('fill', "orange")
    }

    // Draw annual cost average bars
    if (chartScales.y == 'fuelCost08') {
        chartG
        .selectAll(".bar")
        .data(fuelArr).enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", function(d, i) {
            var middlePadding = chartWidth / fuelArr.length
            var edgePadding = (chartWidth - (middlePadding * (fuelArr.length - 1))) / 2
            if (i == 0) {
                currentBarPosition += edgePadding
                return currentBarPosition - 10
            } else {
                currentBarPosition += middlePadding
                return currentBarPosition - 10
            }
        })
        .attr("y", function(d, i) {
            var arr = fuelTypeCostDict.get(d)
            var total = 0;
            for (var i = 0; i < arr.length; i++) {
                total += arr[i];
            }
            var arrAvg = total / arr.length
            return yScale(arrAvg)
        })
        .attr("width", 20)
        .attr('height', function(d, i) {
            var arr = fuelTypeCostDict.get(d)
            var total = 0;
            for (var i = 0; i < arr.length; i++) {
                total += arr[i];
            }
            var arrAvg = total / arr.length;
            return chartHeight - yScale(arrAvg)
        })
        .attr('fill', "orange")
    }

    var labelDict = {
        "city08" : ["Average City Mileage"],
        "highway08": ["Average Highway Mileage"],
        "fuelCost08": ["Annual Fuel Cost"]
    }

    // add key dimensions 
    keysSvg.selectAll(".barCategory")
    .data(labelDict[chartScales.y])
    .enter()
    .append("circle")
    .attr("class", "barCategory")
    .attr("cx", 20)
    .attr('cy', function(d, i) {
        return (i + 1) * 15
    })
    .attr("r", 3)
    .style("fill", "orange")

    // add text for each key dimension
    keysSvg.selectAll(".myLabels")
    .data(labelDict[chartScales.y])
    .enter()
    .append("text")
    .attr("class", "myLabels")
    .attr("x", 30)
    .attr('y', function(d, i) {
        return (i + 1) * 15
    })
    .style("fill", 'orange')
    .text(function(d) { return d })
    .attr("text-anchor", 'left')
    .style("alignment-baseline", "middle")

}
