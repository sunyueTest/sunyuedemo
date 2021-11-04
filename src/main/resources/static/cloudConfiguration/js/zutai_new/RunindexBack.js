
/******************************对接**********************************************/
//初始化组件颜色
$(function(){

	$(document).on("keydown",function(e){
		e=e||window.event;
		if(e.keyCode==116){//116 是f5按键代码
			window.location.reload();
		}
	});

    $(document).on("blur",".inputCanvas-con",function(e){
        var id = $(this).attr("backdata");
        var value = $(this).val();
        $.ajax({
            url:basePath+"/configuration/save",
            type:"POST",
            async:true,
            data:{
                id:id ,
                value:value,
                flag:1
            },
            success:function (data) {
            	if(data.state=="success"){
                    tooltips("修改成功!","Success");
				}else{
                    tooltips("修改失败!","Warning");
				}

            },
            error:function(){
                tooltips("修改失败!","Warning");
            }
        });


    });




	//超链接
	$(".yun-a").on("click",function(e){
		var pwd=$(this).attr("p");
		if(pwd){
			pwd=Base64.decode(pwd);
			var url=$(this).attr("href");
			$("#yunzutai-pwd").val(pwd);
			$("#yunzutaiForm").attr("action",url);
			if (e && e.preventDefault ) {
                //阻止默认浏览器动作(W3C) 
                e.preventDefault(); 
	        }else{
	            //IE中阻止函数器默认动作的方式 
	            window.event.returnValue = false; 
	            return false;
	        }
			$("#yunzutaiForm").submit();
		}
	});
			
	//非开关型最新数据展示
	var objs=$(".numTest");
	var sensorArr=[];
	$.each(objs,function(index,obj){
		var parent=$(obj).parent();
		if(typeof(parent.attr("sensorid"))!="undefined"){	//绑定了传感器
			var sensorId=parent.attr("sensorid");	//传感器ID
			sensorArr.push(sensorId);
		}
	});
	if(sensorArr!=null&&sensorArr.length>0){
		var sensorIds = sensorArr.join(",");
		$.ajax(//请求传感器名
		{
			type:'POST',
			async:false,
			url:basePath+'/queryBatchLastData.htm',
			data:{"sensorIds":sensorIds},
			success: function(data)
			{
				var json=$.parseJSON(data);
				if(json!=null&&json.flag=="00"){
					var sensorList=json.senLastDataList;
					var objs=$(".numTest");
					$.each(objs,function(index,curObj){
						var parent=$(curObj).parent();
						var sensorId=parent.attr("sensorid");	//传感器ID
						$.each(sensorList,function(index,obj){
							if(sensorId==obj.sensorId){
								var sensorType=obj.sensorType;
								var val='',unit=obj.unit;
								parent.find(".numName").html('');
								if(sensorType=="8"||sensorType=="1"||sensorType=="6"){
									val=obj.val;
									if(sensorType=="1"){
										parent.find(".numName").html(unit);
									}
								}else if(sensorType=="2"||sensorType=="5"){
									val=obj.switcher;
								}else if(sensorType=="3"){
									val=obj.lng+','+obj.lat;
								}
								parent.find(".numTest").html(val);
								if(parent.attr("time")=="1"){
									var updateTime=obj.time;
									parent.find(".updateTime").html(updateTime);
								}
								var status=parent.find(".numState");
								var line=obj.line;
								if(line=="1"){	//在线
									if(typeof(status.attr("coloron"))!="undefined"){//绑定了自定义在线颜色
										status.css("background-color",status.attr("coloron"));
									}else{
										status.css("background-color","#19c9d2");
									}
								}else{	//掉线
									if(typeof(status.attr("coloroff"))!="undefined"){	//绑定了自定义离线颜色
										status.css("background-color",status.attr("coloroff"));
									}else{
										status.css("background-color","#ccc");
									}
								}
								return false;
							}
						});
					});
				}else{
					tooltips(json.msg,"Warning");
				}
			},
			error:function()
			{
				tooltips("请求出错！请联系技术支持","Warning");
			},
		});
	}
	
	//开关型最新数据显示
	objs=$(".switchON");
	var codeArr = [];
	for(var w=0;w<objs.length;w++){
		var parent = $(".switchON").eq(w).parent();
        if(typeof(parent.attr("sensorid"))!="undefined"){	//绑定了传感器
            var sensorId=parent.attr("sensorid");	//传感器ID
            var deviceId=parent.attr("deviceid");	//传感器ID
            var sensorNum = sensorId.substr(deviceId.length);
            $.ajax(//请求传感器名
                {
                    type:'GET',
                    async:false,
                    url:basePath+'/sensor/selTypeList',		//根据设备ID查传感器
                    dataType: 'json',
                    data:{
                        deviceNumber:deviceId
                    },
                    success: function(data)
                    {
                        if(data.state == "success"){
                            var len = data.datas.length;//获取总个数
                            for(var j=0;j<len;j++){
                                for(var p=0;p<objs.length;p++){
                                    if($(".switchON").eq(p).parent().attr("sensorid") == data.datas[j].sensorCode){
                                        if(codeArr.indexOf(p)==-1){ //出现多个按钮重复绑定同一个设备传感器时判断跳过
                                            if(data.datas[j].state==0){
                                                $(".switchON").eq(p).parent().find(".switchON").hide();
                                                $(".switchON").eq(p).parent().find(".switchOFF").show();
                                                codeArr.push(p);
                                                break;
                                            }else{
                                                $(".switchON").eq(p).parent().find(".switchON").show();
                                                $(".switchON").eq(p).parent().find(".switchOFF").hide();
                                                codeArr.push(p);
                                                break;
                                            }
                                        }


                                    }


                                }





                            }
                        }

                    },
                    error:function()
                    {
                        tooltips("获取设备失败","Warning");
                    },
                });
        }
	}











	// $.each(objs,function(index,obj){
	// 	var parent=$(obj).parent();
	// 	if(typeof(parent.attr("sensorid"))!="undefined"){	//绑定了传感器
	// 		var sensorId=parent.attr("sensorid");	//传感器ID
     //        var deviceId=parent.attr("deviceid");	//传感器ID
	// 		var sensorNum = sensorId.substr(deviceId.length);
	// 		$.ajax(//请求传感器名
	// 		{
	// 			type:'GET',
	// 			async:false,
     //            url:basePath+'/sensor/selTypeList',		//根据设备ID查传感器
     //            dataType: 'json',
     //            data:{
     //                deviceNumber:deviceId
     //            },
	// 			success: function(data)
	// 			{
	// 				if(data.state == "success"){
     //                    var len = data.datas.length;//获取总个数
     //                    for(var j=0;j<len;j++){
     //                        if(sensorId == data.datas[j].sensorCode){
     //                            if(data.datas[j].state==0){
     //                                parent.find(".switchON").hide();
     //                                parent.find(".switchOFF").show();
     //                                break;
     //                            }else{
     //                                parent.find(".switchON").show();
     //                                parent.find(".switchOFF").hide();
     //                                break;
     //                            }
     //                        }
     //                    }
	// 				}
    //
	// 			},
	// 			error:function()
	// 			{
	// 				tooltips("请求出错！请联系技术支持","Warning");
	// 			},
	// 		});
	// 	}
	// });



    //设备状态数据显示
            $.ajax(//请求传感器名
                {
                    type:'post',
                    async:false,
                    url:basePath+'/deviceManage/getDeviceList',
                    data:{
                        page:1,
                        limit:500
                    },
                    success: function(data)
                    {
                        objs=$(".deviceOnLine");
                        var len = data.data.length;//获取总个数
                        for(var i=0;i<objs.length;i++){
                        	for(var j=0;j<len;j++){
                                var parent=$(objs).eq(i).parent();
                                if(typeof(parent.attr("deviceid"))!="undefined"){//绑定了设备
                                    var deviceId=parent.attr("deviceid");	//传感器ID

                                    if(deviceId == data.data[j].deviceNumber){
                                        if(data.data[j].onLineState==0){
                                            parent.find(".deviceOnLine").hide();
                                            parent.find(".deviceOffLine").show();
                                            break;
                                        }else{
                                            parent.find(".deviceOnLine").show();
                                            parent.find(".deviceOffLine").hide();
                                            break;
                                        }
                                    }

								}

							}
						}
                    },
                    error:function()
                    {
                        tooltips("请求出错！请联系技术支持","Warning");
                    },
                });







	//曲线最新数据展示
	objs=$(".newECharts");
		if(objs.length>0){
			var d = new Date();
            var nowMs = d.getTime();//获取当前时间的毫秒数
            var beforeMs =  nowMs -  1000 * 60 * 60 * 24 * parseInt(7);//前几天，n就取几，整数
            var beforeDate = new Date(beforeMs);
            if(beforeDate.getMonth()+1>=10){
            		if(beforeDate.getDate()>=10){
                     var  startTime = beforeDate.getFullYear()+'-'+(beforeDate.getMonth()+1)+'-'+beforeDate.getDate()+" " + "00:00:00";
					}else{
                        var  startTime = beforeDate.getFullYear()+'-'+(beforeDate.getMonth()+1)+'-'+ "0" +beforeDate.getDate()+" " + "00:00:00";
					}
			}else{
                if(beforeDate.getDate()>=10){
                    var  startTime = beforeDate.getFullYear()+'-'+ '0' +(beforeDate.getMonth()+1)+'-'+beforeDate.getDate()+" " + "00:00:00";
                }else{
                    var  startTime = beforeDate.getFullYear()+'-'+ '0' +(beforeDate.getMonth()+1)+'-'+ "0" +beforeDate.getDate()+" " + "00:00:00";
                }
			}

            if(d.getMonth()+1>=10){
                if(d.getDate()>=10){
                    var  endTime = d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate()+" " + "23:59:59";
                }else{
                    var  endTime = d.getFullYear()+'-'+(d.getMonth()+1)+'-'+ "0" +d.getDate()+" " + "23:59:59";
                }
            }else{
                if(d.getDate()>=10){
                    var  endTime = d.getFullYear()+'-'+ '0' +(d.getMonth()+1)+'-'+d.getDate()+" " + "23:59:59";
                }else{
                    var  endTime = d.getFullYear()+'-'+ '0' +(d.getMonth()+1)+'-'+ "0" +d.getDate()+" " + "23:59:59";
                }
            }

    var idNum = 0;

		for(var w=0;w<objs.length;w++){
            var parent= objs.eq(w);
            var id    = objs.eq(w).find(".myECharts").attr("id");
            var devictType =  parent.attr("devicetype");//设备类型
            var deviceid = parent.attr("deviceid");//设备ID
            var sensorIds=parent.attr("sensorid");	//传感器ID
            var sensorName = parent.attr("sensorName");	//传感器名称
            if(typeof(parent.attr("sensorid"))!="undefined"){	//绑定了传感器

                if(devictType=="2"){
                    $.ajax(//请求传感器名
                        {
                            type:'GET',
                            async:true,
                            url:basePath+'/sensor/selTypeList',		//根据设备ID查传感器
                            dataType: 'json',
                            data:{
                                deviceNumber:deviceid
                            },
                            success: function(data)
                            {
                                if(data.state =="success"){
                                    if(data.datas.length>0){
                                        var len = data.datas.length;
                                        var max =0;
                                        var tim;
                                        for(var j=0;j<data.datas.length;j++){
                                            if(data.datas[j].sensorCode ==$(".newECharts").eq(idNum).attr("sensorid") ||data.datas[j].id ==$(".newECharts").eq(idNum).attr("sensorid")){
                                                if(data.datas[j].state==0){
                                                    var val = ['0'];
                                                    var necurve = eval("new"+$(".newECharts").eq(idNum).find(".myECharts").attr("id"));
                                                    necurve(id,val,tim);
                                                    break;
                                                }else{
                                                    var val = ['1'];
                                                    var necurve = eval("new"+$(".newECharts").eq(idNum).find(".myECharts").attr("id"));
                                                    necurve(id,val,tim);
                                                    break;
                                                }
                                                max++;
                                                if(max==len){

                                                }
                                            }
                                        }
                                    }

                                    idNum++;
                                }else{
                                    tooltips(json.msg,"Warning");
                                    idNum++;
                                }
                            },
                            error:function()
                            {
                                tooltips("请求出错！请联系技术支持","Warning");
                            },
                        });
                }else{
                    $.ajax(//请求传感器名
                        {
                            type:'POST',
                            async:false,
                            url:basePath+'/monitor/getSensorCustomReport',
                            data:{deviceNumber:deviceid,
                                startTime:startTime,
                                endTime:endTime
                            },
                            success: function(data)
                            {
                                if(data.success==true){
                                    var res = data.data;
                                    var keyArr = Object.keys(res);
                                    if(keyArr.length>0) {
                                        keyArr.remove('type');
                                        var newKeyArr = [];
                                        for (var w = 0; w < keyArr.length; w++) {
                                            if (keyArr[w] != "type") {
                                                newKeyArr.push(keyArr[w].split("-")[1]);
                                            }
                                        }
                                        var lastObj = {};
                                        for (var m = 0; m < keyArr.length; m++) {
                                            var nKey = newKeyArr[m];
                                            var nVal = keyArr[m];
                                            lastObj[nKey] = res[nVal];
                                        }

                                        var dataList = [];
                                        var sensorNameArr = sensorName.split(",");
                                        for(var j=0;j<sensorNameArr.length;j++){
                                            var sensorNumber = [];
                                            for(var q=0;q<lastObj[sensorNameArr[j]].length;q++){

                                                sensorNumber.push(Number(lastObj[sensorNameArr[j]][q]));
                                            }




                                            dataList.push(sensorNumber);
                                        }

                                        var timeArr = [];
                                        for(var w=0;w<7;w++){
                                            var d = new Date();
                                            if(w<1){
                                                var xA = (d.getMonth()+1) + '-'+ d.getDate();
                                                timeArr.unshift(xA);
                                            }else{
                                                var fixDay = new Date(d.getTime() - w*1000*60*60*24);
                                                var xA = (fixDay.getMonth()+1) + '-'+ fixDay.getDate();
                                                timeArr.unshift(xA);
                                            }
                                        }


                                        var necurve = eval("new"+id);
                                        necurve(id,dataList,timeArr);




                                    }




                                }else{
                                    tooltips("请求出错！请联系技术支持","Warning");
                                }

                            },
                            error:function()
                            {
                                tooltips("请求出错！请联系技术支持","Warning");
                            },
                        });
                }

            }


		}


		}


	
});
var warningCheck = 0;
$(function()
{
	$(document).on("click", "#warningCheck", function()
	{
		if($(this).is(':checked'))
		{
			warningCheck = 1;
		}else
		{
			warningCheck = 0;
		}
	})
})
//报警全局数组
var alarmArr=[];
var triggerArr;
var alarmObj,alarmStr,alarmFlag,count;
//报警样式
function triggerFun(parent,id,time){
	//获取触发器ID
	var triggerIds=parent.attr("triggerid");
	//获取报警设置
	var warns=parent.attr("warningarr");
	if(triggerIds!=undefined&&warns!=undefined){
		var str=warns.split(",");
		var textWarn=str[0];	//文本报警设置
		var statusWarn=str[1];	//状态报警设置
		var voiceWarn=str[2];	//声音报警设置
		if(textWarn!=0)
		{
			alarmFlag=false;
			if(alarmArr!=null&&alarmArr.length>0){
				for(var i=0;i<alarmArr.length;i++){
					var obj=alarmArr[i];
					if(obj.id==id){
						alarmFlag=true;
						triggerArr=obj.triggerArr;	//获取当前画布的触发器数组
						break;
					}
				}
			}
			if(!alarmFlag){	//当前画布没触发器数组，则创建一个新的
				triggerArr=[];
			}
			alarmStr='';
			count=0;
			alarmFlag=false;
			//验证当前画布中的组件绑定的触发器ID是否存在数组中
			if(triggerArr!=null&&triggerArr.length>0){
				for(var i=0;i<triggerArr.length;i++){
					var obj=triggerArr[i];
					if(obj.alarmIds==triggerIds){	//当前画布某个组件的触发器ID和报警的触发器ID一样
						alarmFlag=true;
						count=obj.count;	//获取当前画布某个组件的触发器ID数量
						alarmStr=obj.alarmContent;	//获取当前画布某个组件的触发器内容
						break;
					}
				}
			}
			if(!alarmFlag){	//组件第一次
//				console.log("组件第一次："+triggerIds);
				$.ajax(//请求传感器名
				{
					type:'POST',
					async:false,
					url:basePath+'/queryTriggerStr.htm',
					data:{"triggerIds":triggerIds},
					success: function(data)
					{
						var json=$.parseJSON(data);
						if(json.flag=="00"){
							alarmFlag=true;
							var arr=json.content.split(",");
							for(var i=0;i<arr.length;i++){
								count++;
								alarmStr+=
								'<div class="warningList">'+
									arr[i]+
								'</div>';
							}
							var triggerObj={"alarmIds":triggerIds,"alarmContent":alarmStr,"count":count};
							triggerArr.push(triggerObj);
							alarmObj={"id":id,"triggerArr":triggerArr};
							alarmArr.push(alarmObj);
						}
					},
					error:function()
					{
						tooltips("请求出错！请联系技术支持","Warning");
					},
				});
			}else{	//组件非第一次
//				console.log("组件非第一次："+triggerIds);
			}
			if(alarmFlag){
				alarmStr=alarmReplace(alarmStr,time,count);
//				console.log('截取后：'+alarmStr);
				$("#warningAdd").append(alarmStr);
				if(warningCheck == 0)
				{
					if($('#warningText').css("display") == "none")
					{
						$("#warningDel").show();
						$("#warningShow").hide();
						$('#warningText').show();
						$('#warningText').animate(
						{
							left:'0'
						});
					}
				}
			}	
		}
		if(statusWarn!=0){
			parent.addClass(statusWarn);
		}
		if(voiceWarn!=0){
			$("#voiceID").html('<source src="'+basePath+"/images/zutai_new/voice/"+voiceWarn+'" type="audio/mpeg">');
			var voiceID = $("#voiceID")[0];
			voiceID.load();
		}
	}
}
//报警内容时间替换
function alarmReplace(content,curTime,count){
	for(var i=0;i<count;i++){
		content=content.replace("[time]",curTime);
	}
	return content;
}	
//开关下发
function newSwitchVal(deviceNumber,sensorCode,_switch){

	var censorNum = sensorCode.substr(deviceNumber.length);
	 var flag="";
   var userKey = $("#userKey").val();
	 $.ajax({url:basePath+"/aquacultureUserSensor/sendCommand",
       type:"POST",
       async:false,
         data:{
             sensorCode: sensorCode,
             deviceNumber: deviceNumber,
             command: getIndex(censorNum,_switch)
          },
         success:function (data) {

			if (data.state == "success") {
				flag=true;
			} else {
				flag=false;
	        }
	 }});
	 return flag;
}

