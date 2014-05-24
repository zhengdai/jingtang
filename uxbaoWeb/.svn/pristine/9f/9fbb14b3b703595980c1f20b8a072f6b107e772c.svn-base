/**
 * Created by zd on 2014/5/4 0004.
 */
var ajaxMustCategory = {
    "url": $.apiRoot + "appV3/getCategory.do",
    "category":29
};

var ajaxMustGame = {
    "url": $.apiRoot + "appV3/getCategoryProducts.do",
    "size":8,
    "start_position":1,
    "order_by":"hot",
    "detailUrl": $.htmlRoot + "game_detail.html"
};

function createItem(itemData)
{
    var $item = $(($(".app")[0]).cloneNode(true));
    fillItem($item, itemData);
    return $item;
}

//供android调用，更新页面的应用的状态，一种是安装包下载进度，还有就是下载完成，安装完成时
function updateState(packageName, state)
{
    var $item = $(document.getElementById(packageName));
    var $btn = $item.find(".btn");
    if(state >= 0 && state <= 100)
    {
        if(!$btn.hasClass("cancelBtn"))
        {
            $btn.removeClass().addClass("cancelBtn btn");
        }
        $item.find(".state").text(state + "%");
    }
    else if(state == "finishDownload")
    {
        $btn.removeClass().addClass("installBtn btn");
        $item.find(".state").text("安装");
    }
    else if(state == "finishInstall")
    {
        $btn.removeClass().addClass("openBtn btn");
        $item.find(".state").text("打开");
    }
    else if(state == "pause")
    {
        $btn.removeClass().addClass("continueBtn btn");
        $item.find(".state").text("继续");
    }
}

//判断packageName是否在list中，在的话返回索引，不在的话返回-1
function indexList(packageName, list)
{
    var len = list.length;
    for(var i = 0; i < len; ++i)
    {
        if(packageName == list[i].resPackagename)
        {
            return i;
        }
    }
    return -1;
}

//ajax填充打分
function fillRate($item, score)
{
    //分数
    $item.find(".items-score img").each(function(j, imgItem)
    {
        if(j - score < -0.5)
        {
            $(imgItem).attr("src", star_01);
        }
        else if(j - score == -0.5)
        {
            $(imgItem).attr("src", star_02);
        }
        else
        {
            $(imgItem).attr("src", star_03);
        }
    });
}

//根据本机信息填充状态
function fillState($item, packageName, phoneData)
{
    //在下载列表里
    var downloadIndex = indexList(packageName, phoneData.downloadList);
    if(downloadIndex != -1)
    {
        //下载完成。显示安装状态
        if(phoneData.downloadList[downloadIndex].downPercent == 100)
        {
            $item.find(".state").text("安装");
            $item.find(".btn").removeClass().addClass("btn installBtn");
        }
        //下载未完成，显示继续
        else
        {
            $item.find(".state").text("继续");
            $item.find(".btn").removeClass().addClass("btn continueBtn");
        }
    }
    //在升级列表里
    else if(indexList(packageName, phoneData.updateList) != -1)
    {
        $item.find(".state").text("升级");
        $item.find(".btn").removeClass().addClass("btn updateBtn");
    }
    //在已安装列表
    else if(indexList(packageName, phoneData.installList) != -1)
    {
        $item.find(".state").text("打开");
        $item.find(".btn").removeClass().addClass("btn openBtn");
    }
    //不在上述列表中
    else
    {
        $item.find(".state").text("下载");
        $item.find(".btn").removeClass().addClass("btn dlBtn");
    }
}

//ajax填充一个应用的信息，$item是一个zepto对象，itemData提供填充数据
function fillItem($item, itemData)
{
    var packageName = itemData.resPackagename;
    //使用包名作为id
    $item.attr("id", itemData.resPackagename)
        .data("location", itemData.resLocation)
        .data("id", itemData.resId)
        .data("package", packageName)
        .data("icon", itemData.resIcons)
        .data("name", itemData.resName);

    $item.find(".appIcon").data("icon", itemData.resIcons).attr("src", default_icon);

    $item.find(".tit strong").text(itemData.resName);
    var ca = (itemData.resCapacity/(1024 * 1024)).toFixed(1);
    $item.find('.company').text(ca + 'MB');

    //评分
    var rated = itemData.resRated;
    fillRate($item, rated);

    //状态
    fillState($item, packageName, phoneData);
}

