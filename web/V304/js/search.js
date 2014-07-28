/**
 * Created by zd on 2014/4/14 0014.
 */

var request = GetRequest();

//推荐应用ajax参数对象
var ajaxSearch =
{
    "total_size":0,//总共的应用个数
    "start_position":1,//从第几个开始取
    "init_size":10,//第一次取的数目
    "load_size":5,//之后每次下拉加载的数目
    "search_text":request.search_text,
    "url": $.apiRoot + "appV3/searchProducts.do",
    "detailUrl": $.htmlRoot + "game_detail.html",
    "onRefresh":false
};

//加载进来的推荐应用列表
var searchList = [];

//从现有node根据给的data创建新node
function createItem($node, itemData)
{
    var $item = $node.clone();
    fillItem($item, itemData);
    return $item;
}

//ajax填充一个应用的信息，$item是一个zepto对象，itemData提供填充数据
function fillItem($item, itemData)
{
    var packageName = itemData.resPackagename;
    var ca = itemData.resCapacity/(1024*1024);

    //使用包名作为id
    $item.attr("id", itemData.resPackagename)
        .data("location", itemData.resLocation)
        .data("id", itemData.resId)
        .data("package", packageName)
        .data("icon", itemData.resIcons)
        .data("name", itemData.resName)
        .data("capacity", ca);

    bindGiftTapHandler($item, itemData);

    //$item.find(".number").text(i);
    $item.find(".appIcon").data("icon", itemData.resIcons).attr("src", default_icon);

    $item.find(".tit strong").text(itemData.resName);
    $item.find(".tit p").text(ca.toFixed(1) + 'MB | ' + itemData.resDeveloper);

    //评分
    var rated = itemData.resRated;
    fillRate($item, rated);

    //状态
    fillState($item, packageName, phoneData);
}

//加载更多
function loadMore()
{
    if(!ajaxSearch.onRefresh && ajaxSearch.start_position <= ajaxSearch.total_size)
    {
        ajaxSearch.onRefresh = true;
        $.ajax(
            {
                url:ajaxSearch.url,
                dataType:'jsonp',
                data:
                {
                    "version":userInfo.version,
                    "phonetypeName":userInfo.phonetypeName,
                    "os_version":userInfo.os_version,
                    "imei":userInfo.imei,
                    "imsi":userInfo.imsi,
                    "size":ajaxSearch.load_size,
                    "start_position":ajaxSearch.start_position,
                    "search_text":ajaxSearch.search_text,
                    "servicePrivider":userInfo.userState && userInfo.serviceProvider
                },
                jsonp:'jsonSearch',
                success:function(data, textStatus, xhr)
                {
                    if(data.state === 1 && data.product)
                    {
                        var $container = $("#app-list-box");

                        searchList = searchList.concat(data.product);
                        var len = data.product.length;

                        for (var i = 0; i < len; ++i)
                        {
                            var $item = createItem($(".app").eq(0), data.product[i]);
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
                                infoTapHandler($(this).parent().parent());
                                return false;
                            });
                        }

                        ajaxSearch.start_position += len;

                        if(ajaxSearch.start_position > ajaxSearch.total_size)
                        {
                            $(".more").hide();
                        }
                        ajaxSearch.onRefresh = false;
                    }
                },
                error:function(XMLHttpRequest, textStatus, errorThrown)
                {
                    ajaxSearch.onRefresh = false;
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
            url:ajaxSearch.url,
            dataType:'jsonp',
            data:
            {
                "version":userInfo.version,
                "phonetypeName":userInfo.phonetypeName,
                "os_version":userInfo.os_version,
                "imei":userInfo.imei,
                "imsi":userInfo.imsi,
                "size":ajaxSearch.init_size,
                "start_position":ajaxSearch.start_position,
                "search_text":ajaxSearch.search_text,
                "servicePrivider":userInfo.userState && userInfo.serviceProvider
            },
            jsonp:'jsonSearch',
            success:function(data)
            {
                if(data.state === 1 && data.product.length)//获取成功且有
                {
                    ajaxSearch.total_size = data.products.total_size;
                    searchList = searchList.concat(data.product);
                    ajaxSearch.start_position += data.product.length;
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
                                infoTapHandler($(this).parent().parent());
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
                    if(ajaxSearch.start_position <= ajaxSearch.total_size)
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
                    }
                }
                else
                {
                    $(".appList").html('<p class="no-game">未搜索到相关游戏</p>');
                    $(".more").hide();
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
