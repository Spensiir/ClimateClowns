// Global functions called when select elements changed
function onXScaleChanged() {
    var select = d3.select('#xScaleSelect').node();
    // Get current value of select element, save to global chartScales
    chartScales.x = select.options[select.selectedIndex].value
    // Update chart
    updateChart();
}

function onYScaleChanged() {
    var select = d3.select('#yScaleSelect').node();
    // Get current value of select element, save to global chartScales
    chartScales.y = select.options[select.selectedIndex].value
    // console.log(chartScales.y);
    // console.log(domainMap)
    // Update chart
    updateChart();
}

// Load data and use this function to process each row
function dataPreprocessor(row) {
    return {
        'fuelType': row['fuelType'],
        'city08': +row['city08'],
        'highway08': +row['highway08'],
        'VClass': row['VClass'],

        // 'displacement (cc)': +row['displacement (cc)'],
        // 'power (hp)': +row['power (hp)'],
        // 'weight (lb)': +row['weight (lb)'],
        // '0-60 mph (s)': +row['0-60 mph (s)'],
        'year': +row['year']
    };
}

var svg = d3.select('svg')
                        .attr('width', 1300);
                        
var underXAxis = d3.select('#xAxis');

// Get layout parameters
var svgWidth = +svg.attr('width');
var svgHeight = +svg.attr('height');

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

var yAxisG = chartG.append('g')
    .attr('class', 'y axis');

d3.csv('vehicles_parsed.csv', dataPreprocessor).then(function(dataset) {

    

    // **** Your JavaScript code goes here ****
    cars = dataset;
    //console.log(cars);
    xScale = d3.scaleLinear().range([0, chartWidth]);
    // xScale = d3.scaleBand().range([0, chartWidth]).padding(0.4);
	yScale = d3.scaleLinear().range([chartHeight, 0]);

    

    domainMap = {};

	dataset.columns.forEach(function(column) {
        //console.log(column);
    	domainMap[column] = d3.extent(dataset, function(data_element) {
            // console.log(data_element[column]);
        	return data_element[column];
    	});
	});
	// console.log(domainMap)
    // Create global object called chartScales to keep state
    chartScales = {x: 'year', y: 'city08'};
    underXAxis.append('button')
        .attr("id", "return")
        .style("display", "none")
        .text("click here to return")
        .on("click", function() {
            updateChart();
        });
    updateChart();
});

function showReturnButton() {
    document.getElementById("return").style.display = "inline";
}

function hideReturnButton() {
    document.getElementById("return").style.display = "none";
}

function clickMe(year) {
    // alert("the year is: " + year);
    makeSubGraph(year);
}
function updateChart() {
    hideReturnButton();

    console.log("updateCHARTTT");
	svg.selectAll(".bar").remove();

    console.log("gets here");
    // **** Draw and Update your chart here ****
    xScale.domain(domainMap[chartScales.x]);
	yScale.domain(domainMap[chartScales.y]).nice;
    
    var timeAxis = d3.axisBottom(xScale).ticks(30).tickFormat(d3.format("d"));
    //.tickFormat(d3.timeFormat());
    //var tickFormat = timeAxis.;

	xAxisG.transition()
    .duration(750)
    .call(timeAxis);

    d3.selectAll(".tick text")
    .style("cursor", "pointer")
    //.filter(function(d){ return typeof(d) == "string"; })
    .on("click", function(d) {
        clickMe(d);
    });

    //.attr("transform", "translate(0)");;
	yAxisG.transition()
    .duration(750)
    .call(d3.axisLeft(yScale))
    .attr("transform", "translate(-20)");
    
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
   
	dotsEnter.append('circle')
        .attr('r', 3)
        .style('fill', function(d) {
        	// console.log(d)
            // console.log("d.fuelType: " + d.fuelType);
            if (d.fuelType == 'Electricity') {
                return '#0dbd00';
            } else if (d.fuelType == 'CNG') {
                return '#0058bd';
            } else if (d.fuelType == 'Diesel') {
                return '#00bdb4';
            } else if (d.fuelType == "Gasoline or E85") {
                return '#8b00bd';
            } else if (d.fuelType == "Gasoline or natural gas") {
                return '#de0b91';
            } else if (d.fuelType == "Midgrade") {
                return '#de0b91';
            } else if (d.fuelType == "Midgrade") {
                return '#de0b91';
            } else if (d.fuelType == "Premium") {
                return '#de860b';
            } else {
                return '#ffa785';
            } 
        });
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
    
    dots.merge(dotsEnter)
    .transition()
    .duration(750)
    .attr('transform', function(d) {
        var tx = xScale(d[chartScales.x]);
        var ty = yScale(d[chartScales.y]);
        return 'translate('+[tx, ty]+')';
    });

    // dotsEnter.append('text')
    // .attr('y', -10)
    // .text(function(d) {
    //     return d.name;
    // });
    
}
// Remember code outside of the data callback function will run before the data loads

