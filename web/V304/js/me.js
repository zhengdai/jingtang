/**
 * Created by zd on 14-3-21.
 */

var giftDetailUrl = $.htmlRoot + "my_gift.html";

//供android调用
function updateInfo()
{
    userInfo = JSON.parse(window.uxbao.userInfo()).userInfo;
    $(".logBtn").text(userInfo.nickName);
    $(".portrait").find('img').attr('src', userInfo.icon);

    $(".logBtn, .portrait, #personConfig").off('tap').on('tap', function()
    {
        isUxbao && window.uxbao.click(
            JSON.stringify(
                {
                    "type":9
                }
            )
        );
        return false;
    });
}

$(function()
{
    var $freeDown = $('#freeDown');
    if((userInfo.serviceProvider && userInfo.serviceProvider == '0101') || userInfo.userState)
    {
        $freeDown.show();
    }
    else
    {
        $freeDown.hide();
    }
    if(userInfo.saveDataFlow)
    {
        $(".save-num").text(userInfo.saveDataFlow.toFixed(2) + "MB");
    }
    if(userInfo.nickName)
    {
        $(".logBtn").text(userInfo.nickName);
        $(".portrait").find('img').attr('src', userInfo.icon);
        $(".logBtn, .portrait, #personConfig").on('tap', function()
        {
            isUxbao && window.uxbao.click(
                JSON.stringify(
                    {
                        "type":9
                    }
                )
            );
            return false;
        });
    }
    else
    {
        $(".logBtn, .portrait, #personConfig").on('tap', function()
        {
            isUxbao && window.uxbao.click(
                JSON.stringify(
                    {
                        "type":11
                    }
                )
            );
            return false;
        });
    }

    $(".itemWrap").button();

    $("#gameCenter").on('tap', function()
    {
        isUxbao && window.uxbao.click(
            JSON.stringify(
                {
                    "type":7
                }
            )
        );
        return false;
    });

    $("#systemConfig").on('tap', function()
    {
        isUxbao && window.uxbao.click(
            JSON.stringify(
                {
                    "type":8
                }
            )
        );
        return false;
    });

    $("#aboutUs").on('tap', function()
    {
        isUxbao && window.uxbao.click(
            JSON.stringify(
                {
                    "type":10
                }
            )
        );
        return false;
    });

    $("#myGift").on('tap', function()
    {
        isUxbao && window.uxbao.click(
            JSON.stringify(
                {
                    "type":15,
                    "title":"我的礼包",
                    "url":giftDetailUrl
                }
            )
        );
        return false;
    });

});