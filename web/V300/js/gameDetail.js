/**
 * Created by zd on 2014/3/29 0029.
 */
//供android调用，更新页面的应用的状态，一种是安装包下载进度，还有就是下载完成，安装完成时
function updateState(packageName, state)
{
    if(packageName === ajaxGameDetail.resPackagename)
    {
        isUxbao && window.activity.update(JSON.stringify(state));
    }
}

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

//游戏详情应用ajax参数对象
var ajaxGameDetail =
{
    "resId":request.resId,
    "detailUrl": $.apiRoot + "appV3/getProductAndTopComment.do",
    "relatedUrl": $.apiRoot + "appV3/getRelatedApp.do",
    "commentListUrl": $.htmlRoot + "comment_list.html",
    "commentUrl": $.htmlRoot + "comment.html",
    "gameDetailUrl": $.htmlRoot + "game_detail.html"
};



//填充打分
function fillRate(rated1, rated2, rated3, rated4, rated5, rated, total)
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

//进入游戏详情
function infoTapHandler($info)
{
    var resId = $info.data("id");
    isUxbao && window.uxbao.click(
        JSON.stringify(
            {
                "type":2,
                "resId":resId,
                "url":ajaxGameDetail.gameDetailUrl + "?resId=" + resId,
                "resName":$info.data("name"),
                "resPackagename":$info.data("package")
            }
        )
    );
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
                "resId": ajaxGameDetail.resId
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
                    fillRate(data.product.rated1, data.product.rated2, data.product.rated3,
                        data.product.rated4, data.product.rated5, data.product.resRated, data.product.resCustratednum);
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