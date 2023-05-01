import * as d3 from 'd3';
import { getDataCSV } from './js/data.js';

const speed = 2000;
document.addEventListener('DOMContentLoaded', function() {
    const rangeInput = document.getElementById('rangeInput');
    const introTexts = document.querySelectorAll('.intro-text');
    const gallery = document.querySelectorAll('.gallery');

    rangeInput.addEventListener('input', function() {
        const inputValue = this.value;
        console.log('Valeur du range input:', inputValue);
    });
    async function processData() {
        const data = await getDataCSV();
        console.log(data);
        createGraph(data);
    }

    processData();

    function showAppropriateSection(value) {
        const ranges = [
            { min: 1, max: 5 },
            { min: 6, max: 42 },
            { min: 43, max: 54 },
            { min: 55, max: 66 },
            { min: 67, max: 99 },
            { min: 100, max: 149 },
            { min: 150, max: 199 },
            { min: 200, max: 249 },
            { min: 250, max: 309 },
            { min: 310, max: 365 },
        ];
        const galleryRanges = [
            { min: 1, max: 100 },
            { min: 101, max: 255 },
            { min: 256, max: 365 }
        ];

        introTexts.forEach((text, index) => {
            if (value >= ranges[index].min && value <= ranges[index].max) {
                text.classList.add('active');
            } else {
                text.classList.remove('active');
            }
        });

        gallery.forEach((text, index) => {
            if (value >= galleryRanges[index].min && value <= galleryRanges[index].max) {
                text.classList.add('active');
            } else {
                text.classList.remove('active');
            }
        });
    }


    rangeInput.addEventListener('input', function() {
        const inputValue = parseInt(this.value);
        showAppropriateSection(inputValue);
        //showAppropriateGallery(inputValue);
        //Change le texte du label ayant l'id dateLabel en fonction de la valeur du rangeInput pour afficher une date
        const currentDate = getDateFromDayNumber(inputValue).slice(0)[0]; // Ici, on accède au premier élément du tableau
        document.getElementById('dateLabel').innerHTML = currentDate;

        // Ajoute cette ligne pour mettre à jour le graphique
        updateGraph(graphData, new Date(currentDate.split("/")[2], currentDate.split("/")[1] - 1, currentDate.split("/")[0]), speed);
    });


    // Affiche la section appropriée au chargement de la page
    showAppropriateSection(parseInt(rangeInput.value));
    //showAppropriateGallery(parseInt(rangeInput.value));

    let isPlaying = false;
    let interval;
    const playButton = document.querySelector("#playButton");

    function togglePlay() {

        if (isPlaying) {
            console.log("Paused");
            clearInterval(interval);
            playButton.value = "Play";
        } else {
            interval = setInterval(function() {
                // Code à exécuter pendant la lecture
                rangeInput.value = parseInt(rangeInput.value) + 1;
                const event = new Event("input");
                rangeInput.dispatchEvent(event);
                if (rangeInput.value >= 365) {
                    clearInterval(interval);
                    playButton.value = "Play";
                }
            }, speed);
            playButton.value = "Pause";
        }
        isPlaying = !isPlaying;
    }
    playButton.addEventListener("click", togglePlay);
});

function getDateFromDayNumber(dayNumber) {
    const startDate = new Date(2022, 1, 24); // 24 février 2022
    startDate.setDate(startDate.getDate() + dayNumber - 1);
    const day = startDate.getDate().toString().padStart(2, '0');
    const month = (startDate.getMonth() + 1).toString().padStart(2, '0');
    const year = startDate.getFullYear();
    const newDate = [`${day}/${month}/${year}` /*, day, month, year*/ ]
    return newDate;
}

let graphData;

const margin = { top: 20, right: 60, bottom: 75, left: 60 };
const width = window.innerWidth - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

let x, y, svg, axisBottom;

