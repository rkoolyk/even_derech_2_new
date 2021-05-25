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
    this.feature1 = '';
    this.feature2 = '';// names of the correlated features
    this.corrlation = 0;
    this.lin_reg = 0;
    this.threshold = 0.5;
    this.cx = 0;
    this.cy = 0;
}

function AnomalyReport(names, time) {
    this.description = names;
    this.timestep = time;
}





function learnHelper(ts, p/*pearson*/, f1, f2, ps) {
    if (p > 0.9) {
        let len = another2.getRowSize(ts);
        let c = new correlatedFeatures();
        c.feature1 = f1;
        c.feature2 = f2;
        c.corrlation = p;
        c.lin_reg = another.linear_reg(ps, len);
        c.threshold = findThreshold(ps, len, c.lin_reg) * 1.1; // 10% increase
        cf[cf.length + 1] = c;
    }
    else if(p>0.5&&p<0.9) {
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

function isAnomalous(x, y, c, l) {
    /*if ((c.corrlation > 0.5 && c.corrlation < 1 && dist(Point(c.cx, c.cy), Point(x, y)) > c.threshold)) {
        return 1;
    }
    else {
        return 0;
    }*/
    let p = new another.Point(x,y);
    if(c.correlation >= c.threshhold &&another.dev(p, l) >  1.1 * c.threshold ||
        c.corrlation>0.5 && c.corrlation < c.threshold && dist(p,new another.Point(x,y))>c.threshold){
        return 1;
    }
    return 0;

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
        return JSON.stringify(cf);
    },

    detect: function (ts) {
        console.log('***************');
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
            const l = another.linear_reg(toPoints(f1, f2), s2-1);
            //finding for each 2d point the dev to check if it is greater than the threshold
            let j;
            for (j = 0; j < s2-1; j++) {
                let p = new another.Point(f1[j], f2[j]);
                //var points = toPoints(f1, f2);
                if (c.corrlation >= c.threshold && another.dev(p, l) >  1.1 * c.threshold ||
                    c.corrlation>0.5 && c.corrlation < c.threshold && dist(p,new another.Point(c.cx,c.cy))>c.threshold) {
                    const features = feature1 + "-" + feature2;
                    const report = new AnomalyReport(features, j + 1);
                    ar[ar.length + 1] = report;
                }
            }
        }
        return JSON.stringify(ar);
    }
};

module.exports = methods;