function switchVal(sensorId, _switch,userKey) {
      $.ajax({
          url: basePath+"/device/sendSwitchVal.htm",
          type: "POST",
          data: {
              "deviceNo": '',
              "sensorId": sensorId,
              "userKey" : userKey,
              "value": _switch
          },
          success: function (data) {
              var jsonObj = $.parseJSON(data);
              if ('00' == jsonObj.flag) {
                  if (1 == _switch) {
                       $("#swopen_" + sensorId).show();
		                 $("#swclose_" + sensorId).hide();
                  } else {
                       $("#swopen_" + sensorId).hide();
		                 $("#swclose_" + sensorId).show();
                  }
              } else {
                 // alert(jsonObj.msg);
              }
          }
      });
}

	/**
	* 时间对象的格式化
	*/
	Date.prototype.format = function(format)
	{
		/*
		* format="yyyy-MM-dd hh:mm:ss";
		*/
		var o = {
		"M+" : this.getMonth() + 1,
		"d+" : this.getDate(),
		"h+" : this.getHours(),
		"m+" : this.getMinutes(),
		"s+" : this.getSeconds(),
		"q+" : Math.floor((this.getMonth() + 3) / 3),
		"S" : this.getMilliseconds()
		}
		 
		if (/(y+)/.test(format))
		{
		format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4
		- RegExp.$1.length));
		}
		 
		for (var k in o)
		{
		if (new RegExp("(" + k + ")").test(format))
		{
		format = format.replace(RegExp.$1, RegExp.$1.length == 1
		? o[k]
		: ("00" + o[k]).substr(("" + o[k]).length));
		}
		}
		return format;
	}

	
