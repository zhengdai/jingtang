/**
 * Created by zd on 2014/3/29 0029.
 */

var request = GetRequest();

//游戏详情应用ajax参数对象
var ajaxGameDetail =
{
    "resId":request.resId,
    "detailUrl": $.apiRoot + "appV3/getProductAndTopComment.do",
    "relatedUrl": $.apiRoot + "appV3/getRelatedApp.do",
    "commentListUrl": $.htmlRoot + "comment_list.html",
    "commentUrl": $.htmlRoot + "comment.html",
    "gameDetailUrl": $.htmlRoot + "game_detail.html",
    "giftUrl":$.htmlRoot + "gift_detail.html",
    "infoUrl":$.htmlRoot + "info_detail.html",
    "isFree":Boolean(request.isFree)
};

function createGiftItem($node, activity)
{
    var $item = $node.clone();
    $item.find('.content').text(activity.acName);
    $item.find('.date').text(getDateStr(new Date(activity.acStartTime)));
    $item.on('tap', function()
    {
        //礼包
        if(activity.acType === 1)
        {
            var i = indexOfGift(activity.acId);
            if(i != -1)
            {
                isUxbao && window.uxbao.click(JSON.stringify
                    (
                        {
                            "type":12,
                            "title":activity.acName,
                            "url":ajaxGameDetail.giftUrl +  "?acId=" + activity.acId + "&num=" + myGiftData[index].giftNo
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
                            "title":activity.acName,
                            "url":ajaxGameDetail.giftUrl +  "?acId=" + activity.acId
                        }
                    )
                );
            }
        }
        //活动
        else if(activity.acType === 2)
        {
            isUxbao && window.uxbao.click(JSON.stringify
                (
                    {
                        "type":12,
                        "title":activity.acName,
                        "url":ajaxGameDetail.giftUrl +  "?acId=" + activity.acId
                    }
                )
            );
        }
    });
    return $item;
}

//填充活动
function fillActivity($activityList, data)
{
    if(data.activity)
    {
        var activityList = data.activity;
        var $giftTpl = $item.find("li").eq(0).clone();
        $activityList.empty();
        $(activityList).each(function(i, activity)
        {
            var $item = createGiftItem($giftTpl, activity);
            $activityList.append($item);
        });
    }
    else
    {
        $('#gameGift').remove();
    }
}

function createInfoItem($node, news)
{
    var $item = $node.clone();
    $item.text(news.infoTitle);
    $item.on('tap', function ()
    {
        isUxbao && window.uxbao.click(JSON.stringify
            (
                {
                    "type":14,
                    "title":news.infoTitle,
                    "url":ajaxGameDetail.infoUrl +  "?infoId=" + news.infoId
                }
            )
        );
    });
    return $item;
}

//填充资讯
function fillInfo($newsList, data)
{
    if(data.news)
    {
        var newsList = data.news;
        var $newsTpl = $newsList.find("li").eq(0).clone();//$($news.find('li')[0].cloneNode(true));
        $newsList.empty();
        $(newsList).each(function(i, newsData)
        {
            var $item = createInfoItem($newsTpl, newsData);
            $newsList.append($item);
        });
    }
    else
    {
        $("#gameInfo").remove();
    }
}

