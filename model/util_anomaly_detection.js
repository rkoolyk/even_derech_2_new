//import { sqrt, abs } from 'mathjs'

function average(array, size) {
    var i;
    var counter;
    for (i = 0; i < size; i++) {
        counter += array[i];
    }
    return counter / size;
}

function Point(x, y) {
    this.x = x;
    this.y = y;
}

function Line(a, b) {
    this.a = a;
    this.b = b;
}

function variance(arr, size) {
    var u = average(arr, size);
    var sigma = 0.0;
    var i;
    for (i = 0; i < size; i++) {
        sigma += arr[i] * arr[i];
    }
    var div = sigma / size;
    return div - (u * u);
}

function cov(x, y, size) {
    var sum = 0;
    var i;
    for (i = 0; i < size; i++) {
        sum += x[i] * y[i];
    }
    sum /= size;

    return sum - average(x, size) * average(y, size);
}

function dev(p, l) {
    return Math.abs(p.y - l.f(p.x));
}


function linear_reg(points, size) {
    var x, y;
    var i;
    for (i = 0; i < size; i++) {
        x[i] = points[i].x;
        y[i] = points[i].y;
    }
    if (variance(x, size) == 0) {
        a = cov(x, y, size) / 0.01;
    } else {
        var a = cov(x, y, size) / variance(x, size);
    }
    var b = average(y, size) - a * (average(x, size));

    return Line(a, b);
}

var methods = {
    Point: function (x, y) {
        this.x = x;
        this.y = y;
    },


    pearson: function (x, y, size) {
        return cov(x, y, size) / (Math.sqrt(variance(x, size)) * Math.sqrt(variance(y, size)));
    },

    linear_reg: function (points, size) {
        var x, y;
        var i;
        for (i = 0; i < size; i++) {
            x[i] = points[i].x;
            y[i] = points[i].y;
        }
        var a = cov(x, y, size) / variance(x, size);
        var b = average(y, size) - a * (average(x, size));

        return Line(a, b);
    },

    dev: function (p, points, size) {
        var l = linear_reg(points, size);
        return dev(p, l);
    },



};

module.exports = methods;