# Vehicle Visualizations

## How to run on local machine

**Prerequisites**

Ensure your machine has some version of python. Run in command line:

> python --version

Refer to this [link](https://www.python.org/downloads/) if your machine does not yet have python installed.

Clone repository into a local directory:

> git clone https://github.com/Spensiir/ClimateClowns.git

Start a local server on local machine:

> python -m SimpleHTTPServer 8080

## System Design

Our information visualization was created using the **d3.js** library. We brought in data from the US Department of Energy which listed millions of vehicles registered in the United States from 1984 to the present year. Before reading data into the application, we used a python data parser to clean up the information. This cleanup process filtered our data into rows by year and type of car, and the associated averages in mpg, fuelcost, and vehicle cost. Our application uses d3 to read in the cleaned data, and then displays each row in a graph as a dot. Each dot represents a vehicle type, while its position on the x axis represents the state of that vehicle type in that year and its position on the y-axis represents that vehicle type's value of either mpg, fuelcost, and vehicle cost. The years are made clickable so that users can select a specific year and see a subgraph that breaks down the information in the form of a bar graph for each vehicle type. This is done by passing the year clicked as a number parameter into a function that redefines the x and y axises. Before transitioning to the subgraph, the application iterates through the rows, filters the data based on year, and then find the average cost, fuelCost, and mpg for each vehicle type. Then, according to whatever y-axis was selected in the primary graph, the secondary graph will display bar graphs for each vehicle type according to that y-axis type. Users can shift back and forth between the primary and subgraph to select different y-axis types and drill down into different years. 