//填充打分
function fillDetailRate(rated1, rated2, rated3, rated4, rated5, rated, total)
{
    $('.commentNum').text('（' + total + '人）');

    if(total == 0)
    {
        $('.moreComment').find('p').removeClass('able').text("暂无更多评论");
        total = 1;
    }
    else
    {
        $('.moreComment').on('tap', function()
        {
            isUxbao && window.uxbao.moreComment(
                JSON.stringify(
                    {
                        "allUrl":ajaxGameDetail.commentListUrl + "?resId=" + ajaxGameDetail.resId,
                        "goodUrl":ajaxGameDetail.commentListUrl + "?resId=" + ajaxGameDetail.resId + "&type=Good",
                        "badUrl":ajaxGameDetail.commentListUrl + "?resId=" + ajaxGameDetail.resId + "&type=Bad",
                        "commentUrl":ajaxGameDetail.commentUrl + "?resId=" + ajaxGameDetail.resId,
                        "resIcons":ajaxGameDetail.resIcons,
                        "resPackagename":ajaxGameDetail.resPackagename
                    }
                )
            );
        }).find('span').text(total.toString());
    }
    var rated1Per = (rated1 * 100 / total).toFixed(0);
    $('#onePer').text(rated1Per + '%');
    var $rated1Star = $('#oneStar');
    $rated1Star.find('.percentLeft').width(rated1Per + '%');

    var rated2Per = (rated2 * 100 / total).toFixed(0);
    $('#twoPer').text(rated2Per + '%');
    var $rated2Star = $('#twoStar');
    $rated2Star.find('.percentLeft').width(rated2Per + '%');

    var rated3Per = (rated3 * 100 / total).toFixed(0);
    $('#threePer').text(rated3Per + '%');
    var $rated3Star = $('#threeStar');
    $rated3Star.find('.percentLeft').width(rated3Per + '%');

    var rated4Per = (rated4 * 100 / total).toFixed(0);
    $('#fourPer').text(rated4Per + '%');
    var $rated4Star = $('#fourStar');
    $rated4Star.find('.percentLeft').width(rated4Per + '%');

    var rated5Per = (rated5 * 100 / total).toFixed(0);
    $('#fivePer').text(rated5Per + '%');
    var $rated5Star = $('#fiveStar');
    $rated5Star.find('.percentLeft').width(rated5Per + '%');

    var $averageRate = $('#rate');
    $averageRate.find('img').each(function(j, imgItem)
    {
        if(j - rated < -0.5)
        {
            $(imgItem).attr("src", big_yellow_star);
        }
        else
        {
            $(imgItem).attr("src", big_gray_star);
        }
    });
    $averageRate.find('span').text(rated.toFixed(1) + '分');
}

//填充评论
function fillComment(commentData)
{
    $('.commentItem').each(function(i, commentItem)
    {
        var $me = $(commentItem);
        if(commentData[i])
        {
            if(commentData[i].customerName)
            {
                $me.find('.userName').text(commentData[i].customerName);
            }
            else
            {
                $me.find('.userName').text('游戏宝用户')
            }
            if(commentData[i].customerImg)
            {
                $me.find('.userIcon').find('img').data('icon', commentData[i].customerImg)
                    .imglazyload({"urlName":"data-icon"});
            }
            var date = new Date(commentData[i].custremarkCreatedate);
            $me.find('.commentDate').text(getDateStr(date));
            $me.find('.commentContent').text(commentData[i].custremarkContent);
            $me.find('.grade').find('img').each(function(j, imgItem)
            {
                if(j - commentData[i].custremarkCustrated < -0.5)
                {
                    $(imgItem).attr("src", little_yellow_star);
                }
                else
                {
                    $(imgItem).attr("src", light_gray_star);
                }
            });

        }
        else
        {
            $me.remove();
        }
    });
}

var little_yellow_star, light_gray_star, big_yellow_star, big_gray_star;

