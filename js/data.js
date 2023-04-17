import * as d3 from 'd3';

export function getDataCSV() {
    d3.csv('../donnee/tamere.csv', (data) => {
        console.log(data);
        return data;
    });
}