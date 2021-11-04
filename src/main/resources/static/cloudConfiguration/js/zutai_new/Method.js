/****************************************** 
 ****************************************** 
 ****************************************** 
 * 
 * 公共方法
 * 
 ****************************************** 
 ****************************************** 
 ****************************************** 
 ******************************************* /
 
 
/****************************************** 素材区域拖动 *********************************************/
function draggable(navPage)
{
	$(".draggable").draggable(
	{
		appendTo:"body",
		helper:"clone",
		scroll:false,
		addClass:false,
		revert: false,
		cursor:"move",
		zIndex:9999,
		scope:navPage,
		start:function(event,ui)
		{
			var pid = $(this).attr("pid");
			if(pid == 1)
			{
				var rid = $(this).find(".canvas").attr('rid');//获取rid
				var add = $(this).find(".canvas-con");
				var whd = $(this).find(".canvas");
				switch(rid)
				{
					case "2"://svg
						var url = $(this).attr("url");//获取URL
						$.ajax({url:url,success:function(result)
						{
							var serializer = new XMLSerializer();
							var serialized = serializer.serializeToString(result);
							$("#newSVG").append(serialized);
							$("#newSVG").children("svg")[0].setAttribute("preserveAspectRatio","none");
							$("#newSVG").children("svg").removeAttr("id");
							svgW = $("#newSVG").children("svg").attr("width");
							svgH = $("#newSVG").children("svg").attr("height");
							svgHtml = $("#newSVG").html();
							$("#newSVG").empty();
						}});
						break;
					case "9"://svg(不可改变颜色)
						var url = $(this).attr("url");//获取URL
						svgUrl  = url;
						$.ajax({url:url,success:function(result)
						{
							var serializer = new XMLSerializer();
							var serialized = serializer.serializeToString(result);
							$("#newSVG").append(serialized);
							$("#newSVG").children("svg")[0].setAttribute("preserveAspectRatio","none");
							$("#newSVG").children("svg").removeAttr("id");
							svgW = $("#newSVG").children("svg").attr("width");
							svgH = $("#newSVG").children("svg").attr("height");
							$("#newSVG").empty();
						}});
						break;	
				}
			}
		}
	});
}
/****************************** 让编辑区接收拖动过来的元素 ********************************/
function droppable(navPage)
{
	$(navPage).droppable(
	{
		activeClass: "ui-state-default",
		hoverClass: "ui-state-hover",
		scroll:false,
		cursor:"move",
		scope:navPage,
		containment:"body",
		drop:function(event, ui)
		{
			//克隆并放置元素
			var pid     = ui.helper.attr("pid");
			var add     = "";
			var cl      = ui.helper.find(".canvas").clone();//克隆元素
			var rid     = $(cl).attr('rid');//获取rid
				zIndexT = zIndexT+1;//层级增加
			//定位
			var x1 = $(navPage).offset().top;
			var x2 = ui.offset.top;
			var x  = x2 - x1 +"px";//上偏移
			var y1 = $(navPage).offset().left; 
			var y2 = ui.offset.left;
			var y  = y2-y1 +"px";//左偏移
			var w  = "";//宽
			var h  = "";//高
			if(pid == 0)
			{
				switch(rid){
					case "0"://高级文本
						w = "160";
						h = "40";
						break;
					case "5"://时间类型
						w = "160";
						h = "30";
                        startTime();
						break;
                    case "104"://YMD
                        w = "160";
                        h = "30";
                        ymdP();
                        break;
                    case "105"://HMS
                        w = "160";
                        h = "30";
                        ymdG();
                        break;
                    case "106"://HMS
                        w = "160";
                        h = "30";
                        hms();
                        break;
                    case "107"://week
                        w = "160";
                        h = "30";
                        week();
                        break;
                    case "108"://文本返回值
                        w = "160";
                        h = "30";
                        backData();
                        break;
                    case "109"://文本输入框
                        w = "160";
                        h = "30";
                        backData();
                        break;
					case "6"://天气插件
						w = $(cl).width();
						h = $(cl).height();
						var tid = cl.children(".canvas-con").attr("tid");
						if(tid == 1)
						{
							var tem = '<iframe name="weather_inc" src="http://i.tianqi.com/index.php?c=code&id=7"width="225" height="90" frameborder="0" marginwidth="0" marginheight="0" scrolling="no"></iframe>';
							cl.children(".canvas-con").append(tem);
							
						}else if(tid == 2)
						{
							var tem = '<iframe id="fancybox-frame" name="fancybox-frame1533113726919" frameborder="0" width="230" height="30" scrolling="no" hspace="0"  src="http://i.tianqi.com/index.php?c=code&a=getcode&id=34&h=25&w=280"></iframe>';
							cl.children(".canvas-con").append(tem);
						}else if(tid == 3)
						{
							var tem = '<iframe name="weather_inc" src="http://i.tianqi.com/index.php?c=code&id=83" width="515" height="178" frameborder="0" marginwidth="0" marginheight="0" scrolling="no"></iframe>';
							cl.children(".canvas-con").append(tem);
						}else if(tid == 4)
						{
							var tem = '<iframe name="weather_inc" src="http://i.tianqi.com/index.php?c=code&id=2" width="770" height="70" frameborder="0" marginwidth="0" marginheight="0" scrolling="no"></iframe>';
							cl.children(".canvas-con").append(tem);
						}
						break;
					case "7"://模态框
						if(!$(navPage).hasClass("newModalCon"))
						{
							w = "100";
							h = "30";
							add_Modal(cl);//调用添加模态框
						}else
						{
							tooltips("当前素材禁止嵌套！","Warning");
							return false;
						}
						break;
                    case "101"://模态框2
                        if(!$(navPage).hasClass("newModalCon"))
                        {
                            w = "27";
                            h = "36";
                            add_Modal2(cl);//调用添加模态框
                        }else
                        {
                            tooltips("当前素材禁止嵌套！","Warning");
                            return false;
                        }
                        break;
                    case "103"://模态框3
                        if(!$(navPage).hasClass("newModalCon"))
                        {
                            w = "27";
                            h = "36";
                            add_Modal3(cl);//调用添加模态框
                        }else
                        {
                            tooltips("当前素材禁止嵌套！","Warning");
                            return false;
                        }

                        break;
					case "8"://文本
						w = "160";
						h = "40";
						break;
					case "29"://超链接
						w = "160";
						h = "40";
						break;
					case "32"://页面刷新
						w = "160";
						h = "40";
						break;
				}
			}else if(pid == 1)
			{
				switch(rid)
				{
					case "1"://图片类型
						var screenImage = cl.find(".IMG").attr("src");
						if(screenImage != undefined)
						{
							var pw = $(navPage).width();
							var ph = $(navPage).height();
                            var theImage = new Image();//实例化IMG对象
                            theImage.onload = function () {
                                var nw = theImage.width;
                                var nh = theImage.height;
                                theImage.src = screenImage;//获取IMG SRC
                                if(nw > pw)
                                {
                                    var cw = pw/nw;
                                    var jw = nw*cw;
                                    var jh = nh*cw;
                                    w = parseInt(jw);
                                    h = parseInt(jh);
                                }else if(nh > ph)
                                {
                                    var cw = ph/nh;
                                    var jw = nw*cw;
                                    var jh = nh*cw;
                                    w = parseInt(jw);
                                    h = parseInt(jh);
                                }else
                                {
                                    w = nw;
                                    h = nh;
                                }


                            }
						}else
						{
							w = cl.width();
							h = cl.height();
						}
						break;
					case "2"://svg
						w = svgW;
						h = svgH;
						cl.children(".canvas-con").html(svgHtml);
						break;
					case "9"://svg(不可改变颜色)
						w = svgW;
						h = svgH;
						var iframe = '<img src="'+svgUrl+'" style="width:100%;height:100%;">';
						cl.children(".canvas-con").append(iframe);
						break;
				}
			}else if(pid == 2)
			{
				switch(rid)
				{
					case "10"://图表视频类型
						w = 480;
						h = 270;
						videoId++;
						var myPlayer = "my"+videoId+"Player";
						var tmp = 
								'<video  class="myVideo" id="'+myPlayer+'" poster="" controls playsInline webkit-playsinline autoplay>'+
								'</video>';
						cl.children(".canvas-con").attr("video",videoId);
						cl.children(".canvas-con").children(".myPlayer").html(tmp);
						break;
					case "11"://文本类型
						curveID++;
						var myCurve = "my"+curveID+"curve";
						cl.children(".canvas-con").attr("curve",curveID);
						cl.children(".canvas-con").attr("id",myCurve);
						w = 150;
						h = 50;
						break;
					case "12"://开关(单选)
						curveID++;
						var myCurve = "my"+curveID+"curve";
						cl.children(".canvas-con").attr("curve",curveID);
						cl.children(".canvas-con").attr("id",myCurve);
						w = 158;
						h = 64;
						break;
					case "13"://开关(单选自定义)
						curveID++;
						var myCurve = "my"+curveID+"curve";
						cl.children(".canvas-con").attr("curve",curveID);
						cl.children(".canvas-con").attr("id",myCurve);
						w = 158;
						h = 64;
						break;
					case "14"://曲线(多选)
						w = 500;
						h = 260;
						curveID++;
						var myCurve = "my"+curveID+"curve";
						var tmp = '<div class="myECharts" id="'+myCurve+'"></div>';
						cl.children(".canvas-con").attr("curve",curveID);
						cl.children(".canvas-con").html(tmp);
						var sid = cl.children(".canvas-con").attr("sid");
						if(sid == 1)
						{
							/*复合折线图示例*/
							setTimeout(function() 
							{
								curve_01(myCurve,"0");
							},300);
						}else if(sid == 2){
							setTimeout(function() 
							{
								curve_04(myCurve,"0");
							},300);
						}else if(sid == 3){
							setTimeout(function() 
							{
								curve_05(myCurve,"0");
							},300);
						}else if(sid == 4){
							setTimeout(function() 
							{
								curve_06(myCurve,"0");
							},300);
						}
						break;
					case "15"://曲线(单选)
						w = 500;
						h = 260;
						curveID++;
						var myCurve = "my"+curveID+"curve";
						var tmp = '<div class="myECharts" id="'+myCurve+'"></div>';
						cl.children(".canvas-con").attr("curve",curveID);
						cl.children(".canvas-con").html(tmp);
						setTimeout(function() 
						{
							curve_02(myCurve,"0");
						},300);
						break;
					case "16"://区域(多选)
						w = 500;
						h = 260;
						curveID++;
						var myCurve = "my"+curveID+"curve";
						var tmp = '<div class="myECharts" id="'+myCurve+'"></div>';
						cl.children(".canvas-con").attr("curve",curveID);
						cl.children(".canvas-con").html(tmp);
						var sid = cl.children(".canvas-con").attr("sid");
						if(sid == 1){//复合折线图示例
							setTimeout(function() 
							{
								curve_07(myCurve,"0");
							},300);
						}else if(sid == 2){
							setTimeout(function() 
							{
								curve_08(myCurve,"0");
							},300);
						}
						break;
					case "17"://仪表(单选)
						w = 400;
						h = 400;
						curveID++;
						var myCurve = "my"+curveID+"curve";
						var tmp = '<div class="myECharts" id="'+myCurve+'"></div>';
						cl.children(".canvas-con").attr("curve",curveID);
						cl.children(".canvas-con").html(tmp);
						var sid = cl.children(".canvas-con").attr("sid");
						if(sid == 1){//复合折线图示例
							setTimeout(function() 
							{
								curve_09(myCurve,"0");
							},300);
						}else if(sid == 2){
							setTimeout(function() 
							{
								curve_10(myCurve,"0");
							},300);
						}
						break;
					case "18"://数据下发
						w = 100;
						h = 100;
						break;	
					case "19"://定位(地图)
						w = 400;
						h = 400;
						curveID++;
						var myCurve = "my"+curveID+"curve";
						var tmp = '<div class="myECharts" id="'+myCurve+'"></div>';
						cl.children(".canvas-con").attr("curve",curveID);
						cl.children(".canvas-con").html(tmp);
						setTimeout(function() 
						{
							curve_11(myCurve,"0");
						},300);
						break;
					case "20"://历史数据
						w = 100;
						h = 100;
						break;	
					case "21"://曲线(多选自定义分辨带)
						w = 500;
						h = 260;
						curveID++;
						var myCurve = "my"+curveID+"curve";
						var tmp = '<div class="myECharts" id="'+myCurve+'"></div>';
						cl.children(".canvas-con").attr("curve",curveID);
						cl.children(".canvas-con").html(tmp);
						setTimeout(function() 
						{
							curve_03(myCurve,"0");
						},300);
						break;
					case "22"://管道类型
						w = 500;
						h = 30;
						curveID++;
						var myCurve = "my"+curveID+"curve";
						var tmp = '<div class="myECharts" id="'+myCurve+'"></div>';
						cl.children(".canvas-con").attr("curve",curveID);
						cl.children(".canvas-con").html(tmp);
						var sid = cl.children(".canvas-con").attr("sid");
						if(sid == 1){//管道(1)
							setTimeout(function() 
							{
								curve_12(myCurve,"0");
							},300);
						}else if(sid == 2){//管道(2)
							setTimeout(function() 
							{
								curve_13(myCurve,"0");
							},300);
						}else if(sid == 3){//管道(3)
							setTimeout(function() 
							{
								curve_14(myCurve,"0");
							},300);
						}
						break;
					case "23"://弯道类型
						w = 100;
						h = 100;
						curveID++;
						var myCurve = "my"+curveID+"curve";
						var tmp = '<div class="myECharts" id="'+myCurve+'"></div>';
						cl.children(".canvas-con").attr("curve",curveID);
						cl.children(".canvas-con").html(tmp);
						var sid = cl.children(".canvas-con").attr("sid");
						if(sid == 1){//弯道(1)
							setTimeout(function() 
							{
								curve_15(myCurve,"0");
							},300);
						}else if(sid == 2){//弯道(2)
							setTimeout(function() 
							{
								curve_16(myCurve,"0");
							},300);
						}else if(sid == 3){//弯道(3)
							setTimeout(function() 
							{
								curve_17(myCurve,"0");
							},300);
						}
						break;
					case "24"://蓄水池
						w = 300;
						h = 300;
						curveID++;
						var myCurve = "my"+curveID+"curve";
						var tmp = '<div class="myECharts" id="'+myCurve+'"></div>';
						cl.children(".canvas-con").attr("curve",curveID);
						cl.children(".canvas-con").html(tmp);
						setTimeout(function() 
						{
							curve_18(myCurve,"0");
						},300);
						break;
					case "25"://固定数据下发
						w = 100;
						h = 100;
						break;
					case "26"://报警历史记录
						w = 100;
						h = 100;
						break;
					case "27"://水池无边框
						w = 300;
						h = 300;
						curveID++;
						var myCurve = "my"+curveID+"curve";
						var tmp = '<div class="myECharts" id="'+myCurve+'"></div>';
						cl.children(".canvas-con").attr("curve",curveID);
						cl.children(".canvas-con").html(tmp);
						setTimeout(function() 
						{
							curve_23(myCurve,"0");
						},300);
						break;
					case "28"://百分比控件
						w = 500;
						h = 40;
						curveID++;
						var myCurve = "my"+curveID+"curve";
						var tmp = '<div class="myECharts" id="'+myCurve+'"></div>';
						cl.children(".canvas-con").attr("curve",curveID);
						cl.children(".canvas-con").html(tmp);
						var sid = cl.children(".canvas-con").attr("sid");
						if(sid == 1){//百分比控件横(单柱)
							setTimeout(function() 
							{
								curve_24(myCurve,"0");
							},300);
						}else if(sid == 2){//百分比控件横(带数据)
							setTimeout(function() 
							{
								curve_25(myCurve,"0");
							},300);
						}else if(sid == 3){//百分比控件竖(单柱)
							setTimeout(function() 
							{
								curve_26(myCurve,"0");
							},300);
						}else if(sid == 4){//百分比控件竖(带数据)
							setTimeout(function() 
							{
								curve_27(myCurve,"0");
							},300);
						}
						break;
					case "30"://柱状图
						w = 700;
						h = 260;
						curveID++;
						var myCurve = "my"+curveID+"curve";
						var tmp = '<div class="myECharts" id="'+myCurve+'"></div>';
						cl.children(".canvas-con").attr("curve",curveID);
						cl.children(".canvas-con").html(tmp);
						var sid = cl.children(".canvas-con").attr("sid");
						if(sid == 1){
							setTimeout(function() 
							{
								curve_19(myCurve,"0");
							},300);
						}else if(sid == 2){
							setTimeout(function() 
							{
								curve_20(myCurve,"0");
							},300);
						}
						break;
					case "31"://饼图/环形图
						w = 500;
						h = 450;
						curveID++;
						var myCurve = "my"+curveID+"curve";
						var tmp = '<div class="myECharts" id="'+myCurve+'"></div>';
						cl.children(".canvas-con").attr("curve",curveID);
						cl.children(".canvas-con").html(tmp);
						var sid = cl.children(".canvas-con").attr("sid");
						if(sid == 1){
							setTimeout(function() 
							{
								curve_21(myCurve,"0");
							},300);
						}else if(sid == 2){
							setTimeout(function() 
							{
								curve_22(myCurve,"0");
							},300);
						}
						break;
                    case "102"://设备状态
                        curveID++;
                        var myCurve = "my"+curveID+"curve";
                        cl.children(".canvas-con").attr("curve",curveID);
                        cl.children(".canvas-con").attr("id",myCurve);
                        w = 77;
                        h = 38;
                        break;
				}		
			}
			add = cl.appendTo($(this));
			add.css({
				"width":w,
				"height":h,
				"top":x,
				"left":y,
				"z-index":zIndexT
			});
			$(".canvasId").removeClass("canvasId");
			add.addClass("canvasId");
			add.attr("Lid",0);//添加默认状态(未锁定)
			new_draggable(add);//拖动
			new_resizable(add);//拖拽
			new_transformable(add);//旋转
			newFunction("F2");//画布与素材编辑栏切换
			toolbar(add,rid);//调用素材按钮同步
			newEdit(rid,0);//调用素材编辑面板
		}
	});
}
//全局拖动公共方法
function new_draggable(add)
{
	add.draggable(
	{
		opacity: 1,
		scroll:false,
		containment:"body",
		create:showinfo,//初始化
		drag:showinfo,//移动时触发
		stop:showinfo,//停止的时候触发
	});
}
//全局拖拽公共方法
function new_resizable(add)
{
	add.resizable(
	{
		addClass:false,
		handles:" n, e, s, w, ne, se, sw, nw ",
		create:showinfo,
		resize:showinfo,//调整时触发
		stop:stopinfo,
	});
}
//全局旋转公共方法
function new_transformable(add)
{
	add.transformable( 
	{
		rotatable:true,
		skewable:false,
		scalable:false,
		rotate:showinfo,//旋转时候触发
	});
}
//动态更新拖拽停止时方法
function stopinfo(e,ui)
{
	var rid = $(this).attr("rid");
	if(rid == 10){//视频类型
		var w = $(this).width();
		var h = $(this).height();
		console.log(w,h);
	}
	if($(this).children(".canvas-con").hasClass("newECharts"))
	{
		var id  = $(this).children(".canvas-con").children(".myECharts").attr("id");
		switch(rid)
		{
			case "22"://管道类型
				var sid = $(this).children(".canvas-con").attr("sid");
				if(sid == 1){//管道(1)
					setTimeout(function() 
					{
						curve_12(id,1);
					},300);
				}else if(sid == 2){//管道(2)
					setTimeout(function() 
					{
						curve_13(id,1);
					},300);
				}else if(sid == 3){//管道(3)
					setTimeout(function() 
					{
						curve_14(id,1);
					},300);
				}
				break;
			case "23"://弯道类型
				var sid = $(this).children(".canvas-con").attr("sid");
				if(sid == 1){//弯道(1)
					setTimeout(function() 
					{
						curve_15(id,1)
					},300);
				}else if(sid == 2){//弯道(2)
					setTimeout(function() 
					{
						curve_16(id,1);
					},300);
				}else if(sid == 3){//弯道(3)
					setTimeout(function() 
					{
						curve_17(id,1);
					},300);
				}
				break;
			default:
			var myChart = echarts.init(document.getElementById(id));
			myChart.resize();		
		}		
	}
}
//动态更新显示面板
function showinfo(e,ui)
{
    var u=$(this).getTransform();
	var o=$(this).tOffset();
	var wh = [parseInt(o.left),parseInt(o.right),parseInt(o.top),parseInt(o.bottom)];
	$(this).attr("wh",wh);
	var w = $(this).width();
	var h = $(this).height();
	var l = $(this).position().left;
	var t = $(this).position().top;
	$("#canvas_w").val(parseInt(w));
	$("#canvas_h").val(parseInt(h));
	$("#canvas_left").val(parseInt(l));
	$("#canvas_top").val(parseInt(t));
	//动态更新旋转显示值
	var tran = $(this).matrixToArray();
	var a    = tran[0];
	var b    = tran[1];
	var c    = tran[2];
	var d    = tran[3];
	var scale = Math.sqrt(a * a + b * b);
	var sin = b / scale;
	var angle = Math.round(Math.atan2(b, a) * (180 / Math.PI));
	var R = angle>=0?angle:360+angle;
	$("#canvas_Rotation").val(R);
	$("#canvas_Rotation_Slide").slider("value",R);
}
/************************************* 编辑区功能 ***************************************************************/	
function  Editing_area(navPage)
{
	//选中元素主程序
	$(document).on("mousedown", navPage+ "> .canvas", function(e)
	{	
		
		var key =  e.which;
		if(key == 1 || key == 3)
		{
			if(!$(this).hasClass("canvasId")){//点击的当前元素是否存在canvasId
				//从新绑定事件
				$(".canvasId").removeClass("canvasId");//删除唯一标识
				$(this).addClass("canvasId");//添加唯一标识
				var Lid = $(".canvasId").attr("Lid");//获取元素锁定状态
				var rid = $(".canvasId").attr("rid");//获取元素类型
				$("#pc-edit").find(".ui-resizable").resizable("destroy");//清空缩放
				$("#pc-edit").find(".canvas").transformable('destroy');//清空旋转
				clickPaste_del();//删除粘贴菜单
				mouseR_dele();//删除鼠标右键dome
				iSbookDel();//删除层级状态
				newEdit(rid,Lid);//调用素材编辑面板
				toolbar($(this),rid,Lid);//调用素材按钮同步
				newFunction("F2");//画布与素材编辑栏切换
				if(Lid == 0){//未锁定
					if(rid != 3 && rid != 4){//如果不为组合前状态和未组合
						if($(".txtId").hasClass("txtId")){
							var $target = $("#editNo");
							var content = $target.html();
							var currentParnet = ue.container.parentNode.parentNode;
							var currentContent = ue.getContent();
							$target.html('');
							$target.append(ue.container.parentNode);
							ue.reset();
							setTimeout(function(){
								ue.setContent(content);
							},200)
							$(currentParnet).html(currentContent);
							new_draggable($(".txtId"));
							$(".canvasTextNone").show();
							$("#new-ueditorNone").show();
							$(".txtId").removeClass("txtId");
						}
						new_resizable($(this));//初始化缩放
						new_transformable($(this));//初始化旋转
					}
				}
			}else{
				clickPaste_del();//删除粘贴菜单
				if(key == 1){
					mouseR_dele();//删除鼠标右键dome
				}
			};
			/***********鼠标右键弹出菜单***********/
			if(key == 3){  
				if($("#mouseR").length == 0){//如果已展开右键菜单则跳出
					var cla = $(this);//传递append区域
					mouseR(cla,e,zIndexT,zIndexB);
				}
			} 
		}
	});
	//拖动选中事件
	$(document).on('mousedown', navPage, function(eventDown) 
	{
		var key =  eventDown.which; //获取鼠标键位  
		if(key == 1)//如果鼠标左键按下
		{  
			//判断点击相关素材不可执行
			var target = $(eventDown.target);
			if(target.closest(".canvas").not(".Locking").length == 0)
			{
				//  创建选框节点
				var $selectBoxDashed = $('<div class="select-box" id="select-box"></div>');
				$("body").append($selectBoxDashed);
				// 设置选框的初始位置
				var startX = eventDown.pageX || eventDown.offsetX;
				var startY = eventDown.pageY || eventDown.offsetY;
				$selectBoxDashed.css
				({
					left: startX,
					top : startY
				});
				//根据鼠标移动，设置选框宽高
				var __x = null;
				var __y = null;
				//监听鼠标移动事件
				$(document).on('mousemove', function(eventMove)
				{
					//根据鼠标移动，设置选框的位置、宽高
					__x = eventMove.pageX || eventMove.offsetX;
					__y = eventMove.pageY || eventMove.offsetY;
					// 暂存选框的位置及宽高，用于将 选中
					var __left   = Math.max(__x, startX);
					var minLeft  = Math.min(__x, startX);
					var __top    = Math.max(__y, startY);
					var minTop   = Math.min(__y, startY);
					var __width  = Math.abs(__x - startX);
					var __height = Math.abs(__y - startY);
					$selectBoxDashed.css(
					{
						left  : minLeft,
						top   : minTop,
						width : __width,
						height: __height
					});
					//  遍历容器中的选项，进行选中操作
					$(navPage+ "> .canvas").removeClass('is-selected');
					$(navPage+ "> .canvas").not(".Locking").each(function()
					{
						var $item = $(this);
						var itemX_pos = $item.prop('offsetWidth') + $item.offset().left;
						var itemY_pos = $item.prop('offsetHeight') + $item.offset().top;
						//判断添加以及删除
						var condition1 = itemX_pos <= __left;
						var condition2 = itemY_pos <= __top;			
						var condition3 = $item.offset().left >= minLeft;
						var condition4 = $item.offset().top  >= minTop;
						if(condition1 && condition2 && condition3 && condition4)
						{
							$item.addClass('is-selected');
						}else
						{
							$item.removeClass('is-selected');
						}
					});
				});
				$("body").one('mouseup', function()
				{
					//鼠标按键抬起删除鼠标移动事件
					$(document).off('mousemove');
					$selectBoxDashed.remove();
					var shu = $(navPage).children(".is-selected").length;
					if(shu > 1)
					{
						//预添加组合
						var arrayGroup = [];
						var kLeft = $(navPage).offset().left -1;
						var kTop  =  $(navPage).offset().top -1;
						$(navPage).children(".is-selected").each(function(index)
						{
							new_resizable($(this));//及时更新位置信息
							$(this).resizable("destroy");
							
							//$(this).draggable("destroy");
							//new_draggable($(this));
							var wh =  $(this).attr("wh");
							if(wh != undefined && wh != null && wh != -1)
							{
								var _wh = wh;
								var __wh = _wh.split(",");
								var Nheight = __wh[3] - __wh[2];
								var Nwidth  = __wh[1] - __wh[0];
								var NTop    = __wh[2] - kTop;
								var Nleft   = __wh[0] - kLeft;
								arrayGroup.push([Nleft,NTop,Nwidth,Nheight]);
							}
							if((index+1) == shu)
							{
								$(navPage).children(".is-selected").wrapAll('<div class="canvas temp_Group canvasId" rid="3" Lid="0"><div class="canvas-con"></div></div>');//添加组合前
								var minLeft  = -1;//获取最小left偏移量
								var minTop   = -1;//计算top偏移量和高
								var maxWidth = [];//计算宽度
								var maxHeight= [];//计算高度
								for (var LT = 0; LT < arrayGroup.length; LT++) 
								{
									//获取最小left
									if (minLeft > arrayGroup[LT][0] || minLeft === -1) 
									{
										minLeft = arrayGroup[LT][0];
									}
									//获取最小top
									if (minTop > arrayGroup[LT][1] || minTop === -1) 
									{
										minTop = arrayGroup[LT][1];
									}
									//计算宽高
									if((LT+1) == arrayGroup.length)
									{
										//计算宽
										for (var W = 0; W < arrayGroup.length; W++) 
										{
											var wid =(arrayGroup[W][0] + arrayGroup[W][2]) - minLeft;
											maxWidth.push(wid);
										}
										//计算高
										for (var H = 0; H < arrayGroup.length; H++) 
										{
											var hei =(arrayGroup[H][1] + arrayGroup[H][3]) - minTop;
											maxHeight.push(hei);
										}
									}
								}	
								var MaxW = (Math.max.apply(null, maxWidth));
								var MaxH = (Math.max.apply(null, maxHeight));
								//布局
								var Width   = MaxW;//parseInt(MaxW);
								var newLeft = minLeft;//parseInt(minLeft);
								var height  = MaxH;//parseInt(MaxH);
								var newTop  = minTop;//parseInt(minTop);
									zIndexT  = zIndexT + 1;
								$(navPage+ "> .temp_Group").css(
								{
									"top":newTop,
									"left":newLeft,
									"width":Width,
									"height":height,
									"z-index":zIndexT,
								});
								//初始化拖动
								new_draggable($(navPage+ "> .temp_Group"));
								$(navPage+ "> .temp_Group").transformable( 
								{
									rotatable:false,
									skewable:false,
									scalable:false     
								});
								/*从新计算选中元素宽高*/
								$(navPage+ "> .temp_Group").find(".is-selected").each(function(index)
								{
									if(index == 0)
									{
										$(this).addClass("Equal");
									}
									var thisTop = $(this).css("top").replace(/[a-z]/g,"");
									var thisLeft = $(this).css("left").replace(/[a-z]/g,"");
									var Top  = Number(thisTop) - Number(newTop) + "px";
									var Left = Number(thisLeft) - Number(newLeft) + "px";
									$(this).css({"top":Top,"left":Left});
									$(this).addClass("resiz_canvas");
									$(this).removeClass("is-selected");
									$(this).draggable("destroy");//禁止拖动
								});
								newFunction("F2");//画布与素材编辑栏切换
								newEdit("3",0);//调用素材编辑面板
							}
						});
					}
				});
			}
		}
	});
	//鼠标右键弹出粘贴菜单
	$(document).on("mousedown", navPage, function(e)
	{  
		if(copylone != 0){
			var target = $(e.target);
			if(target.closest(".canvas").length == 0){
				var key =  e.which; //获取鼠标键位  
				if(key == 3){
					e = e || window.event;
					_x = e.clientX;
					_y = e.clientY;
					clickPaste_del();//删除粘贴按钮
					clickPaste_tme(_x,_y);
					mouseR_dele();//删除鼠标右键dome
				}
			}
		}	
	});
};
/******************************* 快捷键以及右键菜单 ***************************************/
var newDialog 	 = 0;//元素删除本次编辑不在提示
//删除元素时本次编辑是否提示？
$(document).on("click", "#newDialog", function()
{
	if($(this).is(':checked'))
	{
		newDialog = 1;
	}else
	{
		newDialog = 0;
	}
})
//删除元素
function canvas_delect()
{
	var classId = $(".canvasId");
	if(classId.length != 0)
	{
		var Lid = classId.attr("Lid");
		if(Lid == 0)//未锁定
		{
			var rid = classId.attr("rid");
			if(rid == 7 || rid == 101 || rid == 103 )
			{
				if(newDialog == 0)
				{
					$('#type-dialogBox').dialogBox(
					{
						type:'correct',
						autoHide:false,
						zIndex:99999,
						hasMask:true,
						hasClose:true,
						hasBtn:true,
						effect:'sign',
						content:'删除模态框将删除所包含的素材,确认要删除吗?<div class="checkbox"><label><input type="checkbox" id="newDialog" >本次编辑不在提示</label></div>',
						confirm:function()
						{
							var mid = classId.children(".canvas-con").attr("mid");
							$("."+mid).remove();
							classId.remove();
						},
					});
				}else
				{
					var mid = classId.children(".canvas-con").attr("mid");
					$("."+mid).remove();
					classId.remove();
				}
			}else if(rid == 3 || rid == 4)//组合前
			{
				classId.find(".canvas").each(function(index)
				{
					var rid = $(this).attr("rid");
					if(rid == 7)
					{
						var mid = $(this).children(".addModal").attr("mid");
						$("."+mid).remove();
					}
					if((index+1) == classId.find(".canvas").length)
					{
						classId.remove();
					}
				})
			}else
			{
				classId.remove();
			}
			if($("#mouseR").length != 0)
			{
				$("#mouseR").remove();
			}
			newFunction("F1");//画布与素材编辑栏切换
		}else
		{
			tooltips("素材已锁定禁止删除！","Warning");
		}
	}
}
//上移一层
function mouse_Move()
{
	if($(".canvasId").length != 0)
	{
		if($(navPage+"> .canvas").not(".canvasId").length > 0 && !$("#mouse_Move").hasClass("zi_index"))
		{
			var $canvasId = $(navPage+"> .canvasId");
			var left     = $canvasId.prop('offsetLeft');
			var top      = $canvasId.prop('offsetTop');
			var widht    = $canvasId.prop('offsetWidth');
			var height   = $canvasId.prop("offsetHeight");
			var zIndexId = Number($canvasId.css("z-index"));
			var zIndex = [];//获取当前元素区域内素材层级
				zIndex.push(zIndexId);
			$(navPage+"> .canvas").not(".canvasId").each(function()
			{
				var $canvas = $(this);
				$canvas.addClass("iSbook");
				var bookX_pos = $canvas.prop('offsetWidth') + $canvas.prop('offsetLeft');
				var bookY_pos = $canvas.prop('offsetHeight') + $canvas.prop('offsetTop');
				var Contain1  = bookX_pos > left;
				var Contain2  = bookY_pos > top;
				var Contain3  = $canvas.prop('offsetLeft') < (left + widht);
				var Contain4  = $canvas.prop('offsetTop') < (top + height);
				if(Contain1 && Contain2 && Contain3 && Contain4)
				{
					var _Zindex = Number($canvas.css("z-index"));
					zIndex.push(_Zindex);
				}
			})
			var sIndex   = zIndex.sort();//数组排序
			//更改层级
			var addIndex;
			for(var z = 0; z < sIndex.length; z++)
			{
				if(zIndexId < sIndex[z])
				{  
					addIndex =  sIndex[z];
					break;
				}
			}
			//改变层级
			if(addIndex != undefined)
			{
				var maxzIndex = (Math.max.apply(null, sIndex));//提取最大值
				var minzIndex = (Math.min.apply(null, sIndex));//提取最小值

				//降级
				$(navPage+"> .iSbook").each(function(i)
				{
					var $iSbook = $(this);
					var zbook   = Number($iSbook.css("z-index"));
					if(zbook <= addIndex &&  zbook > zIndexId)
					{
						$iSbook.css("z-index",zbook-1);
					}
				})
				//升级
				$canvasId.css("z-index",addIndex);
				if($("#mouseR").length != 0)
				{
					if(addIndex == maxzIndex)
					{
						$("#mouseTop").addClass("zi_index");
						$("#mouse_Move").addClass("zi_index");
					}
					if($("#mouseBottom").hasClass("zi_index"))
					{
						$("#mouseBottom").removeClass("zi_index");
						$("#mouse_Down").removeClass("zi_index");
					}
				}
			}
		}
	}
}
//置于顶层
function mouseTop()
{
	if($(".canvasId").length != 0)
	{
		if($(navPage+"> .canvas").not(".canvasId").length > 0 && !$("#mouseTop").hasClass("zi_index"))
		{
			var $canvasId = $(navPage+"> .canvasId");
			var left     = $canvasId.prop('offsetLeft');
			var top      = $canvasId.prop('offsetTop');
			var widht    = $canvasId.prop('offsetWidth');
			var height   = $canvasId.prop("offsetHeight");
			var zIndexId = Number($canvasId.css("z-index"));
			var zIndex = [];//存为数组
			$(navPage+"> .canvas").not(".canvasId").each(function()
			{
				var $canvas = $(this);
				$canvas.addClass("iSbook");
				var bookX_pos = $canvas.prop('offsetWidth') + $canvas.prop('offsetLeft');
				var bookY_pos = $canvas.prop('offsetHeight') + $canvas.prop('offsetTop');
				var Contain1  = bookX_pos > left;
				var Contain2  = bookY_pos > top;
				var Contain3  = $canvas.prop('offsetLeft') < (left + widht);
				var Contain4  = $canvas.prop('offsetTop') < (top + height);
				if(Contain1 && Contain2 && Contain3 && Contain4)
				{
					var _Zindex = Number($canvas.css("z-index"));
					zIndex.push(_Zindex);
				}
			})
			//数组处理
			if(zIndex.length > 0)
			{
				var sIndex   = Math.max.apply(null, zIndex);
				if(sIndex > zIndexId)
				{
					$(navPage+"> .iSbook").each(function()
					{
						var $iSbook = $(this);
						var zbook   = Number($iSbook.css("z-index"));
						if(zbook <= sIndex &&  zbook > zIndexId)
						{
							$iSbook.css("z-index",zbook-1);
						}
					})
					$canvasId.css("z-index",sIndex);
					if($("#mouseR").length != 0)
					{
						if(!$("#mouseTop").hasClass("zi_index"))
						{
							$("#mouseTop").addClass("zi_index");
							$("#mouse_Move").addClass("zi_index");
						}
						if($("#mouseBottom").hasClass("zi_index"))
						{
							$("#mouseBottom").removeClass("zi_index");
							$("#mouse_Down").removeClass("zi_index");
						}
					}
				}
			}
		}
	}
}
//下移一层
function mouse_Down()
{
	if($(".canvasId").length != 0)
	{
		if($(navPage+"> .canvas").not(".canvasId").length > 0 && !$("#mouse_Down").hasClass("zi_index"))
		{
			var $canvasId = $(navPage+"> .canvasId");
			var left     = $canvasId.prop('offsetLeft');
			var top      = $canvasId.prop('offsetTop');
			var widht    = $canvasId.prop('offsetWidth');
			var height   = $canvasId.prop("offsetHeight");
			var zIndexId = Number($canvasId.css("z-index"));
			var zIndex = [];
				zIndex.push(zIndexId);
			$(navPage+"> .canvas").not(".canvasId").each(function()
			{
				var $canvas = $(this);
				$canvas.addClass("iSbook");
				var bookX_pos = $canvas.prop('offsetWidth') + $canvas.prop('offsetLeft');
				var bookY_pos = $canvas.prop('offsetHeight') + $canvas.prop('offsetTop');
				var Contain1  = bookX_pos > left;
				var Contain2  = bookY_pos > top;
				var Contain3  = $canvas.prop('offsetLeft') < (left + widht);
				var Contain4  = $canvas.prop('offsetTop') < (top + height);
				if(Contain1 && Contain2 && Contain3 && Contain4)
				{
					var _Zindex = Number($canvas.css("z-index"));
					zIndex.push(_Zindex);
				}
			})
			var sIndex  = zIndex.sort().reverse();
			var addIndex;
			for(var z = 0; z < sIndex.length; z++)
			{
				if(sIndex[z] < zIndexId)
				{  
					addIndex =  sIndex[z];
					break;
				}
			}
			if(addIndex != undefined)
			{
				var maxzIndex = (Math.max.apply(null, sIndex));//提取最大值
				var minzIndex = (Math.min.apply(null, sIndex));//提取最小值
				$(navPage+"> .iSbook").each(function()
				{
					var $iSbook = $(this);
					var zbook   = Number($iSbook.css("z-index"));
					if(zbook >= addIndex &&  zbook < zIndexId)
					{
						$iSbook.css("z-index",zbook+1);
					}
				});
				//升级
				$canvasId.css("z-index",addIndex);
				if($("#mouseR").length != 0)
				{
					if($("#mouseTop").hasClass("zi_index"))
					{
						$("#mouseTop").removeClass("zi_index");
						$("#mouse_Move").removeClass("zi_index");
					}
					if(addIndex == minzIndex)
					{
						$("#mouseBottom").addClass("zi_index");
						$("#mouse_Down").addClass("zi_index");
					}
				}
			}
		}
	}
}
//置于底层
function mouseBottom()
{
	if($(".canvasId").length != 0)
	{
		if($(navPage+"> .canvas").not(".canvasId").length > 0 && !$("#mouseBottom").hasClass("zi_index"))
		{
			var bookId = $(navPage+"> .canvasId");
			var left     = bookId.prop('offsetLeft');
			var top      = bookId.prop('offsetTop');
			var widht    = bookId.prop('offsetWidth');
			var height   = bookId.prop("offsetHeight");
			var zIndexId = Number(bookId.css("z-index"));
			var zIndex = [];//存为数组
			$(navPage+"> .canvas").not(".canvasId").each(function()
			{
				var book = $(this);
				book.addClass("iSbook");
				var bookX_pos = book.prop('offsetWidth') + book.prop('offsetLeft');
				var bookY_pos = book.prop('offsetHeight') + book.prop('offsetTop');
				var Contain1  = bookX_pos > left;
				var Contain2  = bookY_pos > top;
				var Contain3  = book.prop('offsetLeft') < (left + widht);
				var Contain4  = book.prop('offsetTop') < (top + height);
				if(Contain1 && Contain2 && Contain3 && Contain4)
				{
					var _Zindex = Number(book.css("z-index"));
					zIndex.push(_Zindex);
				}
			})
			//数组处理
			if(zIndex.length > 0)
			{
				var sIndex = Math.min.apply(null, zIndex);
				if(sIndex < zIndexId)
				{
					$(navPage+"> .iSbook").each(function()
					{
						var $iSbook = $(this);
						var zbook   = Number($iSbook.css("z-index"));
						if(zbook >= sIndex &&  zbook < zIndexId)
						{
							$iSbook.css("z-index",zbook+1);
						}
					})
					//升级
					bookId.css("z-index",sIndex);
					if($("#mouseR").length != 0)
					{
						if($("#mouseTop").hasClass("zi_index"))
						{
							$("#mouseTop").removeClass("zi_index");
							$("#mouse_Move").removeClass("zi_index");
						}
						if(!$("#mouseBottom").hasClass("zi_index"))
						{
							$("#mouseBottom").addClass("zi_index");
							$("#mouse_Down").addClass("zi_index");
						}
					}
				}
			}
		}
	}
}
//元素移动
function element_move(move)
{
	var classId = $(".canvasId");
	if(classId.length != 0)
	{
		var Lid = classId.attr("Lid");
		if(Lid == 0)//未锁定
		{
			if(move == "t")
			{
				var i = classId.prop('offsetTop');
				i--;
				classId.css("top",i);
			}else if(move == "l")
			{
				var i = classId.prop('offsetLeft');
				i--;
				classId.css("left",i);
			}else if(move == "r")
			{
				var i = classId.prop('offsetLeft');
				i++;
				classId.css("left",i);
				
			}else if(move == "b")
			{
				var i = classId.prop('offsetTop');
				i++;
				classId.css("top",i);
			}
		}else
		{
			tooltips("素材已锁定禁止移动！","Warning");
		}
	}
}
//元素锁定与解锁Lid = 0 未锁定 Lid = 1 锁定
function mouseLocking()
{
	var classId = $(navPage+"> .canvasId");
	if(classId.length != 0)
	{
		var Lid = Number(classId.attr("Lid"));
		var rid = Number(classId.attr("rid"));
		if(Lid == 0)
		{
			if(!classId.hasClass("txtId"))
			{
				if(rid != 3)
				{
					classId.addClass("Locking");
					classId.draggable("destroy");
					if(rid != 4)
					{
						$(navPage+"> .ui-resizable").resizable("destroy");
						$(navPage+"> .canvas").transformable('destroy');
					}
					classId.attr("Lid",1);
					mouseR_dele();
					newEdit(rid,1);//调用素材编辑面板
				}
			}else
			{
				tooltips("编辑中素材禁止锁定,请结束编辑后在锁定！","Warning");
			}
		}else
		{
			if(rid != 3)
			{
				new_draggable(classId);
				if(rid != 4)
				{
					new_resizable(classId);
					new_transformable(classId);
				}
				classId.attr("Lid",0);
				classId.removeClass("Locking");
				mouseR_dele();
				newEdit(rid,0);//调用素材编辑面板
			}
		}
	}
}
//删除右键功能模板
function mouseR_dele()
{
	if($("#mouseR").length != 0)
	{
		$("#mouseR").remove();//删除鼠标右键dome
	}
}
//删除层级状态
function iSbookDel()
{
	if($(".iSbook").length != 0)
	{
		$(".iSbook").removeClass("iSbook");
	}
}
/** 删除粘贴模板 **/
function clickPaste_del()
{
	if($("#clickPaste").length != 0)
	{
		$("#clickPaste").remove();
	}
}
//未组合前解除组合
function Group_del()
{
	if($("#pc-center").find(".temp_Group").length != 0)
	{
		var GroupTop  = $(".temp_Group").css("top").replace(/[a-z]/g,"");
		var GroupLeft = $(".temp_Group").css("left").replace(/[a-z]/g,"");
		$(".temp_Group > .canvas-con > .resiz_canvas").unwrap().unwrap();
		$(".Equal").removeClass("Equal");
		$(navPage+"> .resiz_canvas").each(function()
		{
			var thisTop   = $(this).css("top").replace(/[a-z]/g,"");
			var thisLeft  = $(this).css("left").replace(/[a-z]/g,"");
			var top       = Number(thisTop) + Number(GroupTop);
			var left      = Number(thisLeft) + Number(GroupLeft);
			$(this).css({"top":top,"left":left});
			new_draggable($(this));
			$(this).removeClass("resiz_canvas");
		});
	}
}
//组合
function book_Group()
{
	if($(navPage+"> .temp_Group").length != 0)
	{
		$(".temp_Group").attr("rid",4);
		$(".temp_Group").addClass("book_Group");
		$(".temp_Group > .canvas-con").append('<div class="Group_is"></div>');
		$(".temp_Group").removeClass("temp_Group");
		$(".Equal").removeClass("Equal");
		mouseR_dele();//删除鼠标右键dome
		newEdit("4",0);//调用素材编辑面板
	}
}
//组合后解除组合
function book_Group_del()
{
	var classId = $(navPage+"> .canvasId");
	if(classId.hasClass("book_Group"))
	{
		var GroupTop  = classId.css("top").replace(/[a-z]/g,"");
		var GroupLeft = classId.css("left").replace(/[a-z]/g,"");
		$(navPage+"> .canvasId > .canvas-con > .resiz_canvas").unwrap().unwrap();
		$(navPage+"> .Group_is").remove();
		$(navPage+"> .resiz_canvas").each(function()
		{
			var thisTop   = $(this).css("top").replace(/[a-z]/g,"");
			var thisLeft  = $(this).css("left").replace(/[a-z]/g,"");
			var top       = Number(thisTop) + Number(GroupTop);
			var left      = Number(thisLeft) + Number(GroupLeft);
			$(this).css({"top":top,"left":left});
			new_draggable($(this));
			$(this).removeClass("resiz_canvas");
		})
		mouseR_dele();//删除鼠标右键dome
		newFunction("F1");//调用画布编辑面板
	}
}
/****************************************** 元素对齐与分布方式 ************************************************/
//左对齐
function book_left()
{
	var left = $(".Equal").css("left");
	$(navPage+"> .temp_Group > .canvas-con > .resiz_canvas").not(".Equal").css("left",left);
}
//水平居中对齐
function book_Scenter()
{
	var top  = $(".Equal").css("top").replace(/[a-z]/g,"");
	var heg  = $(".Equal").prop('offsetHeight');
	var core = Number(top) + (Number(heg)/2);
	$(navPage+"> .temp_Group > .canvas-con > .resiz_canvas").not(".Equal").each(function()
	{
		var rHeight = $(this).prop('offsetHeight');
		var Top  = core -(rHeight/2);
		$(this).css("top",Top + "px");
	})
}
//右对齐
function book_right()
{
	var left = $(".Equal").css("left").replace(/[a-z]/g,"");
	var wid  = $(".Equal").prop('offsetWidth');
	var rid  = Number(left) + Number(wid);
	$(navPage+"> .temp_Group > .canvas-con > .resiz_canvas").not(".Equal").each(function()
	{
		var rWid = $(this).prop('offsetWidth');
		var righ =  Number(rid) - Number(rWid);
		$(this).css("left",righ);
	})
}
//上对齐
function book_top()
{
	var top = $(".Equal").css("top");
	$(navPage+"> .temp_Group > .canvas-con > .resiz_canvas").css("top",top);
}
//垂直居中对齐
function book_center()
{
	var left = $(".Equal").css("left").replace(/[a-z]/g,"");
	var wid  = $(".Equal").prop('offsetWidth');
	var core = Number(left) + (Number(wid)/2);
	$(navPage+"> .temp_Group > .canvas-con > .resiz_canvas").not(".Equal").each(function()
	{
		var rWidth = $(this).prop('offsetWidth');
		var lef  = core -(rWidth/2);
		$(this).css("left",lef);
	})
}
//下对齐
function book_bottom()
{
	
	var top = $(".Equal").css("top").replace(/[a-z]/g,"");
	var hei = $(".Equal").prop('offsetHeight');
	var bot  = Number(top) + Number(hei);
	$(navPage+"> .temp_Group > .canvas-con > .resiz_canvas").not(".Equal").each(function()
	{
		var rhei = $(this).prop('offsetHeight');
		var rbot =  Number(bot) - Number(rhei);
		$(this).css("top",rbot);
	})
}
//水平等间距
function book_Horizontal()
{
	var arrHorizontal = [];//定义数组
	var arrw = $(".temp_Group").width();//获取选中宽度
	var len  = $(".temp_Group > .canvas-con > .resiz_canvas").length;//获取个数
	var nand  = 0;//定义选中元素的总宽度
	$(".temp_Group > .canvas-con > .resiz_canvas").each(function(index)
	{
		var cla   = "Horizontal"+index;//添加标识
		$(this).addClass(cla);
		var left  = $(this).prop('offsetLeft');//获取left
		var widt  = $(this).width();//获取宽度
		nand      = widt + nand;//获取总宽度
		arrHorizontal.push([cla,left,widt]);//更细数组
		if((index+1) == len)
		{
			var arrNew  = arrHorizontal.sort(ascend);//数组排序
			var spacing = (arrw - nand)/(len-1);//计算平局间距
			var nleft = 0;//获取升序间距
			$("."+arrNew[0][0]).css("left","0");
			$("."+arrNew[0][0]).removeClass(arrNew[0][0]);//删除第一个标识
			for(var a=1;a<arrNew.length;a++)
			{
				nleft  = nleft + arrNew[a-1][2] + spacing;//获取前一个数组间距+平均间距
				$("."+arrNew[a][0]).css("left",nleft)
				$("."+arrNew[a][0]).removeClass(arrNew[a][0]);
			}
		}
	});
}
//垂直等间距
function  book_Vertical()
{
	var arrVertical = [];//定义数组
	var arrH = $(".temp_Group").height();//获取选中宽度
	var len  = $(".temp_Group > .canvas-con > .resiz_canvas").length;//获取个数
	var hand  = 0;//定义选中元素的总高度
	$(".temp_Group > .canvas-con > .resiz_canvas").each(function(index)
	{
		var cla  = "Vertical"+index;//添加标识
		$(this).addClass(cla);
		var top  = $(this).prop('offsetTop');//获取top
		var heig = $(this).height();//获取宽度
		hand     = heig + hand;//获取总宽度
		arrVertical.push([cla,top,heig]);//更细数组
		if((index+1) == len)
		{
			var arrNew  = arrVertical.sort(ascend);//数组排序
			var spacing = (arrH - hand)/(len-1);//计算平局间距
			var ntop    = 0;//获取升序间距
			$("."+arrNew[0][0]).css("top","0");
			$("."+arrNew[0][0]).removeClass(arrNew[0][0]);//删除第一个标识
			for(var a=1;a<arrNew.length;a++)
			{
				ntop  = ntop + arrNew[a-1][2] + spacing;//获取前一个数组间距+平均间距
				$("."+arrNew[a][0]).css("top",ntop)
				$("."+arrNew[a][0]).removeClass(arrNew[a][0]);
			}
		}
	});
}
//二维数组升序排序公共方法
function ascend(x,y)
{
    return x[1] - y[1];
}
//等宽
function new_EqualWidth()
{
	var w = $(".Equal").prop('offsetWidth');
	 $(".temp_Group > .canvas-con > .resiz_canvas").not(".Equal").each(function(index)
	{
    	$(this).css("width",w);
    	if($(this).children(".canvas-con").hasClass("newECharts"))
    	{
    		var id = $(this).children(".canvas-con").children(".myECharts").attr("id");
			var myChart = echarts.init(document.getElementById(id));
			myChart.resize();
    	}
	})
}
//等高
function new_EqualHeight()
{
	var h = $(".Equal").prop('offsetHeight');
	 $(".temp_Group > .canvas-con > .resiz_canvas").not(".Equal").each(function(index)
	{
		$(this).css("height",h);
		if($(this).children(".canvas-con").hasClass("newECharts"))
    	{
			var id = $(this).children(".canvas-con").children(".myECharts").attr("id");
			var myChart = echarts.init(document.getElementById(id));
			myChart.resize();
    	}
	})
}
//同角度
function new_EqualAngle()
{
	var v = $(".Equal").css("transform");
	if(v !== "none")
	{
		$(".temp_Group > .canvas-con > .resiz_canvas").not(".Equal").each(function(index)
		{
			 $(this).css("transform",v);
		})
	}
}
//同宽高
function new_EqualWH()
{
	var w = $(".Equal").prop('offsetWidth');
	var h = $(".Equal").prop('offsetHeight');
	$(".temp_Group > .canvas-con > .resiz_canvas").not(".Equal").each(function(index)
	{
		 $(this).css({"width":w,"height":h});
		 if($(this).children(".canvas-con").hasClass("newECharts"))
    	 {
			 var id = $(this).children(".canvas-con").children(".myECharts").attr("id");
			 var myChart = echarts.init(document.getElementById(id));
			 myChart.resize();
    	 }
	})
}
//删除模态框方法
function del_Modal(href)
{
	$(href).find(".canvas").each(function()
	{
		var rid = $(this).attr("rid");
		if(rid == 7)
		{
			var mid = $(this).children(".canvas-con").attr("mid");
			$("."+mid).remove();
		}
	})
}
/******************************************** 素材功能按钮 ****************************************************************/
$(function()
{
	//更新背景颜色
	$("#canvas-bac").spectrum(
	{
		allowEmpty:true,//允许为空,显示清除颜色按钮
		color:"transparent",//初始化颜色
		showInput:true,//显示输入
		containerClassName:"panelColor",//引用类选择器,可以改变颜色选择器面板的样式
		replacerClassName:"inputColor",//引用类选择器,可以改变颜色选择器的样式
		showInitial:true,//显示初始颜色,提供现在选择的颜色和初始颜色对比
		showPalette:true,//显示选择器面板
		showSelectionPalette: true,//记住选择过的颜色
		clickoutFiresChange: false,//单击选择器外部,如果颜色有改变则应用
		showAlpha:true,//显示透明度选择
		maxPaletteSize:10,//记住选择过的颜色的最大数量
		preferredFormat:"rgb",//输入框颜色格式,(hex十六进制,hex3十六进制可以的话只显示3位,hsl,rgb三原色,name英文名显示)
		localStorageKey:false,//把选择过的颜色存在浏览器上
		clickoutFiresChange:true,//单击选择器外部,如果颜色有改变则应用
		cancelText: "关闭",
		chooseText: "确定",
		appendTo: "body",//选择选择器容器是附加到哪个元素
		palette:
		[
			[
				"#FFFFFF", "#000000", "#696969", "#FF7D23", "#AA40FF", "#1F0068", "#B81B6C", "#4617B4", "#E064B7", "#FF1D77", "#2D004E", "#FF768C", "#B81B1B", "#7200AC", "#D39DD9", "#FF2E12", "#C1004F", "#E1B700", "#E56C19", "#4E0038", "#83BA1F", "#FF981D", "#4E0000", "#91D100", "#15992A", "#B01E00", "#00AAAA", "#00C13F", "#2E1700", "#00D8CC", "#004A00", "#632F00", "#569CE3", "#119900", "#AE113D", "#56C5FF", "#004D60", "#2673EC", "#1B58B8", "#008287", "#78BA00", "#1FAEFF", "#001E4E", "#F4B300", "#691BB8", "#006AC1", "#ff461f", "#003472", "#057748", "#be002f", "#8d4bbb", "#ff2d51", "#3399FF", "#FFFF66", "#FF99CC", "#FF6666", "#CCCCCC", "#CC9966", "#99FFCC", "#99CC66", "#9966CC", "#66FF66", "#6699CC", "#666666"
			]
		],
		change:function(color)
		{
			var hexColor = "transparent";
	　　　　if(color)
			{
	　　　　　　hexColor = color.toRgbString();
	　　　　}
			$(".canvasId > .canvas-con").css("background-color",hexColor);
		},
		move:function(color)
		{
			var hexColor = "transparent";
	　　　　if(color)
			{
	　　　　　　hexColor = color.toRgbString();
	　　　　}
			$(".canvasId > .canvas-con").css("background-color",hexColor);
		}
	});

    //更新图表颜色
    $("#canvas-col").spectrum(
        {
            allowEmpty:true,//允许为空,显示清除颜色按钮
            color:"transparent",//初始化颜色
            showInput:true,//显示输入
            containerClassName:"panelColor",//引用类选择器,可以改变颜色选择器面板的样式
            replacerClassName:"inputColor",//引用类选择器,可以改变颜色选择器的样式
            showInitial:true,//显示初始颜色,提供现在选择的颜色和初始颜色对比
            showPalette:true,//显示选择器面板
            showSelectionPalette: true,//记住选择过的颜色
            clickoutFiresChange: false,//单击选择器外部,如果颜色有改变则应用
            showAlpha:true,//显示透明度选择
            maxPaletteSize:10,//记住选择过的颜色的最大数量
            preferredFormat:"rgb",//输入框颜色格式,(hex十六进制,hex3十六进制可以的话只显示3位,hsl,rgb三原色,name英文名显示)
            localStorageKey:false,//把选择过的颜色存在浏览器上
            clickoutFiresChange:true,//单击选择器外部,如果颜色有改变则应用
            cancelText: "关闭",
            chooseText: "确定",
            appendTo: "body",//选择选择器容器是附加到哪个元素
            palette:
                [
                    [
                        "#FFFFFF", "#000000", "#696969", "#FF7D23", "#AA40FF", "#1F0068", "#B81B6C", "#4617B4", "#E064B7", "#FF1D77", "#2D004E", "#FF768C", "#B81B1B", "#7200AC", "#D39DD9", "#FF2E12", "#C1004F", "#E1B700", "#E56C19", "#4E0038", "#83BA1F", "#FF981D", "#4E0000", "#91D100", "#15992A", "#B01E00", "#00AAAA", "#00C13F", "#2E1700", "#00D8CC", "#004A00", "#632F00", "#569CE3", "#119900", "#AE113D", "#56C5FF", "#004D60", "#2673EC", "#1B58B8", "#008287", "#78BA00", "#1FAEFF", "#001E4E", "#F4B300", "#691BB8", "#006AC1", "#ff461f", "#003472", "#057748", "#be002f", "#8d4bbb", "#ff2d51", "#3399FF", "#FFFF66", "#FF99CC", "#FF6666", "#CCCCCC", "#CC9966", "#99FFCC", "#99CC66", "#9966CC", "#66FF66", "#6699CC", "#666666"
                    ]
                ],
            change:function(color)
            {
                var hexColor = "transparent";
                if(color)
                {
                    hexColor = color.toRgbString();
                }

                $(".canvasId > .canvas-con").attr("colorRgb",hexColor);

				var ID = $(".canvasId > .canvas-con > .myECharts").attr("id");
				var myChart = echarts.init(document.getElementById(ID));
				var rid = $(".canvasId").attr("rid");

				switch(rid){
					case '14'://曲线（多选）
                        myChart.setOption({
                            title: {
                                textStyle: {
                                    color: hexColor
                                }
                            },
                            legend: {
                                textStyle: {
                                    color: hexColor
                                },
                            },
                            xAxis: {
                                axisLine: {
                                    lineStyle: {
                                        color: hexColor
                                    }
                                }

                            },
                            yAxis: {
                                axisLine: {
                                    lineStyle: {
                                        color: hexColor
                                    }
                                }

                            },
                        })
						break;
                    case '15'://曲线（单选）
                        myChart.setOption({
                            title: {
                                textStyle: {
                                    color: hexColor
                                }
                            },
                            legend: {
                                textStyle: {
                                    color: hexColor
                                },
                            },
                            xAxis: {
                                axisLine: {
                                    lineStyle: {
                                        color: hexColor
                                    }
                                }

                            },
                            yAxis: {
                                axisLine: {
                                    lineStyle: {
                                        color: hexColor
                                    }
                                }

                            },
                        })
                        break;
                    case '16'://曲线区域图
                        myChart.setOption({
                            title: {
                                textStyle: {
                                    color: hexColor
                                }
                            },
                            legend: {
                                textStyle: {
                                    color: hexColor
                                },
                            },
                            xAxis: {
                                axisLine: {
                                    lineStyle: {
                                        color: hexColor
                                    }
                                }

                            },
                            yAxis: {
                                axisLine: {
                                    lineStyle: {
                                        color: hexColor
                                    }
                                }

                            },
                        })
                        break;
                    case '21'://分辨带曲线
                        myChart.setOption({
                            title: {
                                textStyle: {
                                    color: hexColor
                                }
                            },
                            legend: {
                                textStyle: {
                                    color: hexColor
                                },
                            },
                            xAxis: {
                                axisLine: {
                                    lineStyle: {
                                        color: hexColor
                                    }
                                }

                            },
                            yAxis: {
                                axisLine: {
                                    lineStyle: {
                                        color: hexColor
                                    }
                                }

                            },
                        })
                        break;
                    case '30'://柱状图（竖）
                        myChart.setOption({
                            title: {
                                textStyle: {
                                    color: hexColor
                                }
                            },
                            legend: {
                                textStyle: {
                                    color: hexColor
                                },
                            },
                            xAxis: {
                                axisLine: {
                                    lineStyle: {
                                        color: hexColor
                                    }
                                }

                            },
                            yAxis: {
                                axisLine: {
                                    lineStyle: {
                                        color: hexColor
                                    }
                                }

                            },
                        })
                        break;
					case '31':
                        myChart.setOption({
                            title: {
                                textStyle: {
                                    color: hexColor
                                }
                            },
                            legend: {
                                textStyle: {
                                    color: hexColor
                                },
                            }

                        })
                        break;



				}
            },
            move:function(color)
            {
                var hexColor = "transparent";
                if(color)
                {
                    hexColor = color.toRgbString();
                }
                $(".canvasId > .canvas-con").css("background-color",hexColor);
            }
        });



	//边框大小
	$("#canvas_slider").slider(
	{
		range:"max",
		min:0,
		max:10,
		value:0,
		slide:function(event, ui) 
		{
			$("#canvas_size").val(ui.value);
			$(".canvasId > .canvas-con").css("border-width",ui.value);
		}
	});
	//输入框动态更新边框大小
	$("#canvas_size").on('input propertychange', function(e)
	{
		var size;
		if($(this).val() <= 10 && $(this).val() >= 0)
		{
			size = $(this).val();
		}else
		{
			tooltips("输入范围0-10","Warning");
			$(this).val("0");
			size = 0;
		}
		$(".canvasId > .canvas-con").css("border-width",size);
		$("#canvas_slider").slider("value",size);
	});
	//画布更新边框样式
	$("#canvas_select").change(function()
	{
		$(".canvasId > .canvas-con").css("border-style",$(this).val());
	});
	//更新边框颜色
	$("#canvas_full").spectrum(
	{
		allowEmpty:true,//允许为空,显示清除颜色按钮
		color:"transparent",//初始化颜色
		showInput:true,//显示输入
		containerClassName:"panelColor",//引用类选择器,可以改变颜色选择器面板的样式
		replacerClassName:"inputColor",//引用类选择器,可以改变颜色选择器的样式
		showInitial:true,//显示初始颜色,提供现在选择的颜色和初始颜色对比
		showPalette:true,//显示选择器面板
		showSelectionPalette: true,//记住选择过的颜色
		clickoutFiresChange: false,//单击选择器外部,如果颜色有改变则应用
		showAlpha:true,//显示透明度选择
		maxPaletteSize:10,//记住选择过的颜色的最大数量
		preferredFormat:"rgb",//输入框颜色格式,(hex十六进制,hex3十六进制可以的话只显示3位,hsl,rgb三原色,name英文名显示)
		localStorageKey:false,//把选择过的颜色存在浏览器上
		clickoutFiresChange:true,//单击选择器外部,如果颜色有改变则应用
		cancelText: "关闭",
		chooseText: "确定",
		appendTo: "body",//选择选择器容器是附加到哪个元素
		palette:
		[
			[
				"#FFFFFF", "#000000", "#696969", "#FF7D23", "#AA40FF", "#1F0068", "#B81B6C", "#4617B4", "#E064B7", "#FF1D77", "#2D004E", "#FF768C", "#B81B1B", "#7200AC", "#D39DD9", "#FF2E12", "#C1004F", "#E1B700", "#E56C19", "#4E0038", "#83BA1F", "#FF981D", "#4E0000", "#91D100", "#15992A", "#B01E00", "#00AAAA", "#00C13F", "#2E1700", "#00D8CC", "#004A00", "#632F00", "#569CE3", "#119900", "#AE113D", "#56C5FF", "#004D60", "#2673EC", "#1B58B8", "#008287", "#78BA00", "#1FAEFF", "#001E4E", "#F4B300", "#691BB8", "#006AC1", "#ff461f", "#003472", "#057748", "#be002f", "#8d4bbb", "#ff2d51", "#3399FF", "#FFFF66", "#FF99CC", "#FF6666", "#CCCCCC", "#CC9966", "#99FFCC", "#99CC66", "#9966CC", "#66FF66", "#6699CC", "#666666"
			]
		],
		change:function(color)
		{
			var hexColor = "transparent";
	　　　　if(color)
			{
	　　　　　　hexColor = color.toRgbString();
	　　　　}
			$(".canvasId > .canvas-con").css("border-color",hexColor);
		},
		move:function(color)
		{
			var hexColor = "transparent";
	　　　　if(color)
			{
	　　　　　　hexColor = color.toRgbString();
	　　　　}
			$(".canvasId > .canvas-con").css("border-color",hexColor);
		}
	});
	//圆角大小
	$("#canvas_radius").slider(
	{
		range:"max",
		min:0,
		max:50,
		value:0,
		slide:function(event, ui) 
		{
			$("#canvas_radius_size").val(ui.value);
			$(".canvasId > .canvas-con").css("border-radius",ui.value+"%");
		}
	});
	//输入框动态更新圆角大小
	$("#canvas_radius_size").on('input propertychange', function(e)
	{
		var size;
		if($(this).val() <= 50 && $(this).val() >= 0)
		{
			size = $(this).val();
		}else
		{
			tooltips("输入范围0-50","Warning");
			$(this).val("0");
			size = 0;
		}
		$(".canvasId > .canvas-con").css("border-radius",size+"%");
		$("#canvas_radius").slider("value",size);
	});
	//透明度
	$("#canvas_opacity").slider(
	{
		range:"max",
		min:0,
		max:10,
		value:10,
		slide:function(event, ui) 
		{
			$("#canvas_opacity_size").val(ui.value);
			$(".canvasId > .canvas-con").css("opacity",ui.value/10);
		}
	});
	//输入框动态更新透明度
	$("#canvas_opacity_size").on('input propertychange', function(e)
	{
		var size;
		if($(this).val() <= 10 && $(this).val() >= 0)
		{
			size = $(this).val();
		}else
		{
			tooltips("输入范围0-10","Warning");
			$(this).val("10");
			size = 10;
		}
		$(".canvasId > .canvas-con").css("opacity",size/10);
		$("#canvas_opacity").slider("value",size);
	});
	//输入框动态更新宽高位置
	$("#canvas_w").on('input propertychange', function(e)
	{
		if($(this).val() > 0)
		{
			var size = $(this).val();
			$(".canvasId").css("width",size+"px");
			var rid = $(".canvasId").attr("rid");
			if(rid == 10){
				
			}
			if($(".canvasId").children(".canvas-con").hasClass("newECharts"))
			{
				var id  = $(".canvasId").children(".canvas-con").children(".myECharts").attr("id");
				switch(rid)
				{
					case "22"://管道类型
						var sid = $(".canvasId").children(".canvas-con").attr("sid");
						if(sid == 1){//管道(1)
							setTimeout(function() 
							{
								curve_12(id,1);
							},300);
						}else if(sid == 2){//管道(2)
							setTimeout(function() 
							{
								curve_13(id,1);
							},300);
						}else if(sid == 3){//管道(3)
							setTimeout(function() 
							{
								curve_14(id,1);
							},300);
						}
						break;
					case "23"://弯道类型
						var sid = $(".canvasId").children(".canvas-con").attr("sid");
						if(sid == 1){//弯道(1)
							setTimeout(function() 
							{
								curve_15(id,1);
							},300);
						}else if(sid == 2){//弯道(2)
							setTimeout(function() 
							{
								curve_16(id,1);
							},300);
						}else if(sid == 3){//弯道(3)
							setTimeout(function() 
							{
								curve_17(id,1);
							},300);
						}
						break;
					default:
					var myChart = echarts.init(document.getElementById(id));
					myChart.resize();			
				}		
			}
		}else
		{
			tooltips("输入范围>0,并且只能为整数","Warning");
		}
		
	});
	$("#canvas_h").on('input propertychange', function(e)
	{
		if($(this).val() > 0)
		{
			var size = $(this).val();
			$(".canvasId").css("height",size+"px");
			var rid = $(".canvasId").attr("rid");
			if(rid == 10){
				
			}
			if($(".canvasId").children(".canvas-con").hasClass("newECharts"))
			{
				var id  = $(".canvasId").children(".canvas-con").children(".myECharts").attr("id");
				switch(rid)
				{
					case "22":
						var sid = $(".canvasId").children(".canvas-con").attr("sid");
						if(sid == 1){//管道(1)
							setTimeout(function() 
							{
								curve_12(id,1);
							},300);
						}else if(sid == 2){//管道(2)
							setTimeout(function() 
							{
								curve_13(id,1);
							},300);
						}else if(sid == 3){//管道(3)
							setTimeout(function() 
							{
								curve_14(id,1);
							},300);
						}
						break;
					case "23"://弯道类型
						var sid = $(".canvasId").children(".canvas-con").attr("sid");
						if(sid == 1){//弯道(1)
							setTimeout(function() 
							{
								curve_15(id,1);
							},300);
						}else if(sid == 2){//弯道(2)
							setTimeout(function() 
							{
								curve_16(id,1);
							},300);
						}else if(sid == 3){//弯道(3)
							setTimeout(function() 
							{
								curve_17(id,1);
							},300);
						}
						break;
					default:
					var myChart = echarts.init(document.getElementById(id));
					myChart.resize();			
				}		
			}
		}else
		{
			tooltips("输入范围>0,并且只能为整数","Warning");
		}
	});
	$("#canvas_left").on('input propertychange', function(e)
	{
		if($(this).val() > 0)
		{
			var size = $(this).val();
			$(".canvasId").css("left",size+"px");
		}else
		{
			tooltips("输入范围>0,并且只能为整数","Warning");
		}
	});
	$("#canvas_top").on('input propertychange', function(e)
	{
		if($(this).val() > 0)
		{
			var size = $(this).val();
			$(".canvasId").css("top",size+"px");
		}else
		{
			tooltips("输入范围>0,并且只能为整数","Warning");
		}
	});
	//输入框动态更新旋转角度
	$("#canvas_Rotation_Slide").slider(
	{
		range:"max",
		min:0,
		max:360,
		value:0,
		slide:function(event, ui) 
		{
			$("#canvas_Rotation").val(ui.value);
			var size = ui.value;
			var cosVal = Math.cos(size * Math.PI / 180);
			var sinVal = Math.sin(size * Math.PI / 180);
			var valTransform = 'matrix('+ cosVal.toFixed(6) +','+ sinVal.toFixed(6) +','+ (-1 * sinVal).toFixed(6) +','+ cosVal.toFixed(6) +',0,0)';
			$(".canvasId").css("transform","rotate("+size+"deg)");
		}
	});
	$("#canvas_Rotation").on('input propertychange', function(e)
	{
		var size;
		if($(this).val() <= 360 && $(this).val() >= 0)
		{
			size = $(this).val();
		}else
		{
			tooltips("输入范围0-360","Warning");
			$(this).val("0");
			size = 0;
		}
		var cosVal = Math.cos(size * Math.PI / 180);
		var sinVal = Math.sin(size * Math.PI / 180);
		var valTransform = 'matrix('+ cosVal.toFixed(6) +','+ sinVal.toFixed(6) +','+ (-1 * sinVal).toFixed(6) +','+ cosVal.toFixed(6) +',0,0)';
		$(".canvasId").css("transform","rotate("+size+"deg)");
		$("#canvas_Rotation_Slide").slider("value",size);
		
	});
	//锁定
	$(document).on("click", "#locking", function()
	{
		mouseLocking();
	})
	//取消锁定
	$(document).on("click", "#Unlock", function()
	{
		mouseLocking();
	})
	//双击编辑文本	
	$(document).on('dblclick', ".canvasTextNone", function(e)
	{   
		var Lid = $(".canvasId").attr("Lid");
		if(Lid == 0)//未锁定
		{
			$(".canvasId").addClass("txtId");
			$(".txtId" ).draggable("destroy");
			$("#new-ueditorNone").hide();
			$(this).hide();
			var $target = $(this).prev(".canvasText");
			var content = $target.html();
			var currentParnet = ue.container.parentNode.parentNode;
			var currentContent = ue.getContent();
			$target.html('');
			$target.append(ue.container.parentNode);
			ue.reset();
			setTimeout(function(){
				ue.setContent(content);
			},200)
			$(currentParnet).html(currentContent);
		}else
		{
			tooltips("素材已锁定禁止编辑,请解锁后在进行编辑！","Warning");
		}
	})
	//选择超链接
	$(document).on("change", "#ChoiceHyperlink", function()
	{
		var link = $(this).val();
		if(link != -1){
			var pwd = $(this).find("option:selected").attr("pwd");
			$(".canvasId >.canvas-con >a").attr("href",link);
			$("#customHyperlink").val("");
			$(".canvasId >.canvas-con >a").removeAttr("p");
			$("#passwordlink").val("");
			if(pwd == 0){
				$("#yunNewPassword").hide();
				$(".canvasId >.canvas-con").attr("link","0,"+link+",P0");
			}else if(pwd == 1){
				$("#yunNewPassword").show();
				$(".canvasId >.canvas-con").attr("link","0,"+link+",p1");
			}else{
				$("#yunNewPassword").hide();
				$(".canvasId >.canvas-con").attr("link","0,"+link+',p0');
			}
		}else{
			$(".canvasId >.canvas-con >a").attr("href","javascript:;");
		}
	});
	//输入超链接密码
	$("#passwordlink").on('input propertychange', function()
	{
		var pwd = $(this).val();  
        var str = Base64.encode(pwd);//密码加密
        $(".canvasId >.canvas-con >a").attr("p",str);
	});
	//自定义超链接
	$("#customHyperlink").on('input propertychange', function(e)
	{
		var link = $(this).val();
		if(link.substr(0,7).toLowerCase() == "http://" || link.substr(0,8).toLowerCase() == "https://")
		{
			$(".canvasId >.canvas-con >a").attr("href",link);
		}else{
			$(".canvasId >.canvas-con >a").attr("href","http://"+link);
		}
		$("#ChoiceHyperlink").val("-1");
		$("#yunNewPassword").hide();
		$(".canvasId >.canvas-con").attr("link","1,"+link+",p2");
	});
	//测试超链接
	$(document).on("click", "#canvas_link, #testLink", function(e)
	{
		var rid = $(".canvasId").attr("rid");
		if(rid == 29){
			var link = $(".canvasId >.canvas-con >a").attr("href");
			if(link != "javascript:;"){
				var pwd=$(".canvasId >.canvas-con >a").attr("p");
				if(pwd){
					pwd=Base64.decode(pwd);
					$("#yunzutai-pwd").val(pwd);
					$("#yunzutaiForm").attr("action",link);
					if (e && e.preventDefault ) {
		                //阻止默认浏览器动作(W3C) 
		                e.preventDefault(); 
			        }else{
			            //IE中阻止函数器默认动作的方式 
			            window.event.returnValue = false; 
			            return false;
			        }
					$("#yunzutaiForm").submit();
				}else{
					window.open(link);
				}
			}else{
				tooltips("您还没有选择或定义超链接","Warning");
			}
		}else{
			if(!$(".canvasId").hasClass("txtId"))
			{
				var link = $(".canvasId").find("a").length;
				if(link > 0)
				{
					$(".canvasId").find("a").each(function()
					{
						var links = $(this).attr("href");
						window.open(links); 
					})
				}else
				{
					tooltips("当前素材没有超链接","Warning");
				}
			}else
			{
				tooltips("素材正在编辑,请编辑完成后进行测试！","Warning");
			}
		}
	});
	//基础文本编辑
	$(document).on("change", "#basicSize", function()
	{//字体大小
		var size = $(this).val();
		if(size != -1)
		{
			$(".canvasId").css("font-size",size)
		}else
		{
			$(".canvasId").css("font-size","");
		}
	});
	$(document).on("change", "#basicFamily", function()
	{//字体类型
		var size = $(this).val();
		if(size != -1)
		{
			$(".canvasId").css("font-family",size)
		}else
		{
			$(".canvasId").css("font-family","");
		}
	});
	$(document).on("change", "#basicHeight", function()
	{//字体行高
		var size = $(this).val();
		if(size != -1)
		{
			if(size == 0)
			{
				var hei = $(".canvasId").height()+"px";
				$(".canvasId").css("line-height",hei)
			}else
			{
				$(".canvasId").css("line-height",size)
			}
		}else
		{
			$(".canvasId").css("line-height","");
		}
	});
	$(document).on("change", "#basicCenter", function()
	{//字体对齐方式

     var rid =    $(".canvasId").attr("rid");
        var size = $(this).val();
     if(rid=="109"){
         if(size != -1)
         {
             $(".canvasId > .canvas-con").css("text-align",size)
         }else
         {
             $(".canvasId > .canvas-con").css("text-align","");
         }
	 }else{
         if(size != -1)
         {
             $(".canvasId").css("text-align",size)
         }else
         {
             $(".canvasId").css("text-align","");
         }
	 }




	});
	$(document).on("click", "#basicWeight", function()
	{//字体加粗
		var css = $(".canvasId").css("font-weight");
		if(css != 700)
		{
			$(".canvasId").css("font-weight",700);
		}else
		{
			$(".canvasId").css("font-weight","");
		}
	})
	$(document).on("click", "#basicStyle", function()
	{//字体倾斜
		var css = $(".canvasId").css("font-style");
		if(css == "normal")
		{
			$(".canvasId").css("font-style","oblique");
		}else
		{
			$(".canvasId").css("font-style","normal");
		}
	})
	$(document).on("click", "#basicDecoration", function()
	{//字体下划线
		var str = $(".canvasId").css("text-decoration");
		var css = str.match(/\bunderline\b/gi);
		if(css != "underline")
		{
			$(".canvasId").css("text-decoration","underline");
		}else
		{
			$(".canvasId").css("text-decoration","none");
		}
	})
	$("#basicColor").spectrum(
	{//字体颜色
		allowEmpty:true,//允许为空,显示清除颜色按钮
		color:"transparent",//初始化颜色
		showInput:true,//显示输入
		containerClassName:"panelColor",//引用类选择器,可以改变颜色选择器面板的样式
		replacerClassName:"inputColor",//引用类选择器,可以改变颜色选择器的样式
		showInitial:true,//显示初始颜色,提供现在选择的颜色和初始颜色对比
		showPalette:true,//显示选择器面板
		showSelectionPalette: true,//记住选择过的颜色
		clickoutFiresChange: false,//单击选择器外部,如果颜色有改变则应用
		showAlpha:true,//显示透明度选择
		maxPaletteSize:10,//记住选择过的颜色的最大数量
		preferredFormat:"rgb",//输入框颜色格式,(hex十六进制,hex3十六进制可以的话只显示3位,hsl,rgb三原色,name英文名显示)
		localStorageKey:false,//把选择过的颜色存在浏览器上
		clickoutFiresChange:true,//单击选择器外部,如果颜色有改变则应用
		cancelText: "关闭",
		chooseText: "确定",
		appendTo: "body",//选择选择器容器是附加到哪个元素
		palette:
		[
			[
				"#FFFFFF", "#000000", "#696969", "#FF7D23", "#AA40FF", "#1F0068", "#B81B6C", "#4617B4", "#E064B7", "#FF1D77", "#2D004E", "#FF768C", "#B81B1B", "#7200AC", "#D39DD9", "#FF2E12", "#C1004F", "#E1B700", "#E56C19", "#4E0038", "#83BA1F", "#FF981D", "#4E0000", "#91D100", "#15992A", "#B01E00", "#00AAAA", "#00C13F", "#2E1700", "#00D8CC", "#004A00", "#632F00", "#569CE3", "#119900", "#AE113D", "#56C5FF", "#004D60", "#2673EC", "#1B58B8", "#008287", "#78BA00", "#1FAEFF", "#001E4E", "#F4B300", "#691BB8", "#006AC1", "#ff461f", "#003472", "#057748", "#be002f", "#8d4bbb", "#ff2d51", "#3399FF", "#FFFF66", "#FF99CC", "#FF6666", "#CCCCCC", "#CC9966", "#99FFCC", "#99CC66", "#9966CC", "#66FF66", "#6699CC", "#666666"
			]
		],
		change:function(color)
		{
			var hexColor = "transparent";
	　　　　if(color)
			{
	　　　　　　hexColor = color.toRgbString();
	　　　　}
			$(".canvasId").css("color",hexColor);
			$(".canvasId a").css("color",hexColor); 
		},
		move:function(color)
		{
			var hexColor = "transparent";
	　　　　if(color)
			{
	　　　　　　hexColor = color.toRgbString();
	　　　　}
			$(".canvasId").css("color",hexColor);
			$(".canvasId a").css("color",hexColor); 
		}
	});
	//更新图形颜色
	$("#canvas-svg").spectrum(
	{
		allowEmpty:true,//允许为空,显示清除颜色按钮
		color:"transparent",//初始化颜色
		showInput:true,//显示输入
		containerClassName:"panelColor",//引用类选择器,可以改变颜色选择器面板的样式
		replacerClassName:"inputColor",//引用类选择器,可以改变颜色选择器的样式
		showInitial:true,//显示初始颜色,提供现在选择的颜色和初始颜色对比
		showPalette:true,//显示选择器面板
		showSelectionPalette: true,//记住选择过的颜色
		clickoutFiresChange: false,//单击选择器外部,如果颜色有改变则应用
		showAlpha:true,//显示透明度选择
		maxPaletteSize:10,//记住选择过的颜色的最大数量
		preferredFormat:"rgb",//输入框颜色格式,(hex十六进制,hex3十六进制可以的话只显示3位,hsl,rgb三原色,name英文名显示)
		localStorageKey:false,//把选择过的颜色存在浏览器上
		clickoutFiresChange:true,//单击选择器外部,如果颜色有改变则应用
		cancelText: "关闭",
		chooseText: "确定",
		appendTo: "body",//选择选择器容器是附加到哪个元素
		palette:
		[
			[
				"#FFFFFF", "#000000", "#696969", "#FF7D23", "#AA40FF", "#1F0068", "#B81B6C", "#4617B4", "#E064B7", "#FF1D77", "#2D004E", "#FF768C", "#B81B1B", "#7200AC", "#D39DD9", "#FF2E12", "#C1004F", "#E1B700", "#E56C19", "#4E0038", "#83BA1F", "#FF981D", "#4E0000", "#91D100", "#15992A", "#B01E00", "#00AAAA", "#00C13F", "#2E1700", "#00D8CC", "#004A00", "#632F00", "#569CE3", "#119900", "#AE113D", "#56C5FF", "#004D60", "#2673EC", "#1B58B8", "#008287", "#78BA00", "#1FAEFF", "#001E4E", "#F4B300", "#691BB8", "#006AC1", "#ff461f", "#003472", "#057748", "#be002f", "#8d4bbb", "#ff2d51", "#3399FF", "#FFFF66", "#FF99CC", "#FF6666", "#CCCCCC", "#CC9966", "#99FFCC", "#99CC66", "#9966CC", "#66FF66", "#6699CC", "#666666"
			]
		],
		change:function(color)
		{
			var hexColor = "transparent";
	　　　　	if(color)
			{
	　　　　　　	hexColor = color.toRgbString();
	　　　　	}
			$(".canvasId > .canvas-con").find("g, polygon, path, rect, circle").attr("fill",hexColor);
		},
		move:function(color)
		{
			var hexColor = "transparent";
	　　　　	if(color)
			{
	　　　　　	　	hexColor = color.toRgbString();
	　　　　	}
			$(".canvasId > .canvas-con").find("g, polygon, path, rect, circle").attr("fill",hexColor);
		}
	});
});
/****************************************************** 素材动画设置 *******************************************/
$(function()
{
	//动作设置
	$(document).on("input propertychange", "#SetAnimate", function()
	{
		AnimateVal = $(this).val();
		Animatearray.splice(0,1,AnimateVal);
		$(".editAnimateShow").removeClass("editAnimateShow");
		if(AnimateVal == 0){
			$("#editAnimate0").addClass("editAnimateShow");
			if(Animatearray[1] != 0)
			{
				$("#"+Animatearray[1]).removeClass("editAnimateImgB");
				$(".canvasId > .canvas-con").removeClass(Animatearray[1]);
			}
			if(Animatearray[2] != 0)
			{
				$(".canvasId > .canvas-con").css("animation-duration","");
				$("#inSpeedAnimate").val(1);
				$("#speedAnimate").slider("value",100);
			}
			if(Animatearray[3] != 0)
			{
				$(".canvasId > .canvas-con").removeClass(Animatearray[3]);
				$("#loopdAnimate").slider("value",0);
				$("#inloopdAnimate").val("否");
			}
			Animatearray = [0,0,0,0];
		}else if(AnimateVal == 1){
			$("#editAnimate1").addClass("editAnimateShow");
			$("#editAnimate3").addClass("editAnimateShow");
			if(Animatearray[3] != 0)
			{
				$(".canvasId > .canvas-con").removeClass(Animatearray[3]);
				$("#loopdAnimate").slider("value",0);
				$("#inloopdAnimate").val("否");
				Animatearray.splice(3,1,0);
			}
		}else if(AnimateVal == 2){
			$("#editAnimate1").addClass("editAnimateShow");
			$("#editAnimate3").addClass("editAnimateShow");
			$("#editAnimate4").addClass("editAnimateShow");
		}
		$(".canvasId > .canvas-con").attr("Anima",Animatearray);//添加标识
	});
	//动画效果切换
	$(document).on("click", ".editAnimateImg", function(e)
	{
		e.preventDefault();//阻止浏览器默认事件
		var $a   = $(e.currentTarget);
		var id   = $a.attr("id");
		if(AnimateVal != 0)
		{
			if(!$a.hasClass("editAnimateImgB"))
			{
				if(Animatearray[1] != 0)
				{
					$(".canvasId > .canvas-con").removeClass(Animatearray[1]);
				}
				Animatearray.splice(1,1,id);
				$(".editAnimateImgB").removeClass("editAnimateImgB");
				$a.addClass("editAnimateImgB");
				$(".canvasId > .canvas-con").addClass("animated");
				$(".canvasId > .canvas-con").addClass(id);
				$(".canvasId > .canvas-con").attr("Anima",Animatearray);//添加标识
			}else
			{
				Animatearray.splice(1,1,0);
				$(".canvasId > .canvas-con").removeClass(id);
				$a.removeClass("editAnimateImgB");
				$(".canvasId > .canvas-con").attr("Anima",Animatearray);//添加标识
			}
		}
	});
	//动画时间
	$("#speedAnimate").slider(
	{
		range:"max",
		min:0,
		max:10000,
		step:100,
		value:1000,
		slide:function(event, ui) 
		{
			var size = ui.value;
			$("#inSpeedAnimate").val(size);
			Animatearray.splice(2,1,size);
			$(".canvasId > .canvas-con").css("animation-duration",(size/1000)+"s");
			$(".canvasId > .canvas-con").attr("Anima",Animatearray);//添加标识
			if(size == 0)
			{
				tooltips("速度为0时将恢复默认","Warning");
				$(".canvasId > .canvas-con").css("animation-duration","");
			}
		}
	});
	$("#inSpeedAnimate").on('input propertychange', function(e)
	{
		var size;
		if($(this).val() <= 10000 && $(this).val() > 0)
		{
			size = $(this).val();
			$("#speedAnimate").slider("value",size);
			Animatearray.splice(2,1,size);
			$(".canvasId > .canvas-con").css("animation-duration",(size/1000)+"s");
			$(".canvasId > .canvas-con").attr("Anima",Animatearray);//添加标识
		}else
		{
			tooltips("输入范围大于0小于等于10000毫秒,速度为0时将恢复默认","Warning");
			$(this).val("0");
			size = 0;
			Animatearray.splice(2,1,0);
			$(".canvasId > .canvas-con").css("animation-duration","");
			$("#speedAnimate").slider("value",size);
			$(".canvasId > .canvas-con").attr("Anima",Animatearray);//添加标识
		}
	});
	//是否循环
	$("#loopdAnimate").slider(
	{
		range:"max",
		min:0,
		max:1,
		value:0,
		slide:function(event, ui) 
		{
			var size = ui.value;
			if(size == 0){
				Animatearray.splice(3,1,0);
				$(".canvasId > .canvas-con").removeClass("infinite");
				$("#inloopdAnimate").val("否");
				$(".canvasId > .canvas-con").attr("Anima",Animatearray);//添加标识
			}else if(size == 1){
				Animatearray.splice(3,1,"infinite");
				$(".canvasId > .canvas-con").addClass("infinite");
				$("#inloopdAnimate").val("是");
				$(".canvasId > .canvas-con").attr("Anima",Animatearray);//添加标识
			}
		}
	});
});
/******************** 模态框 ***********************/
$(function()
{
	//更改模态框文字
	$("#nameModal").on('input propertychange', function(e)
	{
		var textarea = $(this).val().replace(/(\r)*\n/g,"<br>").replace(/\s/g,"&nbsp;");
		var rid      = $(".canvasId").attr("rid");
		if(rid == 29){
			$(".canvasId > .canvas-con > a").html(textarea);
		}else{
			$(".canvasId > .canvas-con").html(textarea);
		}
	});
	var scrollTop = 0;
	//关闭模态框
	$(document).on("click", ".newModalNone, .newModaldel", function()
	{
		$("#canvas_01, #canvas_02, #canvas_03").removeClass("canvas_Modal");//显示可编辑
		$("#MaterialModal").hide();//禁止嵌套模态框
		$(this).parents(".newModal").hide();
		var id = $(".editShow").attr("id");
		navPage = "#"+id;//动态修改画布id
		$(".draggable").draggable("option","scope",navPage);//更新接收区域
		$("#pc-edit").css("overflow","hidden");
		$("#pc-edit").scrollTop(scrollTop);
	});
    //关闭模态框（无蒙版）
    $(document).on("click", ".newModalNone2, .newModaldel", function()
    {
        $("#canvas_01, #canvas_02, #canvas_03").removeClass("canvas_Modal");//显示可编辑
        $("#MaterialModal").hide();//禁止嵌套模态框
        $(this).parents(".newModal").hide();
        var id = $(".editShow").attr("id");
        navPage = "#"+id;//动态修改画布id
        $(".draggable").draggable("option","scope",navPage);//更新接收区域
        $("#pc-edit").css("overflow","hidden");
        $("#pc-edit").scrollTop(scrollTop);
    });
    //关闭模态框（无蒙版）
    $(document).on("click", ".addModal",function()
    {
        $("#canvas_01, #canvas_02, #canvas_03").removeClass("canvas_Modal");//显示可编辑
        $("#MaterialModal").hide();//禁止嵌套模态框
        // $(this).parents(".newModal").hide();
        $(".newModal").hide();//关闭所有模态框
        var id = $(".editShow").attr("id");
        navPage = "#"+id;//动态修改画布id
        $(".draggable").draggable("option","scope",navPage);//更新接收区域
        $("#pc-edit").css("overflow","hidden");
        $("#pc-edit").scrollTop(scrollTop);
    });
	//打开模态框
	$(document).on("dblclick", ".addModal", function()
	{
		newFunction("F1");//画布与素材编辑栏切换
		$("#canvas_01, #canvas_02, #canvas_03").addClass("canvas_Modal");//隐藏不可编辑
		var id = $(this).attr("mid");
        $(".newModal").hide();//关闭所有模态框
		$("."+id).show();
		navPage = "#"+id;//动态修改画布id
		$(".draggable").draggable("option","scope",navPage);//更新接收区域
		$("#MaterialModal").show();//禁止嵌套模态框
		var pageId = $("#"+id).attr("pageId");
		scrollTop = $("#pc-edit").scrollTop();
		$("#pc-edit").scrollTop(0);
		$("#pc-edit").css("overflow","hidden");
		if(pageId != 1)
		{
			$("#"+id).attr("pageId",1)
			Editing_area(navPage);//调用编辑区功能
			droppable(navPage);//让编辑区接收拖动过来的元素
			//刷新图表
			$("."+id).find(".newECharts").each(function()
			{
				var id = $(this).children(".myECharts").attr("id");
				var myChart = echarts.init(document.getElementById(id));
				myChart.resize();
			});
		}
	});
});
/******************** 实例化文本编辑器 ***********************/
var ue = UE.getEditor('editor',
{
	toolbars:
	[
		[
			'fontfamily',//字体
			'fontsize', //字号
			'bold', //加粗
			'italic', //斜体
			'underline', //下划线
			'forecolor', //字体颜色
			'justifyleft', //居左对齐
			'justifycenter', //居中对齐
			'justifyright', //居右对齐
			'justifyjustify', //两端对齐
			'lineheight', //行间距
			'strikethrough', //删除线
			'subscript', //下标
			'superscript', //上标
			'fontborder', //字符边框
			'spechars', //特殊字符
			'horizontal', //分隔线
			'link', //超链接
			'unlink', //取消链接
		]
	]
});
/****************************************** 图形图库 ********************************************/
/********** 图形瀑布流 ************/
var $tuxing = $('#svgBody').masonry(
{
	itemSelector:'.svgDiv',
	columnWidth:50,
	gutter:20,
	horizontalOrder:true
});
function Graphical()
{
	var num    = 50;//每次展示个数
	var page   = 0;//已请求页数
	var pStart = 0;//开始的请求数
	var pEnd   = 0;//总的请求数
	var end    = false;//是否加载完成
	$("#nav4").mCustomScrollbar(
	{
		theme:"dark",
		updateOnSelectorChange:true,
		scrollInertia:100,
		axis:"y",
		alwaysShowScrollbar:1,
		callbacks:
		{
			onCreate:function()//初始化
			{
				if(end == false)
				{
					$.ajax(
					{
						type:'GET',
						url:basePath+'/configure/listConfigureGraphical',
						dataType: 'json',
						success: function(data)
						{
							if(data.state =="success"){
                                var len = data.datas.length;//获取总个数
                                if(len != 0 || len !=null)
                                {
                                    page++;
                                    pEnd   = num * page;
                                    pStart = pEnd - num;
                                   var  pid = 1;
                                   var  rid = 2;
                                    if(pStart <= len)
                                    {
                                        for(var i = pStart;i < pEnd; i++)
                                        {

                                            var meDate=
                                                '<div class="svgDiv draggable" pid='+ pid +' url="'+ basePath +'/'+ data.datas[i] +'">'+
                                                '<div class="MaterialShow">'+
                                                '<img src="'+ basePath +'/'+ data.datas[i] +'" />'+
                                                '</div>'+
                                                '<div class="MaterialNone">'+
                                                '<div class="canvas" rid='+ rid +'>'+
                                                '<div class="canvas-con">'+
                                                '</div>'+
                                                '</div>'+
                                                '</div>'+
                                                '</div>';
                                            var $meDate = $(meDate);
                                            $tuxing.append($meDate).masonry('appended',$meDate);
                                            if((i + 1) >= len)
                                            {
                                                end = true;
                                                $("#GraphicalData").show();
                                                break;
                                            }
                                        }
                                        draggable(navPage);
                                        setTimeout(function()
                                        {
                                            $tuxing.masonry();
                                        },1000);
                                    }else
                                    {
                                        $("#GraphicalData").show();
                                    }
                                }else
                                {
                                    end = true;
                                    $("#GraphicalData").show();
                                }

							}





						},
						error:function()
						{
							end = true;
							$("#GraphicalData").show();
							tooltips("请求出错！请联系技术支持","Warning");
						},
					});
				}else
				{
					end = true;
					$("#GraphicalData").show();
				}
			},
			onTotalScroll:function()//滚动时候调用
			{
				if(end == false)
				{
					$.ajax(
					{
						type:'GET',
                        url:basePath+'/configure/listConfigureGraphical',
						dataType: 'json',
						success: function(data)
						{
								if(data.state=="success"){
                                    var len = data.datas.length;//获取总个数
                                    if(len != 0 || len !=null)
                                    {

                                        page++;
                                        pEnd   = num * page;
                                        pStart = pEnd - num;
                                        var  pid = 1;
                                        var  rid = 2;
                                        if(pStart <= len)
                                        {
                                            for(var i = pStart;i < pEnd; i++)
                                            {
                                                var meDate=
                                                    '<div class="svgDiv draggable" pid='+ pid +' url="'+ basePath +'/'+ data.datas[i] +'">'+
                                                    '<div class="MaterialShow">'+
                                                    '<img src="'+ basePath +'/'+ data.datas[i] +'" />'+
                                                    '</div>'+
                                                    '<div class="MaterialNone">'+
                                                    '<div class="canvas" rid='+ rid +'>'+
                                                    '<div class="canvas-con">'+
                                                    '</div>'+
                                                    '</div>'+
                                                    '</div>'+
                                                    '</div>';
                                                var $meDate = $(meDate);
                                                $tuxing.append($meDate).masonry('appended',$meDate);
                                                if((i + 1) >= len)
                                                {
                                                    end = true;
                                                    $("#GraphicalData").show();
                                                    break;
                                                }
                                            }
                                            draggable(navPage);
                                            setTimeout(function()
                                            {
                                                $tuxing.masonry();
                                            },1000);
                                        }else
                                        {
                                            $("#GraphicalData").show();
                                        }
                                    }else
                                    {
                                        end = true;
                                        $("#GraphicalData").show();
                                    }
								}
						},
						error:function()
						{
							end = true;
							$("#GraphicalData").show();
							tooltips("请求数据出错！请联系技术支持","Warning");
						},
					});
				}else
				{
					end = true;
					$("#GraphicalData").show();
				}
			}
		},
	});
}

