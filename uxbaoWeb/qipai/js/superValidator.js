
(function($){
	$(document).ready(function(){
		$('select[tip],select[check],input[tip],input[check],textarea[tip],textarea[check]').tooltip();
	});
})(jQuery);
var isSubmit = true;
(function($) {

    $.fn.tooltip = function(options){
		var getthis = this;
        var opts = $.extend({}, $.fn.tooltip.defaults, options);

        $('body').append('<table id="tipTable" class="tableTip"><tr><td  class="leftImage"></td> <td class="contenImage" align="left"></td> <td class="rightImage"></td></tr></table>');
         $('body').append('<div id="divs" class="divst"></div>');

        $(document).mouseout(function(){$('#tipTable').hide()});
		$(document).mouseout(function(){$('#divs').hide()});
        this.each(function(){
            if($(this).attr('tip') != '')
            {
            
                $(this).mouseover(function(){
                if($(this).val()==""){
                    $('#tipTable').css({left:$.getLeft(this)+'px',top:$.getTop(this)+'px'});
                    $('.contenImage').html($(this).attr('tip'));
                    $('#tipTable').fadeIn("fast");
                    }else{
                    $('#tipTable').hide();
                   }
                }).keydown(function(){
               $('#tipTable').hide();
               });
               
            }
            if($(this).attr('check') != '')
            {
				
                $(this).focus(function()
				{
                    $(this).removeClass('tooltipinputerr');
                }).blur(function(){
                    if($(this).attr('toupper') == 'true')
                    {
                        this.value = this.value.toUpperCase();
                    }
					if($(this).attr('check') != '')
					{
						
						if($(this).attr('check')=="1")
						{
							
							
							if($(this).attr('value')==null)
							{
								
								$(this).removeClass('tooltipinputerr').addClass('tooltipinputok');
							}else
							{
								
								var thisReg = new RegExp($(this).attr('reg'));
								if(thisReg.test(this.value))
								{
									$(this).removeClass('tooltipinputerr').addClass('tooltipinputok');
								}
								else
								{
									$(this).removeClass('tooltipinputok').addClass('tooltipinputerr');
								}
								
							}
						}
						if($(this).attr('check')=="2")
						{
							var thisReg = new RegExp($(this).attr('reg'));
								if(thisReg.test(this.value))
								{
									$(this).removeClass('tooltipinputerr').addClass('tooltipinputok');
								}
								else
								{
                                   $('#tipTable').css({left:$.getLeft(this)+'px',top:$.getTop(this)+'px'});
                                            $('.contenImage').html($(this).attr('hip'));
                                            $('#tipTable').fadeIn("fast");
									$(this).removeClass('tooltipinputok').addClass('tooltipinputerr');
								}
						}			
					}
                    
                });
            }
        });
        if(opts.onsubmit)
        {
            $('form').submit( function () {
                var isSubmit = true;
                getthis.each(function(){
					if($(this).attr('check')=="1")
						{
							
							
							if($(this).attr('value')==null)
							{
								
								$(this).removeClass('tooltipinputerr').addClass('tooltipinputok');
							}else
							{
								
								var thisReg = new RegExp($(this).attr('reg'));
								if(thisReg.test(this.value))
								{
									$(this).removeClass('tooltipinputerr').addClass('tooltipinputok');
								}
								else
								{   
									$(this).removeClass('tooltipinputok').addClass('tooltipinputerr');
                                 
								}
								
							}
							isSubmit = false;
						}
                    if($(this).attr('check')=="2")
						{
							var thisReg = new RegExp($(this).attr('reg'));
								if(thisReg.test(this.value))
								{
									$(this).removeClass('tooltipinputerr').addClass('tooltipinputok');
								}
								else
								{    
									$(this).removeClass('tooltipinputok').addClass('tooltipinputerr');
									isSubmit = false;
								}
						}	
                });
                return isSubmit;
            } );
        }
    };

    $.extend({
        getWidth : function(object) {
            return object.offsetWidth;
        },

        getLeft : function(object) {
            var go = object;
            var oParent,oLeft = go.offsetLeft;
            while(go.offsetParent!=null) {
                oParent = go.offsetParent;
                oLeft += oParent.offsetLeft;
                go = oParent;
            }
            return oLeft;
        },

        getTop : function(object) {
            var go = object;
            var oParent,oTop = go.offsetTop;
            while(go.offsetParent!=null) {
                oParent = go.offsetParent;
                oTop += oParent.offsetTop;
                go = oParent;
            }
            return oTop + $(object).height()+ 5;
        },

        onsubmit : true
    });
    $.fn.tooltip.defaults = { onsubmit: true };
})(jQuery);