//加载历史数据曲线页面
function loadHistory(sensorId){
  var queryDate;
  var m="";
  /* 折线图相关 */
	var datas = [];
	var times = [];
	var tmpDate = new Date();
  premonth = tmpDate.getMonth();    //前一月
  if(premonth == '0'){
  	premonth = 12;
  }
	month = tmpDate.getMonth() + 1 ;  //当前月
  queryDate = $("#queryDate").val();
  var sname=$("#DataHistory_position").find("option:selected").text();
	$("#_pre").html(premonth+"月");
	$("#_cur").html(month+"月");
	$("#_pre").attr("title",premonth+"月份");
	$("#_cur").attr("title",month+"月份");
	$("#_pre").attr("dir",premonth);
	$("#_cur").attr("dir",month);
	var objs=$("#hisChart").find(".DataHistory-timeA");
	$.each(objs,function(index,obj){
		if($(obj).hasClass("DataHistory-timeB")){
			m=$(obj).attr("dir");
			console.log(m);
			return;
		}
	});
	//查询路径
  var qUrl = basePath+"/device/querySensorHistory.htm";
  var data = {sensorId:sensorId,queryDate:queryDate,m:m};
  $.getJSON(qUrl,data,function(json) {	
		var flag = json.flag;
		var msg = json.msg;
		if(flag == "00"){
			console.log(json.dataList.length);
			$.each(json.dataList,function(index){
				var updateTime = json.dataList[index][0];
				updateTime = updateTime.replace(/-/g,"/");
				var date = new Date(updateTime);
				date=new Date(date.getTime()-1000*60*60*8);
				updateTime=date.format("yyyy-MM-dd hh:mm:ss");
				var val = json.dataList[index][1];
				datas.push(Number(val));
				times.push(updateTime);
			});
	    }
	 	//历史数据曲线
		var DataHistoryEcharts = echarts.init(document.getElementById("DataHistoryEcharts"));
		var option = 
		{
			tooltip:
			{
				trigger: "axis"
			},
			grid:
			{
				top:"30px",
				left: "3%",
				right: "4%",
				bottom: "50px",
				containLabel: true
			},
			toolbox:
			{
				feature:
				{
					saveAsImage:{}
				}
			},
			xAxis:
			{
				type: "category",
				boundaryGap: false,
				data: times
			},
			yAxis: [
			{
				type: "value",
				min: "dataMin",
				max: "dataMax",
				axisLabel:
				{
					formatter: function(value, index)
					{
						return toDecimal(value, 4);
					}
				}
			}],
			dataZoom: [
			{
				startValue: null
			},
			{
				type: "inside"
			}],
			series: [
			{
				name: sname,
				type: "line",
				smooth: true,
				data: datas
			}]
		};
		DataHistoryEcharts.setOption(option);
		DataHistoryEcharts.resize();
  });
}



	function loadTableData(page,startTime,endTime){
		 var sensorId=$("#DataHistory_position").val();
		 $.ajax({
			 	url:basePath+"/device/querySensorDataDetail.htm", 
	            type:"POST",
	            data:{
		            sensorId:sensorId,
		            page:page,
		            startTime:startTime,
		            endTime:endTime,
		            deviceId:"",
		            rowCount:""
         		},
        		success:function (data){
			        var jsonData =  $.parseJSON(data);
					var html = '<div class="DataHistoryTr DataHistoryTrC">'+
									'<div class="DataHistoryTd">'+
										'数据'+
									'</div>'+
									'<div class="DataHistoryTd">'+
										'更新时间'+
									'</div>'+
								'</div>';
					$(".DataHistoryPage").hide();
					if(jsonData.flag == "00"){
						if(jsonData.dataList.length > 0){
							for(var i = 0;i < jsonData.dataList.length;i++){
								var val = "";
								if(jsonData.dataList[i].t_sensorTypeId == "1" || jsonData.dataList[i].t_sensorTypeId == "6"){
									val = jsonData.dataList[i].t_val;
								}else if(jsonData.dataList[i].t_sensorTypeId == "2" || jsonData.dataList[i].t_sensorTypeId == '5'){  //开关型
									val = jsonData.dataList[i].t_switcher;
								}else if(jsonData.dataList[i].t_sensorTypeId == "4"){  //图片型
								   	val = "<img src='"+jsonData.dataList[i].t_val+"' width='30px' height='30px' onclick='attrImg(this)' style='cursor: hand'  />";
								}
								if(val == ""){
									val = jsonData.dataList[i].t_val;
								}
								html+=
								'<div class="DataHistoryTr">'+
									'<div class="DataHistoryTd">'+
										val+
									'</div>'+
									'<div class="DataHistoryTd">'+
										jsonData.dataList[i].t_addTime+
									'</div>'+
								'</div>';
							}
							$(".DataHistoryPage").html(generateTablePagination(parseInt(jsonData.page),parseInt(jsonData.totalPage),startTime,endTime));
							$(".DataHistoryPage a").click(function(){
								var index = $(this).attr('index');	
								loadTableData(index,startTime,endTime);
							});
							$(".DataHistoryPage").show();
						}		
					}else if(jsonData.flag == "08"){
						alert("查询区间必须小于等于1个月");
						return false;
					}	
					$('.DataHistoryTab').html(html);
		  		}
		});	
	}

	//分页
	function generateTablePagination(page,totalPage,startTime,endTime){
		if(totalPage > 0){
			var pageHtml = '';
			//到首页
			pageHtml += '<a href="javascript:;" index="1" class="DataHistoryPageA">'+
							'首页'+
						'</a>';
			if(page > 1){		
				//到上一页
				pageHtml += '<a href="javascript:;" index="'+(page-1)+'" class="DataHistoryPageA">'+
								'上一页'+
							'</a>';
			}
			var beginPage = page - 3 < 1 ? 1 : page - 3;
			if (beginPage <= totalPage) {
				var i = beginPage;
				for (var j = 0; (i <= totalPage) && (j < 6); j=j+1) {
					if (i == page) {
						pageHtml += 
						'<a href="javascript:;" index="'+i+'" class="DataHistoryPageNA DataHistoryPageNB">'+
							i+
						'</a>';
					} else {
						pageHtml += 
						'<a href="javascript:;" index="'+i+'" class="DataHistoryPageNA">'+
							i+
						'</a>';
					}
					i=i+1;
				}
			}
			if(page < totalPage){
				//到上一页
				pageHtml += '<a href="javascript:;" index="'+(page+1)+'" class="DataHistoryPageA">'+
								'下一页'+
							'</a>';
			}
			pageHtml += '<a href="javascript:;" index="'+totalPage+'" class="DataHistoryPageA">'+
								'末页'+
						'</a>';
			return pageHtml;
		}
		return '';
	}
