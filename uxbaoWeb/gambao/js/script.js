//点击高亮
function initGameList(){
    var oList = document.querySelectorAll('.mod-soft-list');
    var oTab = document.querySelector('.mod-nav');
    var oLastObj = null;
    function clickHL(e){
        for(var i=1; i<e.changedTouches.length; i++){
            e.changedTouches[i] && e.changedTouches[i].stopPropagation();
        }
        if(e.touches.length > 1) return;
        e = (e.changedTouches[0]) ? e.changedTouches[0] : e;
        var oTarget = e.target;
        if(oTarget.nodeName == "A") return;
        while(oTarget.nodeName != "LI" && oTarget.parentNode){
            oTarget = oTarget.parentNode;
        }
        if(oTarget.nodeName == "LI"){
            oTarget.className += " active";
            oLastObj = oTarget;
        }
    }
    function tabClickHL(e){
        for(var i=1; i<e.changedTouches.length; i++){
            e.changedTouches[i] && e.changedTouches[i].stopPropagation();
        }
        e = (e.changedTouches[0]) ? e.changedTouches[0] : e;
        var oTarget = e.target;
        while(oTarget.nodeName != "LI" && oTarget.parentNode){
            oTarget = oTarget.parentNode;
        }
        if(oTarget.nodeName == "LI"){
            oTarget.className += " active";
            oLastObj = oTarget;
        }
    }
    function removeHL(){
        var oTarget = oLastObj;
        if(oTarget){
            oTarget.className = "mod-soft-box";
            oLastObj = null;
        }
    }
    function jumpURL(e){
        var oTarget = e.target;
        var nextURL = null;
        if(oTarget.nodeName == "A") return;
        while(oTarget.nodeName != "LI" && oTarget.parentNode){
            oTarget = oTarget.parentNode;
        }
        if(oTarget.nodeName == "LI"){
        	if(oTarget.id == "more-game")
        		return;
            nextURL = oTarget.getAttribute("src");
    		nextURL = (nextURL.indexOf('?') < 0 ) ? nextURL+'?sid='+sid : nextURL+'&sid='+sid;
            console.log("nextURL=="+nextURL);
            window.location = nextURL;
        }
    }

    for(i=0; i<oList.length; i++){
//    	oList[i].removeEventListener('touchstart', clickHL, false);
//    	oList[i].addEventListener('touchstart', clickHL, false);
    	oList[i].removeEventListener('click', jumpURL, false);
    	oList[i].addEventListener('click', jumpURL, false);
    	//检查是不是网页游戏，是的话，替换a标签按钮上的文字
    	var p = oList[i].getElementsByTagName("p");//找出list区域所有的p标签
    	//var span = oList.getElementsByTagName("span");//找出list区域所有的span标签
    	var a = oList[i].getElementsByTagName("a");//找出list区域内所有的a标签
    	
    	for(j=0;j<p.length;j++)
    	{
    		if(p[j].innerHTML.indexOf("wapgame") >= 0){
    			p[j].innerHTML = "网页游戏"
    				a[j].innerText = "进入";
    		}
    	}
    }
}

function jump2SearchPage(key){
	p_util.cookie.set("searchword", escape(key),"","",1);
	window.location.href = "tags.php?key=" + escape(key)+"&sid="+sid;
}

function jump2SearchGamePage(){
	var key = document.getElementById("searchInput").value;
	jump2SearchPage(key);
}


//点击JS跳转

//tag�?
function shakeKeyWords(){
    var aTags = document.querySelectorAll('.key');
    for(var i=0; i<aTags.length; i++){
        aTags[i].className = "key";
    }
    var aPos = new Array();
    for(var i=1; i < 9; i++){
        aPos.push(i);
    }
    aPos.sort(function(a, b){
        if((1 - Math.random()) > 0.5) return false;
        else return true;
    });
    for(var i=0; i<aTags.length; i++){
        var color = 1 + Math.ceil(Math.random() * 4);
        aTags[i].className += " key-pos" + aPos.shift() + ' key-color' + color;
    }
}
shakeKeyWords();
//sub class tab change
function showList(listName, that) {
    var aList = document.querySelectorAll('.list');
    var aLink = document.querySelectorAll('.sub-class-tab a');
    for(var i = 0; i < 2; i++){
        aLink[i].className = "";
    }
    if(listName == 'hot_rank'){
        aList[1].style.display = "none";
        aList[0].style.display = "block";
        that.className = "active";
    }
    if(listName == "newest"){
        aList[0].style.display = "none";
        aList[1].style.display = "block";
        that.className = "active";
    }
}

function preLoadImg(){
	var imgArray = document.getElementsByTagName("img");
	preLoadImgWithEls(imgArray);
}

function preLoadImgWithEls(imgEls){
	var imgArray = imgEls;
	var size = imgArray.length;
	for(var i=0; i<size; i++){
		var realsrc=imgArray[i].getAttribute("rs");
		if( realsrc!= null){		
			var img = new Image();
			img.setAttribute("index", i);
			img.onload = function(){
				imgArray[this.getAttribute("index")].src = this.src;
			};
			img.onerror = function(eventObj){
				console.log(" loadpicerr:"+this.src);
				var huiyuanurl="/tools/errpic.jsp?picurl="+this.src;
				console.log(" loadpicerr,then try:"+huiyuanurl );
				imgArray[this.getAttribute("index")].src=huiyuanurl;
				
			};			 
			img.src = realsrc;
		}
	}
	
}
$('.close_icon').click(function()
{
	$('#footer').hide();
});