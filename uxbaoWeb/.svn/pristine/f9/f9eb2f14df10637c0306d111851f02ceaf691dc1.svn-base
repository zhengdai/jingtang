/**
 * Created by zd on 2014/4/19 0019.
 */
var request = GetRequest();


function getZiDateStr(date)
{
    return date.getFullYear() + "年" + (date.getMonth() + 1) + "月" + date.getDate() + "日"
}

//供android调用，更新页面的应用的状态，一种是安装包下载进度，还有就是下载完成，安装完成时
//function updateState(packageName, state)
//{
//    if(packageName === ajaxGiftDetail.resPackagename)
//    {
//        isUxbao && window.activity.update(JSON.stringify(state));
//    }
//}

//活动详情应用ajax参数对象
var ajaxGiftDetail =
{
    "acId":request.acId,
    "url": $.apiRoot + "activityV3/getActivityById.do",
    "now":new Date().getTime(),
    "detailUrl": $.htmlRoot + "game_detail.html"
};

//点击领号函数
function receiveTapHandler($target)
{
    isUxbao && window.uxbao.click(JSON.stringify
        (
            {
                "type":13,
                "acId":request.acId
            }
        )
    );
}

$(function()
{
    $.ajax(
        {
            url:ajaxGiftDetail.url,
            dataType:"jsonp",
            data:
            {
                "version": userInfo.version,
                "phonetypeName": userInfo.phonetypeName,
                "os_version": userInfo.os_version,
                "imei": userInfo.imei,
                "imsi": userInfo.imsi,
                "acid": ajaxGiftDetail.acId
            },
            jsonp: 'jsoncallback',
            success: function (data)
            {
                if(data.state == 1)
                {
                    $('.giftIcon').find("img").data("pic", data.activity.acIcon).imglazyload({"urlName":"data-pic"});
                    ajaxGiftDetail.resPackagename = data.app.resPackagename;
                    $.fn.imglazyload.detect();

                    $('.content').empty();
                    $(data.activity.acContent.split(" ")).each(function(i,item)
                    {
                        $('.content').append("<p>" + item + "</p>");
                    });
                    $(".date").text(getZiDateStr(new Date(data.activity.acStartTime)) + "——" + getZiDateStr(new Date(data.activity.acEndTime)));
                    $('.steps').empty();
                    $(data.activity.acUseDesc.split(" ")).each(function(i, item)
                    {
                        $('.steps').append("<p>" + item + "</p>");
                    });
                    //礼包
                    if(data.activity.acType == 1)
                    {
                        $(".giftContent").find(".title").text("礼包内容");
                        $(".giftDate").find(".title").text("兑换日期");
                        $(".giftUse").find(".title").text("使用方法");
                        $(".giftName").text(data.app.resName);
                        $(".giftDes").text(data.activity.acName);
                        var usePer = (data.activity.acUseNum/data.activity.acTotalNum * 100).toFixed(0);
                        var leftPer = 100 - usePer;
                        $(".percentLeft").css("width", usePer + '%');
                        $('.state').text("礼包剩余：" + leftPer + "%");
                        if(ajaxGiftDetail.now < data.activity.acStartTime)
                        {
                            $('.btn').text("未开始").addClass('gray');
                            $(".giftState").show();
                        }
                        else if(ajaxGiftDetail.now > data.activity.acEndTime)
                        {
                            $('.btn').text("已过期").addClass('gray');
                            $(".giftState").show();
                        }
                        //正在进行
                        else
                        {
                            //领过
                            if(request.num)
                            {
                                $('.btn').text("已领过").addClass('gray');
                                $(".num").find('span').text(request.num);
                                $(".giftNum").show();
                                $(".copy").on("tap",function()
                                {
                                    isUxbao && window.activity.copy($(".num").find('span').text());
                                    return false;
                                });

                            }
                            //没领过但光了
                            else if(usePer == 100)
                            {
                                $('.btn').text("抢光了").addClass('gray');
                                $(".giftState").show();
                            }
                            //没领过且还有剩余
                            else
                            {
                                $(".giftState").show();
                                //添加点击响应函数
                                $('.btn').text("领号").on("tap",function()
                                {
                                    receiveTapHandler($(this));
                                    return false;
                                });
                            }
                        }
                    }
                    //活动
                    else if(data.activity.acType == 2)
                    {
                        $(".giftContent").find(".title").text("活动内容");
                        $(".giftDate").find(".title").text("活动日期");
                        $(".giftUse").find(".title").text("参与方法");
                        $(".giftName").text(data.activity.acName);
                        $(".giftState").hide();
                        $(".btn").text("查看").data('id', data.app.resId)
                            .data('name', data.app.resName).data('package', data.app.resPackagename)
                            .on('tap', function()
                        {
                            infoTapHandler($(this));
                            return false;
                        });
                        if(ajaxGiftDetail.now < data.activity.acStartTime)
                        {
                            $('.giftDes').text("未开始");
                        }
                        else if(ajaxGiftDetail.now > data.activity.acEndTime)
                        {
                            $('.giftDes').text("已过期");
                        }
                        else
                        {
                            $('.giftDes').text("正在进行");
                        }
                    }
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