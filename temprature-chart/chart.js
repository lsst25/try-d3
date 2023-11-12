async function drawLineChart() {
    const dataset = await d3.json("../my_weather_data.json")

    const yAccessor = d => d.temperatureMax;
    const dateParser = d3.timeParse("%Y-%m-%d");
    const xAccessor = d => dateParser(d.date);

    const width = window.innerWidth * 0.9;
    const height = 400;
    const margin = {
        top: 15,
        right: 15,
        bottom: 40,
        left: 60,
    };
    const dimensions = new Dimensions(width, height, margin);

    const svg = d3.select("#wrapper")
        .append("svg")
        .attr("width", dimensions.width)
        .attr("height", dimensions.height);

    const bounds = svg.append("g")
        .style("transform", translate(dimensions.margin.left, dimensions.margin.top));

    const yScale = d3.scaleLinear()
        .domain(d3.extent(dataset, yAccessor))
        .range([dimensions.boundedHeight, 0]);

    const xScale = d3.scaleTime()
        .domain(d3.extent(dataset, xAccessor))
        .range([0, dimensions.boundedWidth]);

    const freezingTemperaturePlacement = yScale(32);
    const freezingTemperatures = bounds.append("rect")
        .attr("x", 0)
        .attr("width", dimensions.boundedWidth)
        .attr("y", freezingTemperaturePlacement)
        .attr("height", dimensions.boundedHeight - freezingTemperaturePlacement)
        .attr("fill", "#e0f3f3");

    const lineGenerator = d3.line()
        .x(d => xScale(xAccessor(d)))
        .y(d => yScale(yAccessor(d)));

    const line = bounds.append("path")
        .attr("d", lineGenerator(dataset))
        .attr("fill", "none")
        .attr("stroke", "#af9358")
        .attr("stroke-width", 2);

    const yAxisGenerator = d3.axisLeft()
        .scale(yScale);

    const yAxis = bounds.append("g")
        .call(yAxisGenerator);

    const xAxisGenerator = d3.axisBottom()
        .scale(xScale);

    const xAxis = bounds.append("g")
        .call(xAxisGenerator)
        .style("transform", translateY(dimensions.boundedHeight));

}

drawLineChart().then();

class Dimensions {
    constructor(width, height, margin) {
        this.width = width;
        this.height = height;
        this.margin = margin;

        this.boundedWidth = this.width
            - this.margin.left
            - this.margin.right;
        this.boundedHeight = this.height
            - this.margin.top
            - this.margin.bottom;
    }
}

function translate(x, y) {
    return `translate(${x}px, ${y}px)`;
}

function translateY(y) {
    return `translateY(${y}px)`;
}