//tap点击函数
function btnTapHandler($target)
{
    var $item;
    $item = $target.parent().parent();
    window.location.href = $item.data('location');
}

//进入游戏详情
function infoTapHandler($info)
{
    var $item = $info.parent().parent();
    var resId = $item.data("id");
    window.location.href = ajaxMustGame.detailUrl + "?resId=" + resId;
}

function fillListItem($listItem, listItemData)
{
    $listItem.data('rescategoryId', listItemData.rescategoryId)
        .find('.list-top').find('span').text(listItemData.rescategoryName);
    $.ajax({
        url:ajaxMustGame.url,
        dataType:"jsonp",
        data:{
            "start_position":ajaxMustGame.start_position,
            "size":ajaxMustGame.size,
            "order_by":ajaxMustGame.order_by,
            "rescategory_id":listItemData.rescategoryId,
            "resolution":userInfo.resolution,
            "version":userInfo.version,
            "phonetypeName":userInfo.phonetypeName,
            "os_version":userInfo.os_version,
            "imei":userInfo.imei,
            "imsi":userInfo.imsi,
            "language":userInfo.language
        },
        jsonp:'jsonMustGame',
        success:function(data)
        {
            if(data.state === 1)//获取成功
            {
                $listItem.find('.app').each(function(i,item)
                {
                    var $item = $(this);
                    if(data.product[i])
                    {
                        fillItem($item, data.product[i]);
                        $item.find(".appIcon").imglazyload({"urlName":"data-icon"});

                        //添加点击响应函数
                        $item.find(".btn").on("tap",function()
                        {
                            btnTapHandler($(this));
                            return false;
                        });
                        $item.find(".appInfo").on('tap', function()
                        {
                            infoTapHandler($(this));
                            return false;
                        });
                    }
                    else
                    {
                        $item.remove();
                    }
                    $.fn.imglazyload.detect();
                });
            }
            else
            {
                console.log("There is no app to load.");
            }
        },
        error:function()
        {
            console.log("load app data error.");
        }
    });
}

function createListItem(itemData)
{
    var $listItem = $(($(".appList")[0]).cloneNode(true));
    fillListItem($listItem, itemData);
    return $listItem;
}

var default_icon, star_01, star_02, star_03;

$(function(){
    default_icon = $(".app").eq(0).find('.appIcon').attr('src');
    var $default_stars = $('.items-score').eq(0).find('img');
    star_01 = $default_stars.eq(0).attr('src');
    star_02 = $default_stars.eq(1).attr('src');
    star_03 = $default_stars.eq(2).attr('src');
    $.ajax({
        url:ajaxMustCategory.url,
        dataType:"jsonp",
        data:
        {
            "category":ajaxMustCategory.category,
            "version":userInfo.version,
            "phonetypeName":userInfo.phonetypeName,
            "os_version":userInfo.os_version,
            "imei":userInfo.imei,
            "imsi":userInfo.imsi
        },
        jsonp:'jsonMustCategory',
        success:function(data)
        {
            var len = data.product.length;
            var $defaultListItem = $(".appList");
            var $container = $("body");
            for(var i = 0; i < len; ++i)
            {
                var $list_item;
                if($defaultListItem[i])
                {
                    $list_item = $defaultListItem.eq(i);
                    fillListItem($list_item, data.product[i]);
                }
                else
                {
                    $list_item = createListItem(data.product[i]);
                    $container.append($list_item);
                }
                $list_item.find(".appIcon").imglazyload({"urlName": "data-icon"});
            }
            for(var j = len; j < $defaultListItem.length; ++j)
            {
                $defaultListItem.eq(j).remove();
            }
            $.fn.imglazyload.detect();
        },
        error:function()
        {
            console.log("load category data error.");
        }
    });
});