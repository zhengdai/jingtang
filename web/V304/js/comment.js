/**
 * Created by zd on 2014/4/2 0002.
 */
$.apiRoot = 'http://apk.gambao.com:8080/mystore/';

var request = GetRequest();

var ajaxComment =
{
    "url": $.apiRoot + "appV3/sendCustomerRemark.do",
    "resId":request.resId
};

$(function()
{
    $('.comment-frame').height(document.documentElement.clientHeight - 30);
    var $star = $(".comm-star"), $star_holder = $("#J_star_holder"), $submit = $("#J_submit");
    $star.each(function(i, item) {
        $(item).on('tap', function(){
            var grade = $(this).data("star");
            $star.removeClass("star-cur");
            $star_holder.val(grade);
            for (var j = 0; j <= i; j++)
            {
                $star.eq(j).addClass("star-cur");
            }
        })
    });
    $submit.on('tap', function(e) {
        ajaxComment.resRated = $star_holder.val();
        if(userInfo.id)
        {
            ajaxComment.userId = userInfo.id;
            ajaxComment.nickName = userInfo.nickName;
        }
        else
        {
            ajaxComment.userId = "";
            ajaxComment.nickName = "";
        }
        ajaxComment.commentContent = $("#J_describe").val().trim();
        if(ajaxComment.commentContent)
        {
            $.ajax(
                {
                    url:ajaxComment.url,
                    dataType:"jsonp",
                    data:
                    {
                        "resRated":ajaxComment.resRated,
                        "userId":ajaxComment.userId,
                        "nickName":ajaxComment.nickName,
                        "resId":ajaxComment.resId,
                        "version":userInfo.version,
                        "phonetypeName":userInfo.phonetypeName,
                        "os_version":userInfo.os_version,
                        "imei":userInfo.imei,
                        "imsi":userInfo.imsi,
                        "custremarkContent":ajaxComment.commentContent
                    },
                    success:function(data)
                    {
                        //提交成功
                        if(data.state == 1)
                        {
                            isUxbao && window.uxbao.comment("0");
                        }
                        //过快评论
                        else if(data.state == -1)
                        {
                            isUxbao && window.uxbao.comment("2");
                        }
                        //其他错误
                        else if(data.state == 0)
                        {
                            console.log("unknown error.");
                            isUxbao && window.uxbao.comment("3");
                        }
                    },
                    error:function()
                    {
                        isUxbao && window.uxbao.comment("1");
                    }
                }
            );
        }
        else
        {
            $('.grade').find('span').addClass('err').text("请填写评论");
        }
    });
});