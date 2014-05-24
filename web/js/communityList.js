/**
 * Created by zd on 2014/4/20 0020.
 */
/**
 * Created by zd on 2014/4/16 0016.
 */

var ajaxCommunity = {
    "total_size":0,//总共的社区个数
    "start_position":1,//从第几个开始取
    "init_size":5,//第一次取的数目
    "load_size":3,//之后每次下拉加载的数目
    "url": $.apiRoot + "appV3/getCommunityResources.do",
    "commentListUrl": $.htmlRoot + "comment_list.html",
    "commentUrl": $.htmlRoot + "comment.html",
    "onRefresh":false
};

//加载进来的社区列表
var communityList = [];
//空li字符串，创建用
function createItem(itemData)
{
    var $item = $(($(".communityItem")[0]).cloneNode(true));
    fillItem($item,itemData);
    return $item;
}

//ajax填充一个应用的信息，$item是一个zepto对象，itemData提供填充数据
function fillItem($item, itemData)
{
    $item.data("resId", itemData.resId);
    $item.data("resIcons", itemData.resIcons);
    $item.data("resPackagename", itemData.resPackagename);
    $item.find(".communityName").text(itemData.resName);
    $item.find(".content").text(itemData.topRemark);
    $item.find(".gameIcon").find("img").data("pic", itemData.resIcons).attr('src', default_icon);
    $item.find(".communityNum").text(itemData.resCustratednum + "次评论");
}

//点击社区函数
function btnTapHandler($target)
{
    isUxbao && window.uxbao.moreComment(
        JSON.stringify(
            {
                "allUrl":ajaxCommunity.commentListUrl + "?resId=" + $target.data("resId"),
                "goodUrl":ajaxCommunity.commentListUrl + "?resId=" + $target.data("resId") + "&type=Good",
                "badUrl":ajaxCommunity.commentListUrl + "?resId=" + $target.data("resId") + "&type=Bad",
                "commentUrl":ajaxCommunity.commentUrl + "?resId=" + $target.data("resId"),
                "resIcons":$target.data('resIcons'),
                "resPackagename":$target.data('resPackagename')
            }
        )
    );

}

//加载更多
function loadMore()
{
    if(!ajaxCommunity.onRefresh && ajaxCommunity.start_position <= ajaxCommunity.total_size)
    {
        ajaxCommunity.onRefresh = true;
        $.ajax(
            {
                url:ajaxCommunity.url,
                dataType:'jsonp',
                data:
                {
                    "version":userInfo.version,
                    "phonetypeName":userInfo.phonetypeName,
                    "os_version":userInfo.os_version,
                    "imei":userInfo.imei,
                    "imsi":userInfo.imsi,
                    "size":ajaxCommunity.load_size,
                    "start_position":ajaxCommunity.start_position
                },
                jsonp:'jsonCommunity',
                success:function(data, textStatus, xhr)
                {
                    if(data.state === 1 && data.product.length)
                    {
                        var $container = $("#community-list-box");
                        communityList = communityList.concat(data.news);
                        var len = data.product.length;

                        for (var i = 0; i < len; ++i)
                        {
                            var $item = createItem(data.product[i]);
                            $item.on('tap', function()
                            {
                                btnTapHandler($(this));
                                return false;
                            });
                            $container.append($item);
                            $item.find(".gameIcon").find("img").imglazyload({"urlName":"data-pic"});
                        }


                        ajaxCommunity.start_position += len;

                        if(ajaxCommunity.start_position > ajaxCommunity.total_size)
                        {
                            $(".more").hide();
                        }
                        ajaxCommunity.onRefresh = false;
                    }
                },
                error:function(XMLHttpRequest, textStatus, errorThrown)
                {
                    ajaxCommunity.onRefresh = false;
                    console.log("failed ajax!");
                    $(".more").hide();
                }
            }
        );
    }
}

var default_icon;

//页面加载完毕执行函数
$(function()
{
    default_icon = $(".communityItem").eq(0).find('.gameIcon').find('img').attr('src');
    //最开始ajax加载5个活动
    $.ajax(
        {
            url:ajaxCommunity.url,
            dataType:'jsonp',
            data:
            {
                "version":userInfo.version,
                "phonetypeName":userInfo.phonetypeName,
                "os_version":userInfo.os_version,
                "imei":userInfo.imei,
                "imsi":userInfo.imsi,
                "size":ajaxCommunity.init_size,
                "start_position":ajaxCommunity.start_position
            },
            jsonp:'jsonCommunity',
            success:function(data)
            {
                if(data.state === 1 && data.product.length)//获取成功
                {
                    ajaxCommunity.total_size = data.products.total_size;
                    communityList = communityList.concat(data.activity);
                    ajaxCommunity.start_position += data.product.length;
                    $(".communityItem").each(function(i,item)
                    {
                        var $item = $(this);
                        if(data.product[i])
                        {
                            fillItem($item, data.product[i]);
                            $item.find(".gameIcon").find("img").imglazyload({"urlName": "data-pic"});
                            $item.on('tap', function()
                            {
                                btnTapHandler($(this));
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
                    if(ajaxCommunity.start_position <= ajaxCommunity.total_size)
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
                    console.log("failed to get json data.");
                }
            }
        }
    );
});