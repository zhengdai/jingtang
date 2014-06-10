/**
 * Created by zd on 2014/4/16 0016.
 */

var ajaxGift = {
    "total_size":0,//总共的礼包个数
    "start_position":1,//从第几个开始取
    "init_size":8,//第一次取的数目
    "load_size":3,//之后每次下拉加载的数目
    "url": $.apiRoot + "activityV3/getActivity.do",
    "detailUrl": $.htmlRoot + "gift_detail.html",
    "onRefresh":false,
    "now":new Date().getTime()
};

//加载进来的活动列表
var giftList = [];

function isReceive(acId)
{
    var len = myGiftData.length;
    for(var i = 0; i < len; ++i)
    {
        if(acId == myGiftData[i].acId)
        {
            return i;
        }
    }
    return -1;
}

function createItem(itemData)
{
    var $item = $(($(".giftItem")[0]).cloneNode(true));
    fillItem($item,itemData);
    return $item;
}

function updateGift(acId, acNum)
{
    $("#" + acId).find(".btn").text("已领取").addClass("gray").data("num", acNum);
}

//ajax填充一个活动的信息，$item是一个zepto对象，itemData提供填充数据
function fillItem($item, itemData)
{
    $item.data("acId", itemData.acId).attr("id", itemData.acId).data('acTitle', itemData.acName);
    $item.find(".percent").show();
    //活动
    if(itemData.acType == 2)
    {
        $item.find(".giftTit").text("【活动详情】");
        $item.find(".percent").hide();
        if(ajaxGift.now < itemData.acStartTime)
        {
            $item.find('.btn').text("查看").addClass('gray');
            $item.find('.giftState').text("未开始");
        }
        else if(ajaxGift.now > itemData.acEndTime)
        {
            $item.find('.btn').text("查看").addClass('gray');
            $item.find('.giftState').text("已过期");
        }
        else
        {
            $item.find('.btn').text("查看");
            $item.find('.giftState').text("正在进行");
        }
    }
    //礼包
    else if(itemData.acType == 1)
    {
        $item.find(".giftTit").text("【礼包内容】");
        var usePer = (itemData.acUseNum/itemData.acTotalNum * 100).toFixed(0);
        var leftPer = 100 - usePer;
        $item.find(".percentLeft").css("width", usePer + '%');
        $item.find(".percentRight").css("width", (100-usePer) + '%');
        $item.find('.giftState').text("剩余" + leftPer + "%").addClass('onState');
        if(ajaxGift.now < itemData.acStartTime)
        {
            $item.find('.btn').text("未开始").addClass('gray');
        }
        else if(ajaxGift.now > itemData.acEndTime)
        {
            $item.find('.btn').text("已过期").addClass('gray');
        }
        //正在进行
        else
        {
            //领过
            var index = isReceive(itemData.acId);
            if(index != -1)
            {
                var num = myGiftData[index].giftNo;
                $item.find('.btn').text("已领过").addClass('gray').data("num", num);
            }
            //没领过但光了
            else if(usePer == 100)
            {
                $item.find('.btn').text("抢光了").addClass('gray');
            }
            //没领过且还有剩余
            else
            {
                //添加点击响应函数
                $item.find('.btn').text("领号").on("tap",function()
                {
                    btnTapHandler($(this));
                    return false;
                }).removeClass('gray');
            }
        }
    }

    $item.find(".giftIcon").find('img').attr("data-pic", itemData.acIcon).attr('src', default_icon);
    $item.find(".giftName").text(itemData.acName);


    $item.find(".content").text(itemData.acContent);

    $item.on("tap", function()
    {
        itemTapHandler($item, itemData.acType);
        return false;
    });
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
        var num = $target.find(".btn").data("num");
        if(num)
        {
            isUxbao && window.uxbao.click(JSON.stringify
                (
                    {
                        "type":12,
                        "title":$target.data("acTitle"),
                        "url":ajaxGift.detailUrl +  "?acId=" + $target.data("acId") + "&num=" + num
                    }
                )
            );
        }
        else
        {
            isUxbao && window.uxbao.click(JSON.stringify
                (
                    {
                        "type":12,
                        "title":$target.data("acTitle"),
                        "url":ajaxGift.detailUrl +  "?acId=" + $target.data("acId")
                    }
                )
            );
        }
    }
    //活动
    else if(type === 2)
    {
        isUxbao && window.uxbao.click(JSON.stringify
            (
                {
                    "type":12,
                    "title":$target.data("acTitle"),
                    "url":ajaxGift.detailUrl +  "?acId=" + $target.data("acId")
                }
            )
        );
    }
}

//加载更多
function loadMore()
{
    if(!ajaxGift.onRefresh && ajaxGift.start_position <= ajaxGift.total_size)
    {
        ajaxGift.onRefresh = true;
        $.ajax(
            {
                url:ajaxGift.url,
                dataType:'jsonp',
                data:
                {
                    "version":userInfo.version,
                    "phonetypeName":userInfo.phonetypeName,
                    "os_version":userInfo.os_version,
                    "imei":userInfo.imei,
                    "imsi":userInfo.imsi,
                    "size":ajaxGift.load_size,
                    "start_position":ajaxGift.start_position
                },
                jsonp:'jsonRecommend',
                success:function(data, textStatus, xhr)
                {
                    if(data.state === 1 && data.activity)
                    {
                        var $container = $("#gift-list-box");
                        giftList = giftList.concat(data.activity);
                        var len = data.activity.length;

                        for (var i = 0; i < len; ++i)
                        {
                            var $item = createItem(data.activity[i]);
                            $container.append($item);
                            $item.find("img").imglazyload({"urlName":"data-pic"});
                        }

                        $(".giftItem").removeClass("lastItem").eq(-1).addClass("lastItem");

                        ajaxGift.start_position += len;

                        if(ajaxGift.start_position > ajaxGift.total_size)
                        {
                            $(".more").hide();
                        }
                        ajaxGift.onRefresh = false;
                    }
                },
                error:function(XMLHttpRequest, textStatus, errorThrown)
                {
                    ajaxGift.onRefresh = false;
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
    default_icon = $(".giftItem").eq(0).find("img").attr('src');
    //最开始ajax加载5个活动
    $.ajax(
        {
            url:ajaxGift.url,
            dataType:'jsonp',
            data:
            {
                "version":userInfo.version,
                "phonetypeName":userInfo.phonetypeName,
                "os_version":userInfo.os_version,
                "imei":userInfo.imei,
                "imsi":userInfo.imsi,
                "size":ajaxGift.init_size,
                "start_position":ajaxGift.start_position
            },
            jsonp:'jsoncallback',
            success:function(data)
            {
                if(data.state === 1)//获取成功
                {
                    ajaxGift.total_size = data.activities.total_size;
                    giftList = giftList.concat(data.activity);
                    ajaxGift.start_position += data.activity.length;
                    $(".giftItem").each(function(i,item)
                    {
                        var $item = $(this);
                        if(data.activity[i])
                        {
                            fillItem($item, data.activity[i]);
                            $item.find("img").imglazyload({"urlName": "data-pic", "threshold":400});
                        }
                        else
                        {
                            $item.remove();
                        }

                    });
                    $(".giftItem").eq(-1).addClass("lastItem");

                    $.fn.imglazyload.detect();
                    //下拉加载
                    if(ajaxGift.start_position <= ajaxGift.total_size)
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