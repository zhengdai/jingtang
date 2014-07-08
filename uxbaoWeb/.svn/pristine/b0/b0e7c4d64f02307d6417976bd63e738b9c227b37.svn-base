/**
 * Created by zd on 2014/4/19 0019.
 */

var request = GetRequest();

//活动详情应用ajax参数对象
var ajaxInfoDetail =
{
    "infoId":request.infoId,
    "url": $.apiRoot + "newsV3/getNewsById.do",
    "detailUrl": $.htmlRoot + "game_detail.html"
};


function fillScore(score, $scoreList)
{
    $scoreList.find("img").each(function(j, imgItem)
    {
        if(j - score < -0.5)
        {
            $(imgItem).attr("src", star_01);
        }
        else
        {
            $(imgItem).attr("src", star_03);
        }
    });
}

var star_01, star_03;

$(function()
{
    var $default_stars = $('.items-score').eq(0).find('img');
    star_01 = $default_stars.eq(0).attr('src');
    star_03 = $default_stars.eq(1).attr('src');
    $.ajax(
        {
            url:ajaxInfoDetail.url,
            dataType:"jsonp",
            data:
            {
                "version": userInfo.version,
                "phonetypeName": userInfo.phonetypeName,
                "os_version": userInfo.os_version,
                "imei": userInfo.imei,
                "imsi": userInfo.imsi,
                "newsId": ajaxInfoDetail.infoId
            },
            jsonp: 'jsonInfo',
            success: function (data)
            {
                if(data.state == 1)
                {
                    $('.infoIcon').find("img").data("pic", data.information.resIcon).imglazyload({"urlName":"data-pic"});
                    ajaxInfoDetail.resPackagename = data.app.resPackagename;
                    $.fn.imglazyload.detect();

                    $('.gameName').text(data.app.resName);
                    $('.cor').text(data.app.resDeveloper);

                    fillScore(data.app.resRated, $(".items-score"));

                    $('.tit').text(data.information.infoTitle);
                    $('.author').text(getDateStr(new Date(data.information.infoCreateddate)) + " 来自" + data.information.infoSource);
                    $('.content').html(data.information.infoContent);

                    $('.btn').data('resId', data.app.resId)
                        .data('resName', data.app.resName)
                        .data('resPackagename', data.app.resPackagename).on('tap', function()
                    {
                        infoTapHandler($(this));
                        return false;
                    });

                    $.fn.imglazyload.detect();
                    isUxbao && window.activity.getAppInfo(JSON.stringify({"product":data.app}));
                }
            },
            error:function(XMLHttpRequest, textStatus, errorThrown)
            {
                console.log("failed activity detail ajax!");
            }
        }
    );
});