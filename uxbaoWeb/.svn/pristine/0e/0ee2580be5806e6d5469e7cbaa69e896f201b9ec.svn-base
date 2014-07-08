/**
 * Created by zd on 2014/4/2 0002.
 */

var request = GetRequest();

var ajaxCommentList = {
    "resId":request.resId,
    "total_size":0,//总共的应用个数
    "start_position":1,//从第几个开始取
    "init_size":8,//第一次取的数目
    "load_size":5,//之后每次下拉加载的数目
    "url": $.apiRoot + "appV3/getCustomerRemark.do",
    "onRefresh":false
};
if(request.type)
{
    ajaxCommentList.type = request.type;//不传或该值为空则返回所有结果“Good”返回好评结果(大小写敏感)“Bad”返回差评结果
}
else
{
    ajaxCommentList.type = "";
}

//填充一个评论
function fillItem($item, data)
{
    if(data.customerName)
    {
        $item.find('.userName').text(data.customerName);
    }
    else
    {
        $item.find('.userName').text('游戏宝用户');
    }
    if(data.customerImg)
    {
        ajaxCommentList.imgLazyload = true;
        $item.find('.userIcon').find('img').data('icon', data.customerImg)
            .attr('src', user_icon).imglazyload({"urlName":"data-icon"});
    }
    else
    {
        $item.find('.userIcon').find('img').attr('src', user_icon);
    }
    var date = new Date(parseInt(data.custremarkCreatedate));
    $item.find('.commentDate').text(getDateStr(date));
    $item.find('.commentContent').text(data.custremarkContent);
    $item.find('.grade').find('img').each(function(j, imgItem)
    {
        if(j - data.custremarkCustrated < -0.5)
        {
            $(imgItem).attr("src", little_yellow_star);
        }
        else
        {
            $(imgItem).attr("src", light_gray_star);
        }
    });
}

//从现有node根据给的data创建新node
function createItem($node, itemData)
{
    var $item = $node.clone();
    fillItem($item,itemData);
    return $item;
}

//加载更多
function loadMore()
{
    if(!ajaxCommentList.onRefresh && ajaxCommentList.start_position <= ajaxCommentList.total_size)
    {
        ajaxCommentList.onRefresh = true;
        $.ajax(
            {
                url:ajaxCommentList.url,
                dataType:'jsonp',
                data:
                {
                    "resId":ajaxCommentList.resId,
                    "type":ajaxCommentList.type,
                    "version":userInfo.version,
                    "phonetypeName":userInfo.phonetypeName,
                    "os_version":userInfo.os_version,
                    "imei":userInfo.imei,
                    "imsi":userInfo.imsi,
                    "size":ajaxCommentList.load_size,
                    "start_position":ajaxCommentList.start_position
                },
                jsonp:'jsonpCommentList',
                success:function(data, textStatus, xhr)
                {
                    if(data.state === 1)
                    {
                        var $container = $("#comment-list-box");
                        ajaxCommentList.total_size = data.comments.total_size;
                        var len = data.comment.length;

                        for (var i = 0; i < len; ++i)
                        {
                            var $item = createItem($(".commentItem").eq(0), data.comment[i]);
                            $container.append($item);
                        }

                        ajaxCommentList.start_position += len;

                        if(ajaxCommentList.start_position > ajaxCommentList.total_size)
                        {
                            $(".more").hide();
                        }
                        ajaxCommentList.onRefresh = false;
                    }
                },
                error:function(XMLHttpRequest, textStatus, errorThrown)
                {
                    ajaxCommentList.onRefresh = false;
                    console.log("failed ajax!");
                    $(".more").hide();
                }
            }
        );
    }
}

var little_yellow_star, light_gray_star, user_icon;

//页面加载完毕执行函数
$(function()
{
    user_icon = $('.userIcon').eq(0).find('img').attr('src');
    var $default_star = $(".grade").find('img');
    little_yellow_star = $default_star.eq(0).attr("src");
    light_gray_star = $default_star.eq(1).attr("src");
    //最开始ajax加载8个评论
    $.ajax(
        {
            url:ajaxCommentList.url,
            dataType:'jsonp',
            data:
            {
                "resId":ajaxCommentList.resId,
                "type":ajaxCommentList.type,
                "version":userInfo.version,
                "phonetypeName":userInfo.phonetypeName,
                "os_version":userInfo.os_version,
                "imei":userInfo.imei,
                "imsi":userInfo.imsi,
                "size":ajaxCommentList.init_size,
                "start_position":ajaxCommentList.start_position
            },
            jsonp:'jsonpCommentList',
            success:function(data)
            {
                if(data.state === 1)//获取成功
                {
                    ajaxCommentList.total_size = data.comments.total_size;
                    ajaxCommentList.start_position += data.comment.length;
                    $('.commentItem').each(function(i, commentItem)
                    {
                        var $item = $(this);
                        if(data.comment[i])
                        {
                            fillItem($item, data.comment[i]);
                        }
                        else
                        {
                            $item.remove();
                        }
                    });
                    if(ajaxCommentList.imgLazyload)
                    {
                        $.fn.imglazyload.detect();
                    }

                    //下拉加载
                    if(ajaxCommentList.start_position <= ajaxCommentList.total_size)
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
                    console.log("There is no app to load.");
                }
            },
            error:function()
            {
                console.log("load recommend app list error");
            }
        }
    );
});