/**
 * Created by zd on 2014/3/29 0029.
 */

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

//分类详情应用ajax参数对象
var ajaxGameDetail =
{
    "resId":request.resId,
    "detailUrl":"http://115.29.177.196:8080/mystore/appV3/getProductAndTopComment.do",
    "relatedUrl":"http://115.29.177.196:8080/mystore/appV3/getRelatedApp.do",
    "version":"2.3",
    "phonetypeName":"N7105",
    "os_version":"4.0",
    "imei":"00000000",
    "imsi":"00000000"
};

//填充打分
function fillRate(rated1, rated2, rated3, rated4, rated5, rated)
{
    var total = rated1 + rated2 + rated3 + rated4 + rated5;
    $('.commentNum').text('（' + total + '人）');
    $('.moreComment').text(total.toString());

    var rated1Per = (rated1 * 100 / total).toFixed(0);
    $('#onePer').text(rated1Per + '%');
    var $rated1Star = $('#oneStar');
    $rated1Star.find('.percentLeft').width(rated1Per + '%');
    $rated1Star.find('.percentRight').width((100 - rated1Per) + '%');

    var rated2Per = (rated2 * 100 / total).toFixed(0);
    $('#twoPer').text(rated1Per + '%');
    var $rated2Star = $('#twoStar');
    $rated2Star.find('.percentLeft').width(rated1Per + '%');
    $rated2Star.find('.percentRight').width((100 - rated1Per) + '%');

    var rated3Per = (rated3 * 100 / total).toFixed(0);
    $('#threePer').text(rated1Per + '%');
    var $rated3Star = $('#threeStar');
    $rated3Star.find('.percentLeft').width(rated1Per + '%');
    $rated3Star.find('.percentRight').width((100 - rated1Per) + '%');

    var rated4Per = (rated4 * 100 / total).toFixed(0);
    $('#fourPer').text(rated1Per + '%');
    var $rated4Star = $('#fourStar');
    $rated4Star.find('.percentLeft').width(rated1Per + '%');
    $rated4Star.find('.percentRight').width((100 - rated1Per) + '%');

    var rated5Per = (rated5 * 100 / total).toFixed(0);
    $('#fivePer').text(rated1Per + '%');
    var $rated5Star = $('#fiveStar');
    $rated5Star.find('.percentLeft').width(rated1Per + '%');
    $rated5Star.find('.percentRight').width((100 - rated1Per) + '%');

    var $averageRate = $('#rate');
    $averageRate.find('img').each(function(j, imgItem)
    {
        if(j - rated < -0.5)
        {
            $(imgItem).attr("src", "images/xiangqing/big_yellow_star.png");
        }
        else
        {
            $(imgItem).attr("src", "images/xiangqing/big_gray_star.png");
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
            $me.find('.commentDate').text(commentData[i].custremarkCreatedate);
            $me.find('.commentContent').text(commentData[i].custremarkContent);
        }
        else
        {
            $me.hide();
        }
    });
}

$(function()
{
    $.ajax(
        {
            url: ajaxGameDetail.url,
            dataType: 'jsonp',
            data:
            {
                "version": ajaxCategoryDetail.version,
                "phonetypeName": ajaxCategoryDetail.phonetypeName,
                "os_version": ajaxCategoryDetail.os_version,
                "imei": ajaxCategoryDetail.imei,
                "imsi": ajaxCategoryDetail.imsi,
                "resId": ajaxCategoryDetail.resId
            },
            jsonp: 'jsoncallback',
            success: function (data)
            {
                if(data.product.state == 1)//获取成功
                {
                    //图标
                    $('.icon').attr('src', data.product.resIcons);
                    $('.tit').text(data.product.resName);
                    var ca = (data.product.resCapacity/(1024 * 1024)).toFixed(1);
                    $('.company').text(ca + 'MB | ' + data.product.resDeveloper);

                    //截图
                    var screenShots = data.product.resScreenshots.split(',');
                    var slider = new $.ui.Slider("#slider",
                    {
                        autoPlay:false,
                        viewNum:2,
                        travelSize:2,
                        content:[
                            {
                                title:"",
                                href:"#",
                                pic: screenShots[0]
                            },
                            {
                                title:"",
                                href:"#",
                                pic: screenShots[1]
                            },
                            {
                                title:"",
                                href:"#",
                                pic: screenShots[2]
                            },
                            {
                                title:"",
                                href:"#",
                                pic: screenShots[3]
                            }
                        ],
                        imageZoom:true
                    });

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
                        data.product.rated4, data.product.rated5, data.product.resRated);
                    fillComment(data.product.comments);

                }
            },
            error:function(XMLHttpRequest, textStatus, errorThrown)
            {
                console.log("failed game detail ajax!");
            }
        });

        $.ajax(
            {
                url:ajaxGameDetail.relatedUrl,
                dataType: 'jsonp',
                data:
                {
                    "version": ajaxCategoryDetail.version,
                    "phonetypeName": ajaxCategoryDetail.phonetypeName,
                    "os_version": ajaxCategoryDetail.os_version,
                    "imei": ajaxCategoryDetail.imei,
                    "imsi": ajaxCategoryDetail.imsi,
                    "resId": ajaxCategoryDetail.resId
                },
                jsonp: 'jsoncallback',
                success: function (data)
                {
                    if(data)
                    {
                        if(data.state === 1)
                        {
                            var len = data.products.length;
                            var $icon = $item.find('.appIcon');
                            for(var j = 0; j < len; ++j)
                            {
                                $icon.eq(j).attr("data-icon", data.product[j].resIcons);
                            }
                            $icon.imglazyload({"urlName":"data-icon"});
                            $.fn.imglazyload.detect();
                        }
                        else
                        {
                            console.log("there is no category data in " + $item.attr("data-category") + ".");
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