function setIntegeCheck(validatorString)
{  
    gongyong(validatorString,"^[a-z0-9_-]{3,14}$");
}

function setIntegeChecks(validatorString)
{  
    gongyong(validatorString,"^[a-z0-9_-]{3,14}$");

}

function setIntegeCheckss(demo) {

    if ($(demo).val() != "") {
        var reg = /^[a-z0-9A-Z]{4,11}$/;
        if (reg.test($(demo).val())) {
            $(demo).removeClass('tooltipinputerr').addClass('tooltipinputok');
            return true;
        } else {
            $(demo).removeClass('tooltipinputok').addClass('tooltipinputerr');
            return false;
        }
    }
    else {
        $(demo).removeClass('tooltipinputok').addClass('tooltipinputerr');
        return false;
    }
}


function setIntegeCheckssa(demo) {

    if ($(demo).val() != "") {
        var reg = /^[a-zA-Z0-9]{4,11}$/;
        if (reg.test($(demo).val())) {
            $(demo).removeClass('tooltipinputerr').addClass('tooltipinputok');
            return true;
        } else {
            $(demo).removeClass('tooltipinputok').addClass('tooltipinputerr');
            return false;
        }
    }
    else {
        $(demo).removeClass('tooltipinputok').addClass('tooltipinputerr');
        return false;
    }
}

function gongyong(validatorString,zhengzeng) {
    var validatorStrings = "";
    if (validatorString != "") {
        validatorStrings = validatorString.split(":");
        for (i = 0; i < validatorStrings.length; i++) {
            $("#" + validatorStrings[i]).attr("reg",zhengzeng);
        }
    }
}
$(function(){
     $(".btnstts").mouseenter(function () {
        $(this).removeClass("btnstts");
        $(this).addClass("Loginsta");
    }).mouseout(function () {
        $(this).removeClass("Loginsta");
        $(this).addClass("btnstts");
    });
})
function DengLu(demo){

    if ($(demo).val() != "") {
            $(demo).removeClass('tooltipinputerr').addClass('tooltipinputok');
            return true;
    }
    else {
        $('#tipTable').css({ left: $.getLeft(this) + 'px', top: $.getTop(this) + 'px' });
        $('.contenImage').html($(this).attr('tip'));
        $('#tipTable').fadeIn("fast");
        $(demo).removeClass('tooltipinputok').addClass('tooltipinputerr');
        return false;
    }
}

function setUserName(demo) {
      if ($(demo).val() != "") {
          var reg = /^\S{4,10}|[\u4e00-\u9fa5]{2,10}$/;
          if (reg.test($(demo).val())) {
            $(demo).removeClass('tooltipinputerr').addClass('tooltipinputok');
            return true;
        } else {
            $(demo).removeClass('tooltipinputok').addClass('tooltipinputerr');
            return false;
        }
    }
    else {
        $(demo).removeClass('tooltipinputok').addClass('tooltipinputerr');
        return false;
    }

}


