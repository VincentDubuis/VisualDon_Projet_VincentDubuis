import * as d3 from 'd3';
import { getDataCSV } from '/js/data.js';

const speed = 4000;
const speedBlood = 3000;
const margin = { top: 20, right: 60, bottom: 75, left: 60 };
const width = window.innerWidth - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;
let x, y, svg, axisBottom, interval, graphData; //Déclaration des variable pour le graphique
let isPlaying = false;
const playButton = document.querySelector("#playButton");
const rangeInput = document.getElementById('rangeInput');
const introTexts = document.querySelectorAll('.intro-text');
const gallery = document.querySelectorAll('.gallery');
const infoText = document.getElementById('info-text');
const previous = document.getElementById('previousButton');
const next = document.getElementById('nextButton');
let events; //La variable events contient les données du fichier csv
document.addEventListener('DOMContentLoaded', function() {
    //Charge les données et crée le graphique
    async function getData() {
        const dataText = await getDataCSV();
        return dataText;
    }
    //Event est une promesse qui contient les données
    const event = getData();
    //Quand on a les données, on les affiche dans la console et on crée le graphique
    event.then(function(result) {
        events = result;
        createGraph(result);
    });

    // Fonction pour afficher les sections en fonction de la valeur du rangeInput
    rangeInput.addEventListener('input', function() {
        const inputValue = parseInt(this.value);
        //Change le texte du label ayant l'id dateLabel en fonction de la valeur du rangeInput pour afficher une date
        const currentDate = getDateFromDayNumber(inputValue).slice(0)[0]; // Ici, on accède au premier élément du tableau
        document.getElementById('dateLabel').innerHTML = currentDate;
        // Met à jour le texte d'information
        updateContent(currentDate, events);
        // Ajoute cette ligne pour mettre à jour le graphique
        updateGraph(graphData, new Date(currentDate.split("/")[2], currentDate.split("/")[1] - 1, currentDate.split("/")[0]), speedBlood);
    });

    function updateContent(currentDate, events) {
        const inputDate = new Date(currentDate.split('/').reverse().join('-'));

        const filteredEvents = events.filter(event => {
            const eventDate = new Date(event.date);
            return eventDate <= inputDate;
        });
        let lastEventWithInfo = null;
        let lastEventWithPicture = null;
        // Mise à jour des événements
        for (let i = filteredEvents.length - 1; i >= 0; i--) {
            if (!lastEventWithInfo && filteredEvents[i].info) {
                lastEventWithInfo = filteredEvents[i];
            }
            if (!lastEventWithPicture && filteredEvents[i].picture) {
                lastEventWithPicture = filteredEvents[i];
            }
            if (lastEventWithInfo && lastEventWithPicture) {
                break;
            }
        }
        // Mise à jour du texte d'information
        if (lastEventWithInfo && lastEventWithInfo.info) {
            infoText.textContent = lastEventWithInfo.info;
        } else {
            infoText.textContent = '';
        }

        // Mise à jour des images
        const imageSection = document.getElementById('images0');
        if (lastEventWithPicture && lastEventWithPicture.picture) {
            imageSection.innerHTML = `<img src="img/${lastEventWithPicture.picture}" alt="${lastEventWithPicture.picture.split('.')[0]}">`;
        } else {}
    }

    //Bouton Play/Pause
    function togglePlay() {
        if (isPlaying) {
            clearInterval(interval);
            playButton.value = "Play";
        } else {
            interval = setInterval(function() {
                // Code à exécuter pendant la lecture
                rangeInput.value = parseInt(rangeInput.value) + 1;
                const event = new Event("input");
                rangeInput.dispatchEvent(event);
                if (rangeInput.value >= rangeInput.length) {
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
//Relie la valeur du rangeInput à une date, qu'on affiche dans le label et qu'on utilise pour mettre à jour le graphique
function getDateFromDayNumber(dayNumber) {
    const startDate = new Date(2022, 1, 23);
    startDate.setDate(startDate.getDate() + dayNumber - 1);
    const day = startDate.getDate().toString().padStart(2, '0');
    const month = (startDate.getMonth() + 1).toString().padStart(2, '0');
    const year = startDate.getFullYear();
    const newDate = [`${day}/${month}/${year}`]
    return newDate;
}

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
            return (i) % 30 === 0;
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
        .call(d3.axisLeft(y));

    // Ajoute la légende de l'axe des y
    svg.append("text")
        .attr("transform", "rotate(0)")
        .attr("y", height)
        .attr("x", margin.left)
        .attr("dy", "1em")
        .attr("z-index", "2")
        .style("text-anchor", "middle")
        .text("Russian injured or dead in Ukraine")
        .attr("font-size", "large");

    const tooltip = d3.select("#tooltip");

    const showTooltip = function(event, d) {
        tooltip
            .style("opacity", 1)
            .html(`Date: ${d3.timeFormat("%d/%m/%Y")(d.date)}<br>Injureds/deaths: ${d.value}`)
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
        .attr("z-index", "1")
        .on("mouseover", (event, d) => showTooltip(event, d))
        .on("mousemove", (event, d) => moveTooltip(event, d))
        .on("mouseleave", (event, d) => hideTooltip(event, d));
    updateGraph(graphData, new Date(2022, 1, 23), speed);

    svg.append("text")
        .attr("id", "total-counter")
        .attr("x", width / 2)
        .attr("y", height)
        .attr("text-anchor", "middle")
        .attr("font-size", "20px")
        .text("Total: 0");
}

function updateGraph(data, xMaxDate, animationDuration) {
    const filteredData = data.filter(d => d.date <= xMaxDate);
    x.domain(filteredData.map(d => d.date));
    // Affiche une date tous les 30 jours et inclut la première date
    axisBottom.tickValues(x.domain().filter((d, i) => {
        return i % 30 === 1 || i === 0;
    }));
    svg.select("g.x-axis").call(axisBottom)
        .attr("transform", "translate(25,-25)rotate(0)");

    const tooltip = d3.select("#tooltip");

    const showTooltip = function(event, d) {
        tooltip
            .style("opacity", 1)
            .html(`Date: ${d3.timeFormat("%d/%m/%Y")(d.date)}<br>Injureds/deaths: ${d.value}`)
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

    // Met à jour les barres existantes
    bars.attr("class", "bar")
        .attr("x", d => x(d.date))
        .attr("y", d => 0)
        .attr("width", x.bandwidth())
        .attr("height", d => y(d.value))
        .attr("z-index", "1");

    // Ajoute les nouvelles barres
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



    const total = filteredData.reduce((acc, d) => acc + d.value, 0);
    d3.select("#total-counter")
        .text(`Total: ${total}`);
}
previousButton.addEventListener("click", () => {
    rangeInput.value = parseInt(rangeInput.value) - 1;
    const event = new Event("input");
    rangeInput.dispatchEvent(event);;
});
nextButton.addEventListener("click", () => {
    rangeInput.value = parseInt(rangeInput.value) + 1;
    const event = new Event("input");
    rangeInput.dispatchEvent(event);;
});
/*window.addEventListener("scroll", () => {
    rangeInput.value = parseInt(rangeInput.value) + 1;
    const event = new Event("input");
    rangeInput.dispatchEvent(event);

});*/