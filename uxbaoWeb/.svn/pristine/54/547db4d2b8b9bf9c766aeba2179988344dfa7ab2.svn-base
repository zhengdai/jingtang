/**
 * Created by zd on 2014/5/10 0010.
 */
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

function indexOfGift(acId)
{
    var len = myGiftData.length;
    for(var i = 0; i < len; ++i)
    {
        if(myGiftData[i].acId === acId)
        {
            return i;
        }
    }
    return -1;
}

/**
 比较两个日期相差的天数，可为负值
 **/
function dateDiff(sDate1, sDate2)
{ //sDate1和sDate2是2002-00-18格式
    var aDate, oDate1, oDate2, iDays;
    aDate = sDate1.split(".");
    oDate1 = new Date(aDate[0],aDate[1] - 1,aDate[2]);
    aDate = sDate2.split(".");
    oDate2 = new Date(aDate[0],aDate[1] - 1,aDate[2]);
    iDays = parseInt((oDate1 - oDate2) / 1000 / 60 / 60 /24);
    return iDays;
}


//推荐应用ajax参数对象
var ajaxhistoryRec =
{
    "total_size":0,//总共的应用个数
    "start_position":1,//从第几个开始取
    "init_size":10,//第一次取的数目
    "load_size":5,//之后每次下拉加载的数目
    "url": $.apiRoot + "appV3/getDailyRecommend.do",
    "detailUrl": $.htmlRoot + "game_detail.html",
    "onRefresh":false,
    "now":new Date(),
    "currentDate":new Date()
};

//加载进来的推荐应用列表
var historyRecList = [];

function createItem(itemData)
{
    var $item = $($(".app")[0].cloneNode(true));
    fillItem($item, itemData);
    return $item;
}

function createDate(dateStr)
{
    var $date = $($(".date")[0].cloneNode(true));
    $date.removeClass('today yesterday');
    if(dateStr == '昨天')
    {
        $date.addClass('yesterday').find('.date-content').text(dateStr);
    }
    else
    {
        $date.find('.date-content').text(dateStr);
    }
    return $date;
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

    if(itemData.isFree)
    {
        $item.find('.free-flag').show();
    }
    else
    {
        $item.find('.free-flag').hide();
    }
    if(itemData.acId)
    {
        var index = indexOfGift(itemData.acId);
        //领过了
        if(index != -1)
        {
            $item.find('.relate-gift').show().on('tap', function()
            {
                isUxbao && window.uxbao.click(JSON.stringify
                    (
                        {
                            "type":12,
                            "title":itemData.acName,
                            "url":$.htmlRoot + "gift_detail.html" +  "?acId=" + itemData.acId + "&num=" + myGiftData[index].giftNo
                        }
                    )
                );
                return false;
            });
        }
        //没领过
        else
        {
            $item.find('.relate-gift').show().on('tap', function()
            {
                isUxbao && window.uxbao.click(JSON.stringify
                    (
                        {
                            "type":12,
                            "title":itemData.acName,
                            "url":$.htmlRoot + "gift_detail.html" +  "?acId=" + itemData.acId
                        }
                    )
                );
                return false;
            });
        }
    }
    else
    {
        $item.find('.relate-gift').hide().off('tap');
    }
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
    //通知android下载
    if($target.hasClass('dlBtn') || $target.hasClass('continueBtn'))
    {
        $target.removeClass().addClass('cancelBtn btn');
        $target.find(".state").text('暂停');
        isUxbao && window.uxbao.click(
            JSON.stringify(
                {
                    "type":1,
                    "resPackagename":$item.data("package"),
                    "resId":$item.data("id"),
                    "resLocation":$item.data("location"),
                    "resIcons":$item.data("icon"),
                    "resName":$item.data("name")
                }
            )
        );
    }
    else if($target.hasClass('updateBtn'))
    {
        $target.removeClass('updateBtn').addClass('cancelBtn');
        $target.find(".state").text('暂停');
        isUxbao && window.uxbao.click(
            JSON.stringify(
                {
                    "type":1,
                    "resPackagename":$item.data("package"),
                    "resId":$item.data("id"),
                    "resLocation":$item.data("location"),
                    "resIcons":$item.data("icon"),
                    "resName":$item.data("name")
                }
            )
        );
    }
    //通知android暂停下载
    else if($target.hasClass('cancelBtn'))
    {
        $target.removeClass('cancelBtn').addClass('continueBtn');
        $target.find(".state").text('继续');
        isUxbao && window.uxbao.click(
            JSON.stringify(
                {
                    "type":5,
                    "resPackagename":$item.data("package"),
                    "resId":$item.data("id"),
                    "resLocation":$item.data("location"),
                    "resIcons":$item.data("icon"),
                    "resName":$item.data("name")
                }
            )
        );
    }
    //通知android打开此应用
    else if($target.hasClass("openBtn"))
    {
        isUxbao && window.uxbao.click(
            JSON.stringify(
                {
                    "type":3,
                    "resPackagename":$item.data("package"),
                    "resId":$item.data("id"),
                    "resLocation":$item.data("location"),
                    "resIcons":$item.data("icon"),
                    "resName":$item.data("name")
                }
            )
        );
    }
    //通知android安装此应用
    else if($target.hasClass("installBtn"))
    {
        isUxbao && window.uxbao.click(
            JSON.stringify(
                {
                    "type":6,
                    "resPackagename":$item.data("package"),
                    "resId":$item.data("id"),
                    "resLocation":$item.data("location"),
                    "resIcons":$item.data("icon"),
                    "resName":$item.data("name")
                }
            )
        );
    }
}

