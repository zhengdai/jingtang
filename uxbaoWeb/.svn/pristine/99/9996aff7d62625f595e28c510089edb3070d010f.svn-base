	var sc = new SmartClick('hotgame',{className:'active'});

	var needLogin=false;
	var needNav = true;
	setTimeout(function(){
		var constr,slidePic;
		constr = com.touch.funcTools.slideLine.getInstance();
		slidePic = new constr().step('Core', '#slidePic .core', '.list').step('TouchCore').step('AutoPlay').step('TabButton', '#slidePic .bar li', 'active');
			}, 2000);(function(){
			//滑动类
			var constr,  slideChess1, slideChess2, slideChess3; //slidePic,
			constr = com.touch.funcTools.slideLine.getInstance();
			//slidePic = new constr().step('Core', '#slidePic .core', '.list').step('TouchCore').step('AutoPlay').step('TabButton', '#slidePic .bar li', 'active');
			slideChess1 = new constr().step('Core', '#slideChess1', '.list', {width: 'auto'}).step('TouchCore').step('TabButton', '#slideChess1 .bar li', 'active');
			slideChess2 = new constr().step('Core', '#slideChess2', '.list', {width: 'auto'}).step('TouchCore').step('TabButton', '#slideChess2 .bar li', 'active');
			slideChess3 = new constr().step('Core', '#slideChess3', '.list', {width: 'auto'}).step('TouchCore').step('TabButton', '#slideChess3 .bar li', 'active');
			window.addEventListener('resize', function(){
			slideChess1.helper.refresh();
			slideChess2.helper.refresh();
			slideChess3.helper.refresh();
			});
		var slideChess2Pages = -2;
		var slideChess3Pages = -2;
		//绑定回调函数，下一帧触发 , o.count为当前幻灯片序号，从0开始
		slideChess2.helper.bindStepTo(function(o){
		if(o.count > slideChess2Pages){
			slideChess2Pages = o.count;
			preLoadImgWithEls(document.querySelectorAll("#slideChess2 .list li")[o.count].querySelectorAll("img"));
		}else{
		return;
		}
		});
			slideChess3.helper.bindStepTo(function(o){
			if(o.count > slideChess3Pages){
			slideChess3Pages = o.count;
			preLoadImgWithEls(document.querySelectorAll("#slideChess3 .list li")[o.count].querySelectorAll("img"));
			}else{
			return;
			}
		});
//tab切换
var tabChange;
tabChange = function(tabNav, tabList, name, callback){
var count = 0;
for(var i = 0, len = tabNav.length; i < len; i++){
tabNav[i].addEventListener('click', (function(i){
return function(e) {
//console.log('');
if(i==1 && slideChess2Pages==-2){
//slideChess2Pages=-1;
//preLoadImgWithEls(document.querySelector("#slideChess2 .list li").querySelectorAll("img"));
}else if(i==2 && slideChess3Pages==-2){
//slideChess3Pages=-1;
//preLoadImgWithEls(document.querySelector("#slideChess3 .list li").querySelectorAll("img"));
}
if(i === count) {
return false;
}

callback && callback();
}
})(i));
}
};
tabChange(document.querySelectorAll('#tab .mod-sub-nav li'), document.querySelectorAll('#tab .mod-slide-soft'), 'current', function(){
slideChess1.helper.refresh();
slideChess2.helper.refresh();
slideChess3.helper.refresh();
});
})();
//标签云展开
setTimeout(function(){
var tagCloud, tagList, tagObjList, tagResultList, tagObj, setPosition, obj, loopCount;
tagCloud = document.querySelector('#tagCloud');
if(tagCloud)
{
	tagList = tagCloud.querySelectorAll('ul li');
	tagObjList = [];
	tagResultList = [];
	tagObj = function() {
	this.ele = null;
	this.w = 0;
	this.h = 0;
	this.x = 0;
	this.y = 0;
	};
	setPosition = function(obj) {
	var tmp, isOver;
	isOver = false;
	obj.x = Math.random() * (284 - obj.w) - 142;
	obj.y = Math.random() * (110 - obj.h) - 55;
	for(var i = 0, len = tagResultList.length; i < len; i++){
	tmp = tagResultList[i];
	if(Math.abs(tmp.x + tmp.w/2 - (obj.x + obj.w/2)) < (tmp.w/2 + obj.w/2) && Math.abs(tmp.y + tmp.h/2 - (obj.y + obj.h/2)) < (tmp.h/2 + obj.h/2)) {
	isOver = true;
	break;
	}
	}
	if(isOver && loopCount < 15) {
	loopCount++;
	setPosition(obj);
	}else {
	tagResultList.push(obj);
	}
	};
	for(var i = 0, len = tagList.length; i < len; i++) {
	loopCount = 0;
	obj = new tagObj();
	obj.ele = tagList[i];
	obj.w = obj.ele.offsetWidth;
	obj.h = obj.ele.offsetHeight;
	tagObjList.push(obj);
	setPosition(obj);
	}
	for(var i = 0, len = tagResultList.length; i < len; i++){
	tagResultList[i].ele.style.webkitTransform = 'translate3d(' + tagResultList[i].x + 'px, ' + tagResultList[i].y + 'px, 0)';
	}
}
}, 800);