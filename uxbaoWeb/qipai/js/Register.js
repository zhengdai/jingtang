

$(document).ready(function () {


    //    //密码强度
    strongRankBind($("#txtLogonPass"), $("#lblLogonPassSafeRank"));
    strongRankBind($("#txtInsurePass1"), $("#lblInsurePassSafeRank"));

    //    //弹出页面
    //    // $(".reg_input").val("sdfdsf");

    $("#btnRegister").mouseenter(function () {
        $(this).removeClass("btnstts11");
        $(this).addClass("Loginsta11");
    }).mouseout(function () {
            $(this).removeClass("Loginsta11");
            $(this).addClass("btnstts11");
        });

});
