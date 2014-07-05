console.log(userInfo.imei);
console.log(userInfo.imsi);
console.log(userInfo.os_version);
//推荐应用ajax参数对象
var ajaxRecommend =
{
    "total_size":0,//总共的应用个数
    "start_position":1,//从第几个开始取
    "init_size":20,//第一次取的数目
    "load_size":10,//之后每次下拉加载的数目
    "url": $.apiRoot + "appV3/getrecommendproducts.do",
    "recommendUrl":$.apiRoot + "appV3/getDailyRecommend.do",
    "bannerUrl":$.apiRoot + "appV3/getBannerInfo.do",
    "detailUrl": $.htmlRoot + "game_detail.html",
    "onRefresh":false,
    "biwanUrl": $.htmlRoot + "must_play.html",
    "zuixinUrl": $.htmlRoot + "newest.html",
    "kaifuUrl": $.htmlRoot + "category_detail.html?rescategory_id=34&order_by=new",
    "qipaiUrl": $.htmlRoot + "free.html",
    "libaoUrl": $.htmlRoot + "gift_list.html",
    "historyUrl": $.htmlRoot + "his_recommend.html"
};

//加载进来的推荐应用列表
var recommendList = [];

function createItem(itemData)
{
    var $item = $(($(".app")[0]).cloneNode(true));
    fillItem($item,itemData);
    return $item;
}

//供android调用，更新页面的应用的状态，一种是安装包下载进度，还有就是下载完成，安装完成时
function updateState(packageName, state)
{
    var $item = $(document.getElementById(packageName));
    var $btn = $item.find(".btn");
    if(state >= 0 && state <= 100)
    {
        if(!$btn.hasClass("cancelBtn"))
        {
            $btn.removeClass().addClass("cancelBtn btn");
        }
        $item.find(".state").text(state + "%");
    }
    else if(state == "finishDownload")
    {
        $btn.removeClass().addClass("installBtn btn");
        $item.find(".state").text("安装");
    }
    else if(state == "finishInstall")
    {
        $btn.removeClass().addClass("openBtn btn");
        $item.find(".state").text("打开");
    }
    else if(state == "pause")
    {
        $btn.removeClass().addClass("continueBtn btn");
        $item.find(".state").text("继续");
    }
}

//判断packageName是否在list中，在的话返回索引，不在的话返回-1
function indexList(packageName, list)
{
    var len = list.length;
    for(var i = 0; i < len; ++i)
    {
        if(packageName == list[i].resPackagename)
        {
            return i;
        }
    }
    return -1;
}

//ajax填充打分
function fillRate($item, score)
{
    //分数
    $item.find(".items-score img").each(function(j, imgItem)
    {
        if(j - score < -0.5)
        {
            $(imgItem).attr("src", star_01);
        }
        else if(j - score == -0.5)
        {
            $(imgItem).attr("src", star_02);
        }
        else
        {
            $(imgItem).attr("src", star_03);
        }
    });
}

//根据本机信息填充状态
function fillState($item, packageName, phoneData)
{
    //在下载列表里
    var downloadIndex = indexList(packageName, phoneData.downloadList);
    if(downloadIndex != -1)
    {
        //下载完成。显示安装状态
        if(phoneData.downloadList[downloadIndex].downPercent == 100)
        {
            $item.find(".state").text("安装");
            $item.find(".btn").removeClass().addClass("btn installBtn");
        }
        //下载未完成，显示继续
        else
        {
            $item.find(".state").text("继续");
            $item.find(".btn").removeClass().addClass("btn continueBtn");
        }
    }
    //在升级列表里
    else if(indexList(packageName, phoneData.updateList) != -1)
    {
        $item.find(".state").text("升级");
        $item.find(".btn").removeClass().addClass("btn updateBtn");
    }
    //在已安装列表
    else if(indexList(packageName, phoneData.installList) != -1)
    {
        $item.find(".state").text("打开");
        $item.find(".btn").removeClass().addClass("btn openBtn");
    }
    //不在上述列表中
    else
    {
        $item.find(".state").text("下载");
        $item.find(".btn").removeClass().addClass("btn dlBtn");
    }
}

//ajax填充一个应用的信息，$item是一个zepto对象，itemData提供填充数据
function fillItem($item, itemData)
{
    var packageName = itemData.resPackagename;
    //使用包名作为id
    $item.attr("id", itemData.resPackagename)
        .data("location", itemData.resLocation)
        .data("id", itemData.resId)
        .data("package", packageName)
        .data("icon", itemData.resIcons)
        .data("name", itemData.resName)
        .data("capacity", itemData.resCapacity/(1024*1024));

    $item.find(".appIcon").data("icon", itemData.resIcons).attr("src", default_icon);

    $item.find(".tit strong").text(itemData.resName);
    var ca = (itemData.resCapacity/(1024 * 1024)).toFixed(1);
    $item.find('.company').text(ca + 'MB');

    //评分
    var rated = itemData.resRated;
    fillRate($item, rated);

    //状态
    fillState($item, packageName, phoneData);
}