//加载历史数据列表
function loadHistoryList(sensorId){
	var time = new Date().Format("yyyy-MM-dd");
	$("#startTime").val(time);
	$("#endTime").val(time);
	$("#startTime_str").val(time);
	$("#endTime_str").val(time);
	loadTableData(1,time,time);
}
//加载历史轨迹
function loadHistoryTrail(sensorId){
	 return '<iframe id="hisTrail" src="'+basePath+'/historyLnglat.htm?sensorId='+sensorId+'" style="width:100%;height:100%;border:none;padding-left:5px;"></iframe>';
}
//布局设备传感器
function layoutSensorFun(sensorIds){
		//获取当前绑定的传感器ID
		if(sensorIds==undefined){
			tooltips("未绑定传感器","Warning")
			return;
		}
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
				$("#hisDevice").html(deviceName);
				$("#hisDevice").attr("lang",deviceNo);
				//获取传感器信息
				var sensorList=jsonObj.sensorList;
				var chooseSensorId="";	//默认传感器
				var sensorType="";
				$("#DataHistory_position").html('');
				var replay='',token=jsonObj.ysAccessToken;
				$.each(sensorList,function(index,obj){
					var sensorId=obj.sensorId;
					var sensorName=obj.sensorName;
					var str = '';
					if(index==0)
					{
						chooseSensorId=sensorId;
						sensorType=obj.sensorType;
					  	str = '<option value="'+sensorId+'" selected stype="'+sensorType+'" replay="'+obj.replay+'" token="'+jsonObj.ysAccessToken+'">'+
			  					sensorName+
			  				'</option>';
					  	if(sensorType=="7"){
					  		replay=obj.replay;
					  	}
					}else{
						str = '<option value="'+sensorId+'" stype="'+obj.sensorType+'" replay="'+obj.replay+'" token="'+jsonObj.ysAccessToken+'">'+
			  					sensorName+
			  				  '</option>';
					}
					$("#DataHistory_position").append(str);
				});
				//显示
				$("#DataHistory").show();
				$("#DataHistory").animate(
				{
					left:'0'
				});
				if(chooseSensorId!=""){
					$(".dataTypeIs").removeClass("dataTypeIs");
					if(sensorType!="3"){
						if(sensorType == 7){//视频类型
							$("#dataVideo").addClass("dataTypeIs");
							getVideo(replay,token);
						}else if(sensorType == 8){//字符串类型
							$("#dataString").addClass("dataTypeIs");
							loadHistoryList(chooseSensorId);
						}else{//普通类型
							$("#dataOrdinary").addClass("dataTypeIs");
							//加载第一个传感器曲线和列表
							loadHistory(chooseSensorId);
							loadHistoryList(chooseSensorId);
						}
					}else{
						$("#dataMap").addClass("dataTypeIs");
						//加载经纬度地图
						var str=loadHistoryTrail(chooseSensorId);
						$("#hisTrail").remove();
						$("#dataMap").append(str);
					}
				}
			} else {
				tooltips(jsonObj.msg,"Error");
	        }
	 	}});
}

function getVideo(replay,token){
	var url=basePath+"/device/yunVideoReplay.htm?replay="+replay+"&token="+token;
	$("#dataVideo").html('<iframe src="'+url+'" frameborder="no" border="0" style="width:799px;height:600px;"></iframe>');
}

