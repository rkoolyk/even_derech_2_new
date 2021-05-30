

function average(array, size) {
    let i;
    let counter = 0;
    let x = 0;
    for (i = 0; i < size; i++) {
        x = parseFloat(array[i]);
        counter += x;
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
    const u = average(arr, size);
    let sigma = 0.0;
    let i;
    for (i = 0; i < size; i++) {
        sigma += parseFloat(arr[i]) * parseFloat(arr[i]);
    }
    const div = sigma / size;
    return div - (u * u);
}

function cov(x, y, size) {
    let sum = 0;
    let i;
    for (i = 0; i < size; i++) {
        sum += parseFloat(x[i]) * parseFloat(y[i]);
    }

    sum /= size;

    return sum - average(x, size) * average(y, size);
}

function dev(p, l) {
    return Math.abs(p.y - (l.a * p.x + l.b));
}


function linear_reg(points, size) {
    let a = 0;
    let x, y;
    let i;
    for (i = 0; i < size; i++) {
        x[i] = parseFloat(points[i].x);
        y[i] = parseFloat(points[i].y);
    }
    if (variance(x, size) == 0) {
        a = cov(x, y, size) / 0.01;
    } else {
        a = cov(x, y, size) / variance(x, size);
    }
    const b = average(y, size) - a * (average(x, size));

    return new Line(a, b);
}

const methods = {
    Point: function (x, y) {
        this.x = x;
        this.y = y;
    },


    pearson: function (x, y, size) {
        return cov(x, y, size) / (Math.sqrt(variance(x, size)) * Math.sqrt(variance(y, size)));
    },

    linear_reg: function (points, size) {
        let x = [];
        let y = [];
        let i;
        for (i = 0; i < size; i++) {
            x[i] = parseFloat(points[i].x);
            y[i] = parseFloat(points[i].y);
        }
        const a = cov(x, y, size) / variance(x, size);
        const b = average(y, size) - a * (average(x, size));

        return new Line(a, b);
    },

    dev: function (p, points, size) {
        const l = linear_reg(points, size);
        return dev(p, l);
    },

    dev: function (p, l) {
    return Math.abs(p.y - (l.a * p.x + l.b));
    }


};

module.exports = methods;