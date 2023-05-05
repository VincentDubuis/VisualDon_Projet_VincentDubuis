import { csv } from "d3-fetch";
import { timeParse } from "d3-time-format";
import { scaleTime, scaleLinear } from "d3-scale";
import { extent } from "d3-array";
import { axisBottom, axisLeft } from "d3-axis";
import { select } from "d3-selection";
import { line } from "d3-shape";
import { csv } from 'd3';
import { timeParse } from 'd3-time-format';
import { scaleTime, scaleLinear } from 'd3-scale';
import { extent } from 'd3-array';
import { axisBottom, axisLeft } from 'd3-axis';
import { select } from 'd3-selection';
import { line } from 'd3-shape';
import { csv } from 'd3';
import { newData } from './data.js';

// Marges et translations
const margin = { top: 10, right: 40, bottom: 30, left: 40 },
    width = 450 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;



// Charger les données depuis un fichier CSV
/*d3.csv("..\data\data_russianLost.csv").then(data => {
    // Convertir les chaînes de caractères en dates et les valeurs numériques
    data.forEach(d => {
        d.date = d3.timeParse("%Y-%m-%d")(d.date);
        d.value = +d.value;

    });
    // Echelle de temps
    const timeScale = d3.scaleTime()
        .domain(d3.extent(data, d => d.date))
        .range([0, width]);

});
*/


// Ajouter le svg
const monSvg = d3.select("#myDiv")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .style("background-color", "lightgrey")
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


// Dessiner les rectangles
monSvg
    .selectAll('rect')
    .data(myNewData)
    .join(enter => enter.append('rect')
        .attr('x', d => bandScale(d.day))
        .attr('y', d => height - d.value)
        .attr('width', bandScale.bandwidth())
        .attr('height', d => d.value));

// Dessiner l'axe X
const axisBottom = d3.axisBottom(bandScale)
const xAxis = monSvg.append('g')
    .attr("transform", "translate(0," + height + ")")
    .call(axisBottom)