//地图
function jsTemp10(id)
{
	var ID  = id.children(".myECharts").attr("id");//获取图表ID	
	var map = new BMap.Map(ID); // 创建Map实例
	map.setMapStyle({
		styleJson:[
		 {
                  "featureType": "background",
                  "elementType": "all",
                  "stylers": {
                            "color": "#eef1f3ff"
                  }
        },
        {
                  "featureType": "local",
                  "elementType": "all",
                  "stylers": {
                            "color": "#ffffffff"
                  }
        },
        {
                  "featureType": "administrative",
                  "elementType": "labels.text.stroke",
                  "stylers": {
                            "lightness": 100
                  }
        },
        {
                  "featureType": "highway",
                  "elementType": "geometry",
                  "stylers": {
                            "color": "#f1c232ff",
                            "weight": "0.1"
                  }
        },
        {
                  "featureType": "subway",
                  "elementType": "geometry",
                  "stylers": {
                            "color": "#b6d7a8ff",
                            "weight": "0.1",
                            "lightness": 50
                  }
        },
        {
                  "featureType": "subway",
                  "elementType": "geometry",
                  "stylers": {
                            "color": "#6aa84fff",
                            "weight": "0.3"
                  }
        },
        {
                  "featureType": "water",
                  "elementType": "all",
                  "stylers": {
                            "color": "#cfe2f3ff"
                  }
        },
        {
                  "featureType": "green",
                  "elementType": "all",
                  "stylers": {
                            "color": "#6aa84fff",
                            "lightness": 60
                  }
        },
        {
                  "featureType": "land",
                  "elementType": "all",
                  "stylers": {
                            "lightness": 30
                  }
        },
        {
                  "featureType": "building",
                  "elementType": "all",
                  "stylers": {}
        },
        {
                  "featureType": "arterial",
                  "elementType": "all",
                  "stylers": {
                            "color": "#ffd966ff",
                            "weight": "0.1",
                            "lightness": 50
                  }
        }
]
	});
  var point1 = new BMap.Point(113.855412, 22.605802); //地图中心点
  map.centerAndZoom(point1, 6); // 初始化地图,设置中心点坐标和地图级别。
  map.enableScrollWheelZoom(true); //启用滚轮放大缩小
  //地图、卫星、混合模式切换
  map.addControl(new BMap.MapTypeControl({
      mapTypes: [BMAP_NORMAL_MAP, BMAP_SATELLITE_MAP, BMAP_HYBRID_MAP]
  }));
 
  //向地图中添加缩放控件
  var ctrlNav = new window.BMap.NavigationControl({
      anchor: BMAP_ANCHOR_TOP_LEFT,
      type: BMAP_NAVIGATION_CONTROL_LARGE
  });
  map.addControl(ctrlNav);
  //向地图中添加缩略图控件
  
  var ctrlOve = new window.BMap.OverviewMapControl({
      anchor: BMAP_ANCHOR_BOTTOM_RIGHT,
      isOpen: 1
  });
  map.addControl(ctrlOve);
  //向地图中添加比例尺控件
  var ctrlSca = new window.BMap.ScaleControl({
      anchor: BMAP_ANCHOR_BOTTOM_LEFT
  }); 
  map.addControl(ctrlSca); 
}

var chartArr=[];	//图表数组
var markerArr = null;
var deviceArr = null; //设备数组
var marker = null; //存放标注点对象的数组
var point = null; //存放标注点经纬信息的数组
var map;
function search(container,deviceIds){
  deviceArr = new Array();
  marker = new Array();
  point = new Array();
  markerArr = new Array();
  $.ajax({
      type: "post",
      async:true,
      url: basePath+"/queryDeviceGps.htm",
      data:{'deviceIds':deviceIds},
      success: function (data) {
          var jsonObj = $.parseJSON(data);
          if ("00" == jsonObj.flag) { //有数据
              var dataObj = eval(jsonObj.deviceList);
              for (var i = 0; i < dataObj.length; i++) {
              	markerArr[i] = dataObj[i];
              }
              map_init(container);
          }
      }
  });
}

function map_init(container) {
  map = new BMap.Map(container); // 创建Map实例
  map.setMapStyle({
		styleJson:[
		 {
                  "featureType": "background",
                  "elementType": "all",
                  "stylers": {
                            "color": "#eef1f3ff"
                  }
        },
        {
                  "featureType": "local",
                  "elementType": "all",
                  "stylers": {
                            "color": "#ffffffff"
                  }
        },
        {
                  "featureType": "administrative",
                  "elementType": "labels.text.stroke",
                  "stylers": {
                            "lightness": 100
                  }
        },
        {
                  "featureType": "highway",
                  "elementType": "geometry",
                  "stylers": {
                            "color": "#f1c232ff",
                            "weight": "0.1"
                  }
        },
        {
                  "featureType": "subway",
                  "elementType": "geometry",
                  "stylers": {
                            "color": "#b6d7a8ff",
                            "weight": "0.1",
                            "lightness": 50
                  }
        },
        {
                  "featureType": "subway",
                  "elementType": "geometry",
                  "stylers": {
                            "color": "#6aa84fff",
                            "weight": "0.3"
                  }
        },
        {
                  "featureType": "water",
                  "elementType": "all",
                  "stylers": {
                            "color": "#cfe2f3ff"
                  }
        },
        {
                  "featureType": "green",
                  "elementType": "all",
                  "stylers": {
                            "color": "#6aa84fff",
                            "lightness": 60
                  }
        },
        {
                  "featureType": "land",
                  "elementType": "all",
                  "stylers": {
                            "lightness": 30
                  }
        },
        {
                  "featureType": "building",
                  "elementType": "all",
                  "stylers": {}
        },
        {
                  "featureType": "arterial",
                  "elementType": "all",
                  "stylers": {
                            "color": "#ffd966ff",
                            "weight": "0.1",
                            "lightness": 50
                  }
        }
]
	});
	var device = markerArr[0];
	console.log('默认中心点经纬度：'+device.lng+','+device.lat);
  var point1 = new BMap.Point(device.lng, device.lat); //地图中心点
  map.centerAndZoom(point1, 12); // 初始化地图,设置中心点坐标和地图级别（pc:3-19 app:3-18）。	
  map.enableScrollWheelZoom(true); //启用滚轮放大缩小
  //地图、卫星、混合模式切换
  map.addControl(new BMap.MapTypeControl({
      mapTypes: [BMAP_NORMAL_MAP, BMAP_SATELLITE_MAP, BMAP_HYBRID_MAP]
  }));
 
  //向地图中添加缩放控件
  var ctrlNav = new window.BMap.NavigationControl({
      anchor: BMAP_ANCHOR_TOP_LEFT,
      type: BMAP_NAVIGATION_CONTROL_LARGE
  });
  map.addControl(ctrlNav);
  //向地图中添加缩略图控件
  
  var ctrlOve = new window.BMap.OverviewMapControl({
      anchor: BMAP_ANCHOR_BOTTOM_RIGHT,
      isOpen: 1
  });
  map.addControl(ctrlOve);
  //向地图中添加比例尺控件
  var ctrlSca = new window.BMap.ScaleControl({
      anchor: BMAP_ANCHOR_BOTTOM_LEFT
  }); 
  map.addControl(ctrlSca); 
  for (var i = 0; i < markerArr.length; i++) {
      var device = markerArr[i];
      var p0 = toDecimal(device.lng,6); //经度
      var p1 = toDecimal(device.lat,6); //纬度
      console.log(device.deviceName+":lng:"+p0+"===lat:"+p1);
      point[i] = new window.BMap.Point(p0, p1); //循环生成新的地图点
      var obj = new Object();
      obj.id = device.deviceId;
      obj.points = new Array();
      obj.points.push(new BMap.Point(p0, p1));
      deviceArr[i] = obj;
      var status = 0; //设备状态默认不在线
      var deviceName=device.deviceName;
      if(deviceName.length>8){
      	deviceName=deviceName.substring(0,8);
      }
      var planHtml = '<div class="map_spop_con showdiv_'+device.deviceId+'"><div class="map_guanbi" onclick="closeDiv('+device.deviceId+')">X</div><div class="map_spop_con_time" onclick="showInfo(' + i + ');"> 实时数据 </div><div class="map_spop_con_jiantou" onclick="showHistory(' + i + ');"> 历史数据 </div><div class="map_spop_con_txt"><ul><li title="'+device.deviceName+'">' + deviceName + '</li>';
      var val = "<p>经度：" + toDecimal(device.lng,6) + "</p><p>纬度：" + toDecimal(device.lat,6) + "</p>";
      planHtml += '<li>'+ '<span>' + val + "</span></li>";
      for (var j = 0; j < device.sensorList.length; j++) {
          if ("0" == status) {
              if ("1" == device.sensorList[j].isLine) {
                  status = "1";
              }
          }
      }
      planHtml += "</ul></div></div>";
      
      if ("0" == status) {
          var icon = new BMap.Icon(hsIcon, new BMap.Size(num1, num2),{
          	anchor: new BMap.Size(num3, num4)	//要指定图片的哪个位置是与标注真正的位置对应在一起
          }); //自定义图片
          marker[i] = new window.BMap.Marker(point[i],{icon: icon}); //按照地图点坐标生成标记
      } else {
       	var icon = new BMap.Icon(line, new BMap.Size(num1, num2),{
          	anchor: new BMap.Size(num3, num4)
          }); //自定义图片
          marker[i] = new window.BMap.Marker(point[i],{icon: icon}); //按照地图点坐标生成标记
      }
      
      label = new BMap.Label("", {offset: new BMap.Size( 20, -20)});			
		label.setStyle({
		    "border": "1px solid black",
	 		"filter":"alpha(opacity=100)",
	        "cursor": "pointer",
	        "border-radius": "5px",
		    "opacity":"1",
		    "border-width":"100",
		    "border-height":"50"
		});
		label.setContent(planHtml);
      marker[i].setLabel(label);
      map.addOverlay(marker[i]);
     
      map.addEventListener("touchmove", function (e) {
	        map.enableDragging();
	      });
	    // TODO: 触摸结束时触发次此事件  此时开启禁止拖动
	      map.addEventListener("touchend", function (e) {
	        map.disableDragging();
	      });
	    if(ismobile=="1"){
	    	 map.disableDragging();
	    }else{
	    	map.enableDragging();
	    }
      
     
      map.enableScrollWheelZoom(true);
      addClickHandler(device.deviceId,marker[i],i,device);
  }
  //保存局部数组
  var deviceCharObj={"chartId":container,"deviceChart":deviceArr,"markerChart":markerArr,"mkChart":marker,"map":map};
  chartArr.push(deviceCharObj);
}

