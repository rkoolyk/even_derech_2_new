const another = require('./util_anomaly_detection.js');
const enclosingCircle = require('smallest-enclosing-circle')
const another2 = require('./timeSeries.js');

let cf = [];

function Circle(c, r) {
    this.center = c;
    this.radius = r;
}

function toPoints(x, y) {
    const ps = [];
    let i;
    for (i = 0; i < x.length; i++) {
        ps[i] = new another.Point(x[i], y[i]);
    }
    return ps;
}


function getCorrelation(f1, f2, ts) {
    const colvector1 = ts.ts[f1];
    const colvector2 = ts.ts[f2];
    const size = colvector1.length - 1;
    // Compute the correlation of these two features
    return another.pearson(colvector1, colvector2, size);
}

function correlatedFeatures() {
    this.feature1;
    this.feature2;// names of the correlated features
    this.corrlation;
    this.threshold = 0.5;
    this.cx;
    this.cy;
}

function AnomalyReport(names, time) {
    this.description = names;
    this.timestep = time;
}






function learnHelper(ts, p/*pearson*/, f1, f2, ps) {

    //var len = ts.getRowSize();
    const cl = enclosingCircle(ps);
    const center = new another.Point(cl.x, cl.y);
    //var circle = new Circle(center, cl.r);
    const c = new correlatedFeatures();
    c.feature1 = f1;
    c.feature2 = f2;
    c.corrlation = p;
    c.threshold = cl.r * 1.1; // 10% increase
    c.cx = cl.x;
    c.cy = cl.y;
    cf[cf.length] = c;

}

function isAnomalous(x, y, c) {
    if ((c.corrlation > 0.5 && c.corrlation < 1 && dist(Point(c.cx, c.cy), Point(x, y)) > c.threshold)) {
        return 1;
    }
    else {
        return 0;
    }
}

function dist(p1, p2) {
    const xDiff = p1.x - p2.x;
    const yDiff = p1.y - p2.y;

    return Math.sqrt(xDiff * xDiff + yDiff * yDiff);
}


const methods = {

    learnNormal: function (ts) {
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
        return cf;
    },

    detect: function (ts) {
        const ar = [];
        const ContentMap = ts.ts;
        const s = cf.length;
        //for each correlated feature find new lin_reg according to new ts
        let i;
        for (i = 0; i < s; i++) {
            const c = cf[i];
            const feature1 = cf[i].feature1;
            const feature2 = cf[i].feature2;
            const f1 = ContentMap[feature1];
            const f2 = ContentMap[feature2];
            const s2 = f1.length;
            //var l = another.linear_reg(toPoints(f1, f2), s2);
            //finding for each 2d point the dev to check if it is greater than the threshold
            let j;
            for (j = 0; j < s2; j++) {
                //var p = new another.Point(f1[j], f2[j]);
                //var points = toPoints(f1, f2);
                if (isAnomalous(f1[i], f2[i], c)) {
                    const features = feature1 + "-" + feature2;
                    const report = new AnomalyReport(features, j + 1);
                    ar[ar.length + 1] = report;
                }
            }
        }
        return ar;
    }
};

module.exports = methods;








