/**
 * Created by zd on 14-3-21.
 */
var ajaxCategory =
{
    "url": $.apiRoot + "appV3/getCategory.do",
    "detailUrl": $.htmlRoot + "category_detail.html"
};

var ajaxCategoryIcon =
{
    "url":$.apiRoot + "appV3/getCategoryProducts.do",
    "start_position":"1",
    "order_by":"hot",
    "size":"4"
};

var categoryInfo, categoryTag = {};

function categoryTapHandler($item)
{
    window.location.href = ajaxCategory.detailUrl + "?order_by=hot&rescategory_id=" + $item.data('rescategory_id');
}

$(function()
{
    //获取单机分类信息
    var title_text = $('title').text();
    if(title_text == "单机分类")
    {
        ajaxCategory.category = "1";
    }
    else if(title_text == "网游分类")
    {
        ajaxCategory.category = "2";
    }
    $.ajax(
        {
            url:ajaxCategory.url,
            dataType:"jsonp",
            data:
            {
                "category":ajaxCategory.category,
                "version":userInfo.version,
                "phonetypeName":userInfo.phonetypeName,
                "os_version":userInfo.os_version,
                "imei":userInfo.imei,
                "imsi":userInfo.imsi
            },
            jsonp:'jsonCategory',
            success:function(data)
            {
                var len = data.product.length;
                categoryInfo = data.product;

                for(var i = 0; i < len; ++i)
                {
                    categoryTag[categoryInfo[i].rescategoryName] = categoryInfo[i].rescategoryId;
                }
                $(".category").each(function()
                {
                    var $item = $(this);
                    $item.data('rescategory_id', categoryTag[$item.data("category")]);
                    $item.on("click", function()
                    {
                        categoryTapHandler($item);
                        return false;
                    });
                    ajaxCategoryIcon.rescategory_id = categoryTag[$item.data("category")];
                    $.ajax(
                        {
                            url:ajaxCategoryIcon.url,
                            dataType:"jsonp",
                            data:
                            {
                                "rescategory_id":ajaxCategoryIcon.rescategory_id,
                                "size":ajaxCategoryIcon.size,
                                "start_position":ajaxCategoryIcon.start_position,
                                "order_by":ajaxCategoryIcon.order_by,
                                "version":userInfo.version,
                                "phonetypeName":userInfo.phonetypeName,
                                "os_version":userInfo.os_version,
                                "imei":userInfo.imei,
                                "imsi":userInfo.imsi,
                                "language":userInfo.language,
                                "resolution":userInfo.resolution
                            },
                            jsonp:'jsonCategoryIcon',
                            success:function(data)
                            {
                                if(data.state === 1)
                                {
                                    var len = data.product.length;
                                    var $icon = $item.find('.appIcon');
                                    for(var j = 0; j < len; ++j)
                                    {
                                        $icon.eq(j).data("icon", data.product[j].resIcons);
                                    }
                                    $icon.imglazyload({"urlName":"data-icon"});
                                    $.fn.imglazyload.detect();
                                }
                                else
                                {
                                    console.log("there is no category data in " + $item.data("category") + ".");
                                }
                            }

                        }
                    );
                });

            },
            error:function()
            {
                console.log("load category data error.");
            }
        }
    );

});