function setUserPaw(validatorString) {
   // gongyong(validatorString, "^[a-z0-9]{6,18}$");
      if ($(validatorString).val() != "") {
        var reg = /^[a-z0-9]{6,18}$/;
        if (reg.test($(validatorString).val())) {
            $(validatorString).removeClass('tooltipinputerr').addClass('tooltipinputok');
            return true;
        } else {
            $(validatorString).removeClass('tooltipinputok').addClass('tooltipinputerr');
            return false;
        }
    }
    else {
        $(validatorString).removeClass('tooltipinputok').addClass('tooltipinputerr');
        return false;
    }

}

function setUserPaws(validatorString) {
   // gongyong(validatorString, "^[a-z0-9]{8,18}$");
    if ($(validatorString).val() != "") {
        var reg = /^[a-z0-9]{6,18}$/;
        if (reg.test($(validatorString).val())) {
            $(validatorString).removeClass('tooltipinputerr').addClass('tooltipinputok');
            return true;
        } else {
            $(validatorString).removeClass('tooltipinputok').addClass('tooltipinputerr');
            return false;
        }
    }
    else {
        $(validatorString).removeClass('tooltipinputok').addClass('tooltipinputerr');
        return false;
    }
}

function settxtCompellation(validatorString) {
  
            gongyong(validatorString, "^[\u4E00-\u9FA5]{2,4}$");
}

function settxtCode(validatorString) {
    gongyong(validatorString, "^\d{4}$");
}

function checkCard() {

    if ($("#txtPassPortID").val() != "") {
        num = $("#txtPassPortID").val()

        if (!(/(^\d{15}$)|(^\d{17}([0-9]|X)$)/.test(num))) {
            $("#txtPassPortID").removeClass('tooltipinputok').addClass('tooltipinputerr');
            isSubmit=false;
            return false;
        }

        var len, re;
        len = num.length;
        if (len == 15) {
            re = new RegExp(/^(\d{6})(\d{2})(\d{2})(\d{2})(\d{3})$/);
            var arrSplit = num.match(re);

            var dtmBirth = new Date('19' + arrSplit[2] + '/' + arrSplit[3] + '/' + arrSplit[4]);
            var bGoodDay;
            bGoodDay = (dtmBirth.getYear() == Number(arrSplit[2])) && ((dtmBirth.getMonth() + 1) == Number(arrSplit[3])) && (dtmBirth.getDate() == Number(arrSplit[4]));
            if (!bGoodDay) {
                $("#txtPassPortID").removeClass('tooltipinputok').addClass('tooltipinputerr');
                isSubmit=false;
                return false;
            }
            else {
                var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
                var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
                var nTemp = 0, i;
                num = num.substr(0, 6) + '19' + num.substr(6, num.length - 6);
                for (i = 0; i < 17; i++) {
                    nTemp += num.substr(i, 1) * arrInt[i];
                }
                num += arrCh[nTemp % 11];
                return num;
            }
        }
        if (len == 18) {
            re = new RegExp(/^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/);
            var arrSplit = num.match(re);

            var dtmBirth = new Date(arrSplit[2] + "/" + arrSplit[3] + "/" + arrSplit[4]);
            var bGoodDay;
            bGoodDay = (dtmBirth.getFullYear() == Number(arrSplit[2])) && ((dtmBirth.getMonth() + 1) == Number(arrSplit[3])) && (dtmBirth.getDate() == Number(arrSplit[4]));
            if (!bGoodDay) {
                $("#txtPassPortID").removeClass('tooltipinputok').addClass('tooltipinputerr');
                isSubmit=false;
                return false;
            }
            else {

                var valnum;
                var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
                var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
                var nTemp = 0, i;
                for (i = 0; i < 17; i++) {
                    nTemp += num.substr(i, 1) * arrInt[i];
                }
                valnum = arrCh[nTemp % 11];
                if (valnum != num.substr(17, 1)) {
                    $("#txtPassPortID").removeClass('tooltipinputok').addClass('tooltipinputerr');
                    isSubmit=false;
                    return false;
                }
                $("#txtPassPortID").removeClass('tooltipinputerr').addClass('tooltipinputok');
                isSubmit=true;
                return num;
            }
        }
        isSubmit=false;
        return false;
    } else {
        $("#txtPassPortID").removeClass('tooltipinputok').addClass('tooltipinputerr');
        isSubmit=false;
        return false; 
    }
}


