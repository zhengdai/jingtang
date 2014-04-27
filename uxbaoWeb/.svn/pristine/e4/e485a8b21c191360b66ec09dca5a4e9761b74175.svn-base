/**
 * Created by zd on 14-3-21.
 */
var isUxbao, phoneData;
if(window.uxbao)
{
    isUxbao = true;
}
else
{
    isUxbao = false;
}

$(function()
{
    var assist = $("#myonoffswitch").attr("checked");
	if(isUxbao)
    {
        var userInfo = JSON.parse(window.uxbao.userInfo());
        var userName = userInfo.userInfo.userName;
    }
    $("#infoCenter").on('tap', function()
    {
        isUxbao && window.uxbao.click(
            JSON.stringify(
                {
                    "type":7
                }
            )
        );
    });
    $("#gameCenter").on('tap', function()
    {
        isUxbao && window.uxbao.click(
            JSON.stringify(
                {
                    "type":8
                }
            )
        );
    });
	$(".logBtn").on('tap', function()
    {
        isUxbao && window.uxbao.click(
            JSON.stringify(
                {
                    "type":11
                }
            )
        );
    });
    $(".onoffswitch").on('tap', function()
    {
        assist = !assist;
        isUxbao && window.uxbao.click(
            JSON.stringify(
                {
                    "type":9,
                    "open":assist
                }
            )
        );
    });
});