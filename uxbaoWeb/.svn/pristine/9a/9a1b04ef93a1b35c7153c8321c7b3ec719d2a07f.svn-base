/**
 * Created by zd on 2014/4/27 0027.
 */

function GetRequest()
{
    var url = location.search; //获取url中"?"符后的字串
    var theRequest = {};
    if (url.indexOf("?") != -1)
    {
        var str = url.substr(1);
        strs = str.split("&");
        for(var i = 0; i < strs.length; i ++)
        {
            theRequest[strs[i].split("=")[0]]=decodeURI(strs[i].split("=")[1]);
        }
    }
    return theRequest;
}

var request = GetRequest();

//专题详情
var ajaxSubjectDetail = {
    "url": $.apiRoot + "appV3/getTopicById.do",
    "categoryId":request.categoryId
};

//专题应用ajax参数对象
var ajaxSubjectGame =
{
    "total_size":0,//总共的应用个数
    "start_position":1,//从第几个开始取
    "init_size":10,//第一次取的数目
    "load_size":5,//之后每次下拉加载的数目
    "rescategory_id":request.categoryId,
    'order_by':"hot",
    "url": $.apiRoot + "appV3/getCategoryProducts.do",
    "onRefresh":false,
    "detailUrl": $.htmlRoot + "game_detail.html"
};

//加载进来的推荐应用列表
var subjectGameList = [];
//空li字符串，创建用
function createItem(itemData)
{
    var $item = $($(".app")[0].cloneNode(true));
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

    //$item.find(".number").text(i);
    $item.find(".appIcon").data("icon", itemData.resIcons).attr("src", default_icon);

    $item.find(".tit strong").text(itemData.resName);
    var ca = (itemData.resCapacity/(1024 * 1024)).toFixed(1);
    $item.find(".tit p").text(ca + 'MB | ' + itemData.resDeveloper);

    //评分
    var rated = itemData.resRated;
    fillRate($item, rated);

    //状态
    fillState($item, packageName, phoneData);
}

//tap点击函数
function btnTapHandler($target)
{
    var $item = $target.parent().parent();
    window.location.href = $item.data('location');
}

//加载更多
function loadMore()
{
    if(!ajaxSubjectGame.onRefresh && ajaxSubjectGame.start_position <= ajaxSubjectGame.total_size)
    {
        ajaxSubjectGame.onRefresh = true;
        $.ajax(
            {
                url:ajaxSubjectGame.url,
                dataType:'jsonp',
                data:
                {
                    "rescategory_id":ajaxSubjectDetail.categoryId,
                    "order_by":ajaxSubjectGame.order_by,
                    "resolution":userInfo.resolution,
                    "version":userInfo.version,
                    "phonetypeName":userInfo.phonetypeName,
                    "os_version":userInfo.os_version,
                    "language":userInfo.language,
                    "imei":userInfo.imei,
                    "imsi":userInfo.imsi,
                    "size":ajaxSubjectGame.load_size,
                    "start_position":ajaxSubjectGame.start_position
                },
                jsonp:'jsonRecommend',
                success:function(data, textStatus, xhr)
                {
                    if(data.state === 1 && data.product)
                    {
                        var $container = $("#app-list-box");

                        subjectGameList = subjectGameList.concat(data.product);
                        var len = data.product.length;

                        for (var i = 0; i < len; ++i)
                        {
                            var $item = createItem(data.product[i]);
                            $container.append($item);
                            $item.find(".appIcon").imglazyload({"urlName":"data-icon"});
                            //添加点击响应函数
                            $item.find(".btn").on("click",function()
                            {
                                btnTapHandler($(this));
                                return false;
                            });
                            $item.find(".appInfo").on('click', function()
                            {
                                infoTapHandler($(this));
                                return false;
                            });
                        }

                        ajaxSubjectGame.start_position += len;

                        if(ajaxSubjectGame.start_position > ajaxSubjectGame.total_size)
                        {
                            $(".more").hide();
                        }
                        ajaxSubjectGame.onRefresh = false;
                    }
                },
                error:function(XMLHttpRequest, textStatus, errorThrown)
                {
                    ajaxSubjectGame.onRefresh = false;
                    console.log("failed ajax!");
                    $(".more").hide();
                }
            }
        );
    }
}

