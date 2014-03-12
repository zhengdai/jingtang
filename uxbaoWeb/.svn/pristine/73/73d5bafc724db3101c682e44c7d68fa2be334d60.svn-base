/**
 * Created by zd on 14-3-11.
 */
/**
 * Created by zd on 14-3-9.
 */

//ajax参数对象
var ajaxPara =
{
    "total_size":0,//总共的应用个数
    "start_position":1,//从第几个开始取
    "init_size":5,//第一次取的数目
    "load_size":2,//之后每次下拉加载的数目
    "url":"http://115.29.177.196:8080/mystore/app/getrecommendproducts.do"
};

//加载进来的推荐应用列表
var recommendList = [];
//空li字符串，创建用
function createItem(itemData)
{
    var itemString = '<li>' +
        '<a href="'+ itemData.resLocation + '" class="subjectItem">' +
        '<img data-pic="' + itemData.resScreenshots.split(',')[0] + '" />' +
        '<div class="subjectDes">' +
        '<p class="description">' + itemData.resDescription + '</p>' +
        '<span class="arrow"></span>' +
        '</div></a></li>';

    return $(itemString);
}

//ajax填充一个应用的信息，$item是一个zepto对象，itemData提供填充数据
function fillItem($item, itemData)
{
    var packageName = itemData.resPackagename;

    $item.find(".subjectItem").attr("href", itemData.resLocation);
    $item.find("img").attr("data-pic", itemData.resScreenshots.split(',')[0])
    $item.find(".description").text(itemData.resDescription);

}

//点击函数
function btnTapHandler($target)
{
    var $item = $target.parent().parent();

}

//页面加载完毕执行函数
$(function()
{
    //最开始ajax加载20个应用
    $.ajax(
        {
            url:ajaxPara.url,
            dataType:'jsonp',
            data:
            {
                "resolution":"200*200",
                "version":"2.3",
                "phonetypeName":"N7105",
                "os_version":4.0,
                "language":"cn",
                "imei":"00000000",
                "imsi":"00000000",
                "size":ajaxPara.init_size,
                "start_position":ajaxPara.start_position,
                "base64":false
            },
            jsonp:'jsoncallback',
            success:function(data)
            {
                if(data.state === 1)//获取成功
                {
                    ajaxPara.total_size = data.products.total_size;
                    recommendList = recommendList.concat(data.product);
                    $("#subject-list-box li").each(function(i,item)
                    {
                        var $item = $(this);
                        fillItem($item, data.product[i], ajaxPara.start_position + i);
                        $item.find("img").imglazyload({"urlName":"data-pic"});
                        $.fn.imglazyload.detect();
                        //添加点击响应函数
                        $item.find(".subjectItem").on("tap",function()
                        {
                            btnTapHandler($(this));
                        });
                    });
                    ajaxPara.start_position += data.product.length;
                }
                else
                {
                    console.log("failed to get json data.");
                }
            }
        }
    );

    //下拉加载
    $('.subjectList').refresh(
        {
            load:function(dir, type)
            {
                var me = this;
                $.ajax(
                    {
                        url:ajaxPara.url,
                        dataType:'jsonp',
                        data:
                        {
                            "resolution":"200*200",
                            "version":"2.3",
                            "phonetypeName":"N7105",
                            "os_version":4.0,
                            "language":"cn",
                            "imei":"00000000",
                            "imsi":"00000000",
                            "size":ajaxPara.load_size,
                            "start_position":ajaxPara.start_position,
                            "base64":false
                        },
                        jsonp:'jsoncallback',
                        success:function(data)
                        {
                            if(data.state === 1 && data.product)
                            {
                                var $container = $("#subject-list-box");
                                ajaxPara.total_size = data.products.total_size;

                                recommendList = recommendList.concat(data.product);
                                var len = data.product.length;
                                for (var i = 0; i < len; ++i)
                                {
                                    var $item = createItem(data.product[i]);
                                    $container[dir == 'up' ? 'prepend' : 'append']($item);
                                    $item.find("img").imglazyload({"urlName":"data-pic"});
                                    //添加点击响应函数
                                    $item.find(".subjectItem").on("tap",function()
                                    {
                                        btnTapHandler($(this));
                                    });
                                }
                                ajaxPara.start_position += len;
                                me.afterDataLoading();
                            }
                            else
                            {
                                me.disable("down", true);
                            }
                        },
                        error:function()
                        {
                            console.log("error");
                        }
                    }
                );
            }
        }
    );
});
