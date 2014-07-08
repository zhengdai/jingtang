/**
 * Created by zd on 2014/4/27 0027.
 */

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
                    "start_position":ajaxSubjectGame.start_position,
                    "servicePrivider":userInfo.userState && userInfo.serviceProvider
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
                "start_position":ajaxSubjectGame.start_position,
                "servicePrivider":userInfo.userState && userInfo.serviceProvider
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
                        $(window).trigger('scroll');
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
