/**
 * Created by zd on 14-3-22.
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

//分类详情应用ajax参数对象
var ajaxCategoryDetail =
{
    "total_size":0,//总共的应用个数
    "start_position":1,//从第几个开始取
    "init_size":10,//第一次取的数目
    "load_size":5,//之后每次下拉加载的数目
    "order_by":request.order_by,
    "rescategory_id":request.rescategory_id,
    "url": $.apiRoot + "appV3/getCategoryProducts.do",
    "detailUrl": $.htmlRoot + "game_detail.html",
    "onRefresh":false
};

//加载进来的推荐应用列表
var appList = [];
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
                "url": ajaxCategoryDetail.detailUrl + "?resId=" + resId,
                "resName":$item.data("name"),
                "resPackageName":$item.data("package")
            }
        )
    );
}

//加载更多
function loadMore()
{
    if(!ajaxCategoryDetail.onRefresh && ajaxCategoryDetail.start_position <= ajaxCategoryDetail.total_size)
    {
        ajaxCategoryDetail.onRefresh = true;
        $.ajax(
            {
                url:ajaxCategoryDetail.url,
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
                    "size":ajaxCategoryDetail.load_size,
                    "start_position":ajaxCategoryDetail.start_position,
                    "order_by":ajaxCategoryDetail.order_by,
                    "rescategory_id":ajaxCategoryDetail.rescategory_id
                },
                jsonp:'jsonRecommend',
                success:function(data, textStatus, xhr)
                {
                    if(data.state === 1 && data.product)
                    {
                        var $container = $("#app-list-box");

                        appList = appList.concat(data.product);
                        var len = data.product.length;

                        for (var i = 0; i < len; ++i)
                        {
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

                        ajaxCategoryDetail.start_position += len;

                        if(ajaxCategoryDetail.start_position > ajaxCategoryDetail.total_size)
                        {
                            $(".more").hide();
                        }
                        ajaxCategoryDetail.onRefresh = false;
                    }
                },
                error:function(XMLHttpRequest, textStatus, errorThrown)
                {
                    ajaxCategoryDetail.onRefresh = false;
                    console.log("failed ajax!");
                    $(".more").hide();
                }
            }
        );
    }
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
            url:ajaxCategoryDetail.url,
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
                "size":ajaxCategoryDetail.init_size,
                "start_position":ajaxCategoryDetail.start_position,
                "order_by":ajaxCategoryDetail.order_by,
                "rescategory_id":ajaxCategoryDetail.rescategory_id
            },
            jsonp:'jsoncallback',
            success:function(data)
            {
                if(data.state === 1)//获取成功
                {
                    ajaxCategoryDetail.total_size = data.products.total_size;
                    appList = appList.concat(data.product);
                    ajaxCategoryDetail.start_position += data.product.length;
                    $(".app").each(function(i,item)
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
                    });
                    $.fn.imglazyload.detect();
                    //下拉加载
                    if(ajaxCategoryDetail.start_position <= ajaxCategoryDetail.total_size)
                    {
                        $(window).on("scroll", function()
                        {
                            lazyheight = parseFloat($(window).height()) + parseFloat($(window).scrollTop()) + parseFloat($('.more').height());
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
                console.log("load category app list error");
            }
        }
    );
});