$(function()
{
    var $default_big_star = $("#rate").find('img');
    big_yellow_star = $default_big_star.eq(0).attr('src');
    big_gray_star = $default_big_star.eq(1).attr('src');
    var $default_star = $(".grade").eq(0).find('img');
    little_yellow_star = $default_star.eq(0).attr('src');
    light_gray_star = $default_star.eq(1).attr('src');
    //获取游戏信息
    $.ajax(
        {
            url: ajaxGameDetail.detailUrl,
            dataType: 'jsonp',
            data:
            {
                "version": userInfo.version,
                "phonetypeName": userInfo.phonetypeName,
                "os_version": userInfo.os_version,
                "imei": userInfo.imei,
                "imsi": userInfo.imsi,
                "resId": ajaxGameDetail.resId,
                "servicePrivider":ajaxGameDetail.isFree && userInfo.serviceProvider
            },
            jsonp: 'jsonGame',
            success: function (data)
            {
                if(data.state == 1)//获取成功
                {
                    ajaxGameDetail.resIcons = data.product.resIcons;
                    ajaxGameDetail.resPackagename = data.product.resPackagename;
                    //图标
                    $('.icon').find('img').attr('src', data.product.resIcons);
                    $('.tit').text(data.product.resName);
                    var ca = (data.product.resCapacity/(1024 * 1024)).toFixed(1);
                    $('.company').text(ca + 'MB | ' + data.product.resDeveloper);

                    //礼包
                    var $gift = $('#activityList');
                    fillActivity($gift, data);

                    //资讯
                    var $news = $('#infoList');
                    fillInfo($news, data);

                    //截图
                    var screenShots = data.product.resScreenshots.split(',');

                    var screenContent = [];
                    for(var i = 0; i < screenShots.length; ++i)
                    {
                        screenContent.push(
                            {
                                title:"",
                                href:"javascript:void(0);",
                                pic:screenShots[i]
                            }
                        );
                    }

                    var img = new Image();
                    img.src = screenShots[0];

                    img.onload = function()
                    {
                        var viewnum;
                        if(img.width > img.height)
                        {
                            viewnum = 1;
                            $(screenContent).each(function(i, item)
                            {
                                item.default_icon = $.localRoot + "images/local/default_bg_800480.png";
                            });
                        }
                        else
                        {
                            viewnum = 2;
                            $(screenContent).each(function(i, item)
                            {
                                item.default_icon = $.localRoot + "images/local/default_bg_480800.png";
                            });
                        }
                        var slider = new $.ui.Slider("#slider",
                            {
                                autoPlay:false,
                                viewNum:viewnum,
                                travelSize:viewnum,
                                content:screenContent,
                                imageZoom:true
                            }
                        );


                        //截图点击
                        $('.ui-slider-item').each(function(i, item)
                        {
                            $(item).on("tap", function()
                            {
                                isUxbao && window.activity.showPic(JSON.stringify(i));
                            });
                        });
                    };


                    //介绍
                    var introList = data.product.resDescription.split("\n");
                    $.each(introList, function(index, item)
                    {
                        $('.intro').append('<p>' + item + '</p>');
                    });

                    $('.intro').readmore({
                        speed:75,
                        maxHeight:72,
                        embedCSS:false
                    });

                    //评论
                    fillDetailRate(data.product.rated1, data.product.rated2, data.product.rated3, data.product.rated4, data.product.rated5, data.product.resRated, data.product.resCustratednum);
                    fillComment(data.comments);
                    data.commentUrl = ajaxGameDetail.commentUrl + "?resId=" + ajaxGameDetail.resId;

                    //给android传送详情消息
                    isUxbao && window.activity.getAppInfo(JSON.stringify(data));
                }
            },
            error:function(XMLHttpRequest, textStatus, errorThrown)
            {
                console.log("failed game detail ajax!");
            }
        }
    );

    //猜你喜欢
    $.ajax(
        {
            url:ajaxGameDetail.relatedUrl,
            dataType: 'jsonp',
            data:
            {
                "version": userInfo.version,
                "phonetypeName": userInfo.phonetypeName,
                "os_version": userInfo.os_version,
                "imei": userInfo.imei,
                "imsi": userInfo.imsi,
                "resId": ajaxGameDetail.resId
            },
            jsonp: 'jsoncallback',
            success: function (data)
            {
                if(data)
                {
                    if(data.state === 1)
                    {
                        var len = data.products.length;

                        var $icon = $('.appIcon');
                        var $gameName = $('.gameName');
                        var $appArr =  $("#mayLikeList").find("li");
                        for(var j = 0; j < len; ++j)
                        {
                            $appArr.eq(j).data("id", data.products[j].resId)
                                .data("name", data.products[j].resName).
                                data("package", data.products[j].resPackagename);
                            $icon.eq(j).data("icon", data.products[j].resIcons);
                            $gameName.eq(j).text(data.products[j].resName);
                            $appArr.eq(j).on("tap", function()
                            {
                                infoTapHandler($(this));
                                return false;
                            });
                        }
                        $icon.imglazyload({"urlName":"data-icon"});
                        $.fn.imglazyload.detect();
                    }
                    else
                    {
                        console.log("no ajax data");
                    }
                }
            },
            error:function(XMLHttpRequest, textStatus, errorThrown)
            {
                console.log("failed game detail ajax!");
            }
        }
    );
});