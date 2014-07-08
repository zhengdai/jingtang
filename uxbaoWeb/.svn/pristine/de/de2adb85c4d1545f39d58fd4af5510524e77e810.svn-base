/**
 * Created by zd on 2014/4/16 0016.
 */

var ajaxInfo = {
    "total_size":0,//总共的专题个数
    "start_position":1,//从第几个开始取
    "init_size":5,//第一次取的数目
    "load_size":3,//之后每次下拉加载的数目
    "url": $.apiRoot + "newsV3/getNews.do",
    "detailUrl": $.htmlRoot + "info_detail.html",
    "onRefresh":false
};

//加载进来的专题列表
var infoList = [];
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
    $item.data("infoId", itemData.infoId).data('infoTitle', itemData.infoTitle);
    $item.find(".infoName").text(itemData.infoTitle);
    $item.find(".infoIcon").find("img").data("pic", itemData.resIcon).attr('src', default_icon);
    var date = new Date(parseInt(itemData.infoCreateddate));
    $item.find(".infoDate").text(getDateStr(date));
    $item.find(".tit").text("【摘要】");
    $item.find(".content").text(itemData.infoAbstract);
    $item.find(".figure").data("pic", itemData.infoImg).attr('src', default_pic);
}

//点击进入资讯详情
function itemTapHandler($target)
{
        isUxbao && window.uxbao.click(JSON.stringify
            (
                {
                    "type":14,
                    "title":$target.data('infoTitle'),
                    "url":ajaxInfo.detailUrl +  "?infoId=" + $target.data("infoId")
                }
            )
        );
}

//加载更多
function loadMore()
{
    if(!ajaxInfo.onRefresh && ajaxInfo.start_position <= ajaxInfo.total_size)
    {
        ajaxInfo.onRefresh = true;
        $.ajax(
            {
                url:ajaxInfo.url,
                dataType:'jsonp',
                data:
                {
                    "version":userInfo.version,
                    "phonetypeName":userInfo.phonetypeName,
                    "os_version":userInfo.os_version,
                    "imei":userInfo.imei,
                    "imsi":userInfo.imsi,
                    "size":ajaxInfo.load_size,
                    "start_position":ajaxInfo.start_position
                },
                jsonp:'jsonInfoList',
                success:function(data, textStatus, xhr)
                {
                    if(data.state === 1 && data.news.length)
                    {
                        var $container = $("#info-list-box");
                        infoList = infoList.concat(data.news);
                        var len = data.news.length;

                        for (var i = 0; i < len; ++i)
                        {
                            var $item = createItem($(".infoItem").eq(0), data.news[i]);
                            $item.on("tap", function()
                            {
                                itemTapHandler($(this));
                                return false;
                            });
                            $container.append($item);
                            $item.find("img").imglazyload({"urlName":"data-pic"});
                        }


                        ajaxInfo.start_position += len;

                        if(ajaxInfo.start_position > ajaxInfo.total_size)
                        {
                            $(".more").hide();
                        }
                        ajaxInfo.onRefresh = false;
                    }
                },
                error:function(XMLHttpRequest, textStatus, errorThrown)
                {
                    ajaxInfo.onRefresh = false;
                    console.log("failed ajax!");
                    $(".more").hide();
                }
            }
        );
    }
}

var default_icon, default_pic;

//页面加载完毕执行函数
$(function()
{
    var $default_info = $(".infoItem").eq(0);
    default_icon = $default_info.find('.infoIcon').find('img').attr('src');
    default_pic = $default_info.find('.figure').attr('src');
    //最开始ajax加载5个活动
    $.ajax(
        {
            url:ajaxInfo.url,
            dataType:'jsonp',
            data:
            {
                "version":userInfo.version,
                "phonetypeName":userInfo.phonetypeName,
                "os_version":userInfo.os_version,
                "imei":userInfo.imei,
                "imsi":userInfo.imsi,
                "size":ajaxInfo.init_size,
                "start_position":ajaxInfo.start_position
            },
            jsonp:'jsonInfoList',
            success:function(data)
            {
                if(data.state === 1 && data.news.length)//获取成功
                {
                    ajaxInfo.total_size = data.allNews.total_size;
                    infoList = infoList.concat(data.activity);
                    ajaxInfo.start_position += data.news.length;
                    $(".infoItem").each(function(i,item)
                    {
                        var $item = $(this);
                        if(data.news[i])
                        {
                            fillItem($item, data.news[i]);
                            $item.on("tap", function()
                            {
                                itemTapHandler($(this));
                                return false;
                            });
                            $item.find("img").imglazyload({"urlName": "data-pic"});

                        }
                        else
                        {
                            $item.remove();
                        }
                    });

                    $.fn.imglazyload.detect();

                    //下拉加载
                    if(ajaxInfo.start_position <= ajaxInfo.total_size)
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
                    console.log("failed to get json data.");
                }
            }
        }
    );
});