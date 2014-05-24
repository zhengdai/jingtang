/**
 * Created by zd on 2014/4/19 0019.
 */
//供android调用，更新页面的应用的状态，一种是安装包下载进度，还有就是下载完成，安装完成时
function updateState(packageName, state)
{
    if(packageName === ajaxInfoDetail.resPackagename)
    {
        isUxbao && window.activity.update(JSON.stringify(state));
    }
}

//进入游戏详情
function infoTapHandler($info)
{
    var resId = $info.data("resId");
    window.location.href = ajaxInfoDetail.detailUrl + "?resId=" + resId;
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

//活动详情应用ajax参数对象
var ajaxInfoDetail =
{
    "infoId":request.infoId,
    "url": $.apiRoot + "newsV3/getNewsById.do",
    "detailUrl": $.htmlRoot + "game_detail.html"
};

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
            jsonp: 'jsoncallback',
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