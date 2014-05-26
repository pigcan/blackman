;(function(window, document, undefined) {

    /**
    *
    * 动画支持
    */   
    var cubicBezierFunction = function (p1x, p1y, p2x, p2y) {
        var ZERO_LIMIT = 1e-6;
        // Calculate the polynomial coefficients,
        // implicit first and last control points are (0,0) and (1,1).
        var ax = 3 * p1x - 3 * p2x + 1,
            bx = 3 * p2x - 6 * p1x,
            cx = 3 * p1x;

        var ay = 3 * p1y - 3 * p2y + 1,
            by = 3 * p2y - 6 * p1y,
            cy = 3 * p1y;

        function sampleCurveDerivativeX(t) {
            // `ax t^3 + bx t^2 + cx t' expanded using Horner 's rule.
            return (3 * ax * t + 2 * bx) * t + cx;
        }

        function sampleCurveX(t) {
            return ((ax * t + bx) * t + cx ) * t;
        }

        function sampleCurveY(t) {
            return ((ay * t + by) * t + cy ) * t;
        }

        // Given an x value, find a parametric value it came from.
        function solveCurveX(x) {
            var t2 = x,
                derivative,
                x2;

            // https://trac.webkit.org/browser/trunk/Source/WebCore/platform/animation
            // First try a few iterations of Newton's method -- normally very fast.
            // http://en.wikipedia.org/wiki/Newton's_method
            for (var i = 0; i < 8; i++) {
                // f(t)-x=0
                x2 = sampleCurveX(t2) - x;
                if (Math.abs(x2) < ZERO_LIMIT) {
                    return t2;
                }
                derivative = sampleCurveDerivativeX(t2);
                // == 0, failure
                if (Math.abs(derivative) < ZERO_LIMIT) {
                    break;
                }
                t2 -= x2 / derivative;
            }

            // Fall back to the bisection method for reliability.
            // bisection
            // http://en.wikipedia.org/wiki/Bisection_method
            var t1 = 1,
                t0 = 0;
            t2 = x;
            while (t1 > t0) {
                x2 = sampleCurveX(t2) - x;
                if (Math.abs(x2) < ZERO_LIMIT) {
                    return t2;
                }
                if (x2 > 0) {
                    t1 = t2;
                } else {
                    t0 = t2;
                }
                t2 = (t1 + t0) / 2;
            }

            // Failure
            return t2;
        }

        function solve(x) {
            return sampleCurveY(solveCurveX(x));
        }

        return solve;
    }
    var Animation = function(object,property,timingFunction,duration,positionStart,positionEnd){
        
        this.handler = null;
        //神奇的一个问题，如果正常拖动释放，动画执行顺利，但是如果动画被stop，再创建，时间（t）就会异常大，导致过渡动画不执行而position值却被改动了，但是样式中却又未生效。
        this.start = function(){
            if(this.handler) {
                
                this.stop();
            }
            var startTime = Date.now();
            var me = this;

            this.handler = setInterval(function(){
                var nowTime = Date.now();
                var t =  nowTime - startTime;
                //console.log('is t > = duration and t and duration',t >= duration, t,nowTime,startTime)

                if(t>=duration) {
                    clearInterval(me.handler);
                    t = duration;
                    //console.log('object',object);
                    var offsetWidth = 0;
                    if(object.loop){
                        if (object.direction <= 0 && object.edgeOfLeft) {
                            console.log('右滑最后一个，位置复位');
                            object.element.style.cssText += "-webkit-transform:"+support.gv1 + "-"+object.maxPoint * object.distance+ "px,0" + support.gv2;
                        }
                        if(object.direction == 1 && object.edgeOfRight) {
                            console.log('左滑最后一个，位置复位');

                            object.element.style.cssText += "-webkit-transform:"+support.gv1 + "0px,0" + support.gv2;
                        }

                    }
                    
                    
                    this.isPlaying || _triggerEvent.apply(object,['afterSwitch',true,true]);
                    
                }
                object[property] = timingFunction(t);

                if(t>=duration){
                    object[property] = positionEnd;
                }else{
                    _triggerEvent.apply(object,['switch',true,true]);
                }
                if(object.loop){
                    if(t>=duration){
                        object.edgeOfLeft && (object.position = - object.maxPoint * object.distance);
                        object.edgeOfLeft = false;
                        object.edgeOfRight && (object.position = 0);
                        object.edgeOfRight = false;
                    }
                    
                }
                
            },10);
        }
        this.stop = function(){
            console.log('stop setInterval end time is',Date.now())
            clearInterval(this.handler);
        }
        var isPlaying = null;
        Object.defineProperty(this,"isPlaying",{
            set : function(p){
                isPlaying = p;
            },
            get : function(){
                if(this.handler){
                    return true;
                }else{
                    return false;
                }
            }
            
        });
    }

    var util = Switchable.util = {};


    /**
    *
    *特性检测
    */
    var support = Switchable.support = {};

    var hasProp = function(props) {
        return props.some(function(prop) {
            return !!(prop in document.documentElement.style);
        });
    }

    var has3d = function() { // 判断浏览器是否支持3d效果（仅webkit）
        
        var ret = false;
        
        if (hasProp(['WebkitPerspective']) && hasProp(['webkitPerspective'])) {
            var div = document.createElement('div');
            var style;
            // thanks modernizr
            style = ['<style id="smodernizr">', '@media (transform-3d),(-webkit-transform-3d){#modernizr{left:9px;position:absolute;height:5px;margin:0;padding:0;border:0}}', '</style>'].join('');
            div.id = 'modernizr';
            div.innerHTML = style;
            document.body.appendChild(div);
            ret = div.offsetLeft === 9 && div.offsetHeight === 5;
            div.parentNode.removeChild(div);
        }
        
        return ret;
    }

    support.transform = hasProp(['WebkitTransform']);

    support.transition = hasProp(['WebkitTransitionProperty']);

    support.transform3d = has3d();

    support.gv1 = support.transform3d ? 'translate3d(' : 'translate(';
    support.gv2 = support.transform3d ? ',0)' : ')';

    support.cssAnimation = (support.transform3d || support.transform) && support.transition;

    support.isMobile = window.navigator.userAgent.match(/mobile/gi) ? true : false;

    var gestureStart = false;

    /**
    *
    *事件处理,并对手机ua绑定touch事件，其他绑定到mouse相关事件
    */

    var eventTypes = support.isMobile ? 'touch' : 'mouse';
    var events = {
        start: {
            touch: 'touchstart',
            mouse: 'mousedown'
        },
        move: {
            touch: 'touchmove',
            mouse: 'mousemove'
        },
        end: {
            touch: 'touchend',
            mouse: 'mouseup'
        }

    };

    /**
    *
    *事件处理，得到当前滑动的坐标值
    */    
    var getPage = function(event, page) {
        return event.changedTouches ? event.changedTouches[0][page] : event[page];
    }

    
    /**
     * [Switchable 组件基础类]
     * @param {[string]} ele . 如果选择创建组件的方式来源于脚本，则ele可省略，如果创建的方式来源于已有的html节点则传入节点的名称则可
     * @param {[obj]} options
     * options.itemWidth 滑动块中单个元素的宽度
     * options.itemHeight 滑动块中单个元素的高度，应用于纵向滑动，横向滑动时无效，请于样式中设定滑动块中单个元素的高度
     * options.distance 一次完整滑动的距离，通常理解为一个滑动块的宽度（横向）或者高度（纵向）
     * options.maxPoint 可以组件可以滑动次数，设定后可以不根据元素个数来设定滑动的次数
     * options.dtnY  是否纵向滑动
     */
    function Switchable(ele, options) {

        var self = this;
        var arLength = arguments.length;
        var opts;
        // if(arLength == 0){
        //     throw new Error('please configure your configuration at first');
        //     return;
        // }
        if (typeof arguments[0] === 'string') {
            self.ele = document.querySelector(arguments[0]);

            if (!self.ele) {
                throw new Error('element not found');
                return;
            }
            self.fromHtmlNode = true;
            opts = options || {};
        } else if(arLength ==0 || typeof arguments[0] === 'object') {
            opts = arguments[0] || {};

        } else {
            throw new Error('Configuration Error');
            return;
        }

        self.itemWidth = opts.itemWidth;
        
        self.distance = opts.distance;
        self.maxPoint = opts.maxPoint;

        self.duration = opts.duration || 350;
        self.loop = opts.loop || false;

        self.dtnY = opts.dtnY || false;

        if(self.dtnY){
            self.axisDtn = "Y";
            self.itemHeight = opts.itemHeight;
        }else{
            self.axisDtn = "X";
        }

        self.root = document.createDocumentFragment();
        self.begin = document.createComment("slide-begin");
        self.end = document.createComment("slide-end");

        if(!self.fromHtmlNode){
            
            self.root.appendChild(self.begin); 
            self.div = document.createElement("div");
            self.element = document.createElement("ul");
            self.div.appendChild(self.element);
            self.root.appendChild(self.div);
            self.root.appendChild(self.end);
            self.vm = null;

        }else{

            self.div = self.ele;
            self.element = self.ele.querySelector('ul');

            self.ele.parentNode.insertBefore(self.begin, self.ele);
            self.ele.parentNode.insertBefore(self.end, self.ele.nextSibling);

        }

        


        self.div.style.cssText = "overflow:hidden;margin: 0 auto;position:relative;-webkit-transform : translateZ(0)";
        self.div.className = 'slide';

        
        self["current"+self.axisDtn] = 0;
        self.currentPoint = 0;
        
        self.element.addEventListener(events.start[eventTypes], self, false);

        document.addEventListener('gesturestart', function() {
            gestureStart = true;
        });

        document.addEventListener('gestureend', function() {
            gestureStart = false;
        });

  
        var position = null;

        Object.defineProperty(this,"position",{
            set : function(v){
                var _position = v;
                position = v;
                
                
                _setAxisPos.apply(self,[position]);
                //console.log('set position',position)
            },

            get : function(){
                return position;
            }
        });

        var currentSelected = 0;

        Object.defineProperty(this,"currentSelected",{
            set : function(s){
                var _currentSelected = s;
                currentSelected = _currentSelected;
                if(self.loop){
                    currentSelected = self.edgeOfLeft ? self.maxPoint : self.edgeOfRight ? 0 : s;
                    self.edgeOfLeft && -- _currentSelected;
                    self.edgeOfRight && ++ _currentSelected;
                }
                _moveToSelected.apply(self,[_currentSelected]);
            }, 

            get : function(){
                return parseInt(currentSelected);
            }
        });


        if(self.fromHtmlNode){
            self.asyncViewModel();
        }
        return self;

    }

    /**
     * [on 对类的实例与之对应的实例绑定相关事件]
     * 该方法作用在于后续开发中可以针对不同的事件增加不同的处理方式。
     */
    Switchable.prototype.on = function(){
        var self = this;
        console.log(arguments);
        var eventName = arguments[0];
        var callback = arguments[1];
        if(eventName == 'beforeSwitch' && callback === false){
            self.switchCancel = true;
            self.loop = false;
            return
        }
        self.element.addEventListener.apply(self.element, arguments);
    }

    /**
     * [generate 渲染模板数据并插入节点，同时有选择性的设置是否同步viewModel]
     * @param {[string]} selector 所需插入的节点，填写节点选择器即可
     * @param {[array]} vm 组件数据对象 array-object
     * @param {[obj]} options 
     * options.slient  true : 组件数据设置完毕后立即同步viewModel; false : 稍后同步viewModel
     * 
     */
    Switchable.prototype.generate = function(selector, vm, options){
        var self = this;

        var parent;

        if(Object.prototype.toString.call(selector) == '[object String]' && document.querySelector(selector)){
            parent = document.querySelector(selector);
        }else{
            throw new Error('element selector should be a string and have exited');
            return;
        }
        
        if(Object.prototype.toString.call(vm) !== '[object Array]'){
            throw new Error('vm format error');
            return
        }
        self.vm = vm;
        parent.appendChild(self.root);
        var options = options || {};
        var slient = options.slient || false;
        slient && self.asyncViewModel();
    }

    /**
     * [remove 从html中移除节点]
     * @return component fragment
     */
    Switchable.prototype.remove = function(){
        var self = this;
        var range = document.createRange();
        range.setStartBefore(self.begin);
        range.setEndAfter(self.end);
        //根据begin和end来移除控件
        if(!self.fromHtmlNode && self.root.childNodes.length == 0) {
            self.root.appendChild(range.extractContents());
        }else if(self.fromHtmlNode){
            self.root.appendChild(range.extractContents());   
        }
    }

    /**
     * [content 插入一个节点 节点可以是由模板拼接而成的string类型节点串'<li></li>' 也可以是一个 Fragment]
     * @param  {[string|node object]} node
     * @param  {object} obj,配置参数，目前先近支持内容新增后允许更新，maxPoint 设置
     * @no return
     */
    Switchable.prototype.content = function(node,obj){
        var self = this;
        var from = false;
        var obj = obj || {};
        if((node.nodeType == 11 && node.childNodes.length != 0) || (Object.prototype.toString.call(node) == "[object String]" && node != "" && (from = true))){
            if(!self.fromHtmlNode){
                self.fromHtmlNode = true;
            }
            if(from){
                var fragment = document.createDocumentFragment(); 
                var div = document.createElement('div');
                div.innerHTML = node;
                var elements = div.childNodes;
                var el = elements.length;
                for(var i = 0; i < el; i++){
                    var k = elements[0];
                    k.nodeType == 1 && fragment.appendChild(k);
                }

            }
            self.element.appendChild(from ? fragment : node);
            self.maxPoint = obj.maxPoint || undefined;
            self.asyncViewModel();

        }else{
            throw new Error('illegal node type');
            return;
        }
        
    }

    /**
     * [asyncViewModel  2个方向对组建进行渲染，（1）组建完全由脚本创建 （2）组建由已有html节点创建而来，当然节点需要符合组建需求]
     * @no return 
     */
    Switchable.prototype.asyncViewModel = function(){
        var self = this;
        var woh = self.dtnY ? 'Height' : 'Width'  

        self.element.style.cssText = '-webkit-backface-visibility:hidden;position:absolute;height:100%;top:0;left:0;';
        var childNodesLength = 0;
        //var wrapWidth = 0 ;
        var wrapPX = 0 ;
        //console.log("self.div.querySelector('li')[0].scrollWidth",self.div.querySelector('li')[0].offsetWidth)

        if(!self.fromHtmlNode){
            console.log('来源于脚本创建')

            if(!self.vm) return;
            
            wrapPX = self["item"+woh] || self.div["offset"+woh];

            
            childNodesLength = self.vm.length;
            //self.element.innerHTML = "\uFEFF";
            
            var itemFragment = document.createDocumentFragment();
            for(var i = 0; i < self.vm.length; i++) {
                var itemData = self.vm[i];

                var item = document.createElement("li");
                self.dtnY ? (item.style.height =  wrapPX +'px') : (item.style.width = wrapPX +'px');
                self.dtnY || (item.style.float = "left");
                var a = document.createElement("a");
                a.href= itemData.href;
                var img = new Image()
                self.dtnY ? img.setAttribute("height",wrapPX) : img.setAttribute("width",wrapPX);
                img.src = itemData.url;
                img.setAttribute('switch-data', itemData.attr);
                a.appendChild(img);
                item.appendChild(a);
                itemFragment.appendChild(item);
            }
            self.element.appendChild(itemFragment);
        }else{
            console.log('来源于已有节点创建');

            if(!self.div.querySelector('li')){
                throw new Error('element of <li> not found');
                return;
            }

            wrapPX = self["item"+woh] || self.div.querySelector('li')["offset"+woh] || self.div["offset"+woh]
            
            var childNodes = self.element.childNodes;
            //var elementNodeLength = 0;
            for(var i = 0; i < childNodes.length; i++){
                childNodes[i].nodeType == 1 && ++ childNodesLength && (self.dtnY ? (childNodes[i].style.height = wrapPX + "px") :  (childNodes[i].style.float = 'left'));
            }
            //childNodesLength = elementNodeLength
        }

        var slidable = {};

        slidable[woh] = childNodesLength * wrapPX;
        //slidableWidth or slidableHeight  

        if(self.loop && (slidable[woh] > self.div["offset"+woh])){

            var cloneNum = Math.ceil(self.div["offset"+woh] / wrapPX);
            var cloneNodeFrom = self.element.querySelectorAll('li');
            //复制节点操作
            var cloneContent = document.createDocumentFragment();

            slidable["full"+woh] = 2 * cloneNum * wrapPX + slidable[woh];

            for(var i = 0; i< cloneNum; i++){
                cloneContent.appendChild(cloneNodeFrom[i].cloneNode(true));
            }
            for(var j = 0; j < cloneNum ; j++){
                var ahNode = cloneNodeFrom[cloneNodeFrom.length-1-j].cloneNode(true);
                ahNode.style.position = 'relative';

                var cpx =  - (cloneNodeFrom.length + cloneNum + 2*j + 1) * wrapPX + 'px';
                
                self.dtnY ?  (ahNode.style.top = cpx) : (ahNode.style.left = cpx);
                
                cloneContent.appendChild(ahNode);
            }

            self.element.appendChild(cloneContent);
            self.dtnY ? (self.element.style.height = slidable["full"+woh]+'px') : (self.element.style.width = slidable["full"+woh]+'px');
            

            //复制节点结束
        }else{
            self.loop = false;
            self.dtnY ?  (self.element.style.height = slidable[woh]+'px') : (self.element.style.width = slidable[woh]+'px');
        }
        self.loop && (self.maxPoint = undefined);
        self.maxPoint = self.maxPoint == 0 
            ? self.maxPoint 
            : self.maxPoint ? self.maxPoint : (childNodesLength - 1);

        self.distance = self.distance ? self.distance : self.fromHtmlNode ? (function(){
            if(childNodesLength == 0){
                return 0;
            }else{
                return  self.element["offset"+woh] / (self.maxPoint + 1 + (self.loop ? 2*cloneNum : 0));
            }
        })() : (slidable[woh] > self.div["offset"+woh]) ? wrapPX : self.div["offset"+woh];


        
        if(!self.loop){
            self.maxEdage = - self.distance * self.maxPoint;
            console.log('distance and maxPoint and maxEdage',self.distance,self.maxPoint,self.maxEdage)
        }else{
            console.log('distance and maxPoint',self.distance,self.maxPoint)
        }
        
       
    }

    /**
     * [gonext 下一页]
     * @return {boolean} true : 还有下一页  false : 没有下一页
     * 
     */
    Switchable.prototype.gonext = function(){
        var self = this;
        var hasNext = true;
        var currentSelected = self.currentSelected;
        var newSellected = ++ currentSelected;

        
        if (newSellected >= self.maxPoint) {
            if(newSellected != self.maxPoint){
                newSellected = self.maxPoint;
                self.loop && (self.edgeOfRight = true);
            }
            
            
            self.loop || (hasNext = false);
        }
        
        self.currentSelected = newSellected;
        return hasNext;
    }

    /**
     * [gopre 上一页]
     * @return {boolean} true : 还有上一页   false : 没有上一页
     */
    Switchable.prototype.gopre = function(){
        var self = this;
        var hasPre = true;
        var currentSelected = self.currentSelected;
        var newSellected = -- currentSelected;

        if (newSellected <= 0) {
            if(newSellected != 0){
                newSellected = 0;
                self.loop && (self.edgeOfLeft = true);
            }
            
            
            self.loop || (hasPre = false);
        }
        
        self.currentSelected = newSellected;
        return hasPre;
    }
    
    
    /**
     * [handleEvent 对进行进行分派处理]
     * @param  {[e]} event 标准的事件对象
     * @no return
     */
    Switchable.prototype.handleEvent = function(event) {
        //event.preventDefault();
        var self = this;
        //console.log(self)

        switch (event.type) {
            // start
            case events.start.touch: _touchStart.apply(self,[event, 'touch']); break;
            case events.start.mouse: _touchStart.apply(self,[event, 'mouse']); break;

            // move
            case events.move.touch: _touchMove.apply(self,[event, 'touch']); break;
            case events.move.mouse: _touchMove.apply(self,[event, 'mouse']); break;

            // end
            case events.end.touch: _touchEnd.apply(self,[event, 'touch']); break;
            case events.end.mouse: _touchEnd.apply(self,[event, 'mouse']); break;
          
        }
    };


    /**
     * [_triggerEvent 自定义事件创建]
     * @param  {[string]} type 事件类型
     * @param  {[boolean]} bubbles 事件是否起泡
     * @param  {[boolean]} cancelable 事件是否可以通过e.preventDefault()阻止
     * @param  {[object]} data 事件中允许添加自定义所需属性，包裹在data对象中
     * @return {[event]} 返回新创建事件
     */
    var _triggerEvent = function(type, bubbles, cancelable, data) {
        var self = this;

        var ev = document.createEvent('Event');
        ev.initEvent(type, bubbles, cancelable);

        if (data) {
            for (var d in data) {
                if (data.hasOwnProperty(d)) {
                  ev[d] = data[d];
                }
            }
        }

        return self.element.dispatchEvent(ev);
    };

    /**
     * [_setAxisPos 更改克滑动元素在x or y轴向的位置]
     * @param {[number]} pos 位置信息
     * @param {[number]} transitionDuration 动画时长
     */
    var _setAxisPos= function(pos, transitionDuration) {

        var self = this;
        //console.log('set',self) aaa
        self["current"+self.axisDtn] = pos;
        if (support.cssAnimation) {
            var transformString = self.dtnY ? "0,"+pos+"px" : pos + "px,0";
            self.element.style.cssText += "-webkit-transform:"+support.gv1 + transformString + support.gv2;
        }
        else {
            //todo
        }
    };


    var _touchStart = function(event, type){

        var self = this;
        
        if (gestureStart) {
            return
        }

        if(self.animation && self.animation.isPlaying) {


            self.animation.stop();
        }
        //console.log(self)
        self.element.addEventListener(events.move[type], self, false);
        document.addEventListener(events.end[type], self, false);
        var tagName = event.target.tagName;
        if (type === 'mouse' && tagName !== 'SELECT' && tagName !== 'INPUT' && tagName !== 'TEXTAREA' && tagName !== 'BUTTON') {
            event.preventDefault();
        }

        self.startPageX = getPage(event, 'pageX');
        self.startPageY = getPage(event, 'pageY');

        self["basePage"+self.axisDtn] = self["startPage"+self.axisDtn]

        self.direction = 0;
        //self.startTime = event.timeStamp;
        self.sud = undefined;
        _triggerEvent.apply(self,['slidertouchstart', true, false]);
    }

    var _touchMove = function(event, type){
        var self = this;
        if((!self.dtnY && self.sud) || (self.dtnY && typeof self.sud != "undefined" && !self.sud) || gestureStart){
            console.log('认为是上下滑动，被返回,被return');
            return;
        }
        var pageDtn = {};

        pageDtn.pageX = getPage(event, 'pageX');
        pageDtn.pageY = getPage(event, 'pageY');

        if(typeof self.sud == "undefined"){
            var x = Math.abs(self.startPageX - pageDtn.pageX);
            var y = Math.abs(self.startPageY - pageDtn.pageY);
            if(x > y){
                event.preventDefault();
                self.sud = false;
                if(self.dtnY){
                    return
                }
            }else{
                self.sud = true;
                if (self.dtnY) {
                    event.preventDefault();
                }else{
                    return;
                }
            }

        }
        
        var dist;
        dist = pageDtn["page"+self.axisDtn] - self["basePage"+self.axisDtn];
        //console.log('dist', dist)
        var newAxisPos = self["current"+self.axisDtn] + dist;
        if(!self.loop && (newAxisPos > 0 || newAxisPos < self.maxEdage)){
            console.log('边界')
            newAxisPos =  Math.round(self["current"+self.axisDtn] + dist / 3);
        }

        self.direction = dist === 0 ? self.direction : dist > 0 ? -1 : 1;
        _triggerEvent.apply(self,['slidertouchmove', true, true, {
            delta: newAxisPos,
            direction: self.direction
        }]);



        self.position = newAxisPos;
        
        self["basePage"+self.axisDtn] = pageDtn["page"+self.axisDtn];
        
    }

    var _touchEnd = function(event, type){
        //console.log('_touchEnd- ' + type + 'end')

        var self = this;

        _triggerEvent.apply(self,['slidertouchend', true, false]);

        self.element.removeEventListener(events.move[type], self, false);
        document.removeEventListener(events.end[type], self, false);

        

        //case 1  click  self.sud undefined  
        if(Math.abs(Math.round(self["current"+self.axisDtn])) == self.distance * (self.currentSelected || 0)){
            console.log('不管如何，只要位置偏移不改变就被return')
            return
        }

        //case 2 updown 


        var newSellected = - self["current"+self.axisDtn] / self.distance;
        
        newSellected =
            (self.direction > 0) ? Math.ceil(newSellected) :
            (self.direction < 0) ? Math.floor(newSellected) :
            Math.round(newSellected);
        
        if (newSellected < 0) {
            newSellected = 0
            self.loop && (self.edgeOfLeft = true);
        }
        else if (newSellected > self.maxPoint) {
            newSellected = self.maxPoint;
            self.loop && (self.edgeOfRight = true);
        }
        //console.log('newSellected',newSellected,'direction',self.direction);
        
        //测试position relatvie
        self.currentSelected = newSellected;

    }




    var _moveToSelected = function(selected){
        var self = this;
        var ease = cubicBezierFunction(0.25, 0.1, 0.25, 1.0);
        var positionStart = self.position;
        var positionEnd = -self.distance * selected;
        
        //console.log('positionStart and End ',positionStart,positionEnd)
        self.animation = new Animation(self,"position",function(t){
            var delta = positionStart + (positionEnd - positionStart) * ease(t / self.duration);
            return delta;
        },self.duration,positionStart,positionEnd);
        _triggerEvent.apply(self,['beforeSwitch',true,true]);
        //console.log(self.position)
        if(self.switchCancel  && self.position < 0  &&  Math.abs(self.position) <= Math.abs(self.maxEdage) ){
            return;
        }
        self.animation.start();
    }


    if (typeof exports == 'object') {
      module.exports = Switchable;
    }
    else if (typeof define == 'function' && define.amd) {
      define(function() {
        return Switchable;
      });
    }
    else {
      window.Switchable = Switchable;
    }

})(window, window.document);