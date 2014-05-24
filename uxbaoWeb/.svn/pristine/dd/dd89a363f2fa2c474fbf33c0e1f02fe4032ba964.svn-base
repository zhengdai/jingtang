var _hmt = _hmt || [];
function doDownload(){
	var appName = $(".list-info").first().find("h2").text();
	_hmt.push(['_trackEvent', 'apk', 'download', appName]);
}
function doDownloadName(appName){
	_hmt.push(['_trackEvent', 'apk', 'download', appName]);
}
//获得请求参数
function GetUrlParameter(paramName) {
            var returnVal = "";
            try {
                var paramUrl = window.location.search;
                //处理长度
                if (paramUrl.length > 0) {
                    paramUrl = paramUrl.substring(1, paramUrl.length);
                    var paramUrlArray = paramUrl.split("&");
                    for (var i = 0; i < paramUrlArray.length; i++) {
                        if (paramUrlArray[i].toLowerCase().indexOf(paramName.toLowerCase()) != -1) {
                            var temp = paramUrlArray[i].split("=");
                            if (temp[0].toLowerCase() == paramName.toLowerCase()) {
                                returnVal = temp[1];
                                break;
                            }
                        }
                    }
                }
            }
            catch (e) { }
            return returnVal;
        } 