function addClickHandler(id,marker,i,device) {
	 /*
   marker.addEventListener("mouseover", function (e) {
      $(".showdiv_"+id).show();
   });
   marker.addEventListener("mouseout", function (e) {
      $(".showdiv_"+id).hide();
   });
   */
   marker.addEventListener("click", function (e) {
   	 $(".showdiv_"+id).show();
   });
}
/*************关闭弹出框***************/
function closeDiv(id){
  $(".showdiv_"+id).hide();
}
/**********************显示传感器历史数据****************************************/
function showHistory(id){
	var device = markerArr[id];
  var sensorList=device.sensorList;
  var senArr=[];
  for (var j = 0; j < sensorList.length; j++) {
  	senArr.push(sensorList[j].sensorId);
  }
 	//加载第一个传感器曲线和列表
  var sensorIds = senArr.join(",");
	layoutSensorFun(sensorIds);
}
/**********************显示传感器实时数据********************************/
function showInfo(id) {
  var device = markerArr[id];
  if (null != device) {
      var deviceId = device.deviceId;
      //设备名字
     	$("#MapData-name").html(device.deviceName);
     	//设备序列号
     	$("#MapData-id").html(device.deviceNo);
          var userKey = $("#userKey").val();
    		var showHtml='';
          for (var i = 0; i < device.sensorList.length; i++) {
             var sensor = device.sensorList[i];
             var val = "",unit="";
             var sensorType = sensor.sensorType;
             
             showHtml+=
             '<div class="MapData-tr">'+
				'<div class="MapData-td">'+
					'<img src="'+basePath  + sensor.iocUrl + '" onerror="this.src=\''+basePath+'/images/scenery-21.png\'" style="width:30px;height:30px;">'+
				'</div>'+
				'<div class="MapData-td">'+
					sensor.sensorName+
				'</div>'+
				'<div class="MapData-td">'+
					'<span class="MapData-no sz_' + sensor.sensorId + '">';
					  if ("1" == sensor.isLine) {
		                    showHtml += '<font style="color:#0ecd25;">已连接</font>';
		              } else {
		                    showHtml += '<font style="color:#f36303;">未连接</font>';
		              }
		              showHtml+=
					'</span>'+
				'</div>'+
				'<div class="MapData-td st_'+sensor.sensorId+'">'+
					sensor.updateDateTime+
				'</div>'+
				'<div class="MapData-td">'+
		            '<span class="s_' + sensor.sensorId + '">';
						if ("1" == sensorType||"6" == sensorType) {
		                    val = sensor.value;
		                    unit = sensor.unit;
		                    if("6" == sensorType){
		                    	 unit = '';
		                    }
		                } else if ("2" == sensorType) {	//开关型可操作
		                    val = sensor.switcher;
		                    if ("1" == val) {	//在线
		                    	var lineImg=basePath+'/images/do_open.png';
		                    	var offlineImg=basePath+'/images/do_close.png';
		                        val = '<div id="swopen_' + sensor.sensorId + '" style="cursor:pointer;" onclick="switchVal(' + sensor.sensorId + ',0,\''+userKey+'\')"><img src="'+lineImg+'" style="height:30px"></div>'+
		                        	'<div id="swclose_' + sensor.sensorId + '" style="cursor:pointer;display:none;" onclick="switchVal(' + sensor.sensorId + ',1,\''+userKey+'\')"><img src="'+offlineImg+'" style="height:30px"></div>';
		                    } else {	//离线
		                    	var lineImg=basePath+'/images/do_open.png';
		                    	var offlineImg=basePath+'/images/do_close.png';
		                        val = '<div id="swopen_' + sensor.sensorId + '" style="cursor:pointer;display:none;" onclick="switchVal(' + sensor.sensorId + ',0,\''+userKey+'\')"><img src="'+lineImg+'" style="height:30px"></div>'+
		                        	'<div id="swclose_' + sensor.sensorId + '" style="cursor:pointer;" onclick="switchVal(' + sensor.sensorId + ',1,\''+userKey+'\')"><img src="'+offlineImg+'" style="height:30px"></div>';
		                    }
		                }else if("5" == sensorType){	//开关型不可操作
		                    val = sensor.switcher;
		                    if ("1" == val) {
		                    	var lineImg=basePath+'/images/do_open.png';
		                    	var offlineImg=basePath+'/images/do_close.png';
		                        val = '<div id="swopen_' + sensor.sensorId + '"><img src="'+lineImg+'" style="height:30px"></div>'+
		                        	'<div id="swclose_' + sensor.sensorId + '" style="display:none;"><img src="'+offlineImg+'" style="height:30px"></div>';
		                    } else {
		                    	var lineImg=basePath+'/images/do_open.png';
		                    	var offlineImg=basePath+'/images/do_close.png';
		                        val = '<div id="swopen_' + sensor.sensorId + '" style="display:none;"><img src="'+lineImg+'" style="height:30px"></div>'+
		                        	'<div id="swclose_' + sensor.sensorId + '"><img src="'+offlineImg+'" style="height:30px"></div>';
		                    }
		                } else if ("3" == sensorType) {
		                	if(sensor.lng!=''&&sensor.lng!='0'&&sensor.lat!=''&&sensor.lat!='0'){
		                 		val = toDecimal(sensor.lng,6) + "," + toDecimal(sensor.lat,6);
		                	}else{
		                		val = 0 + "," + 0;
		                	}
		                }
		                showHtml+=
						val+
					'</span>';
	                if(unit!=null&&unit!=''){
						  showHtml+=
						'<span">'+
							unit+
						'</span>';
					}
	                showHtml+=
				'</div>'+
			'</div>';
         }
       console.log(showHtml);
       //传感器实时数据
       $("#MapData-body").html(showHtml);   
		//显示
       $("#MapData").show();
		$("#MapData").animate(
		{
			left:'0'
		});
  }
}
//报警则让标注跳动 传设备ID
function beatPoint(id,chartId) {
	var curDeviceArr=null,curMarkerArr=null;curMkArr=null,mapObj=null;
	if(chartArr!=null&&chartArr.length>0){
		for(var c=0;c<chartArr.length;c++){
			if(chartArr[c].chartId==chartId){
				curDeviceArr=chartArr[c].deviceChart;
				curMarkerArr=chartArr[c].markerChart;
				curMkArr=chartArr[c].mkChart;
				mapObj=chartArr[c].map;
				break;
			}
		}
		if(curDeviceArr!=null){
			for (var i = 0; i < curDeviceArr.length; i++) {
		        if (Number(curDeviceArr[i].id) == Number(id)) { //如果设备ID相等  则触发报警 标注闪烁
		            if (mapObj != null) {
		            	var marker=deletePoint(mapObj,id);
		                mapObj.removeOverlay(marker);
		                var icon = new BMap.Icon(gifIcon, new BMap.Size(num1, num2),{
		                	anchor: new BMap.Size(num3, num4)
		                }); //icon_url为自己的图片路径
		                var device = curMarkerArr[i];
		                var point = new BMap.Point(device.lng, device.lat); //创建点坐标   
		                var deviceName=device.deviceName;
				        if(deviceName.length>8){
				        	deviceName=deviceName.substring(0,8);
				        }
				        var planHtml = '<div class="map_spop_con showdiv_'+device.deviceId+'"><div class="map_guanbi" onclick="closeDiv('+device.deviceId+')">X</div><div class="map_spop_con_time" onclick="showInfo(' + i + ');"> 实时数据 </div><div class="map_spop_con_jiantou" onclick="showHistory(' + i + ');"> 历史数据 </div><div class="map_spop_con_txt"><ul><li title="'+device.deviceName+'">' + deviceName + '</li>';
				        var val = "<p>经度：" + toDecimal(device.lng,6) + "</p><p>纬度：" + toDecimal(device.lat,6) + "</p>";
				        planHtml += '<li>'+ '<span>' + val + "</span></li>";
				        planHtml += "</ul></div></div>";
		                marker = new window.BMap.Marker(point, {icon: icon}); //按照地图点坐标生成标记
		                var label = new BMap.Label("", {offset: new BMap.Size( 20, -20)});			
						label.setStyle({
						    "border": "1px solid black",
					 		"filter":"alpha(opacity=100)",
					        "cursor": "pointer",
					        "border-radius": "5px",
					        "filter": "alpha(Opacity=0)",
						    "opacity":"1"
						});
						label.setContent(planHtml);
		                marker.setLabel(label);
				        mapObj.addOverlay(marker);
		                addClickHandler(id,marker,i,device);
		            }
//		            marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
		            break;
		        }
		    }
		}
	}
}

