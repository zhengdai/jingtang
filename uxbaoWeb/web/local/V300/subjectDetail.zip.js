function GetRequest(){var url=location.search;var theRequest={};if(url.indexOf("?")!=-1){var str=url.substr(1);strs=str.split("&");for(var i=0;i<strs.length;i++){theRequest[strs[i].split("=")[0]]=decodeURI(strs[i].split("=")[1])}};return theRequest};var request=GetRequest();var ajaxSubjectDetail={"url":$.apiRoot+"appV3/getTopicById.do","categoryId":request.categoryId};var ajaxSubjectGame={"total_size":0,"start_position":1,"init_size":10,"load_size":5,"rescategory_id":request.categoryId,'order_by':"hot","url":$.apiRoot+"appV3/getCategoryProducts.do","onRefresh":false,"detailUrl":$.htmlRoot+"game_detail.html"};var subjectGameList=[];function createItem(itemData){var $item=$($(".app")[0].cloneNode(true));fillItem($item,itemData);return $item};function updateState(packageName,state){var $item=$(document.getElementById(packageName));var $btn=$item.find(".btn");if(state>=0&&state<=100){if(!$btn.hasClass("cancelBtn")){$btn.removeClass().addClass("cancelBtn btn")};$item.find(".state").text(state+"%")}else if(state=="finishDownload"){$btn.removeClass().addClass("installBtn btn");$item.find(".state").text("安装")}else if(state=="finishInstall"){$btn.removeClass().addClass("openBtn btn");$item.find(".state").text("打开")}else if(state=="pause"){$btn.removeClass().addClass("continueBtn btn");$item.find(".state").text("继续")}};function indexList(packageName,list){var len=list.length;for(var i=0;i<len;++i){if(packageName==list[i].resPackagename){return i}};return-1};function fillRate($item,score){$item.find(".items-score img").each(function(j,imgItem){if(j-score<-0.5){$(imgItem).attr("src",star_01)}else if(j-score==-0.5){$(imgItem).attr("src",star_02)}else{$(imgItem).attr("src",star_03)}})};function fillState($item,packageName,phoneData){var downloadIndex=indexList(packageName,phoneData.downloadList);if(downloadIndex!=-1){if(phoneData.downloadList[downloadIndex].downPercent==100){$item.find(".state").text("安装");$item.find(".btn").removeClass().addClass("btn installBtn")}else{$item.find(".state").text("继续");$item.find(".btn").removeClass().addClass("btn continueBtn")}}else if(indexList(packageName,phoneData.updateList)!=-1){$item.find(".state").text("升级");$item.find(".btn").removeClass().addClass("btn updateBtn")}else if(indexList(packageName,phoneData.installList)!=-1){$item.find(".state").text("打开");$item.find(".btn").removeClass().addClass("btn openBtn")}else{$item.find(".state").text("下载");$item.find(".btn").removeClass().addClass("btn dlBtn")}};function indexOfGift(acId){var len=myGiftData.length;for(var i=0;i<len;++i){if(myGiftData[i].acId===acId){return i}};return-1};function fillItem($item,itemData){var packageName=itemData.resPackagename;$item.attr("id",itemData.resPackagename).data("location",itemData.resLocation).data("id",itemData.resId).data("package",packageName).data("icon",itemData.resIcons).data("name",itemData.resName);if(itemData.acId){var index=indexOfGift(itemData.acId);if(index!=-1){$item.find('.relate-gift').show().on('tap',function(){isUxbao&&window.uxbao.click(JSON.stringify({"type":12,"title":itemData.acName,"url":$.htmlRoot+"gift_detail.html"+"?acId="+itemData.acId+"&num="+myGiftData[index].giftNo}));return false})}else{$item.find('.relate-gift').show().on('tap',function(){isUxbao&&window.uxbao.click(JSON.stringify({"type":12,"title":itemData.acName,"url":$.htmlRoot+"gift_detail.html"+"?acId="+itemData.acId}));return false})}}else{$item.find('.relate-gift').hide().off('tap')};$item.find(".appIcon").data("icon",itemData.resIcons).attr("src",default_icon);$item.find(".tit strong").text(itemData.resName);var ca=(itemData.resCapacity/(1024*1024)).toFixed(1);$item.find(".tit p").text(ca+'MB | '+itemData.resDeveloper);var rated=itemData.resRated;fillRate($item,rated);fillState($item,packageName,phoneData)};function btnTapHandler($target){var $item=$target.parent().parent();if($target.hasClass('dlBtn')||$target.hasClass('continueBtn')){$target.removeClass().addClass('cancelBtn btn');$target.find(".state").text('暂停');isUxbao&&window.uxbao.click(JSON.stringify({"type":1,"resPackagename":$item.data("package"),"resId":$item.data("id"),"resLocation":$item.data("location"),"resIcons":$item.data("icon"),"resName":$item.data("name")}))}else if($target.hasClass('updateBtn')){$target.removeClass('updateBtn').addClass('cancelBtn');$target.find(".state").text('暂停');isUxbao&&window.uxbao.click(JSON.stringify({"type":1,"resPackagename":$item.data("package"),"resId":$item.data("id"),"resLocation":$item.data("location"),"resIcons":$item.data("icon"),"resName":$item.data("name")}))}else if($target.hasClass('cancelBtn')){$target.removeClass('cancelBtn').addClass('continueBtn');$target.find(".state").text('继续');isUxbao&&window.uxbao.click(JSON.stringify({"type":5,"resPackagename":$item.data("package"),"resId":$item.data("id"),"resLocation":$item.data("location"),"resIcons":$item.data("icon"),"resName":$item.data("name")}))}else if($target.hasClass("openBtn")){isUxbao&&window.uxbao.click(JSON.stringify({"type":3,"resPackagename":$item.data("package"),"resId":$item.data("id"),"resLocation":$item.data("location"),"resIcons":$item.data("icon"),"resName":$item.data("name")}))}else if($target.hasClass("installBtn")){isUxbao&&window.uxbao.click(JSON.stringify({"type":6,"resPackagename":$item.data("package"),"resId":$item.data("id"),"resLocation":$item.data("location"),"resIcons":$item.data("icon"),"resName":$item.data("name")}))}};function loadMore(){if(!ajaxSubjectGame.onRefresh&&ajaxSubjectGame.start_position<=ajaxSubjectGame.total_size){ajaxSubjectGame.onRefresh=true;$.ajax({url:ajaxSubjectGame.url,dataType:'jsonp',data:{"rescategory_id":ajaxSubjectDetail.categoryId,"order_by":ajaxSubjectGame.order_by,"resolution":userInfo.resolution,"version":userInfo.version,"phonetypeName":userInfo.phonetypeName,"os_version":userInfo.os_version,"language":userInfo.language,"imei":userInfo.imei,"imsi":userInfo.imsi,"size":ajaxSubjectGame.load_size,"start_position":ajaxSubjectGame.start_position},jsonp:'jsonRecommend',success:function(data,textStatus,xhr){if(data.state===1&&data.product){var $container=$("#app-list-box");subjectGameList=subjectGameList.concat(data.product);var len=data.product.length;for(var i=0;i<len;++i){var $item=createItem(data.product[i]);$container.append($item);$item.find(".appIcon").imglazyload({"urlName":"data-icon"});$item.find(".btn").on("tap",function(){btnTapHandler($(this));return false});$item.find(".appInfo").on('tap',function(){infoTapHandler($(this));return false})};ajaxSubjectGame.start_position+=len;if(ajaxSubjectGame.start_position>ajaxSubjectGame.total_size){$(".more").hide()};ajaxSubjectGame.onRefresh=false}},error:function(XMLHttpRequest,textStatus,errorThrown){ajaxSubjectGame.onRefresh=false;console.log("failed ajax!");$(".more").hide()}})}};function infoTapHandler($info){var $item=$info.parent().parent();var resId=$item.data("id");isUxbao&&window.uxbao.click(JSON.stringify({"type":2,"resId":resId,"url":ajaxSubjectGame.detailUrl+"?resId="+resId,"resName":$item.data("name"),"resPackageName":$item.data("package")}))};function getDateStr(date){var dateStr="";dateStr+=date.getFullYear();var month=date.getMonth()+1;var day=date.getDate();if(month<10){dateStr+='.0'+month}else{dateStr+='.'+month};if(day<10){dateStr+='.0'+day}else{dateStr+='.'+day};return dateStr};var default_icon,star_01,star_02,star_03;$(function(){default_icon=$('.app').eq(0).find(".appIcon").attr("src");var $default_stars=$('.items-score').eq(0).find('img');star_01=$default_stars.eq(0).attr('src');star_02=$default_stars.eq(1).attr('src');star_03=$default_stars.eq(2).attr('src');$.ajax({url:ajaxSubjectDetail.url,dataType:'jsonp',data:{"categoryId":ajaxSubjectDetail.categoryId,"version":userInfo.version,"phonetypeName":userInfo.phonetypeName,"os_version":userInfo.os_version,"language":userInfo.language,"imei":userInfo.imei,"imsi":userInfo.imsi,"resolution":userInfo.resolution},jsonp:'jsonpSubjectDetail',success:function(data){if(data.state===1){$('.headPic').data('icon',data.ResourcesCategory.rescategoryIcons).imglazyload({"urlName":"data-icon"});$('.subjectName').text(data.ResourcesCategory.rescategoryName);$('.subjectTime').text(getDateStr(new Date(data.ResourcesCategory.rescategoryCreateddate)));$('.description').text(data.ResourcesCategory.rescategoryDescription)}},error:function(){console.log("load subject detail failed.")}});$.ajax({url:ajaxSubjectGame.url,dataType:'jsonp',data:{"rescategory_id":ajaxSubjectDetail.categoryId,"order_by":ajaxSubjectGame.order_by,"resolution":userInfo.resolution,"version":userInfo.version,"phonetypeName":userInfo.phonetypeName,"os_version":userInfo.os_version,"language":userInfo.language,"imei":userInfo.imei,"imsi":userInfo.imsi,"size":ajaxSubjectGame.init_size,"start_position":ajaxSubjectGame.start_position},jsonp:'jsonpSubjectGame',success:function(data){if(data.state===1){ajaxSubjectGame.total_size=data.products.total_size;subjectGameList=subjectGameList.concat(data.product);ajaxSubjectGame.start_position+=data.product.length;$(".app").each(function(i,item){var $item=$(this);if(data.product[i]){fillItem($item,data.product[i]);$item.find(".appIcon").imglazyload({"urlName":"data-icon"});$item.find(".btn").on("tap",function(){btnTapHandler($(this));return false});$item.find(".appInfo").on('tap',function(){infoTapHandler($(this));return false})}else{$item.remove()}});$.fn.imglazyload.detect();if(ajaxSubjectGame.start_position<=ajaxSubjectGame.total_size){$(window).on("scroll",function(){var lazyheight=parseFloat($(window).height())+parseFloat($(window).scrollTop())+parseFloat($('.more').height());if($(document).height()<=lazyheight){loadMore()}})}else{$(".more").hide()}}else{console.log("There is no app to load.")}},error:function(){console.log("load recommend app list error")}})});