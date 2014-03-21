/**
 * Created by zd on 14-3-11.
 */
/**
 * Created by zd on 14-3-9.
 */

//ajax参数对象
var ajaxSubject =
{
    "total_size":0,//总共的应用个数
    "start_position":1,//从第几个开始取
    "init_size":3,//第一次取的数目
    "load_size":2,//之后每次下拉加载的数目
    "url":"http://115.29.177.196:8080/mystore/appV3/getTopic.do",
    "resolution":"200*200",
    "version":"2.3",
    "phonetypeName":"N7105",
    "os_version":4.0,
    "imei":"00000000",
    "imsi":"00000000"
};

//加载进来的推荐应用列表
var subjectList = [];
//空li字符串，创建用
function createItem(itemData)
{
    var $item = $(($(".subject")[0]).cloneNode(true));
    fillItem($item,itemData);
    return $item;
}

//ajax填充一个应用的信息，$item是一个zepto对象，itemData提供填充数据
function fillItem($item, itemData)
{
    //$item.find(".subjectItem").attr("href", itemData.rescategoryName);
    $item.find("img").attr("data-pic", itemData.rescategoryIcons);
    $item.find(".description").text(itemData.rescategoryDescription);

}

//点击函数
function btnTapHandler($target)
{
    var $item = $target.parent().parent();

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
                    "version":ajaxSubject.version,
                    "phonetypeName":ajaxSubject.phonetypeName,
                    "os_version":ajaxSubject.os_version,
                    "imei":ajaxSubject.imei,
                    "imsi":ajaxSubject.imsi,
                    "size":ajaxSubject.load_size,
                    "start_position":ajaxSubject.start_position
                },
                jsonp:'jsonRecommend',
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
                            $item.find(".appIcon").imglazyload({"urlName":"data-icon"});
                            //添加点击响应函数
                            $item.find(".btn").on("tap",function()
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

//页面加载完毕执行函数
$(function()
{
    //最开始ajax加载3个专题
    $.ajax(
        {
            url:ajaxSubject.url,
            dataType:'jsonp',
            data:
            {
                "version":ajaxSubject.version,
                "phonetypeName":ajaxSubject.phonetypeName,
                "os_version":ajaxSubject.os_version,
                "imei":ajaxSubject.imei,
                "imsi":ajaxSubject.imsi,
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
                        fillItem($item, data.product[i]);
                        $item.find("img").imglazyload({"urlName":"data-pic"});
                        $.fn.imglazyload.detect();
                        //添加点击响应函数
                        $item.find(".subjectItem").on("tap",function()
                        {
                            btnTapHandler($(this));
                        });
                    });


                    //下拉加载
                    if(ajaxSubject.start_position <= ajaxSubject.total_size)
                    {
                        $(window).on("scroll", function()
                        {
                            lazyheight = parseFloat($(window).height()) + parseFloat($(window).scrollTop()) + parseFloat($('.more').height());
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