function checkCards(dome) {

    if ($(dome).val() != "") {
        num = $(dome).val()
        if (!(/(^\d{15}$)|(^\d{17}([0-9]|X)$)/.test(num))) {
            $(dome).removeClass('tooltipinputok').addClass('tooltipinputerr');
            isSubmit = false;
            return false;
        }

        var len, re;
        len = num.length;
        if (len == 15) {
            re = new RegExp(/^(\d{6})(\d{2})(\d{2})(\d{2})(\d{3})$/);
            var arrSplit = num.match(re);

            var dtmBirth = new Date('19' + arrSplit[2] + '/' + arrSplit[3] + '/' + arrSplit[4]);
            var bGoodDay;
            bGoodDay = (dtmBirth.getYear() == Number(arrSplit[2])) && ((dtmBirth.getMonth() + 1) == Number(arrSplit[3])) && (dtmBirth.getDate() == Number(arrSplit[4]));
            if (!bGoodDay) {
                $(dome).removeClass('tooltipinputok').addClass('tooltipinputerr');
                isSubmit = false;
                return false;
            }
            else {

                var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
                var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
                var nTemp = 0, i;
                num = num.substr(0, 6) + '19' + num.substr(6, num.length - 6);
                for (i = 0; i < 17; i++) {
                    nTemp += num.substr(i, 1) * arrInt[i];
                }
                num += arrCh[nTemp % 11];
                return num;
            }
        }
        if (len == 18) {
            re = new RegExp(/^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/);
            var arrSplit = num.match(re);

            var dtmBirth = new Date(arrSplit[2] + "/" + arrSplit[3] + "/" + arrSplit[4]);
            var bGoodDay;
            bGoodDay = (dtmBirth.getFullYear() == Number(arrSplit[2])) && ((dtmBirth.getMonth() + 1) == Number(arrSplit[3])) && (dtmBirth.getDate() == Number(arrSplit[4]));
            if (!bGoodDay) {
                $(dome).removeClass('tooltipinputok').addClass('tooltipinputerr');
                isSubmit = false;
                return false;
            }
            else {

                var valnum;
                var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
                var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
                var nTemp = 0, i;
                for (i = 0; i < 17; i++) {
                    nTemp += num.substr(i, 1) * arrInt[i];
                }
                valnum = arrCh[nTemp % 11];
                if (valnum != num.substr(17, 1)) {
                    $(dome).removeClass('tooltipinputok').addClass('tooltipinputerr');
                    isSubmit = false;
                    return false;
                }
                $(dome).removeClass('tooltipinputerr').addClass('tooltipinputok');
                isSubmit = true;
                return num;
            }
        }
        isSubmit = false;
        return false;
    } else {
        $(dome).removeClass('tooltipinputok').addClass('tooltipinputerr');
        isSubmit = false;
        return false;
    }
}


function Shouji() {
    if ($("#TextBox1").val() != "") {
        var reg = /^1[3|4|5|8][0-9]\d{8,8}$/;
        if (reg.test($("#TextBox1").val())) {
            if ($("#TextBox1").hasClass("tooltipinputerr")) {
                $("#TextBox1").removeClass('tooltipinputok').addClass('tooltipinputerr');
                return false;

            } else {
                $("#TextBox1").removeClass('tooltipinputerr').addClass('tooltipinputok');
                return "1";
            }
        } else {
            $("#TextBox1").removeClass('tooltipinputok').addClass('tooltipinputerr');
            return false;
        }
    }
    else {
        $("#TextBox1").removeClass('tooltipinputok').addClass('tooltipinputerr');
        return false;
    }
}

