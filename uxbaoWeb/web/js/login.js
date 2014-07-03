/**
 * Created by zd on 2014/4/4 0004.
 */

var ajaxLogin = {
    "url": $.apiRoot + "userV3/userLogin.do"
};

function login()
{
    var mobileNo = $('#J_mobileNo'), password = $('#J_password'), errHolder = $('#msg_err');
    var mobile = mobileNo.get(0);
    if(!/^(1[3-9][0-9])\d{8}$/.test(mobile.value))
    {
        errHolder.text('请输入正确的手机号').show();
        mobile.focus();
        return;
    }
    if (!/^.{6,32}$/.test(password.val()))
    {
        errHolder.text('密码长度必须为6-32字符').show();
        password.focus();
        return;
    }
    $.ajax(
        {
            url:ajaxLogin.url,
            dataType:"jsonp",
            data:
            {
                "mobileNum":mobile.value,
                "password":password.val(),
                "version": userInfo.version,
                "phonetypeName": userInfo.phonetypeName,
                "os_version": userInfo.os_version,
                "imei": userInfo.imei,
                "imsi": userInfo.imsi
            },
            jsonp:'jsonpcallback',
            success:function(data)
            {
                //注册成功
                if(data.state == 1)
                {
					errHolder.text("登录成功").show();
					window.activity.onLogin(JSON.stringify(data.userInfo));
                }
                else
                {
                    errHolder.text(data.message).show();
                }
            }
        }
    )
}

$(function()
{
	var phoneNum = userInfo.mobile;
	//var phoneNum  = "15210584368";

    //获得焦点边框变红，失去焦点恢复
    //填写默认手机号码
    $('#J_mobileNo').val(phoneNum).on("focusin", function()
    {
        $(this).parent().addClass('active');
    }).on("focusout", function()
    {
        $(this).parent().removeClass('active');
    });
    $('#J_password').on("focusin", function()
    {
        $(this).parent().addClass('active');
    }).on("focusout", function()
    {
        $(this).parent().removeClass('active');
    });

    //点击登录
    $("#J_submit").on('tap', function()
    {
        login();
    });

    //点击注册链接
    $("#to_register").on("tap", function()
    {
        isUxbao && window.activity.skipTo("register");
    });
});