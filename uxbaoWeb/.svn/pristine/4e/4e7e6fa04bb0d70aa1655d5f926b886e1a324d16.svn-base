/**
 * Created by zd on 14-3-21.
 */

$(function()
{
    var assist = $("#myonoffswitch").attr("checked");
	var userInfo = JSON.parse(window.uxbao.userInfo());
	var userName = userInfo.userInfo.userName;
    $("#infoCenter").on('tap', function()
    {
        window.uxbao.click(
            JSON.stringify(
                {
                    "type":7
                }
            )
        );
    });
    $("#gameCenter").on('tap', function()
    {
        window.uxbao.click(
            JSON.stringify(
                {
                    "type":8
                }
            )
        );
    });
	$(".logBtn").on('tap', function()
    {
        window.uxbao.click(
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
        window.uxbao.click(
            JSON.stringify(
                {
                    "type":9,
                    "open":assist
                }
            )
        );
    });
});