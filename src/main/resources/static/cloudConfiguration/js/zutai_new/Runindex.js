//域名
var basePath,hsIcon,line,gifIcon;
var num1=38,num2=38,num3=18,num4=36;
$(function(){
	basePath=$("#basePath").val();
/*	hsIcon = basePath+"/images/zutai_new/offline.png";
 	line = basePath+"/images/zutai_new/line.png";
 	gifIcon = basePath+"/images/zutai_new/alarm.png";*/
 	hsIcon = basePath+"/images/zutai_new/hui.svg";
 	line = basePath+"/images/zutai_new/lv.svg";
 	gifIcon = basePath+"/images/zutai_new/hong.svg";
});
/*** 公共模拟滚动条 ***/
(function($){
	$(window).on("load",function(){
		$("#DataSend-L, #DataSend-RT, #MapData-R").mCustomScrollbar({
			theme:"dark",
			updateOnSelectorChange:true,
		});
	});
})(jQuery);
$(function()
{
	var voiceID = $("#voiceID")[0];
	voiceID.pause();
	$(".Locking").removeClass("Locking");
	//画布切换
	$(document).on("mousedown", ".editNavA", function(e)
	{
		e.preventDefault();//阻止浏览器默认事件
		var key =  e.which;
		var $a = $(e.currentTarget);
		var href = $a.attr("hid");
		if(!/^#/.test(href)) return;
		if($a.hasClass("editNavB")) return;//如果存在程序终止
		$(".editNavB").removeClass("editNavB");//删除前栏目
		$a.addClass("editNavB");//栏目切换
		var anima = $("#editNav").attr("anima");//获取动画id
		function_anima(anima,href);//调用动画方法
		//刷新图表
		$(href).find(".newECharts").each(function()
		{
			var id  = $(this).children(".myECharts").attr("id");
			var myChart = echarts.init(document.getElementById(id));
			myChart.resize();
			
		});
		//刷新地图
		chartArr=[];
		$(href).find(".mapECharts").each(function()
		{
			//var id  = $(this).children(".myECharts").attr("id");
			//map_init(id);
			initialMap($(this));
		});
	});
	//视频调用
	$(".newVideo").each(function()
	{
		var $this = $(this);
		$this.children(".myPlayer").empty();
		var video    = $this.attr("video");
		var myVideo  = "my"+ video +"Player";
		var data1    = $this.attr("data1");
		var data2    = $this.attr("data2");
		var url    = $this.attr("data3");
		var accessToken    = $this.attr("data4");
		if(url&&accessToken){
			$this.children(".myPlayer").append('<div id="'+myVideo+'" class="video-player"></div>');
			setTimeout(function() 
			{
				if(url&&url.indexOf('ezopen')>=0){
					 var decoder = new EZUIKit.EZUIPlayer({
				        id: myVideo,
				        autoplay: true,
				        url: url,
				        accessToken: accessToken,
				        decoderPath: '../js/',
				        width: 1100,
				        height:500,
				        handleError: handleError
				    });
				}
			},500);
		}else{
			$this.children(".myPlayer").append('<video  class="myVideo" id="'+myVideo+'" poster="" controls playsInline webkit-playsinline autoplay><source src="'+data1+'" type="" /><source src="'+data2+'" type="application/x-mpegURL" /></video>');
			setTimeout(function() 
			{
				new_video(myVideo);
			},500);
		}
	})
	function handleError(e) {
		console.log('捕获到错误',e);
//			if(9048 == e.retcode){
//				alert("播放器免费版并发数达到上限，请前往萤石云升级企业版使用多并发能力");
//			}
	}
	//初始化时间
	startTime();

    ymdG();
    ymdP();
    hms();
    week();
    //绑定文本返回值
    backData();
	//打开模态框
	$(document).on("click", ".addModal", function()
	{
		var id = $(this).attr("mid");
		$(".newModal").hide();//关闭所有模态框
		$("."+id).show();
		//刷新图表
		$("."+id).find(".newECharts").each(function()
		{
			var id = $(this).children(".myECharts").attr("id");
			var myChart = echarts.init(document.getElementById(id));
			myChart.resize();
		});
		//刷新地图
		chartArr=[];
		$("."+id).find(".mapECharts").each(function()
		{
			initialMap($(this));
		});
	});
	//关闭模态框
	$(document).on("click", ".newModalNone, .newModaldel", function()
	{
		$(this).parents(".newModal").hide();
	});

	//开关关
	$(document).on("click", ".switchON", function()
	{
		if($(this).parent().attr("isshow")=="yesShow"){

			$(".newModal").css("display","none");
			$(".canvas").css("display","none");
            $(".canvas .IMG").parents(".canvas").css("display","block");
            $(this).parents(".canvas").css("display","block");
            $(this).hide();
            $(this).siblings(".switchOFF").show();
			return false;
		}

		var sensoridtype=$(this).parent().attr("sensoridtype");
		var sensorId=$(this).parent().attr("sensorid");
        var deviceNumber = $(this).parent().attr("deviceid");
        var sensorCode = $(this).parent().attr("sensorid");
		if(sensorId)
		{
			// if(sensoridtype=="2")
			// {
				var newswitch = $(this).parent().attr("newswitch");
				if(newswitch == 1)
				{
					tooltips("当前已设置为禁止操作","Warning");
				}else
				{
					var flag=newSwitchVal(deviceNumber,sensorCode,'00');
					if(flag){	//成功
						$(this).hide();
						$(this).siblings(".switchOFF").show();
                        tooltips("操作成功","Success");


                        for(var i=0;i<$(".myECharts").length;i++){
                        	if($(".myECharts").eq(i).parent().attr("sensorid")==sensorCode){
                        		var id = $(".myECharts").eq(i).attr("id");
                                var necurve = eval("new"+id);
                        		var tim ;
                        		var val =['0'];
                                necurve(id,val,tim);
							}
						}

					}else{
                        tooltips('操作失败',"Warning")
					}
				}
			// }else
			// {
			// 	tooltips("当前为不可操作类型","Warning");
			// }
		}else
		{
			tooltips("未绑定传感器","Warning");
		}








	});
	//开关开
	$(document).on("click", ".switchOFF", function()
	{

        if($(this).parent().attr("isshow")=="yesShow"){
            // $(".newModal").css("display","block");
            $(".canvas").css("display","block");
            $(this).hide();
            $(this).siblings(".switchON").show();
            return false;
        }


		var sensoridtype=$(this).parent().attr("sensoridtype");
		var sensorId=$(this).parent().attr("sensorid");
        var deviceNumber = $(this).parent().attr("deviceid");
        var sensorCode = $(this).parent().attr("sensorid");
        if(sensorId)
		{
		/*	if(sensoridtype=="2")
			{*/
				var newswitch = $(this).parent().attr("newswitch");
				if(newswitch == 1)
				{
					tooltips("当前已设置为禁止操作","Warning");
				}else
				{
					var flag=newSwitchVal(deviceNumber,sensorCode,'01');
					if(flag){	//成功
						$(this).hide();
						$(this).siblings(".switchON").show();
                        tooltips("操作成功","Success");

                        for(var i=0;i<$(".myECharts").length;i++){
                            if($(".myECharts").eq(i).parent().attr("sensorid")==sensorCode){
                                var id = $(".myECharts").eq(i).attr("id");
                                var necurve = eval("new"+id);
                                var tim ;
                                var val =['1'];
                                necurve(id,val,tim);
                            }
                        }
					}else{
						tooltips('操作失败',"Warning")
					}
				}
	/*		}else
			{
				tooltips("当前为不可操作类型","Warning");
			}*/
		}else
		{
			tooltips("未绑定传感器","Warning");
			return;
		}
	});
	//历史数据展开
	$(document).on("click", ".positionCurve", function()
	{
		var sensorIds=$(this).parent(".canvas-con").attr("sensorid");
		layoutSensorFun(sensorIds);
	});
	//历史数据隐藏
	$(document).on("click", "#DataHistory-TD", function()
	{
		$("#DataHistory").animate(
		{
			left:'-105%'
		},function()
		{
			$("#DataHistory").hide();
		});
	});
	//历史数据时间切换
	$(document).on("click", ".DataHistory-timeA", function(e)
	{
		e.preventDefault();
		var key =  e.which;
		var $a = $(e.currentTarget);
		if($a.hasClass("DataHistory-timeB")) return;
		$(".DataHistory-timeB").removeClass("DataHistory-timeB");
		$a.addClass("DataHistory-timeB");
		var flag=$(this).attr("id");
		if(flag=="_day"){
			$("#queryDate").val("1");
		}else if(flag=="_pre"){
			$("#queryDate").val("2");
		}else if(flag=="_cur"){
			$("#queryDate").val("3");
		}else{
			$("#queryDate").val("0");
		}
		var sensorId=$("#DataHistory_position").val();
		loadHistory(sensorId);
	});
	//历史数据传感器切换
	$(document).on("change", "#DataHistory_position", function()
	{
		var sensorId = $(this).val();
		var sensorType=$(this).find("option:selected").attr("stype");	
		if(sensorType!="3"){
			if(sensorType=="7"){
				var token=$(this).find("option:selected").attr("token");	
				var replay=$(this).find("option:selected").attr("replay");	
				getVideo(replay,token);
			}else{
				loadHistory(sensorId);
				var startTime=$("#startTime").val();
				var endTime=$("#endTime").val();
				loadTableData(1,startTime,endTime);
				$("#hisTrail").remove();
				$(".DataHistory-echarts").show();
				$(".DataHistory-data").show();
			}
		}else{
			$(".DataHistory-echarts").hide();
			$(".DataHistory-data").hide();
			var str=loadHistoryTrail(sensorId);
			$("#hisTrail").remove();
			$("#hisChart").append(str);
		}
	});
	//历史数据时间选择
	$('.DataHistoryTime').datetimepicker(
	{
		format: 'yyyy-mm-dd',
		minView: "month",
		clearBtn:true,//清空按钮
	    todayBtn:true,//今天按钮
	    language: 'cn',	//中文
	    autoclose:true	//自动关闭
	});
	//历史数据搜索
	$(document).on("click", "#historySearch", function(e)
	{
		e.preventDefault();
		var startTime=$("#startTime").val();
		var endTime=$("#endTime").val();
		loadTableData(0,startTime,endTime);
	});
	//历史数据导出
	$(document).on("click", "#historyExport", function(e)
	{
		e.preventDefault();
		var startTime=$("#startTime").val();
		var endTime=$("#endTime").val();
		location.href=basePath+"/device/downloadSensorData.htm?sensorId="+$("#DataHistory_position").val()+"&startTime="+startTime+"&endTime="+endTime;
	});
	//字符串类型的传感器历史数据搜索
	$(document).on("click", "#historySearch_str", function(e)
	{
		e.preventDefault();
		var startTime=$("#startTime_str").val();
		var endTime=$("#endTime_str").val();
		loadTableData(0,startTime,endTime);
	});
	//字符串类型的传感器历史数据导出
	$(document).on("click", "#historyExport_str", function(e)
	{
		e.preventDefault();
		var startTime=$("#startTime_str").val();
		var endTime=$("#endTime_str").val();
		location.href=basePath+"/device/downloadSensorData.htm?sensorId="+$("#DataHistory_position").val()+"&startTime="+startTime+"&endTime="+endTime;
	});
	//数据下发展开
	$(document).on("click", ".dataDown", function()
	{
		//获取当前绑定的传感器ID
		var sensorIds=$(this).parent().attr("sensorid");
		if(sensorIds==undefined){
			tooltips("未绑定传感器","Warning");
			return;
		}
		$("#DataSend-con").html('');
		$("#downContent").val('');
		$.ajax({
			url:basePath+"/querySensorsList.htm", 
		 	data:{"sensorIds":sensorIds},
         	type:"POST",
          	success:function (data) {
            var jsonObj = $.parseJSON(data);
			if ('00' == jsonObj.flag) {
				//获取设备名称
				var deviceName=jsonObj.deviceName;
				//获取设备序列号
				var deviceNo=jsonObj.deviceNo;
				$("#downDevice").html(deviceName);
				$("#downDevice").attr("lang",deviceNo);
				//获取传感器信息
				var sensorList=jsonObj.sensorList;
				var str='';
				$.each(sensorList,function(index,obj){
					var sensorId=obj.sensorId;
					var sensorName=obj.sensorName;
					if(index==0){
					  str+='<a href="javascript:;" class="DataSend-LA DataSend-LB downA" lang="'+sensorId+'">'+
								sensorName+
							'</a>';
					}else{
					 str+=  '<a href="javascript:;" class="DataSend-LA downA" lang="'+sensorId+'">'+
								sensorName+
							'</a>';
					}
					$("#downSensors").html(str);
				});
				//显示
				$("#DataSend").show();
				$("#DataSend").animate(
				{
					left:'0'
				});
			} else {
				tooltips(jsonObj.msg,"Error");
	        }
	 	}});
	});	
	//数据下发隐藏
	$(document).on("click", "#DataSendTD, .DataSend-NO", function()
	{
		$("#DataSend").animate(
		{
			left:'-105%'
		},function()
		{
			$("#DataSend").hide();
		});
	});	
	//数据下发传感器切换
	$(document).on("click", ".downA", function(e)
	{
		e.preventDefault();//阻止浏览器默认事件
		if(!$(this).hasClass("DataSend-LB"))
		{
			$("#downSensors .downA").removeClass("DataSend-LB");
			$(this).addClass("DataSend-LB");
		}
		$("#DataSend-con").html('');
	});
	//数据下发发送
	$(document).on("click", "#downOk", function()
	{
		//获取当前绑定的传感器ID
		var objs=$("#downSensors").find(".downA");
		var sensorId='',sensorName;
		$.each(objs,function(index,obj){
			if($(obj).hasClass("DataSend-LB")){
				sensorId=$(obj).attr("lang");
				sensorName=$(obj).text();
				return false;
			}
		});
	     var deviceNo = $("#downDevice").attr("lang");
	     var sendVal =  $("#downContent").val();
	     if("" == sensorId || "" == sendVal){
			 tooltips("未选择传感器或发送数据为空！","Error");
	     }else{
			 $.ajax({url:basePath+"/sendData.htm", 
		         type:"POST",
		           data:{
		              "sensorId" :sensorId,
		              "deviceNo" :deviceNo,
		              "value"  : sendVal
		            },success:function (data) {
		                console.log(data);
			            var jsonObj = $.parseJSON(data);
			            var str='';
						if ('00' == jsonObj.flag) {
							str+=
								'<div class="DataSend-RTA">'+
									'发送数据:('+sensorName+') '+sendVal+'  发送成功！'+
								'</div>';
						} else {
							str+=
								'<div class="DataSend-RTB">'+
									'发送数据:('+sensorName+') '+sendVal+'  发送成功！'+
								'</div>';
				        }
				        $("#DataSend-con").append(str);
			 }});
	     }
	});	
	/*初始化图表*/
	$("#pc-edit").find(".newECharts").each(function()
	{
		initialECharts($(this));
	});
	/*初始化地图*/
	$("#pc-edit").find(".mapECharts").each(function()
	{
		initialMap($(this));
	});
	//文本警告框关闭
	$(document).on("click", "#warningDel", function(){
		
		$(this).hide();
		$('#warningText').animate(
		{
			left:'-105%'
		},function()
		{
			$("#warningShow").show();
			$('#warningText').hide();
		});
	});
	//文本警告框打开
	$(document).on("click", "#warningShow", function(){
		
		$(this).hide();
		$("#warningDel").show();
		$('#warningText').show();
		$('#warningText').animate(
		{
			left:'0'
		});
	});
	$("#warningCheck").removeAttr("disabled");
	$("#warningText").removeAttr("style");
	$("#warningAdd").empty();//清空文本框
	//地图历史实时数据隐藏
	$(document).on("click", "#MapData-TD", function()
	{
		$("#MapData").animate(
		{
			left:'-105%'
		},function()
		{
			$("#MapData").hide();
		});
	});
	
	//页面强制刷新
	$(document).on("click", ".clickRefresh", function(){
		
		window.location.reload(true);
	});
});

/************************************* 提示消息 ****************************************/
function tooltips(test,cla)
{
	$("#tooltips-text").html(test);
	var cla = cla;
	if(cla == "Success")
	{
		cla = "<span style='color:#52c41a'>&#xe63d;</span>"
	}else if(cla == "Error")
	{
		cla = "&#xecec;;"
	}else if(cla == "Warning")
	{
		cla = "<span style='color:#faad14'>&#xe615;</span>"
	}
	$("#tooltips-ico").html(cla);
	$("#tooltips").animate(
	{
		top:'16px'
	},100,function()
	{
		setTimeout(function() 
		{
			$("#tooltips").animate(
			{
				top:'-50'
			},100);
		},3000);
	});
}

/************  初始化图表 *************/
function initialECharts(id)
{
	id.empty();//清空原图表
	var rid = id.parent(".canvas").attr("rid");//获取RID
	var cid = id.attr("curve");
	var myCurve = "my"+cid+"curve";//定义新的图表ID
	var tmp = '<div class="myECharts" id="'+myCurve+'"></div>';//定义新的图表模板
	id.html(tmp);//添加新的图表
	var necurve = eval("newmy"+cid+"curve");
	necurve(myCurve);
}
/************  初始化地图 *************/
function initialMap(id)
{
	id.empty();//清空原地图
	var cid = id.attr("curve");
	var myCurve = "my"+cid+"curve";//定义新的地图ID
	var tmp = '<div class="myECharts" id="'+myCurve+'"></div>';//定义新的地图
	id.html(tmp);//添加新的地图
	var deviceId=id.attr("deviceid");
	console.log('地图=============='+deviceId);
	if(deviceId != undefined){
		search(myCurve,deviceId);
	}else{
		jsTemp10(id);
	}
}
/********** 时间 ***************/
function startTime() 
{  
    var today = new Date();  
    var y = today.getFullYear();  
    var M = today.getMonth()+1;  
    var d = today.getDate();  
    var w = today.getDay();  
    var h = today.getHours();  
    var m = today.getMinutes();  
    var s = today.getSeconds();  
    m = checkTime(m);  
    s = checkTime(s);  
    $("#pc-edit").find('.TimeText').html(y+'-'+M+'-'+d+ ' ' +h+':'+m+':'+ s );
    t = setTimeout(startTime, 500);  
    function checkTime(i) {  
        if (i < 10) {  
            i = "0" + i;  
        }  
        return i;  
    }  
}
/***** 年-月-日 *****/
function ymdG()
{
    var today = new Date();
    var y = today.getFullYear();
    var M = today.getMonth()+1;
    var d = today.getDate();
    var w = today.getDay();
    var h = today.getHours();
    var m = today.getMinutes();
    var s = today.getSeconds();

    M = checkTime(M);
    d = checkTime(d);
    m = checkTime(m);
    s = checkTime(s);
    $("#pc-edit").find('.YmdGText').html(y+'-'+M+'-'+d);
    t = setTimeout(ymdG, 500);
    function checkTime(i) {
        if (i < 10) {
            i = "0" + i;
        }
        return i;
    }
}
/***** 年/月/日 *****/
function ymdP()
{
    var today = new Date();
    var y = today.getFullYear();
    var M = today.getMonth()+1;
    var d = today.getDate();
    var w = today.getDay();
    var h = today.getHours();
    var m = today.getMinutes();
    var s = today.getSeconds();

    M = checkTime(M);
    d = checkTime(d);
    m = checkTime(m);
    s = checkTime(s);
    $("#pc-edit").find('.YmdPText').html(y+'/'+M+'/'+d);
    t = setTimeout(ymdP, 500);
    function checkTime(i) {
        if (i < 10) {
            i = "0" + i;
        }
        return i;
    }
}
/***** 时分秒 *****/
function hms()
{
    var today = new Date();
    var y = today.getFullYear();
    var M = today.getMonth()+1;
    var d = today.getDate();
    var w = today.getDay();
    var h = today.getHours();
    var m = today.getMinutes();
    var s = today.getSeconds();
    m = checkTime(m);
    s = checkTime(s);
    $("#pc-edit").find('.HmsText').html(h+':'+m+':'+ s );
    t = setTimeout(hms, 500);
    function checkTime(i) {
        if (i < 10) {
            i = "0" + i;
        }
        return i;
    }
}
/***** 星期 *****/
function week()
{
    var today = new Date();
    var w = today.getDay();

    var day='';
    switch (w) {
        case 0:
            day = "星期天";
            break;
        case 1:
            day = "星期一";
            break;
        case 2:
            day = "星期二";
            break;
        case 3:
            day = "星期三";
            break;
        case 4:
            day = "星期四";
            break;
        case 5:
            day = "星期五";
            break;
        case 6:
            day = "星期六";
    }

    $("#pc-edit").find('.WeekText').html(day);
    t = setTimeout(week, 500);
}
/***** 返回文本值 *****/
function backData()
{
var thisNum = 0;
var thisNumArr = [];
	for(var j=0;j<$(".canvas").length;j++){
		if($(".canvas").eq(j).attr("rid")=="108" || $(".canvas").eq(j).attr("rid")=="109"){
            thisNumArr.push(j);
			var rid = $(".canvas").eq(j).attr("rid");
			var $this = $(".canvas").eq(j).find(".canvas-con");
            $this.addClass("inputCanvas-con");
				if($this.attr("backdata") && $this.attr("backdata")!="-1"){

					var id = $this.attr("backdata");
                        $.ajax({
                            type:'post',
                            async:true,
                            url:basePath+'/configuration/getTypeValue',
                            data:{
                               id:id
                            },
                            success: function(data)
                            {
                                if(data.state=="success")
                                {
                               switch ($(".canvas").eq(thisNumArr[thisNum]).attr("rid")){
                               	   case "108":
                                       $(".canvas").eq(thisNumArr[thisNum]).find(".canvas-con").text(data.data?data.data:"未设值");
                                       break;
								   case "109":
                                       $(".canvas").eq(thisNumArr[thisNum]).find(".canvas-con").val(data.data?data.data:"未设值");
							   }


                                }else
                                {
                                    switch ($(".canvas").eq(thisNumArr[thisNum]).attr("rid")){
                                        case "108":
                                            $(".canvas").eq(thisNumArr[thisNum]).find(".canvas-con").text('无数据');
                                            break;
                                        case "109":
                                            $(".canvas").eq(thisNumArr[thisNum]).find(".canvas-con").val('无数据');
                                    }

                                    tooltips("获取数据失败！","Warning");
                                }
                                thisNum++;
                            },
                            error:function()
                            {
                                switch ($(".canvas").eq(thisNumArr[thisNum]).attr("rid")){
                                    case "108":
                                        $(".canvas").eq(thisNumArr[thisNum]).find(".canvas-con").text('无数据');
                                        break;
                                    case "109":
                                        $(".canvas").eq(thisNumArr[thisNum]).find(".canvas-con").val('无数据');
                                }
                                tooltips("获取数据失败！","Warning");
                                thisNum++;
                            },
                        });
				}
		}
	}



    // $("#pc-edit").find('.BackText').html('返回文本值');

}



/********** 调用在线直播视频*******/
function new_video(myPlayer)
{
	new EZUIPlayer(myPlayer);
}
/********** 画布切换动画 效果*******/
var new_noneID = "#"+$(".editShow").attr("id");//获取要隐藏ID
function function_anima(anima,href)
{
	var editBolock = "editBolock";//定义临时显示show
	var itme       = "editShow";//定义切换效果
	var noneID = new_noneID;
	//切换动画效果
	switch(anima)
	{
		case "0":
				$(".editShow").removeClass("editShow");
				$(href).addClass("editShow");
			break;
		case "1":
				$(".editNone").removeClass(itme);
				$(".editNone").removeClass(editBolock);
				$(".editNone").removeClass("animated bounceOutRight bounceInLeft");
				$(noneID).addClass(editBolock);
				$(noneID).addClass("animated bounceOutRight");
				$(href).addClass(itme);
				$(href).addClass("animated bounceInLeft");
				new_noneID = href;
			break;
		case "2":
				$(href).addClass(editBolock);
				$(href).addClass("animated editZindex bounceInDown");
				$(href).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function()
				{
					$(noneID).removeClass(itme);
					$(href).removeClass(editBolock).addClass(itme);
					$(href).removeClass("animated editZindex bounceInDown");
				});
				new_noneID = href;
			break;
		case "3":
				$(".editNone").removeClass(itme);
				$(".editNone").removeClass(editBolock);
				$(".editNone").removeClass("animated fadeInLeft fadeOutRight");
				$(noneID).addClass(editBolock);
				$(noneID).addClass("animated fadeOutRight");
				$(href).addClass(itme);
				$(href).addClass("animated fadeInLeft");
				new_noneID = href;
			break;
		case "4":
				$(href).addClass(editBolock);
				$(href).addClass("animated editZindex fadeInDown");
				$(href).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function()
				{
					$(noneID).removeClass(itme);
					$(href).removeClass(editBolock).addClass(itme);
					$(href).removeClass("animated editZindex fadeInDown");
				});
				new_noneID = href;
			break;
		case "5":
				$(href).addClass(editBolock);
				$(href).addClass("animated editZindex flipInX");
				$(href).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function()
				{
					$(noneID).removeClass(itme);
					$(href).removeClass(editBolock).addClass(itme);
					$(href).removeClass("animated editZindex flipInX");
				});
				new_noneID = href;
			break;
		case "6":
				$(href).addClass(editBolock);
				$(href).addClass("animated editZindex flipInY");
				$(href).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function()
				{
					$(noneID).removeClass(itme);
					$(href).removeClass(editBolock).addClass(itme);
					$(href).removeClass("animated editZindex flipInY");
				});
				new_noneID = href;
			break;
		case "7":
				$(href).addClass(editBolock);
				$(href).addClass("animated editZindex slideInLeft");
				$(href).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function()
				{
					$(noneID).removeClass(itme);
					$(href).removeClass(editBolock).addClass(itme);
					$(href).removeClass("animated editZindex slideInLeft");
				});
				new_noneID = href;
			break;
		default:
			tooltips("程序出错！请联系技术支持","Warning");
	};
}
var ismobile="0";
$(function()
{
	var sUserAgent = navigator.userAgent.toLowerCase();
    var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
    var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
    var bIsMidp = sUserAgent.match(/midp/i) == "midp";
    var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
    var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
    var bIsAndroid = sUserAgent.match(/android/i) == "android";
    var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
    var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
    if (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM)
    {
    	ismobile="1";
    	$("body").append('<link rel="stylesheet" href="'+basePath+'/css/zutai_new/mobile.css">');
    	//$("body").append('<link rel="stylesheet" href="/css/zutai_new/mobile.css">');
    	//初始化
    	var width = $("body")[0].scrollWidth;
    	var r = width / $("#pc-center").width();
		$("#pc-center").css(
	   	{
	   		"-webkit-transform":"scale(" + r + ")",
	   		"position":"relative",
	   		"left":"0",
	   		"margin":"0",
	   		"top":"0",
	   		"transform-origin":"0 0",

	   	});
		$(window).resize(function()
	 	{ 
			var width = $("body")[0].scrollWidth;
	    	var r = width / $("#pc-center").width();
			$("#pc-center").css(
		   	{
		   		"-webkit-transform":"scale(" + r + ")",
		   		"position":"relative",
		   		"left":"0",
		   		"margin":"0",
		   		"top":"0",
		   		"transform-origin":"0 0",
		   	});
		});   
    }else
    {
    	ismobile="0";
    	//初始化
    	var width = $("body")[0].scrollWidth;
    	var adap = $("#pc-center").attr("adaption");
		if(adap == "yes")
		{
			var r = width / $("#pc-center").prop('offsetWidth');
			$("#pc-center").css(
		   	{
		   		"transform":"scale(" + r + ")",
		   		"position":"relative",
		   		"left":"0",
		   		"margin":"0",
		   		"top":"0",
		   		"transform-origin":"0 0",
				// "height":$(document).height()
		   	});
		}
    }
    var ua = window.navigator.userAgent.toLowerCase();
    if(ua.match(/MicroMessenger/i) == 'micromessenger')
    {
    	//初始化
    	var width = $("body")[0].scrollWidth;
    	var r = width / $("#pc-center").width();
		$("#pc-center").css(
	   	{
	   		"-webkit-transform":"scale(" + r + ")",
	   		"position":"relative",
	   		"left":"0",
	   		"margin":"0",
	   		"top":"0",
	   		"transform-origin":"0 0",
	   	});
	}
	//一键自适应
	$(document).on("keydown", function(event)
	{
		var key = event.which;
		//初始化
		var width = $("body")[0].scrollWidth -20;
		if (event.ctrlKey && event.keyCode === 90)
		{
			var adap = $("#pc-center").attr("adaption");
			if(adap == "no" || adap == undefined)
			{
				var r = width / $("#pc-center").prop('offsetWidth');
				$("#pc-center").css(
			   	{
			   		"transform":"scale(" + r + ")",
			   		"position":"relative",
			   		"left":"0",
			   		"margin":"0",
			   		"top":"0",
			   		"transform-origin":"0 0",
			   	});
				$("#pc-center").attr("adaption","yes");
			}else
			{
				$("#pc-center").css(
			   	{
			   		"transform":"scale(1)",
			   		"transform-origin":"0 0",
			   	});
				$("#pc-center").attr("adaption","no");
			}
		}
	});
})