function putong() {
    if ($("#txtAccounts").val() != "") {

            if ($("#txtAccounts").hasClass("tooltipinputerr")) {
                $("#txtAccounts").removeClass('tooltipinputok').addClass('tooltipinputerr');
                return false;
            } else {
                $("#txtAccounts").removeClass('tooltipinputerr').addClass('tooltipinputok');
                return true;
               
            }
       
    }
    else {
        $("#txtAccounts").removeClass('tooltipinputok').addClass('tooltipinputerr');
        return false;
    }
}

function ShouJiBangDing (dome) {
    if ($(dome).val() != "") {
        var reg = /^1[3|4|5|8][0-9]\d{8,8}$/;
        if (reg.test($(dome).val())) {
                $(dome).removeClass('tooltipinputerr').addClass('tooltipinputok');
                return true;
        } else {
            $(dome).removeClass('tooltipinputok').addClass('tooltipinputerr');
            return false;
        }
    }
    else {
        $(dome).removeClass('tooltipinputok').addClass('tooltipinputerr');
        return false;
    }
}


function ShouJiBangDings(dome) {
    if ($(dome).val() != "") {
        var reg = /^1[3|4|5|8][0-9]\d{8,8}$/;
        if (reg.test($(dome).val())) {
            $(dome).removeClass('tooltipinputerr').addClass('tooltipinputok');
            return true;
        } else {
            $(dome).removeClass('tooltipinputok').addClass('tooltipinputerr');
            return false;
        }
    }
    else {
        $(dome).removeClass('tooltipinputok').addClass('tooltipinputerr');
        return true;
    }
}


function UserName(Name) {
    if ($(Name).val() != "") {
        var reg = /^[\u4E00-\u9FA5]{2,5}$/;
        if (reg.test($(Name).val())) {
            $(Name).removeClass('tooltipinputerr').addClass('tooltipinputok');
            return true;
        } else {
            $(Name).removeClass('tooltipinputok').addClass('tooltipinputerr');
            return false;
        }
    }
    else {
        $(Name).removeClass('tooltipinputok').addClass('tooltipinputerr');
        return false;
    }
}

function checkEmail(demo) {
    var regEmail = /\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
    if ($(demo).val() != "") {
        if (!regEmail.test($(demo).val())) {
            $(demo).removeClass('tooltipinputok').addClass('tooltipinputerr');
            return false;
        } else {
            $(demo).removeClass('tooltipinputerr').addClass('tooltipinputok');
     return true;
        }
    } else {
    $(demo).removeClass('tooltipinputok').addClass('tooltipinputerr');
        return false;
    }
}

function RenWuShouji(text1) {
    if ($(text1).val() == "") {
        $(text1).removeClass('tooltipinputok').addClass('tooltipinputerr');
        return false;
    } else {
        var reg = /^1[3|4|5|8][0-9]\d{8,11}$/;
        if (reg.test($(text1).val())) {
            $(text1).removeClass('tooltipinputerr').addClass('tooltipinputok');
            return true;
        } else {
            $(text1).removeClass('tooltipinputok').addClass('tooltipinputerr');
            return false;
        }
    }
}
function RenWuGuDing(text1) {
    if ($(text1).val() == "") {
        $(text1).removeClass('tooltipinputok').addClass('tooltipinputerr');
        return false;
    } else {
        var reg = /^(0(10|2[1-3]|[3-9]\d{2}))?[1-9]\d{6,7}$/;
        if (reg.test($(text1).val())) {
            $(text1).removeClass('tooltipinputerr').addClass('tooltipinputok');
            return true;

        } else {
            $(text1).removeClass('tooltipinputok').addClass('tooltipinputerr');
            return false;

        }
    }
}

function RenWuQQ(text1) {
    if ($(text1).val() == "") {
        $(text1).removeClass('tooltipinputok').addClass('tooltipinputerr');
        return false ;
    } else {
        var reg = /^[1-9]\d{4,10}$/;

        if (reg.test($(text1).val())) {

            $(text1).removeClass('tooltipinputerr').addClass('tooltipinputok');
            return true;
        } else {
            $(text1).removeClass('tooltipinputok').addClass('tooltipinputerr');
            return false;

        }
    }
}







