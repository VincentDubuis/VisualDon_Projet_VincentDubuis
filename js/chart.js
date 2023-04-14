d3.csv("../data/data_russianLost.csv", d3.autoType)
    .then((data) => {
        data.forEach((d) => {
            d.date = d3.timeParse("%Y-%m-%d")(d.date);
            d.value = +d.value;
        });

        const margin = { top: 20, right: 20, bottom: 30, left: 50 },
            width = chartContainer.clientWidth - margin.left - margin.right,
            height = chartContainer.clientHeight - margin.top - margin.bottom;

        const x = d3
            .scaleBand()
            .domain(data.map((d) => d.date))
            .range([margin.left, width - margin.right])
            .padding(0.1);

        const y = d3
            .scaleLinear()
            .domain([0, d3.max(data, (d) => d.value)])
            .nice()
            .range([height - margin.bottom, margin.top]);

        const xAxis = (g) =>
            g
            .attr("transform", `translate(0,${height - margin.bottom})`)
            .call(d3.axisBottom(x).tickFormat(d3.timeFormat("%Y-%m-%d")))
            .attr("font-size", "12px");

        const yAxis = (g) =>
            g
            .attr("transform", `translate(${margin.left},0)`)
            .call(d3.axisLeft(y))
            .attr("font-size", "12px");

        const svg = d3
            .select("#chartContainer")
            .append("svg")
            .attr("width", width)
            .attr("height", height);

        svg.append("g").call(xAxis);
        svg.append("g").call(yAxis);

        svg
            .append("g")
            .selectAll("rect")
            .data(data)
            .join("rect")
            .attr("x", (d) => x(d.date))
            .attr("y", (d) => y(d.value))
            .attr("height", (d) => y(0) - y(d.value))
            .attr("width", x.bandwidth())
            .attr("fill", "steelblue");
    })
    .catch((error) => {
        console.error("Error loading data:", error);
    });