//加载更多
function loadMore()
{
    if(!ajaxhistoryRec.onRefresh && ajaxhistoryRec.start_position <= ajaxhistoryRec.total_size)
    {
        ajaxhistoryRec.onRefresh = true;
        $.ajax(
            {
                url:ajaxhistoryRec.url,
                dataType:'jsonp',
                data:
                {
                    "resolution":userInfo.resolution,
                    "version":userInfo.version,
                    "phonetypeName":userInfo.phonetypeName,
                    "os_version":userInfo.os_version,
                    "language":userInfo.language,
                    "imei":userInfo.imei,
                    "imsi":userInfo.imsi,
                    "size":ajaxhistoryRec.load_size,
                    "start_position":ajaxhistoryRec.start_position,
                    "servicePrivider":userInfo.userState && userInfo.serviceProvider
                },
                jsonp:'jsonHistoryRec',
                success:function(data, textStatus, xhr)
                {
                    if(data.state === 1 && data.product)
                    {
                        var $container = $("#app-list-box");

                        historyRecList = historyRecList.concat(data.product);
                        var len = data.product.length;

                        for (var i = 0; i < len; ++i)
                        {
                            var day = dateDiff(getDateStr(ajaxhistoryRec.now), getDateStr(ajaxhistoryRec.currentDate));
                            //当天
                            if(day === 0)
                            {
                                $container.append(createDate("今天"));
                            }
                            else if(day === 1)
                            {
                                $container.append(createDate("昨天"));
                            }
                            else
                            {
                                $container.append(createDate(getDateStr(ajaxhistoryRec.currentDate)));
                            }
                            var $item = createItem(data.product[i]);
                            $container.append($item);
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
                            ajaxhistoryRec.currentDate.setDate(ajaxhistoryRec.currentDate.getDate() - 1);
                        }

                        ajaxhistoryRec.start_position += len;

                        if(ajaxhistoryRec.start_position > ajaxhistoryRec.total_size)
                        {
                            $(".more").hide();
                            $(".ver-line").addClass('load-complete');
                        }
                        ajaxhistoryRec.onRefresh = false;
                    }
                },
                error:function(XMLHttpRequest, textStatus, errorThrown)
                {
                    ajaxhistoryRec.onRefresh = false;
                    console.log("failed ajax!");
                    $(".more").hide();
                    $(".ver-line").addClass('load-complete');
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
    isUxbao && window.uxbao.click(
        JSON.stringify(
            {
                "type":2,
                "resId":resId,
                "url":ajaxhistoryRec.detailUrl + "?resId=" + resId,
                "resName":$item.data("name"),
                "resPackageName":$item.data("package")
            }
        )
    );
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
    //最开始ajax加载10个应用
    $.ajax(
        {
            url:ajaxhistoryRec.url,
            dataType:'jsonp',
            data:
            {
                "resolution":userInfo.resolution,
                "version":userInfo.version,
                "phonetypeName":userInfo.phonetypeName,
                "os_version":userInfo.os_version,
                "language":userInfo.language,
                "imei":userInfo.imei,
                "imsi":userInfo.imsi,
                "size":ajaxhistoryRec.init_size,
                "start_position":ajaxhistoryRec.start_position,
                "servicePrivider":userInfo.userState && userInfo.serviceProvider
            },
            jsonp:'jsoncallback',
            success:function(data)
            {
                if(data.state === 1)//获取成功
                {
                    var $container = $("#app-list-box");
                    ajaxhistoryRec.total_size = data.products.total_size;
                    historyRecList = historyRecList.concat(data.product);
                    ajaxhistoryRec.start_position += data.product.length;

                    var len = data.product.length;
                    var $default_date = $('.date'), $default_app = $('.app');
                    for(var i = 0; i < len; ++i)
                    {
                        if(i=== 0)
                        {

                            $default_date.find('.date-content').text('今天');
                            fillItem($default_app, data.product[i]);
                            $default_app.find(".appIcon").imglazyload({"urlName":"data-icon"});
                            //添加点击响应函数
                            $default_app.find(".btn").on("tap",function()
                            {
                                btnTapHandler($(this));
                                return false;
                            });
                            $default_app.find(".appInfo").on('tap', function()
                            {
                                infoTapHandler($(this));
                                return false;
                            });
                        }
                        else
                        {
                            var day = dateDiff(getDateStr(ajaxhistoryRec.now), getDateStr(ajaxhistoryRec.currentDate));
                            //当天
                            if(day === 0)
                            {
                                $container.append(createDate("今天"));
                            }
                            else if(day === 1)
                            {
                                $container.append(createDate("昨天"));
                            }
                            else
                            {
                                $container.append(createDate(getDateStr(ajaxhistoryRec.currentDate)));
                            }
                            var $item = createItem(data.product[i]);
                            $container.append($item);
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
                        ajaxhistoryRec.currentDate.setDate(ajaxhistoryRec.currentDate.getDate() - 1);
                    }

                    $.fn.imglazyload.detect();
                    //下拉加载
                    if(ajaxhistoryRec.start_position <= ajaxhistoryRec.total_size)
                    {
                        $(window).on("scroll", function()
                        {
                            var lazyheight = parseFloat($(window).height()) + parseFloat($(window).scrollTop()) + parseFloat($('.more').height());
                            if ($(document).height() <= lazyheight)
                            {
                                loadMore();
                            }
                        });
                        $(window).trigger('scroll');
                    }
                    else
                    {
                        $(".more").hide();
                        $(".ver-line").addClass('load-complete');
                    }
                }
                else
                {
                    console.log("There is no app to load.");
                }
            },
            error:function()
            {
                console.log("load New app list error");
            }
        }
    );
});
