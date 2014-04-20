/**
 * Created by zd on 2014/4/16 0016.
 */
var isUxbao;
if(window.uxbao)
{
    isUxbao = true;
}
else
{
    isUxbao = false;
}

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
    return dateStr
}

var ajaxInfo = {
    "total_size":0,//总共的专题个数
    "start_position":1,//从第几个开始取
    "init_size":5,//第一次取的数目
    "load_size":3,//之后每次下拉加载的数目
    "url":"http://115.29.177.196:8080/mystore/newsV3/getNews.do",
    "detailUrl":"http://115.29.177.196/资讯详情.html",
    "version":"2.3",
    "phonetypeName":"N7105",
    "os_version":4.0,
    "imei":"00000000",
    "imsi":"00000000",
    "onRefresh":false
};

//加载进来的专题列表
var infoList = [];
//空li字符串，创建用
function createItem(itemData)
{
    var $item = $(($(".infoItem")[0]).cloneNode(true));
    fillItem($item,itemData);
    return $item;
}

//ajax填充一个应用的信息，$item是一个zepto对象，itemData提供填充数据
function fillItem($item, itemData)
{
    $item.data("acId", itemData.infoId);
    $item.find(".infoName").text(itemData.infoTitle);
    $item.find(".infoIcon").find("img").data("pic", itemData.resIcon);
    var date = new Date(parseInt(itemData.infoCreateddate));
    $item.find(".infoDate").text(getDateStr(date));
    $item.find(".tit").text("【摘要】");
    $item.find(".content").text(itemData.infoAbstract);
    $item.find(".figure").data("pic", itemData.infoImg);
}

//点击领号函数
function btnTapHandler($target)
{
    var $item = $target.parent().parent();
    isUxbao && window.uxbao.click(JSON.stringify
        (
            {
                "type":13,
                "acId":$item.data("acId")
            }
        )
    );

}

//点击进入详情
function itemTapHandler($target, type)
{
    //礼包
    if(type === 1)
    {
        isUxbao && window.uxbao.click(JSON.stringify
            (
                {
                    "type":12,
                    "title":"礼包详情",
                    "url":ajaxInfo.detailUrl +  "?acId=" + $target.data("acId")
                }
            )
        );
    }
    //活动
    else if(type === 2)
    {
        isUxbao && window.uxbao.click(JSON.stringify
            (
                {
                    "type":12,
                    "title":"活动详情",
                    "url":ajaxInfo.detailUrl +  "?acId=" + $target.data("acId")
                }
            )
        );
    }
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
                    "version":ajaxInfo.version,
                    "phonetypeName":ajaxInfo.phonetypeName,
                    "os_version":ajaxInfo.os_version,
                    "imei":ajaxInfo.imei,
                    "imsi":ajaxInfo.imsi,
                    "size":ajaxInfo.load_size,
                    "start_position":ajaxInfo.start_position
                },
                jsonp:'jsonRecommend',
                success:function(data, textStatus, xhr)
                {
                    if(data.state === 1 && data.news.length)
                    {
                        var $container = $("#info-list-box");
                        infoList = infoList.concat(data.news);
                        var len = data.news.length;

                        for (var i = 0; i < len; ++i)
                        {
                            var $item = createItem(data.news[i]);
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

//页面加载完毕执行函数
$(function()
{
    //最开始ajax加载5个活动
    $.ajax(
        {
            url:ajaxInfo.url,
            dataType:'jsonp',
            data:
            {
                "version":ajaxInfo.version,
                "phonetypeName":ajaxInfo.phonetypeName,
                "os_version":ajaxInfo.os_version,
                "imei":ajaxInfo.imei,
                "imsi":ajaxInfo.imsi,
                "size":ajaxInfo.init_size,
                "start_position":ajaxInfo.start_position
            },
            jsonp:'jsoncallback',
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
                            $item.find("img").imglazyload({"urlName": "data-pic"});
                            $.fn.imglazyload.detect();
                        }
                        else
                        {
                            $item.hide();
                        }
                    });


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