//填充每日推荐
function fillRecommend($rec, data)
{
    var packageName = data.resPackagename;
    //使用包名作为id
    $rec.find('.recommend-info').attr("id", data.resPackagename)
        .data("location", data.resLocation)
        .data("id", data.resId)
        .data("package", packageName)
        .data("icon", data.resIcons)
        .data("name", data.resName);

    $rec.find(".recommend-icon").data("icon", data.resIcons).attr("src", default_icon);

    $rec.find(".recommend-name").text(data.resName);
    var ca = (data.resCapacity/(1024 * 1024)).toFixed(1);
    $rec.find('.recommend-capa').text(" | " + ca + 'MB');
    if(data.resIntroduction)
    {
        $rec.find('.recommend-des').text(data.resIntroduction);
    }
    else
    {
        $rec.find('.recommend-des').text(data.resDescription);
    }

    //评分
    var rated = data.resRated;
    fillRate($rec, rated);

    //状态
    fillState($rec, packageName, phoneData);
}

//tap点击函数
function btnTapHandler($target)
{
    var $item;
    if($target.parent().hasClass('recommend-info'))
    {
        $item = $target.parent();
    }
    else
    {
        $item = $target.parent().parent();
    }
    //通知android下载，显示下载或者继续字样
    if($target.hasClass('dlBtn') || $target.hasClass('continueBtn'))
    {
        if($target.hasClass('dlBtn') && userInfo.userState)
        {
            isUxbao && window.uxbao.addSaveDataFlow($item.data("capacity"));
        }
        $target.removeClass().addClass('cancelBtn btn');
        $target.find(".state").text('暂停');
        isUxbao && window.uxbao.click(
            JSON.stringify(
                {
                    "type":1,
                    "resPackagename":$item.data("package"),
                    "resId":$item.data("id"),
                    "resLocation":$item.data("location"),
                    "resIcons":$item.data("icon"),
                    "resName":$item.data("name")
                }
            )
        );
    }
    //显示升级字样
    else if($target.hasClass('updateBtn'))
    {
        if(userInfo.userState)
        {
            isUxbao && window.uxbao.addSaveDataFlow($item.data("capacity"));
        }
        $target.removeClass('updateBtn').addClass('cancelBtn');
        $target.find(".state").text('暂停');
        isUxbao && window.uxbao.click(
            JSON.stringify(
                {
                    "type":1,
                    "resPackagename":$item.data("package"),
                    "resId":$item.data("id"),
                    "resLocation":$item.data("location"),
                    "resIcons":$item.data("icon"),
                    "resName":$item.data("name")
                }
            )
        );
    }
    //通知android暂停下载，显示暂停字样
    else if($target.hasClass('cancelBtn'))
    {
        $target.removeClass('cancelBtn').addClass('continueBtn');
        $target.find(".state").text('继续');
        isUxbao && window.uxbao.click(
            JSON.stringify(
                {
                    "type":5,
                    "resPackagename":$item.data("package"),
                    "resId":$item.data("id"),
                    "resLocation":$item.data("location"),
                    "resIcons":$item.data("icon"),
                    "resName":$item.data("name")
                }
            )
        );
    }
    //通知android打开此应用，显示打开字样
    else if($target.hasClass("openBtn"))
    {
        isUxbao && window.uxbao.click(
            JSON.stringify(
                {
                    "type":3,
                    "resPackagename":$item.data("package"),
                    "resId":$item.data("id"),
                    "resLocation":$item.data("location"),
                    "resIcons":$item.data("icon"),
                    "resName":$item.data("name")
                }
            )
        );
    }
    //通知android安装此应用，显示安装字样
    else if($target.hasClass("installBtn"))
    {
        isUxbao && window.uxbao.click(
            JSON.stringify(
                {
                    "type":6,
                    "resPackagename":$item.data("package"),
                    "resId":$item.data("id"),
                    "resLocation":$item.data("location"),
                    "resIcons":$item.data("icon"),
                    "resName":$item.data("name")
                }
            )
        );
    }
}

