function transformation(s) {
    try {
        s = s.toString();
        let du = parseInt(s);
        console.log(du);
        let d = s.substring(s.indexOf('.') + 1);
        let fen = d.substring(0, 2);
        console.log(fen);
        let m = d.substring(2, 3);
        let ml = d.substring(3, d.length);
        let miao = m + (m == '' ? '0' : '.') + ml;
        console.log(miao);
        fen = parseFloat(fen) + parseFloat(miao / 60);
        du = parseFloat(fen / 60) + parseFloat(du);
        console.log('du:' + du);
        return du.toFixed(5);
    } catch (e) {
        return s;
    }
}