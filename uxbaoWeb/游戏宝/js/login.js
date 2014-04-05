/**
 * Created by zd on 2014/4/4 0004.
 */
$(function()
{
    //获得焦点边框变红，失去焦点恢复
    $('#J_mobileNo').on("focusin", function()
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
});