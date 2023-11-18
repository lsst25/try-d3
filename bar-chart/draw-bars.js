const BIN_LABEL_BOTTOM_GAP = 3;
const BIN_LABEL_FONT_COLOR = "darkgrey";
const BIN_LABEL_FONT_FAMILY = "sans-serif";

const LABEL_FONT_SIZE = "12px";

const AXIS_LABEL_FONT_COLOR = "black"
const AXIS_LABEL_FONT_SIZE = "1.4em"
const AXIS_LABEL_GAP = 10;

const BAR_COLOR = "cornflowerblue";
const BAR_PADDING = 1;

const MEAN_LINE_COLOR = "maroon";
const MEAN_LINE_DASHARRAY = "2px 4px";

async function drawBars() {
    const dataset = await d3.json("./../my_weather_data.json");

    const metricAccessor = d => d.humidity;
    const yAccessor = d => d.length;

    const width = 600;

    let dimensions = {
        width: width,
        height: width * 0.6,
        margin: {
            top: 30,
            right: 10,
            bottom: 50,
            left: 50,
        },
    };

    dimensions.boundedWidth = dimensions.width
        - dimensions.margin.left
        - dimensions.margin.right;

    dimensions.boundedHeight = dimensions.height
        - dimensions.margin.top
        - dimensions.margin.bottom;

    const wrapper = d3.select("#wrapper")
        .append("svg")
        .attr("width", dimensions.width)
        .attr("height", dimensions.height);

    const bounds = wrapper.append("g")
        .style("transform", `translate(${
            dimensions.margin.left
        }px, ${
            dimensions.margin.top
        }px)`);

    const xScale = d3.scaleLinear()
        .domain(d3.extent(dataset, metricAccessor))
        .range([0, dimensions.boundedWidth])
        .nice();

    const binsGenerator = d3.histogram()
        .domain(xScale.domain())
        .value(metricAccessor)
        .thresholds(12);

    const bins = binsGenerator(dataset);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(bins, yAccessor)])
        .range([dimensions.boundedHeight, 0])
        .nice();

    const binsGroup = bounds.append("g");

    const binGroups = binsGroup.selectAll("g")
        .data(bins)
        .enter().append("g");

    const barRects = binGroups.append("rect")
        .attr("x", d => xScale(d.x0) + BAR_PADDING / 2)
        .attr("y", d => yScale(yAccessor(d)))
        .attr("width", d => d3.max([
            0,
            xScale(d.x1) - xScale(d.x0) - BAR_PADDING
        ]))
        .attr("height", d => dimensions.boundedHeight
            - yScale(yAccessor(d)))
        .attr("fill", BAR_COLOR);

    const barCenterAccessor = (d) => xScale(d.x0) + (xScale(d.x1) - xScale(d.x0)) / 2;

    const barText = binGroups.filter(yAccessor)
        .append("text")
        .attr("x", barCenterAccessor)
        .attr("y", d => yScale(yAccessor(d)) - BIN_LABEL_BOTTOM_GAP)
        .text(yAccessor)
        .style("text-anchor", "middle")
        .attr("fill", BIN_LABEL_FONT_COLOR)
        .style("font-size", LABEL_FONT_SIZE)
        .style("font-family", BIN_LABEL_FONT_FAMILY);

    const mean = d3.mean(dataset, metricAccessor)

    const meanLine = bounds.append("line")
        .attr("x1", xScale(mean))
        .attr("x2", xScale(mean))
        .attr("y1", -15)
        .attr("y2", dimensions.boundedHeight)
        .attr("stroke", MEAN_LINE_COLOR)
        .attr("stroke-dasharray", MEAN_LINE_DASHARRAY);

    const meanLabel = bounds.append("text")
        .attr("x", xScale(mean))
        .attr("y", -20)
        .text("mean")
        .attr("fill", MEAN_LINE_COLOR)
        .attr("font-size", LABEL_FONT_SIZE)
        .style("text-anchor", "middle");

    const xAxisGenerator = d3.axisBottom()
        .scale(xScale);

    const xAxis = bounds.append("g")
        .call(xAxisGenerator)
        .style("transform", `translateY(${dimensions.boundedHeight}px`);

    const xAxisLabel = xAxis.append("text")
        .attr("x", dimensions.boundedWidth / 2)
        .attr("y", dimensions.margin.bottom - AXIS_LABEL_GAP)
        .attr("fill", AXIS_LABEL_FONT_COLOR)
        .attr("font-size", AXIS_LABEL_FONT_SIZE)
        .text("Humidity")
}

drawBars()