function createGraph(myData) {
    rangeInput.value = 1;
    const parseDate = d3.timeParse("%Y-%m-%d");
    const data = myData.map(d => {
        return {
            date: parseDate(d.date),
            value: +d.value
        }
    });

    graphData = data;

    svg = d3.select("#my_dataviz")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    x = d3.scaleBand()
        .range([0, width])
        .domain(data.map(d => d.date))
        .padding(0.1);

    const customTimeFormat = d3.timeFormat("%d/%m/%Y");

    axisBottom = d3.axisBottom(x)
        .tickValues(x.domain().filter((d, i) => {
            return (i - 1) % 30 === 0;
        }))
        .tickFormat(d => customTimeFormat(d));

    svg.append("g")
        .attr("transform", "translate(0,0)")
        .attr("class", "x-axis")
        .call(axisBottom)
        .selectAll("text")
        .attr("transform", "translate(25,-25)rotate(0)")
        .style("text-anchor", "end");

    y = d3.scaleLinear()
        .range([0, height])
        .domain([0, d3.max(data, d => +d.value)]);

    svg.append("g")
        .call(d3.axisLeft(y))

    const tooltip = d3.select("#tooltip");

    const showTooltip = function(event, d) {
        tooltip
            .style("opacity", 1)
            .html(`Date: ${d3.timeFormat("%d/%m/%Y")(d.date)}<br>Value: ${d.value}`)
            .style("left", (event.pageX) + "px")
            .style("top", (event.pageY - 50) + "px");
    };

    const moveTooltip = function(event, d) {
        tooltip
            .style("left", (event.pageX) + "px")
            .style("top", (event.pageY - 50) + "px");
    };

    const hideTooltip = function(event, d) {
        tooltip
            .style("opacity", 0);
    };


    svg.selectAll(".bar")
        .data(data)
        .join("rect")
        .attr("class", "bar")
        .attr("x", d => x(d.date))
        .attr("y", d => 0)
        .attr("width", x.bandwidth())
        .attr("height", d => y(d.value))
        .on("mouseover", (event, d) => showTooltip(event, d))
        .on("mousemove", (event, d) => moveTooltip(event, d))
        .on("mouseleave", (event, d) => hideTooltip(event, d));
    updateGraph(graphData, new Date(2022, 1, 24), speed);
}

function updateGraph(data, xMaxDate, animationDuration) {
    const filteredData = data.filter(d => d.date <= xMaxDate);
    x.domain(filteredData.map(d => d.date));

    axisBottom.tickValues(x.domain().filter((d, i) => {
        return i % 30 === 0 || i === 0; // Affiche une date tous les 30 jours et inclut la première date
    }));
    svg.select("g.x-axis").call(axisBottom)
        .attr("transform", "translate(25,-25)rotate(0)");

    const tooltip = d3.select("#tooltip");

    const showTooltip = function(event, d) {
        tooltip
            .style("opacity", 1)
            .html(`Date: ${d3.timeFormat("%d/%m/%Y")(d.date)}<br>Value: ${d.value}`)
            .style("left", (event.pageX) + "px")
            .style("top", (event.pageY - 50) + "px");
    };

    const moveTooltip = function(event, d) {
        tooltip
            .style("left", (event.pageX) + "px")
            .style("top", (event.pageY - 50) + "px");
    };

    const hideTooltip = function(event, d) {
        tooltip
            .style("opacity", 0);
    };

    const bars = svg.selectAll(".bar")
        .data(filteredData, d => d.date);


    bars.attr("class", "bar")
        .attr("x", d => x(d.date))
        .attr("y", d => 0)
        .attr("width", x.bandwidth())
        .attr("height", d => y(d.value));


    bars.enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", d => x(d.date))
        .attr("y", 0)
        .attr("width", x.bandwidth())
        .attr("height", 0)
        .transition()
        .duration(animationDuration)
        .attr("y", d => 0)
        .attr("height", d => y(d.value));

    // Supprime les barres inutiles
    bars.exit().remove();

    // Gère les infobulles pour les barres
    svg.selectAll(".bar")
        .on("mouseover", (event, d) => showTooltip(event, d))
        .on("mousemove", (event, d) => moveTooltip(event, d))
        .on("mouseleave", (event, d) => hideTooltip(event, d));

    svg.append("g")
        .call(d3.axisLeft(y));

    // Ajoutez la légende de l'axe des y
    svg.append("text")
        .attr("transform", "rotate(0)")
        .attr("y", height)
        .attr("x", margin.left)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Blessés/morts russes")
        .attr("font-size", "large");
}