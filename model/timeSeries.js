let titles = [];
//helper function to make an empty 2d array
function create2dArr(rows, cols) {
    let array = [rows, cols], i, l;
    for (i = 0, l = rows; i < l; i++) {
        array[i] = new Array(cols);
    }
    return array;
}

function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

function parseCSV(file) {
    const data = file.split("\n").map(function (row) { return row.split(","); });
    const headers = data[0]; //array of titles to be made keys
    titles = headers;
    let dict = {};
    //2d array with rows from csv, rows-1 because remove title row
    let array = create2dArr(data.length - 1, headers.length);
    for (let i = 1; i < data.length; i++) {
        array[i - 1] = data[i];
    }
    //document.write(array.toString());
    let colArray = create2dArr(headers.length, data.length - 1);
    for (let i = 0; i < headers.length; i++) {
        for (let j = 0; j < array.length; j++) {
            colArray[i][j] = array[j][i];
        }
    }
    for (let i = 0; i < headers.length; i++) {
        dict[headers[i]] = colArray[i]; //put keys and values into dictionary
    }
    const dictJSON = JSON.stringify(dict); //turn dictionary into json string

    let jsonItems = [];
    for (let i = 0; i < headers.length; i++) {
        let obj = {};
        for (let j = 0; j < data.length; j++) {
            obj[headers[i]] = array[i][j];
        }
        jsonItems[i] = JSON.stringify(obj);
    }

    return dict;
}

const methods = {

    //given string of csv file, split it into dictionary where keys are titles and values are columns

    sum: function(a ,b) {
        return a+b;
    },

    Timseries: function (csvfile) {
        var stringFile = document.querySelector('#files > input[type="file"]').files[0];
        getBase64(csvfile).then(
            data => console.log(data)
        );
        this.ts = parseCSV(stringFile);
        this.atts = titles;
        this.dataRowSize = this.ts[titles[0]].length - 1;
    },

    getAttributeData: function (timeseries, name) {
        return timeseries.ts[name];
    },

    gettAttributes: function () {
        return titles;
    },

    getRowSize: function (ts) {
        return ts.dataRowSize;
    }
};

module.exports = methods;