//恢复报警则让标注停止跳动
function stopBeatPoint(id,chartId) {
	var curDeviceArr=null,curMarkerArr=null;curMkArr=null,mapObj=null;
	if(chartArr!=null&&chartArr.length>0){
		for(var c=0;c<chartArr.length;c++){
			if(chartArr[c].chartId==chartId){
				curDeviceArr=chartArr[c].deviceChart;
				curMarkerArr=chartArr[c].markerChart;
				curMkArr=chartArr[c].mkChart;
				mapObj=chartArr[c].map;
				break;
			}
		}
		if(curDeviceArr!=null){
			for (var i = 0; i < curDeviceArr.length; i++) {
		        if (Number(curDeviceArr[i].id) == Number(id)) { //如果设备ID相等  则触发报警 标注闪烁
		            if (mapObj != null) {
		                var marker=deletePoint(mapObj,id);
		                mapObj.removeOverlay(marker);
		                var icon = new BMap.Icon(line, new BMap.Size(num1, num2),{
		                	anchor: new BMap.Size(num3, num4)
		                }); //icon_url为自己的图片路径
		                var device = curMarkerArr[i];
		                var point = new BMap.Point(device.lng, device.lat); //创建点坐标  
		                var deviceName=device.deviceName;
				        if(deviceName.length>8){
				        	deviceName=deviceName.substring(0,8);
				        }
				        var planHtml = '<div class="map_spop_con showdiv_'+device.deviceId+'"><div class="map_guanbi" onclick="closeDiv('+device.deviceId+')">X</div><div class="map_spop_con_time" onclick="showInfo(' + i + ');"> 实时数据 </div><div class="map_spop_con_jiantou" onclick="showHistory(' + i + ');"> 历史数据 </div><div class="map_spop_con_txt"><ul><li title="'+device.deviceName+'">' + deviceName + '</li>'; 
				        var val = "<p>经度：" + toDecimal(device.lng,6) + "</p><p>纬度：" + toDecimal(device.lat,6) + "</p>";
				        planHtml += '<li>'+ '<span>' + val + "</span></li>";
				        planHtml += "</ul></div></div>";
		                marker = new window.BMap.Marker(point, {icon: icon}); //按照地图点坐标生成标记
		                var label = new BMap.Label("", {offset: new BMap.Size( 20, -20)});			
						label.setStyle({
						    "border": "1px solid black",
					 		"filter":"alpha(opacity=100)",
					        "cursor": "pointer",
					        "border-radius": "5px",
					        "filter": "alpha(Opacity=0)",
						    "opacity":"1"
						});
						label.setContent(planHtml);
		                marker.setLabel(label);
				        mapObj.addOverlay(marker);
		                addClickHandler(id,marker,i,device);
		            }
		        }
		    }
		}
	}
}
   
//连接点
function showPoint(deviceId,chartId) {
     
     var curDeviceArr=null,curMarkerArr=null;curMkArr=null,mapObj=null;
		if(chartArr!=null&&chartArr.length>0){
			for(var c=0;c<chartArr.length;c++){
				if(chartArr[c].chartId==chartId){
					curDeviceArr=chartArr[c].deviceChart;
					curMarkerArr=chartArr[c].markerChart;
					curMkArr=chartArr[c].mkChart;
					mapObj=chartArr[c].map;
					break;
				}
			}
			if(curDeviceArr!=null){
				for (var i = 0; i < curDeviceArr.length; i++) {
			        if (Number(curDeviceArr[i].id) == Number(deviceId)) { //如果设备ID相等  则触发报警 标注闪烁
			            if (mapObj != null) {
			                var marker=deletePoint(mapObj,deviceId);
			                mapObj.removeOverlay(marker);
			                var device = curMarkerArr[i];
			                var point = new BMap.Point(device.lng, device.lat); //创建点坐标   
			                var deviceName=device.deviceName;
					        if(deviceName.length>8){
					        	deviceName=deviceName.substring(0,8);
					        }
					        var planHtml = '<div class="map_spop_con showdiv_'+device.deviceId+'"><div class="map_guanbi" onclick="closeDiv('+device.deviceId+')">X</div><div class="map_spop_con_time" onclick="showInfo(' + i + ');"> 实时数据 </div><div class="map_spop_con_jiantou" onclick="showHistory(' + i + ');"> 历史数据 </div><div class="map_spop_con_txt"><ul><li title="'+device.deviceName+'">' + deviceName + '</li>';
					        var val = "<p>经度：" + toDecimal(device.lng,6) + "</p><p>纬度：" + toDecimal(device.lat,6) + "</p>";
					        planHtml += '<li>'+ '<span>' + val + "</span></li>";
					        planHtml += "</ul></div></div>";
			                var label = new BMap.Label("", {offset: new BMap.Size( 20, -20)});			
							label.setStyle({
							    "border": "1px solid black",
						 		"filter":"alpha(opacity=100)",
						        "cursor": "pointer",
						        "border-radius": "5px",
						        "filter": "alpha(Opacity=0)",
							    "opacity":"1"
							});
							label.setContent(planHtml);
			                /****/
							var icon = new BMap.Icon(line, new BMap.Size(num1, num2),{
								anchor: new BMap.Size(num3, num4)
							}); //自定义图片
							var points = curDeviceArr[i].points;
			                //连接所有点
							mapObj.addOverlay(new BMap.Polyline(points, {strokeColor: "#009900",strokeWeight: 3,strokeOpacity: 1}));
							marker = new BMap.Marker(points[points.length - 1],{icon:icon});
			                marker.setLabel(label);
					        mapObj.addOverlay(marker);
		                    addClickHandler(deviceId,marker,i,device);
			            }
			        }
			    }
			}
		}
}
//删除标注点
function deletePoint(map,content) {
	  var marker="";
    var allOverlay = map.getOverlays();
    for (var i = 0; i < allOverlay.length; i++) {
        if (allOverlay[i].toString() == "[object Marker]") {
            if (allOverlay[i].getLabel()!=null
            	&&allOverlay[i].getLabel().content.indexOf(content)>=0) {
                marker=allOverlay[i];
                break;
            }
        }
    }
    return marker;
}
//保留小数位
function toDecimal(x,weishu) {   
	var f = parseFloat(x);   
	var str='1';     
	for(var i=0;i<weishu;i++){
		str+='0';
	}
	f = Math.round(x*str)/str;  
	return f;        
}