/********** 上传瀑布流 ************/
var $uploadFlow = $('#uploadBody').masonry(
{
	itemSelector:'.svgDiv2',
	columnWidth:90,
	gutter:20,
	horizontalOrder:true
});
function upload()
{
	var num    = 25;
	var page   = 0;//已请求页数	
	var end    = false;//是否加载完成
	$("#uploadCon").mCustomScrollbar(
	{
		theme:"dark",
		updateOnSelectorChange:true,
		scrollInertia:100,
		axis:"y",
		alwaysShowScrollbar:1,
		callbacks:
		{
			onCreate:function()//初始化
			{
				if(end == false)
				{
					$.ajax(
					{
						type:'POST',
						url:basePath+'/configure/listConfigureImgs',
						data:{"page":page+1,"size":num,'type':0},
						dataType: 'json',
						success: function(data)
						{
							if(data.state =="success")
							{
								var len = data.datas.length;//获取传递页码的个数
								page++;
								for(var i = 0;i < len; i++)
								{
									var meDate=
									'<div class="svgDiv2 draggable" pid="1">'+
										'<div class="MaterialShow">'+
											'<img src="'+ data.datas[i].url +'" />'+
										'</div>'+
										'<div class="MaterialNone">'+
											'<div class="canvas" rid="1">'+
												'<div class="canvas-con">'+
													'<img class="IMG" src="'+ data.datas[i].url +'" />'+
												'</div>'+
											'</div>'+
										'</div>'+
										'<a href="javascript:;" class="del-upload iconfont" id="'+data.datas[i].id+'">'+
											'&#xe80a;'+
										'</a>'+
									'</div>';
									var $meDate = $(meDate);
									$uploadFlow.append($meDate).masonry('appended',$meDate);
								}
								draggable(navPage);
								setTimeout(function() 
								{
									$uploadFlow.masonry();
								},1000);
							}else
							{
								end = true;
								$("#uploadData").show();
							}
						},
						error:function()
						{
							end = true;
							$("#uploadData").show();
							tooltips("请求出错！请联系技术支持","Warning");
						},
					});
				}else
				{
					end = true;
					$("#uploadData").show();
				}
			},
			onTotalScroll:function()//滚动时候调用
			{
				if(end == false)
				{
					$.ajax(
					{
						type:'POST',
                        url:basePath+'/configure/listConfigureImgs',
                        data:{"page":page+1,"size":num,'type':0},
						dataType: 'json',
                        success: function(data)
                        {
                            if(data.state =="success")
                            {
                                var len = data.datas.length;//获取传递页码的个数
                                page++;
                                for(var i = 0;i < len; i++)
                                {
                                    var meDate=
                                        '<div class="svgDiv2 draggable" pid="1">'+
                                        '<div class="MaterialShow">'+
                                        '<img src="'+ data.datas[i].url +'" />'+
                                        '</div>'+
                                        '<div class="MaterialNone">'+
                                        '<div class="canvas" rid="1">'+
                                        '<div class="canvas-con">'+
                                        '<img class="IMG" src="'+ data.datas[i].url +'" />'+
                                        '</div>'+
                                        '</div>'+
                                        '</div>'+
                                        '<a href="javascript:;" class="del-upload iconfont" id="'+data.datas[i].id+'">'+
                                        '&#xe80a;'+
                                        '</a>'+
                                        '</div>';
                                    var $meDate = $(meDate);
                                    $uploadFlow.append($meDate).masonry('appended',$meDate);
                                }
                                draggable(navPage);
                                setTimeout(function()
                                {
                                    $uploadFlow.masonry();
                                },1000);
                            }else
                            {
                                end = true;
                                $("#uploadData").show();
                            }
                        },
						error:function()
						{
							end = true;
							$("#uploadData").show();
							tooltips("请求出错！请联系技术支持","Warning");
						},
					});
				}else
				{
					end = true;
					$("#uploadData").show();
				}
			}
		},
	});
}
//图像裁剪程序
$(function()
{
	var $image = $('#Cutting');
	var new_scaleX;
	var new_scaleY;
	var $dataHeight = $('#dataHeight');
	var $dataWidth = $('#dataWidth');
	var URL = window.URL || window.webkitURL;
	var originalImageURL = $image.attr('src');
	var uploadedImageName = 'cropped.jpg';//默认下载图片名称
	var uploadedImageType = 'image/jpeg';
	var uploadedImageURL;
	var options;
	var $download = $('#uploadDown');
	var opw;
	var oph;
	//打开图像裁剪程序
	$('#myModal').on('shown.bs.modal', function(e){
		options =  
		{
			minContainerWidth:900,
			minContainerHeight:500,
			preview:'#uploadpreview',
			crop:function(e)
			{
				//console.log(e.detail.x);
				//console.log(e.detail.y);
				//console.log(e.detail.width);
				//console.log(e.detail.height);
				//console.log(e.detail.rotate);
				//console.log(e.detail.scaleX);
				//console.log(e.detail.scaleY);
				$dataHeight.val(Math.round(e.detail.height));
				$dataWidth.val(Math.round(e.detail.width));
				opw = Math.round(e.detail.width);
				oph = Math.round(e.detail.height);
				new_scaleX = e.detail.scaleX;
				new_scaleY = e.detail.scaleY;
			}
		};
		$image.on(
		{
			ready: function (e) {
			  //console.log(e.type);
			},
			cropstart: function (e) {
			 // console.log(e.type, e.detail.action);
			},
			cropmove: function (e) {
			  //console.log(e.type, e.detail.action);
			},
			cropend: function (e) {
			 //console.log(e.type, e.detail.action);
			},
			crop: function (e) {
			 // console.log(e.type);
			},
			zoom: function (e) {
			 // console.log(e.type, e.detail.ratio);
			}
		}).cropper(options);
	});
	//关闭模态框终止裁剪
	$('#myModal').on('hidden.bs.modal', function(e){
		$('#Cutting').cropper("destroy");
	});
	//选择移动
	$(document).on("click", "#uploadMove", function()
	{
		$image.cropper("setDragMode","move");
	});
	//选择裁剪
	$(document).on("click", "#uploadCutting", function()
	{
		$image.cropper("setDragMode","crop");
	});
	//放大
	$(document).on("click", "#uploadEnlarge", function()
	{
		$image.cropper("zoom",0.1);
	});
	//缩小
	$(document).on("click", "#uploadNarrow", function()
	{
		$image.cropper("zoom",-0.1);
	});
	//向上移动
	$(document).on("click", "#uploadTop", function()
	{
		$image.cropper("move",0,-1);
	});
	//向下移动
	$(document).on("click", "#uploadBottom", function()
	{
		$image.cropper("move",0,1);
	});
	//向左移动
	$(document).on("click", "#uploadLeft", function()
	{
		$image.cropper("move",-1,0);
	});
	//向右移动
	$(document).on("click", "#uploadRight", function()
	{
		$image.cropper("move",1,0);
	});
	//向左旋转
	$(document).on("click", "#uploadRotateL", function()
	{
		$image.cropper("rotate",-45);
	});
	//向左旋转
	$(document).on("click", "#uploadRotateR", function()
	{
		$image.cropper("rotate",45);
	});
	//上下翻转
	$(document).on("click", "#uploadScaleY", function()
	{
		if(new_scaleY == 1){
			$image.cropper("scaleY",-1);
		}else{
			$image.cropper("scaleY",1);
		}
	});
	//左右翻转
	$(document).on("click", "#uploadScaleX", function()
	{
		if(new_scaleX == 1){
			$image.cropper("scaleX",-1);
		}else{
			$image.cropper("scaleX",1);
		}
	});
	//重置
	$(document).on("click", "#uploadReset", function()
	{
		$image.cropper("reset");
	});
	//选择比例
	$(document).on("click", ".uploadUla", function(e)
	{
		e.preventDefault();//阻止浏览器默认事件
		if(!$(this).hasClass("uploadUlb"))
		{
			var bl = $(this).attr("href");
			$(".uploadUlb").removeClass("uploadUlb");
			$(this).addClass("uploadUlb");
			options["aspectRatio"] = bl;
			$image.cropper('destroy').cropper(options);
		}
	});
	//下载
	$(document).on("click", "#uploadDown", function()
	{
		var result = $image.cropper("getCroppedCanvas",{maxWidth:4096,maxHeight:4096});
		$download.attr('href', result.toDataURL(uploadedImageType));
	});
	//裁剪完成
	$(document).on("click", "#uploadYse", function()
	{
		var result = $image.cropper("getCroppedCanvas",{maxWidth:4096,maxHeight:4096});// 获取裁剪后的base64位编码
		var img    = result.toDataURL(uploadedImageType);
		var imgFile=convertBase64UrlToBlob(img);
		 //创建formdata对象
        var formdata = new FormData();
         //将文件添加到formdata里面
        formdata.append("file",imgFile);
		//上传图片
		$.ajax(
		{
			type:'POST',
			url:basePath+'/uploadYunPic.htm',//图片上传
			data:formdata,
			processData: false,  // 不处理数据
            contentType: false,  // 不设置内容类型
			success: function(data)
			{
				if(data!=null){
					var arr=data.split("`");
					if(arr[0]=="1"){
						tooltips(arr[1],"Warning");
						return;
					}
					var id=arr[0];
					img=arr[1];
					console.log(id);
					console.log(img);
					var meDate=
						'<div class="svgDiv2 draggable" pid="1">'+
							'<div class="MaterialShow">'+
								'<img src="'+ img +'" />'+
							'</div>'+
							'<div class="MaterialNone">'+
								'<div class="canvas" rid="1" style="width:'+opw+'px;height:'+oph+'px;">'+
									'<div class="canvas-con">'+
										'<img src="'+ img +'" />'+
									'</div>'+
								'</div>'+
							'</div>'+
							'<a href="javascript:;" class="del-upload iconfont" id="'+id+'">'+
								'&#xe80a;'+
							'</a>'+
						'</div>';
					var $meDate = $(meDate);
					$uploadFlow.append($meDate).masonry('appended',$meDate);
					draggable(navPage);//调用拖动
					setTimeout(function() 
					{
						$uploadFlow.masonry();
					},1000);
					$('#myModal').modal('hide')
				}else{
					tooltips("请求数据出错,请联系技术支持！","Warning");
				}
			},
			error:function()
			{
				tooltips("请求数据出错,请联系技术支持！","Warning");
			}
		});
	});
	//上传img
	var $inputImage = $('#inputImage');
	if(URL)
	{
		$inputImage.change(function()
		{
			var files = this.files;
			var file;
			if(!$image.data('cropper'))
			{
				return;
			}
			if(files && files.length)
			{
				file = files[0];
				if (/^image\/\w+$/.test(file.type))
				{
					uploadedImageName = file.name;
					uploadedImageType = file.type;
					if(uploadedImageURL)
					{
						URL.revokeObjectURL(uploadedImageURL);
					}
					uploadedImageURL = URL.createObjectURL(file);
					$image.cropper('destroy').attr('src', uploadedImageURL).cropper($image);
					$inputImage.val('');
					$image.cropper('destroy').cropper(options);//重置条件
				}else
				{
					tooltips("上传格式错误,上传格式包含.jpg,.jpeg,.png,.gif,.bmp,.tiff","Warning");
				}
			}
		});
	}else
	{
		$inputImage.hide().parent().addClass('uploadImgNo');
	}
	//提示窗
	$(".upload-but, #pxAddtest").tooltip(
	{
		position:
		{
			my:"center bottom-20",
			at:"center top",
			using: function(position,feedback)
			{
				$(this).css(position);
				$("<div>")
				.addClass("arrow")
				.addClass(feedback.vertical)
				.addClass(feedback.horizontal)
				.appendTo(this);
			}
		}
	});
	//显示和隐藏删除按钮
	$(document).on("mouseenter", ".svgDiv2", function()
	{
		$(this).children(".del-upload").show();
	})
	$(document).on("mouseleave", ".svgDiv2", function()
	{
		$(this).children(".del-upload").hide();
	})
	//删除上传的素材
	var del_upload = 0;
	$(document).on("click", ".del-upload", function()
	{
		var $this = $(this);
		var id    = $(this).attr("id");
		if(del_upload == 0)
		{
			$('#type-dialogBox').dialogBox(
			{
				type:'correct',
				autoHide:false,
				zIndex:99999,
				hasMask:true,
				hasClose:true,
				hasBtn:true,
				effect:'sign',
				content:'删除后不可恢复,确认要删除吗?<div class="checkbox"><label><input type="checkbox" id="del_upload" >本次编辑不在提示</label></div>',
				confirm:function()
				{
					var result=delYunZutaiPhotoFun(id);
					if(result=="00"){
						$this.parent(".svgDiv2").remove();
						$uploadFlow.masonry();
					}else{
						tooltips("删除失败","Warning");
					}
				},
			});
		}else
		{
			var result=delYunZutaiPhotoFun(id);
			if(result=="00"){
				$this.parent(".svgDiv2").remove();
				$uploadFlow.masonry();
			}else{
				tooltips("删除失败","Warning");
			}
		}
	})
	$(document).on("click", "#del_upload", function()
	{
		if($(this).is(':checked'))
		{
			del_upload = 1;
		}else
		{
			del_upload = 0;
		}
	})
});
/************************************************************ 图库相关操作 ************************************************************************/
//菜单展开与关闭
$(function()
{
	$(document).on("click", "#gallery-button", function()
	{
		if(!$(this).hasClass("gallery-buttonB"))
		{
			$(this).addClass("gallery-buttonB");
			$("#gallery-column").addClass("gallery-columnB");
			$("#gallery-column").addClass("flipInY");
			$("#gallery-column").one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function()
			{
				$("#gallery-column").removeClass("flipInY");
			});
		}else{
			$(this).removeClass("gallery-buttonB");
			$("#gallery-column").addClass("flipOutY");
			$("#gallery-column").one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function()
			{
				$("#gallery-column").removeClass("gallery-columnB");
				$("#gallery-column").removeClass("flipOutY");
			});
		}
	})
});
//初始化瀑布流
var $mygallery = $('#my_gallery').masonry(
{
	itemSelector:'.svgDiv2',
	columnWidth:90,
	gutter:20,
	horizontalOrder:true
});
//菜单切换
$(function()
{
	$(document).on("click", ".gallery-Itme", function()
	{
		var show = "gallery-ItmeB";
		if(!$(this).hasClass(show))
		{
			$("#gallery").mCustomScrollbar("destroy");
			$('#my_gallery > .svgDiv2').remove();//清空元素
			$('#my_gallery').removeAttr("style");//清空元素
			$mygallery.masonry('reloadItems');//重置瀑布流
			$("."+show).removeClass(show);
			$(this).addClass(show);
			var name = $(this).attr("name");
			$("#gallery-name").text(name);//更改选择的名称
			var page = $(this).attr("id");
			$("#gallery-column").addClass("flipOutY");
			$("#gallery-column").one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function()
			{
				$("#gallery-button").removeClass("gallery-buttonB");
				$("#gallery-column").removeClass("gallery-columnB");
				$("#gallery-column").removeClass("flipOutY");
				new_gallery(page);//调用方法
			});
		}
	});
});
//图库瀑布流
function new_gallery(nav)
{
	var navs   = nav;//切换菜单
	var num    = 20;//每次展示个数
	var page   = 0;//已请求页数
	var pStart = 0;//开始的请求数
	var pEnd   = 0;//总的请求数
	var end    = false;//是否加载完成
	$("#gallery").mCustomScrollbar(
	{
		theme:"dark",
		updateOnSelectorChange:true,
		scrollInertia:100,
		axis:"y",
		alwaysShowScrollbar:1,
		callbacks:
		{
			onCreate:function()//初始化
			{
				if(end == false)
				{
					$.ajax(
					{
						type:'GET',
                        url:basePath+'/configure/listConfigureGallery',
						dataType: 'json',
						success: function(data)
						{

							if(data.state=="success"){
                                var len = data.datas.length;//获取总个数
                                if(len != 0 || len !=null)
                                {
                                    page++;
                                    pEnd   = num * page;
                                    pStart = pEnd - num;
                                    var pid = 1;
                                    var rid = 9;
                                    if(pStart <= len)
                                    {
                                        for(var i = pStart;i < pEnd; i++)
                                        {
                                            var name = "";
                                /*            if(data.result[i].name != undefined)
                                            {
                                                name = data.result[i].name;
                                            }*/
                                            var meDate=
                                                '<div class="svgDiv2 draggable" pid='+ pid +' url="'+ basePath +'/'+data.datas[i] +'" title="'+ name +'">'+
                                                '<div class="MaterialShow">'+
                                                '<img src="'+ basePath +'/'+ data.datas[i] +'" />'+
                                                '</div>'+
                                                '<div class="MaterialNone">'+
                                                '<div class="canvas" rid='+ rid +'>'+
                                                '<div class="canvas-con">'+
                                                '</div>'+
                                                '</div>'+
                                                '</div>'+
                                                '</div>';
                                            var $meDate = $(meDate);
                                            $mygallery.append($meDate).masonry('appended',$meDate);
                                            if((i + 1) >= len)
                                            {
                                                end = true;
                                                $("#gallerydData").show();
                                                break;
                                            }
                                        }
                                        draggable(navPage);
                                        setTimeout(function()
                                        {
                                            $mygallery.masonry();
                                        },1000);
                                    }else
                                    {
                                        $("#gallerydData").show();
                                    }
                                }else
                                {
                                    end = true;
                                    $("#gallerydData").show();
                                }
							}

						},
						error:function()
						{
							end = true;
							$("#gallerydData").show();
							tooltips("请求数据出错！请联系技术支持","Warning");
						},
					});
				}else
				{
					end = true;
					$("#gallerydData").show();
				}
			},
			onTotalScroll:function()//滚动时候调用
			{
				if(end == false)
				{
					$.ajax(
					{
						type:'GET',
                        url:basePath+'/configure/listConfigureGallery',
						dataType: 'json',
						success: function(data)
						{
								if(data.state == "success"){
                                    var len = data.datas.length;//获取总个数
                                    if(len != 0 || len !=null)
                                    {

                                        page++;
                                        pEnd   = num * page;
                                        pStart = pEnd - num;
                                        var pid = 1;
                                        var rid = 9;
                                        if(pStart <= len)
                                        {
                                            for(var i = pStart;i < pEnd; i++)
                                            {
                                                var name = "";
                                                /*				if(data.result[i].name != undefined)
                                                                {
                                                                    name = data.result[i].name;
                                                                }*/
                                                var meDate=
                                                    '<div class="svgDiv2 draggable" pid='+ pid +' url="'+ basePath +'/'+ data.datas[i] +'" title="'+ name +'">'+
                                                    '<div class="MaterialShow">'+
                                                    '<img src="'+ basePath +'/'+ data.datas[i] +'" />'+
                                                    '</div>'+
                                                    '<div class="MaterialNone">'+
                                                    '<div class="canvas" rid='+ rid +'>'+
                                                    '<div class="canvas-con">'+
                                                    '</div>'+
                                                    '</div>'+
                                                    '</div>'+
                                                    '</div>';
                                                var $meDate = $(meDate);
                                                $mygallery.append($meDate).masonry('appended',$meDate);
                                                if((i + 1) >= len)
                                                {
                                                    end = true;
                                                    $("#gallerydData").show();
                                                    break;
                                                }
                                            }
                                            draggable(navPage);
                                            setTimeout(function()
                                            {
                                                $mygallery.masonry();
                                            },1000);
                                        }else
                                        {
                                            $("#gallerydData").show();
                                        }
                                    }else
                                    {
                                        end = true;
                                        $("#gallerydData").show();
                                    }
								}
						},
						error:function()
						{
							end = true;
							$("#gallerydData").show();
							tooltips("请求数据出错！请联系技术支持","Warning");
						},
					});
				}else
				{
					end = true;
					$("#gallerydData").show();
				}
			}
		},
	});
}
/************************************************************ 图表 相关操作**********************************************************************/
$(function()
{
	/**初始化设备**/
	$("#deviceId").select2({
		placeholder:"请选择设备",
		multiple:false,
		closeOnSelect:true,
	});


    $.ajax(//请求设备列表获取设备下拉框
        {
            type:'post',
            async:true,
            url:basePath+'/deviceManage/getDeviceList',
			data:{
            	page:1,
                limit:100
			},
            success: function(data)
            {
					if(data.success==true){
						var $deviceId = $("#deviceId");
                   /*     var $mapDeviceId = $("#mapDeviceId");*/
                        $deviceId.empty();
             /*           $mapDeviceId.empty();*/
                        var $options =  $("<option value='-1'>请选择设备</option>");
                        $options.appendTo($deviceId);
							for(var j = 0;j<data.data.length;j++){
								var $optionsItem = $("<option value="+ data.data[j].deviceNumber+">"+ data.data[j].name  +"</option>");
                                $optionsItem.attr("onLineState",data.data[j].onLineState);
                                $optionsItem.attr("deviceType",data.data[j].deviceType);
                                $optionsItem.appendTo($deviceId);
                         /*       $optionsItem.appendTo($mapDeviceId);*/
							}
					}
            },
            error:function()
            {
                tooltips("设备列表请求失败！","Warning");
                flag=false;
            },
        });







    /**初始化摄像头**/
    $("#camerasId").select2({
        placeholder:"请选择摄像头",
        multiple:false,
        closeOnSelect:true,
    });


    $.ajax(//请求摄像头列表获取摄像头下拉列表
        {
            type:'post',
            async:true,
            url:basePath+'/cameraManage/listCameras',
            data:{
                page:1,
                limit:100
            },
            success: function(data)
            {
                if(data.state=="success"){
                    var $camerasId = $("#camerasId");
                    /*     var $mapDeviceId = $("#mapDeviceId");*/
                    $camerasId.empty();
                    /*           $mapDeviceId.empty();*/
                    var $options =  $("<option value='-1'>请选择摄像头</option>");
                    $options.appendTo($camerasId);
                    for(var j = 0;j<data.datas.length;j++){
                        var $optionsItem = $("<option value="+ data.datas[j].id+">"+ data.datas[j].name  +"</option>");

                        $optionsItem.appendTo($camerasId);
                        /*       $optionsItem.appendTo($mapDeviceId);*/
                    }
                }
            },
            error:function()
            {
                tooltips("摄像头列表请求失败！","Warning");
                flag=false;
            },
        });









	/**初始化传感器**/
	$("#sensorId").select2(
	{
		placeholder:"请先选择设备",
		multiple:false,
		closeOnSelect:true,
	});
	/**初始化触发器**/
	$("#triggerId").select2(
	{
		placeholder:"请先选择传感器",
		multiple:true,
		closeOnSelect:false,
	});
	/******************************************* 设备执行js ***********************************/
	//打开设备下拉框时获取素材图表类型
	$("#deviceId").on("select2:open",function(e)
	{
		selrid = Number($(".canvasId").attr("rid"));//获取元素图表类型
	});

	//选择设备时候触发
	$("#deviceId").on("select2:select",function(e)
	{
		var id = $(this).val();//获取设备ID


       var options=$(this).find("option:selected"); //获取选中的项
		 var name = options.text();


        $(".canvasId > .canvas-con").attr("deviceType",options.attr("devicetype"));

		$(".canvasId > .canvas-con").attr("deviceId",id);//记录当前素材设备ID
		/**********  传感器同步  **********/
		$("#sensorId").empty();//清空传感器option
		$(".canvasId > .canvas-con").removeAttr("triggerid");
		if ($("#sensorId").hasClass("select2-hidden-accessible"))
		{
			$("#sensorId").select2('destroy');//销毁
		}
		$(".canvasId > .canvas-con").removeAttr("sensorId");//清空素材记录传感器ID
		/**********  触发器同步  **********/
		$("#triggerId").empty();//清空触发器option
		$("#triggerId").trigger('change');//通知更新
		/******** 同步清空报警设置 ********/
		warningArr = [0,0,0];
		$("#warningTXT").val("0");
		$("#warningState").val("0");
		$("#warningVoice").val("0");
		$(".canvasId > .canvas-con").removeAttr("warningArr");
		/************* 清空视频 *************/
		if(selrid == 10)
		{
			var myVideo = "my"+ $(".canvasId > .canvas-con").attr("video") +"Player";
			$(".canvasId").find(".myPlayer").empty();//清空;
			var $myVideo = '<video  class="myVideo" id="'+myVideo+'" poster="" controls playsInline webkit-playsinline autoplay><source src="" type="" /><source src="" type="application/x-mpegURL" /></video>';
			$(".canvasId").find(".myPlayer").append($myVideo);
			$(".canvasId").children(".newVideo").removeAttr("data1");
			$(".canvasId").children(".newVideo").removeAttr("data2");



            $.ajax(
                {
                    type:'POST',
                    url:basePath+'/cameraManage/getPlayerAddress',		//根据设备ID查传感器
                    dataType: 'json',
                    data:{
                        id:'164'
                    },
                    success: function(data)
                    {
                        if(data.state=="success")
                        {

                            var myVideo = "my"+ $(".canvasId > .canvas-con").attr("video") +"Player";
                            $(".canvasId").find(".myPlayer").empty();//清空;
                            var $myVideo = '<video  class="myVideo" id="'+myVideo+'" poster="" controls playsInline webkit-playsinline autoplay><source src="'+ data.data.hlsHd+'" type="" /><source src="" type="application/x-mpegURL" /></video>';
                            $(".canvasId").find(".myPlayer").append($myVideo);
                            var player = $("#"+myVideo);
                            player = new EZUIPlayer(myVideo);
                            $(".canvasId").children(".newVideo").attr("data1",data.data.hlsHd);
                            $(".canvasId").children(".newVideo").attr("data2",data.data.hlsHd);


                        }else
                        {
                            tooltips("获取摄像头地址有误！","Warning");
                        }
                    },
                    error:function()
                    {
                        tooltips("请求数据出错,请联系技术支持！","Warning");
                    },
                });
		}
		/************* 开关是否允许操作同步 *************/
		if(selrid == 12 || selrid == 13)
		{
			$(".canvasId > .canvas-con").removeAttr("newswitch");
			$("#newSwitch").val(0);
			$("#newSwitch").attr("disabled","disabled");
		}
		/************* 固定数据下发同步 *************/
		if(selrid == 25)
		{
			$(".canvasId > .canvas-con").removeAttr("downdata");
			$("#downDataText").val("");
		}
        /************* 模态框3同步设备名称及设备号 *************/
        if(selrid == 103)
        {
        	var $that = $("#" +$(".canvasId > .canvas-con").attr("mid"));

            $that.find("strong").eq(0).text(name);
            $that.find("strong").eq(1).text("设备号："+id);
            var onLineState =  $(this).find("option:selected").attr("onlinestate");
            $that.find(".myChartID").attr("deviceId",id);
         		if(onLineState==1){
                    $that.find(".deviceOnLine").css("display","block");
                    $that.find(".deviceOffLine").css("display","none");
				}else{
                    $that.find(".deviceOnLine").css("display","none");
                    $that.find(".deviceOffLine").css("display","block");
				}

        }
		/**********  更新传感器option **********/

		if(selrid != 10){
            if(id != -1)
            {
                $.ajax(
                    {
                        type:'GET',
                        url:basePath+'/sensor/selTypeList',		//根据设备ID查传感器
                        dataType: 'json',
                        data:{
                            deviceNumber:id
                        },
                        success: function(data)
                        {

                            if(data.state=="success" && data.datas.length>0)
                            {
                                var len = data.datas.length;//获取总个数
                                switch(selrid)
                                {
                                    case 10://视频类型
                                        for(var i = 0;i < len; i++)
                                        {
                                            var disabled = "";
                                            if(data.datas[i].sensorType == 7) disabled = "";//视频类型
                                            $("#sensorId").append("<option value="+data.datas[i].id+" "+disabled+">"+data.datas[i].sensorName+"</option>");
                                            if((i+1) == len)
                                            {
                                                $("#sensorId").select2(
                                                    {
                                                        placeholder:"请选择传感器",
                                                        multiple:false,
                                                        closeOnSelect:true,
                                                    });
                                                $("#sensorId").val(null).trigger('change');
                                            }
                                        }
                                        break;
                                    case 11://数值类型(单选)
                                        for(var i = 0;i < len; i++)
                                        {
                                            var disabled = "";
                                            if(data.datas[i].sensorType == 1 || data.datas[i].sensorType == 2 || data.datas[i].sensorType == 5 || data.datas[i].sensorType == 3 || data.datas[i].sensorType == 6 || data.datas[i].sensorType == 8) disabled = "";
                                            $("#sensorId").append("<option value="+data.datas[i].id+"  "+disabled+">"+data.datas[i].sensorName+"</option>");
                                            if((i+1) == len)
                                            {
                                                $("#sensorId").select2(
                                                    {
                                                        placeholder:"请选择传感器",
                                                        multiple:false,
                                                        closeOnSelect:true,
                                                    });
                                                $("#sensorId").val(null).trigger('change');
                                            }
                                        }
                                        break;
                                    case 12://开关(单选)
                                        for(var i = 0;i < len; i++)
                                        {
                                            var disabled = "";
                                            if(data.datas[i].sensorType == 2 || data.datas[i].sensorType == 5) disabled = "";
                                            $("#sensorId").append("<option value="+data.datas[i].sensorCode+"  "+disabled+">"+data.datas[i].sensorName+"</option>");
                                            if((i+1) == len)
                                            {
                                                $("#sensorId").select2(
                                                    {
                                                        placeholder:"请选择传感器",
                                                        multiple:false,
                                                        closeOnSelect:true,
                                                    });
                                                $("#sensorId").val(null).trigger('change');
                                            }
                                        }
                                        break;
                                    case 13://开关(单选自定义)
                                        for(var i = 0;i < len; i++)
                                        {
                                            var disabled = "";
                                            if(data.datas[i].sensorType == 2 || data.datas[i].sensorType == 5) disabled = "";
                                            $("#sensorId").append("<option value="+data.datas[i].sensorCode+"  "+disabled+">"+data.datas[i].sensorName+"</option>");
                                            if((i+1) == len)
                                            {
                                                $("#sensorId").select2(
                                                    {
                                                        placeholder:"请选择传感器",
                                                        multiple:false,
                                                        closeOnSelect:true,
                                                    });
                                                $("#sensorId").val(null).trigger('change');
                                            }
                                        }
                                        break;
                                    case 14://曲线(多选)
                                        for(var i = 0;i < len; i++)
                                        {
                                            var disabled = "";
                                            if(data.datas[i].sensorType == 1 || data.datas[i].sensorType == 2 || data.datas[i].sensorType == 5) disabled = "";
                                            $("#sensorId").append("<option value="+data.datas[i].id+"  "+disabled+">"+data.datas[i].sensorName+"</option>");
                                            if((i+1) == len)
                                            {
                                                $("#sensorId").select2(
                                                    {
                                                        placeholder:"请选择传感器",
                                                        multiple:true,
                                                        closeOnSelect:false,
                                                    });
                                                $("#sensorId").val(null).trigger('change');
                                            }
                                        }
                                        break;
                                    case 15://曲线(单选)
                                        for(var i = 0;i < len; i++)
                                        {
                                            var disabled = "";
                                            if(data.datas[i].sensorType == 1 || data.datas[i].sensorType == 2 || data.datas[i].sensorType == 5) disabled = "";
                                            $("#sensorId").append("<option value="+data.datas[i].id+"  "+disabled+">"+data.datas[i].sensorName+"</option>");
                                            if((i+1) == len)
                                            {
                                                $("#sensorId").select2(
                                                    {
                                                        placeholder:"请选择传感器",
                                                        multiple:false,
                                                        closeOnSelect:true,
                                                    });
                                                $("#sensorId").val(null).trigger('change');
                                            }
                                        }
                                        break;
                                    case 16://区域(多选)
                                        for(var i = 0;i < len; i++)
                                        {
                                            var disabled = "";
                                            if(data.datas[i].sensorType == 5 || data.datas[i].sensorType == 1 || data.datas[i].sensorType == 2) disabled = "";
                                            $("#sensorId").append("<option value="+data.datas[i].id+"  "+disabled+">"+data.datas[i].sensorName+"</option>");
                                            if((i+1) == len)
                                            {
                                                $("#sensorId").select2(
                                                    {
                                                        placeholder:"请选择传感器",
                                                        multiple:true,
                                                        closeOnSelect:false,
                                                    });
                                                $("#sensorId").val(null).trigger('change');
                                            }
                                        }
                                        break;
                                    case 17://仪表(单选)
                                        for(var i = 0;i < len; i++)
                                        {
                                            var disabled = "";
                                            if(data.datas[i].sensorType == 1) disabled = "";
                                            $("#sensorId").append("<option value="+data.datas[i].id+"  "+disabled+">"+data.datas[i].sensorName+"</option>");
                                            if((i+1) == len)
                                            {
                                                $("#sensorId").select2(
                                                    {
                                                        placeholder:"请选择传感器",
                                                        multiple:false,
                                                        closeOnSelect:true,
                                                    });
                                                $("#sensorId").val(null).trigger('change');
                                            }
                                        }
                                        break;
                                    case 18://数据下发(多选)
                                        for(var i = 0;i < len; i++)
                                        {
                                            var disabled = "";
                                            if(data.datas[i].sensorType == 5 || data.datas[i].sensorType == 1 || data.datas[i].sensorType == 2  || data.datas[i].sensorType == 8) disabled = "";
                                            $("#sensorId").append("<option value="+data.datas[i].id+"  "+disabled+">"+data.datas[i].sensorName+"</option>");
                                            if((i+1) == len)
                                            {
                                                $("#sensorId").select2(
                                                    {
                                                        placeholder:"请选择传感器",
                                                        multiple:true,
                                                        closeOnSelect:false,
                                                    });
                                                $("#sensorId").val(null).trigger('change');
                                            }
                                        }
                                        break;
                                    case 20://历史(多选)
                                        for(var i = 0;i < len; i++)
                                        {
                                            var disabled = "";
                                            if(data.datas[i].sensorType == 5 || data.datas[i].sensorType == 1 || data.datas[i].sensorType == 2 || data.datas[i].sensorType == 7 || data.datas[i].sensorType == 8) disabled = "";
                                            $("#sensorId").append("<option value="+data.datas[i].id+"  "+disabled+">"+data.datas[i].sensorName+"</option>");
                                            if((i+1) == len)
                                            {
                                                $("#sensorId").select2(
                                                    {
                                                        placeholder:"请选择传感器",
                                                        multiple:true,
                                                        closeOnSelect:false,
                                                    });
                                                $("#sensorId").val(null).trigger('change');
                                            }
                                        }
                                        break;
                                    case 21://曲线(单选自定义)
                                        for(var i = 0;i < len; i++)
                                        {
                                            var disabled = "";
                                            if(data.datas[i].sensorType == 5 || data.datas[i].sensorType == 1 || data.datas[i].sensorType == 2) disabled = "";
                                            $("#sensorId").append("<option value="+data.datas[i].id+"  "+disabled+">"+data.datas[i].sensorName+"</option>");
                                            if((i+1) == len)
                                            {
                                                $("#sensorId").select2(
                                                    {
                                                        placeholder:"请选择传感器",
                                                        multiple:false,
                                                        closeOnSelect:true,
                                                    });
                                                $("#sensorId").val(null).trigger('change');
                                            }
                                        }
                                        break;
                                    case 22://管道类型(单选)
                                        for(var i = 0;i < len; i++)
                                        {
                                            var disabled = "";
                                            if(data.datas[i].sensorType == 2 || data.datas[i].sensorType == 5) disabled = "";
                                            $("#sensorId").append("<option value="+data.datas[i].sensorCode+"  "+disabled+">"+data.datas[i].sensorName+"</option>");
                                            if((i+1) == len)
                                            {
                                                $("#sensorId").select2(
                                                    {
                                                        placeholder:"请选择传感器",
                                                        multiple:false,
                                                        closeOnSelect:true,
                                                    });
                                                $("#sensorId").val(null).trigger('change');
                                            }
                                        }
                                        break;
                                    case 23://弯道类型(单选)
                                        for(var i = 0;i < len; i++)
                                        {
                                            var disabled = "";
                                            if(data.datas[i].sensorType == 2 || data.datas[i].sensorType == 5) disabled = "";
                                            $("#sensorId").append("<option value="+data.datas[i].id+"  "+disabled+">"+data.datas[i].sensorName+"</option>");
                                            if((i+1) == len)
                                            {
                                                $("#sensorId").select2(
                                                    {
                                                        placeholder:"请选择传感器",
                                                        multiple:false,
                                                        closeOnSelect:true,
                                                    });
                                                $("#sensorId").val(null).trigger('change');
                                            }
                                        }
                                        break;
                                    case 24://蓄水池(单选)
                                        for(var i = 0;i < len; i++)
                                        {
                                            var disabled = "";
                                            if(data.datas[i].sensorType == 1) disabled = "";
                                            $("#sensorId").append("<option value="+data.datas[i].id+"  "+disabled+">"+data.datas[i].sensorName+"</option>");
                                            if((i+1) == len)
                                            {
                                                $("#sensorId").select2(
                                                    {
                                                        placeholder:"请选择传感器",
                                                        multiple:false,
                                                        closeOnSelect:true,
                                                    });
                                                $("#sensorId").val(null).trigger('change');
                                            }
                                        }
                                        break;
                                    case 25://固定数据下发(单选)
                                        for(var i = 0;i < len; i++)
                                        {
                                            var disabled = "";
                                            if(data.datas[i].sensorType == 5 || data.datas[i].sensorType == 1 || data.datas[i].sensorType == 2 || data.datas[i].sensorType == 8) disabled = "";
                                            $("#sensorId").append("<option value="+data.datas[i].id+"  "+disabled+">"+data.datas[i].sensorName+"</option>");
                                            if((i+1) == len)
                                            {
                                                $("#sensorId").select2(
                                                    {
                                                        placeholder:"请选择传感器",
                                                        multiple:false,
                                                        closeOnSelect:true,
                                                    });
                                                $("#sensorId").val(null).trigger('change');
                                            }
                                        }
                                        break;
                                    case 26://报警历史记录(多选)
                                        for(var i = 0;i < len; i++)
                                        {
                                            var disabled = "";
                                            if(data.datas[i].sensorType == 5 || data.datas[i].sensorType == 1 || data.datas[i].sensorType == 2 || data.datas[i].sensorType == 8) disabled = "";
                                            $("#sensorId").append("<option value="+data.datas[i].id+"  "+disabled+">"+data.datas[i].sensorName+"</option>");
                                            if((i+1) == len)
                                            {
                                                $("#sensorId").select2(
                                                    {
                                                        placeholder:"请选择传感器",
                                                        multiple:true,
                                                        closeOnSelect:false,
                                                    });
                                                $("#sensorId").val(null).trigger('change');
                                            }
                                        }
                                        break;
                                    case 27://蓄水池无边框(单选)
                                        for(var i = 0;i < len; i++)
                                        {
                                            var disabled = "";
                                            if(data.datas[i].sensorType == 1) disabled = "";
                                            $("#sensorId").append("<option value="+data.datas[i].id+"  "+disabled+">"+data.datas[i].sensorName+"</option>");
                                            if((i+1) == len)
                                            {
                                                $("#sensorId").select2(
                                                    {
                                                        placeholder:"请选择传感器",
                                                        multiple:false,
                                                        closeOnSelect:true,
                                                    });
                                                $("#sensorId").val(null).trigger('change');
                                            }
                                        }
                                        break;
                                    case 28://百分比(单选)
                                        for(var i = 0;i < len; i++)
                                        {
                                            var disabled = "";
                                            if(data.datas[i].sensorType == 1) disabled = "";
                                            $("#sensorId").append("<option value="+data.datas[i].id+"  "+disabled+">"+data.datas[i].sensorName+"</option>");
                                            if((i+1) == len)
                                            {
                                                $("#sensorId").select2(
                                                    {
                                                        placeholder:"请选择传感器",
                                                        multiple:false,
                                                        closeOnSelect:true,
                                                    });
                                                $("#sensorId").val(null).trigger('change');
                                            }
                                        }
                                        break;
                                    case 30://柱状图(多选)
                                        for(var i = 0;i < len; i++)
                                        {
                                            var disabled = "";
                                            if(data.datas[i].sensorType == 1 || data.datas[i].sensorType == 2 || data.datas[i].sensorType == 5) disabled = "";
                                            $("#sensorId").append("<option value="+data.datas[i].id+"  "+disabled+">"+data.datas[i].sensorName+"</option>");
                                            if((i+1) == len)
                                            {
                                                $("#sensorId").select2(
                                                    {
                                                        placeholder:"请选择传感器",
                                                        multiple:true,
                                                        closeOnSelect:false,
                                                    });
                                                $("#sensorId").val(null).trigger('change');
                                            }
                                        }
                                        break;
                                    case 31://饼图/环形图
                                        for(var i = 0;i < len; i++)
                                        {
                                            var disabled = "";
                                            if(data.datas[i].sensorType == 1 || data.datas[i].sensorType == 2 || data.datas[i].sensorType == 5) disabled = "";
                                            $("#sensorId").append("<option value="+data.datas[i].id+"  "+disabled+">"+data.datas[i].sensorName+"</option>");
                                            if((i+1) == len)
                                            {
                                                $("#sensorId").select2(
                                                    {
                                                        placeholder:"请选择传感器",
                                                        multiple:true,
                                                        closeOnSelect:false,
                                                    });
                                                $("#sensorId").val(null).trigger('change');
                                            }
                                        }
                                        break;
                                    case 102://设备状态
                                        for(var i = 0;i < len; i++)
                                        {
                                            var disabled = "";
                                            if(data.datas[i].sensorType == 2 || data.datas[i].sensorType == 5) disabled = "";
                                            $("#sensorId").append("<option value="+data.datas[i].sensorCode+"  "+disabled+">"+data.datas[i].sensorName+"</option>");
                                            if((i+1) == len)
                                            {
                                                $("#sensorId").select2(
                                                    {
                                                        placeholder:"请选择传感器",
                                                        multiple:false,
                                                        closeOnSelect:true,
                                                    });
                                                $("#sensorId").val(null).trigger('change');
                                            }
                                        }
                                        break;
                                    case 103://组态3按钮
                                        for(var i = 0;i < len; i++)
                                        {
                                            var disabled = "";
                                            if(data.datas[i].sensorType == 2 || data.datas[i].sensorType == 5) disabled = "";
                                            $("#sensorId").append("<option value="+data.datas[i].sensorCode+"  "+disabled+">"+data.datas[i].sensorName+"</option>");
                                            if((i+1) == len)
                                            {
                                                $("#sensorId").select2(
                                                    {
                                                        placeholder:"请选择传感器",
                                                        multiple:false,
                                                        closeOnSelect:true,
                                                    });
                                                $("#sensorId").val(null).trigger('change');
                                            }
                                        }
                                        break;
                                    default:
                                        tooltips("程序出错！请联系技术支持","Warning");
                                }
                            }else
                            {
                                tooltips("当前设备下没有传感器！","Warning");
                            }
                        },
                        error:function()
                        {
                            tooltips("请求数据出错,请联系技术支持！","Warning");
                        },
                    });
            }
		}


	});
















    //打开摄像头下拉框时获取素材图表类型
    $("#camerasId").on("select2:open",function(e)
    {
        selrid = Number($(".canvasId").attr("rid"));//获取元素图表类型
    });




    //选择摄像头时候触发
    $("#camerasId").on("select2:select",function(e)
    {
        var id = $(this).val();//获取设备ID
        var options=$(this).find("option:selected"); //获取选中的项
        var name = options.text();
        $(".canvasId > .canvas-con").attr("camerasId",id);//记录当前素材设备ID
            var myVideo = "my"+ $(".canvasId > .canvas-con").attr("video") +"Player";
            $(".canvasId").find(".myPlayer").empty();//清空;
            var $myVideo = '<video  class="myVideo" id="'+myVideo+'" poster="" controls playsInline webkit-playsinline autoplay><source src="" type="" /><source src="" type="application/x-mpegURL" /></video>';
            $(".canvasId").find(".myPlayer").append($myVideo);
            $(".canvasId").children(".newVideo").removeAttr("data1");
            $(".canvasId").children(".newVideo").removeAttr("data2");
            $.ajax(
                {
                    type:'POST',
                    url:basePath+'/cameraManage/getPlayerAddress',		//根据设备ID查传感器
                    dataType: 'json',
                    data:{
                        id:id
                    },
                    success: function(data)
                    {
                        if(data.state=="success")
                        {

                            var myVideo = "my"+ $(".canvasId > .canvas-con").attr("video") +"Player";
                            $(".canvasId").find(".myPlayer").empty();//清空;
                            var $myVideo = '<video  class="myVideo" id="'+myVideo+'" poster="" controls playsInline webkit-playsinline autoplay><source src="'+ data.data.hlsHd+'" type="" /><source src="" type="application/x-mpegURL" /></video>';
                            $(".canvasId").find(".myPlayer").append($myVideo);
                            var player = $("#"+myVideo);
                            player = new EZUIPlayer(myVideo);
                            $(".canvasId").children(".newVideo").attr("data1",data.data.hlsHd);
                            $(".canvasId").children(".newVideo").attr("data2",data.data.hlsHd);


                        }else
                        {
                            tooltips("获取摄像头地址有误！","Warning");
                        }
                    },
                    error:function()
                    {
                        tooltips("请求数据出错,请联系技术支持！","Warning");
                    },
                });



    });






    /**初始化返回值文本下拉框**/
    $("#backData").select2({
        placeholder:"",
        multiple:false,
        closeOnSelect:true,
        minimumResultsForSearch: -1,
    });



    $.ajax(//请求设备列表获取设备下拉框
        {
            type:'post',
            async:true,
            url:basePath+'/configuration/allType',
            success: function(data)
            {
                if(data.state=='success'){
                    var $backData = $("#backData");
                    /*     var $mapDeviceId = $("#mapDeviceId");*/
                    $backData.empty();
                    /*           $mapDeviceId.empty();*/
                    var $options =  $("<option value='-1'>请选择绑定数据</option>");
                    $options.appendTo($backData);
                    for(var j = 0;j<data.datas.length;j++){
                        var $optionsItem = $("<option value="+ data.datas[j].id+">"+ data.datas[j].typeName  +"</option>");
                        $optionsItem.appendTo($backData);
                        /*       $optionsItem.appendTo($mapDeviceId);*/
                    }
                }
            },
            error:function()
            {
                tooltips("返回值列表请求失败！","Warning");
                flag=false;
            },
        });
















    //选择返回值文本下拉框
    $("#backData").on("select2:select",function(e){
        var id = $(this).val();//获取下拉框ID
        var options=$(this).find("option:selected"); //获取选中的项
        var name = options.text();
        var rid= $(".canvasId").attr("rid");
        $(".canvasId > .canvas-con").attr("backData",id);//记录当前素材返回值ID
       if(id!=-1){
           /*选中后不调用接口，只返回选中的对应文字*/
			if(rid=="108"){
				$(".canvasId > .canvas-con").text(name);
			}else if(rid == "109"){
                    $(".canvasId > .canvas-con").val(name);
                    $(".canvasId > .canvas-con").attr('value',name);
			}

       }else{
               if (rid=="108") {
                   $(".canvasId > .canvas-con").text('返回文本值');
               } else if (rid == "109") {
                   $(".canvasId > .canvas-con").val('返回文本值');
                   $(".canvasId > .canvas-con").attr('value','返回文本值');
               }
	   }

    });















    /******************************************* 传感器执行js ***********************************/

	//选择传感器时候触发
	$("#sensorId").on("select2:select",function(e)
	{
		var id  = $(this).val();
		var sensorName = [];

        var $selectSensor = $(this).find("option:checked");
        for(var i=0;i<$selectSensor.length;i++){
            sensorName.push($selectSensor.eq(i).text());
		}

		var sensorId = e.params.data.id;//获取选中ID
		if(id != null)
		{
			$(".canvasId > .canvas-con").attr("sensorId",id);//当前素材记录传感器id
            $(".canvasId > .canvas-con").attr("sensorName",sensorName);//当前素材记录传感器名称
			//模态3绑定设备状态，开关
            if(selrid == 103){

                var $that = $("#" +$(".canvasId > .canvas-con").attr("mid"));

                $that.find(".myChartID").eq(1).attr("sensorId",id);




			}
			if(selrid == 10)//视频
			{

				$.ajax(
				{
					type:'GET',
					url:basePath+'/querySensor/'+sensorId+'.htm',	//根据传感器ID查传感器
					dataType: 'json',
					success: function(data)
					{
						if(data.flag=="00")
						{
							var data1 = data.result.data1;
							var data2 = data.result.data2;
							var url = data.result.live;
							var accessToken=data.result.ysAccessToken;
							$(".canvasId").children(".newVideo").attr("data1",data1);
							$(".canvasId").children(".newVideo").attr("data2",data2);
							$(".canvasId").children(".newVideo").attr("data3",url);
							$(".canvasId").children(".newVideo").attr("data4",accessToken);
//							if(data.result.data1!=null&&data.result.data1!=""
//								&&data.result.data2!=null&&data.result.data2!=""){
								var myVideo = "my"+ $(".canvasId > .canvas-con").attr("video") +"Player";
								$(".canvasId").find(".myPlayer").empty();//清空
								$(".canvasId").find(".myPlayer").append('<video  class="myVideo" id="'+myVideo+'" poster="" controls playsInline webkit-playsinline autoplay><source src="'+data1+'" type="" /><source src="'+data2+'" type="application/x-mpegURL" /></video>');
								setTimeout(function()
								{
									new_video(myVideo);
								},500);
//							}
						}
					},
					error:function()
					{
						tooltips("请求数据出错,请联系技术支持！","Warning");
					},
				});
			}else{//如果不是视频类型则请求触发器
				if(selrid==11 || selrid==12 || selrid==13 || selrid==15 || selrid==17 || selrid==19 || selrid==21){//如果单选则清空
					$("#triggerId").empty();//清空触发器option
				}
				$.ajax(
				{
					type:'GET',
					url:basePath+'/trigger/listTriggerBySensorCode',//根据传感器ID查关联触发器
                    dataType: 'json',
                    data:{
                        sensorCode:sensorId
                    },
					success: function(data)
					{
						//更新触发器
						if(data.state=="success")
						{
							var len = data.datas.length;//获取总个数
							for(var i = 0;i < len; i++)
							{
								$("#triggerId").append("<option cid="+sensorId+" value="+data.datas[i].id+">"+data.datas[i].name+"</option>");
								if((i+1)== len){
									$("#triggerId").trigger('change');//通知更新
								}
							}
						}
						//如果为开关类型
						if(selrid == 12 || selrid == 13)
						{
							$(".canvasId > .canvas-con").attr("sensorIdtype",data.sensorType);//获取开关类型
							$(".canvasId > .canvas-con").removeAttr("newswitch");
							$("#newSwitch").val(0);
							if(data.sensorType == 2)//如果为可操作类型开关
							{
								$("#newSwitch").removeAttr("disabled");
							}else
							{
								$("#newSwitch").attr("disabled","disabled");
							}
						}
					},
					error:function()
					{
						tooltips("请求数据出错,请联系技术支持！","Warning");
					}
				});
			}
		}
	});
	//删除传感器时候触发
	$("#sensorId").on("select2:unselect",function(e)
	{
		//传感器
		var id  = $(this).val();
		if(id != null)
		{
			$(".canvasId > .canvas-con").attr("sensorId",id);//当前素材记录传感器
		}else
		{
			$(".canvasId > .canvas-con").removeAttr("sensorId");//同步清空记录
		}
		//触发器
		var cId = e.params.data.id;
		if(cId){
			$("#triggerId option[cid="+cId+"]").remove();
			$("#triggerId").trigger('change');//通知更新
		}
		var arrTrigg = $('#triggerId').select2('data');
		if(arrTrigg.length == 0)
		{
			/******** 同步清空报警设置 ********/
			warningArr = [0,0,0];
			$("#warningTXT").val("0");
			$("#warningState").val("0");
			$("#warningVoice").val("0");
			$(".canvasId > .canvas-con").removeAttr("warningArr");
		}
		
	});
	//选择触发器时触发
	$("#triggerId").on("select2:select",function(e)
	{
		var id  = $(this).val();
		$(".canvasId > .canvas-con").attr("triggerId",id);
	});
	//删除触发器时触发
	$("#triggerId").on("select2:unselect",function(e)
	{
		var id  = $(this).val();
		if(id != null)
		{
			$(".canvasId > .canvas-con").attr("triggerId",id);
		}else
		{
			$(".canvasId > .canvas-con").removeAttr("triggerId");//同步清空记录
			/******** 同步清空报警设置 ********/
			warningArr = [0,0,0];
			$("#warningTXT").val("0");
			$("#warningState").val("0");
			$("#warningVoice").val("0");
			$(".canvasId > .canvas-con").removeAttr("warningArr");
		}
	})
	//文本警告
	$(document).on("change", "#warningTXT", function(){
		var triggerid = $(".canvasId > .canvas-con").attr("triggerid") || -1;
		var val = $(this).val();
		if(triggerid != -1){
			warningArr.splice(0,1,val);
			$(".canvasId > .canvas-con").attr("warningArr",warningArr);
			if(val == 1)
			{
				$('#warningText').show();
				$('#warningText').animate(
				{
					left:'60px'
				});
				setTimeout(function() 
				{
					$('#warningText').animate(
					{
						left:'-105%'
					},function()
					{
						$('#warningText').hide();
					});
				},5000);
			}
		}else{
			tooltips("请先设置触发器！","Warning");
			$(this).val(0);
		}
	});
	//文本警告框关闭
	$(document).on("click", "#warningDel", function(){
		$('#warningText').animate(
		{
			left:'-510px'
		});
	});
	//状态警告
	$(document).on("change", "#warningState", function(){
		var triggerid = $(".canvasId > .canvas-con").attr("triggerid") || -1;
		var val = $(this).val();
		if(triggerid != -1)
		{
			if(warningArr[1] != 0)
			{
				$(".canvasId > .canvas-con").removeClass(warningArr[1]);
			}
			warningArr.splice(1,1,val);
			$(".canvasId > .canvas-con").attr("warningArr",warningArr);
			$(".canvasId > .canvas-con").addClass(val);
			setTimeout(function() 
			{
				$(".canvasId > .canvas-con").removeClass(val);
			},2000);
		}else{
			tooltips("请先设置触发器！","Warning");
			$(this).val(0);
		}
	});
	//声音警告
	$(document).on("change", "#warningVoice", function(){
		var triggerid = $(".canvasId > .canvas-con").attr("triggerid") || -1;
		var val = $(this).val();
		if(triggerid != -1)
		{
			if(warningArr[2] != 0)
			{
				$(".canvasId > .canvas-con").removeClass(warningArr[2]);
			}
			warningArr.splice(2,1,val);
			$(".canvasId > .canvas-con").attr("warningArr",warningArr);
			$("#voiceID").find("source").attr("src",basePath+"/images/zutai_new/voice/"+val);
			var voiceID = $("#voiceID")[0];
			voiceID.load();
		}else{
			tooltips("请先设置触发器！","Warning");
			$(this).val(0);
		}
	});
	//可操作开关是否允许操作
	$(document).on("change", "#newSwitch", function(){
		var val = $(this).val();
		if(val == 0)
		{
			$(".canvasId > .canvas-con").attr("newSwitch",val);
		}else{
			$(".canvasId > .canvas-con").attr("newSwitch",val);
		}
	});
	/********************************************************* 设备地图定位  ************************************************************************/
	$("#mapDeviceId").select2(
	{
		placeholder:"请选择设备",
		multiple:true,
		closeOnSelect:false,
	});
	$("#mapDeviceId").val(null).trigger('change');
	//选择设备的时候触发
	$("#mapDeviceId").on("select2:select",function(e)
	{
		var id  = $(this).val();
		$(".canvasId > .canvas-con").attr("deviceid",id);
	});
	//删除触发器时触发
	$("#mapDeviceId").on("select2:unselect",function(e)
	{
		var id  = $(this).val();
		if(id != null)
		{
			$(".canvasId > .canvas-con").attr("deviceid",id);
		}else
		{
			$(".canvasId > .canvas-con").removeAttr("deviceid");//同步清空记录
		}
	})
	/******************************************* 图表类型数值在线状态 ***********************************/
	//是否显示在线状态
	$(document).on("change", "#numStateYN", function()
	{
		var val = $(this).val();
		if(val == 0)
		{
			$(".canvasId > .canvas-con > .numState").show();
		}else if(val == 1)
		{
			$(".canvasId > .canvas-con > .numState").hide();
		}
	});
	//在线颜色
	$("#numStateON").spectrum(
	{
		allowEmpty:true,//允许为空,显示清除颜色按钮
		color:"transparent",//初始化颜色
		showInput:true,//显示输入
		containerClassName:"panelColor",//引用类选择器,可以改变颜色选择器面板的样式
		replacerClassName:"inputColor",//引用类选择器,可以改变颜色选择器的样式
		showInitial:true,//显示初始颜色,提供现在选择的颜色和初始颜色对比
		showPalette:true,//显示选择器面板
		showSelectionPalette: true,//记住选择过的颜色
		clickoutFiresChange: false,//单击选择器外部,如果颜色有改变则应用
		showAlpha:true,//显示透明度选择
		maxPaletteSize:10,//记住选择过的颜色的最大数量
		preferredFormat:"rgb",//输入框颜色格式,(hex十六进制,hex3十六进制可以的话只显示3位,hsl,rgb三原色,name英文名显示)
		localStorageKey:false,//把选择过的颜色存在浏览器上
		clickoutFiresChange:true,//单击选择器外部,如果颜色有改变则应用
		cancelText: "关闭",
		chooseText: "确定",
		appendTo: "body",//选择选择器容器是附加到哪个元素
		palette:
		[
			[
				"#FFFFFF", "#000000", "#696969", "#FF7D23", "#AA40FF", "#1F0068", "#B81B6C", "#4617B4", "#E064B7", "#FF1D77", "#2D004E", "#FF768C", "#B81B1B", "#7200AC", "#D39DD9", "#FF2E12", "#C1004F", "#E1B700", "#E56C19", "#4E0038", "#83BA1F", "#FF981D", "#4E0000", "#91D100", "#15992A", "#B01E00", "#00AAAA", "#00C13F", "#2E1700", "#00D8CC", "#004A00", "#632F00", "#569CE3", "#119900", "#AE113D", "#56C5FF", "#004D60", "#2673EC", "#1B58B8", "#008287", "#78BA00", "#1FAEFF", "#001E4E", "#F4B300", "#691BB8", "#006AC1", "#ff461f", "#003472", "#057748", "#be002f", "#8d4bbb", "#ff2d51", "#3399FF", "#FFFF66", "#FF99CC", "#FF6666", "#CCCCCC", "#CC9966", "#99FFCC", "#99CC66", "#9966CC", "#66FF66", "#6699CC", "#666666"
			]
		],
		change:function(color)
		{
			var hexColor = "transparent";
	　　　　if(color)
			{
	　　　　　　hexColor = color.toRgbString();
	　　　　}
			$(".canvasId > .canvas-con").children(".numState").css("background-color",hexColor);
			$(".canvasId > .canvas-con").children(".numState").attr("colorON",hexColor);
		},
		move:function(color)
		{
			var hexColor = "transparent";
	　　　　if(color)
			{
	　　　　　　hexColor = color.toRgbString();
	　　　　}
			$(".canvasId > .canvas-con").children(".numState").css("background-color",hexColor);
			$(".canvasId > .canvas-con").children(".numState").attr("colorON",hexColor);
		}
	});
	//离线颜色
	$("#numStateOff").spectrum(
	{
		allowEmpty:true,//允许为空,显示清除颜色按钮
		color:"transparent",//初始化颜色
		showInput:true,//显示输入
		containerClassName:"panelColor",//引用类选择器,可以改变颜色选择器面板的样式
		replacerClassName:"inputColor",//引用类选择器,可以改变颜色选择器的样式
		showInitial:true,//显示初始颜色,提供现在选择的颜色和初始颜色对比
		showPalette:true,//显示选择器面板
		showSelectionPalette: true,//记住选择过的颜色
		clickoutFiresChange: false,//单击选择器外部,如果颜色有改变则应用
		showAlpha:true,//显示透明度选择
		maxPaletteSize:10,//记住选择过的颜色的最大数量
		preferredFormat:"rgb",//输入框颜色格式,(hex十六进制,hex3十六进制可以的话只显示3位,hsl,rgb三原色,name英文名显示)
		localStorageKey:false,//把选择过的颜色存在浏览器上
		clickoutFiresChange:true,//单击选择器外部,如果颜色有改变则应用
		cancelText: "关闭",
		chooseText: "确定",
		appendTo: "body",//选择选择器容器是附加到哪个元素
		palette:
		[
			[
				"#FFFFFF", "#000000", "#696969", "#FF7D23", "#AA40FF", "#1F0068", "#B81B6C", "#4617B4", "#E064B7", "#FF1D77", "#2D004E", "#FF768C", "#B81B1B", "#7200AC", "#D39DD9", "#FF2E12", "#C1004F", "#E1B700", "#E56C19", "#4E0038", "#83BA1F", "#FF981D", "#4E0000", "#91D100", "#15992A", "#B01E00", "#00AAAA", "#00C13F", "#2E1700", "#00D8CC", "#004A00", "#632F00", "#569CE3", "#119900", "#AE113D", "#56C5FF", "#004D60", "#2673EC", "#1B58B8", "#008287", "#78BA00", "#1FAEFF", "#001E4E", "#F4B300", "#691BB8", "#006AC1", "#ff461f", "#003472", "#057748", "#be002f", "#8d4bbb", "#ff2d51", "#3399FF", "#FFFF66", "#FF99CC", "#FF6666", "#CCCCCC", "#CC9966", "#99FFCC", "#99CC66", "#9966CC", "#66FF66", "#6699CC", "#666666"
			]
		],
		change:function(color)
		{
			var hexColor = "transparent";
	　　　　if(color)
			{
	　　　　　　hexColor = color.toRgbString();
	　　　　}
			$(".canvasId > .canvas-con").children(".numState").attr("colorOFF",hexColor);
		},
		move:function(color)
		{
			var hexColor = "transparent";
	　　　　if(color)
			{
	　　　　　　hexColor = color.toRgbString();
	　　　　}
			$(".canvasId > .canvas-con").children(".numState").attr("colorOFF",hexColor);
		}
	});
	//是否显示在线时间
	$(document).on("change", "#addTime", function()
	{
		var val = $(this).val();
		if(val == 0)
		{
			$(".canvasId > .canvas-con").attr("time",val);
			$(".canvasId > .canvas-con").children(".updateTime").remove();
		}else if(val == 1)
		{
			$(".canvasId > .canvas-con").attr("time",val);
			var tem = '<span class="updateTime">2018-08-30 00:00:00</span>';
			$(".canvasId > .canvas-con").append(tem);
			startTime();
		}
	});
	/******************************************* 文本组件是否允许数据下发 ***********************************/
	//数据下发图标颜色
	$("#numDownColor").spectrum(
	{
		allowEmpty:true,//允许为空,显示清除颜色按钮
		color:"transparent",//初始化颜色
		showInput:true,//显示输入
		containerClassName:"panelColor",//引用类选择器,可以改变颜色选择器面板的样式
		replacerClassName:"inputColor",//引用类选择器,可以改变颜色选择器的样式
		showInitial:true,//显示初始颜色,提供现在选择的颜色和初始颜色对比
		showPalette:true,//显示选择器面板
		showSelectionPalette: true,//记住选择过的颜色
		clickoutFiresChange: false,//单击选择器外部,如果颜色有改变则应用
		showAlpha:true,//显示透明度选择
		maxPaletteSize:10,//记住选择过的颜色的最大数量
		preferredFormat:"rgb",//输入框颜色格式,(hex十六进制,hex3十六进制可以的话只显示3位,hsl,rgb三原色,name英文名显示)
		localStorageKey:false,//把选择过的颜色存在浏览器上
		clickoutFiresChange:true,//单击选择器外部,如果颜色有改变则应用
		cancelText: "关闭",
		chooseText: "确定",
		appendTo: "body",//选择选择器容器是附加到哪个元素
		palette:
		[
			[
				"#FFFFFF", "#000000", "#696969", "#FF7D23", "#AA40FF", "#1F0068", "#B81B6C", "#4617B4", "#E064B7", "#FF1D77", "#2D004E", "#FF768C", "#B81B1B", "#7200AC", "#D39DD9", "#FF2E12", "#C1004F", "#E1B700", "#E56C19", "#4E0038", "#83BA1F", "#FF981D", "#4E0000", "#91D100", "#15992A", "#B01E00", "#00AAAA", "#00C13F", "#2E1700", "#00D8CC", "#004A00", "#632F00", "#569CE3", "#119900", "#AE113D", "#56C5FF", "#004D60", "#2673EC", "#1B58B8", "#008287", "#78BA00", "#1FAEFF", "#001E4E", "#F4B300", "#691BB8", "#006AC1", "#ff461f", "#003472", "#057748", "#be002f", "#8d4bbb", "#ff2d51", "#3399FF", "#FFFF66", "#FF99CC", "#FF6666", "#CCCCCC", "#CC9966", "#99FFCC", "#99CC66", "#9966CC", "#66FF66", "#6699CC", "#666666"
			]
		],
		change:function(color)
		{
			var hexColor = "transparent";
	　　　　if(color)
			{
	　　　　　　hexColor = color.toRgbString();
	　　　　}
			$(".canvasId > .canvas-con").children(".numDown").css("color",hexColor);
		},
		move:function(color)
		{
			var hexColor = "transparent";
	　　　　if(color)
			{
	　　　　　　hexColor = color.toRgbString();
	　　　　}
			$(".canvasId > .canvas-con").children(".numDown").css("color",hexColor);
		}
	});
	//否允许数据下发
	$(document).on("change", "#numDownAdd", function()
	{
		var val = $(this).val();
		if(val == 0)
		{
			$(".canvasId > .canvas-con").attr("numDown",val);
			var tem = '<div class="numDown iconfont">&#xe622;</div>';
			$(".canvasId > .canvas-con").append(tem);
		}else if(val == 1)
		{
			$(".canvasId > .canvas-con").attr("numDown",val);
			$(".canvasId > .canvas-con").children(".numDown").remove();
			$("#numDownColor").spectrum("set","transparent");
		}
	});
	/******************************************* 自定义开关图表组 ***********************************/
	//选择开关组
	$(document).on("change", "#selectSwitc", function()
	{
		var val = $(this).val();
		var srcON  = $(this).find("option:selected").attr("srcon");
		var srcOFF = $(this).find("option:selected").attr("srcoff");
		$("#img-updivON img").attr("src",srcON);
		$("#img-updivOFF img").attr("src",srcOFF);
		$(".canvasId").find(".switchON img").attr("src",srcON);
		$(".canvasId").find(".switchOFF img").attr("src",srcOFF);
		$(".canvasId").find(".canvas-con").attr("switch",val);
	});
	/******************************************* 分辨带颜色设置 ***********************************/
	$("#pxColor").spectrum(
	{
		allowEmpty:true,//允许为空,显示清除颜色按钮
		color:"transparent",//初始化颜色
		showInput:true,//显示输入
		containerClassName:"panelColor",//引用类选择器,可以改变颜色选择器面板的样式
		replacerClassName:"inputColor",//引用类选择器,可以改变颜色选择器的样式
		showInitial:true,//显示初始颜色,提供现在选择的颜色和初始颜色对比
		showPalette:true,//显示选择器面板
		showSelectionPalette: true,//记住选择过的颜色
		clickoutFiresChange: false,//单击选择器外部,如果颜色有改变则应用
		showAlpha:false,//显示透明度选择
		maxPaletteSize:10,//记住选择过的颜色的最大数量
		preferredFormat:"hex",//输入框颜色格式,(hex十六进制,hex3十六进制可以的话只显示3位,hsl,rgb三原色,name英文名显示)
		localStorageKey:false,//把选择过的颜色存在浏览器上
		clickoutFiresChange:true,//单击选择器外部,如果颜色有改变则应用
		cancelText: "关闭",
		chooseText: "确定",
		appendTo: "body",//选择选择器容器是附加到哪个元素
		palette:
		[
			[
				"#FFFFFF", "#000000", "#696969", "#FF7D23", "#AA40FF", "#1F0068", "#B81B6C", "#4617B4", "#E064B7", "#FF1D77", "#2D004E", "#FF768C", "#B81B1B", "#7200AC", "#D39DD9", "#FF2E12", "#C1004F", "#E1B700", "#E56C19", "#4E0038", "#83BA1F", "#FF981D", "#4E0000", "#91D100", "#15992A", "#B01E00", "#00AAAA", "#00C13F", "#2E1700", "#00D8CC", "#004A00", "#632F00", "#569CE3", "#119900", "#AE113D", "#56C5FF", "#004D60", "#2673EC", "#1B58B8", "#008287", "#78BA00", "#1FAEFF", "#001E4E", "#F4B300", "#691BB8", "#006AC1", "#ff461f", "#003472", "#057748", "#be002f", "#8d4bbb", "#ff2d51", "#3399FF", "#FFFF66", "#FF99CC", "#FF6666", "#CCCCCC", "#CC9966", "#99FFCC", "#99CC66", "#9966CC", "#66FF66", "#6699CC", "#666666"
			]
		],
		change:function(color)
		{
			var hexColor = "transparent";
	　　　　if(color)
			{
	　　　　　　hexColor = color.toHexString();
	　　　　}
			$("#pxColor").val(hexColor);
		},
		move:function(color)
		{
			var hexColor = "transparent";
	　　　　if(color)
			{
	　　　　　　hexColor = color.toHexString();
	　　　　}
			$("#pxColor").val(hexColor);
		}
	});
	//增加数值条件
	$(document).on("click", "#pxAdd", function()
	{
		var numbe = Number($("#pxNum").val());
		var color = $("#pxColor").val();
		var zf  = /^(-|\+)?\d+$/;
		if(zf.test(numbe) == true && color != "")
		{
			if(pxColorMin == "a")//设置分辨带小于等于
			{
				pxColor.push([pxColorMin,numbe,color]);
				var pxTEM = '<div class="pxAlready">'+
								'<div class="pxAlreadyTxT">'+
									"≤ "+numbe+
								'</div>'+
								'<div class="pxAlreadycor" style="background-color:'+color+'">'+
								'</div>'+
								'<a href="javascript:;" class="iconfont pxDel" num="'+numbe+'">'+
									'&#xecec;'+
								'</a>'+
							'</div>';
				$("#pxAlready").append(pxTEM);
				$("#pxNum").attr("num",numbe);//更新上一次输入的值
				pxColorMin = numbe;//赋值分辨带值小于
			}else
			{
				if(pxColorMax == "a")
				{
					var num = Number($("#pxNum").attr("num"));
					if(numbe == num)//设置分辨带大于等于
					{
						if(pxColor.length > 1)
						{
							pxColor.push([pxColorMax,numbe,color]);
							var pxTEM = '<div class="pxAlready">'+
								'<div class="pxAlreadyTxT">'+
									"＞ "+numbe+
								'</div>'+
								'<div class="pxAlreadycor" style="background-color:'+color+'">'+
								'</div>'+
								'<a href="javascript:;" class="iconfont pxDel" num="'+numbe+'">'+
									'&#xecec;'+
								'</a>'+
							'</div>';
							$("#pxAlready").append(pxTEM);
							$("#pxNum").attr("num",numbe);//更新上一次输入的值
							pxColorMax = numbe;//赋值分辨带值大于
						}else
						{
							tooltips("分辨单条件公式需满足(条件≤)(区间条件...)(条件＞)或(条件≤)(区间条件...)不能为(条件≤)(条件＞),请修改条件！","Warning");
						}
					}else
					{
						if(numbe > num)
						{
							pxColor.push([num,numbe,color]);
							var pxTEM = '<div class="pxAlready">'+
											'<div class="pxAlreadyTxT">'+
												num+" - "+numbe+
											'</div>'+
											'<div class="pxAlreadycor" style="background-color:'+color+'">'+
											'</div>'+
											'<a href="javascript:;" class="iconfont pxDel" num="'+numbe+'">'+
												'&#xecec;'+
											'</a>'+
										'</div>';
							$("#pxAlready").append(pxTEM);
							$("#pxNum").attr("num",numbe);//更新上一次输入的值
							
						}else{
							var num = Number($("#pxNum").attr("num"));
							tooltips("当前输入必须大于或等于上一次输入的值(上次值为"+num+")！","Warning");
						}
					}
				}else
				{
					tooltips("您已设置分辨单值(大于)条件,如需更新分辨带大于数值条件,请删除最大值！","Warning");
				}
			}
		}
		else
		{
			tooltips("只能输入正负整数以及区间展示颜色不能为空！","Warning");
		}
	})
	//添加分辨带数值条件
	$(document).on("click", "#pxAddCanvas", function()
	{
		if(pxColor.length > 1)
		{
			$(".canvasId > .canvas-con").attr("pxColor",pxColor);
			var id = $(".canvasId").children(".canvas-con").children(".myECharts").attr("id");
			realpxColor(id);
			tooltips("添加成功！","Success");
		}else
		{
			tooltips("您至少要设置2条分辨带条件,请增加条件！","Warning");
		}
	});	
	//删除
	$(document).on("click", ".pxDel", function()
	{
		var arrId = $(this).parent(".pxAlready").index();//获取下标
		var len = $("#pxAlready > .pxAlready").length;
		if(len == 1)//如果删除最后一条则恢复默认
		{
			$("#pxNum").attr("num",0);//清空最大值
			pxColorMin   = "a";//恢复原始分辨带值小于
			pxColorMax   = "a";//恢复原始分辨带值大于
			pxColor.splice(arrId,1);//删除当前下标数组
			$(this).parent(".pxAlready").remove();//删除当前
			$(".canvasId > .canvas-con").attr("pxColor",pxColor);//更新分辨带
			//恢复默认
			var id = $(".canvasId").children(".canvas-con").children(".myECharts").attr("id");
			var myChart = echarts.init(document.getElementById(id));
			myChart.setOption(
			{
				visualMap:{pieces:[{lte:-100,color:'#4c84ff'},{gt:-100,lte:0,color:'#3c763d'},{gt:0,lte:50,color:'#096'},{gt:50,lte:100,color:'#ffde33'},{gt:100,lte:150,color:'#ff9933'},{gt:150,lte:200,color:'#cc0033'},{gt:200,lte:300,color:'#660099'},{gt:300,color:'#7e0023'}]},
				series:[{ markLine:{data:[{yAxis:-100},{yAxis:0},{yAxis:50},{yAxis:100},{yAxis:150},{yAxis: 200},{yAxis: 300}]}}]
			})
			tooltips("删除最后恢复默认！","Success");
		}else
		{
			var num = $(this).attr("num");//获取当前要删除的值
			var max = $("#pxNum").attr("num");//获取最大值
			if(num == max)
			{
				var zhi = $(this).parent(".pxAlready").prev(".pxAlready").children(".pxDel").attr("num");//获取删除后的最大值
				$("#pxNum").attr("num",zhi);//设置已添加最大值
				pxColorMax   = "a";//恢复原始分辨带值大于
			}
			pxColor.splice(arrId,1);//删除当前下标数组
			$(this).parent(".pxAlready").remove();//删除当前
		}
	})
	/******************************************* 仪表盘刻度设置 ***********************************/
	$(document).on("click", "#MeterAdd", function()
	{
		var z   = /^\+?[1-9][0-9]*$/;
		var fd  = /^(-?\d+)(\.\d+)?$/;
		var zf  = /^(-|\+)?\d+$/;
		var min = $("#Meter-min").val();//最小值
		var max = $("#Meter-max").val();//最大值
		var val = $("#Meter-type").val();//计量单位
		var nam = $("#Meter-name").val();//表盘数据名称
		var num = $("#Meter-Number").val();//表盘刻度的分割段数
		var spl = $("#Meter-split").val();//分割线之间分割的刻度数
		var tex = $("#Meter-text").val();//表盘数值字体大小
		var txt = $("#Meter-txt").val();//表盘名称字体大小
		if(fd.test(min) == false)
		{
			tooltips("只能输入正负整数,浮点数和0！","Warning");
			$("#Meter-min")[0].focus(); 
			$("#Meter-min").addClass("Meter-red");
			setTimeout(function() 
			{
				$("#Meter-min").removeClass("Meter-red");
			},3000);
		}else if(fd.test(max) == false)
		{
			tooltips("只能输入正负整数,浮点数和0！","Warning");
			$("#Meter-max")[0].focus(); 
			$("#Meter-max").addClass("Meter-red");
			setTimeout(function() 
			{
				$("#Meter-max").removeClass("Meter-red");
			},3000);
		}else if(val == "")
		{
			tooltips("计量单位不能为空！","Warning");
			$("#Meter-type")[0].focus(); 
			$("#Meter-type").addClass("Meter-red");
			setTimeout(function() 
			{
				$("#Meter-type").removeClass("Meter-red");
			},3000);
		}else if(nam == "")
		{
			tooltips("表盘数据名称不能为空！","Warning");
			$("#Meter-name")[0].focus(); 
			$("#Meter-name").addClass("Meter-red");
			setTimeout(function() 
			{
				$("#Meter-name").removeClass("Meter-red");
			},3000);
		}else if(z.test(num) == false)
		{
			tooltips("表盘刻度的分割段数大于0且只能是正整数！","Warning");
			$("#Meter-Number")[0].focus(); 
			$("#Meter-Number").addClass("Meter-red");
			setTimeout(function() 
			{
				$("#Meter-Number").removeClass("Meter-red");
			},3000);
		}else if(z.test(spl) == false)
		{
			tooltips("分割线之间分割的刻度数大于0且只能是正整数！","Warning");
			$("#Meter-split")[0].focus(); 
			$("#Meter-split").addClass("Meter-red");
			setTimeout(function() 
			{
				$("#Meter-split").removeClass("Meter-red");
			},3000);
		}else if(z.test(tex) == false || tex <= 10)
		{
			tooltips("表盘数值字体大小大于10且只能是正整数！","Warning");
			$("#Meter-text")[0].focus(); 
			$("#Meter-text").addClass("Meter-red");
			setTimeout(function() 
			{
				$("#Meter-text").removeClass("Meter-red");
			},3000);
		}else if(z.test(txt) == false || tex <= 10)
		{
			tooltips("表盘名称字体大小大于10且只能是正整数！","Warning");
			$("#Meter-txt")[0].focus(); 
			$("#Meter-txt").addClass("Meter-red");
			setTimeout(function() 
			{
				$("#Meter-txt").removeClass("Meter-red");
			},3000);
		}else
		{
			if(min > max)
			{
				tooltips("最小值不能大于最大值！","Warning");
				$("#Meter-min")[0].focus(); 
				$("#Meter-min").addClass("Meter-red");
				setTimeout(function() 
				{
					$("#Meter-min").removeClass("Meter-red");
				},3000);
			}else
			{
				arrMeter.splice(0,1,min);
				arrMeter.splice(1,1,max);
				arrMeter.splice(2,1,val);
				arrMeter.splice(3,1,nam);
				arrMeter.splice(4,1,num);
				arrMeter.splice(5,1,spl);
				arrMeter.splice(6,1,tex);
				arrMeter.splice(7,1,txt);
				$(".canvasId > .canvas-con").attr("arrMeter",arrMeter);//更新仪表盘设置
				var id = $(".canvasId").children(".canvas-con").children(".myECharts").attr("id");
				var myChart = echarts.init(document.getElementById(id));
				myChart.setOption(
				{
					tooltip:{
				        formatter: "{b}<br/>{a}:{c}"+arrMeter[2]
				    },
					series:[{
							name:arrMeter[3],
							min:arrMeter[0],
							max:arrMeter[1],
							splitNumber:arrMeter[4],
							axisTick:{splitNumber:arrMeter[5]},
							title:{fontSize:arrMeter[7]},
							detail: {formatter:'{value}'+arrMeter[2],fontSize:arrMeter[6]},
					}]
				})
				tooltips("添加成功！","Success");
			}
		}
	});
	/******************************************* 蓄水池设置 ***********************************/
	$(document).on("click", "#Reservoir-Add", function()
	{
		var id = $(".canvasId").children(".canvas-con").children(".myECharts").attr("id");
		var myChart = echarts.init(document.getElementById(id));
		var fd  = /^(-?\d+)(\.\d+)?$/;
		var z   = /^\+?[1-9][0-9]*$/;
		var max = $("#Reservoir-max").val();//最大值
		var siz = $("#Reservoir-size").val();//文字大小
		var val = $("#Reservoir-unit").val();//单位
		Reservoir.splice(0,1,max);
		Reservoir.splice(1,1,siz);
		Reservoir.splice(2,1,val);
		if(Reservoir[0])
		{
			if(fd.test(max) == false)
			{
				tooltips("只能输入正负整数,浮点数和0！","Warning");
				$("#Reservoir-max")[0].focus(); 
				$("#Reservoir-max").addClass("Meter-red");
				setTimeout(function() 
				{
					$("#Reservoir-max").removeClass("Meter-red");
				},3000);
				return false;
			}
		}
		if(Reservoir[1])
		{
			if(z.test(siz) == false || siz <= 10)
			{
				tooltips("文字大小大于10且只能是正整数！","Warning");
				$("#Reservoir-size")[0].focus(); 
				$("#Reservoir-size").addClass("Meter-red");
				setTimeout(function() 
				{
					$("#Reservoir-size").removeClass("Meter-red");
				},3000);
				return false;
			}
		}else{
			myChart.setOption(
			{
				series:[{
					label:{
						fontSize:20,
					},
				}]
			})
		}
		if(Reservoir[1])
		{
			myChart.setOption(
			{
				series:[{
					label:{
						fontSize:Reservoir[1],
					},
				}]
			})
		}
		//添加
		$(".canvasId > .canvas-con").attr("reservoir",Reservoir);
		tooltips("添加成功！","Success");
	});
	/******************************************* 固定数据下发 ***********************************/
	$(document).on("click", "#downDataAdd", function()
	{
		
		var sensorid = $(".canvasId").children(".canvas-con").attr("sensorid");
		if(sensorid)
		{
			var text = $("#downDataText").val();
			if(text === "")
			{
				tooltips("请输入要发送的数据！","Success");
			}else
			{
				$(".canvasId > .canvas-con").attr("downData",text);
				tooltips("添加成功！","Success");
			}
		}else
		{
			tooltips("请先选择传感器！","Warning");
		}
	});
	/******************************************* 开关关闭后是否隐藏管道 ***********************************/
	$(document).on("change", "#tubeHide", function()
	{
		var val = $(this).val();
		if(val == 0)
		{
			$(".canvasId > .canvas-con").attr("tubeHide",val);
		}else if(val == 1)
		{
			$(".canvasId > .canvas-con").attr("tubeHide",val);
		}
	});
	/******************************************* 蓄水池无边框设置 ***********************************/
	//背景颜色
	$("#publicReservoirColor").spectrum(
	{
		allowEmpty:true,//允许为空,显示清除颜色按钮
		color:"transparent",//初始化颜色
		showInput:true,//显示输入
		containerClassName:"panelColor",//引用类选择器,可以改变颜色选择器面板的样式
		replacerClassName:"inputColor",//引用类选择器,可以改变颜色选择器的样式
		showInitial:true,//显示初始颜色,提供现在选择的颜色和初始颜色对比
		showPalette:true,//显示选择器面板
		showSelectionPalette: true,//记住选择过的颜色
		clickoutFiresChange: false,//单击选择器外部,如果颜色有改变则应用
		showAlpha:false,//显示透明度选择
		maxPaletteSize:10,//记住选择过的颜色的最大数量
		preferredFormat:"hex",//输入框颜色格式,(hex十六进制,hex3十六进制可以的话只显示3位,hsl,rgb三原色,name英文名显示)
		localStorageKey:false,//把选择过的颜色存在浏览器上
		clickoutFiresChange:true,//单击选择器外部,如果颜色有改变则应用
		cancelText: "关闭",
		chooseText: "确定",
		appendTo: "body",//选择选择器容器是附加到哪个元素
		palette:
		[
			[
				"#FFFFFF", "#000000", "#696969", "#FF7D23", "#AA40FF", "#1F0068", "#B81B6C", "#4617B4", "#E064B7", "#FF1D77", "#2D004E", "#FF768C", "#B81B1B", "#7200AC", "#D39DD9", "#FF2E12", "#C1004F", "#E1B700", "#E56C19", "#4E0038", "#83BA1F", "#FF981D", "#4E0000", "#91D100", "#15992A", "#B01E00", "#00AAAA", "#00C13F", "#2E1700", "#00D8CC", "#004A00", "#632F00", "#569CE3", "#119900", "#AE113D", "#56C5FF", "#004D60", "#2673EC", "#1B58B8", "#008287", "#78BA00", "#1FAEFF", "#001E4E", "#F4B300", "#691BB8", "#006AC1", "#ff461f", "#003472", "#057748", "#be002f", "#8d4bbb", "#ff2d51", "#3399FF", "#FFFF66", "#FF99CC", "#FF6666", "#CCCCCC", "#CC9966", "#99FFCC", "#99CC66", "#9966CC", "#66FF66", "#6699CC", "#666666"
			]
		],
		change:function(color)
		{
			var hexColor = "transparent";
	　　　　if(color)
			{
	　　　　　　hexColor = color.toHexString();
	　　　　}
			publicReservoir.splice(3,1,hexColor);//将颜色添加数组
		},
		move:function(color)
		{
			var hexColor = "transparent";
	　　　　if(color)
			{
	　　　　　　hexColor = color.toHexString();
	　　　　}
			publicReservoir.splice(3,1,hexColor);//将颜色添加数组
		}
	});
	//其他设置
	$(document).on("click", "#publicReservoirAdd",function()
	{
		var id = $(".canvasId").children(".canvas-con").children(".myECharts").attr("id");
		var myChart = echarts.init(document.getElementById(id));
		var fd  = /^(-?\d+)(\.\d+)?$/;
		var z   = /^\+?[1-9][0-9]*$/;
		var max = $("#publicReservoirMax").val();//最大值
		var siz = $("#publicReservoirSize").val();//文字大小
		var Ran = $("#publicReservoirRange").val();//波浪幅度
		var YN  = $("#publicReservoirYN").val();//是否显示百分比
		publicReservoir.splice(0,1,max);
		publicReservoir.splice(1,1,siz);
		publicReservoir.splice(2,1,Ran);
		publicReservoir.splice(4,1,YN);
		//最大值
		if(publicReservoir[0])
		{
			if(fd.test(max) == false)
			{
				tooltips("只能输入正负整数,浮点数和0！","Warning");
				$("#publicReservoirMax")[0].focus();
				$("#publicReservoirMax").addClass("Meter-red");
				setTimeout(function() 
				{
					$("#publicReservoirMax").removeClass("Meter-red");
				},3000);
				return false;
			}
		}
		//文本大小
		if(publicReservoir[1])
		{
			if(z.test(siz) == false || siz < 12)
			{
				tooltips("文字大小大于等于12且只能是正整数！","Warning");
				$("#publicReservoirSize")[0].focus(); 
				$("#publicReservoirSize").addClass("Meter-red");
				setTimeout(function() 
				{
					$("#publicReservoirSize").removeClass("Meter-red");
				},3000);
				return false;
			}else
			{
				myChart.setOption(
				{
					series:[{
						label:{
							fontSize:publicReservoir[1],
						},
					}]
				})
			}
		}
		//波浪幅度
		if(publicReservoir[2])
		{
			if(fd.test(Ran) == false || Ran < 0)
			{
				tooltips("波浪幅度大于0只能是正整数！","Warning");
				$("#publicReservoirRange")[0].focus();
				$("#publicReservoirRange").addClass("Meter-red");
				setTimeout(function() 
				{
					$("#publicReservoirRange").removeClass("Meter-red");
				},3000);
				return false;
			}else
			{
				myChart.setOption(
				{
					series:[{
						amplitude:publicReservoir[2],
					}]
				})
			}
		}
		//波浪颜色
		if(publicReservoir[3])
		{
			myChart.setOption(
			{
				series:[{
					color:[publicReservoir[3]],
					label:{
						color:[publicReservoir[3]],
					},
				}]
			})
			
		}
		// 是否显示百分比
		if(publicReservoir[4]){
			if(publicReservoir[4] == 0){
				myChart.setOption(
				{
					series:[{
						label:{
							show:true,
						},
					}]
				})
			}else if(publicReservoir[4] == 1){
				myChart.setOption(
				{
					series:[{
						label:{
							show:false,
						},
					}]
				})
			}
		}
		//添加
		$(".canvasId > .canvas-con").attr("publicReservoir",publicReservoir);
		tooltips("添加成功！","Success");
	});
	/******************************************* 百分比设置 ***********************************/
	//背景颜色
	$("#ProgressbarBac").spectrum(
	{
		allowEmpty:true,//允许为空,显示清除颜色按钮
		color:"transparent",//初始化颜色
		showInput:true,//显示输入
		containerClassName:"panelColor",//引用类选择器,可以改变颜色选择器面板的样式
		replacerClassName:"inputColor",//引用类选择器,可以改变颜色选择器的样式
		showInitial:true,//显示初始颜色,提供现在选择的颜色和初始颜色对比
		showPalette:true,//显示选择器面板
		showSelectionPalette: true,//记住选择过的颜色
		clickoutFiresChange: false,//单击选择器外部,如果颜色有改变则应用
		showAlpha:false,//显示透明度选择
		maxPaletteSize:10,//记住选择过的颜色的最大数量
		preferredFormat:"hex",//输入框颜色格式,(hex十六进制,hex3十六进制可以的话只显示3位,hsl,rgb三原色,name英文名显示)
		localStorageKey:false,//把选择过的颜色存在浏览器上
		clickoutFiresChange:true,//单击选择器外部,如果颜色有改变则应用
		cancelText: "关闭",
		chooseText: "确定",
		appendTo: "body",//选择选择器容器是附加到哪个元素
		palette:
		[
			[
				"#FFFFFF", "#000000", "#696969", "#FF7D23", "#AA40FF", "#1F0068", "#B81B6C", "#4617B4", "#E064B7", "#FF1D77", "#2D004E", "#FF768C", "#B81B1B", "#7200AC", "#D39DD9", "#FF2E12", "#C1004F", "#E1B700", "#E56C19", "#4E0038", "#83BA1F", "#FF981D", "#4E0000", "#91D100", "#15992A", "#B01E00", "#00AAAA", "#00C13F", "#2E1700", "#00D8CC", "#004A00", "#632F00", "#569CE3", "#119900", "#AE113D", "#56C5FF", "#004D60", "#2673EC", "#1B58B8", "#008287", "#78BA00", "#1FAEFF", "#001E4E", "#F4B300", "#691BB8", "#006AC1", "#ff461f", "#003472", "#057748", "#be002f", "#8d4bbb", "#ff2d51", "#3399FF", "#FFFF66", "#FF99CC", "#FF6666", "#CCCCCC", "#CC9966", "#99FFCC", "#99CC66", "#9966CC", "#66FF66", "#6699CC", "#666666"
			]
		],
		change:function(color)
		{
			var hexColor = "transparent";
	　　　　if(color)
			{
	　　　　　　hexColor = color.toHexString();
	　　　　}
			Progressbar.splice(1,1,hexColor);//将颜色添加数组
		},
		move:function(color)
		{
			var hexColor = "transparent";
	　　　　if(color)
			{
	　　　　　　hexColor = color.toHexString();
	　　　　}
			Progressbar.splice(1,1,hexColor);//将颜色添加数组
		}
	});
	//填充颜色
	$("#tianchong").spectrum(
	{
		allowEmpty:true,//允许为空,显示清除颜色按钮
		color:"transparent",//初始化颜色
		showInput:true,//显示输入
		containerClassName:"panelColor",//引用类选择器,可以改变颜色选择器面板的样式
		replacerClassName:"inputColor",//引用类选择器,可以改变颜色选择器的样式
		showInitial:true,//显示初始颜色,提供现在选择的颜色和初始颜色对比
		showPalette:true,//显示选择器面板
		showSelectionPalette: true,//记住选择过的颜色
		clickoutFiresChange: false,//单击选择器外部,如果颜色有改变则应用
		showAlpha:false,//显示透明度选择
		maxPaletteSize:10,//记住选择过的颜色的最大数量
		preferredFormat:"hex",//输入框颜色格式,(hex十六进制,hex3十六进制可以的话只显示3位,hsl,rgb三原色,name英文名显示)
		localStorageKey:false,//把选择过的颜色存在浏览器上
		clickoutFiresChange:true,//单击选择器外部,如果颜色有改变则应用
		cancelText: "关闭",
		chooseText: "确定",
		appendTo: "body",//选择选择器容器是附加到哪个元素
		palette:
		[
			[
				"#FFFFFF", "#000000", "#696969", "#FF7D23", "#AA40FF", "#1F0068", "#B81B6C", "#4617B4", "#E064B7", "#FF1D77", "#2D004E", "#FF768C", "#B81B1B", "#7200AC", "#D39DD9", "#FF2E12", "#C1004F", "#E1B700", "#E56C19", "#4E0038", "#83BA1F", "#FF981D", "#4E0000", "#91D100", "#15992A", "#B01E00", "#00AAAA", "#00C13F", "#2E1700", "#00D8CC", "#004A00", "#632F00", "#569CE3", "#119900", "#AE113D", "#56C5FF", "#004D60", "#2673EC", "#1B58B8", "#008287", "#78BA00", "#1FAEFF", "#001E4E", "#F4B300", "#691BB8", "#006AC1", "#ff461f", "#003472", "#057748", "#be002f", "#8d4bbb", "#ff2d51", "#3399FF", "#FFFF66", "#FF99CC", "#FF6666", "#CCCCCC", "#CC9966", "#99FFCC", "#99CC66", "#9966CC", "#66FF66", "#6699CC", "#666666"
			]
		],
		change:function(color)
		{
			var hexColor = "transparent";
	　　　　if(color)
			{
	　　　　　　hexColor = color.toHexString();
	　　　　}
			Progressbar.splice(2,1,hexColor);//将颜色添加数组
		},
		move:function(color)
		{
			var hexColor = "transparent";
	　　　　if(color)
			{
	　　　　　　hexColor = color.toHexString();
	　　　　}
			Progressbar.splice(2,1,hexColor);//将颜色添加数组
		}
	});
	//文字颜色
	$("#ProgressbarColor").spectrum(
	{
		allowEmpty:true,//允许为空,显示清除颜色按钮
		color:"transparent",//初始化颜色
		showInput:true,//显示输入
		containerClassName:"panelColor",//引用类选择器,可以改变颜色选择器面板的样式
		replacerClassName:"inputColor",//引用类选择器,可以改变颜色选择器的样式
		showInitial:true,//显示初始颜色,提供现在选择的颜色和初始颜色对比
		showPalette:true,//显示选择器面板
		showSelectionPalette: true,//记住选择过的颜色
		clickoutFiresChange: false,//单击选择器外部,如果颜色有改变则应用
		showAlpha:false,//显示透明度选择
		maxPaletteSize:10,//记住选择过的颜色的最大数量
		preferredFormat:"hex",//输入框颜色格式,(hex十六进制,hex3十六进制可以的话只显示3位,hsl,rgb三原色,name英文名显示)
		localStorageKey:false,//把选择过的颜色存在浏览器上
		clickoutFiresChange:true,//单击选择器外部,如果颜色有改变则应用
		cancelText: "关闭",
		chooseText: "确定",
		appendTo: "body",//选择选择器容器是附加到哪个元素
		palette:
		[
			[
				"#FFFFFF", "#000000", "#696969", "#FF7D23", "#AA40FF", "#1F0068", "#B81B6C", "#4617B4", "#E064B7", "#FF1D77", "#2D004E", "#FF768C", "#B81B1B", "#7200AC", "#D39DD9", "#FF2E12", "#C1004F", "#E1B700", "#E56C19", "#4E0038", "#83BA1F", "#FF981D", "#4E0000", "#91D100", "#15992A", "#B01E00", "#00AAAA", "#00C13F", "#2E1700", "#00D8CC", "#004A00", "#632F00", "#569CE3", "#119900", "#AE113D", "#56C5FF", "#004D60", "#2673EC", "#1B58B8", "#008287", "#78BA00", "#1FAEFF", "#001E4E", "#F4B300", "#691BB8", "#006AC1", "#ff461f", "#003472", "#057748", "#be002f", "#8d4bbb", "#ff2d51", "#3399FF", "#FFFF66", "#FF99CC", "#FF6666", "#CCCCCC", "#CC9966", "#99FFCC", "#99CC66", "#9966CC", "#66FF66", "#6699CC", "#666666"
			]
		],
		change:function(color)
		{
			var hexColor = "transparent";
	　　　　if(color)
			{
	　　　　　　hexColor = color.toHexString();
	　　　　}
			Progressbar.splice(4,1,hexColor);//将颜色添加数组
		},
		move:function(color)
		{
			var hexColor = "transparent";
	　　　　if(color)
			{
	　　　　　　hexColor = color.toHexString();
	　　　　}
			Progressbar.splice(4,1,hexColor);//将颜色添加数组
		}
	});
	//其他设置
	$(document).on("click", "#ProgressbarAdd",function()
	{
		var id = $(".canvasId").children(".canvas-con").children(".myECharts").attr("id");
		var myChart = echarts.init(document.getElementById(id));
		var fd  = /^(-?\d+)(\.\d+)?$/;
		var z   = /^\+?[1-9][0-9]*$/;
		var max = $("#grayBar").val();//最大值
		var Ran = $("#Radious").val();//圆角
		var siz = $("#ProgressbarSize").val();//文字大小
		Progressbar.splice(0,1,max);
		Progressbar.splice(3,1,Ran);
		Progressbar.splice(5,1,siz);
		console.log(Progressbar);

		//最大值
		if(Progressbar[0])
		{
			if(fd.test(max) == false || max <= 0)
			{
				tooltips("只能输入大于0的正整数,浮点数！","Warning");
				$("#grayBa")[0].focus();
				$("#grayBa").addClass("Meter-red");
				setTimeout(function() 
				{
					$("#grayBa").removeClass("Meter-red");
				},3000);
				return false;
			}
		}
		//背景颜色
		if(Progressbar[1])
		{
			myChart.setOption(
			{
				series:[
					{
						itemStyle:{
							color:Progressbar[1]
						},
					},
					{
	
					}
				]
			})
		}
		//填充颜色
		if(Progressbar[2])
		{
			myChart.setOption(
			{
				series:[
					{
						
					},
					{
						itemStyle:{
							color:Progressbar[2]
						},
					}
				]
			})
		}
		//圆角大小
		if(Progressbar[3])
		{
			if(fd.test(Ran) == false || Ran < 0)
			{
				tooltips("只能输入大于等于0的正整数！","Warning");
				$("#Radious")[0].focus(); 
				$("#Radious").addClass("Meter-red");
				setTimeout(function() 
				{
					$("#Radious").removeClass("Meter-red");
				},3000);
				return false;
			}else
			{
				myChart.setOption(//设置圆角
				{
					series:[
						{
							itemStyle:{
								barBorderRadius:Number(Progressbar[3]),//圆角
							},
						},
						{
							itemStyle:{
								barBorderRadius:Number(Progressbar[3]),//圆角
							},
						}
					]
				})
			}
		}
		//文字颜色
		if(Progressbar[4])
		{
			myChart.setOption(
			{
				series:[
					{
						
					},
					{
						label:{
							normal:{
								textStyle:{
									color:Progressbar[4],//文字大小
								},
							}
						},
					}
				]
			})
		}
		//文字大小
		if(Progressbar[5])
		{
			if(fd.test(siz) == false || siz < 0)
			{
				tooltips("文字大小大于0只能是正整数！","Warning");
				$("#ProgressbarSize")[0].focus();
				$("#ProgressbarSize").addClass("Meter-red");
				setTimeout(function() 
				{
					$("#ProgressbarSize").removeClass("Meter-red");
				},3000);
				return false;
			}else
			{
				myChart.setOption(//设置文字大小
				{
					series:[
						{
							
						},
						{
							label:{
								normal:{
									textStyle:{
										fontSize:Number(Progressbar[5]),//文字大小
									},
								}
							},
						}
					]
				})
			}
		}
		//添加
		$(".canvasId > .canvas-con").attr("Progressbar",Progressbar);
		tooltips("添加成功！","Success");
	});
});