function makeSubGraph(year) {
    showReturnButton();
	console.log(year)
	console.log("makeSubGraph")

	// remove all the existing dots
	svg.selectAll(".dot").remove();

	// filter data 
	var highway08Array = []
	var city08Array = []
	var fuelSet = new Set()
	var classSet = new Set()

	// initialize dictionary
	// fuelTypeHighwayDict looks like [key: 'Diesel',
	//       						   value: [21, 21, 18, 21, 27, 27, 33]]
 	var fuelTypeHighwayDict = new Map();
 	var fuelTypeCityDict = new Map();

    cars.forEach(function(d) {
    	if (d.year == year) {
    		if (fuelTypeHighwayDict.has(d.fuelType) && fuelTypeCityDict.has(d.fuelType)) {
    			fuelTypeHighwayDict.get(d.fuelType).push(d.highway08)
    			fuelTypeCityDict.get(d.fuelType).push(d.city08)
    		} else if (fuelTypeHighwayDict.has(d.fuelType) && !fuelTypeCityDict.has(d.fuelType)) {
    			fuelTypeHighwayDict.get(d.fuelType).push(d.highway08)
    			fuelTypeCityDict.set(d.fuelType, new Array)
    			fuelTypeCityDict.get(d.fuelType).push(d.city08)
    		} else if (!fuelTypeHighwayDict.has(d.fuelType) && fuelTypeCityDict.has(d.fuelType)) {
    			fuelTypeHighwayDict.set(d.fuelType, new Array)
    			fuelTypeHighwayDict.get(d.fuelType).push(d.highway08)
    			fuelTypeCityDict.get(d.fuelType).push(d.city08)
    		} else {
    			fuelTypeHighwayDict.set(d.fuelType, new Array)
    			fuelTypeCityDict.set(d.fuelType, new Array)
    			fuelTypeHighwayDict.get(d.fuelType).push(d.highway08)
    			fuelTypeCityDict.get(d.fuelType).push(d.city08)
    		}
    		highway08Array.push(d.highway08)
    		city08Array.push(d.city08)
    		fuelSet.add(d.fuelType)
    		classSet.add(d.VClass)
    	}
    })

	// just checking if we have correct data
    // console.log(highway08Array)
	// console.log(city08Array)
	// console.log(fuelSet)
	// console.log(classSet)
	// for (let v of fuelTypeHighwayDict) {
	// 	console.log(v)
	// }
	// for (let v of fuelTypeCityDict) {
	// 	console.log(v)
	// }

    fuelArr = Array.from(fuelSet)
    vehicleArr = Array.from(classSet)

	secondScale = d3.scaleBand().range([0, chartWidth]).domain(fuelArr);
	yScale.domain(d3.extent(city08Array))

	xAxisG.transition().duration(750).call(d3.axisBottom(secondScale));
    yAxisG.transition().duration(750).call(d3.axisLeft(yScale)).attr("transform", "translate(-20)");

	// draw bars
    chartG
    .selectAll(".bar")
    .data(fuelArr).enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", function(d, i) {
        return secondScale(d);
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


	// test test test test test 
 //    var data = {
 //  		"2011": "45",
 //  		"2012": "47",
 //  		"2013": "52",
 //  		"2014": "70",
 //  		"2015": "75",
 //  		"2016": "78"
	// };

	// var years = ["2011", '2012', '2013', '2014', '2015', '2016']

	// // remove all the existing dots
	// svg.selectAll(".dot").remove();

	// //  update doamin
	// arr = [1,2,3,4,5]
	// // xScale.domain([1, 5])

	// chartG.selectAll(".bar")
 //    .data(years).enter()
 //    .append("rect")
 //    .attr("class", "bar")
 //    .attr("x", function(d, i) {
 //    	return xScale(years[i])
 //    })
 //    .attr("y", function(d, i) {
 //    	return yScale(data[d])
 //    })
 //    .attr("width", 20)
 //    .attr('height', function(d, i) {
 //    	return chartHeight - yScale(data[d])
 //    })


	// // axis transition
	// // var timeAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));
	// var timeAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));
	// xAxisG.transition().duration(750).call(timeAxis);
 //    yAxisG.transition().duration(750).call(d3.axisLeft(yScale)).attr("transform", "translate(-20)");

}