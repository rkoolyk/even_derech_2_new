//import { abs } from 'mathjs'
//var math = require('./math.js');
const another = require('./util_anomaly_detection.js');

var another2 = require('./timeSeries.js');

let cf = [];


function SimpleAnomalyDetector() {
    this.threshold = 0.9;
}

function correlatedFeatures() {
    this.feature1 = '';
    this.feature2 = '';// names of the correlated features
    this.corrlation = 0;
    this.lin_reg = 0;
    this.threshold = 0.9;
}

function AnomalyReport(names, time) {
    this.description = names;
    this.timestep = time;
}

function toPoints(x, y) {
    const ps = [];
    let i;

    for (i = 0; i < x.length-1; i++) {
        ps[i] = new another.Point(parseFloat(x[i]), parseFloat(y[i]));
    }
    return ps;
}

function findThreshold(ps, len, rl) {
    let max = 0;
    let i;
    for (i = 0; i < len; i++) {
        const d = Math.abs(ps[i].y - (rl.a * ps[i].x + rl.b));
        if (d > max)
            max = d;
    }
    return max;
}

/*function learnNormal(ts) {
    var atts = another2.gettAttributes();
    var len = another2.getRowSize(ts);
    var i;
    for (i = 0; i < atts.length; i++) {
        var f1 = atts[i];
        var max = 0;
        var jmax = 0;
        var j;
        for (j = i + 1; j < atts.length; j++) {
            var p = getCorrelation(f1, atts[j], ts);
            if (p > max) {
                max = p;
                jmax = j;
            }
        }
        var f2 = atts[jmax];
        var ps = toPoints(another2.getAttributeData(ts, f1), another2.getAttributeData(ts,f2));
  
        learnHelper(ts, max, f1, f2, ps);
    }
}*/

function learnHelper(ts, p/*pearson*/, f1, f2, ps) {

    if (p > 0.9) {
        const len = another2.getRowSize(ts);
        const c = new correlatedFeatures();
        c.feature1 = f1;
        c.feature2 = f2;
        c.corrlation = p;
        c.lin_reg = another.linear_reg(ps, len);
        c.threshold = findThreshold(ps, len, c.lin_reg) * 1.1; // 10% increase
        cf[cf.length] = c;
    }
}

function getCorrelation(f1, f2, ts) {
    const colvector1 = ts.ts[f1];
    const colvector2 = ts.ts[f2];
    const size = colvector1.length - 1;
    // Compute the correlation of these two features
    return another.pearson(colvector1, colvector2, size);
}

/*function detect(ts) {
    var ar = [];
    var ContentMap = ts.ts;
    var s = cf.length;
    //for each correlated feature find new lin_reg according to new ts
    var i;
    for (i = 0; i < s; i++) {
        var feature1 = cf[i].feature1;
        var feature2 = cf[i].feature2;
        var f1 = ContentMap[feature1];
        var f2 = ContentMap[feature2];
        var s2 = f1.length;
        var l = another.linear_reg(toPoints(f1, f2), s2);
        //finding for each 2d point the dev to check if it is greater than the threshold
        var j;
        for (j = 0; j < s2; j++) {
            var p = new another.Point(f1[j], f2[j]);
            var points = toPoints(f1, f2);
            if (another.dev(p, l) > (1.1) * cf[i].threshold) {
                var features = feature1 + "-" + feature2;
                var report = new AnomalyReport(features, j + 1);
                ar[ar.length + 1] = report;
            }
        }
    }
    return ar;
}*/

function findingThreshhold(a, b) {
    points = toPoints(a, b);
    const l = another.linear_reg(points, a.length);
    const s = a.length;
    let max = 0;
    let i;
    for (i = 0; i < s; i++) {
        const p = points[i];
        const temp = another.dev(p, l);
        if (temp > max) {
            max = temp;
        }
    }
    return max;
}

const methods = {

    createDetector: function () {
        SimpleAnomalyDetector();
        return this;
    },

    learnNormal: function (ts) {
        cf = [];//emptying array from last call
        const atts = another2.gettAttributes();
        //var len = another2.getRowSize(ts);
        let i;
        for (i = 0; i < atts.length; i++) {
            const f1 = atts[i];
            let max = 0;
            let jmax = 0;
            let j;
            for (j = i + 1; j < atts.length; j++) {
                const p = getCorrelation(f1, atts[j], ts);
                if (p > max) {
                    max = p;
                    jmax = j;
                }

            }
            const f2 = atts[jmax];
            const ps = toPoints(another2.getAttributeData(ts, f1), another2.getAttributeData(ts, f2));
            learnHelper(ts, max, f1, f2, ps);
        }
        //return cf;
        //let cfmyJSON = JSON.stringify(cf);
        return JSON.stringify(cf);
    },

    detect: function (ts) {
        const ar = [];
        const ContentMap = ts.ts;
        const s = cf.length;
        //for each correlated feature find new lin_reg according to new ts
        let i;
        for (i = 0; i < s; i++) {
            const feature1 = cf[i].feature1;
            const feature2 = cf[i].feature2;
            const f1 = ContentMap[feature1];
            const f2 = ContentMap[feature2];
            const s2 = f1.length;

            //const l = another.linear_reg(toPoints(f1, f2), s2-1);

            //finding for each 2d point the dev to check if it is greater than the threshold
            let j;
            for (j = 0; j < s2 - 1; j++) {

                const p = new another.Point(parseFloat(f1[j]), parseFloat(f2[j]));

                //var points = toPoints(f1, f2);
                if (another.dev(p, cf[i].lin_reg) >  1.1 * cf[i].threshold) {
                    const features = feature1 + "-" + feature2;
                    const report = new AnomalyReport(features, j + 1);
                    ar[ar.length] = report;
                }
            }
        }
        return JSON.stringify(ar);
    }


};

module.exports = methods;