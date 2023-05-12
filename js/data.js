import * as d3 from 'd3';

export function getDataCSV() {
    return d3.csv("../donnee/data.csv").then(function(data) {
        return data;
    });
}