(function (A) {
    function _ROLL(obj) {
        this.ele = document.getElementById(obj);
        this.interval = false;
        this.currentNode = 0;
        this.passNode = 0;
        this.speed = 100;
        this.childs = _childs(this.ele);
        this.childHeight = parseInt(this.ele.offsetHeight);
        // this.childHeight = parseInt(_style(this.childs[0])['height']);
        // this.childHeight = parseInt(this.childs[0]['height']);
        console.log(this.childs[0])
        console.log('childHeight:' + this.childHeight)
        addEvent(this.ele, 'mouseover', function () {
            window._loveYR.pause();
        });
        addEvent(this.ele, 'mouseout', function () {
            window._loveYR.start(_loveYR.speed);
        });
    }

    function _style(obj) {
        return obj.currentStyle || document.defaultView.getComputedStyle(obj, null);
    }

    function _childs(obj) {
        var childs = [];
        for (var i = 0; i < obj.childNodes.length; i++) {
            var _this = obj.childNodes[i];
            if (_this.nodeType === 1) {
                childs.push(_this);
            }
        }
        return childs;
    }

    function addEvent(elem, evt, func) {
        if (-[1,]) {
            elem.addEventListener(evt, func, false);
        } else {
            elem.attachEvent('on' + evt, func);
        }
    }

    _ROLL.prototype = {
        start: function (s) {
            var _this = this;
            _this.speed = s || 100;
            _this.interval = setInterval(function () {
                _this.ele.scrollTop += 1;
                _this.passNode += 1;
                // if (_this.passNode % _this.childHeight == 0) {
                if (_this.childHeight - _this.passNode < 0) {
                    var o = _this.childs[_this.currentNode] || _this.childs[0];
                    _this.currentNode < (_this.childs.length - 1) ? _this.currentNode++ : _this.currentNode = 0;
                    _this.passNode = 0;
                    _this.ele.scrollTop = 0;
                    _this.ele.appendChild(o);
                }
            }, _this.speed);
        },
        pause: function () {
            var _this = this;
            clearInterval(_this.interval);
        }
    }
    A.marqueen = function (obj) {
        A._loveYR = new _ROLL(obj);
        return A._loveYR;
    }
})(window);