//进入游戏详情
function infoTapHandler($info)
{
    var $item = $info.parent().parent();
    var resId = $item.data("id");
    isUxbao && window.uxbao.click(
        JSON.stringify(
            {
                "type":2,
                "resId":resId,
                "url": ajaxRecommend.detailUrl + "?resId=" + resId + "&isFree=" + Boolean(userInfo.userState),
                "resName":$item.data("name"),
                "resPackageName":$item.data("package")
            }
        )
    );
}

//进入每日推荐游戏详情
function recommendTapHandler($info)
{
    var $item = $info;
    var resId = $item.data("id");
    isUxbao && window.uxbao.click(
        JSON.stringify(
            {
                "type":2,
                "resId":resId,
                "url":ajaxRecommend.detailUrl + "?resId=" + resId,
                "resName":$item.data("name"),
                "resPackageName":$item.data("package")
            }
        )
    );
}

//加载更多
function loadMore()
{
    if(!ajaxRecommend.onRefresh && ajaxRecommend.start_position <= ajaxRecommend.total_size)
    {
        ajaxRecommend.onRefresh = true;
        $.ajax(
            {
                url:ajaxRecommend.url,
                dataType:'jsonp',
                data:
                {
                    "resolution":userInfo.resolution,
                    "version":userInfo.version,
                    "phonetypeName":userInfo.phonetypeName,
                    "os_version":userInfo.os_version,
                    "language":userInfo.language,
                    "imei":userInfo.imei,
                    "imsi":userInfo.imsi,
                    "size":ajaxRecommend.load_size,
                    "start_position":ajaxRecommend.start_position,
                    "servicePrivider":userInfo.userState && userInfo.serviceProvider
                },
                jsonp:'jsonRecommend',
                success:function(data, textStatus, xhr)
                {
                    if(data.state === 1 && data.product)
                    {
                        var $container = $("#app-list-box");

                        recommendList = recommendList.concat(data.product);
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
                            $item.find(".appInfo").on('tap', function()
                            {
                                infoTapHandler($(this));
                                return false;
                            });
                        }

                        ajaxRecommend.start_position += len;

                        if(ajaxRecommend.start_position > ajaxRecommend.total_size)
                        {
                            $(".more").hide();
                        }
                        ajaxRecommend.onRefresh = false;
                    }
                },
                error:function(XMLHttpRequest, textStatus, errorThrown)
                {
                    ajaxRecommend.onRefresh = false;
                    console.log("failed ajax!");
                    $(".more").hide();
                }
            }
        );
    }
}

var default_icon, star_01, star_02, star_03;

