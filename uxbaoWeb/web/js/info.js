/**
 * Created by zd on 2014/4/19 0019.
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
    "url":"http://115.29.177.196:8080/mystore/ newsV3/getNewsById.do",
    "version":"2.3",
    "phonetypeName":"N7105",
    "os_version":"4.0",
    "imei":"00000000",
    "imsi":"00000000"
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
            $(imgItem).attr("src", "images/jingpin/star_01.png");
        }
        else
        {
            $(imgItem).attr("src", "images/jingpin/star_03.png");
        }
    });
}

$(function()
{
    $.ajax(
        {
            url:ajaxInfoDetail.url,
            dataType:"jsonp",
            data:
            {
                "version": ajaxInfoDetail.version,
                "phonetypeName": ajaxInfoDetail.phonetypeName,
                "os_version": ajaxInfoDetail.os_version,
                "imei": ajaxInfoDetail.imei,
                "imsi": ajaxInfoDetail.imsi,
                "newsId": ajaxInfoDetail.infoId
            },
            jsonp: 'jsoncallback',
            success: function (data)
            {
                if(data.state == 1)
                {
                    $('.infoIcon').find("img").data("pic", data.information.resIcon).imglazyload({"urlName":"data-pic"});
                    $('.gameName').text(data.app.resName);
                    $('.cor').text(data.app.resDeveloper);

                    fillScore(data.app.resRated, $(".items-score"));

                    $('.tit').text(data.information.infoTitle);
                    $('.author').text(getDateStr(new Date(data.information.infoCreateddate)) + " 来自" + data.information.infoSource);
                    $('.content').html(data.information.infoContent);

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