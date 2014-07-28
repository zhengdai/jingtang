/**
 * Created by zd on 2014/5/7 0007.
 */
var myGift = {
    detailUrl: $.htmlRoot + 'gift_detail.html',
    now:new Date().getTime(),
    default_icon:""
};

//点击进入礼包详情
function itemTapHandler($target)
{
    var num = $target.find(".btn").data("num");
    if(num)
    {
        isUxbao && window.uxbao.click(JSON.stringify
            (
                {
                    "type":12,
                    "title":"礼包详情",
                    "url":myGift.detailUrl +  "?acId=" + $target.data("acId") + "&num=" + num
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
                    "title":"礼包详情",
                    "url":myGift.detailUrl +  "?acId=" + $target.data("acId")
                }
            )
        );
    }
}

//从现有node根据给的data创建新node
function createItem($node, itemData)
{
    var $item = $node.clone();
    fillItem($item, itemData);
    return $item;
}

function fillItem($item, itemData)
{
    $item.data("acId", itemData.acId).attr("id", itemData.acId);
    $item.find(".percent").show();
    if(isUxbao)
    {
        var localInfo = JSON.parse(itemData.localInfo);
    }
    else
    {
        var localInfo = itemData.localInfo;
    }
    $item.find(".giftTit").text("【礼包内容】");
    //已过期
    if(myGift.now > localInfo.localInfo.activity.acEndTime)
    {
        $item.find('.btn').text("已过期").addClass('gray');
    }
    //正在进行
    else
    {
        $item.find('.btn').text("已领过").addClass('gray').data('num', itemData.giftNo);
    }

    $item.find(".giftIcon").find('img').attr("data-pic", localInfo.localInfo.activity.acIcon).attr('src', myGift.default_icon);
    $item.find(".giftName").text(localInfo.localInfo.activity.acName);

    $item.find(".content").text(localInfo.localInfo.activity.acContent);

    $item.find(".num").find('span').text(itemData.giftNo);

    $item.find('.copy').on('tap', function()
    {
        isUxbao && window.activity.copy($item.find(".num").find('span').text());
        return false;
    });

    $item.on("tap", function()
    {
        itemTapHandler($item);
        return false;
    });
}

$(function()
{
    var $defaultItem = $(".giftItem");
    myGift.default_icon = $defaultItem.eq(0).find("img").attr('src');
    var $container = $("#gift-list-box");
    var len = myGiftData.length;
    for(var i = 0; i < len; ++i)
    {
        var $item;
        if($defaultItem[i])
        {
            $item = $defaultItem.eq(i);
            fillItem($item, myGiftData[i]);
        }
        else
        {
            $item = createItem($(".giftItem").eq(0), myGiftData[i]);
            $container.append($item);
        }
        $item.find("img").imglazyload({"urlName":"data-pic"});
    }
    for(var j = len; j < $defaultItem.length; ++j)
    {
        $defaultItem.eq(j).remove();
    }
    $(".giftItem").eq(-1).addClass("lastItem");
    $.fn.imglazyload.detect();
});