//页面加载完毕执行函数
$(function()
{
    var $freePart = $('#free-part');
    if(userInfo.serviceProvider && userInfo.serviceProvider == '0101')
    {
        $freePart.show();
    }
    else
    {
        $freePart.hide();
    }
    if(userInfo.userState)
    {
        var declarationPath = $freePart.data('declaration');
        $freePart.attr('src', declarationPath).show();
    }

    default_icon = $(".app").eq(0).find('.appIcon').attr('src');
    var $default_stars = $('.items-score').eq(0).find('img');
    star_01 = $default_stars.eq(0).attr('src');
    star_02 = $default_stars.eq(1).attr('src');
    star_03 = $default_stars.eq(2).attr('src');
    //最开始ajax加载20个应用
    $.ajax(
        {
            url:ajaxRecommend.url,
            dataType:'jsonp',
            data:
            {
                "resolution":userInfo.resolution,
                "version":userInfo.version,
                "phonetypeName":userInfo.phonetypeName,
                "os_version":userInfo.os_version,
                "language":userInfo.language,
                "imei":userInfo.imei,
                "imsi":userInfo.imsi,
                "size":ajaxRecommend.init_size,
                "start_position":ajaxRecommend.start_position,
                "servicePrivider":userInfo.userState && userInfo.serviceProvider
            },
            jsonp:'jsonRecommend',
            success:function(data)
            {
                if(data.state === 1)//获取成功
                {
                    ajaxRecommend.total_size = data.products.total_size;
                    recommendList = recommendList.concat(data.product);
                    ajaxRecommend.start_position += data.product.length;
                    $(".app").each(function(i,item)
                    {
                        var $item = $(this);
                        if(data.product[i])
                        {
                            fillItem($item, data.product[i]);
                            $item.find(".appIcon").imglazyload({"urlName":"data-icon"});

                            //添加点击响应函数
                            $item.find(".btn").on("tap",function()
                            {
                                btnTapHandler($(this));
                                return false;
                            });
                            $item.find(".appInfo").on('tap', function()
                            {
                                infoTapHandler($(this));
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
                    if(ajaxRecommend.start_position <= ajaxRecommend.total_size)
                    {
                        $(window).on("scroll", function()
                        {
                            lazyheight = parseFloat($(window).height()) + parseFloat($(window).scrollTop()) + parseFloat($('.more').height());
                            if ($(document).height() <= lazyheight)
                            {
                                loadMore();
                            }
                        });
                        $(window).trigger('scroll');
                    }
                    else
                    {
                        $(".more").hide();
                    }
                }
                else
                {
                    console.log("There is no app to load.");
                }
            },
            error:function()
            {
                console.log("load recommend app list error");
            }
        }
    );

    $("#biwan").on("tap", function()
    {
        isUxbao && window.uxbao.click(JSON.stringify
            (
                {
                    "type":15,
                    "title":"必玩列表",
                    "url":ajaxRecommend.biwanUrl
                }
            )
        );
        return false;
    });

    $("#zuixin").on("tap", function()
    {
        isUxbao && window.uxbao.click(JSON.stringify
            (
                {
                    "type":15,
                    "title":"最新列表",
                    "url":ajaxRecommend.zuixinUrl
                }
            )
        );
        return false;
    });

    $("#kaifu").on("tap", function()
    {
        isUxbao && window.uxbao.click(JSON.stringify
            (
                {
                    "type":15,
                    "title":"开服列表",
                    "url":ajaxRecommend.kaifuUrl
                }
            )
        );
        return false;
    });

    $("#free-area, #free-part").on("tap", function()
    {
        isUxbao && window.uxbao.click(JSON.stringify
            (
                {
                    "type":15,
                    "title":"广东移动免流量专区",
                    "url":ajaxRecommend.qipaiUrl
                }
            )
        );
        return false;
    });
    $("#libao").on("tap", function()
    {
        isUxbao && window.uxbao.click(JSON.stringify
            (
                {
                    "type":15,
                    "title":"礼包列表",
                    "url":ajaxRecommend.libaoUrl
                }
            )
        );
        return false;
    });
    var $slider = $("#slider");
    $slider.slider({ imgZoom: true, loop: true, viewNum:1 });
    //顶部Slider
    $.ajax(
        {
            url:ajaxRecommend.bannerUrl,
            dataType:'jsonp',
            data:
            {
                "version":userInfo.version,
                "phonetypeName":userInfo.phonetypeName,
                "os_version":userInfo.os_version,
                "imei":userInfo.imei,
                "imsi":userInfo.imsi
            },
            jsonp:'jsonBanner',
            success:function(data)
            {
                $slider.find("img").each(function(i, item)
                {
                    var $item = $(this);
                    $item.attr('lazyload', data[i].resHomePhoto)
                        .data('id', data[i].resId)
                        .data('resName', data[i].resHomeTitle);
                    $item.on('tap', function()
                    {
                        isUxbao && window.uxbao.click(JSON.stringify
                            (
                                {
                                    "type":2,
                                    "url":ajaxRecommend.detailUrl + "?resId=" + $(this).data('id'),
                                    "resId":$(this).data('id'),
                                    "resName":$(this).data('resName')
                                }
                            )
                        );
                        return false;
                    });
                });


            },
            error:function()
            {
                console.log("load banner data error");
            }
        }
    );

    //每日推荐
    $(".recommend-his").on('tap', function()
    {
        isUxbao && window.uxbao.click(JSON.stringify
            (
                {
                    "type":15,
                    "title":"历史推荐",
                    "url":ajaxRecommend.historyUrl
                }
            )
        );
        return false;
    });
    $.ajax(
        {
            url:ajaxRecommend.recommendUrl,
            dataType:'jsonp',
            data:
            {
                "version":userInfo.version,
                "phonetypeName":userInfo.phonetypeName,
                "os_version":userInfo.os_version,
                "imei":userInfo.imei,
                "imsi":userInfo.imsi,
                "resolution":userInfo.resolution,
                "size":1,
                "start_position":1
            },
            jsonp:'jsonDaily',
            success:function(data)
            {
                if(data.state == 1)
                {
                    var $recommend = $("#recommend-game");
                    fillRecommend($recommend, data.product[0]);
                    $recommend.find('.recommend-icon').imglazyload({"urlName":"data-icon"});
                    //添加点击响应函数
                    $recommend.find(".btn").on("tap",function()
                    {
                        btnTapHandler($(this));
                        return false;
                    });
                    $recommend.find(".recommend-info").on('tap', function()
                    {
                        recommendTapHandler($(this));
                        return false;
                    });
                    $.fn.imglazyload.detect();
                }
                else
                {
                    console.log("load failed");
                }
            },
            error:function()
            {
                console.log("load every day recommend data error");
            }
        }
    );
});