$(function(){
	//文本组件数据下发展开
	$(document).on("click", ".numDown", function()
	{
		//获取当前绑定的传感器ID
		var sensorIds=$(this).parent(".canvas-con").attr("sensorid");
		if(!sensorIds){
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
				tooltips(jsonObj.msg,"Warning");
	        }
	 	}});
	});
	//固定数据下发发送
	$(document).on("click", ".fixedDown", function()
	{
		//获取当前绑定的设备ID，传感器ID
		 var deviceId=$(this).parent(".canvas-con").attr("deviceid");
		 var sensorId=$(this).parent(".canvas-con").attr("sensorid");
		 var value=$(this).parent(".canvas-con").attr("downdata");
	     if(!sensorId||!value){
			 tooltips("未选择传感器或尚未写入下发数据！","Warning");
	     }else{
			 $.ajax({url:basePath+"/sendFixData.htm", 
		         type:"POST",
		           data:{
		              "sensorId" :sensorId,
		              "deviceId" :deviceId,
		              "value"  : value
		            },success:function (data) {
		                console.log(data);
			            var jsonObj = $.parseJSON(data);
			            var str='';
						if ('00' == jsonObj.flag) {
							tooltips("发送成功","Success");
						} else {
							tooltips(jsonObj.msg,"Warning");
				        }
			 }});
	     }
	});	
	//报警历史记录显示
	$(document).on("click", ".policeHistory", function()
	{
		var sensorid = $(this).parent(".canvas-con").attr("sensorid");
		alarmLayoutSensorFun(sensorid);
	});
	//报警历史搜索
	$(document).on("click", "#alarmSearch", function(e)
	{
		e.preventDefault();
		var startTime=$("#alarmStartTime").val();
		var endTime=$("#alarmEndTime").val();
		alarmLoadTableData(1,startTime,endTime);
	});
	//报警历史数据传感器切换
	$(document).on("change", "#DataAlarm_position", function()
	{
		var startTime=$("#alarmStartTime").val();
		var endTime=$("#alarmEndTime").val();
		alarmLoadTableData(1,startTime,endTime);
	});
	//关闭报警历史记录
	$(document).on("click", "#policeHistoryDate-DEL", function()
	{
		$("#policeHistoryDate").animate(
		{
			left:'-105%'
		},function()
		{
			$("#policeHistoryDate").hide();
		});
	});
});

//布局设备传感器
function alarmLayoutSensorFun(sensorIds){
	//获取当前绑定的传感器ID
	if(!sensorIds){
		tooltips("未绑定传感器","Warning")
		return;
	}
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
			$("#alarmDevice").html(deviceName);
			$("#alarmDevice").attr("lang",deviceNo);
			//获取传感器信息
			var sensorList=jsonObj.sensorList;
			var chooseSensorId="";	//默认传感器
			$("#DataAlarm_position").html('');
			$.each(sensorList,function(index,obj){
				var sensorId=obj.sensorId;
				var sensorName=obj.sensorName;
				var str = '';
				if(index==0)
				{
					chooseSensorId=sensorId;
					sensorType=obj.sensorType;
				  	str = '<option value="'+sensorId+'" selected>'+
		  					sensorName+
		  				'</option>';
				}else{
					str = '<option value="'+sensorId+'">'+
		  					sensorName+
		  				  '</option>';
				}
				$("#DataAlarm_position").append(str);
			});
			//显示
			$("#policeHistoryDate").show();
			$("#policeHistoryDate").animate(
			{
				left:'0'
			});
			if(chooseSensorId!=""){
				//加载第一个传感器的报警记录
				loadAlarmList(chooseSensorId);
			}
		} else {
			tooltips(jsonObj.msg,"Error");
        }
 	}});
}
//加载报警记录列表
function loadAlarmList(sensorId){
	var time = new Date().Format("yyyy-MM-dd");
	$("#alarmStartTime").val(time);
	$("#alarmEndTime").val(time);
	alarmLoadTableData(1,time,time);
}

function alarmLoadTableData(page,startTime,endTime){
	 var sensorId=$("#DataAlarm_position").val();
	 $.ajax({
		 	url:basePath+"/querySensorAlarmRecord.htm", 
           type:"POST",
           data:{
	            sensorId:sensorId,
	            page:page,
	            startTime:startTime+" 00:00:00",
	            endTime:endTime+" 23:59:59",
	            rowCount:"20"
    		},
    		success:function (data){
		        var jsonData =  $.parseJSON(data);
				var html = '<div class="policeHistoryDateTr DataHistoryTrC">'+
								'<div class="policeHistoryDateTd">'+
									'传感器'+
								'</div>'+
								'<div class="policeHistoryDateTd">'+
									'报警时间'+
								'</div>'+
								'<div class="policeHistoryDateTd">'+
									'报警内容'+
								'</div>'+
							'</div>';
				$(".policeHistoryDatePage").hide();
				if(jsonData.flag == "00"){
					var alarmList=jsonData.result;
					$.each(alarmList,function(index,obj){
						html+=
						'<div class="policeHistoryDateTr">'+
							'<div class="policeHistoryDateTd">'+
								obj.sensorName+
							'</div>'+
							'<div class="policeHistoryDateTd">'+
								obj.triggerDate+
							'</div>'+
							'<div class="policeHistoryDateTd">'+
								obj.triggerContent+
							'</div>'+
						'</div>';
					});
					$(".policeHistoryDatePage").html(generateAlarmTablePagination(parseInt(jsonData.currentPage),parseInt(jsonData.pages),startTime,endTime));
					$(".policeHistoryDatePage a").click(function(){
						var index = $(this).attr('index');	
						alarmLoadTableData(index,startTime,endTime);
					});
					$(".policeHistoryDatePage").show();	
				}	
				$('.policeHistoryDateTab').html(html);
	  		}
	});	
}

//报警记录分页
function generateAlarmTablePagination(page,totalPage,startTime,endTime){
	if(totalPage > 0){
		var pageHtml = '';
		//到首页
		pageHtml += '<a href="javascript:;" index="1">'+
						'首页'+
					'</a>';
		if(page > 1){		
			//到上一页
			pageHtml += '<a href="javascript:;" index="'+(page-1)+'">'+
							'上一页'+
						'</a>';
		}
		var beginPage = page - 3 < 1 ? 1 : page - 3;
		if (beginPage <= totalPage) {
			var i = beginPage;
			for (var j = 0; (i <= totalPage) && (j < 6); j=j+1) {
				if (i == page) {
					pageHtml += 
					'<a href="javascript:;" index="'+i+'" class="policeHistoryDatePageA">'+
						i+
					'</a>';
				} else {
					pageHtml += 
					'<a href="javascript:;" index="'+i+'">'+
						i+
					'</a>';
				}
				i=i+1;
			}
		}
		if(page < totalPage){
			//到上一页
			pageHtml += '<a href="javascript:;" index="'+(page+1)+'">'+
							'下一页'+
						'</a>';
		}
		pageHtml += '<a href="javascript:;" index="'+totalPage+'">'+
							'末页'+
					'</a>';
		return pageHtml;
	}
	return '';
}

Array.prototype.remove = function(val) {
    var index = this.indexOf(val);
    if (index > -1) {
        this.splice(index, 1);
    }
};



var getIndex = function (index, type) {
    if (index < 10) {
        index = "0" + index;
    }

    return index + type;

}