function setDianHua(validatorString) {
      gongyong(validatorString, "^1[3|4|5|8][0-9]\d{4,8}$");
}
function suiji(validatorString) {
    gongyong(validatorString, "^\d{6}$");
}
    function dianhua(text1) {
        if ($(text1).val() == "") {
         $(text1).removeClass('tooltipinputok').addClass('tooltipinputerr');
            return false;
        } else {
            var reg = /^1[3|4|5|8][0-9]\d{8,11}$/;
            if (reg.test($(text1).val())) {
                   $(text1).removeClass('tooltipinputerr').addClass('tooltipinputok');
                    return true;
            } else {
             $(text1).removeClass('tooltipinputok').addClass('tooltipinputerr');
                return false;
            }

        }
    }

    function Mima(demo, demo1,test) {
        if ($(demo).val() == $(demo1).val()) {
            $(demo).removeClass('tooltipinputerr').addClass('tooltipinputok');

            return true;
        }
        else {
            if (test == 1) {
                $('#tipTable').css({ left: $.getLeft(demo) + 'px', top: ($.getTop(demo)) + 'px' });
                $('.contenImage').html($(demo).attr('hip'));
                $('#tipTable').fadeIn("fast");
            }
            $(demo).removeClass('tooltipinputok').addClass('tooltipinputerr');
            return false;
        }
    }

     function checkVerifyCode(demo) {
                if ($(demo).val() != "") {
                    var reg = /^\d{4}$/;
                    if (reg.test($("#txtCode").val())) {
                        $(demo).removeClass('tooltipinputerr').addClass('tooltipinputok');
                        return true;
                    } else {
                        $(demo).removeClass('tooltipinputok').addClass('tooltipinputerr');
                        return false;
                    }
                } else {
                    $(demo).removeClass('tooltipinputok').addClass('tooltipinputerr');
                    return false;
                }
            }

            function checkVerifyCodes(demo) {
                if ($(demo).val() != "") {
                    var reg = /^\d{6}$/;
                    if (reg.test($(demo).val())) {
                        $(demo).removeClass('tooltipinputerr').addClass('tooltipinputok');
                        return true;
                    } else {
                        $(demo).removeClass('tooltipinputok').addClass('tooltipinputerr');
                        return false;
                    }
                } else {
                    $(demo).removeClass('tooltipinputok').addClass('tooltipinputerr');
                    return false;
                }
            }



  $(function(){
   $("#ddlQuestion1").blur(function () {
        WnTi(this, $("#ddlQuestion2"), $("#ddlQuestion3"));
    });
    $("#ddlQuestion2").blur(function () {
        WnTi(this,$("#ddlQuestion1"), $("#ddlQuestion3"));
    });

    $("#ddlQuestion3").blur(function () {
        WnTi(this,$("#ddlQuestion1"),  $("#ddlQuestion2"));
    });

    $("#txtResponse1").blur(function () {
        WnTi(this, $("#txtResponse2"), $("#txtResponse3"));
    });
    $("#txtResponse2").blur(function () {
        WnTi(this, $("#txtResponse1"), $("#txtResponse3"));
    });

   $("#txtResponse3").blur(function () {
        WnTi(this, $("#txtResponse1"), $("#txtResponse2"));
    });


    $("#txtMResponse1").blur(function () {
        WnTi(this, $("#txtMResponse2"), $("#txtMResponse3"));
    });
    $("#txtMResponse2").blur(function () {
        WnTi(this, $("#txtMResponse1"), $("#txtMResponse3"));
    });

    $("#txtMResponse3").blur(function () {
        WnTi(this, $("#txtMResponse1"), $("#txtMResponse2"));
    });
    $(".btnstts").mouseenter(function () {
        $(this).removeClass("btnstts");
        $(this).addClass("Loginsta");
    }).mouseout(function () {
        $(this).removeClass("Loginsta");
        $(this).addClass("btnstts");
    });

});
function YanWnTis() {
        if($("#txtResponse1").val()!=""&&$("#txtResponse2").val()!=""&&$("#txtResponse3").val()!=""){
            WnTi($("#txtResponse1"), $("#txtResponse2"), $("#txtResponse3"));
            WnTi($("#txtResponse2"), $("#txtResponse1"), $("#txtResponse3"));
            WnTi($("#txtResponse3"), $("#txtResponse1"), $("#txtResponse2"));
                 return true;
             } else {
                 $("#txtResponse1").removeClass('tooltipinputok').addClass('tooltipinputerr');
                 $("#txtResponse2").removeClass('tooltipinputok').addClass('tooltipinputerr');
                 $("#txtResponse3").removeClass('tooltipinputok').addClass('tooltipinputerr');
               return false;
            }           
}
function YanWnTi() {
   if($("#txtResponse1").val()!=""&&$("#txtResponse2").val()!=""&&$("#txtResponse3").val()!=""){
            WnTi($("#ddlQuestion1"), $("#ddlQuestion2"), $("#ddlQuestion3"));
             WnTi($("#ddlQuestion2"),$("#ddlQuestion1"), $("#ddlQuestion3"));
             WnTi($("#ddlQuestion3"),$("#ddlQuestion1"),  $("#ddlQuestion2"));
            WnTi($("#txtResponse1"), $("#txtResponse2"), $("#txtResponse3"));
             WnTi($("#txtResponse2"), $("#txtResponse1"), $("#txtResponse3"));
             WnTi($("#txtResponse3"), $("#txtResponse1"), $("#txtResponse2"));
             return true;
         } else {
             $("#txtResponse1").removeClass('tooltipinputok').addClass('tooltipinputerr');
             $("#txtResponse2").removeClass('tooltipinputok').addClass('tooltipinputerr');
             $("#txtResponse3").removeClass('tooltipinputok').addClass('tooltipinputerr');
             return false;
         }
     }
     function YanWnTic() {
         if ($("#txtMResponse1").val() != "" && $("#txtMResponse2").val() != "" && $("#txtMResponse3").val() != "") {
             WnTi($("#ddlQuestion1"), $("#ddlQuestion2"), $("#ddlQuestion3"));
             WnTi($("#ddlQuestion2"), $("#ddlQuestion1"), $("#ddlQuestion3"));
             WnTi($("#ddlQuestion3"), $("#ddlQuestion1"), $("#ddlQuestion2"));
             WnTi($("#txtMResponse1"), $("#txtMResponse23"), $("#txtMResponse3"));
             WnTi($("#txtMResponse2"), $("#txtMResponse1"), $("#txtMResponse3"));
             WnTi($("#txtMResponse3"), $("#txtMResponse1"), $("#txtMResponse2"));
             return true;
         } else {
             $("#txtMResponse1").removeClass('tooltipinputok').addClass('tooltipinputerr');
             $("#txtMResponse2").removeClass('tooltipinputok').addClass('tooltipinputerr');
             $("#txtMResponse3").removeClass('tooltipinputok').addClass('tooltipinputerr');
             return false;
         }
     }

