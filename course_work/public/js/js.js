var oilCanvas = document.getElementById("oilChart");
var oilCanvas2 = document.getElementById("oilChart2");
var oilCanvas3 = document.getElementById("oilChart3");

Chart.defaults.global.defaultFontFamily = "Roboto";
Chart.defaults.global.defaultFontSize = 18;
Chart.defaults.global.defaultColor = ""
let dataViewed = [];
let dataLength = [];
let dataBytes = [];
let backgroundColor = [];
let labels = []
let dataSet = []
let objColor = {}
let objColor2 = {}
let objColor3 = {}
var oilData
var oilData2
var oilData3
fetch("/author").then(data => {
    return data.json();

}).then(value => {
    value.forEach(element => {
        labels.push(element.author);
        dataViewed.push(element.viewed);
        dataLength.push(element.len);
        dataBytes.push(element.byte);
        backgroundColor.push(getRandomColor())
    })
}).then(() => {
    objColor = {
        data: dataViewed,
        backgroundColor: backgroundColor
    }
    objColor2 = {
        data: dataBytes,
        backgroundColor: backgroundColor
    }
    objColor3 = {
        data: dataLength,
        backgroundColor: backgroundColor
    }
}).then(() => {
    oilData = {
        labels: labels,
        datasets: [objColor]
    };
    oilData2 = {
        labels: labels,
        datasets: [objColor2]
    };
    oilData3 = {
        labels: labels,
        datasets: [objColor3]
    };
    var pieChart = new Chart(oilCanvas, {
        type: 'pie',
        data: oilData,
        options: {
            title: {
                display: true,
                text: 'Переглядів',
                fontSize: 24
            }
        }
    });
    var pieChart = new Chart(oilCanvas2, {
        type: 'pie',
        data: oilData2,
        options: {
            legend: {
                display: false
            },
            title: {
                display: true,
                text: 'Обʼєм постів',
                fontSize: 24
            }
        }
    });
    var pieChart = new Chart(oilCanvas3, {
        type: 'pie',
        data: oilData3,
        options: {
            legend: {
                display: false
            },
            title: {
                display: true,
                text: 'Постів сьогодні',
                fontSize: 24
            }
        }
    });
})




function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}