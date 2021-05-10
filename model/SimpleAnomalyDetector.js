//import { abs } from 'mathjs'
//var math = require('./math.js');
var another = require('./util_anomaly_detection.js');

var another2 = require('./timeSeries.js');

let cf = [];


function SimpleAnomalyDetector() {
    this.threshold = 0.9;
}

function correlatedFeatures() {
    this.feature1;
    this.feature2;// names of the correlated features
    this.corrlation;
    this.lin_reg;
    this.threshold = 0.9;
    this.cx;
    this.cy;
}

function AnomalyReport(names, time) {
    this.description = names;
    this.timestep = time;
}

function toPoints(x, y) {
    var ps = [];
    var i;
    for (i = 0; i < x.length; i++) {
        ps[i] = new another.Point(x[i], y[i]);
    }
    return ps;
}

function findThreshold(ps, len, rl) {
    var max = 0;
    var i;
    for (i = 0; i < len; i++) {
        var d = Math.abs(ps[i].y - (rl.a * ps[i].x + rl.b));
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
        var len = another2.getRowSize(ts);
        var c = new correlatedFeatures();
        c.feature1 = f1;
        c.feature2 = f2;
        c.corrlation = p;
        c.lin_reg = another.linear_reg(ps, len);
        c.threshold = findThreshold(ps, len, c.lin_reg) * 1.1; // 10% increase
        cf[cf.length + 1] = c;
    }
}

function getCorrelation(f1, f2, ts) {
    var colvector1 = ts.ts[f1];
    var colvector2 = ts.ts[f2];
    var size = colvector1.length - 1;
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
    var l = another.linear_reg(points, a.length);
    var s = a.length;
    var max = 0;
    var i;
    for (i = 0; i < s; i++) {
        var p = points[i];
        var temp = another.dev(p, l);
        if (temp > max) {
            max = temp;
        }
    }
    return max;
}

var methods = {

    learnNormal: function (ts) {
        var atts = another2.gettAttributes();
        //var len = another2.getRowSize(ts);
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
            var ps = toPoints(another2.getAttributeData(ts, f1), another2.getAttributeData(ts, f2));
            learnHelper(ts, max, f1, f2, ps);
        }
        return cf;
    },

    detect: function (ts) {
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
                //var points = toPoints(f1, f2);
                if (another.dev(p, l) > (1.1) * cf[i].threshold) {
                    var features = feature1 + "-" + feature2;
                    var report = new AnomalyReport(features, j + 1);
                    ar[ar.length + 1] = report;
                }
            }
        }
        return ar;
    }


};

module.exports = methods;