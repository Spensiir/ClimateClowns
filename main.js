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
    console.log(chartScales.y);
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

var svg = d3.select('svg');

// Get layout parameters
var svgWidth = +svg.attr('width');
var svgHeight = +svg.attr('height');

var padding = {t: 40, r: 40, b: 40, l: 40};

// Compute chart dimensions
var chartWidth = svgWidth - padding.l - padding.r;
var chartHeight = svgHeight - padding.t - padding.b;

// Create a group element for appending chart elements
var chartG = svg.append('g')
    .attr('transform', 'translate('+[padding.l, padding.t]+')');

// Create groups for the x- and y-axes
var xAxisG = chartG.append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate('+[0, chartHeight]+')');
var yAxisG = chartG.append('g')
    .attr('class', 'y axis');

d3.csv('vehicles_parsed.csv', dataPreprocessor).then(function(dataset) {
    // **** Your JavaScript code goes here ****
    cars = dataset;
    //console.log(cars);
    xScale = d3.scaleLinear()
    .range([0, chartWidth]);

	yScale = d3.scaleLinear()
    .range([chartHeight, 0]);

    domainMap = {};

	dataset.columns.forEach(function(column) {
        //console.log(column);
    	domainMap[column] = d3.extent(dataset, function(data_element){
            //console.log(data_element[column]);
        	return data_element[column];
    	});
	});
    // Create global object called chartScales to keep state
    chartScales = {x: 'year', y: 'city08'};
    updateChart();
});


function updateChart() {
    console.log(chartScales.y);
    // **** Draw and Update your chart here ****
	yScale.domain(domainMap[chartScales.y]).nice();
	xScale.domain(domainMap[chartScales.x]).nice();

	xAxisG.transition()
    .duration(750)
    .call(d3.axisBottom(xScale)).
    call(d3.axisBottom(xScale));
	yAxisG.transition()
    .duration(750)
    .call(d3.axisLeft(yScale))
    .call(d3.axisLeft(yScale));
    
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