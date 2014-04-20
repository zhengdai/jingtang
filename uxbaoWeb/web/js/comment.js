/**
 * Created by zd on 2014/4/2 0002.
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

var ajaxComment =
{
    "url":"http://115.29.177.196:8080/mystore/appV3/sendCustomerRemark.do",
    "resId":request.resId,
    "version":"2.3",
    "phonetypeName":"N7105",
    "os_version":"4.0",
    "imei":"00000000",
    "imsi":"00000000"
};

$(function()
{
    $('.comment-frame').height(document.documentElement.clientHeight - 30);
    var $star = $(".comm-star"), $star_holder = $("#J_star_holder"), $submit = $("#J_submit");
    $star.each(function(i, item) {
        $(item).on('tap', function(){
            var grade = $(this).attr("data-star");
            $star.removeClass("star-cur");
            $star_holder.val(grade);
            for (var j = 0; j <= i; j++)
            {
                $($star[j]).addClass("star-cur");
            }
        })
    });
    $submit.on('tap', function(e) {
        ajaxComment.resRated = $star_holder.val();
        if(isUxbao)
        {
            var userInfo = JSON.parse(window.uxbao.userInfo());
            if(userInfo.userInfo.userName)
            {
                ajaxComment.userId = userInfo.userInfo.userName;
                ajaxComment.nickName = userInfo.userInfo.nickName;
            }
            else
            {
                ajaxComment.userId = "";
                ajaxComment.nickName = "";
            }
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
                        "type":ajaxComment.type,
                        "version":ajaxComment.version,
                        "phonetypeName":ajaxComment.phonetypeName,
                        "os_version":ajaxComment.os_version,
                        "imei":ajaxComment.imei,
                        "imsi":ajaxComment.imsi,
                        "size":ajaxComment.load_size,
                        "start_position":ajaxComment.start_position,
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