//进入游戏详情
function infoTapHandler($info)
{
    var $item = $info.parent().parent();
    var resId = $item.data("id");
    window.location.href = ajaxSubjectGame.detailUrl + "?resId=" + resId;
}

//将日期对象转换成日期字符串如2014.03.15
function getDateStr(date)
{
    var dateStr = "";
    dateStr += date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    if(month < 10)
    {
        dateStr += '.0' + month;
    }
    else
    {
        dateStr += '.' + month;
    }
    if(day < 10)
    {
        dateStr += '.0' + day;
    }
    else
    {
        dateStr += '.' + day;
    }
    return dateStr;
}

var default_icon, star_01, star_02, star_03;

//页面加载完毕执行函数
$(function()
{
    default_icon = $('.app').eq(0).find(".appIcon").attr("src");
    var $default_stars = $('.items-score').eq(0).find('img');
    star_01 = $default_stars.eq(0).attr('src');
    star_02 = $default_stars.eq(1).attr('src');
    star_03 = $default_stars.eq(2).attr('src');

    //专题内容
    $.ajax({
        url:ajaxSubjectDetail.url,
        dataType:'jsonp',
        data:{
            "categoryId":ajaxSubjectDetail.categoryId,
            "version":userInfo.version,
            "phonetypeName":userInfo.phonetypeName,
            "os_version":userInfo.os_version,
            "language":userInfo.language,
            "imei":userInfo.imei,
            "imsi":userInfo.imsi,
            "resolution":userInfo.resolution
        },
        jsonp:'jsonpSubjectDetail',
        success:function(data)
        {
            if(data.state === 1)
            {
                $('.headPic').data('icon', data.ResourcesCategory.rescategoryIcons).imglazyload({"urlName":"data-icon"});
                $('.subjectName').text(data.ResourcesCategory.rescategoryName);
                $('.subjectTime').text(getDateStr(new Date(data.ResourcesCategory.rescategoryCreateddate)));
                $('.description').text(data.ResourcesCategory.rescategoryDescription);
            }
        },
        error:function()
        {
            console.log("load subject detail failed.");
        }
    });

    //最开始ajax加载10个应用
    $.ajax(
        {
            url:ajaxSubjectGame.url,
            dataType:'jsonp',
            data:
            {
                "rescategory_id":ajaxSubjectDetail.categoryId,
                "order_by":ajaxSubjectGame.order_by,
                "resolution":userInfo.resolution,
                "version":userInfo.version,
                "phonetypeName":userInfo.phonetypeName,
                "os_version":userInfo.os_version,
                "language":userInfo.language,
                "imei":userInfo.imei,
                "imsi":userInfo.imsi,
                "size":ajaxSubjectGame.init_size,
                "start_position":ajaxSubjectGame.start_position
            },
            jsonp:'jsonpSubjectGame',
            success:function(data)
            {
                if(data.state === 1)//获取成功
                {
                    ajaxSubjectGame.total_size = data.products.total_size;
                    subjectGameList = subjectGameList.concat(data.product);
                    ajaxSubjectGame.start_position += data.product.length;
                    $(".app").each(function(i,item)
                    {
                        var $item = $(this);
                        if(data.product[i])
                        {
                            fillItem($item, data.product[i]);
                            $item.find(".appIcon").imglazyload({"urlName":"data-icon"});
                            
                            //添加点击响应函数
                            $item.find(".btn").on("click",function()
                            {
                                btnTapHandler($(this));
                                return false;
                            });
                            $item.find(".appInfo").on('click', function()
                            {
                                infoTapHandler($(this));
                                return false;
                            });
                        }
                        else
                        {
                            $item.remove();
                        }
                    });
                    
                    $.fn.imglazyload.detect();
                    
                    //下拉加载
                    if(ajaxSubjectGame.start_position <= ajaxSubjectGame.total_size)
                    {
                        $(window).on("scroll", function()
                        {
                            var lazyheight = parseFloat($(window).height()) + parseFloat($(window).scrollTop()) + parseFloat($('.more').height());
                            if ($(document).height() <= lazyheight)
                            {
                                loadMore();
                            }
                        });
                    }
                    else
                    {
                        $(".more").hide();
                    }
                }
                else
                {
                    console.log("There is no app to load.");
                }
            },
            error:function()
            {
                console.log("load recommend app list error");
            }
        }
    );
});