function WnTi(dome1, dome2, dome3) {
    if ($(dome1).val() != 0 && $(dome1).val() != "") {

        if ($(dome1).val() != $(dome2).val() && $(dome1).val() != $(dome3).val()) {
            $(dome1).removeClass('tooltipinputerr').addClass('tooltipinputok');

            isSubmit = true;
            return true;
        } else {
            $('#tipTable').css({ left: $.getLeft(dome1) + 'px', top: $.getTop(dome1) + 'px' });
            $('.contenImage').html($(dome1).attr('hip'));
            $('#tipTable').fadeIn("fast");
            $(dome1).removeClass('tooltipinputok').addClass('tooltipinputerr');
            isSubmit = false;
                return false;
        }
        } else {
            $('#tipTable').css({ left: $.getLeft(dome1) + 'px', top: $.getTop(dome1) + 'px' });
            $('.contenImage').html($(dome1).attr('tip'));
            $('#tipTable').fadeIn("fast");
            $(dome1).removeClass('tooltipinputok').addClass('tooltipinputerr');
            isSubmit = false;
        return false;
    }
}

$(function(){
   
});



function setFloatCheck(validatorString)
{
	var validatorStrings="";
	if(validatorString!="")
	{
		validatorStrings=validatorString.split(":");
		for(i=0;i<validatorStrings.length;i++)
		{
			$("#"+validatorStrings[i]).attr("reg","^[0-9]+\\.[0-9]+$");
		}
	}
}


