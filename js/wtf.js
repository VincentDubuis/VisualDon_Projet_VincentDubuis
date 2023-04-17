import * as d3 from 'd3';

// Importer les données du fichier CSV avec D3.js
d3.csv("donnee/tamere.csv", function(error, csvData) {
    if (error) throw error;

    // Convertir les données en format approprié
    var data = csvData.map(function(d) {
        return {
            date: d.date,
            value: +d.value,
            total: +d.total
        };
    });

    // Utiliser les données dans votre code
    console.log(data);
});