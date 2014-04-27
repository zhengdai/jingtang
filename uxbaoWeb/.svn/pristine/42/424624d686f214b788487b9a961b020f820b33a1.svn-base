/**
 * Created by zd on 14-3-21.
 */

$(function()
{
    var assist = $("#myonoffswitch").attr("checked");
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