function setMailCheck(validatorString)
{
	var validatorStrings="";
	if(validatorString!="")
	{
		validatorStrings=validatorString.split(":");
		for(i=0;i<validatorStrings.length;i++)
		{
			$("#"+validatorStrings[i]).attr("reg","^\\w+((-\\w+)|(\\.\\w+))*\\@[A-Za-z0-9]+((\\.|-)[A-Za-z0-9]+)*\\.[A-Za-z0-9]+$");
		}
	}
}


function setZipcodeCheck(validatorString)
{
	var validatorStrings="";
	if(validatorString!="")
	{
		validatorStrings=validatorString.split(":");
		for(i=0;i<validatorStrings.length;i++)
		{
			$("#"+validatorStrings[i]).attr("reg","^\\d{6}$");
		}
	}
}

function setMobileCheck(validatorString)
{
	var validatorStrings="";
	if(validatorString!="")
	{
		validatorStrings=validatorString.split(":");
		for(i=0;i<validatorStrings.length;i++)
		{
			$("#"+validatorStrings[i]).attr("reg","^(12|15)[0-9]{9}$");
		}
	}
}

function setIDCheck(validatorString)
{
	var validatorStrings="";
	if(validatorString!="")
	{
		validatorStrings=validatorString.split(":");
		for(i=0;i<validatorStrings.length;i++)
		{
			$("#"+validatorStrings[i]).attr("reg","^[1-9]([0-9]{14}|[0-9]{17})$");
		}
	}
}

function setUserIDCheck(validatorString)
{
	var validatorStrings="";
	if(validatorString!="")
	{
		validatorStrings=validatorString.split(":");
		for(i=0;i<validatorStrings.length;i++)
		{
			$("#"+validatorStrings[i]).attr("reg","^\\w+$");
		}
	}
}

function setEmptyCheck(validatorString)
{
	
	var validatorStrings="";
	if(validatorString!="")
	{
		validatorStrings=validatorString.split(":");
		for(i=0;i<validatorStrings.length;i++)
		{
			$("#"+validatorStrings[i]).attr("reg",'.*\\S.*');
		}
	}
}

function setChineseCheck(validatorString)
{
	var validatorStrings="";
	if(validatorString!="")
	{
		validatorStrings=validatorString.split(":");
		for(i=0;i<validatorStrings.length;i++)
		{
			$("#"+validatorStrings[i]).attr("reg","^[\\u4E00-\\u9FA5\\uF900-\\uFA2D]+$");
		}
	}
}


function setURLCheck(validatorString)
{
	var validatorStrings="";
	if(validatorString!="")
	{
		validatorStrings=validatorString.split(":");
		for(i=0;i<validatorStrings.length;i++)
		{
			$("#"+validatorStrings[i]).attr("reg","^http[s]?:\\/\\/([\\w-]+\\.)+[\\w-]+([\\w-./?%&=]*)?$");
		}
	}
}

function setTell(validatorString)
{
	var validatorStrings="";
	if(validatorString!="")
	{
		validatorStrings=validatorString.split(":");
		for(i=0;i<validatorStrings.length;i++)
		{
			$("#"+validatorStrings[i]).attr("reg","\\d{3}-\\d{8}|\\d{4}-\\d{7}");
		}
	}
}