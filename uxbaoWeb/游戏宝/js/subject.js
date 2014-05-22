/**
 * Created by zd on 14-3-11.
 */
//ajax参数对象
var ajaxSubject =
{
    "total_size":0,//总共的专题个数
    "start_position":1,//从第几个开始取
    "init_size":3,//第一次取的数目
    "load_size":2,//之后每次下拉加载的数目
    "url": $.apiRoot + "appV3/getTopic.do",
    "onRefresh":false,
    "subjectDetailUrl": $.htmlRoot + "topic_detail.html"
};

//加载进来的专题列表
var subjectList = [];
//空li字符串，创建用
function createItem(itemData)
{
    var $item = $(($(".subject")[0]).cloneNode(true));
    fillItem($item,itemData);
    return $item;
}

//将日期对象转换成日期字符串如2014.03.15
function getDateStr(date)
{
    var dateStr = "";
    dateStr += date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    if(month < 10)
    {
        dateStr += '.0' + month;
    }
    else
    {
        dateStr += '.' + month;
    }
    if(day < 10)
    {
        dateStr += '.0' + day;
    }
    else
    {
        dateStr += '.' + day;
    }
    return dateStr;
}

//ajax填充一个专题的信息，$item是一个zepto对象，itemData提供填充数据
function fillItem($item, itemData)
{
    $item.data('rescategoryId', itemData.rescategoryId).find(".subjectTime").text(getDateStr(new Date(itemData.rescategoryCreateddate)));
    $item.data('name', itemData.rescategoryName).find(".subjectName").text(itemData.rescategoryName);
    $item.find("img").data("pic", itemData.rescategoryIcons).attr('src', default_icon);
    $item.find(".description").text(itemData.rescategoryDescription);
}

//点击函数
function btnTapHandler($target)
{
    isUxbao && window.uxbao.click(JSON.stringify
        (
            {
                "type":15,
                "title":$target.data('name'),
                "url":ajaxSubject.subjectDetailUrl + '?categoryId=' + $target.data('rescategoryId')
            }
        )
    );
}

//加载更多
function loadMore()
{
    if(!ajaxSubject.onRefresh && ajaxSubject.start_position <= ajaxSubject.total_size)
    {
        ajaxSubject.onRefresh = true;
        $.ajax(
            {
                url:ajaxSubject.url,
                dataType:'jsonp',
                data:
                {
                    "version":userInfo.version,
                    "phonetypeName":userInfo.phonetypeName,
                    "os_version":userInfo.os_version,
                    "imei":userInfo.imei,
                    "imsi":userInfo.imsi,
                    "size":ajaxSubject.load_size,
                    "start_position":ajaxSubject.start_position
                },
                jsonp:'jsonSubject',
                success:function(data, textStatus, xhr)
                {
                    if(data.state === 1 && data.product)
                    {
                        var $container = $("#subject-list-box");

                        subjectList = subjectList.concat(data.product);
                        var len = data.product.length;

                        for (var i = 0; i < len; ++i)
                        {
                            var $item = createItem(data.product[i]);
                            $container.append($item);
                            $item.find("img").imglazyload({"urlName":"data-pic"});
                            //添加点击响应函数
                            $item.on("tap",function()
                            {
                                btnTapHandler($(this));
                                return false;
                            });
                        }

                        ajaxSubject.start_position += len;

                        if(ajaxSubject.start_position > ajaxSubject.total_size)
                        {
                            $(".more").hide();
                        }
                        ajaxSubject.onRefresh = false;
                    }
                },
                error:function(XMLHttpRequest, textStatus, errorThrown)
                {
                    ajaxSubject.onRefresh = false;
                    console.log("failed ajax!");
                    $(".more").hide();
                }
            }
        );
    }
}

var default_icon;

//页面加载完毕执行函数
$(function()
{
    default_icon = $(".subject").eq(0).find('img').attr("src");
    //最开始ajax加载3个专题
    $.ajax(
        {
            url:ajaxSubject.url,
            dataType:'jsonp',
            data:
            {
                "version":userInfo.version,
                "phonetypeName":userInfo.phonetypeName,
                "os_version":userInfo.os_version,
                "imei":userInfo.imei,
                "imsi":userInfo.imsi,
                "size":ajaxSubject.init_size,
                "start_position":ajaxSubject.start_position
            },
            jsonp:'jsoncallback',
            success:function(data)
            {
                if(data.state === 1)//获取成功
                {
                    ajaxSubject.total_size = data.products.total_size;
                    subjectList = subjectList.concat(data.product);
                    ajaxSubject.start_position += data.product.length;
                    $(".subject").each(function(i,item)
                    {
                        var $item = $(this);
                        if(data.product[i])
                        {
                            fillItem($item, data.product[i]);
                            $item.find("img").imglazyload({"urlName":"data-pic"});

                            //添加点击响应函数
                            $item.on("tap",function()
                            {
                                btnTapHandler($(this));
                                return false;
                            });
                        }
                        else
                        {
                            $item.remove();
                        }
                    });

                    $.fn.imglazyload.detect();

                    //下拉加载
                    if(ajaxSubject.start_position <= ajaxSubject.total_size)
                    {
                        $(window).on("scroll", function()
                        {
                            var lazyheight = parseFloat($(window).height()) + parseFloat($(window).scrollTop()) + parseFloat($('.more').height());
                            if ($(document).height() <= lazyheight)
                            {
                                loadMore();
                            }
                        });
                    }
                    else
                    {
                        $(".more").hide();
                    }
                }
                else
                {
                    console.log("failed to get json data.");
                }
            }
        }
    );
});
