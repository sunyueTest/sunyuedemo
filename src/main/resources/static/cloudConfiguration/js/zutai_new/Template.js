/****************************************** 
 ****************************************** 
 ****************************************** 
 * 
 * 全局变量end全局初始化
 * 
 ****************************************** 
 ****************************************** 
 ****************************************** 
 ******************************************* /


/******************************************************* 公共模拟滚动条 *******************************************************/
(function($){
	$(window).on("load",function(){
		$("#pc-leftUL, #pc_Shortcut_con, #pc_Update_con, #rightNav-con, #nav1, #gallery-column, #nav2, #nav5").mCustomScrollbar({
			theme:"dark",
			updateOnSelectorChange:true,
		});
	});
})(jQuery);
/************************************************************全局公共变量***********************************************************/
var basePath	 = $("#basePath").val();//域名
var zIndexT  	 = $("#pc-edit").find(".canvas").length;//初始化顶层
var zIndexB  	 = 0;//初始化底层
var copylone 	 = 0;//复制是否存在
var videoId  	 = $("#pc-edit").find(".newVideo").length;//初始化视频ID
var curveID 	 = $("#pc-edit").find(".myChartID").length;//初始化触发器ID
var svgW     	 = 100;//SVG图形宽
var svgH     	 = 100;//SVG图形高
var svgHtml  	 = "";//SVG图形HTML
var svgUrl   	 = "";//SVG图形URL
var navPage 	 = "#"+ $(".editShow").attr("id");//定义画布ID
var editFlag 	 = $("#flag").val();//获取是否是新建或者编辑
var AnimateVal   = 0;//是否设置动作以及那种动作
var Animatearray = [0,0,0,0];//设置动作类别[0]动作设置 [1]选择动作 [2]速度 [3]时间
var pxColorMin   = "a";//分辨带值小于
var pxColorMax   = "a";//分辨带值大于
var arrsensorid = [];

/************************************************************全局初始化***********************************************************/
$(function()
{
	//屏蔽系统鼠标右键
	$(document).ready(function(){
		$(document).on("contextmenu",function(){
			return false;
		});
		$(document).on("selectstart", function(e)
		{
			var noClass = e.target;
			if($(noClass).hasClass("txtId"))
			{
				return true;
			}else
			{
				return false;
			}
		});
	});
	//初始化层级
	if(zIndexT > 0)
	{
		var cs_index = [];
		$("#pc-edit").find(".canvas").each(function(index){
			var z = Number($(this).css("z-index"));
			if(!isNaN(z)){
				cs_index.push(z);
			}
			if((index+1) == $("#pc-edit").find(".canvas").length)
			{
				zIndexT = Math.max.apply(null, cs_index);
				zIndexB = Math.min.apply(null, cs_index);
			}
		});
	}
	//初始化视频ID
	if(videoId > 0)
	{
		var arrVideo = [];
		$("#pc-edit").find(".newVideo").each(function(index){
			var s = Number($(this).attr("video"));
			if(!isNaN(s)){
				arrVideo.push(s);
			}
			if((index+1) == $("#pc-edit").find(".newVideo").length)
			{
				videoId = Math.max.apply(null, arrVideo);
			}
		})
	}
	//初始化触发器ID
	if(curveID > 0)
	{
		var arrCurve = [];
		$("#pc-edit").find(".myChartID").each(function(index)
		{
			var s = Number($(this).attr("curve"));
			if(!isNaN(s)){
				arrCurve.push(s);
			}
			if((index+1) == $("#pc-edit").find(".myChartID").length)
			{
				curveID = Math.max.apply(null, arrCurve);//获取最大值
			}
		})
	}
	if(editFlag == 0)
	{
		var width =  $("#pc-edit").width();
		var height = $("#pc-edit").height();
		$("#pc-center").css({
			width:width,
			height:height,
		});
		$("#pc-width").val(width);
		$("#pc-height").val(height);
	}
	if(editFlag == 1)//如果是再次编辑则同步
	{
		var width =  $("#pc-center").width();//同步画布宽
		var height = $("#pc-center").height();//同步画布高
		$("#pc-width").val(width);
		$("#pc-height").val(height);
		//初始化清空调用次数
		$(".editNone, .newModalCon").attr("pageId","");
		//初始化时默认隐藏模态框
		$(".newModal, #pc-canvas").hide();
		//设置默认已经初始化
		$(navPage).attr("pageId",1);
		//禁止默认播放声音
		var voiceID = $("#voiceID")[0];
		voiceID.pause();
		//初始化辅助线
		var auxi = $("#pc-center").attr("auxiliary");
		if(auxi == 1)
		{
			$("#auxiliary").removeClass("auxiliaryB");
			$(".Guide").hide();
		}
		//运行页面是否自适应
		var adap = $("#pc-center").attr("adaption");
		if(adap == "no")
		{
			$("#adaption").val(adap);
		}
		//初始化图表
		$("#pc-edit").find(".newECharts").each(function(){
			initialECharts($(this));
		});
		//初始化编辑视频
		$("#pc-edit").find(".newVideo").each(function()
		{
			var $this = $(this);
			$this.children(".myPlayer").empty();
			var sensorId = $this.attr("sensorid");
			var video    = $this.attr("video");
			var myVideo  = "my"+ video +"Player";
			var data1    = $this.attr("data1");
			var data2    = $this.attr("data2");
//			if(data1&&data2){
				$this.children(".myPlayer").append('<video  class="myVideo" id="'+myVideo+'" poster="" controls playsInline webkit-playsinline autoplay><source src="'+data1+'" type="" /><source src="'+data2+'" type="application/x-mpegURL" /></video>');
				setTimeout(function() 
				{
					new_video(myVideo);
				},500);
//			}
		});
	}
})

function handleError(e) {
		console.log('捕获到错误',e);
//			if(9048 == e.retcode){
//				alert("播放器免费版并发数达到上限，请前往萤石云升级企业版使用多并发能力");
//			}
	}

/************************************************************画布模板***********************************************************/
function editTemp(max)
{
	if($("#editNav").length > 0)
	{
		var nava = 
				'<a href="javascript:;" hid="#edit'+max+'" class="editNavA" num='+ max +'>'+
					'栏目'+max+
				'</a>';
		$("#editNav").append(nava);
		var edit = 
			'<div class="editNone" id="edit'+max+'">'+
				'<div class="Guide" id="Guide'+max+'">'+
				'</div>'+
			'</div>';
		$("#pc-center").append(edit);
	}else
	{
		var nava = 
				'<div class="navAbsolute navTop" id="editNav" anima="0">'+
					'<a href="javascript:;" hid="#edit'+max+'" class="editNavA editNavB" num='+ max +'>'+
						'栏目(鼠标右键删除)'+max+
					'</a>'+
				'</div>';
		$("#numName").val("栏目(鼠标右键删除)");		
		$("#pc-center").append(nava);
	}
};
/************************************************************右键功能模板**************************************************/
function mouseR(cla,e,zIndexT,zIndexB,cut_style)
{
	var x     = e.clientX;//top偏移量
	var y     = e.clientY;//left偏移量
	var w     = $(window).width();
	var h     = $(window).height();
	var poseX = (x+150)>w?"right:"+ (w-x) +"px;":"left:"+ x +"px;";
	var poseY = (y+370)>h?"bottom:" + (h-y) + "px":"top:" + y + "px";
	var Lid = cla.attr("Lid");//获取锁定状态
	var Locking  = "";//是否为锁定状态文字
	var noLocking= "";//组合前禁止锁定
	var head     = "";//确定显示那个头部
	var con1     = "";//决定是否添加工具栏1
	var con2     = "";//决定是否添加工具栏2
	if(Lid == 0)//未锁定
	{
		if($(navPage+"> .canvas").length > 0)
		{
			var $bookId = cla;
			var left     = $bookId.prop('offsetLeft');
			var top      = $bookId.prop('offsetTop');
			var widht    = $bookId.prop('offsetWidth');
			var height   = $bookId.prop("offsetHeight");
			var shuIndex = [];
			$(navPage+"> .canvas").each(function()
			{
				var $book = $(this);
				var bookX_pos = $book.prop('offsetWidth') + $book.prop('offsetLeft');
				var bookY_pos = $book.prop('offsetHeight') + $book.prop('offsetTop');
				var Contain1  = bookX_pos > left;
				var Contain2  = bookY_pos > top;
				var Contain3  = $book.prop('offsetLeft') < (left + widht);
				var Contain4  = $book.prop('offsetTop') < (top + height);
				if(Contain1 && Contain2 && Contain3 && Contain4)
				{
					var _Zindex = Number($book.css("z-index"));
					shuIndex.push(_Zindex);
				}
			})
		}
		var rid  = $(cla).attr("rid");//获取特殊rid值
		var maxzIndex = (Math.max.apply(null, shuIndex));//提取最大值
		var minzIndex = (Math.min.apply(null, shuIndex));//提取最小值
		var Zindex = Number(cla.css("z-index"));//层级
		var bottom_index = "";//最底层
		var top_index = "";//最顶层
			Locking = "锁定";
		//rid =  3; 组合前
		//rid =  4; 组合后
		//层级
		if(Zindex == zIndexT || Zindex == maxzIndex) top_index = "zi_index";
		if(Zindex == zIndexB || Zindex == minzIndex) bottom_index = "zi_index";
		//显示不同素材右键
		switch(rid)
		{
			case "3":
				noLocking = "zi_index"; 
				head =
				'<div class="mouseR-listIco">'+
					'<a href="javascript:;" class="iconfont mouseR-listA" alt="左对齐" title="左对齐" id="LeftAlignment">'+
						'&#xe707;'+
					'</a>'+
					'<a href="javascript:;" class="iconfont mouseR-listA" alt="水平居中对齐" title="水平居中对齐" id="levelAlignment">'+
						'&#xe70b;'+
					'</a>'+
					'<a href="javascript:;" class="iconfont mouseR-listA" alt="右对齐" title="右对齐" id="RightAlignment">'+
						'&#xe709;'+
					'</a>'+
					'<a href="javascript:;" class="iconfont mouseR-listA" alt="水平等间距" title="水平等间距" id="HorizontalEquidistance">'+
						'&#xe624;'+
					'</a>'+
				'</div>'+
				'<div class="mouseR-listIco">'+
					'<a href="javascript:;" class="iconfont mouseR-listA" alt="上对齐" title="上对齐" id="topAlignment">'+
						'&#xe70c;'+
					'</a>'+
					'<a href="javascript:;" class="iconfont mouseR-listA" alt="垂直居中对齐" title="垂直居中对齐" id="verticalAlignment">'+
						'&#xe70a;'+
					'</a>'+
					'<a href="javascript:;" class="iconfont mouseR-listA" alt="下对齐" title="下对齐" id="bottomAlignment">'+
						'&#xe708;'+
					'</a>'+
					'<a href="javascript:;" class="iconfont mouseR-listA" alt="垂直等间距" title="垂直等间距" id="VerticalEquidistance">'+
						'&#xe621;'+
					'</a>'+
				'</div>'+
				'<div class="mouseR-listIco mouseR-listB">'+
					'<a href="javascript:;" class="iconfont mouseR-listA" alt="等宽" title="等宽" id="EqualWidth">'+
						'&#xe6ac;'+
					'</a>'+
					'<a href="javascript:;" class="iconfont mouseR-listA" alt="等高" title="等高" id="EqualHeight">'+
						'&#xe6aa;'+
					'</a>'+
					'<a href="javascript:;" class="iconfont mouseR-listA" alt="同角度" title="同角度" id="EqualAngle">'+
						'&#xe614;'+
					'</a>'+
					'<a href="javascript:;" class="iconfont mouseR-listA" alt="同宽高" title="同宽高" id="EqualWH">'+
						'&#xe616;'+
					'</a>'+
				'</div>'+
				'<div class="mouseR-list" id="mouse-com">'+
					'组合<span>ctrl+G</span>'+
				'</div>'+
				'<div class="mouseR-list mouseR-listB zi_index" id="mouse-comNo">'+
					'取消组合<span>ctrl+shift+G</span>'+
				'</div>';
				break;
			case "4":
				head = 
				'<div class="mouseR-list zi_index" id="mouse-com">'+
					'组合<span>ctrl+G</span>'+
				'</div>'+
				'<div class="mouseR-list mouseR-listB" id="mouse-comNo">'+
					'取消组合<span>ctrl+shift+G</span>'+
				'</div>';
				break;
		}
		con1    = 
				'<div class="mouseR-list" id="mouse_shear">'+
					'剪切<span>ctrl+X</span>'+
				'</div>'+
				'<div class="mouseR-list mouseR-listB" id="mouse_copy">'+
					'复制<span>ctrl+C</span>'+
				'</div>'+
				'<div class="mouseR-list '+ top_index +'" id="mouse_Move">'+
					'上移一层<span>ctrl+[</span>'+
				'</div>'+
				'<div class="mouseR-list '+ bottom_index +'" id="mouse_Down">'+
					'下移一层<span>ctrl+]</span>'+
				'</div>'+
				'<div class="mouseR-list '+ top_index +'" id="mouseTop">'+
					'置于顶层<span>ctrl+shift+[</span>'+
				'</div>'+
				'<div class="mouseR-list mouseR-listB '+ bottom_index +'" id="mouseBottom">'+
					'置于底层<span>ctrl+shift+]</span>'+
				'</div>';
		con2    = 
				'<div class="mouseR-list" id="mouse-Delete">'+
					'删除<span>Delete</span>'+
				'</div>';
	}else
	{
		Locking   = "解锁";
		con1      = "";
		con2      = "";
		head      = "";
		noLocking = "";
	}
	var mouse=
		'<div class="mouseR" id="mouseR" style="'+ poseX + poseY +'">'+
			head + con1+
			'<div class="mouseR-list mouseR-listB '+ noLocking +'" id="mouseLocking">'+
				Locking+'<span>ctrl+shift+L</span>'+
			'</div>'+
			con2 +
		'</div>';
	return $("body").append(mouse);
}
/** 粘贴模板 **/
function clickPaste_tme(_x,_y)
{
	var _x   = "left:"+_x + "px;";
	var _y   = "top:"+ _y +"px;";
	var clickPaste =
			'<div class="clickPaste" style="'+ _x + _y +'" id="clickPaste">'+
				'粘贴<span>Ctrl+V</span>'+
			'</div>'
	return $("body").append(clickPaste);	
};
/********** 动态添加模态框 *************/
//初始化模态框个数
var num_Modal = $(".newModal").length;
if(num_Modal > 0)
{
	var arr_Modal = [];
	$(".newModal").each(function(index)
	{
		var z = Number($(this).attr("mid"));
		if(!isNaN(z))
		{
			arr_Modal.push(z);
		}
		if((index+1) == $(".newModal").length)
		{
			num_Modal = Math.max.apply(null, arr_Modal);
		}
	});
}
//添加方法
function add_Modal(cl)
{
	num_Modal = num_Modal + 1;
	$(cl).find(".canvas-con").attr("mid","newModal"+num_Modal);
	var Modal = 
		'<div class="newModal newModal'+num_Modal+'" mid="'+ num_Modal +'">'+
			'<div class="newModalNone">'+
			'</div>'+
			'<div class="newModalCon" id="newModal'+num_Modal+'">'+
				'<a href="javascript:;" class="newModaldel iconfont">'+
					'&#xecec;'+
				'</a>'+
			'</div>'+
		'</div>';
	return $("#pc-center").append(Modal);
}
//添加方法2（模态框）
function add_Modal2(cl)
{
    num_Modal = num_Modal + 1;
    $(cl).find(".canvas-con").attr("mid","newModal"+num_Modal);
    var Modal =
        '<div class="newModal newModal'+num_Modal+'" mid="'+ num_Modal +'">'+
        '<div class="newModalNone2">'+
        '</div>'+
        '<div class="newModalCon2" id="newModal'+num_Modal+'">'+
        '<a href="javascript:;" class="newModaldel iconfont">'+
        '&#xecec;'+
        '</a>'+
        '</div>'+
        '</div>';
    return $("#pc-center").append(Modal);
}
//添加方法3（模态框）
function add_Modal3(cl)
{
    num_Modal = num_Modal + 1;
	var pzHtml = '<div class="canvas ui-draggable ui-draggable-handle" rid="0" lid="0" wh="1640,1852,127,150" style="width: 100%; height: 23px; top: 11px; text-align:center; left: 0; z-index: 2; opacity: 1;"> \n' +
        '     <div class="canvas-con"> \n' +
        '      <div class="canvasText">\n' +
        '       <p><span style="font-size: 18px;"><strong>请选择设备</strong></span></p>\n' +
        '      </div> \n' +
        '      <div class="canvasTextNone" style="display: block;"> \n' +
        '      </div> \n' +
        '     </div> \n' +
        '    </div>\n' +
        '    <div class="canvas ui-draggable ui-draggable-handle" rid="0" lid="0" wh="1657,1843,229,251" style="width: 100%; height: 22px; top: 113px; left: 0; text-align:center; z-index: 3; opacity: 1;"> \n' +
        '     <div class="canvas-con"> \n' +
        '      <div class="canvasText">\n' +
        '       <p style=""><span style="font-size: 14px;"><strong>请选择传感器</strong></span></p>\n' +
        '      </div> \n' +
        '      <div class="canvasTextNone" style="display: block;"> \n' +
        '      </div> \n' +
        '     </div> \n' +
        '    </div>\n' +
        '    <div class="canvas ui-draggable ui-draggable-handle" rid="102" lid="0" wh="1707,1784,174,206" style="width: 77px; height: 36px; top: 56px; left: 126px; z-index: 4; opacity: 1;"> \n' +
        '     <div class="canvas-con realTime myChartID" curve="1" id="my1curve" deviceid=""> \n' +
        '      <div class="deviceOnLine"> \n' +
        '       <img src="/static/cloudConfiguration/images/zutai_new/echarts/onLine.png" class="mCS_img_loaded" /> \n' +
        '      </div> \n' +
        '      <div class="deviceOffLine"> \n' +
        '       <img src="/static/cloudConfiguration/images/zutai_new/echarts/offLine.png" class="mCS_img_loaded" /> \n' +
        '      </div> \n' +
        '     </div> \n' +
        '    </div>\n' +
        '    <div class="canvas ui-draggable ui-draggable-handle" rid="13" lid="0" wh="1702,1797,279,320" style="width: 95px; height: 42px; top: 160px; left: 118px; z-index: 5; opacity: 1;"> \n' +
        '     <div class="canvas-con realTime myChartID" curve="'+ num_Modal +'" id="my2curve" deviceid="" sensorid="" sensorname=""> \n' +
        '      <div class="switchON"> \n' +
        '       <img src="/static/cloudConfiguration/images/zutai_new/echarts/on3.png" class="mCS_img_loaded" /> \n' +
        '      </div> \n' +
        '      <div class="switchOFF"> \n' +
        '       <img src="/static/cloudConfiguration/images/zutai_new/echarts/off3.png" class="mCS_img_loaded" /> \n' +
        '      </div> \n' +
        '     </div> \n' +
        '    </div>'



    $(cl).find(".canvas-con").attr("mid","newModal"+num_Modal);
    var Modal =
        '<div class="newModal newModal'+num_Modal+'" mid="'+ num_Modal +'">'+
        '<div class="newModalNone3">'+
        '</div>'+
        '<div class="newModalCon3" style="background-color: rgba(255, 255, 255, 0.68);"  id="newModal'+num_Modal+'">'+
        '<a href="javascript:;" class="newModaldel iconfont">'+
        '&#xecec;'+
        '</a>'+  pzHtml +
        '</div>'+
        '</div>';
    return $("#pc-center").append(Modal);
}
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
				top:'-40'
			},100);
		},3000);
	});
}
/*********************导航栏方法*************************/
/******导航栏颜色方法*******/
function navColor(id,Fid,cls,color)
{
	$(id).spectrum(
	{
		color:color,//初始化颜色
		allowEmpty:true,//允许为空,显示清除颜色按钮
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
			$(Fid).css(cls,hexColor);
		},
		move:function(color)
		{
			var hexColor = "transparent";
	　　　　if(color)
			{
	　　　　　　hexColor = color.toRgbString();
	　　　　}
			$(Fid).css(cls,hexColor);
		}
	});
}
/*************导航条切换颜色**************/
$("#switch_full").spectrum(
{
	allowEmpty:true,//允许为空,显示清除颜色按钮
	color:"#4c84ff",//初始化颜色
	showInput:true,//显示输入
	containerClassName:"panelColor",//引用类选择器,可以改变颜色选择器面板的样式
	replacerClassName:"inputColor",//引用类选择器,可以改变颜色选择器的样式
	showInitial:true,//显示初始颜色,提供现在选择的颜色和初始颜色对比
	showPalette:true,//显示选择器面板
	showSelectionPalette: true,//记住选择过的颜色
	clickoutFiresChange: false,//单击选择器外部,如果颜色有改变则应用
	showAlpha:true,//显示透明度选择
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
　　　　　　hexColor = color.toRgbString();
　　　　}
		var style = "<style type='text/css' id='switch_style'>.editNavB{background:"+hexColor+";}</style>"
		$("#switch_style").remove();
		$("#pc-center").append(style);
	},
	move:function(color)
	{
		var hexColor = "transparent";
　　　　if(color)
		{
　　　　　　hexColor = color.toRgbString();
　　　　}
		var style = "<style type='text/css' id='switch_style'>.editNavB{background:"+hexColor+";}</style>"
		$("#switch_style").remove();
		$("#pc-center").append(style);
	}
});
/**  重置画布导航栏 **/
function ResetNav(){
	$("#pc_Float").val("top");//重置画布导航栏位置
	$("#pc_position").val("absolute");//重置导航栏浮动
	$("#numName").attr("disabled",true);//不允许编辑导航名称
	$("#pc_animation").val(0);//重置画布动画切换效果
	$("#beijing_full").spectrum("set","#ffffff");//导航栏背景
	$("#font_full").spectrum("set","#000000");//导航栏文字颜色
	$("#switch_full").spectrum("set","#4c84ff");//导航切换颜色
	$("#switch_style").remove();//导航切换颜色
	$("#numName").val("");//重置修改导航条名称
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
/******** 是否显示辅助线 *********/
function auxiliary(cls)
{
	if($(cls).hasClass("auxiliaryB"))
	{
		$(cls).removeClass("auxiliaryB");
		$(".Guide").hide();
		$("#pc-center").attr("auxiliary",1);
	}else
	{
		$(cls).addClass("auxiliaryB");
		$(".Guide").show();
		$("#pc-center").attr("auxiliary",2);
	}
}
/***** 时间 *****/
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
    setTimeout(function(){
    	if($(".canvasId").attr("rid")=="108"){
            $(".canvasId > .canvas-con").html('返回文本值');
		}else if($(".canvasId").attr("rid")=="109"){
            $(".canvasId > .canvas-con").val('返回文本值');
		}



    },500);


}
/******************************************素材切换后操作面板更替*************************/
function newFunction(id)
{
	var A = $("."+id);
	var B = "functionShow";
	if(!A.hasClass(B))
	{
		$("."+B).removeClass(B);
		A.addClass(B);
	}
}
/*********************不同素材切换后操作面板更替*************************/
var new_Edit = -1;//初始化调用素材面板
function newEdit(id,Lid)
{
	var Nid = Number(id);//强制转换数字类型   Edit31最高
	if(Lid != 1)//未锁定
	{
		if(Nid != new_Edit)//只调用一次
		{
			new_Edit = Nid;
			$(".EditShow").removeClass("EditShow");
			switch(Nid)
			{
				case 0://高级文本
					$("#Edit01 ,#Edit02 ,#Edit03 ,#Edit04 ,#Edit05 ,#Edit06, #Edit07, #Edit09, #Edit12, #Edit14").addClass("EditShow");
					break;
				case 1://图片
					$("#Edit01 ,#Edit02 ,#Edit03 ,#Edit04 ,#Edit05 ,#Edit06 ,#Edit07 ,#Edit09, #Edit14").addClass("EditShow");
					break;
				case 2://SVG
					$("#Edit01 ,#Edit02 ,#Edit03 ,#Edit04 ,#Edit05 ,#Edit06 ,#Edit07 ,#Edit09, #Edit14, #Edit17").addClass("EditShow");
					break;
				case 3://组合前
					$("#Edit07, #Edit11").addClass("EditShow");
					break;
				case 4://组合后
					$("#Edit01, #Edit02, #Edit03, #Edit04, #Edit07, #Edit09, #Edit11").addClass("EditShow");
					break;
				case 5://时间
					$("#Edit01, #Edit02, #Edit03, #Edit04, #Edit05 ,#Edit06 ,#Edit07, #Edit09, #Edit13, #Edit14").addClass("EditShow");
					break;
                case 104://ymdG
                    $("#Edit01, #Edit02, #Edit03, #Edit04, #Edit05 ,#Edit06 ,#Edit07, #Edit09, #Edit13, #Edit14").addClass("EditShow");
                    break;
                case 105://ymdP
                    $("#Edit01, #Edit02, #Edit03, #Edit04, #Edit05 ,#Edit06 ,#Edit07, #Edit09, #Edit13, #Edit14").addClass("EditShow");
                    break;
                case 106://hms
                    $("#Edit01, #Edit02, #Edit03, #Edit04, #Edit05 ,#Edit06 ,#Edit07, #Edit09, #Edit13, #Edit14").addClass("EditShow");
                    break;
                case 107://week
                    $("#Edit01, #Edit02, #Edit03, #Edit04, #Edit05 ,#Edit06 ,#Edit07, #Edit09, #Edit13, #Edit14").addClass("EditShow");
                    break;
                case 108://返回值文本
                    $("#Edit01, #Edit02, #Edit03, #Edit04, #Edit05 ,#Edit06 ,#Edit07, #Edit09, #Edit13, #Edit14,#Edit36").addClass("EditShow");
                    break;
                case 109://返回值输入框
                    $("#Edit01, #Edit02, #Edit03, #Edit04, #Edit05 ,#Edit06 ,#Edit07, #Edit09, #Edit13, #Edit14,#Edit36").addClass("EditShow");
                    break;
				case 6://天气
					$("#Edit01, #Edit02, #Edit03, #Edit04, #Edit05 ,#Edit06 ,#Edit07, #Edit09, #Edit14").addClass("EditShow");
					break;
				case 7://模态框
					$("#Edit01, #Edit02, #Edit03, #Edit04, #Edit05 ,#Edit06 ,#Edit07, #Edit09, #Edit13, #Edit14, #Edit15").addClass("EditShow");
					break;
                case 101://模态框2
                    $("#Edit01, #Edit02, #Edit03, #Edit04, #Edit05 ,#Edit06 ,#Edit07, #Edit09, #Edit13, #Edit14, #Edit15").addClass("EditShow");
                    break;
                case 103://模态框3
                    $("#Edit01, #Edit02, #Edit03, #Edit04, #Edit05 ,#Edit06 ,#Edit07, #Edit09, #Edit13, #Edit14, #Edit15, #Edit16, #Edit21, #Edit28").addClass("EditShow");
                    break;
				case 8://文本
					$("#Edit01, #Edit02, #Edit03, #Edit04, #Edit05 ,#Edit06 ,#Edit07, #Edit09, #Edit13, #Edit14, #Edit15").addClass("EditShow");
					break;
				case 9://SVG(不可改变颜色)
					$("#Edit01 ,#Edit02 ,#Edit03 ,#Edit04 ,#Edit05 ,#Edit06 ,#Edit07 ,#Edit09, #Edit14").addClass("EditShow");
					break;
				case 10://图表视频类型
					$("#Edit01 ,#Edit02 ,#Edit03 ,#Edit04 ,#Edit05 ,#Edit06 ,#Edit07 ,#Edit09, #Edit35").addClass("EditShow");
					break;
				case 11://图表数值类型
					$("#Edit01 ,#Edit02 ,#Edit03 ,#Edit04 ,#Edit05 ,#Edit06 ,#Edit07 ,#Edit09, #Edit13, #Edit16, #Edit18, #Edit21,#Edit33").addClass("EditShow");
					break;
				case 12://开关(单选)
					$("#Edit01 ,#Edit02 ,#Edit03 ,#Edit04 ,#Edit05 ,#Edit06 ,#Edit07 ,#Edit09, #Edit16, #Edit21, #Edit28").addClass("EditShow");
					break;
				case 13://开关(单选自定义)
					$("#Edit01 ,#Edit02 ,#Edit03 ,#Edit04 ,#Edit05 ,#Edit06 ,#Edit07 ,#Edit09, #Edit16, #Edit19, #Edit21, #Edit28, #Edit34").addClass("EditShow");
					break;
				case 14://曲线(多选)
					$("#Edit01 ,#Edit02 ,#Edit03 ,#Edit04 ,#Edit05 ,#Edit06 ,#Edit07 ,#Edit09, #Edit16, #Edit21 ,#Edit33").addClass("EditShow");
					break;
				case 15://曲线(单选)
					$("#Edit01 ,#Edit02 ,#Edit03 ,#Edit04 ,#Edit05 ,#Edit06 ,#Edit07 ,#Edit09, #Edit16, #Edit21 ,#Edit33").addClass("EditShow");
					break;
				case 16://区域(多选)
					$("#Edit01 ,#Edit02 ,#Edit03 ,#Edit04 ,#Edit05 ,#Edit06 ,#Edit07 ,#Edit09, #Edit16, #Edit21 ,#Edit33").addClass("EditShow");
					break;
				case 17://仪表(单选)
					$("#Edit01 ,#Edit02 ,#Edit03 ,#Edit04 ,#Edit05 ,#Edit06 ,#Edit07 ,#Edit09, #Edit16, #Edit21, #Edit23 ,#Edit33").addClass("EditShow");
					break;
				case 18://数据下发(多选)
					$("#Edit01 ,#Edit02 ,#Edit03 ,#Edit04 ,#Edit05 ,#Edit06 ,#Edit07 ,#Edit09, #Edit16, #Edit22").addClass("EditShow");
					break;
				case 19://定位(单选)
					$("#Edit01 ,#Edit02 ,#Edit03 ,#Edit04 ,#Edit05 ,#Edit06 ,#Edit07 ,#Edit09, #Edit24").addClass("EditShow");
					break;
				case 20://历史(多选)
					$("#Edit01 ,#Edit02 ,#Edit03 ,#Edit04 ,#Edit05 ,#Edit06 ,#Edit07 ,#Edit09, #Edit16, #Edit22").addClass("EditShow");
					break;
				case 21://曲线(多选自定义)
					$("#Edit01 ,#Edit02 ,#Edit03 ,#Edit04 ,#Edit05 ,#Edit06 ,#Edit07 ,#Edit09, #Edit16, #Edit20, #Edit21,#Edit33").addClass("EditShow");
					break;
				case 22://管道类型
					$("#Edit01 ,#Edit02 ,#Edit03 ,#Edit04 ,#Edit05 ,#Edit06 ,#Edit07 ,#Edit09, #Edit16, #Edit21, #Edit29").addClass("EditShow");
					break;
				case 23://弯道类型
					$("#Edit01 ,#Edit02 ,#Edit03 ,#Edit04 ,#Edit05 ,#Edit06 ,#Edit07 ,#Edit09, #Edit16, #Edit21, #Edit29").addClass("EditShow");
					break;
				case 24://蓄水池
					$("#Edit01 ,#Edit02 ,#Edit03 ,#Edit04 ,#Edit05 ,#Edit06 ,#Edit07 ,#Edit09, #Edit16, #Edit21, #Edit26").addClass("EditShow");
					break;
				case 25://固定数据下发
					$("#Edit01 ,#Edit02 ,#Edit03 ,#Edit04 ,#Edit05 ,#Edit06 ,#Edit07 ,#Edit09, #Edit16, #Edit22, #Edit27").addClass("EditShow");
					break;
				case 26://报警历史记录
					$("#Edit01 ,#Edit02 ,#Edit03 ,#Edit04 ,#Edit05 ,#Edit06 ,#Edit07 ,#Edit09, #Edit16, #Edit22").addClass("EditShow");
					break;
				case 27://蓄水池无边框
					$("#Edit01 ,#Edit02 ,#Edit03 ,#Edit04 ,#Edit05 ,#Edit06 ,#Edit07 ,#Edit09, #Edit16, #Edit21, #Edit30").addClass("EditShow");
					break;
				case 28://百分比控件
					$("#Edit01 ,#Edit02 ,#Edit03 ,#Edit04 ,#Edit05 ,#Edit06 ,#Edit07 ,#Edit09, #Edit16, #Edit21, #Edit31").addClass("EditShow");
					break;
				case 29://超链接
					$("#Edit01, #Edit02, #Edit03, #Edit04, #Edit05 ,#Edit06 ,#Edit07, #Edit09, #Edit13, #Edit14, #Edit15, #Edit25").addClass("EditShow");
					break;
				case 30://柱状图
					$("#Edit01 ,#Edit02 ,#Edit03 ,#Edit04 ,#Edit05 ,#Edit06 ,#Edit07 ,#Edit09, #Edit16, #Edit21,#Edit33").addClass("EditShow");
					break;
				case 31://饼图/环形图
					$("#Edit01 ,#Edit02 ,#Edit03 ,#Edit04 ,#Edit05 ,#Edit06 ,#Edit07 ,#Edit09, #Edit16, #Edit21,#Edit33").addClass("EditShow");
					break;
				case 32://页面刷新
					$("#Edit01, #Edit02, #Edit03, #Edit04, #Edit05 ,#Edit06 ,#Edit07, #Edit09, #Edit13, #Edit14, #Edit15, #Edit32").addClass("EditShow");
					break;
                case 102://页面刷新
                    $("#Edit01 ,#Edit02 ,#Edit03 ,#Edit04 ,#Edit05 ,#Edit06 ,#Edit07 ,#Edit09, #Edit16, #Edit21, #Edit28").addClass("EditShow");
                    break;
				default:
					tooltips("程序出错！请联系技术支持(同步编辑)","Warning");	
			}
		}
	}else//锁定情况下享有最高权限
	{
		if(!$("#Edit08").hasClass("EditShow"))
		{
			new_Edit = -1;
			$(".EditShow").removeClass("EditShow");
			$("#Edit08").addClass("EditShow");
		}
	}
}
/******************************************** 素材功能按钮同步 ****************************************************************/
function toolbar(current,id,Lid)
{
	var Tid = Number(id);//强制转换数字类型
	if(Lid != 1)//未锁定
	{
		var clas = current;
		switch(Tid)
		{
			case 0://高级文本
				TongBu_01(clas);//同步背景颜色
				TongBu_02(clas);//同步边框样式
				TongBu_03(clas);//同步圆角大小
				TongBu_04(clas);//同步透明度
				TongBu_05(clas);//同步大小
				TongBu_06(clas);//同步位置
				TongBu_07(clas);//同步旋转角度
				TongBu_08(clas);//同步动画
				break;
			case 1://图片
				TongBu_01(clas);//同步背景颜色
				TongBu_02(clas);//同步边框样式
				TongBu_03(clas);//同步圆角大小
				TongBu_04(clas);//同步透明度
				TongBu_05(clas);//同步大小
				TongBu_06(clas);//同步位置
				TongBu_07(clas);//同步旋转角度
				TongBu_08(clas);//同步动画
				break;
			case 2://SVG
				TongBu_01(clas);//同步背景颜色
				TongBu_02(clas);//同步边框样式
				TongBu_03(clas);//同步圆角大小
				TongBu_04(clas);//同步透明度
				TongBu_05(clas);//同步大小
				TongBu_06(clas);//同步位置
				TongBu_07(clas);//同步旋转角度
				TongBu_08(clas);//同步动画
				TongBu_10(clas);//同步svg图形颜色
				break;
			case 3://组合前
				break;
			case 4://组合后
				TongBu_01(clas);//同步背景颜色
				TongBu_02(clas);//同步边框样式
				TongBu_03(clas);//同步圆角大小
				TongBu_04(clas);//同步透明度
				TongBu_06(clas);//同步位置
				break;
			case 5://时间
				TongBu_01(clas);//同步背景颜色
				TongBu_02(clas);//同步边框样式
				TongBu_03(clas);//同步圆角大小
				TongBu_04(clas);//同步透明度
				TongBu_05(clas);//同步大小
				TongBu_06(clas);//同步位置
				TongBu_07(clas);//同步旋转角度
				TongBu_08(clas);//同步动画
				TongBu_16(clas);//同步基本文本同步
				break;
            case 104://ymdG
                TongBu_01(clas);//同步背景颜色
                TongBu_02(clas);//同步边框样式
                TongBu_03(clas);//同步圆角大小
                TongBu_04(clas);//同步透明度
                TongBu_05(clas);//同步大小
                TongBu_06(clas);//同步位置
                TongBu_07(clas);//同步旋转角度
                TongBu_08(clas);//同步动画
                TongBu_16(clas);//同步基本文本同步
                break;
            case 105://ymdP
                TongBu_01(clas);//同步背景颜色
                TongBu_02(clas);//同步边框样式
                TongBu_03(clas);//同步圆角大小
                TongBu_04(clas);//同步透明度
                TongBu_05(clas);//同步大小
                TongBu_06(clas);//同步位置
                TongBu_07(clas);//同步旋转角度
                TongBu_08(clas);//同步动画
                TongBu_16(clas);//同步基本文本同步
                break;
            case 106://hms
                TongBu_01(clas);//同步背景颜色
                TongBu_02(clas);//同步边框样式
                TongBu_03(clas);//同步圆角大小
                TongBu_04(clas);//同步透明度
                TongBu_05(clas);//同步大小
                TongBu_06(clas);//同步位置
                TongBu_07(clas);//同步旋转角度
                TongBu_08(clas);//同步动画
                TongBu_16(clas);//同步基本文本同步
                break;
            case 107://weekday
                TongBu_01(clas);//同步背景颜色
                TongBu_02(clas);//同步边框样式
                TongBu_03(clas);//同步圆角大小
                TongBu_04(clas);//同步透明度
                TongBu_05(clas);//同步大小
                TongBu_06(clas);//同步位置
                TongBu_07(clas);//同步旋转角度
                TongBu_08(clas);//同步动画
                TongBu_16(clas);//同步基本文本同步
                break;
            case 108://weekday
                TongBu_01(clas);//同步背景颜色
                TongBu_02(clas);//同步边框样式
                TongBu_03(clas);//同步圆角大小
                TongBu_04(clas);//同步透明度
                TongBu_05(clas);//同步大小
                TongBu_06(clas);//同步位置
                TongBu_07(clas);//同步旋转角度
                TongBu_08(clas);//同步动画
                TongBu_16(clas);//同步基本文本同步
                break;
            case 109://weekday
                TongBu_01(clas);//同步背景颜色
                TongBu_02(clas);//同步边框样式
                TongBu_03(clas);//同步圆角大小
                TongBu_04(clas);//同步透明度
                TongBu_05(clas);//同步大小
                TongBu_06(clas);//同步位置
                TongBu_07(clas);//同步旋转角度
                TongBu_08(clas);//同步动画
                TongBu_16(clas);//同步基本文本同步
                break;
			case 6://天气
				TongBu_01(clas);//同步背景颜色
				TongBu_02(clas);//同步边框样式
				TongBu_03(clas);//同步圆角大小
				TongBu_04(clas);//同步透明度
				TongBu_05(clas);//同步大小
				TongBu_06(clas);//同步位置
				TongBu_07(clas);//同步旋转角度
				TongBu_08(clas);//同步动画
				break;
			case 7://模态框
				TongBu_01(clas);//同步背景颜色
				TongBu_02(clas);//同步边框样式
				TongBu_03(clas);//同步圆角大小
				TongBu_04(clas);//同步透明度
				TongBu_05(clas);//同步大小
				TongBu_06(clas);//同步位置
				TongBu_07(clas);//同步旋转角度
				TongBu_08(clas);//同步动画
				TongBu_09(clas);//同步模态框文本
				TongBu_16(clas);//同步基本文本同步
				break;
            case 101://模态框2
                TongBu_01(clas);//同步背景颜色
                TongBu_02(clas);//同步边框样式
                TongBu_03(clas);//同步圆角大小
                TongBu_04(clas);//同步透明度
                TongBu_05(clas);//同步大小
                TongBu_06(clas);//同步位置
                TongBu_07(clas);//同步旋转角度
                TongBu_08(clas);//同步动画
                TongBu_09(clas);//同步模态框文本
                TongBu_16(clas);//同步基本文本同步
                break;
            case 103://模态框3
                TongBu_01(clas);//同步背景颜色
                TongBu_02(clas);//同步边框样式
                TongBu_03(clas);//同步圆角大小
                TongBu_04(clas);//同步透明度
                TongBu_05(clas);//同步大小
                TongBu_06(clas);//同步位置
                TongBu_07(clas);//同步旋转角度
                TongBu_25(clas);//同步模态框3
                TongBu_20(clas);//同步可操作开关是否允许操作
                break;
			case 8://文本
				TongBu_01(clas);//同步背景颜色
				TongBu_02(clas);//同步边框样式
				TongBu_03(clas);//同步圆角大小
				TongBu_04(clas);//同步透明度
				TongBu_05(clas);//同步大小
				TongBu_06(clas);//同步位置
				TongBu_07(clas);//同步旋转角度
				TongBu_08(clas);//同步动画
				TongBu_09(clas);//同步模态框文本
				TongBu_16(clas);//同步基本文本同步
				break;
			case 9://SVG(不可改变颜色)
				TongBu_01(clas);//同步背景颜色
				TongBu_02(clas);//同步边框样式
				TongBu_03(clas);//同步圆角大小
				TongBu_04(clas);//同步透明度
				TongBu_05(clas);//同步大小
				TongBu_06(clas);//同步位置
				TongBu_07(clas);//同步旋转角度
				TongBu_08(clas);//同步动画
				break;
			case 10://图表视频类型
				TongBu_01(clas);//同步背景颜色
				TongBu_02(clas);//同步边框样式
				TongBu_03(clas);//同步圆角大小
				TongBu_04(clas);//同步透明度
				TongBu_05(clas);//同步大小
				TongBu_06(clas);//同步位置
				TongBu_07(clas);//同步旋转角度
                TongBu_27(clas);//同步摄像头
				break;
			case 11://图表数值类型
				TongBu_01(clas);//同步背景颜色
				TongBu_02(clas);//同步边框样式
				TongBu_03(clas);//同步圆角大小
				TongBu_04(clas);//同步透明度
				TongBu_05(clas);//同步大小
				TongBu_06(clas);//同步位置
				TongBu_07(clas);//同步旋转角度
				TongBu_11(clas);//同步图表设备
				TongBu_12(clas);//同步图表类型数值在线状态
				TongBu_16(clas);//同步基本文本同步
				break;
			case 12://图表开关(单选)
				TongBu_01(clas);//同步背景颜色
				TongBu_02(clas);//同步边框样式
				TongBu_03(clas);//同步圆角大小
				TongBu_04(clas);//同步透明度
				TongBu_05(clas);//同步大小
				TongBu_06(clas);//同步位置
				TongBu_07(clas);//同步旋转角度
				TongBu_11(clas);//同步图表设备
				TongBu_20(clas);//同步可操作开关是否允许操作
				break;
			case 13://图表开关(单选自定义)
				TongBu_01(clas);//同步背景颜色
				TongBu_02(clas);//同步边框样式
				TongBu_03(clas);//同步圆角大小
				TongBu_04(clas);//同步透明度
				TongBu_05(clas);//同步大小
				TongBu_06(clas);//同步位置
				TongBu_07(clas);//同步旋转角度
				TongBu_11(clas);//同步图表设备
				TongBu_17(clas);//同步自定义开关
				TongBu_20(clas);//同步可操作开关是否允许操作
                TongBu_26(clas)//同步是否勾选显示隐藏页面内容
				break;
			case 14://曲线(多选)
				TongBu_01(clas);//同步背景颜色
				TongBu_02(clas);//同步边框样式
				TongBu_03(clas);//同步圆角大小
				TongBu_04(clas);//同步透明度
				TongBu_05(clas);//同步大小
				TongBu_06(clas);//同步位置
				TongBu_07(clas);//同步旋转角度
				TongBu_11(clas);//同步图表设备
				break;
			case 15://曲线(单选)
				TongBu_01(clas);//同步背景颜色
				TongBu_02(clas);//同步边框样式
				TongBu_03(clas);//同步圆角大小
				TongBu_04(clas);//同步透明度
				TongBu_05(clas);//同步大小
				TongBu_06(clas);//同步位置
				TongBu_07(clas);//同步旋转角度
				TongBu_11(clas);//同步图表设备
				break;
			case 16://区域(多选)
				TongBu_01(clas);//同步背景颜色
				TongBu_02(clas);//同步边框样式
				TongBu_03(clas);//同步圆角大小
				TongBu_04(clas);//同步透明度
				TongBu_05(clas);//同步大小
				TongBu_06(clas);//同步位置
				TongBu_07(clas);//同步旋转角度
				TongBu_11(clas);//同步图表设备
				break;
			case 17://仪表(单选)
				TongBu_01(clas);//同步背景颜色
				TongBu_02(clas);//同步边框样式
				TongBu_03(clas);//同步圆角大小
				TongBu_04(clas);//同步透明度
				TongBu_05(clas);//同步大小
				TongBu_06(clas);//同步位置
				TongBu_07(clas);//同步旋转角度
				TongBu_11(clas);//同步图表设备
				TongBu_14(clas);//同步仪表盘设置
				break;
			case 18://数据下发(多选)
				TongBu_01(clas);//同步背景颜色
				TongBu_02(clas);//同步边框样式
				TongBu_03(clas);//同步圆角大小
				TongBu_04(clas);//同步透明度
				TongBu_05(clas);//同步大小
				TongBu_06(clas);//同步位置
				TongBu_07(clas);//同步旋转角度
				TongBu_11(clas);//同步图表设备
				break;
			case 19://定位(多选)
				TongBu_01(clas);//同步背景颜色
				TongBu_02(clas);//同步边框样式
				TongBu_03(clas);//同步圆角大小
				TongBu_04(clas);//同步透明度
				TongBu_05(clas);//同步大小
				TongBu_06(clas);//同步位置
				TongBu_07(clas);//同步旋转角度
				TongBu_15(clas);//同步设备定位
				break;
			case 20://历史(多选)
				TongBu_01(clas);//同步背景颜色
				TongBu_02(clas);//同步边框样式
				TongBu_03(clas);//同步圆角大小
				TongBu_04(clas);//同步透明度
				TongBu_05(clas);//同步大小
				TongBu_06(clas);//同步位置
				TongBu_07(clas);//同步旋转角度
				TongBu_11(clas);//同步图表设备
				break;
			case 21://曲线(多选自定义)
				TongBu_01(clas);//同步背景颜色
				TongBu_02(clas);//同步边框样式
				TongBu_03(clas);//同步圆角大小
				TongBu_04(clas);//同步透明度
				TongBu_05(clas);//同步大小
				TongBu_06(clas);//同步位置
				TongBu_07(clas);//同步旋转角度
				TongBu_11(clas);//同步图表设备
				TongBu_13(clas);//同步分辨带设置
				break;
			case 22://管道类型
				TongBu_01(clas);//同步背景颜色
				TongBu_02(clas);//同步边框样式
				TongBu_03(clas);//同步圆角大小
				TongBu_04(clas);//同步透明度
				TongBu_05(clas);//同步大小
				TongBu_06(clas);//同步位置
				TongBu_07(clas);//同步旋转角度
				TongBu_11(clas);//同步图表设备
				TongBu_22(clas);//开关关闭后是否隐藏管道
				break;
			case 23://弯道类型
				TongBu_01(clas);//同步背景颜色
				TongBu_02(clas);//同步边框样式
				TongBu_03(clas);//同步圆角大小
				TongBu_04(clas);//同步透明度
				TongBu_05(clas);//同步大小
				TongBu_06(clas);//同步位置
				TongBu_07(clas);//同步旋转角度
				TongBu_11(clas);//同步图表设备
				TongBu_22(clas);//开关关闭后是否隐藏管道
				break;
			case 24://蓄水池
				TongBu_01(clas);//同步背景颜色
				TongBu_02(clas);//同步边框样式
				TongBu_03(clas);//同步圆角大小
				TongBu_04(clas);//同步透明度
				TongBu_05(clas);//同步大小
				TongBu_06(clas);//同步位置
				TongBu_07(clas);//同步旋转角度
				TongBu_11(clas);//同步图表设备
				TongBu_19(clas);//同步蓄水池
				break;
			case 25://固定数据下发
				TongBu_01(clas);//同步背景颜色
				TongBu_02(clas);//同步边框样式
				TongBu_03(clas);//同步圆角大小
				TongBu_04(clas);//同步透明度
				TongBu_05(clas);//同步大小
				TongBu_06(clas);//同步位置
				TongBu_07(clas);//同步旋转角度
				TongBu_11(clas);//同步图表设备
				TongBu_21(clas);//同步固定数据下发
				break;
			case 26://报警历史记录
				TongBu_01(clas);//同步背景颜色
				TongBu_02(clas);//同步边框样式
				TongBu_03(clas);//同步圆角大小
				TongBu_04(clas);//同步透明度
				TongBu_05(clas);//同步大小
				TongBu_06(clas);//同步位置
				TongBu_07(clas);//同步旋转角度
				TongBu_11(clas);//同步图表设备
				break;
			case 27://蓄水池无边框
				TongBu_01(clas);//同步背景颜色
				TongBu_02(clas);//同步边框样式
				TongBu_03(clas);//同步圆角大小
				TongBu_04(clas);//同步透明度
				TongBu_05(clas);//同步大小
				TongBu_06(clas);//同步位置
				TongBu_07(clas);//同步旋转角度
				TongBu_11(clas);//同步图表设备
				TongBu_23(clas);//同步蓄水池无边框
				break;
			case 28://百分比控件
				TongBu_01(clas);//同步背景颜色
				TongBu_02(clas);//同步边框样式
				TongBu_03(clas);//同步圆角大小
				TongBu_04(clas);//同步透明度
				TongBu_05(clas);//同步大小
				TongBu_06(clas);//同步位置
				TongBu_07(clas);//同步旋转角度
				TongBu_11(clas);//同步图表设备
				TongBu_24(clas);//同步百分比
				break;
			case 29://超链接
				TongBu_01(clas);//同步背景颜色
				TongBu_02(clas);//同步边框样式
				TongBu_03(clas);//同步圆角大小
				TongBu_04(clas);//同步透明度
				TongBu_05(clas);//同步大小
				TongBu_06(clas);//同步位置
				TongBu_07(clas);//同步旋转角度
				TongBu_08(clas);//同步动画
				TongBu_09(clas);//同步模态框文本
				TongBu_16(clas);//同步基本文本同步
				TongBu_18(clas);//超链接同步
				break;
			case 30://柱状图
				TongBu_01(clas);//同步背景颜色
				TongBu_02(clas);//同步边框样式
				TongBu_03(clas);//同步圆角大小
				TongBu_04(clas);//同步透明度
				TongBu_05(clas);//同步大小
				TongBu_06(clas);//同步位置
				TongBu_07(clas);//同步旋转角度
				TongBu_11(clas);//同步图表设备
				break;
			case 31://饼图/环形图
				TongBu_01(clas);//同步背景颜色
				TongBu_02(clas);//同步边框样式
				TongBu_03(clas);//同步圆角大小
				TongBu_04(clas);//同步透明度
				TongBu_05(clas);//同步大小
				TongBu_06(clas);//同步位置
				TongBu_07(clas);//同步旋转角度
				TongBu_11(clas);//同步图表设备
				break;
			case 32://刷新
				TongBu_01(clas);//同步背景颜色
				TongBu_02(clas);//同步边框样式
				TongBu_03(clas);//同步圆角大小
				TongBu_04(clas);//同步透明度
				TongBu_05(clas);//同步大小
				TongBu_06(clas);//同步位置
				TongBu_07(clas);//同步旋转角度
				TongBu_08(clas);//同步动画
				TongBu_09(clas);//同步模态框文本
				TongBu_16(clas);//同步基本文本同步
				break;
            case 102://设备状态
                TongBu_01(clas);//同步背景颜色
                TongBu_02(clas);//同步边框样式
                TongBu_03(clas);//同步圆角大小
                TongBu_04(clas);//同步透明度
                TongBu_05(clas);//同步大小
                TongBu_06(clas);//同步位置
                TongBu_07(clas);//同步旋转角度
                TongBu_11(clas);//同步图表设备
                TongBu_20(clas);//同步可操作开关是否允许操作
                break;

			default:
				tooltips("程序出错！请联系技术支持(同步方法)","Warning");	
		}
	}
}
function TongBu_01(clas)
{
	var current = clas.children(".canvas-con");
	//同步背景颜色
	var canvas_bac = current.css("backgroundColor");
	$("#canvas-bac").spectrum("set", canvas_bac);




	//图表颜色
    var currentTb = clas.children(".canvas-con");
    //同步背景颜色
    var canvas_col = currentTb.css("backgroundColor");
    $("#canvas-col").spectrum("set", canvas_col);

}
function TongBu_02(clas)
{
	var current = clas.children(".canvas-con");
	//同步边框大小
	var canvas_bor = current.css("border-left-width").replace(/[a-z]/g,"");
	$("#canvas_slider").slider("value",canvas_bor);
	$("#canvas_size").val(canvas_bor);
	//同步边框样式
	var canvas_sel = current.css("border-left-style");
	$("#canvas_select").val(canvas_sel);
	//同步边框颜色
	var canvas_col = current.css("border-left-color");
	$("#canvas_full").spectrum("set", canvas_col);
}
function TongBu_03(clas)
{
	var current = clas.children(".canvas-con");
	//同步圆角大小
	var canvas_rad = current.css("border-top-left-radius").replace(/[a-z\%]/g,"");
	$("#canvas_radius_size").val(canvas_rad);
	$("#canvas_radius").slider("value",canvas_rad);
}
function TongBu_04(clas)
{
	var current = clas.children(".canvas-con");
	//同步透明度
	var canvas_opa = current.css("opacity").replace(/[a-z\%]/g,"");
	$("#canvas_opacity_size").val(canvas_opa*10);
	$("#canvas_opacity").slider("value",canvas_opa*10);
}
function TongBu_05(current)
{
	//同步大小
	var w = current.width();
	var h = current.height();
	$("#canvas_w").val(parseInt(w));
	$("#canvas_h").val(parseInt(h));
}
function TongBu_06(current)
{
	//同步位置
	var l = current.position().left;
	var t = current.position().top;
	$("#canvas_left").val(parseInt(l));
	$("#canvas_top").val(parseInt(t));
}
function TongBu_07(current)
{
	//同步旋转角度
	var v = current.css("transform");
	if(v !== "none")
	{
		var R = v.split('(')[1].split(')')[0].split(',');
		var a = R[0];
		var b = R[1];
		var c = R[2];
		var d = R[3];
		var scale = Math.sqrt(a * a + b * b);
		var sin = b / scale;
		var angle = Math.round(Math.atan2(b, a) * (180 / Math.PI));
		var e = angle>=0?angle:360+angle;
		$("#canvas_Rotation").val(e);
		$("#canvas_Rotation_Slide").slider("value",e);
	}else
	{
		$("#canvas_Rotation").val(0);
		$("#canvas_Rotation_Slide").slider("value",0);
	}
}
function TongBu_08(clas)
{//动画同步
	var current = clas.children(".canvas-con");
	//同步透明度
	var anima = current.attr("anima");
	if(anima == undefined)
	{
		$("#SetAnimate").val("0");
		$(".editAnimateShow").removeClass("editAnimateShow");
		$("#editAnimate0").addClass("editAnimateShow");
		$(".editAnimateImgB").removeClass("editAnimateImgB");
		$("#inSpeedAnimate").val(1000);
		$("#speedAnimate").slider("value",1000);
		$("#loopdAnimate").slider("value",0);
		$("#inloopdAnimate").val("否");
	}else
	{
		var arrAnima = anima.split(",");
			Animatearray = arrAnima;
			
		if(arrAnima[0] == 0)
		{
			$("#SetAnimate").val("0");
			$(".editAnimateShow").removeClass("editAnimateShow");
			$("#editAnimate0").addClass("editAnimateShow");
			$(".editAnimateImgB").removeClass("editAnimateImgB");
			$("#inSpeedAnimate").val(1000);
			$("#speedAnimate").slider("value",1000);
			$("#loopdAnimate").slider("value",0);
			$("#inloopdAnimate").val("否");
		}else if(arrAnima[0] == 1)
		{
			$("#SetAnimate").val("1");
			$(".editAnimateShow").removeClass("editAnimateShow");
			$("#editAnimate1").addClass("editAnimateShow");
			$("#editAnimate3").addClass("editAnimateShow");
			$(".editAnimateImgB").removeClass("editAnimateImgB");
			if(arrAnima[1] != 0)
			{
				$("#"+arrAnima[1]).addClass("editAnimateImgB");
			}
			if(arrAnima[2] != 0)
			{
				$("#inSpeedAnimate").val(arrAnima[2]);
				$("#speedAnimate").slider("value",arrAnima[2]);
			}
			if(arrAnima[3] == 0)
			{
				$("#loopdAnimate").slider("value",0);
				$("#inloopdAnimate").val("否");
			}			
		}else if(arrAnima[0] == 2)
		{
			$("#SetAnimate").val("2");
			$(".editAnimateShow").removeClass("editAnimateShow");
			$("#editAnimate1").addClass("editAnimateShow");
			$("#editAnimate3").addClass("editAnimateShow");
			$("#editAnimate4").addClass("editAnimateShow");
			$(".editAnimateImgB").removeClass("editAnimateImgB");
			if(arrAnima[1] != 0)
			{
				$("#"+arrAnima[1]).addClass("editAnimateImgB");
			}
			if(arrAnima[2] != 0)
			{
				$("#inSpeedAnimate").val(arrAnima[2]);
				$("#speedAnimate").slider("value",arrAnima[2]);
			}
			if(arrAnima[3] != 0)
			{
				$("#loopdAnimate").slider("value",1);
				$("#inloopdAnimate").val("是");
			}else
			{
				$("#loopdAnimate").slider("value",0);
				$("#inloopdAnimate").val("否");
			}
		}
	}
}
function TongBu_09(current)
{
	//同步模态框文本
	var rid = current.attr("rid");
	var txt = "";
	if(rid == 29){
		txt = current.children(".canvas-con").children("a").html().replace(/<br>/ig, "\n").replace(/&nbsp;/g, "\s");
	}else{
		txt = current.children(".canvas-con").html().replace(/<br>/ig, "\n").replace(/&nbsp;/g, "\s");
	}
	$("#nameModal").val(txt);
}
function TongBu_10(current)
{
	//同步svg图形颜色
	var color = "#ffffff";
	current.children(".canvas-con").find("*").each(function()
	{
		var c = $(this).attr("fill");
		if(c != "none" && c != undefined)
		{
			color = c;
			return false
		}
	})
	$("#canvas-svg").spectrum("set", color);
}
var selrid;//获得图表类型
var warningArr = [0,0,0];//警告设置
function TongBu_11(current)//同步图表设备
{
	/********************获取设备**********************/
	selrid = Number($(".canvasId").attr("rid"));//获取元素图表类型;
	var deviceid = $(".canvasId > .canvas-con").attr("deviceid") || -1;//获取设备ID
	if(deviceid != -1)//如果选择了设备
	{
		$("#deviceId").val(deviceid).trigger('change');//设置设备默认选中
		var rid = Number($(".canvasId").attr("rid"));//获取元素图表类型
		/************* 开关是否允许操作同步 *************/
		
		$("#divSwitch").hide();
		
		/*****************************  传感器操作  *******************************/
		$("#sensorId").empty();//清空传感器option
		if ($("#sensorId").hasClass("select2-hidden-accessible"))
		{
			$("#sensorId").select2('destroy');//销毁
		}
		var sensorId = $(".canvasId > .canvas-con").attr("sensorId") || -1;//获取默认传感器ID
		var arrDate;
		if(sensorId != -1)//如果选择了传感器
		{
			arrDate = [sensorId].toString().split(',');//格式化传感器默认选中数组
			/*****  触发器操作 *****/
			var triggerid = $(".canvasId > .canvas-con").attr("triggerid") || -1;//获取设备ID
			var ggeDate;
			if(triggerid != -1)//如果选择了触发器
			{
				ggeDate = [triggerid].toString().split(',');//格式化触发器默认选中
				$("#triggerId").empty();//清空触发器option
				$("#triggerId").trigger('change');//通知更新
				/************* 报警设置 ***************/
				var warningarr = $(".canvasId > .canvas-con").attr("warningarr") || -1;//获取报警设置
				if(warningarr != -1)
				{
					var bjData = [warningarr].toString().split(',');
					warningArr = bjData;
					$("#warningTXT").val(bjData[0]);//文本
					$("#warningState").val(bjData[1]);//状态
					$("#warningVoice").val(bjData[2]);//声音
				}else
				{
					/** 报警设置操作 **/
					warningArr = [0,0,0]
					$("#warningTXT").val(0);//文本
					$("#warningState").val(0);//状态
					$("#warningVoice").val(0);//声音
				}
			}else
			{
				ggeDate = null;
				$("#triggerId").empty();//清空触发器option
				$("#triggerId").trigger('change');//通知更新
				/** 报警设置操作 **/
				warningArr = [0,0,0]
				$("#warningTXT").val(0);//文本
				$("#warningState").val(0);//状态
				$("#warningVoice").val(0);//声音
			}
			//读取默认传感下的触发器
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
					if(data.state=="success")
					{
						var len = data.datas.length;//获取总个数
						for(var i = 0;i <len; i++)
						{
							$("#triggerId").append("<option cid="+data.datas[i].sensorId+" value="+data.datas[i].id+">"+data.datas[i].name+"</option>");
							if(i+1 == len)
							{
								$("#triggerId").val(ggeDate).trigger('change');
								$("#triggerId").trigger('change');//通知更新
							}
						}
					}
				},
				error:function()
				{
					tooltips("请求数据出错,请联系技术支持!","Warning");
				}
			});
		}else
		{
			arrDate = null;//如果没有设置为空
			/******** 触发器操作 **********/
			$("#triggerId").empty();//清空触发器option
			$("#triggerId").trigger('change');//通知更新
			/** 报警设置操作 **/
			warningArr = [0,0,0]
			$("#warningTXT").val(0);//文本
			$("#warningState").val(0);//状态
			$("#warningVoice").val(0);//声音
		}
		//读取默认设备下的传感器
		$.ajax(
		{
            type:'GET',
            url:basePath+'/sensor/selTypeList',		//根据设备ID查传感器
            dataType: 'json',
            data:{
                deviceNumber:deviceid
            },
			success: function(data)
			{
				if(data.state=="success")
				{
					var len = data.datas.length;//获取总个数
					/************* 传感器下拉框同步 *************/
					switch(rid)
					{
						case 10://视频类型(单选)
							for(var i = 0;i < len; i++)
							{
								var disabled = "";
								if(data.datas[i].sensorType == 7) disabled = "";//视频类型
								$("#sensorId").append("<option value="+data.datas[i].id+"  "+disabled+">"+data.datas[i].sensorName+"</option>");
								if((i+1) == len)
								{
									$("#sensorId").select2(
									{
										placeholder:"请选择传感器",
										multiple:false,
										closeOnSelect:true,
									});
									$("#sensorId").val(arrDate).trigger('change');
								}
							}
						break;
						case 11://数值类型(单选)
							for(var i = 0;i < len; i++)
							{
								var disabled = "";
								if(data.datas[i].sensorType == 6 || data.datas[i].sensorType == 1 || data.datas[i].sensorType == 2 || data.datas[i].sensorType == 3 || data.datas[i].sensorType == 5 || data.datas[i].sensorType == 8) disabled = "";
								$("#sensorId").append("<option value="+data.datas[i].id+"  "+disabled+">"+data.datas[i].sensorName+"</option>");
								if((i+1) == len)
								{
									$("#sensorId").select2(
									{
										placeholder:"请选择传感器",
										multiple:false,
										closeOnSelect:true,
									});
									$("#sensorId").val(arrDate).trigger('change');
								}
							}
						break;
						case 12://开关(单选)
							for(var i = 0;i < len; i++)
							{
								var disabled = "";
								if(data.datas[i].sensorType == 5 || data.datas[i].sensorType == 2) disabled = "";
								$("#sensorId").append("<option value="+data.datas[i].sensorCode+" "+disabled+">"+data.datas[i].sensorName+"</option>");
								if((i+1) == len)
								{
									$("#sensorId").select2(
									{
										placeholder:"请选择传感器",
										multiple:false,
										closeOnSelect:true,
									});
									$("#sensorId").val(arrDate).trigger('change');
								}
							}
						break;
						case 13://开关(单选自定义)
							for(var i = 0;i < len; i++)
							{
								var disabled = "";
                                if(data.datas[i].sensorType == 5 || data.datas[i].sensorType == 2) disabled = "";
                                $("#sensorId").append("<option value="+data.datas[i].sensorCode+" "+disabled+">"+data.datas[i].sensorName+"</option>");
								if((i+1) == len)
								{
									$("#sensorId").select2(
									{
										placeholder:"请选择传感器",
										multiple:false,
										closeOnSelect:true,
									});
									$("#sensorId").val(arrDate).trigger('change');
								}
							}
						break;
						case 14://曲线(多选)
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
									$("#sensorId").val(arrDate).trigger('change');
								}
							}
						break;
						case 15://曲线(单选)
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
									$("#sensorId").val(arrDate).trigger('change');
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
									$("#sensorId").val(arrDate).trigger('change');
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
									$("#sensorId").val(arrDate).trigger('change');
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
									$("#sensorId").val(arrDate).trigger('change');
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
									$("#sensorId").val(arrDate).trigger('change');
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
									$("#sensorId").val(arrDate).trigger('change');
								}
							}
						break;
						case 22://管道类型
							for(var i = 0;i < len; i++)
							{
								var disabled = "";
								if(data.datas[i].sensorType == 5 || data.datas[i].sensorType == 2) disabled = "";
								$("#sensorId").append("<option value="+data.datas[i].sensorCode+"  "+disabled+">"+data.datas[i].sensorName+"</option>");
								if((i+1) == len)
								{
									$("#sensorId").select2(
									{
										placeholder:"请选择传感器",
										multiple:false,
										closeOnSelect:true,
									});
									$("#sensorId").val(arrDate).trigger('change');
								}
							}
						break;
						case 23://弯道类型
							for(var i = 0;i < len; i++)
							{
								var disabled = "";
								if(data.datas[i].sensorType == 5 || data.datas[i].sensorType == 2) disabled = "";
								$("#sensorId").append("<option value="+data.datas[i].sensorCode+"  "+disabled+">"+data.datas[i].sensorName+"</option>");
								if((i+1) == len)
								{
									$("#sensorId").select2(
									{
										placeholder:"请选择传感器",
										multiple:false,
										closeOnSelect:true,
									});
									$("#sensorId").val(arrDate).trigger('change');
								}
							}
						break;
						case 24://蓄水池
							for(var i = 0;i < len; i++)
							{
								var disabled = "";
								if(data.datas[i].sensorType == 1) disabled = "";
								$("#sensorId").append("<option value="+data.datas[i].sensorCode+"  "+disabled+">"+data.datas[i].sensorName+"</option>");
								if((i+1) == len)
								{
									$("#sensorId").select2(
									{
										placeholder:"请选择传感器",
										multiple:false,
										closeOnSelect:true,
									});
									$("#sensorId").val(arrDate).trigger('change');
								}
							}
						break;
						case 25://固定数据下发
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
									$("#sensorId").val(arrDate).trigger('change');
								}
							}
						break;
						case 26://报警历史记录
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
									$("#sensorId").val(arrDate).trigger('change');
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
									$("#sensorId").val(arrDate).trigger('change');
								}
							}
						break;
						case 28://百分比控件(单选)
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
									$("#sensorId").val(arrDate).trigger('change');
								}
							}
						break;
						case 30://柱状图(多选)
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
									$("#sensorId").val(arrDate).trigger('change');
								}
							}
						break;
						case 31://饼图(多选)
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
									$("#sensorId").val(arrDate).trigger('change');
								}
							}
						break;

                        case 102://设备状态
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
                                    $("#sensorId").val(arrDate).trigger('change');
                                }
                            }
                            break;
						default:
							tooltips("程序出错！请联系技术支持(同步图表)","Warning");
					}
				}else
				{
					tooltips("当前设备下没有传感器！","Warning");
				}
			},
			error:function()
			{
				tooltips("请求数据出错,请联系技术支持(同步设备)！","Warning");
			},
		});
	}else
	{
		/** 设备操作 **/
		$("#deviceId").val(deviceid).trigger('change');
		/**  传感器操作 **/
		$("#sensorId").empty();//清空传感器
		$("#sensorId").trigger('change');//通知更新
		/***  触发器操作 ***/
		$("#triggerId").empty();//清空触发器option
		$("#triggerId").trigger('change');//通知更新
		/** 报警设置操作 **/
		warningArr = [0,0,0]
		$("#warningTXT").val(0);//文本
		$("#warningState").val(0);//状态
		$("#warningVoice").val(0);//声音
		/************* 开关是否允许操作同步 *************/
		$("#divSwitch").hide();
	}
}
function TongBu_12(current)//同步图表类型数值在线状态
{
	//在线状态同步
	var colorON    = $(".canvasId > .canvas-con").children(".numState").css("background-color");
	$("#numStateON").spectrum("set", colorON);
	var colorOFF   = $(".canvasId > .canvas-con").children(".numState").attr("colorOFF");
	var numStateYN = $(".canvasId > .canvas-con").children(".numState").css("display");
	if(numStateYN == "block")
	{
		$("#numStateYN").val(0);
	}else
	{
		$("#numStateYN").val(1);
	}
	if(colorOFF != undefined)
	{
		$("#numStateOff").spectrum("set", colorOFF);
	}else{
		$("#numStateOff").spectrum("set", "transparent");	
	}
	//是否显示时间同步
	var time =  $(".canvasId > .canvas-con").attr("time") || 0;
	$("#addTime").val(time);
	//是否允许数据下发同步
	var numdown  = $(".canvasId > .canvas-con").attr("numdown");
	if(numdown)
	{
		if(numdown == 0)
		{
			$("#numDownAdd").val(numdown);
			var color = $(".canvasId > .canvas-con").children(".numDown").css("color");
			$("#numDownColor").spectrum("set",color);
		}else if(numdown == 1)
		{
			$("#numDownAdd").val(numdown);
			$("#numDownColor").spectrum("set","transparent");
		}
	}else
	{
		$("#numDownAdd").val(0);
		var color = $(".canvasId > .canvas-con").children(".numDown").css("color");
		$("#numDownColor").spectrum("set",color);
	}
	
}
var pxColor = [];//分辨带数组
function TongBu_13(current)//同步分辨带设置
{
	$("#pxAlready").empty();//同步时清空
	pxColor = [];//清空数组
	var pxArr = $(".canvasId > .canvas-con").attr("pxColor");
	if(pxArr != undefined && pxArr != "")
	{
		var arrNum = [pxArr].toString().split(',');
		var arrPx =formatArray(arrNum,3);
		pxColor = arrPx;
		for(var a=0;a<arrPx.length;a++)
		{
			if(a == 0)
			{
				var pxTEM = '<div class="pxAlready">'+
								'<div class="pxAlreadyTxT">'+
									'≤ '+arrPx[a][1]+
								'</div>'+
								'<div class="pxAlreadycor" style="background-color:'+arrPx[a][2]+'">'+
								'</div>'+
								'<a href="javascript:;" class="iconfont pxDel" num="'+arrPx[a][1]+'">'+
									'&#xecec;'+
								'</a>'+
							'</div>';
				$("#pxAlready").append(pxTEM);
				pxColorMin = arrPx[a][1];
			}else if((a+1) == arrPx.length)
			{
				if(arrPx[a][0] == "a")
				{
					var pxTEM = '<div class="pxAlready">'+
									'<div class="pxAlreadyTxT">'+
										'＞ '+arrPx[a][1]+
									'</div>'+
									'<div class="pxAlreadycor" style="background-color:'+arrPx[a][2]+'">'+
									'</div>'+
									'<a href="javascript:;" class="iconfont pxDel" num="'+arrPx[a][1]+'">'+
										'&#xecec;'+
									'</a>'+
								'</div>';
					$("#pxAlready").append(pxTEM);
					pxColorMax = arrPx[a][1];
				}else
				{
					var pxTEM = '<div class="pxAlready">'+
									'<div class="pxAlreadyTxT">'+
										arrPx[a][0]+'-'+arrPx[a][1]+
									'</div>'+
									'<div class="pxAlreadycor" style="background-color:'+arrPx[a][2]+'">'+
									'</div>'+
									'<a href="javascript:;" class="iconfont pxDel" num="'+arrPx[a][1]+'">'+
										'&#xecec;'+
									'</a>'+
								'</div>';
					$("#pxAlready").append(pxTEM);
					pxColorMax = "a";
				}
				$("#pxNum").attr("num",Number(arrPx[a][1]));//初始化值
			}else
			{
				var pxTEM = '<div class="pxAlready">'+
								'<div class="pxAlreadyTxT">'+
									arrPx[a][0]+'-'+arrPx[a][1]+
								'</div>'+
								'<div class="pxAlreadycor" style="background-color:'+arrPx[a][2]+'">'+
								'</div>'+
								'<a href="javascript:;" class="iconfont pxDel" num="'+arrPx[a][1]+'">'+
									'&#xecec;'+
								'</a>'+
							'</div>';
				$("#pxAlready").append(pxTEM);
			}
		}

	}else{
		$("#pxNum").attr("num",0);//初始化值
		pxColorMin = "a";
		pxColorMax = "a";
		$("#pxNum").val("");
	}
}
//实时同步分辨带显示效果
function realpxColor(id)
{
	var myChart = echarts.init(document.getElementById(id));
	var Cpieces   = [];
	var CmarkLine = [];
	for(var i=0;i<pxColor.length;i++)
	{
		if(i == 0)//开始
		{
			Cpieces.push({lte:Number(pxColor[i][1]),color:pxColor[i][2]});
			CmarkLine.push({yAxis:Number(pxColor[i][1])});
		}else if((i+1) == pxColor.length)//结尾
		{
			if(pxColor[i][0] == "a")
			{
				Cpieces.push({gt:Number(pxColor[i][1]),color:pxColor[i][2]});
			}else
			{
				Cpieces.push({gt:Number(pxColor[i][0]),lte:Number(pxColor[i][1]),color:pxColor[i][2]});
				CmarkLine.push({yAxis:Number(pxColor[i][1])});
			}
			myChart.setOption(
			{
				visualMap:{pieces:Cpieces},
				series:[{markLine:{data:CmarkLine}}]
			})
		}else//中间
		{
			Cpieces.push({gt:Number(pxColor[i][0]),lte:Number(pxColor[i][1]),color:pxColor[i][2]});
			CmarkLine.push({yAxis:Number(pxColor[i][1])});
		}
	}
}
/********************************************************/
var arrMeter = [];//定义仪表盘设置数组
function TongBu_14(current)//仪表盘同步设置
{
	var tbMeter = $(".canvasId > .canvas-con").attr("arrMeter");
	if(tbMeter != undefined)
	{
		var MeterArr = [tbMeter].toString().split(',');
		arrMeter = MeterArr;//同步数组
		if(MeterArr[0] != undefined)
		{
			$("#Meter-min").val(MeterArr[0]);
		}else
		{
			$("#Meter-min").val("");
		}
		if(MeterArr[1] != undefined)
		{
			$("#Meter-max").val(MeterArr[1]);
		}else
		{
			$("#Meter-max").val("");
		}
		if(MeterArr[2] != undefined)
		{
			$("#Meter-type").val(MeterArr[2]);
		}else
		{
			$("#Meter-type").val("");
		}
		if(MeterArr[3] != undefined)
		{
			$("#Meter-name").val(MeterArr[3]);
		}else
		{
			$("#Meter-name").val("");
		}
		if(MeterArr[4] != undefined)
		{
			$("#Meter-Number").val(MeterArr[4]);
		}else
		{
			$("#Meter-Number").val("");
		}
		if(MeterArr[5] != undefined)
		{
			$("#Meter-split").val(MeterArr[5]);
		}else
		{
			$("#Meter-split").val("");
		}
		if(MeterArr[6] != undefined)
		{
			$("#Meter-text").val(MeterArr[6]);
		}else
		{
			$("#Meter-text").val("");
		}
		if(MeterArr[7] != undefined)
		{
			$("#Meter-txt").val(MeterArr[7]);
		}else
		{
			$("#Meter-text").val("");
		}
	}else{
		arrMeter = [];//同步数组
		$("#Meter-min").val("");
		$("#Meter-max").val("");
		$("#Meter-type").val("");
		$("#Meter-name").val("");
		$("#Meter-Number").val("");
		$("#Meter-split").val("");
		$("#Meter-text").val("");
	}
}
function TongBu_15(current)//同步设备定位
{
	var deviceid = $(".canvasId > .canvas-con").attr("deviceid") || -1;//获取设备ID
	if(deviceid != -1)
	{
		var arrDate = [deviceid].toString().split(',');//格式化传感器默认选中数组
		$("#mapDeviceId").val(arrDate).trigger('change');
	}else
	{
		$("#mapDeviceId").val(null).trigger('change');
	}
}
function TongBu_16(current)//基本文本同步
{
	var size   =  $(".canvasId").css("font-size");
	var family =  $(".canvasId").css("font-family");
	var line   =  $(".canvasId").css("line-height");
	var align  =  $(".canvasId").css("text-align");
	$("#basicSize").val(size);
	if(family.length > 10)
	{
		$("#basicFamily").val(-1);
	}else
	{
		$("#basicFamily").val(family);
	}
	$("#basicHeight").val(-1);
	if(align == "start")
	{
		$("#basicCenter").val(-1);
	}else
	{
		$("#basicCenter").val(align);
	}




    /********************获取文本返回值类型**********************/
    selrid = Number($(".canvasId").attr("rid"));
    var backText = $(".canvasId > .canvas-con").attr("backdata") || -1;//获取文本返回值类型
    if(backText != -1){  //如果选择了文本返回值类型
        $("#backData").val(backText).trigger('change');//设置文本返回值类型
        var rid = Number($(".canvasId").attr("rid"));//获取文本返回值类型
    }else{
        $("#backData").val('-1').trigger('change');//设置文本返回值类型
        var rid = Number($(".canvasId").attr("rid"));//获取文本返回值类型
	}










}
function TongBu_17(current)//同步自定义开关
{
	var urlON  = current.find(".switchON img").attr("src");
	var urlOFF = current.find(".switchOFF img").attr("src");
	$("#img-updivON img").attr("src",urlON);
	$("#img-updivOFF img").attr("src",urlOFF);
	var switc = current.find(".canvas-con").attr("switch");
	if(switc != undefined)
	{
		$("#selectSwitc").val(switc);
	}else
	{
		$("#selectSwitc").val(1);
	}
}
function TongBu_18(clas)//同步链接
{
	var link = $(".canvasId > .canvas-con").attr("link") || -1;
	if(link != -1){
		var arrLink = [link].toString().split(',');
		if(arrLink[0] == 0){
			$("#customHyperlink").val("");
			$("#ChoiceHyperlink").val(arrLink[1]);
			if(arrLink[2] === "p1")
			{
				$("#yunNewPassword").show();
				var pwd = $(".canvasId > .canvas-con > a").attr("p");
				if(pwd){
					$("#passwordlink").val("******");
				}
			}else
			{
				$("#yunNewPassword").hide();
				$("#passwordlink").val("");
			}
		}else if(arrLink[0] == 1)
		{
			$("#ChoiceHyperlink").val("-1");
			$("#customHyperlink").val(arrLink[1]);
			$("#yunNewPassword").hide();
			$("#passwordlink").val("");
		}else
		{
			$("#ChoiceHyperlink").val("-1");
			$("#customHyperlink").val("");
			$("#yunNewPassword").hide();
			$("#passwordlink").val("");
		}
	}else{
		$("#ChoiceHyperlink").val("-1");
		$("#customHyperlink").val("");
		$("#yunNewPassword").hide();
		$("#passwordlink").val("");
	}
}
var Reservoir = [];//同步蓄水池数组
function TongBu_19(current)//同步蓄水池
{
	var tbReservoir = $(".canvasId > .canvas-con").attr("reservoir");
	if(tbReservoir)
	{
		var ReservoirArr = [tbReservoir].toString().split(',');
		Reservoir = ReservoirArr;//同步数组
		if(Reservoir[0])
		{
			$("#Reservoir-max").val(Reservoir[0]);
		}else
		{
			$("#Reservoir-max").val("");
		}
		if(Reservoir[1])
		{
			$("#Reservoir-size").val(Reservoir[1]);
		}else
		{
			$("#Reservoir-size").val("");
		}
		if(Reservoir[2])
		{
			$("#Reservoir-unit").val(Reservoir[2]);
		}else
		{
			$("#Reservoir-unit").val("");
		}
	}else{
		Reservoir = [];//同步数组
		$("#Reservoir-max").val("");
		$("#Reservoir-size").val("");
		$("#Reservoir-unit").val("");
	}
}
//同步可操作开关是否允许操作
function TongBu_20(current)
{
	
	var newswitch    = $(".canvasId > .canvas-con").attr("newswitch");
	var sensoridtype = $(".canvasId > .canvas-con").attr("sensoridtype");
	if(sensoridtype == 2)
	{
		$("#newSwitch").removeAttr("disabled");
		if(newswitch)
		{
			$("#newSwitch").val(newswitch);
		}else
		{
			$("#newSwitch").val(0);
		}
	}else
	{
		$("#newSwitch").val(0);
		$("#newSwitch").attr("disabled","disabled");
	}
}
//同步固定数据下发
function TongBu_21(current)
{
	var downdata = $(".canvasId > .canvas-con").attr("downdata");
	if(downdata)
	{
		$("#downDataText").val(downdata);
	}else
	{
		$("#downDataText").val("");
	}
}
//同步开关关闭后是否隐藏管道
function TongBu_22(current)
{
	var tubeHide = $(".canvasId > .canvas-con").attr("tubeHide");
	if(tubeHide)
	{
		$("#tubeHide").val(tubeHide);
	}else
	{
		$("#tubeHide").val(0);
	}
}
//同步蓄水池无边框
var publicReservoir = ["","","","",""];
function TongBu_23(current)
{
	var newPublicreservoir = $(".canvasId > .canvas-con").attr("publicreservoir");
	if(newPublicreservoir)
	{
		var arrData = [newPublicreservoir].toString().split(',');
		publicReservoir = arrData;
		if(arrData[0])
		{
			$("#publicReservoirMax").val(arrData[0]);
		}else
		{
			$("#publicReservoirMax").val("");
		}
		if(arrData[1])
		{
			$("#publicReservoirSize").val(arrData[1]);
		}else
		{
			$("#publicReservoirSize").val("");
		}
		if(arrData[2])
		{
			$("#publicReservoirRange").val(arrData[2]);
		}else
		{
			$("#publicReservoirRange").val("");
		}
		if(arrData[3])
		{
			$("#publicReservoirColor").spectrum("set",arrData[3]);
		}else
		{
			$("#publicReservoirColor").spectrum("set","#4c84ff");
		}
		if(arrData[4])
		{
			$("#publicReservoirYN").val(arrData[4]);
		}else
		{
			$("#publicReservoirYN").val("0");
		}
	}else
	{
		publicReservoir = ["","","","",""];
		$("#publicReservoirMax").val("");
		$("#publicReservoirSize").val("");
		$("#publicReservoirRange").val("");
		$("#numDownColor").spectrum("set","#4c84ff");
		$("#publicReservoirYN").val("0");
	}
}
//同步百分比控件
var Progressbar = ["","","","","",""];
function TongBu_24(current)
{
	var toProgressbar = $(".canvasId > .canvas-con").attr("Progressbar");
	if(toProgressbar)
	{
		var arrData = [toProgressbar].toString().split(',');
		Progressbar = arrData;
		if(arrData[0])//最大值
		{
			$("#grayBar").val(arrData[0]);
		}else
		{
			$("#grayBar").val("");
		}
		if(arrData[1])//背景颜色
		{
			$("#ProgressbarBac").spectrum("set",arrData[1]);
		}else
		{
			$("#ProgressbarBac").spectrum("set","rgba(102, 102, 102,0.5)");
		}
		if(arrData[2])//填充颜色
		{
			$("#tianchong").spectrum("set",arrData[2]);
		}else
		{
			$("#tianchong").spectrum("set","#3dc0e9");
		}
		if(arrData[3])//圆角
		{
			$("#Radious").val(arrData[3]);
		}else
		{
			$("#Radious").val("");
		}
		if(arrData[4])//文字颜色
		{
			$("#ProgressbarColor").spectrum("set",arrData[4]);
		}else
		{
			$("#ProgressbarColor").spectrum("set","#fff");
		}
		if(arrData[5])//文字大小
		{
			$("#ProgressbarSize").val(arrData[5]);
		}else
		{
			$("#ProgressbarSize").val("");
		}
	}else
	{
		var Progressbar = ["","","","","",""];
		$("#grayBar").val("");//最大值
		$("#ProgressbarBac").spectrum("set","rgba(102, 102, 102,0.5)");//背景颜色
		$("#tianchong").spectrum("set","#3dc0e9");//填充颜色
		$("#Radious").val("");//圆角
		$("#ProgressbarColor").spectrum("set","#fff");//文字颜色
		$("#ProgressbarSize").val("");//文字大小
	}
}

function TongBu_25(current)//同步模态框3面板中设备，继电器
{
    selrid = Number($(".canvasId").attr("rid"));//获取元素图表类型;
    var deviceid = $(".canvasId > .canvas-con").attr("deviceid") || -1;//获取设备ID
    if(deviceid != -1)//如果选择了设备
    {
        $("#deviceId").val(deviceid).trigger('change');//设置设备默认选中
    }
    //通过设备获取继电器列表，加载继电器select
    $.ajax(
        {
            type:'GET',
            url:basePath+'/sensor/selTypeList',		//根据设备ID查传感器
            dataType: 'json',
            data:{
                deviceNumber:deviceid
            },
            success: function(data)
            {
                if(data.state=="success" && data.datas.length>0)
                {
                    $("#sensorId").empty();//清空传感器option
                    var len = data.datas.length;//获取总个数
                            for(var i = 0;i < len; i++){
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

                                    var sensorid = $(".canvasId > .canvas-con").attr("sensorid") || -1;//获取设备ID
                                    if(sensorid != -1)//如果选择了继电器
                                    {
                                        $("#sensorId").val(sensorid).trigger('change');//设置设备默认选中
                                    }else{
                                        $("#sensorId").val(null).trigger('change');
									}

                                }
                            }
                    }
                }

        });













}


function TongBu_26(clas)
{
    var current = clas.children(".canvas-con");
    //同步按揉是否勾选，显示隐藏页面内容
	var isshow = current.attr("isShow");
    //同步按钮勾选select
	if(isshow== "yesShow"){
        $("#showMany").val('yesShow');
	}else{
        $("#showMany").val('noShow');
	}



}





function TongBu_27(current)//同步摄像头
{
    /********************获取设备**********************/
    selrid = Number($(".canvasId").attr("rid"));//获取元素图表类型;
    var camerasId = $(".canvasId > .canvas-con").attr("camerasid") || -1;//获取设备ID

        /** 设备操作 **/
        $("#camerasId").val(camerasId).trigger('change');

}





















//一维数组转二维数组公用方法
function formatArray(arr,num)
{
	var newArray = new Array(Math.ceil(arr.length/num));
	for(var i=0; i<newArray.length; i++)
	{
		newArray[i] = [];
		for(var j=0; j<num; j++)
		{
			newArray[i][j] = {};
		}
	}
	for(var i=0;i<arr.length;i++)
	{
		newArray[parseInt(i/num)][i%num] = arr[i];
	}
	return newArray;
}
//调用在线直播视频
function new_video(myPlayer)
{
	new EZUIPlayer(myPlayer);
}
/***************************************************************************图表示例*********************************************************************/
//复合折线图示例
function curve_01(id,type)
{
	// 基于准备好的dom，初始化echarts实例
	var myChart = echarts.init(document.getElementById(id));
	if(type == 0){
		// 指定图表的配置项和数据
		var option = 
		{
		    title:{
		        text: '复合折线图示例',
		        textStyle:{
		        	fontSize:'14',
		        },
		    },
		    tooltip: {
		        trigger: 'axis'
		    },
		    legend: {
		        data:['传感器1','传感器2','传感器3'],
		        right:'5%',
		    },
		    grid: {
		        left: '3%',
		        right: '4%',
		        bottom: '3%',
		        containLabel: true
		    },
		    toolbox: {
		        feature: {
		            saveAsImage: {}
		        }
		    },
		    xAxis: {
		        type: 'category',
		        boundaryGap: false,
		        data: ['08-01','08-02','08-03','08-04','08-05','08-06','08-07']
		    },
		    yAxis: {
		        type:'value',
		        min:'dataMin',
		        max:'dataMax'
		    },
		    series: [
		        {
		            name:'传感器1',
		            type:'line',
		            data:[10, 132, 40, 180, 440, 20, 10]
		        },
		        {
		            name:'传感器2',
		            type:'line',
		            data:[220, 182, 191, 234, 290, 330, 310]
		        },
		        {
		            name:'传感器3',
		            type:'line',
		            data:[150, 232, 201, 154, 190, 330, 410]
		        }
		    ]
		};
		// 使用刚指定的配置项和数据显示图表。
		myChart.setOption(option);
	}else{
		myChart.resize();
	}
}
//时间轴折线图示例
function curve_02(id,type)
{
	// 基于准备好的dom，初始化echarts实例
	var myChart = echarts.init(document.getElementById(id));
	if(type == 0){
		// 指定图表的配置项和数据
		var option = 
		{
			 title:{
			        text: '时间轴折线图示例',
			        textStyle:{
			        	fontSize:'14',
			        },
			    },
			    tooltip: {
			        trigger: 'axis'
			    }, 
			    grid: {
			        left: '3%',
			        right: '4%',
			        bottom: '3%',
			        containLabel: true
			    },
			    toolbox: {
			        feature: {
			            saveAsImage: {}
			        }
			    },
			    xAxis: {
			        type: 'category',
			        boundaryGap: false,
			        data: ['08-01','08-02','08-03','08-04','08-05','08-06','08-07']
			    },
			    yAxis: {
			        type: 'value',
			        min:'dataMin',
			        max:'dataMax'
			    },
			    series: [{
			        data: [12, 320, 901, 504, 1290, 690, 1320],
			        type: 'line',
			        areaStyle: {}
			    }]
			};
		// 使用刚指定的配置项和数据显示图表。
		myChart.setOption(option);
	}else{
		myChart.resize();
	}
}
//分辨带曲线图示例
function curve_03(id,type)
{
	// 基于准备好的dom，初始化echarts实例
	var myChart = echarts.init(document.getElementById(id));
	if(type == 0)
	{
		var pxcolorArr = $("#"+id).parent(".canvas-con").attr("pxcolor");
		var Cpieces   = [{lte:-100,color:'#4c84ff'},{gt:-100,lte:0,color:'#3c763d'},{gt:0,lte:50,color:'#096'},{gt:50,lte:100,color:'#ffde33'},{gt:100,lte:150,color:'#ff9933'},{gt:150,lte:200,color:'#cc0033'},{gt:200,lte:300,color:'#660099'},{gt:300,color:'#7e0023'}];
		var CmarkLine = [{yAxis:-100},{yAxis:0},{yAxis:50},{yAxis:100},{yAxis:150},{yAxis: 200},{yAxis: 300}];
		if(pxcolorArr != undefined && pxcolorArr != "")
		{
			Cpieces    = [];
			CmarkLine  = [];
			var ArrNum = [pxcolorArr].toString().split(',');
			var ArrPx  =formatArray(ArrNum,3);
			for(var i=0;i<ArrPx.length;i++)
			{
				if(i == 0)//开始
				{
					Cpieces.push({lte:Number(ArrPx[i][1]),color:ArrPx[i][2]});
					CmarkLine.push({yAxis:Number(ArrPx[i][1])});
				}else if((i+1) == ArrPx.length)//结尾
				{
					if(ArrPx[i][0] == "a")
					{
						Cpieces.push({gt:Number(ArrPx[i][1]),color:ArrPx[i][2]});
					}else
					{
						Cpieces.push({gt:Number(ArrPx[i][0]),lte:Number(ArrPx[i][1]),color:ArrPx[i][2]});
						CmarkLine.push({yAxis:Number(ArrPx[i][1])});
					}
				}else//中间
				{
					Cpieces.push({gt:Number(ArrPx[i][0]),lte:Number(ArrPx[i][1]),color:ArrPx[i][2]});
					CmarkLine.push({yAxis:Number(ArrPx[i][1])});
				}
			}
		}
		//指定图表的配置项和数据
		var option = 
		{
			title:
			{
				text:'分辨带曲线图示例',
				textStyle:
				{
					fontSize:'14',
				},
			},
			tooltip:
			{
				trigger:'axis'
			}, 
			grid:
			{
				left:'3%',
				right:'120px',
				bottom:'50px',
				containLabel: true
			},
			toolbox:
			{
				left:'center',
				feature:
				{
					dataZoom:
					{
						yAxisIndex: 'none'
					},
					restore:{},
					saveAsImage:{}
				}
			},
			visualMap:
			{
				top:0,
				right:0,
				pieces:Cpieces,
				outOfRange:
				{
					color:'#999'
				}
			},
			xAxis:
			{
				type:'category',
				boundaryGap:false,
				data: ['08-01','08-02','08-03','08-04','08-05','08-06','08-07']
			},
			yAxis:
			{
				splitLine:
				{
					show:false
				},
				min:'dataMin',
				max:'dataMax'
			},
			dataZoom:
			[
				{
					startValue:'08-01'
				},
				{
					type:'inside'
				}
			],
			series:
			[
				{
					name:'传感器1',
					type:'line',
					smooth: true,
					data:[60, 260, -160, 180, 320, -240, 70],
					markLine:
					{
						silent:true,
						data:CmarkLine
					}
				}
			]
		};
		// 使用刚指定的配置项和数据显示图表。
		myChart.setOption(option);
	}else
	{
		myChart.resize();
	}
}
//可选时间段曲线图示例
function curve_04(id,type)
{
	// 基于准备好的dom，初始化echarts实例
	var myChart = echarts.init(document.getElementById(id));
	if(type == 0){
		// 指定图表的配置项和数据
		var option = 
		{
		    title:{
		        text: '可选时间段曲线图示例',
		        textStyle:{
		        	fontSize:'14',
		        },
		    },
		    tooltip: {
		        trigger: 'axis'
		    },
		    legend: {
		        data:['传感器1','传感器2'],
		        right:'5%',
		    },
		    grid: {
		        left: '3%',
		        right: '4%',
		        bottom: '50px',
		        containLabel: true
		    },
		    toolbox: {
		        feature: {
		            saveAsImage: {}
		        }
		    },
		    xAxis: {
		        type: 'category',
		        boundaryGap: false,
		        data: ['08-01','08-02','08-03','08-04','08-05','08-06','08-07']
		    },
		    yAxis: {
		        type: 'value',
		        min:'dataMin',
		        max:'dataMax'
		    },
		    dataZoom: [{
	            startValue: '08-01'
	        }, {
	            type: 'inside'
	        }],
		    series: [
		        {
		            name:'传感器1',
		            type:'line',
		            smooth: true,
		            data:[10, 132, 40, 180, 440, 20, 10]
		        },
		        {
		            name:'传感器2',
		            type:'line',
		            smooth: true,
		            data:[220, 182, 191, 234, 290, 330, 310]
		        }
		    ]
		};
		// 使用刚指定的配置项和数据显示图表。
		myChart.setOption(option);
	}else{
		myChart.resize();
	}
}
//复合曲线图示例
function curve_05(id,type)
{
	// 基于准备好的dom，初始化echarts实例
	var myChart = echarts.init(document.getElementById(id));
	if(type == 0){
		// 指定图表的配置项和数据
		var option = 
		{
		    title:{
		        text: '复合曲线图示例',
		        textStyle:{
		        	fontSize:'14',
		        },
		    },
		    tooltip: {
		        trigger: 'axis'
		    },
		    legend: {
		        data:['传感器1','传感器2','传感器3'],
		        right:'5%',
		    },
		    grid: {
		        left: '3%',
		        right: '4%',
		        bottom: '3%',
		        containLabel: true
		    },
		    toolbox: {
		        feature: {
		            saveAsImage: {}
		        }
		    },
		    xAxis: {
		        type: 'category',
		        boundaryGap: false,
		        data: ['08-01','08-02','08-03','08-04','08-05','08-06','08-07']
		    },
		    yAxis: {
		        type: 'value',
		        min:'dataMin',
		        max:'dataMax'
		    },
		    series: [
		        {
		            name:'传感器1',
		            type:'line',
		            smooth: true,
		            data:[10, 132, 40, 180, 440, 20, 10]
		        },
		        {
		            name:'传感器2',
		            type:'line',
		            smooth: true,
		            data:[220, 182, 191, 234, 290, 330, 310]
		        },
		        {
		            name:'传感器3',
		            type:'line',
		            smooth: true,
		            data:[150, 232, 201, 154, 190, 330, 410]
		        }
		    ]
		};
		// 使用刚指定的配置项和数据显示图表。
		myChart.setOption(option);
	}else{
		myChart.resize();
	}
}
//实时曲线图
function curve_06(id,type)
{
	// 基于准备好的dom，初始化echarts实例
	var myChart = echarts.init(document.getElementById(id));
	if(type == 0){
		// 指定图表的配置项和数据
		function randomData() {
		    now = new Date(+now + oneDay);
		    value = value + Math.random() * 21 - 10;
		    return {
		        name: now.toString(),
		        value: [
		            [now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/'),
		            Math.round(value)
		        ]
		    }
		}
		var data = [];
		var now = +new Date(2010, 8, 17);
		var oneDay = 24 * 3600 * 1000;
		var value = Math.random() * 1000;
		for (var i = 0; i < 1000; i++) {
		    data.push(randomData());
		}
		option = {
		    title: {
		        text: '实时曲线图示例'
		    },
		    tooltip: {
		        trigger: 'axis',
		        formatter: function (params) {
		            params = params[0];
		            var date = new Date(params.name);
		            return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear() + ' : ' + params.value[1];
		        },
		        axisPointer: {
		            animation: false
		        }
		    },
		    xAxis: {
		        type: 'time',
		        splitLine: {
		            show: false
		        }
		    },
		    yAxis: {
		        type: 'value',
		        boundaryGap: [0, '100%'],
		        splitLine: {
		            show: false
		        },
		        min:'dataMin',
		        max:'dataMax'
		    },
		    series: [{
		        name: '模拟数据',
		        type: 'line',
		        smooth: true,
		        showSymbol: false,
		        hoverAnimation: false,
		        data: data
		    }]
		};
		setInterval(function () {

		    for (var i = 0; i < 5; i++) {
		        data.shift();
		        data.push(randomData());
		    }

		    myChart.setOption({
		        series: [{
		            data: data
		        }]
		    });
		}, 1000);
		// 使用刚指定的配置项和数据显示图表。
		myChart.setOption(option);
	}else{
		myChart.resize();
	}
}
//曲线区域图
function curve_07(id,type)
{
	// 基于准备好的dom，初始化echarts实例
	var myChart = echarts.init(document.getElementById(id));
	if(type == 0){
		// 指定图表的配置项和数据
		var option = 
		{
			 title:{
			        text: '曲线区域图示例',
			        textStyle:{
			        	fontSize:'14',
			        },
			    },
			    tooltip: {
			        trigger: 'axis'
			    },
			    legend: {
			        data:['传感器1','传感器2']
			    },
			    grid: {
			        left: '3%',
			        right: '4%',
			        bottom: '3%',
			        containLabel: true
			    },
			    toolbox: {
			        feature: {
			            saveAsImage: {}
			        }
			    },
			    xAxis: {
			        type: 'category',
			        boundaryGap: false,
			        data: ['08-01','08-02','08-03','08-04','08-05','08-06','08-07']
			    },
			    yAxis: {
			        type: 'value',
			        min:'dataMin',
			        max:'dataMax'
			    },
			    series:
			    [
				    {
				    	name:'传感器1',
				    	data: [12, 320, 901, 504, 1290, 690, 1320],
				        type: 'line',
				        smooth: true,
				        areaStyle: {}
				    },
				    {
				    	name:'传感器2',
				    	data: [60, 850, 330, 40, 900, 1260, 700],
				        type: 'line',
				        smooth: true,
				        areaStyle: {}
				    }
			    ]
			};
		// 使用刚指定的配置项和数据显示图表。
		myChart.setOption(option);
	}else{
		myChart.resize();
	}
}
//堆栈面积图示例
function curve_08(id,type)
{
	// 基于准备好的dom，初始化echarts实例
	var myChart = echarts.init(document.getElementById(id));
	if(type == 0){
		// 指定图表的配置项和数据
		var option = {
			    title: {
			        text: '堆栈面积图示例'
			    },
			    tooltip : {
			        trigger: 'axis',
			        axisPointer: {
			            type: 'cross',
			            label: {
			                backgroundColor: '#6a7985'
			            }
			        }
			    },
			    legend: {
			        data:['传感器1','传感器2','传感器3','传感器4','传感器5']
			    },
			    toolbox: {
			        feature: {
			            saveAsImage: {}
			        }
			    },
			    grid: {
			        left: '3%',
			        right: '4%',
			        bottom: '3%',
			        containLabel: true
			    },
			    xAxis : [
			        {
			            type : 'category',
			            boundaryGap : false,
			            data: ['08-01','08-02','08-03','08-04','08-05','08-06','08-07']
			        }
			    ],
			    yAxis : [
			        {
			            type : 'value',
				        min:'dataMin',
				        max:'dataMax'
			        }
			    ],
			    series : [
			        {
			            name:'传感器1',
			            type:'line',
			            stack: '总量',
			            areaStyle: {normal: {}},
			            data:[120, 132, 101, 134, 90, 230, 210]
			        },
			        {
			            name:'传感器2',
			            type:'line',
			            stack: '总量',
			            areaStyle: {normal: {}},
			            data:[220, 182, 191, 234, 290, 330, 310]
			        },
			        {
			            name:'传感器3',
			            type:'line',
			            stack: '总量',
			            areaStyle: {normal: {}},
			            data:[150, 232, 201, 154, 190, 330, 410]
			        },
			        {
			            name:'传感器4',
			            type:'line',
			            stack: '总量',
			            areaStyle: {normal: {}},
			            data:[320, 332, 301, 334, 390, 330, 320]
			        },
			        {
			            name:'传感器5',
			            type:'line',
			            stack: '总量',
			            label: {
			                normal: {
			                    show: true,
			                    position: 'top'
			                }
			            },
			            areaStyle: {normal:{}},
			            data:[820, 932, 901, 934, 1290, 1330, 1320]
			        }
			    ]
			};
		// 使用刚指定的配置项和数据显示图表。
		myChart.setOption(option);
	}else{
		myChart.resize();
	}
}
//仪表盘示例图
function curve_09(id,type)
{
	// 基于准备好的dom，初始化echarts实例
	var myChart    = echarts.init(document.getElementById(id));
	if(type == 0)
	{
		var initialArr = [0,600,'km/h','风速',10,5,30,16];
		var initialAtr = $("#"+id).parent(".canvas-con").attr("arrmeter");
		if(initialAtr != undefined && initialAtr != "")
		{
			initialArr = [initialAtr].toString().split(',');
		}
		// 指定图表的配置项和数据
		var option = 
		{
			    tooltip:
				{
			        formatter:"{b}<br/>{a}:{c}"+initialArr[2],
			    },
			    series:
				[
			        {
			            name: initialArr[3],
			            type: 'gauge',
			        	radius:'100%',
			        	min:initialArr[0],
			        	max:initialArr[1],
			        	splitNumber:initialArr[4],
						title:{fontSize:initialArr[7]},
			        	axisTick:{splitNumber:initialArr[5]},
			            detail:{formatter:'{value}'+initialArr[2],fontSize:initialArr[6]},
			            data: [{value: 150, name: '传感器'}]
			        }
			    ]
		};
		// 使用刚指定的配置项和数据显示图表。
		myChart.setOption(option);
	}else{
		myChart.resize();
	}
}
//仪表盘示例图
function curve_10(id,type)
{
	// 基于准备好的dom，初始化echarts实例
	var myChart = echarts.init(document.getElementById(id));
	if(type == 0)
	{
		var initialArr = [0,600,'km/h','风速',10,5,30,16];
		var initialAtr = $("#"+id).parent(".canvas-con").attr("arrmeter");
		if(initialAtr != undefined && initialAtr != "")
		{
			initialArr = [initialAtr].toString().split(',');
		}
		// 指定图表的配置项和数据
		var option = 
		{
			tooltip:
			{
				formatter:"{b}<br/>{a}:{c}"+initialArr[2],
			},
			series:
			[
				{
					name:initialArr[3],
					type: 'gauge',
					min:initialArr[0],
					max:initialArr[1],
					radius: '100%',
					splitNumber:initialArr[4],
					axisLine: 
					{//坐标轴线
						lineStyle: 
						{      
							width:10, // 属性lineStyle控制线条样式
						}
					},
					axisTick:
					{            
						length:15,// 属性length控制线长
						splitNumber:initialArr[5],
					},
					splitLine:
					{   
						length: 20,
						lineStyle: 
						{
							color: 'auto'
						}
					},
					axisLabel:
					{
						backgroundColor: 'auto',
						borderRadius: 2,
						color: '#eee',
						padding: 3,
						textShadowBlur: 2,
						textShadowOffsetX: 1,
						textShadowOffsetY: 1,
						textShadowColor: '#222'
					},
					title:
					{
						fontWeight: 'bolder',
						fontSize:initialArr[7],//表盘文字大小
						fontStyle: 'italic'
					},
					detail:{formatter:'{value}'+initialArr[2],fontSize:initialArr[6]},
					data:[{value: 80, name:'传感器'}]
				}
			]
		};
		//使用刚指定的配置项和数据显示图表。
		myChart.setOption(option);
	}else{
		myChart.resize();
	}
}
//定位(地图)
function curve_11(id,type)
{
	var map = new BMap.Map(id); // 创建Map实例
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
//管道(1)
function curve_12(id,type)
{
	// 基于准备好的dom，初始化echarts实例
	var myChart = echarts.init(document.getElementById(id));
	if(type == 0)
	{
		var w  = $("#"+id).width();
		var h  = $("#"+id).height();
		var th = parseInt(h*0.8);
		var tz = parseInt(h*0.6);
		var tw = parseInt(tz * 3.5);
		var fd = parseInt(w/(tw*1.4));
		var xw;
		var co = [];
		if(fd == 0)
		{
			tw = parseInt(w*0.8);
			tz = parseInt(tw/3.5);
			co.push({coords:[[0, 0],[w, 0]]});
			xw = w;
		}else
		{
			var num = parseInt(w/fd);
			xw = num*fd;
			for(var a=0;a<fd;a++)
			{
				co.push({coords:[[(num*a)-1, 0],[num*(a+1), 0]]});
			}
		}
		option = 
		{
			grid:
			{
		        top:0,
		        left:0,
		        right:0,
		        bottom:'50%'
		    },
		    xAxis:
			{
		        splitLine: {
		            show: false
		        },
		        axisLine: {
		            show: false
		        },
		        axisTick: {
		            show: false
		        },
		        axisLabel: {
		            show: false
		        },
		        max:xw,
		        min: 0
		    },
		    yAxis:
			{
		        silent: true,
		        splitLine: {
		            show: false
		        },
		        axisLine: {
		            show: false
		        },
		        axisTick: {
		            show: false
		        },
		        axisLabel: {
		            show: false
		        },
		        max:xw,
		        min: 0
		    },
		    series:[
			{
		        coordinateSystem: 'cartesian2d',
		        type: 'lines',
		        polyline: true,
		        zlevel: 1,
		        effect:
				{
		            show: true,
		            constantSpeed:60,
		            delay:0,
		            symbolSize: [tz,tw],
		            symbol: 'image://'+basePath+'/cloudConfiguration/images/zutai_new/gd1.png',
		            trailLength:0.5,
		            loop: true,
		        },
		        lineStyle:
				{
                    normal:
                        {
                            width:20,
                            color:'rgba(255,255,255,0)',
                            opacity: 1,
                            curveness:0,
                            type:'solid',
                        }
		        },
				data:co
		    }]
		};
		//使用刚指定的配置项和数据显示图表。
		myChart.setOption(option);
	}else
	{
		var w  = $("#"+id).width();
		var h  = $("#"+id).height();
		if(h >= 1 && w >= 1)
		{
			var th = parseInt(h*0.8);
			var tz = parseInt(h*0.6);
			var tw = parseInt(tz * 3.5);
			var fd = parseInt(w/(tw*1.4));
			var xw;
			var co = [];
			if(fd == 0)
			{
				tw = parseInt(w*0.8);
				tz = parseInt(tw/3.5);
				co.push({coords:[[0, 0],[w, 0]]});
				xw = w;
			}else
			{
				var num = parseInt(w/fd);
				xw = num*fd;
				for(var a=0;a<fd;a++)
				{
					co.push({coords:[[(num*a)-1, 0],[num*(a+1), 0]]});
				}
			}
			myChart.setOption(
			{
				xAxis:
				{
			        max:xw,
			        min: 0
			    },
			    yAxis:
			    {
			        max:xw,
			        min: 0
			    },
				series:[
				{
					effect:
					{
			            symbolSize: [tz,tw],
			        },
					lineStyle:
					{
			            normal:
			            {
			                width:th,
			            }
			        },
			        data:co
				}]
			});
			myChart.resize();
		}	
	}
}
//管道(2)
function curve_13(id,type)
{
	// 基于准备好的dom，初始化echarts实例
	var myChart = echarts.init(document.getElementById(id));
	if(type == 0)
	{
		var w  = $("#"+id).width();
		var h  = $("#"+id).height();
		var th = parseInt(h*0.8);
		var tz = parseInt(h*0.6);
		var tw = parseInt(tz * 3.5);
		var fd = parseInt(w/(tw*1.4));
		var xw;
		var co = [];
		if(fd == 0)
		{
			tw = parseInt(w*0.8);
			tz = parseInt(tw/3.5);
			co.push({coords:[[0, 0],[w, 0]]});
			xw = w;
		}else
		{
			var num = parseInt(w/fd);
			xw = num*fd;
			for(var a=0;a<fd;a++)
			{
				co.push({coords:[[(num*a)-1, 0],[num*(a+1), 0]]});
			}
		}
		option = 
		{
			grid:
			{
		        top:0,
		        left:0,
		        right:0,
		        bottom:'50%'
		    },
		    xAxis:
			{
		        splitLine: {
		            show: false
		        },
		        axisLine: {
		            show: false
		        },
		        axisTick: {
		            show: false
		        },
		        axisLabel: {
		            show: false
		        },
		        max:xw,
		        min: 0
		    },
		    yAxis:
			{
		        silent: true,
		        splitLine: {
		            show: false
		        },
		        axisLine: {
		            show: false
		        },
		        axisTick: {
		            show: false
		        },
		        axisLabel: {
		            show: false
		        },
		        max:xw,
		        min: 0
		    },
		    series:[
			{
		        coordinateSystem: 'cartesian2d',
		        type: 'lines',
		        polyline: true,
		        zlevel: 1,
		        effect:
				{
		            show: true,
		            constantSpeed:60,
		            delay:0,
		            symbolSize: [tz,tw],
		            symbol: 'image://'+basePath+'/cloudConfiguration/images/zutai_new/gd2.png',
		            trailLength:0.5,
		            loop: true,
		        },
		        lineStyle:
				{
                    normal:
                        {
                            width:20,
                            color:'rgba(255,255,255,0)',
                            opacity: 1,
                            curveness:0,
                            type:'solid',
                        }
		        },
				data:co
		    }]
		};
		//使用刚指定的配置项和数据显示图表。
		myChart.setOption(option);
	}else
	{
		var w  = $("#"+id).width();
		var h  = $("#"+id).height();
		if(h >= 1 && w >= 1)
		{
			var th = parseInt(h*0.8);
			var tz = parseInt(h*0.6);
			var tw = parseInt(tz * 3.5);
			var fd = parseInt(w/(tw*1.4));
			var xw;
			var co = [];
			if(fd == 0)
			{
				tw = parseInt(w*0.8);
				tz = parseInt(tw/3.5);
				co.push({coords:[[0, 0],[w, 0]]});
				xw = w;
			}else
			{
				var num = parseInt(w/fd);
				xw = num*fd;
				for(var a=0;a<fd;a++)
				{
					co.push({coords:[[(num*a)-1, 0],[num*(a+1), 0]]});
				}
			}
			myChart.setOption(
			{
				xAxis:
				{
			        max:xw,
			        min: 0
			    },
			    yAxis:
			    {
			        max:xw,
			        min: 0
			    },
				series:[
				{
					effect:
					{
			            symbolSize: [tz,tw],
			        },
					lineStyle:
					{
			            normal:
			            {
			                width:th,
			            }
			        },
			        data:co
				}]
			});
			myChart.resize();
		}
	}
}
//管道(3)
function curve_14(id,type)
{
	// 基于准备好的dom，初始化echarts实例
	var myChart = echarts.init(document.getElementById(id));
	if(type == 0)
	{
		var w  = $("#"+id).width();
		var h  = $("#"+id).height();
		var th = parseInt(h*0.8);
		var tz = parseInt(h*0.6);
		var tw = parseInt(tz * 3.5);
		var fd = parseInt(w/(tw*1.4));
		var xw;
		var co = [];
		if(fd == 0)
		{
			tw = parseInt(w*0.8);
			tz = parseInt(tw/3.5);
			co.push({coords:[[0, 0],[w, 0]]});
			xw = w;
		}else
		{
			var num = parseInt(w/fd);
			xw = num*fd;
			for(var a=0;a<fd;a++)
			{
				co.push({coords:[[(num*a)-1, 0],[num*(a+1), 0]]});
			}
		}
		option = 
		{
			grid:
			{
		        top:0,
		        left:0,
		        right:0,
		        bottom:'50%'
		    },
		    xAxis:
			{
		        splitLine: {
		            show: false
		        },
		        axisLine: {
		            show: false
		        },
		        axisTick: {
		            show: false
		        },
		        axisLabel: {
		            show: false
		        },
		        max:xw,
		        min: 0
		    },
		    yAxis:
			{
		        silent: true,
		        splitLine: {
		            show: false
		        },
		        axisLine: {
		            show: false
		        },
		        axisTick: {
		            show: false
		        },
		        axisLabel: {
		            show: false
		        },
		        max:xw,
		        min: 0
		    },
		    series:[
			{
		        coordinateSystem: 'cartesian2d',
		        type: 'lines',
		        polyline: true,
		        zlevel: 1,
		        effect:
				{
		            show: true,
		            constantSpeed:60,
		            delay:0,
		            symbolSize: [tz,tw],
		            symbol: 'image://'+basePath+'/cloudConfiguration/images/zutai_new/gd3.png',
		            trailLength:0.5,
		            loop: true,
		        },
		        lineStyle:
				{
                    normal:
                        {
                            width:20,
                            color:'rgba(255,255,255,0)',
                            opacity: 1,
                            curveness:0,
                            type:'solid',
                        }
		        },
				data:co
		    }]
		};
		//使用刚指定的配置项和数据显示图表。
		myChart.setOption(option);
	}else
	{
		var w  = $("#"+id).width();
		var h  = $("#"+id).height();
		if(h >= 1 && w >= 1)
		{
			var th = parseInt(h*0.8);
			var tz = parseInt(h*0.6);
			var tw = parseInt(tz * 3.5);
			var fd = parseInt(w/(tw*1.4));
			var xw;
			var co = [];
			if(fd == 0)
			{
				tw = parseInt(w*0.8);
				tz = parseInt(tw/3.5);
				co.push({coords:[[0, 0],[w, 0]]});
				xw = w;
			}else
			{
				var num = parseInt(w/fd);
				xw = num*fd;
				for(var a=0;a<fd;a++)
				{
					co.push({coords:[[(num*a)-1, 0],[num*(a+1), 0]]});
				}
			}
			myChart.setOption(
			{
				xAxis:
				{
			        max:xw,
			        min: 0
			    },
			    yAxis:
			    {
			        max:xw,
			        min: 0
			    },
				series:[
				{
					effect:
					{
			            symbolSize: [tz,tw],
			        },
					lineStyle:
					{
			            normal:
			            {
			                width:th,
			            }
			        },
			        data:co
				}]
			});
			myChart.resize();
		}
	}
}
//管道(弯道1)
function curve_15(id,type)
{
	// 基于准备好的dom，初始化echarts实例
	var myChart = echarts.init(document.getElementById(id));
	if(type == 0)
	{
		var w  = $("#"+id).width();
		var h  = $("#"+id).height();
		var th;
		var top;
		var lef;
		if(w >= h)
		{
			th  = w*0.2;
			top = th/2;
			lef = th/2;
		}else
		{
			th  = w*0.2;
			top = th/2;
			lef = th/2;
		}
		var tz = parseInt(th*0.6);
		var tw = parseInt(tz * 3.5);
		option =
		{
			grid:
			{
		        top:top,
		        left:lef,
		        right:0,
		        bottom:0
		    },
			xAxis:
			{
				splitLine: 
				{
					show:false
				},
				axisLine:
				{
					show:false
				},
				axisTick:
				{
					show:false
				},
				axisLabel:
				{
					show:false
				},
				max: 400,
				min: 0
			},
			yAxis:
			{
				silent:true,
				splitLine:
				{
					show:false
				},
				axisLine:
				{
					show:false
				},
				axisTick:
				{
					show:false
				},
				axisLabel:
				{
					show:false
				},
				max:400,
				min:0
			},
			series:[
			{
				coordinateSystem:'cartesian2d',
				type:'lines',
				polyline:true,
				zlevel:1,
				effect:
				{
					show:true,
					color:'#0AE94C',
					constantSpeed:60,
					trailLength:0.5,
					symbolSize: [tz,tw],
					symbol:'image://'+basePath+'/cloudConfiguration/images/zutai_new/gd1.png',
					loop:true
				},
				lineStyle:
				{
                    normal:
                        {
                            width:20,
                            color:'rgba(255,255,255,0)',
                            opacity: 1,
                            curveness:0,
                            type:'solid',
                        }
				},
				data:
				[{
					 coords:
					 [
	                    [0, 0],
	                    [0, 400],
	                    [400, 400],
	                 ]
				}]
			}]
		};
		//使用刚指定的配置项和数据显示图表。
		myChart.setOption(option);
	}else
	{
		var w  = $("#"+id).width();
		var h  = $("#"+id).height();
		if(h >= 1 && w >= 1)
		{
			var th;
			var top;
			var lef;
			if(w >= h)
			{
				th  = h*0.2;
				top = th/2;
				lef = th/2;
			}else
			{
				th  = w*0.2;
				top = th/2;
				lef = th/2;
			}
			var tz = parseInt(th * 0.6);
			var tw = parseInt(tz * 3.5);
			myChart.setOption(
			{
				grid:
				{
			        top:top,
			        left:lef
			    },
				series:[
				{
					effect:
					{
			            symbolSize: [tz,tw],
			        },
					lineStyle:
					{
			            normal:
			            {
			                width:th,
			            }
			        },
			        data:
					[{
						 coords:
						 [
		                    [0, 0],
		                    [0, 400],
		                    [400, 400],
		                 ]
					}]
				}]
			});
			myChart.resize();
		}
	}
}
//管道(弯道2)
function curve_16(id,type)
{
	// 基于准备好的dom，初始化echarts实例
	var myChart = echarts.init(document.getElementById(id));
	if(type == 0)
	{
		var w  = $("#"+id).width();
		var h  = $("#"+id).height();
		var th;
		var top;
		var lef;
		if(w >= h)
		{
			th  = w*0.2;
			top = th/2;
			lef = th/2;
		}else
		{
			th  = w*0.2;
			top = th/2;
			lef = th/2;
		}
		var tz = parseInt(th*0.6);
		var tw = parseInt(tz * 3.5);
		option =
		{
			grid:
			{
		        top:top,
		        left:lef,
		        right:0,
		        bottom:0
		    },
			xAxis:
			{
				splitLine: 
				{
					show:false
				},
				axisLine:
				{
					show:false
				},
				axisTick:
				{
					show:false
				},
				axisLabel:
				{
					show:false
				},
				max: 400,
				min: 0
			},
			yAxis:
			{
				silent:true,
				splitLine:
				{
					show:false
				},
				axisLine:
				{
					show:false
				},
				axisTick:
				{
					show:false
				},
				axisLabel:
				{
					show:false
				},
				max:400,
				min:0
			},
			series:[
			{
				coordinateSystem:'cartesian2d',
				type:'lines',
				polyline:true,
				zlevel:1,
				effect:
				{
					show:true,
					color:'#0AE94C',
					constantSpeed:60,
					trailLength:0.5,
					symbolSize: [tz,tw],
					symbol:'image://'+basePath+'/cloudConfiguration/images/zutai_new/gd2.png',
					loop:true
				},
				lineStyle:
				{
                    normal:
                        {
                            width:20,
                            color:'rgba(255,255,255,0)',
                            opacity: 1,
                            curveness:0,
                            type:'solid',
                        }
				},
				data:
				[{
					 coords:
					 [
	                    [0, 0],
	                    [0, 400],
	                    [400, 400],
	                 ]
				}]
			}]
		};
		//使用刚指定的配置项和数据显示图表。
		myChart.setOption(option);
	}else
	{
		var w  = $("#"+id).width();
		var h  = $("#"+id).height();
		if(h >= 1 && w >= 1)
		{
			var th;
			var top;
			var lef;
			if(w >= h)
			{
				th  = h*0.2;
				top = th/2;
				lef = th/2;
			}else
			{
				th  = w*0.2;
				top = th/2;
				lef = th/2;
			}
			var tz = parseInt(th * 0.6);
			var tw = parseInt(tz * 3.5);
			myChart.setOption(
			{
				grid:
				{
			        top:top,
			        left:lef
			    },
				series:[
				{
					effect:
					{
			            symbolSize: [tz,tw],
			        },
					lineStyle:
					{
			            normal:
			            {
			                width:th,
			            }
			        },
			        data:
					[{
						 coords:
						 [
		                    [0, 0],
		                    [0, 400],
		                    [400, 400],
		                 ]
					}]
				}]
			});
			myChart.resize();
		}
	}
}
//管道(弯道3)
function curve_17(id,type)
{
	// 基于准备好的dom，初始化echarts实例
	var myChart = echarts.init(document.getElementById(id));
	if(type == 0)
	{
		var w  = $("#"+id).width();
		var h  = $("#"+id).height();
		var th;
		var top;
		var lef;
		if(w >= h)
		{
			th  = w*0.2;
			top = th/2;
			lef = th/2;
		}else
		{
			th  = w*0.2;
			top = th/2;
			lef = th/2;
		}
		var tz = parseInt(th*0.6);
		var tw = parseInt(tz * 3.5);
		option =
		{
			grid:
			{
		        top:top,
		        left:lef,
		        right:0,
		        bottom:0
		    },
			xAxis:
			{
				splitLine: 
				{
					show:false
				},
				axisLine:
				{
					show:false
				},
				axisTick:
				{
					show:false
				},
				axisLabel:
				{
					show:false
				},
				max: 400,
				min: 0
			},
			yAxis:
			{
				silent:true,
				splitLine:
				{
					show:false
				},
				axisLine:
				{
					show:false
				},
				axisTick:
				{
					show:false
				},
				axisLabel:
				{
					show:false
				},
				max:400,
				min:0
			},
			series:[
			{
				coordinateSystem:'cartesian2d',
				type:'lines',
				polyline:true,
				zlevel:1,
				effect:
				{
					show:true,
					color:'#0AE94C',
					constantSpeed:60,
					trailLength:0.5,
					symbolSize: [tz,tw],
					symbol:'image://'+basePath+'/cloudConfiguration/images/zutai_new/gd3.png',
					loop:true
				},
				lineStyle:
				{
                    normal:
                        {
                            width:20,
                            color:'rgba(255,255,255,0)',
                            opacity: 1,
                            curveness:0,
                            type:'solid',
                        }
				},
				data:
				[{
					 coords:
					 [
	                    [0, 0],
	                    [0, 400],
	                    [400, 400],
	                 ]
				}]
			}]
		};
		//使用刚指定的配置项和数据显示图表。
		myChart.setOption(option);
	}else
	{
		var w  = $("#"+id).width();
		var h  = $("#"+id).height();
		if(h >= 1 && w >= 1)
		{
			var th;
			var top;
			var lef;
			if(w >= h)
			{
				th  = h*0.2;
				top = th/2;
				lef = th/2;
			}else
			{
				th  = w*0.2;
				top = th/2;
				lef = th/2;
			}
			var tz = parseInt(th * 0.6);
			var tw = parseInt(tz * 3.5);
			myChart.setOption(
			{
				grid:
				{
			        top:top,
			        left:lef
			    },
				series:[
				{
					effect:
					{
			            symbolSize: [tz,tw],
			        },
					lineStyle:
					{
			            normal:
			            {
			                width:th,
			            }
			        },
			        data:
					[{
						 coords:
						 [
		                    [0, 0],
		                    [0, 400],
		                    [400, 400],
		                 ]
					}]
				}]
			});
			myChart.resize();
		}
	}
}
//蓄水池
function curve_18(id,type)
{
	// 基于准备好的dom，初始化echarts实例
	var myChart = echarts.init(document.getElementById(id));
	if(type == 0)
	{
		var xn  = 500;
		var max = 1000;
		var bai = 0.5;
		var siz = 20;
		var reservoir = $("#"+id).parent(".canvas-con").attr("reservoir");
		
		if(reservoir)
		{
			var arrData = [reservoir].toString().split(',');
			if(arrData[1])
			{
				siz = arrData[1];
			}
		}
		option = 
		{
		    series: [
		    {
		        type:'liquidFill',
				name:'设备',
		        data:[{
					name:'传感器',
					value:bai
				}],
		        direction:'right',//波浪方向或者静止
		        shape:'container',
		        color:['rgba(43, 110, 204, 0.7)'],//水球颜色
		        center:['50%', '50%'], //水球位置
				amplitude:8,//波浪幅度
		        outline://外边
		        {
		        	show:false
		        },
		        label:{
					formatter:function(param){
						return param.seriesName + '\n'
							+ param.name + '\n'
							+ max +'单位/'+ xn +'单位('+param.value*100+'%)';
					},
					fontSize:siz,
				},
		        backgroundStyle://内图背景色边
		        {
		            color:'#e3f7ff',
		        }
		    }]
		};
		//使用刚指定的配置项和数据显示图表。
		myChart.setOption(option);
		setInterval(function()
		{
			xn  = (Math.random().toFixed(1))*1000;
			bai = xn/max;
			myChart.setOption(
			{
				series:[
				{
					data:[{name:'传感器',value:bai}]
				}]
			});
        },2000)
	}else
	{
		myChart.resize();
	}
}
//柱状图（竖）
function curve_19(id,type)
{
	// 基于准备好的dom，初始化echarts实例
	var myChart = echarts.init(document.getElementById(id));
	if(type == 0){
		// 指定图表的配置项和数据
		var option = 
		{
		    title:{
		        text: '柱状图示例(竖)',
		        subtext:"更新时间:2019-01-08 08:10:00",
				left:'3%',
				textStyle: {
					fontSize: "14",
				}
		    },
		    tooltip: {
		        trigger:'axis',
		        axisPointer:{
		            type: 'shadow'
		        }
		    },
		    grid: {
		        left: '3%',
		        right: '4%',
		        bottom: '3%',
		        containLabel: true
		    },
		    toolbox: {
		        feature: {
		            saveAsImage: {}
		        }
		    },
		    xAxis: {
		        type:'category',
		        axisTick:{
	                alignWithLabel:true
	            },
		        data:['传感器1','传感器2','传感器3','传感器4','传感器5']
		    },
		    yAxis: {
		        type:'value',
		    },
		    series: [
		        {
		            name:'传感器1',
		            type:'bar',
		            barGap:0,
		            data:[10,60,-30,43,27]
		        }
		    ]
		};
		// 使用刚指定的配置项和数据显示图表。
		myChart.setOption(option);
	}else{
		myChart.resize();
	}
}
//柱状图（横）
function curve_20(id,type)
{
	// 基于准备好的dom，初始化echarts实例
	var myChart = echarts.init(document.getElementById(id));
	if(type == 0){
		// 指定图表的配置项和数据
		var option = 
		{
		    title:{
		        text: '柱状图示例(横)',
		        subtext:"更新时间:2019-01-08 08:10:00",
				left:'3%',
				textStyle: {
					fontSize: "14",
				}
		    },
		    tooltip: {
		        trigger:'axis',
		        axisPointer:{
		            type: 'shadow'
		        }
		    },
		    grid: {
		        left: '3%',
		        right: '4%',
		        bottom: '3%',
		        containLabel: true
		    },
		    toolbox: {
		        feature: {
		            saveAsImage: {}
		        }
		    },
		    xAxis: {
		    	type:'value',
		    },
		    yAxis: {
		        type:'category',
		        axisTick:{
	                alignWithLabel:true
	            },
		        data:['传感器1','传感器2','传感器3','传感器4','传感器5']
		    },
		    series: [
		        {
		            name:'传感器1',
		            type:'bar',
		            barGap:0,
		            data:[10,60,-30,43,27]
		        }
		    ]
		};
		// 使用刚指定的配置项和数据显示图表。
		myChart.setOption(option);
	}else{
		myChart.resize();
	}
}
//饼图(1)
function curve_21(id,type)
{
	// 基于准备好的dom，初始化echarts实例
	var myChart = echarts.init(document.getElementById(id));
	if(type == 0){
		// 指定图表的配置项和数据
		var option = 
		{
		    title:{
		        text:'饼图示例',
		        subtext:"更新时间:2019-01-08 08:10:00 总计:1168",
				x:'center',
				textStyle:{
					fontSize:"14",
				}
		    },
		    tooltip:{
				trigger:'item',
				formatter:"{a} <br/>{b}: {c} ({d}%)"
			},
			legend:{
				type:'scroll',
				orient:'horizontal',
				bottom:'0',
				data:['传感器1','传感器2','传感器3','传感器4','传感器5']
			},
		    series:[{
				name:'饼图示例',
				type:'pie',
				radius:['45%', '60%'],
				avoidLabelOverlap:false,
				label:{
					normal:{
						show: false,
						position: 'center'
					},
					emphasis:{
						show: true,
						textStyle:{
							fontSize:'16',
						}
					}
				},
				data:[
					{value:335, name:'传感器1'},
					{value:310, name:'传感器2'},
					{value:234, name:'传感器3'},
					{value:135, name:'传感器4'},
					{value:154, name:'传感器5'}
				]
			}]
		};
		// 使用刚指定的配置项和数据显示图表。
		myChart.setOption(option);
	}else{
		myChart.resize();
	}
}
//饼图(2)
function curve_22(id,type)
{
	// 基于准备好的dom，初始化echarts实例
	var myChart = echarts.init(document.getElementById(id));
	if(type == 0){
		// 指定图表的配置项和数据
		var option = 
		{
		    title:{
		        text:'饼图示例',
		        subtext:"更新时间:2019-01-08 08:10:00  总计:1168",
				x:'center',
				textStyle:{
					fontSize:"14",
				}
		    },
		    tooltip:{
				trigger:'item',
				formatter:"{a} <br/>{b}: {c} ({d}%)"
			},
			legend:{
				type:'scroll',
				orient:'horizontal',
				bottom:'0',
				data:['传感器1','传感器2','传感器3','传感器4','传感器5']
			},
		    series:[{
				name:'饼图示例',
				type:'pie',
				radius:'60%',
				label:{
					normal:{
						show: false,
						position: 'center'
					},
					emphasis:{
						show: true,
						textStyle:{
							fontSize:'16',
						}
					}
				},
				data:[
					{value:335, name:'传感器1'},
					{value:310, name:'传感器2'},
					{value:234, name:'传感器3'},
					{value:135, name:'传感器4'},
					{value:154, name:'传感器5'}
				]
			}]
		};
		// 使用刚指定的配置项和数据显示图表。
		myChart.setOption(option);
	}else{
		myChart.resize();
	}
}
//蓄水池无边框
function curve_23(id,type)
{
	// 基于准备好的dom，初始化echarts实例
	var myChart = echarts.init(document.getElementById(id));
	if(type == 0)
	{
		var xn  = 500;//实时数值
		var max = 1000;//最大值
		var bai = 0.5;//百分比
		var siz = 20;//字体大小
		var Ran = 8;//波浪幅度
		var bac = "#4c84ff";//颜色
		var shw = true;
		var newPublicreservoir = $("#"+id).parent(".canvas-con").attr("publicreservoir");
		if(newPublicreservoir)
		{
			var arrData = [newPublicreservoir].toString().split(',');
			if(arrData[1])
			{
				siz = arrData[1];
			}
			if(arrData[2])
			{
				Ran = arrData[2];
			}
			if(arrData[3])
			{
				bac = arrData[3];
			}
			if(arrData[4])
			{
				if(arrData[4] == 1)
				{
					shw = false;
				}
			}
		}
		var option =
		{
			series:[{
				type:'liquidFill',
				data:[bai],//数据
				shape:'container',
				color:[bac],//水球颜色
		        center:['50%', '50%'], //水球位置
				amplitude:Ran,//波浪幅度
				outline:{show:false},
				name:'传感器',
				backgroundStyle:{color:'rgba(0, 0, 0, 0)',},
				label:{
					show:shw,
					fontSize:siz,
					color:[bac],
				}
			}],
			tooltip:{
				show:true
			}
		};
		//使用刚指定的配置项和数据显示图表。
		myChart.setOption(option);
		setInterval(function()
		{
			xn  = (Math.random().toFixed(1))*1000;
			bai = xn/max;
			myChart.setOption(
			{
				series:[
				{
					data:[bai]
				}]
			});
        },2000)
	}else
	{
		myChart.resize();
	}
}
//百分比控件横(单柱)
function curve_24(id,type)
{
	// 基于准备好的dom，初始化echarts实例
	var myChart = echarts.init(document.getElementById(id));
	if(type == 0)
	{
		var baifenbi   = 0.6;//百分比
		var grayBar    = 1;//背景(最大值)
		var beijing    = "rgba(102, 102, 102,0.5)";//背景颜色
		var tianchong  = "#3dc0e9";//填充颜色
		var Radious    = 20;//圆角
		var color      = "#fff";//文字颜色
		var size       = 16;//文字大小
		var newProgressbar = $("#"+id).parent(".canvas-con").attr("progressbar");
		if(newProgressbar)
		{
			var arrData = [newProgressbar].toString().split(',');
			if(arrData[1])
			{
				beijing = arrData[1];//背景颜色
			}
			if(arrData[2])
			{
				tianchong = arrData[2];//填充颜色
			}
			if(arrData[3])
			{
				Radious = Number(arrData[3]);//圆角
			}
			if(arrData[4])
			{
				color = arrData[4];//文字颜色
			}
			if(arrData[5])
			{
				size = Number(arrData[5]);//文字大小
			}
		}
		var option={
			grid:{//图表位置
				left:'0',
				right:'0',
				bottom:'0',
				top:'0',
				containLabel:true
			},
			xAxis:{
				show:false,
				axisLabel:{
					show:false, //让Y轴数据不显示
				},
				axisTick:{
					show:false, //隐藏Y轴刻度
				},
				axisLine:{
					show:false, //隐藏Y轴线段
				}
			},
			yAxis:{
				type:'category',
				axisLabel:{
					show:false, //让Y轴数据不显示
				},
				axisTick:{
					show:false, //隐藏Y轴刻度
				},
				axisLine:{
					show:false, //隐藏Y轴线段
				}
			},
			series:[
				//背景色
				{
					show:true,
					type:'bar',
					barGap:'-100%',
					barWidth:'100%',
					itemStyle:{
						barBorderRadius:Radious,//圆角
						color:beijing,//背景颜色
					},
					z:1,
					data:[grayBar],
				},
				//进度条
				{
					show:true,
					type:'bar',
					barGap:'-100%',
					barWidth:'100%',
					itemStyle:{
						barBorderRadius:Radious,//圆角
						color:tianchong,//背景颜色
					},
					max:1,
					label:{
						normal:{
							show:true,
							textStyle:{
								color:color,//文字颜色
								fontSize:size,//文字大小
							},
							position:'inside',
							formatter:function(){//百分比格式
								return (baifenbi * 100).toFixed(1) + '%';
							}
						}
					},
					labelLine:{
						show: false,
					},
					z:2,
					data:[baifenbi],
				}
			]
		};
		myChart.setOption(option);
	}else
	{
		myChart.resize();
	}
}
//百分比控件横(带数据)
function curve_25(id,type)
{
	// 基于准备好的dom，初始化echarts实例
	var myChart = echarts.init(document.getElementById(id));
	if(type == 0)
	{
		var baifenbi   = 0.6;//百分比
		var grayBar    = 1;//背景(最大值)
		var beijing    = "rgba(102, 102, 102,0.5)";//背景颜色
		var tianchong  = "#3dc0e9";//填充颜色
		var Radious    = 20;//圆角
		var color      = "#fff";//文字颜色
		var size       = 16;//文字大小
		var newProgressbar = $("#"+id).parent(".canvas-con").attr("progressbar");
		if(newProgressbar)
		{
			var arrData = [newProgressbar].toString().split(',');
			if(arrData[1])
			{
				beijing = arrData[1];//背景颜色
			}
			if(arrData[2])
			{
				tianchong = arrData[2];//填充颜色
			}
			if(arrData[3])
			{
				Radious = Number(arrData[3]);//圆角
			}
			if(arrData[4])
			{
				color = arrData[4];//文字颜色
			}
			if(arrData[5])
			{
				size = Number(arrData[5]);//文字大小
			}
		}
		var option={
			grid:{//图表位置
				left:'0',
				right:'0',
				bottom:'0',
				top:'0',
				containLabel:true
			},
			xAxis:[
				{
					show:true,
				},
				{
					show:true,
				}
			],
			yAxis:[
				{
					type:'category',
					axisLabel:{
						show:true, //让Y轴数据不显示
					},
					axisTick:{
						show:true, //隐藏Y轴刻度
					},
					axisLine:{
						show:true, //隐藏Y轴线段
					}
				},
				{
					type:'category',
					axisLabel:{
						show:true, //让Y轴数据不显示
					},
					axisTick:{
						show:true, //隐藏Y轴刻度
					},
					axisLine:{
						show:true, //隐藏Y轴线段
					}
				}
			],
			series:[
				//背景色
				{
					show:true,
					type:'bar',
					xAxisIndex:0,
					yAxisIndex:0,
					barGap:'-100%',
					barWidth:'70%',
					itemStyle:{
						barBorderRadius:Radious,//圆角
						color:beijing,//背景颜色
					},
					z:2,
					data:[grayBar],
				},
				//进度条
				{
					show:true,
					type:'bar',
					xAxisIndex:0,
					yAxisIndex:0,
					barGap:'-100%',
					barWidth:'70%',
					itemStyle:{
						barBorderRadius:Radious,//圆角
						color:tianchong,//背景颜色
					},
					max:1,
					label:{
						normal:{
							show:true,
							textStyle:{
								color:color,//文字颜色
								fontSize:size,//文字大小
							},
							position:'inside',
							formatter:function(){//百分比格式
								return (baifenbi * 100).toFixed(1) + '%';
							}
						}
					},
					labelLine:{
						show: false,
					},
					z:3,
					data:[baifenbi],
				},
				//数据条--------------------我是分割线君------------------------------//
				{
					show:true,
					type:'bar',
					barGap:'-100%',
					xAxisIndex:1,
					yAxisIndex:1,
					barWidth: '100%', //统计条宽度
					itemStyle:{
						normal: {
							color: 'rgba(0,0,0)'
						},
					},
					label: {
						normal: {
							show: true,
							position:['-100%', '-100%'],
							textStyle:{
								color:"#333",//文字颜色
								fontSize:30,//文字大小
							},
							position:'inside',
							formatter:function(){
	
								return (baifenbi * 100).toFixed(1) + '%';
							}
						}
					},
					z:1,
					data:[2],
				}
			]
		};
		myChart.setOption(option);
	}else
	{
		myChart.resize();
	}
}
/**********************************************************************************************************************************************************初始化图表***********************
 * ********************************************************************************************************************************************************************************/
function initialECharts(id)
{
	if(id.hasClass("newECharts"))//如果为图表类型
	{
		id.empty();//清空原图表
		var rid = id.parent(".canvas").attr("rid");//获取RID
		var cid = id.attr("curve");
		var myCurve = "my"+cid+"curve";//定义新的图表ID
		var tmp = '<div class="myECharts" id="'+myCurve+'"></div>';//定义新的图表模板
		id.html(tmp);//添加新的图表
		switch(rid)
		{
			case "14"://曲线(多选)
				var sid = id.attr("sid");
				if(sid == 1)
				{
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
				setTimeout(function() 
				{
					curve_02(myCurve,"0");
				},300);
				break;
			case "16"://区域(多选)
				var sid = id.attr("sid");
				if(sid == 1){
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
				var sid = id.attr("sid");
				if(sid == 1){
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
			case "19"://定位(地图)
				setTimeout(function() 
				{
					curve_11(myCurve,"0");
				},300);
				break;	
			case "21"://曲线(多选自定义分辨带)
				setTimeout(function() 
				{
					curve_03(myCurve,"0");
				},300);
				break;
			case "22"://管道类型
				var sid = id.attr("sid");
				if(sid == 1){
					setTimeout(function() 
					{
						curve_12(myCurve,"0");
					},300);
				}else if(sid == 2){
					setTimeout(function() 
					{
						curve_13(myCurve,"0");
					},300);
				}else if(sid == 3){
					setTimeout(function() 
					{
						curve_14(myCurve,"0");
					},300);
				}
				break;
			case "23"://弯道类型
				var sid = id.attr("sid");
				if(sid == 1){
					setTimeout(function() 
					{
						curve_15(myCurve,"0");
					},300);
				}else if(sid == 2){
					setTimeout(function() 
					{
						curve_16(myCurve,"0");
					},300);
				}else if(sid == 3){
					setTimeout(function() 
					{
						curve_17(myCurve,"0");
					},300);
				}
				break;
			case "24"://蓄水池
				setTimeout(function() 
				{
					curve_18(myCurve,"0");
				},300);
				break;
			case "27"://蓄水池无边框
				setTimeout(function() 
				{
					curve_23(myCurve,"0");
				},300);
				break;
			case "28"://百分比控件
				var sid = id.attr("sid");
				if(sid == 1){
					setTimeout(function() 
					{
						curve_24(myCurve,"0");
					},300);
				}else if(sid == 2){
					setTimeout(function() 
					{
						curve_25(myCurve,"0");
					},300);
				}else if(sid == 3){
					setTimeout(function() 
					{
						curve_26(myCurve,"0");
					},300);
				}else if(sid == 4){
					setTimeout(function() 
					{
						curve_27(myCurve,"0");
					},300);
				}
				break;
			case "30"://柱状图
				var sid = id.attr("sid");
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
				var sid = id.attr("sid");
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
		}		
	}
}
//复制或剪切组合未组合调用方法
function copyECharts(id)
{
	if(id.hasClass("book_Group") || id.hasClass("temp_Group"))//如果是组合前或者组合后或者嵌套组合
	{
		id.find(".canvas").each(function()
		{
			var cla = $(this).children(".canvas-con");
			pasteECharts($(this),cla);//粘贴图表类型方法
		})
	}else
	{
		var cla = id.children(".canvas-con");
		pasteECharts(id,cla);//粘贴图表类型方法
	}
}
//粘贴图表类型方法
function pasteECharts(id,cla)
{
	if(cla.hasClass("newVideo"))//如果为视频类型
	{
		videoId++;
		cla.children(".myPlayer").empty();
		var video    = cla.attr("video",videoId);
		var myVideo  = "my"+ videoId +"Player";
		var data1    = cla.attr("data1") || "";
		var data2    = cla.attr("data2") || "";
//		if(data1&&data2){
			cla.children(".myPlayer").append('<video  class="myVideo" id="'+myVideo+'" poster="" controls playsInline webkit-playsinline autoplay><source src="'+data1+'" type="" /><source src="'+data2+'" type="application/x-mpegURL" /></video>');
			setTimeout(function() 
			{
				new_video(myVideo);
			},500);
//		}
	}
	if(cla.hasClass("myChartID"))//如果为图表类型
	{
		var rid = id.attr("rid");//获取RID
		switch(rid)
		{
			case "11"://数值类型
				curveID++;//图表类型ID+1
				var myCurve = "my"+curveID+"curve";//定义新的图表ID
				cla.attr("curve",curveID);
				cla.attr("id",myCurve);
				break;
			case "12"://开关类型
				curveID++;//图表类型ID+1
				var myCurve = "my"+curveID+"curve";//定义新的图表ID
				cla.attr("curve",curveID);
				cla.attr("id",myCurve);
				break;
			case "13"://开关类型(自定义)
				curveID++;//图表类型ID+1
				var myCurve = "my"+curveID+"curve";//定义新的图表ID
				cla.attr("curve",curveID);
				cla.attr("id",myCurve);
				break;
			case "14"://曲线(多选)
				cla.empty();//清空原图表
				curveID++;//图表类型ID+1
				var myCurve = "my"+curveID+"curve";//定义新的图表ID
				var tmp = '<div class="myECharts" id="'+myCurve+'"></div>';//定义新的图表模板
				cla.attr("curve",curveID);//修改图表个数
				cla.html(tmp);//添加新的图表
				var sid = cla.attr("sid");
				if(sid == 1)
				{
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
				cla.empty();//清空原图表
				curveID++;//图表类型ID+1
				var myCurve = "my"+curveID+"curve";//定义新的图表ID
				var tmp = '<div class="myECharts" id="'+myCurve+'"></div>';//定义新的图表模板
				cla.attr("curve",curveID);//修改图表个数
				cla.html(tmp);//添加新的图表
				setTimeout(function() 
				{
					curve_02(myCurve,"0");
				},300);
				break;
			case "16"://区域(多选)
				cla.empty();//清空原图表
				curveID++;//图表类型ID+1
				var myCurve = "my"+curveID+"curve";//定义新的图表ID
				var tmp = '<div class="myECharts" id="'+myCurve+'"></div>';//定义新的图表模板
				cla.attr("curve",curveID);//修改图表个数
				cla.html(tmp);//添加新的图表
				var sid = cla.attr("sid");
				if(sid == 1){
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
				cla.empty();//清空原图表
				curveID++;//图表类型ID+1
				var myCurve = "my"+curveID+"curve";//定义新的图表ID
				var tmp = '<div class="myECharts" id="'+myCurve+'"></div>';//定义新的图表模板
				cla.attr("curve",curveID);//修改图表个数
				cla.html(tmp);//添加新的图表
				var sid = cla.attr("sid");
				if(sid == 1){
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
			case "19"://定位(地图)
				cla.empty();//清空原图表
				curveID++;//图表类型ID+1
				var myCurve = "my"+curveID+"curve";//定义新的图表ID
				var tmp = '<div class="myECharts" id="'+myCurve+'"></div>';//定义新的图表模板
				cla.attr("curve",curveID);//修改图表个数
				cla.html(tmp);//添加新的图表
				setTimeout(function()
				{
					curve_11(myCurve,"0");
				},300);
				break;	
			case "21"://曲线(多选自定义分辨带)
				cla.empty();//清空原图表
				curveID++;//图表类型ID+1
				var myCurve = "my"+curveID+"curve";//定义新的图表ID
				var tmp = '<div class="myECharts" id="'+myCurve+'"></div>';//定义新的图表模板
				cla.attr("curve",curveID);//修改图表个数
				cla.html(tmp);//添加新的图表
				setTimeout(function() 
				{
					curve_03(myCurve,"0");
				},300);
				break;
			case "22"://管道类型
				cla.empty();//清空原图表
				curveID++;//图表类型ID+1
				var myCurve = "my"+curveID+"curve";//定义新的图表ID
				var tmp = '<div class="myECharts" id="'+myCurve+'"></div>';//定义新的图表模板
				cla.attr("curve",curveID);//修改图表个数
				cla.html(tmp);//添加新的图表
				var sid = cla.attr("sid");
				if(sid == 1){
					setTimeout(function() 
					{
						curve_12(myCurve,"0");
					},300);
				}else if(sid == 2){
					setTimeout(function() 
					{
						curve_13(myCurve,"0");
					},300);
				}else if(sid == 3){
					setTimeout(function() 
					{
						curve_14(myCurve,"0");
					},300);
				}
				break;
			case "23"://弯道类型
				cla.empty();//清空原图表
				curveID++;//图表类型ID+1
				var myCurve = "my"+curveID+"curve";//定义新的图表ID
				var tmp = '<div class="myECharts" id="'+myCurve+'"></div>';//定义新的图表模板
				cla.attr("curve",curveID);//修改图表个数
				cla.html(tmp);//添加新的图表
				var sid = cla.attr("sid");
				if(sid == 1){
					setTimeout(function() 
					{
						curve_15(myCurve,"0");
					},300);
				}else if(sid == 2){
					setTimeout(function() 
					{
						curve_16(myCurve,"0");
					},300);
				}else if(sid == 3){
					setTimeout(function() 
					{
						curve_17(myCurve,"0");
					},300);
				}
				break;
			case "24"://蓄水池
				cla.empty();//清空原图表
				curveID++;//图表类型ID+1
				var myCurve = "my"+curveID+"curve";//定义新的图表ID
				var tmp = '<div class="myECharts" id="'+myCurve+'"></div>';//定义新的图表模板
				cla.attr("curve",curveID);//修改图表个数
				cla.html(tmp);//添加新的图表
				setTimeout(function() 
				{
					curve_18(myCurve,"0");
				},300);
				break;
			case "27"://蓄水池无边框
				cla.empty();//清空原图表
				curveID++;//图表类型ID+1
				var myCurve = "my"+curveID+"curve";//定义新的图表ID
				var tmp = '<div class="myECharts" id="'+myCurve+'"></div>';//定义新的图表模板
				cla.attr("curve",curveID);//修改图表个数
				cla.html(tmp);//添加新的图表
				setTimeout(function() 
				{
					curve_23(myCurve,"0");
				},300);
				break;
			case "28"://百分比控件
				cla.empty();//清空原图表
				curveID++;//图表类型ID+1
				var myCurve = "my"+curveID+"curve";//定义新的图表ID
				var tmp = '<div class="myECharts" id="'+myCurve+'"></div>';//定义新的图表模板
				cla.attr("curve",curveID);//修改图表个数
				cla.html(tmp);//添加新的图表
				var sid = cla.attr("sid");
				if(sid == 1){
					setTimeout(function() 
					{
						curve_24(myCurve,"0");
					},300);
				}else if(sid == 2){
					setTimeout(function() 
					{
						curve_25(myCurve,"0");
					},300);
				}else if(sid == 3){
					setTimeout(function() 
					{
						curve_26(myCurve,"0");
					},300);
				}else if(sid == 4){
					setTimeout(function() 
					{
						curve_27(myCurve,"0");
					},300);
				}
				break;
			case "30"://柱状图
				cla.empty();//清空原图表
				curveID++;//图表类型ID+1
				var myCurve = "my"+curveID+"curve";//定义新的图表ID
				var tmp = '<div class="myECharts" id="'+myCurve+'"></div>';//定义新的图表模板
				cla.attr("curve",curveID);//修改图表个数
				cla.html(tmp);//添加新的图表
				var sid = cla.attr("sid");
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
				cla.empty();//清空原图表
				curveID++;//图表类型ID+1
				var myCurve = "my"+curveID+"curve";//定义新的图表ID
				var tmp = '<div class="myECharts" id="'+myCurve+'"></div>';//定义新的图表模板
				cla.attr("curve",curveID);//修改图表个数
				cla.html(tmp);//添加新的图表
				var sid = cla.attr("sid");
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
		}		
	}
}

/************************************************************************ 生成图表JS模板方法 *******************************************************************/
//复合折线图模板
function jsTemp01(id)
{
	var deviceid     = id.attr("deviceid");//获取设备ID
	var sensorid     = id.attr("sensorid");//获取传感器ID
	var ID           = id.children(".myECharts").attr("id");//获取图表ID
	var devicename;//定义曲线图名称
	var sensorname   = [];//定义曲线传感器名称
	var sensortime   = [];//定义时间轴
	var series       = [];//定义数据轴
	var newseries    = [];//定义实时更新数据轴变量
	var arrdata      = [];//定义更新数组
	var updatedata   = [];//定义数据轴数组下标变量
	var ifupdatedata = [];//定义判断类型数据数轴

	var idColorRgb = id.attr("colorrgb");


	if(deviceid == undefined || deviceid == -1)//如果未选择设备则初始化默认
	{
		devicename = "复合折线图";
		sensorname = ["传感器1","传感器2","传感器3"];
		sensortime = "['08-01','08-02','08-03','08-04','08-05','08-06','08-07']";
		series = 
			'{'+
			   'name:"传感器1",'+
			   'type:"line",'+
			   'data:[10, 132, 40, 180, 440, 20, 10]'+
			'},'+
		   '{'+
				'name:"传感器2",'+
				'type:"line",'+
				'data:[220, 182, 191, 234, 290, 330, 310]'+
			'},'+
			'{'+
			   'name:"传感器3",'+
			   'type:"line",'+
			   'data:[150, 232, 201, 154, 190, 330, 410]'+
			'}';
	}else
	{
		$.ajax(//请求设备名
		{
			type:'get',
			async:false,
			url:basePath+'/device/selDeviceInfo',
            data:{
                deviceNumber:deviceid
            },
			success: function(data)
			{
				var json=data.data;
				devicename = json.name;//更新图表名称
			},
			error:function()
			{
				tooltips("请求出错！请联系技术支持","Warning");
				flag=false;
			},
		});
		if(sensorid == undefined)//如果未选择传感器
		{
			sensorname = ["传感器1","传感器2","传感器3"];
			sensortime = "['08-01','08-02','08-03','08-04','08-05','08-06','08-07']";
			series = 
				'{'+
				   'name:"传感器1",'+
				   'type:"line",'+
				   'data:[10, 132, 40, 180, 440, 20, 10]'+
				'},'+
			   '{'+
					'name:"传感器2",'+
					'type:"line",'+
					'data:[220, 182, 191, 234, 290, 330, 310]'+
				'},'+
				'{'+
				   'name:"传感器3",'+
				   'type:"line",'+
				   'data:[150, 232, 201, 154, 190, 330, 410]'+
				'}';
		}else
		{
			sensortime = 'time'+ID;//定义时间轴变量
			 arrsensorid = [sensorid].toString().split(',');//格式化传感器数组
			for(var a=0;a<arrsensorid.length;a++)
			{
				$.ajax(//请求传感器名
				{
                    type:'GET',
                    async:false,
                    url:basePath+'/sensor/selTypeList',		//根据设备ID查传感器
                    dataType: 'json',
                    data:{
                        deviceNumber:deviceid
                    },
					success: function(data)
					{
					    if(data.state=="success"){
                            for(var j=0;j<data.datas.length;j++){
                                if(data.datas[j].id==arrsensorid[a]){
                                    sensorname.push(a+data.datas[j].sensorName);//更新传感器名称
                                    series.push(//更新数据轴
                                        '{'+
                                        'name:"'+a+data.datas[j].sensorName+'",'+
                                        'type:"line",'+
                                        'data:data'+ID+a+
                                        '}');
                                    newseries.push('{'+//定义实时更新数据轴变量
                                        'data:data'+ID+a+
                                        '}');
                                    arrdata.push('var data'+ID+a+' = [];');//定义数据轴变量
                                    updatedata.push('data'+ID+a+'=cdData['+a+'];');//定义数据轴数组下标变量
                                    ifupdatedata.push('if(cdData['+a+'] !== " "){data'+ID+a+'=cdData['+a+'];}else{data'+ID+a+'=data'+ID+a+'[data'+ID+a+'.length-1]}');
                                    break;
                                }
                            }
                        }


					},
					error:function()
					{
						tooltips("请求出错！请联系技术支持","Warning");
						flag=false;
					},
				});
			}
		}
	}
	//定义JS模板
	var jsTMP = arrdata.join("")+//定义数据轴数组
	'var time'+ID+'= [];'+//定义时间轴数组
	'function new'+ID+'(id,data,time)'+
	'{'+
		'var myChart = echarts.init(document.getElementById("'+ID+'"));'+//初始化echarts实例
		'if(data == undefined)'+
		'{'+
			'var option  = '+
			'{'+
				'title:{text:"'+devicename+'",textStyle:{fontSize:"14",color:"'+idColorRgb+'"}},'+//设备名称
				'tooltip:{trigger:"axis"},'+
				'legend:{data:["'+sensorname.join('","')+'"],right:"5%",textStyle:{color:"'+ idColorRgb +'"}},'+//传感器名称
				'grid:{left:"3%",right:"4%",bottom:"3%",containLabel:true},'+
				'toolbox:{feature:{saveAsImage:{}}},'+
				'xAxis:{type:"category",boundaryGap:false,data:'+sensortime+',axisLine:{lineStyle:{color:"'+idColorRgb+'"}}},'+
				'yAxis:[{type:"value",min:"dataMin",max:"dataMax",axisLine:{lineStyle:{color:"'+idColorRgb+'"},formatter:function(value, index){return toDecimal(value,4);}}}],'+
				'series:['+series+']'+
			'};'+
			'myChart.setOption(option);'+
		'}else'+
		'{'+
			'if(time != undefined)'+
			'{'+
				'var cdData	 = data;'+//定义实时更新数据轴
				'if(data'+ID+'0.length > 0)'+
				'{'+
					ifupdatedata.join("")+
				'}else'+
				'{'+
					updatedata.join("")+
				'}'+
				'var newTime = time;'+//定义时间轴
				'time'+ID+'=newTime;'+
				'myChart.setOption({'+
					'xAxis:{data:'+sensortime+'},'+
				   ' series:['+newseries+']'+
			   '});'+
		   '}'+
		'}'+
	'}';
	return jsTMP;
}
//可选时间段曲线图
function jsTemp02(id)
{
	var deviceid   = id.attr("deviceid");//获取设备ID
	var sensorid   = id.attr("sensorid");//获取传感器ID
	var ID         = id.children(".myECharts").attr("id");//获取图表ID
	var devicename;//定义曲线图名称
	var sensorname = [];//定义曲线传感器名称
	var sensortime = [];//定义时间轴
	var series     = [];//定义数据轴
	var newseries  = [];//定义实时更新数据轴变量
	var arrdata    = [];//定义更新数组
	var updatedata = [];//定义数据轴数组下标变量
	var ifupdatedata = [];//定义判断类型数据数轴
    var idColorRgb = id.attr("colorrgb");
	if(deviceid == undefined || deviceid == -1)//如果未选择设备则初始化默认
	{
		devicename = "可选时间段曲线图";
		sensorname = ["传感器1","传感器2"];
		sensortime = "['08-01','08-02','08-03','08-04','08-05','08-06','08-07']";
		series = 
			'{'+
			   'name:"传感器1",'+
			   'type:"line",'+
			   'smooth:true,'+
			   'data:[10, 132, 40, 180, 440, 20, 10]'+
			'},'+
		   '{'+
				'name:"传感器2",'+
				'type:"line",'+
				'smooth:true,'+
				'data:[220, 182, 191, 234, 290, 330, 310]'+
			'}';
	}else
	{
		$.ajax(//请求设备名
		{
            type:'get',
            async:false,
            url:basePath+'/device/selDeviceInfo',
            data:{
                deviceNumber:deviceid
            },
			success: function(data)
			{
                var json=data.data;
                devicename = json.name;//更新图表名称
			},
			error:function()
			{
				tooltips("请求出错！请联系技术支持","Warning");
				flag=false;
			},
		});
		if(sensorid == undefined)//如果未选择传感器
		{
			sensorname = ["传感器1","传感器2"];
			sensortime = "['08-01','08-02','08-03','08-04','08-05','08-06','08-07']";
			series = 
				'{'+
				   'name:"传感器1",'+
				   'type:"line",'+
				   'smooth:true,'+
				   'data:[10, 132, 40, 180, 440, 20, 10]'+
				'},'+
			   '{'+
					'name:"传感器2",'+
					'type:"line",'+
					'smooth:true,'+
					'data:[220, 182, 191, 234, 290, 330, 310]'+
				'}';
		}else
		{
			sensortime = 'time'+ID;//定义时间轴变量
			var arrsensorid = [sensorid].toString().split(',');//格式化传感器数组
			for(var a=0;a<arrsensorid.length;a++)
			{
				$.ajax(//请求传感器名
				{
                    type:'GET',
                    async:false,
                    url:basePath+'/sensor/selTypeList',		//根据设备ID查传感器
                    dataType: 'json',
                    data:{
                        deviceNumber:deviceid
                    },
					success: function(data)
					{
                        if(data.state=="success"){
                            for(var j=0;j<data.datas.length;j++){
                                if(data.datas[j].id==arrsensorid[a]){
                                    sensorname.push(a+data.datas[j].sensorName);//更新传感器名称
                                    series.push(//更新数据轴
                                        '{'+
                                        'name:"'+a+data.datas[j].sensorName+'",'+
                                        'type:"line",'+
                                        'data:data'+ID+a+
                                        '}');
                                    newseries.push('{'+//定义实时更新数据轴变量
                                        'data:data'+ID+a+
                                        '}');
                                    arrdata.push('var data'+ID+a+' = [];');//定义数据轴变量
                                    updatedata.push('data'+ID+a+'=cdData['+a+'];');//定义数据轴数组下标变量
                                    ifupdatedata.push('if(cdData['+a+'] !== " "){data'+ID+a+'=cdData['+a+'];}else{data'+ID+a+'=data'+ID+a+'[data'+ID+a+'.length-1]}');
                                    break;
                                }
                            }
                        }
					},
					error:function()
					{
						tooltips("请求出错！请联系技术支持","Warning");
						flag=false;
					},
				});
			}
		}
	}
	//定义JS模板
	var jsTMP = arrdata.join("")+//定义数据轴数组
	'var time'+ID+'= [];'+//定义时间轴数组
	'function new'+ID+'(id,data,time)'+
	'{'+
		'var myChart = echarts.init(document.getElementById("'+ID+'"));'+//初始化echarts实例
		'if(data == undefined)'+
		'{'+
			'var option  = '+
			'{'+
				'title:{text:"'+devicename+'",textStyle:{fontSize:"14",color:"'+idColorRgb+'"}},'+//设备名称
				'tooltip:{trigger:"axis"},'+
				'legend:{data:["'+sensorname.join('","')+'"],right:"5%",textStyle:{color:"'+ idColorRgb +'"}},'+//传感器名称
				'grid:{left:"3%",right:"4%",bottom:"50px",containLabel:true},'+
				'toolbox:{feature:{saveAsImage:{}}},'+
				'xAxis:{type:"category",boundaryGap:false,data:'+sensortime+',axisLine:{lineStyle:{color:"'+idColorRgb+'"}}},'+
				'yAxis:[{type:"value",min:"dataMin",max:"dataMax",axisLine:{lineStyle:{color:"'+idColorRgb+'"},formatter:function(value, index){return toDecimal(value,4);}}}],'+
				'dataZoom:[{startValue:null},{type:"inside"}],'+
				'series:['+series+']'+
			'};'+
			'myChart.setOption(option);'+
		'}else'+
		'{'+
			'if(time != undefined)'+
			'{'+
				'var cdData	 = data;'+//定义实时更新数据轴
				'if(data'+ID+'0.length > 0)'+
				'{'+
					ifupdatedata.join("")+
				'}else'+
				'{'+
					updatedata.join("")+
				'}'+
				'var newTime = time;'+//定义时间轴
                   'time'+ID+'=newTime;'+
				'myChart.setOption({'+
					'xAxis:{data:'+sensortime+'},'+
				   ' series:['+newseries+']'+
			   '});'+
		   '}'+   
		'}'+
	'}';
	return jsTMP;
}
//复合曲线图
function jsTemp03(id)
{
	var deviceid   = id.attr("deviceid");//获取设备ID
	var sensorid   = id.attr("sensorid");//获取传感器ID
	var ID         = id.children(".myECharts").attr("id");//获取图表ID
	var devicename;//定义曲线图名称
	var sensorname = [];//定义曲线传感器名称
	var sensortime = [];//定义时间轴
	var series     = [];//定义数据轴
	var newseries  = [];//定义实时更新数据轴变量
	var arrdata    = [];//定义更新数组
	var updatedata = [];//定义数据轴数组下标变量
	var ifupdatedata = [];//定义判断类型数据数轴
    var idColorRgb = id.attr("colorrgb");
	if(deviceid == undefined || deviceid == -1)//如果未选择设备则初始化默认
	{
		devicename = "复合曲线图";
		sensorname = ["传感器1","传感器2","传感器3"];
		sensortime = "['08-01','08-02','08-03','08-04','08-05','08-06','08-07']";
		series = 
			'{'+
			   'name:"传感器1",'+
			   'type:"line",'+
			   'smooth:true,'+
			   'data:[10, 132, 40, 180, 440, 20, 10]'+
			'},'+
		   '{'+
				'name:"传感器2",'+
				'type:"line",'+
				'smooth:true,'+
				'data:[220, 182, 191, 234, 290, 330, 310]'+
			'},'+
			'{'+
			   'name:"传感器3",'+
			   'type:"line",'+
			   'smooth:true,'+
			   'data:[150, 232, 201, 154, 190, 330, 410]'+
			'}';
	}else
	{
		$.ajax(//请求设备名
		{
            type:'get',
            async:false,
            url:basePath+'/device/selDeviceInfo',
            data:{
                deviceNumber:deviceid
            },
			success: function(data)
			{
                var json=data.data;
                devicename = json.name;//更新图表名称
			},
			error:function()
			{
				tooltips("请求出错！请联系技术支持","Warning");
				flag=false;
			},
		});
		if(sensorid == undefined)//如果未选择传感器
		{
			sensorname = ["传感器1","传感器2","传感器3"];
			sensortime = "['08-01','08-02','08-03','08-04','08-05','08-06','08-07']";
			series = 
				'{'+
				   'name:"传感器1",'+
				   'type:"line",'+
				   'smooth:true,'+
				   'data:[10, 132, 40, 180, 440, 20, 10]'+
				'},'+
			   '{'+
					'name:"传感器2",'+
					'type:"line",'+
					'smooth:true,'+
					'data:[220, 182, 191, 234, 290, 330, 310]'+
				'},'+
				'{'+
				   'name:"传感器3",'+
				   'type:"line",'+
				   'smooth:true,'+
				   'data:[150, 232, 201, 154, 190, 330, 410]'+
				'}';
		}else
		{
			sensortime = 'time'+ID;//定义时间轴变量
			var arrsensorid = [sensorid].toString().split(',');//格式化传感器数组
			for(var a=0;a<arrsensorid.length;a++)
			{
				$.ajax(//请求传感器名
				{
                    type:'GET',
                    async:false,
                    url:basePath+'/sensor/selTypeList',		//根据设备ID查传感器
                    dataType: 'json',
                    data:{
                        deviceNumber:deviceid
                    },
					success: function(data)
					{
                        if(data.state=="success"){
                            for(var j=0;j<data.datas.length;j++){
                                if(data.datas[j].id==arrsensorid[a]){
                                    sensorname.push(a+data.datas[j].sensorName);//更新传感器名称
                                    series.push(//更新数据轴
                                        '{'+
                                        'name:"'+a+data.datas[j].sensorName+'",'+
                                        'type:"line",'+
                                        'data:data'+ID+a+
                                        '}');
                                    newseries.push('{'+//定义实时更新数据轴变量
                                        'data:data'+ID+a+
                                        ',smooth:true}');
                                    arrdata.push('var data'+ID+a+' = [];');//定义数据轴变量
                                    updatedata.push('data'+ID+a+'=cdData['+a+'];');//定义数据轴数组下标变量
                                    ifupdatedata.push('if(cdData['+a+'] !== " "){data'+ID+a+'=cdData['+a+'];}else{data'+ID+a+'=data'+ID+a+'[data'+ID+a+'.length-1]}');
                                    break;
                                }
                            }
                        }
					},
					error:function()
					{
						tooltips("请求出错！请联系技术支持","Warning");
						flag=false;
					},
				});
			}
		}
	}
	//定义JS模板
	var jsTMP = arrdata.join("")+//定义数据轴数组
	'var time'+ID+'= [];'+//定义时间轴数组
	'function new'+ID+'(id,data,time)'+
	'{'+
		'var myChart = echarts.init(document.getElementById("'+ID+'"));'+//初始化echarts实例
		'if(data == undefined)'+
		'{'+
			'var option  = '+
			'{'+
				'title:{text:"'+devicename+'",textStyle:{fontSize:"14",color:"'+idColorRgb+'"}},'+//设备名称
				'tooltip:{trigger:"axis"},'+
				'legend:{data:["'+sensorname.join('","')+'"],right:"5%",textStyle:{color:"'+ idColorRgb +'"}},'+//传感器名称
				'grid:{left:"3%",right:"4%",bottom:"3%",containLabel:true},'+
				'toolbox:{feature:{saveAsImage:{}}},'+
				'xAxis:{type:"category",boundaryGap:false,data:'+sensortime+',axisLine:{lineStyle:{color:"'+idColorRgb+'"}}},'+
				'yAxis:[{type:"value",min:"dataMin",max:"dataMax",axisLine:{lineStyle:{color:"'+idColorRgb+'"},formatter:function(value, index){return toDecimal(value,4);}}}],'+
				'series:['+series+']'+
			'};'+
			'myChart.setOption(option);'+
		'}else'+
		'{'+
			'if(time != undefined)'+
			'{'+
				'var cdData	 = data;'+//定义实时更新数据轴
				'if(data'+ID+'0.length > 0)'+
				'{'+
					ifupdatedata.join("")+
				'}else'+
				'{'+
					updatedata.join("")+
				'}'+
				'var newTime = time;'+//定义时间轴
                 'time'+ID+'=newTime;'+
				'myChart.setOption({'+
					'xAxis:{data:'+sensortime+'},'+
				   ' series:['+newseries+']'+
			   '});'+
		   '}'+
		'}'+
	'}';
	return jsTMP;
}
//实时曲线图
function jsTemp04(id)
{
	var deviceid   = id.attr("deviceid");//获取设备ID
	var sensorid   = id.attr("sensorid");//获取传感器ID
	var ID         = id.children(".myECharts").attr("id");//获取图表ID
	var devicename;//定义曲线图名称
	var sensorname = [];//定义曲线传感器名称
	var sensortime = [];//定义时间轴
	var series     = [];//定义数据轴
	var newseries  = [];//定义实时更新数据轴变量
	var arrdata    = [];//定义更新数组
	var updatedata = [];//定义数据轴数组下标变量
	var ifupdatedata = [];//定义判断类型数据数轴
    var idColorRgb = id.attr("colorrgb");
	if(deviceid == undefined || deviceid == -1)//如果未选择设备则初始化默认
	{
		devicename = "实时曲线图";
		sensorname = ["传感器"];
		sensortime = "['08-01','08-02','08-03','08-04','08-05','08-06','08-07']";
		series = 
			'{'+
			   'name:"传感器",'+
			   'type:"line",'+
			   'smooth:true,'+
			   'data:[10, 132, 40, 180, 440, 20, 10]'+
			'}';
	}else
	{
		$.ajax(//请求设备名
		{
            type:'get',
            async:false,
            url:basePath+'/device/selDeviceInfo',
            data:{
                deviceNumber:deviceid
            },
			success: function(data)
			{
                var json=data.data;
                devicename = json.name;//更新图表名称
			},
			error:function()
			{
				tooltips("请求出错！请联系技术支持","Warning");
				flag=false;
			},
		});
		if(sensorid == undefined)//如果未选择传感器
		{
			sensorname = ["传感器"];
			sensortime = "['08-01','08-02','08-03','08-04','08-05','08-06','08-07']";
			series = 
				'{'+
				   'name:"传感器",'+
				   'type:"line",'+
				   'smooth:true,'+
				   'data:[10, 132, 40, 180, 440, 20, 10]'+
				'}';
		}else
		{
			sensortime = 'time'+ID;//定义时间轴变量
			var arrsensorid = [sensorid].toString().split(',');//格式化传感器数组
			for(var a=0;a<arrsensorid.length;a++)
			{
				$.ajax(//请求传感器名
				{
                    type:'GET',
                    async:false,
                    url:basePath+'/sensor/selTypeList',		//根据设备ID查传感器
                    dataType: 'json',
                    data:{
                        deviceNumber:deviceid
                    },
					success: function(data)
					{
                        if(data.state=="success"){
                            for(var j=0;j<data.datas.length;j++){
                                if(data.datas[j].id==arrsensorid[a]){
                                    sensorname.push(a+data.datas[j].sensorName);//更新传感器名称
                                    series.push(//更新数据轴
                                        '{'+
                                        'name:"'+a+data.datas[j].sensorName+'",'+
                                        'type:"line",'+
                                        'data:data'+ID+a+
                                        '}');
                                    newseries.push('{'+//定义实时更新数据轴变量
                                        'data:data'+ID+a+
                                        '}');
                                    arrdata.push('var data'+ID+a+' = [];');//定义数据轴变量
                                    updatedata.push('data'+ID+a+'=cdData['+a+'];');//定义数据轴数组下标变量
                                    ifupdatedata.push('if(cdData['+a+'] !== " "){data'+ID+a+'=cdData['+a+'];}else{data'+ID+a+'=data'+ID+a+'[data'+ID+a+'.length-1]}');
                                    break;
                                }
                            }
                        }
					},
					error:function()
					{
						tooltips("请求出错！请联系技术支持","Warning");
						flag=false;
					},
				});
			}
		}
	}
	//定义JS模板
	var jsTMP = arrdata.join("")+//定义数据轴数组
	'var time'+ID+'= [];'+//定义时间轴数组
	'function new'+ID+'(id,data,time)'+
	'{'+
		'var myChart = echarts.init(document.getElementById("'+ID+'"));'+//初始化echarts实例
		'if(data == undefined)'+
		'{'+
			'var option  = '+
			'{'+
				'title:{text:"'+devicename+'",textStyle:{fontSize:"14",color:"'+idColorRgb+'"}},'+//设备名称
				'tooltip:{trigger:"axis"},'+
				'legend:{data:["'+sensorname.join('","')+'"],right:"5%",textStyle:{color:"'+ idColorRgb +'"}},'+//传感器名称
				'grid:{left:"3%",right:"4%",bottom:"3%",containLabel:true},'+
				'toolbox:{feature:{saveAsImage:{}}},'+
				'xAxis:{type:"category",boundaryGap:false,data:'+sensortime+',axisLine:{lineStyle:{color:"'+idColorRgb+'"}}},'+
				'yAxis:[{type:"value",min:"dataMin",max:"dataMax",axisLine:{lineStyle:{color:"'+idColorRgb+'"},formatter:function(value, index){return toDecimal(value,4);}}}],'+
				'series:['+series+']'+
			'};'+
			'myChart.setOption(option);'+
		'}else'+
		'{'+
			'if(time != undefined)'+
			'{'+
				'var cdData	 = data;'+//定义实时更新数据轴
				'if(data'+ID+'0.length > 0)'+
				'{'+
					ifupdatedata.join("")+
				'}else'+
				'{'+
					updatedata.join("")+
				'}'+
				'var newTime = time;'+//定义时间轴
                  'time'+ID+'=newTime;'+
				'myChart.setOption({'+
					'xAxis:{data:'+sensortime+'},'+
				   ' series:['+newseries+']'+
			   '});'+
		   '}'+
		'}'+
	'}';
	return jsTMP;
}
//时间折线图
function jsTemp05(id)
{
	var deviceid   = id.attr("deviceid");//获取设备ID
	var sensorid   = id.attr("sensorid");//获取传感器ID
	var ID         = id.children(".myECharts").attr("id");//获取图表ID
	var devicename;//定义曲线图名称
	var sensorname = [];//定义曲线传感器名称
	var sensortime = [];//定义时间轴
	var series     = [];//定义数据轴
	var newseries  = [];//定义实时更新数据轴变量
	var arrdata    = [];//定义更新数组
	var updatedata = [];//定义数据轴数组下标变量
	var ifupdatedata = [];//定义判断类型数据数轴
    var idColorRgb = id.attr("colorrgb");

    if(deviceid == undefined || deviceid == -1)//如果未选择设备则初始化默认
	{
		devicename = "时间折线图";
		sensorname = ["传感器"];
			sensortime = "['08-01','08-02','08-03','08-04','08-05','08-06','08-07']";
			series = 
				'{'+
				   'name:"传感器",'+
				   'type:"line",'+
				   'data:[10, 132, 40, 180, 440, 20, 10],'+
				   'areaStyle:{}'+
				'}';
	}else
	{
		$.ajax(//请求设备名
		{
            type:'get',
            async:false,
            url:basePath+'/device/selDeviceInfo',
            data:{
                deviceNumber:deviceid
            },
			success: function(data)
			{
                var json=data.data;
                devicename = json.name;//更新图表名称
			},
			error:function()
			{
				tooltips("请求出错！请联系技术支持","Warning");
				flag=false;
			},
		});
		if(sensorid == undefined)//如果未选择传感器
		{
			sensorname = ["传感器"];
			sensortime = "['08-01','08-02','08-03','08-04','08-05','08-06','08-07']";
			series = 
				'{'+
				   'name:"传感器",'+
				   'type:"line",'+
				   'data:[10, 132, 40, 180, 440, 20, 10],'+
				   'areaStyle:{}'+
				'}';
		}else
		{
			sensortime = 'time'+ID;//定义时间轴变量
			var arrsensorid = [sensorid].toString().split(',');//格式化传感器数组
			for(var a=0;a<arrsensorid.length;a++)
			{
				$.ajax(//请求传感器名
				{
                    type:'GET',
                    async:false,
                    url:basePath+'/sensor/selTypeList',		//根据设备ID查传感器
                    dataType: 'json',
                    data:{
                        deviceNumber:deviceid
                    },
					success: function(data)
					{
                        if(data.state=="success"){
                            for(var j=0;j<data.datas.length;j++){
                                if(data.datas[j].id==arrsensorid[a]){
                                    sensorname.push(a+data.datas[j].sensorName);//更新传感器名称
                                    series.push(//更新数据轴
                                        '{'+
                                        'name:"'+a+data.datas[j].sensorName+'",'+
                                        'type:"line",'+
                                        'data:data'+ID+a+
                                        '}');
                                    newseries.push('{'+//定义实时更新数据轴变量
                                        'data:data'+ID+a+
                                        ',areaStyle:{}}');
                                    arrdata.push('var data'+ID+a+' = [];');//定义数据轴变量
                                    updatedata.push('data'+ID+a+'=cdData['+a+'];');//定义数据轴数组下标变量
                                    ifupdatedata.push('if(cdData['+a+'] !== " "){data'+ID+a+'=cdData['+a+'];}else{data'+ID+a+'=data'+ID+a+'[data'+ID+a+'.length-1]}');
                                    break;
                                }
                            }
                        }
					},
					error:function()
					{
						tooltips("请求出错！请联系技术支持","Warning");
						flag=false;
					},
				});
			}
		}
	}
	//定义JS模板
	var jsTMP = arrdata.join("")+//定义数据轴数组
	'var time'+ID+'= [];'+//定义时间轴数组
	'function new'+ID+'(id,data,time)'+
	'{'+
		'var myChart = echarts.init(document.getElementById("'+ID+'"));'+//初始化echarts实例
		'if(data == undefined)'+
		'{'+
			'var option  = '+
			'{'+
				'title:{text:"'+devicename+'",textStyle:{fontSize:"14",color:"'+idColorRgb+'"}},'+//设备名称
				'tooltip:{trigger:"axis"},'+
				'legend:{data:["'+sensorname.join('","')+'"],right:"5%",textStyle:{color:"'+ idColorRgb +'"}},'+//传感器名称
				'grid:{left:"3%",right:"4%",bottom:"3%",containLabel:true},'+
				'toolbox:{feature:{saveAsImage:{}}},'+
				'xAxis:{type:"category",boundaryGap:false,data:'+sensortime+',axisLine:{lineStyle:{color:"'+idColorRgb+'"}}},'+
				'yAxis:[{type:"value",min:"dataMin",max:"dataMax",axisLine:{lineStyle:{color:"'+idColorRgb+'"},formatter:function(value, index){return toDecimal(value,4);}}}],'+
				'series:['+series+']'+
			'};'+
			'myChart.setOption(option);'+
		'}else'+
		'{'+
			'if(time != undefined)'+
			'{'+
				'var cdData	 = data;'+//定义实时更新数据轴
				'if(data'+ID+'0.length > 0)'+
				'{'+
					ifupdatedata.join("")+
				'}else'+
				'{'+
					updatedata.join("")+
				'}'+
				'var newTime = time;'+//定义时间轴
				'time'+ID+'=newTime;'+
				'myChart.setOption({'+
					'xAxis:{data:'+sensortime+'},'+
				   ' series:['+newseries+']'+
			   '});'+
		   '}'+
		'}'+
	'}';
	return jsTMP;
}
//区域曲线图
function jsTemp06(id)
{
	var deviceid   = id.attr("deviceid");//获取设备ID
	var sensorid   = id.attr("sensorid");//获取传感器ID
	var ID         = id.children(".myECharts").attr("id");//获取图表ID
	var devicename;//定义曲线图名称
	var sensorname = [];//定义曲线传感器名称
	var sensortime = [];//定义时间轴
	var series     = [];//定义数据轴
	var newseries  = [];//定义实时更新数据轴变量
	var arrdata    = [];//定义更新数组
	var updatedata = [];//定义数据轴数组下标变量
	var ifupdatedata = [];//定义判断类型数据数轴
    var idColorRgb = id.attr("colorrgb");
    if(deviceid == undefined || deviceid == -1)//如果未选择设备则初始化默认
	{
		devicename = "区域曲线图";
		sensorname = ["传感器1","传感器2","传感器3"];
		sensortime = "['08-01','08-02','08-03','08-04','08-05','08-06','08-07']";
		series = 
			'{'+
			   'name:"传感器1",'+
			   'type:"line",'+
			   'smooth:true,'+
			   'areaStyle:{},'+
			   'data:[10, 132, 40, 180, 440, 20, 10]'+
			'},'+
		   '{'+
				'name:"传感器2",'+
				'type:"line",'+
				'smooth:true,'+
				'areaStyle:{},'+
				'data:[220, 182, 191, 234, 290, 330, 310]'+
			'},'+
			'{'+
			   'name:"传感器3",'+
			   'type:"line",'+
			   'smooth:true,'+
			   'areaStyle:{},'+
			   'data:[150, 232, 201, 154, 190, 330, 410]'+
			'}';
	}else
	{
		$.ajax(//请求设备名
		{
            type:'get',
            async:false,
            url:basePath+'/device/selDeviceInfo',
            data:{
                deviceNumber:deviceid
            },
            success: function(data)
            {
                var json=data.data;
                devicename = json.name;//更新图表名称
            },
			error:function()
			{
				tooltips("请求出错！请联系技术支持","Warning");
				flag=false;
			},
		});
		if(sensorid == undefined)//如果未选择传感器
		{
			sensorname = ["传感器1","传感器2","传感器3"];
			sensortime = "['08-01','08-02','08-03','08-04','08-05','08-06','08-07']";
			series = 
				'{'+
				   'name:"传感器1",'+
				   'type:"line",'+
				   'smooth:true,'+
				   'areaStyle:{},'+
				   'data:[10, 132, 40, 180, 440, 20, 10]'+
				'},'+
			   '{'+
					'name:"传感器2",'+
					'type:"line",'+
					'smooth:true,'+
					'areaStyle:{},'+
					'data:[220, 182, 191, 234, 290, 330, 310]'+
				'},'+
				'{'+
				   'name:"传感器3",'+
				   'type:"line",'+
				   'smooth:true,'+
				   'areaStyle:{},'+
				   'data:[150, 232, 201, 154, 190, 330, 410]'+
				'}';
		}else
		{
			sensortime = 'time'+ID;//定义时间轴变量
			var arrsensorid = [sensorid].toString().split(',');//格式化传感器数组
			for(var a=0;a<arrsensorid.length;a++)
			{
				$.ajax(//请求传感器名
				{
                    type:'GET',
                    async:false,
                    url:basePath+'/sensor/selTypeList',		//根据设备ID查传感器
                    dataType: 'json',
                    data:{
                        deviceNumber:deviceid
                    },
					success: function(data)
					{
                        if(data.state=="success"){
                            for(var j=0;j<data.datas.length;j++){
                                if(data.datas[j].id==arrsensorid[a]){
                                    sensorname.push(a+data.datas[j].sensorName);//更新传感器名称
                                    series.push(//更新数据轴
                                        '{'+
                                        'name:"'+a+data.datas[j].sensorName+'",'+
                                        'type:"line",'+
                                        'data:data'+ID+a+
                                        ',areaStyle:{}}');
                                    newseries.push('{'+//定义实时更新数据轴变量
                                        'data:data'+ID+a+
                                        '}');
                                    arrdata.push('var data'+ID+a+' = [];');//定义数据轴变量
                                    updatedata.push('data'+ID+a+'=cdData['+a+'];');//定义数据轴数组下标变量
                                    ifupdatedata.push('if(cdData['+a+'] !== " "){data'+ID+a+'=cdData['+a+'];}else{data'+ID+a+'=data'+ID+a+'[data'+ID+a+'.length-1]}');
                                    break;
                                }
                            }
                        }
					},
					error:function()
					{
						tooltips("请求出错！请联系技术支持","Warning");
						flag=false;
					},
				});
			}
		}
	}
	//定义JS模板
	var jsTMP = arrdata.join("")+//定义数据轴数组
	'var time'+ID+'= [];'+//定义时间轴数组
	'function new'+ID+'(id,data,time)'+
	'{'+
		'var myChart = echarts.init(document.getElementById("'+ID+'"));'+//初始化echarts实例
		'if(data == undefined)'+
		'{'+
			'var option  = '+
			'{'+
				'title:{text:"'+devicename+'",textStyle:{fontSize:"14",color:"'+idColorRgb+'"}},'+//设备名称
				'tooltip:{trigger:"axis"},'+
				'legend:{data:["'+sensorname.join('","')+'"],right:"5%",textStyle:{color:"'+ idColorRgb +'"}},'+//传感器名称
				'grid:{left:"3%",right:"4%",bottom:"3%",containLabel:true},'+
				'toolbox:{feature:{saveAsImage:{}}},'+
				'xAxis:{type:"category",boundaryGap:false,data:'+sensortime+',axisLine:{lineStyle:{color:"'+idColorRgb+'"}}},'+
				'yAxis:[{type:"value",min:"dataMin",max:"dataMax",axisLine:{lineStyle:{color:"'+idColorRgb+'"},formatter:function(value, index){return toDecimal(value,4);}}}],'+
				'series:['+series+']'+
			'};'+
			'myChart.setOption(option);'+
		'}else'+
		'{'+
			'if(time != undefined)'+
			'{'+
				'var cdData	 = data;'+//定义实时更新数据轴
				'if(data'+ID+'0.length > 0)'+
				'{'+
					ifupdatedata.join("")+
				'}else'+
				'{'+
					updatedata.join("")+
				'}'+
				'var newTime = time;'+//定义时间轴
                   'time'+ID+'=newTime;'+
				'myChart.setOption({'+
					'xAxis:{data:'+sensortime+'},'+
				   ' series:['+newseries+']'+
			   '});'+
		   '}'+
		'}'+
	'}';
	return jsTMP;
}
//堆叠面积图
function jsTemp07(id)
{
	var deviceid   = id.attr("deviceid");//获取设备ID
	var sensorid   = id.attr("sensorid");//获取传感器ID
	var ID         = id.children(".myECharts").attr("id");//获取图表ID
	var devicename;//定义曲线图名称
	var sensorname = [];//定义曲线传感器名称
	var sensortime = [];//定义时间轴
	var series     = [];//定义数据轴
	var newseries  = [];//定义实时更新数据轴变量
	var arrdata    = [];//定义更新数组
	var updatedata = [];//定义数据轴数组下标变量
	var ifupdatedata = [];//定义判断类型数据数轴
    var idColorRgb = id.attr("colorrgb");
    if(deviceid == undefined || deviceid == -1)//如果未选择设备则初始化默认
	{
		devicename = "堆叠面积图";
		sensorname = ["传感器1","传感器2","传感器3"];
		sensortime = "['08-01','08-02','08-03','08-04','08-05','08-06','08-07']";
		series = 
			'{'+
			   'name:"传感器1",'+
			   'type:"line",'+
			   'stack: "总量",'+
			   'smooth:true,'+
			   'areaStyle:{normal:{}},'+
			   'data:[10, 132, 40, 180, 440, 20, 10]'+
			'},'+
		   '{'+
				'name:"传感器2",'+
				'type:"line",'+
				'stack:" 总量",'+
				'smooth:true,'+
				'areaStyle:{normal:{}},'+
				'data:[220, 182, 191, 234, 290, 330, 310]'+
			'},'+
			'{'+
			   'name:"传感器3",'+
			   'type:"line",'+
			   'stack:"总量",'+
			   'smooth:true,'+
			   'label:{normal:{show:true,position:"top"}},'+
			   'areaStyle:{normal:{}},'+
			   'data:[150, 232, 201, 154, 190, 330, 410]'+
			'}';
	}else
	{
		$.ajax(//请求设备名
		{
            type:'get',
            async:false,
            url:basePath+'/device/selDeviceInfo',
            data:{
                deviceNumber:deviceid
            },
            success: function(data)
            {
                var json=data.data;
                devicename = json.name;//更新图表名称
            },
			error:function()
			{
				tooltips("请求出错！请联系技术支持","Warning");
				flag=false;
			},
		});
		if(sensorid == undefined)//如果未选择传感器
		{
			sensorname = ["传感器1","传感器2","传感器3"];
			sensortime = "['08-01','08-02','08-03','08-04','08-05','08-06','08-07']";
			series = 
				'{'+
				   'name:"传感器1",'+
				   'type:"line",'+
				   'stack: "总量",'+
				   'smooth:true,'+
				   'areaStyle:{normal:{}},'+
				   'data:[10, 132, 40, 180, 440, 20, 10]'+
				'},'+
			   '{'+
					'name:"传感器2",'+
					'type:"line",'+
					'stack:" 总量",'+
					'smooth:true,'+
					'areaStyle:{normal:{}},'+
					'data:[220, 182, 191, 234, 290, 330, 310]'+
				'},'+
				'{'+
				   'name:"传感器3",'+
				   'type:"line",'+
				   'stack:"总量",'+
				   'smooth:true,'+
				   'label:{normal:{show:true,position:"top"}},'+
				   'areaStyle:{normal:{}},'+
				   'data:[150, 232, 201, 154, 190, 330, 410]'+
				'}';
		}else
		{
			sensortime = 'time'+ID;//定义时间轴变量
			var arrsensorid = [sensorid].toString().split(',');//格式化传感器数组
			var mianji = "";
			for(var a=0;a<arrsensorid.length;a++)
			{
				if((a+1)== arrsensorid.length)
				{
					mianji = 'label:{normal:{show:true,position:"top"}},'
				}
				$.ajax(//请求传感器名
				{
                    type:'GET',
                    async:false,
                    url:basePath+'/sensor/selTypeList',		//根据设备ID查传感器
                    dataType: 'json',
                    data:{
                        deviceNumber:deviceid
                    },
					success: function(data)
					{
                        if(data.state=="success"){
                            for(var j=0;j<data.datas.length;j++){
                                if(data.datas[j].id==arrsensorid[a]){
                                    sensorname.push(a+data.datas[j].sensorName);//更新传感器名称
                                    series.push(//更新数据轴
                                        '{'+
                                        'name:"'+a+data.datas[j].sensorName+'",'+
                                        'type:"line",'+
                                        'data:data'+ID+a+
                                        '}');
                                    newseries.push('{'+//定义实时更新数据轴变量
                                        'data:data'+ID+a+
                                        ',areaStyle:{}}');
                                    arrdata.push('var data'+ID+a+' = [];');//定义数据轴变量
                                    updatedata.push('data'+ID+a+'=cdData['+a+'];');//定义数据轴数组下标变量
                                    ifupdatedata.push('if(cdData['+a+'] !== " "){data'+ID+a+'=cdData['+a+'];}else{data'+ID+a+'=data'+ID+a+'[data'+ID+a+'.length-1]}');
                                    break;
                                }
                            }
                        }
					},
					error:function()
					{
						tooltips("请求出错！请联系技术支持","Warning");
						flag=false;
					},
				});
			}
		}
	}
	//定义JS模板
	var jsTMP = arrdata.join("")+//定义数据轴数组
	'var time'+ID+'= [];'+//定义时间轴数组
	'function new'+ID+'(id,data,time)'+
	'{'+
		'var myChart = echarts.init(document.getElementById("'+ID+'"));'+//初始化echarts实例
		'if(data == undefined)'+
		'{'+
			'var option  = '+
			'{'+
				'title:{text:"'+devicename+'",textStyle:{fontSize:"14",color:"'+idColorRgb+'"}},'+//设备名称
				'tooltip:{trigger:"axis"},'+
				'legend:{data:["'+sensorname.join('","')+'"],right:"5%",textStyle:{color:"'+ idColorRgb +'"}},'+//传感器名称
				'grid:{left:"3%",right:"4%",bottom:"3%",containLabel:true},'+
				'toolbox:{feature:{saveAsImage:{}}},'+
				'xAxis:{type:"category",boundaryGap:false,data:'+sensortime+',axisLine:{lineStyle:{color:"'+idColorRgb+'"}}},'+
				'yAxis:[{type:"value",min:"dataMin",max:"dataMax",axisLine:{lineStyle:{color:"'+idColorRgb+'"},formatter:function(value, index){return toDecimal(value,4);}}}],'+
				'series:['+series+']'+
			'};'+
			'myChart.setOption(option);'+
		'}else'+
		'{'+
			'if(time != undefined)'+
			'{'+
				'var cdData	 = data;'+//定义实时更新数据轴
				'if(data'+ID+'0.length > 0)'+
				'{'+
					ifupdatedata.join("")+
				'}else'+
				'{'+
					updatedata.join("")+
				'}'+
				'var newTime = time;'+//定义时间轴
               'time'+ID+'=newTime;'+
				'myChart.setOption({'+
					'xAxis:{data:'+sensortime+'},'+
				   ' series:['+newseries+']'+
			   '});'+
		   '}'+
		'}'+
	'}';
	return jsTMP;
}
//仪表盘1
function jsTemp08(id)
{
	var deviceid   = id.attr("deviceid");//获取设备ID
	var sensorid   = id.attr("sensorid");//获取传感器ID
	var ID         = id.children(".myECharts").attr("id");//获取图表ID
	var sensorname;//定义传感器名称
	var series = [];//定义数据轴
	var min;//最小值
	var max;//最大值
	var val;//计量单位
	var nam;//表盘数据名称
	var num;//表盘刻度的分割段数
	var spl;//分割线之间分割的刻度数
	var tex;//表盘数值字体大小
	var txt;//表盘名字字体大小
	var arrmeter = id.attr("arrmeter");
	if(arrmeter != undefined)
	{
		var arrData = [arrmeter].toString().split(',');
		if(arrData[0] != undefined)
		{
			min = arrData[0];
		}else
		{
			min = 0;
		}
		if(arrData[1] != undefined)
		{
			max = arrData[1];
		}else
		{
			max = 600;
		}
		if(arrData[2] != undefined)
		{
			val = arrData[2];
		}else
		{
			val = "km/h";
		}
		if(arrData[3] != undefined)
		{
			nam = arrData[3];
		}else
		{
			nam = "风速";
		}
		if(arrData[4] != undefined)
		{
			num = arrData[4];
		}else
		{
			num = 10;
		}
		if(arrData[5] != undefined)
		{
			spl = arrData[5];
		}else
		{
			spl = 5;
		}
		if(arrData[6] != undefined)
		{
			tex = arrData[6];
		}else
		{
			tex = 30;
		}
		if(arrData[7] != undefined)
		{
			txt = arrData[7];
		}else
		{
			txt = 16;
		}
		
	}else
	{
		min = 0;
		max = 600;
		val = "km/h";
		nam = "风速";
		num = 10;
		spl = 5;
		tex = 30;
		txt = 16;
	}
	if(deviceid == undefined || deviceid == -1)//如果未选择设备则初始化默认
	{
		sensorname = "传感器";
		series = 
			'{'+
			   'name:"'+nam+'",'+
			   'type:"gauge",'+
			   'radius:"100%",'+
			   'min:"'+min+'",'+
			   'max:"'+max+'",'+
			   'splitNumber:"'+num+'",'+
			   'title:{fontSize:'+txt+'},'+
			   'axisTick:{splitNumber:"'+spl+'"},'+
			   'detail:{formatter:"{value}'+val+'",fontSize:'+tex+'},'+
			   'data:[{value:150,name:"'+sensorname+'"}]'+
			'},';
	}else
	{
		if(sensorid == undefined)//如果未选择传感器
		{
			sensorname = "传感器";
			series = 
			'{'+
			   'name:"'+nam+'",'+
			   'type:"gauge",'+
			   'radius:"100%",'+
			   'min:"'+min+'",'+
			   'max:"'+max+'",'+
			   'splitNumber:"'+num+'",'+
			   'title:{fontSize:'+txt+'},'+
			   'axisTick:{splitNumber:"'+spl+'"},'+
			   'detail:{formatter:"{value}'+val+'",fontSize:'+tex+'},'+
			   'data:[{value:150,name:"'+sensorname+'"}]'+
			'},';
		}else
		{
			$.ajax(//请求传感器名
			{
                type:'GET',
                async:false,
                url:basePath+'/sensor/selTypeList',		//根据设备ID查传感器
                dataType: 'json',
                data:{
                    deviceNumber:deviceid
                },
				success: function(data)
				{
					var json=$.parseJSON(data);
					sensorname=json.sensorName;//更新传感器名称
					series.push(
							'{'+
							   'name:"'+nam+'",'+
							   'type:"gauge",'+
							   'radius:"100%",'+
							   'min:"'+min+'",'+
							   'max:"'+max+'",'+
							   'splitNumber:"'+num+'",'+
							   'title:{fontSize:'+txt+'},'+
							   'axisTick:{splitNumber:"'+spl+'"},'+
							   'detail:{formatter:"{value}'+val+'",fontSize:'+tex+'},'+
							   'data:[{value:addData,name:"'+sensorname+'"}]'+
							'},');
					
				},
				error:function()
				{
					tooltips("请求出错！请联系技术支持","Warning");
					flag=false;
				},
			});
		}
	}
	//定义JS模板
	var jsTMP = 
	'function new'+ID+'(id,data,time)'+
	'{'+
		'var myChart = echarts.init(document.getElementById("'+ID+'"));'+//初始化echarts实例
		'var addData = data!= undefined?data:0;'+
		'if(data == undefined)'+
		'{'+
			'var option  = '+
			'{'+
				'tooltip:{formatter:"{b}<br/>{a}:{c}'+val+'"},'+
				'series:['+series+']'+
			'};'+
			'myChart.setOption(option);'+
		'}else'+
		'{'+
			'if(time != undefined)'+
			'{'+
				'if(data[0] !== " ")'+
				'{'+
					'myChart.setOption({'+
						'series:[{'+
							'data:[{value:addData,name:"'+sensorname+'"}]'+
						'}]'+
					'});'+
				'}'+
			'}'+
		'}'+
	'}';
	return jsTMP;
}
//仪表盘2
function jsTemp09(id)
{
	var deviceid   = id.attr("deviceid");//获取设备ID
	var sensorid   = id.attr("sensorid");//获取传感器ID
	var ID         = id.children(".myECharts").attr("id");//获取图表ID
	var sensorname;//定义传感器名称
	var series = [];//定义数据轴
	var min;//最小值
	var max;//最大值
	var val;//计量单位
	var nam;//表盘数据名称
	var num;//表盘刻度的分割段数
	var spl;//分割线之间分割的刻度数
	var tex;//表盘数值字体大小
	var txt;//表盘名字字体大小
	var arrmeter = id.attr("arrmeter");
	if(arrmeter != undefined)
	{
		var arrData = [arrmeter].toString().split(',');
		
		min = arrData[0] != undefined?arrData[0]:0;
		if(arrData[0] != undefined)
		{
			min = arrData[0];
		}else
		{
			min = 0;
		}
		if(arrData[1] != undefined)
		{
			max = arrData[1];
		}else
		{
			max = 600;
		}
		if(arrData[2] != undefined)
		{
			val = arrData[2];
		}else
		{
			val = "km/h";
		}
		if(arrData[3] != undefined)
		{
			nam = arrData[3];
		}else
		{
			nam = "风速";
		}
		if(arrData[4] != undefined)
		{
			num = arrData[4];
		}else
		{
			num = 10;
		}
		if(arrData[5] != undefined)
		{
			spl = arrData[5];
		}else
		{
			spl = 5;
		}
		if(arrData[6] != undefined)
		{
			tex = arrData[6];
		}else
		{
			tex = 30;
		}
		if(arrData[7] != undefined)
		{
			txt = arrData[7];
		}else
		{
			txt = 16;
		}
	}else
	{
		min = 0;
		max = 600;
		val = "km/h";
		nam = "风速";
		num = 10;
		spl = 5;
		tex = 30;
		txt = 16;
	}
	if(deviceid == undefined || deviceid == -1)//如果未选择设备则初始化默认
	{
		sensorname = "传感器";
		series = 
			'{'+
			   'name:"'+nam+'",'+
			   'type:"gauge",'+
			   'radius:"100%",'+
			   'min:"'+min+'",'+
			   'max:"'+max+'",'+
			   'splitNumber:'+num+','+
			   'title:{fontSize:'+txt+'},'+
			   'axisLine:{lineStyle:{width:10}},'+
			   'axisTick:{length:15,splitNumber:'+spl+'},'+
			   'splitLine:{length:20,lineStyle:{color:"auto"}},'+'axisLabel:{backgroundColor:"auto",borderRadius:2,color:"#eee",padding:3,textShadowBlur:2,textShadowOffsetX:1,textShadowOffsetY:1,textShadowColor:"#222"},'+
			   'title:{fontWeight:"bolder",fontSize:'+txt+',fontStyle:"italic"},'+
			   'detail:{formatter:"{value}'+val+'",fontSize:'+tex+'},'+
			   'data:[{value:150,name:"'+sensorname+'"}]'+
			'},';
	}else
	{
		if(sensorid == undefined)//如果未选择传感器
		{
			sensorname = "传感器";
			series = 
			'{'+
			   'name:"'+nam+'",'+
			   'type:"gauge",'+
			   'radius:"100%",'+
			   'min:"'+min+'",'+
			   'max:"'+max+'",'+
			   'splitNumber:'+num+','+
			   'title:{fontSize:'+txt+'},'+
			   'axisLine:{lineStyle:{width:10}},'+
			   'axisTick:{length:15,splitNumber:'+spl+'},'+
			   'splitLine:{length:20,lineStyle:{color:"auto"}},'+'axisLabel:{backgroundColor:"auto",borderRadius:2,color:"#eee",padding:3,textShadowBlur:2,textShadowOffsetX:1,textShadowOffsetY:1,textShadowColor:"#222"},'+
			   'title:{fontWeight:"bolder",fontSize:'+txt+',fontStyle:"italic"},'+
			   'detail:{formatter:"{value}'+val+'",fontSize:'+tex+'},'+
			   'data:[{value:150,name:"'+sensorname+'"}]'+
			'},';
		}else
		{
			$.ajax(//请求传感器名
			{
				type:'get',
				async:false,
				url:basePath+'/getSensor/'+sensorid+'.htm',
				success: function(data)
				{
					var json=$.parseJSON(data);
					sensorname=json.sensorName;//更新传感器名称
					series.push(
							'{'+
							   'name:"'+nam+'",'+
							   'type:"gauge",'+
							   'radius:"100%",'+
							   'min:"'+min+'",'+
							   'max:"'+max+'",'+
							   'splitNumber:'+num+','+
							   'axisLine:{lineStyle:{width:10}},'+
							   'axisTick:{length:15,splitNumber:'+spl+'},'+
							   'splitLine:{length:20,lineStyle:{color:"auto"}},'+'axisLabel:{backgroundColor:"auto",borderRadius:2,color:"#eee",padding:3,textShadowBlur:2,textShadowOffsetX:1,textShadowOffsetY:1,textShadowColor:"#222"},'+
							   'title:{fontWeight:"bolder",fontSize:'+txt+',fontStyle:"italic"},'+
							   'detail:{formatter:"{value}'+val+'",fontSize:'+tex+'},'+
							   'data:[{value:addData,name:"'+sensorname+'"}]'+
							'}');
					
				},
				error:function()
				{
					tooltips("请求出错！请联系技术支持","Warning");
					flag=false;
				},
			});
		}
	}
	//定义JS模板
	var jsTMP = 
	'function new'+ID+'(id,data,time)'+
	'{'+
		'var myChart = echarts.init(document.getElementById("'+ID+'"));'+//初始化echarts实例
		'var addData = data!= undefined?data:0;'+
		'if(data == undefined)'+
		'{'+
			'var option  = '+
			'{'+
				'tooltip:{formatter:"{b}<br/>{a}:{c}'+val+'"},'+
				'series:['+series+']'+
			'};'+
			'myChart.setOption(option);'+
		'}else'+
		'{'+
			'if(time != undefined)'+
			'{'+
				'if(data[0] !== " ")'+
				'{'+
					'myChart.setOption({'+
						'series:[{'+
							'data:[{value:addData,name:"'+sensorname+'"}]'+
						'}]'+
					'});'+
				'}'+
			'}'+
		'}'+
	'}';
	return jsTMP;
}
//地图
function jsTemp10(id)
{
	var ID         = id.children(".myECharts").attr("id");//获取图表ID
	var jsTMP='';
	jsTMP+=
		'var map = new BMap.Map("'+ID+'");'+ // 创建Map实例
		'map.setMapStyle({'+
		'styleJson:['+
  		 '{'+
                    '"featureType": "background",'+
                    '"elementType": "all",'+
                    '"stylers": {'+
                              '"color": "#eef1f3ff"'+
                    '}'+
          '},'+
          '{'+
                    '"featureType": "local",'+
                    '"elementType": "all",'+
                    '"stylers": {'+
                              '"color": "#ffffffff"'+
                    '}'+
          '},'+
          '{'+
                    '"featureType": "administrative",'+
                    '"elementType": "labels.text.stroke",'+
                    '"stylers": {'+
                              '"lightness": 100'+
                    '}'+
          '},'+
          '{'+
                    '"featureType": "highway",'+
                    '"elementType": "geometry",'+
                    '"stylers": {'+
                              '"color": "#f1c232ff",'+
                              '"weight": "0.1"'+
                    '}'+
          '},'+
          '{'+
                    '"featureType": "subway",'+
                    '"elementType": "geometry",'+
                    '"stylers": {'+
                              '"color": "#b6d7a8ff",'+
                              '"weight": "0.1",'+
                              '"lightness": 50'+
                    '}'+
          '},'+
          '{'+
                    '"featureType": "subway",'+
                    '"elementType": "geometry",'+
                    '"stylers": {'+
                              '"color": "#6aa84fff",'+
                              '"weight": "0.3"'+
                    '}'+
          '},'+
          '{'+
                    '"featureType": "water",'+
                    '"elementType": "all",'+
                    '"stylers": {'+
                              '"color": "#cfe2f3ff"'+
                    '}'+
          '},'+
          '{'+
                    '"featureType": "green",'+
                    '"elementType": "all",'+
                    '"stylers": {'+
                              '"color": "#6aa84fff",'+
                              '"lightness": 60'+
                    '}'+
          '},'+
          '{'+
                    '"featureType": "land",'+
                    '"elementType": "all",'+
                    '"stylers": {'+
                              '"lightness": 30'+
                    '}'+
          '},'+
          '{'+
                    '"featureType": "building",'+
                    '"elementType": "all",'+
                    '"stylers": {}'+
          '},'+
          '{'+
                    '"featureType": "arterial",'+
                    '"elementType": "all",'+
                    '"stylers": {'+
                              '"color": "#ffd966ff",'+
                              '"weight": "0.1",'+
                              '"lightness": 50'+
                    '}'+
          '}'+
']'+
	'});'+
	    'var point1 = new BMap.Point(113.855412, 22.605802);'+ //地图中心点
	    'map.centerAndZoom(point1, 6);'+ // 初始化地图,设置中心点坐标和地图级别。
	    'map.enableScrollWheelZoom(true);'+ //启用滚轮放大缩小
	    //地图、卫星、混合模式切换
	    'map.addControl(new BMap.MapTypeControl({'+
	        'mapTypes: [BMAP_NORMAL_MAP, BMAP_SATELLITE_MAP, BMAP_HYBRID_MAP]'+
	    '}));'+
	   
	    //向地图中添加缩放控件
	    'var ctrlNav = new window.BMap.NavigationControl({'+
	        'anchor: BMAP_ANCHOR_TOP_LEFT,'+
	        'type: BMAP_NAVIGATION_CONTROL_LARGE'+
	    '});'+
	    'map.addControl(ctrlNav);'+
	    //向地图中添加缩略图控件
	    
	    'var ctrlOve = new window.BMap.OverviewMapControl({'+
	        'anchor: BMAP_ANCHOR_BOTTOM_RIGHT,'+
	        'isOpen: 1'+
	    '});'+
	    'map.addControl(ctrlOve);'+
	    //向地图中添加比例尺控件
	    'var ctrlSca = new window.BMap.ScaleControl({'+
	        'anchor: BMAP_ANCHOR_BOTTOM_LEFT'+
	    '});'+
	    'map.addControl(ctrlSca);'
	return jsTMP;	
}
//分辨带曲线图
function jsTemp11(id)
{
	var deviceid   = id.attr("deviceid");//获取设备ID
	var sensorid   = id.attr("sensorid");//获取传感器ID
	var ID         = id.children(".myECharts").attr("id");//获取图表ID
	var devicename;//定义曲线图名称
	var sensorname = [];//定义曲线传感器名称
	var sensortime = [];//定义时间轴
	var series     = [];//定义数据轴
	var newseries  = [];//定义实时更新数据轴变量
	var arrdata    = [];//定义更新数组
	var updatedata = [];//定义数据轴数组下标变量
	var pxcolor    =  id.attr("pxcolor");
	var pieces     =  [];
	var markLine   =  [];
	var ifupdatedata = [];//定义判断类型数据数轴
    var idColorRgb = id.attr("colorrgb");
	if(pxcolor == undefined || pxcolor == "" || pxcolor == null)
	{
		pieces = '{gt:0,lte:50,color:"#096"},{gt:50,lte:100,color:"#ffde33"},{gt:100,lte:150,color:"#ff9933"},{gt:150,lte:200,color:"#cc0033"},{gt:200,lte:300,color:"#660099"},{gt:300,color:"#7e0023"}';
		markLine = '{yAxis: 50},{yAxis:100},{yAxis:150},{yAxis:200},{yAxis:300}';
	}else
	{
		var arrNum = [pxcolor].toString().split(',');
		var arrPx =formatArray(arrNum,3);
		for(var a=0;a<arrPx.length;a++)
		{
			if(a == 0)
			{
				pieces.push(//更新分辨带
						'{'+
			                'lte:'+ Number(arrPx[a][1]) +','+
			                'color:"'+ arrPx[a][2]+'"'+
			            '}');
				markLine.push(//更新分辨带
						'{'+
			                'yAxis:'+ Number(arrPx[a][1])+
			            '}');
			}else if((a+1) ==  arrPx.length)
			{
				if(arrPx[a][0] == "a")
				{
					pieces.push(//更新分辨带
							'{'+
				                'gt:'+ Number(arrPx[a][1]) +','+
				                'color:"'+ arrPx[a][2]+'"'+
				            '}');
				}else
				{
					pieces.push(//更新分辨带
							'{'+
				                'gt:'+ Number(arrPx[a][0]) +','+
				                'lte:'+ Number(arrPx[a][1]) +','+
				                'color:"'+ arrPx[a][2]+'"'+
				            '}');
					markLine.push(//更新分辨带
							'{'+
				                'yAxis:'+ Number(arrPx[a][1])+
				            '}');
				}
			}else
			{
				pieces.push(//更新分辨带
						'{'+
			                'gt:'+ Number(arrPx[a][0]) +','+
			                'lte:'+ Number(arrPx[a][1]) +','+
			                'color:"'+ arrPx[a][2]+'"'+
			            '}');
				markLine.push(//更新分辨带
						'{'+
			                'yAxis:'+ Number(arrPx[a][1])+
			            '}');
			}
				
		}
	}
	
	if(deviceid == undefined || deviceid == -1)//如果未选择设备则初始化默认
	{
		devicename = "分辨带曲线图";
		sensorname = ["传感器"];
		sensortime = "['08-01','08-02','08-03','08-04','08-05','08-06','08-07']";
		series = 
			'{'+
			   'name:"传感器",'+
			   'type:"line",'+
			   'stack: "总量",'+
			   'smooth:true,'+
			   'markLine:{silent:true,data:['+markLine+']},'+
			   'data:[10, 132, 40, 180, 440, 20, 10]'+
			'}';
	}else
	{
		$.ajax(//请求设备名
		{
            type:'get',
            async:false,
            url:basePath+'/device/selDeviceInfo',
            data:{
                deviceNumber:deviceid
            },
            success: function(data)
            {
                var json=data.data;
                devicename = json.name;//更新图表名称
            },
			error:function()
			{
				tooltips("请求出错！请联系技术支持","Warning");
				flag=false;
			},
		});
		if(sensorid == undefined)//如果未选择传感器
		{
			sensorname = ["传感器1","传感器2"];
			sensorname = ["传感器"];
			sensortime = "['08-01','08-02','08-03','08-04','08-05','08-06','08-07']";
			series = 
				'{'+
				   'name:"传感器",'+
				   'type:"line",'+
				   'stack: "总量",'+
				   'smooth:true,'+
				   'markLine:{silent:true,data:['+markLine+']},'+
				   'data:[10, 132, 40, 180, 440, 20, 10]'+
				'}';
		}else
		{
			sensortime = 'time'+ID;//定义时间轴变量
			var arrsensorid = [sensorid].toString().split(',');//格式化传感器数组
			for(var a=0;a<arrsensorid.length;a++)
			{
				$.ajax(//请求传感器名
				{
                    type:'GET',
                    async:false,
                    url:basePath+'/sensor/selTypeList',		//根据设备ID查传感器
                    dataType: 'json',
                    data:{
                        deviceNumber:deviceid
                    },
					success: function(data)
					{
                        if(data.state=="success"){
                            for(var j=0;j<data.datas.length;j++){
                                if(data.datas[j].id==arrsensorid[a]){
                                    sensorname.push(a+data.datas[j].sensorName);//更新传感器名称
                                    series.push(//更新数据轴
                                        '{'+
                                        'name:"'+a+data.datas[j].sensorName+'",'+
                                        'type:"line",'+
                                        'data:data'+ID+a+
                                        '}');
                                    newseries.push('{'+//定义实时更新数据轴变量
                                        'data:data'+ID+a+
                                        '}');
                                    arrdata.push('var data'+ID+a+' = [];');//定义数据轴变量
                                    updatedata.push('data'+ID+a+'=cdData['+a+'];');//定义数据轴数组下标变量
                                    ifupdatedata.push('if(cdData['+a+'] !== " "){data'+ID+a+'=cdData['+a+'];}else{data'+ID+a+'=data'+ID+a+'[data'+ID+a+'.length-1]}');
                                    break;
                                }
                            }
                        }
					},
					error:function()
					{
						tooltips("请求出错！请联系技术支持","Warning");
						flag=false;
					},
				});
			}
		}
	}
	//定义JS模板
	var jsTMP = arrdata.join("")+//定义数据轴数组
	'var time'+ID+'= [];'+//定义时间轴数组
	'function new'+ID+'(id,data,time)'+
	'{'+
		'var myChart = echarts.init(document.getElementById("'+ID+'"));'+//初始化echarts实例
		'if(data == undefined)'+
		'{'+
			'var option  = '+
			'{'+
				'title:{text:"'+devicename+'",textStyle:{fontSize:"14",color:"'+idColorRgb+'"}},'+//设备名称
				'tooltip:{trigger:"axis"},'+
				'legend:{data:["'+sensorname.join('","')+'"],right:"0%",textStyle:{color:"'+ idColorRgb +'"}},'+//传感器名称
				'grid:{left:"3%",right:"120px",bottom:"50px",containLabel:true},'+
				'toolbox:{left:"center",feature:{dataZoom:{yAxisIndex:"none"},restore:{},saveAsImage:{}}},'+//分辨带设置
				'visualMap:{top:50,right:0,pieces:['+pieces+'],outOfRange:{color:"#999"}},'+
				'xAxis:{type:"category",boundaryGap:false,data:'+sensortime+',axisLine:{lineStyle:{color:"'+idColorRgb+'"}}},'+
				'yAxis:{splitLine:{show:false},min:"dataMin",max:"dataMax",axisLine:{lineStyle:{color:"'+idColorRgb+'"}}},'+
				'dataZoom:[{startValue:null},{type:"inside"}],'+
				'series:['+series+']'+
			'};'+
			'myChart.setOption(option);'+
		'}else'+
		'{'+
			'if(time != undefined)'+
			'{'+
				'var cdData	 = data;'+//定义实时更新数据轴
				'if(data'+ID+'0.length > 0)'+
				'{'+
					ifupdatedata.join("")+
				'}else'+
				'{'+
					updatedata.join("")+
				'}'+
				'var newTime = time;'+//定义时间轴
        'time'+ID+'=newTime;'+
				'myChart.setOption({'+
					'xAxis:{data:'+sensortime+'},'+
				   ' series:['+newseries+']'+
			   '});'+
		   '}'+
		'}'+
	'}';
	return jsTMP;
}
//管道(1)
function jsTemp12(id)
{
	var ID       = id.children(".myECharts").attr("id");//获取图表ID
	var tubehide = id.attr("tubehide");
	if(tubehide == 1)
	{
		tubehide = 1;
	}else
	{
		tubehide = 0;
	}
	//定义JS模板
	var jsTMP = 'var tubehide'+ID+' = '+tubehide+'; var data'+ID+'=[];function new'+ID+'(id,data)'+
	'{'+
		'var myChart = echarts.init(document.getElementById("'+ID+'"));'+//初始化echarts实例
		'if(data == undefined)'+
		'{'+
			'var w  = $("#"+id).width();'+
			'var h  = $("#"+id).height();'+
			'var th = parseInt(h*0.8);'+
			'var tz = parseInt(h*0.6);'+
			'var tw = parseInt(tz * 3.5);'+
			'var fd = parseInt(w/(tw*1.4));'+
			'var xw;'+
			'if(fd == 0)'+
			'{'+
				'tw = parseInt(w*0.8);'+
				'tz = parseInt(tw/3.5);'+
				'data'+ID+'.push({coords:[[0, 0],[w, 0]]});'+
				'xw = w;'+
			'}else'+
			'{'+
				'var num = parseInt(w/fd);'+
				'xw = num*fd;'+
				'for(var a=0;a<fd;a++)'+
				'{'+
					'data'+ID+'.push({coords:[[(num*a)-1, 0],[num*(a+1), 0]]});'+
				'}'+
			'}'+
			'var option  = '+
			'{'+
				'grid:{top:0,left:0,right:0,bottom:"50%"},'+
				'xAxis:{splitLine:{show:false},axisLine:{show:false},axisTick:{show:false},axisLabel:{show:false},max:xw,min:0},'+
				'yAxis:{silent:true,splitLine:{show:false},axisLine:{show:false},axisTick:{show:false},axisLabel:{show:false},max:xw,min:0},'+
				'series:[{'+
					'coordinateSystem:"cartesian2d",'+
					'type:"lines",'+
					'polyline:true,'+
					'zlevel:1,'+
					'effect:{show:true,constantSpeed:60,delay:0,symbolSize:[tz,tw],symbol:"image://'+basePath+'/cloudConfiguration/images/zutai_new/gd1.png",trailLength:0.5,loop: true,},'+
					'lineStyle:{normal:{width:th,color:"rgba(255,255,255,0)",opacity:1,curveness:0,type:"solid",}},'+
					'data:data'+ID+
				'}]'+
			'};'+
			'myChart.setOption(option);'+
		'}else'+
		'{'+
			'if(data[0] === 0 || data[0] === "0")'+
			'{'+
				'myChart.setOption({'+
					'series:[{effect:{constantSpeed:2592000},data:data'+ID+'}]'+
				'});'+
				'if(tubehide'+ID+' == 1)'+
				'{'+
					'$("#'+ID+'").parent(".canvas-con").parent(".canvas").hide();'+
				'}'+
			'}else if(data[0] === 1 || data[0] === "1")'+
			'{'+
				'myChart.setOption({'+
					'series:[{effect:{constantSpeed:60},data:data'+ID+'}]'+
				'});'+
				'$("#'+ID+'").parent(".canvas-con").parent(".canvas").show();'+
			'}'+
		'}'+
	'}';
	return jsTMP;
}
//管道(2)
function jsTemp13(id)
{
	var ID       = id.children(".myECharts").attr("id");//获取图表ID
	var tubehide = id.attr("tubehide");
	if(tubehide == 1)
	{
		tubehide = 1;
	}else
	{
		tubehide = 0;
	}
	//定义JS模板
	var jsTMP = 'var tubehide'+ID+' = '+tubehide+'; var data'+ID+'=[];function new'+ID+'(id,data)'+
	'{'+
		'var myChart = echarts.init(document.getElementById("'+ID+'"));'+//初始化echarts实例
		'if(data == undefined)'+
		'{'+
			'var w  = $("#"+id).width();'+
			'var h  = $("#"+id).height();'+
			'var th = parseInt(h*0.8);'+
			'var tz = parseInt(h*0.6);'+
			'var tw = parseInt(tz * 3.5);'+
			'var fd = parseInt(w/(tw*1.4));'+
			'var xw;'+
			'if(fd == 0)'+
			'{'+
				'tw = parseInt(w*0.8);'+
				'tz = parseInt(tw/3.5);'+
				'data'+ID+'.push({coords:[[0, 0],[w, 0]]});'+
				'xw = w;'+
			'}else'+
			'{'+
				'var num = parseInt(w/fd);'+
				'xw = num*fd;'+
				'for(var a=0;a<fd;a++)'+
				'{'+
					'data'+ID+'.push({coords:[[(num*a)-1, 0],[num*(a+1), 0]]});'+
				'}'+
			'}'+
			'var option  = '+
			'{'+
				'grid:{top:0,left:0,right:0,bottom:"50%"},'+
				'xAxis:{splitLine:{show:false},axisLine:{show:false},axisTick:{show:false},axisLabel:{show:false},max:xw,min:0},'+
				'yAxis:{silent:true,splitLine:{show:false},axisLine:{show:false},axisTick:{show:false},axisLabel:{show:false},max:xw,min:0},'+
				'series:[{'+
					'coordinateSystem:"cartesian2d",'+
					'type:"lines",'+
					'polyline:true,'+
					'zlevel:1,'+
					'effect:{show:true,constantSpeed:60,delay:0,symbolSize:[tz,tw],symbol:"image://'+basePath+'/cloudConfiguration/images/zutai_new/gd2.png",trailLength:0.5,loop: true,},'+
					'lineStyle:{normal:{width:th,color:"rgba(255,255,255,0)",opacity:1,curveness:0,type:"solid",}},'+
					'data:data'+ID+
				'}]'+
			'};'+
			'myChart.setOption(option);'+
		'}else'+
		'{'+
			'if(data[0] === 0 || data[0] === "0")'+
			'{'+
				'myChart.setOption({'+
					'series:[{effect:{constantSpeed:2592000},data:data'+ID+'}]'+
				'});'+
				'if(tubehide'+ID+' == 1)'+
				'{'+
					'$("#'+ID+'").parent(".canvas-con").parent(".canvas").hide();'+
				'}'+
			'}else if(data[0] === 1 || data[0] === "1")'+
			'{'+
				'myChart.setOption({'+
					'series:[{effect:{constantSpeed:60},data:data'+ID+'}]'+
				'});'+
				'$("#'+ID+'").parent(".canvas-con").parent(".canvas").show();'+
			'}'+
		'}'+
	'}';
	return jsTMP;
}
//管道(3)
function jsTemp14(id)
{
	var ID       = id.children(".myECharts").attr("id");//获取图表ID
	var tubehide = id.attr("tubehide");
	if(tubehide == 1)
	{
		tubehide = 1;
	}else
	{
		tubehide = 0;
	}
	//定义JS模板
	var jsTMP = 'var tubehide'+ID+' = '+tubehide+'; var data'+ID+'=[];function new'+ID+'(id,data)'+
	'{'+
		'var myChart = echarts.init(document.getElementById("'+ID+'"));'+//初始化echarts实例
		'if(data == undefined)'+
		'{'+
			'var w  = $("#"+id).width();'+
			'var h  = $("#"+id).height();'+
			'var th = parseInt(h*0.8);'+
			'var tz = parseInt(h*0.6);'+
			'var tw = parseInt(tz * 3.5);'+
			'var fd = parseInt(w/(tw*1.4));'+
			'var xw;'+
			'if(fd == 0)'+
			'{'+
				'tw = parseInt(w*0.8);'+
				'tz = parseInt(tw/3.5);'+
				'data'+ID+'.push({coords:[[0, 0],[w, 0]]});'+
				'xw = w;'+
			'}else'+
			'{'+
				'var num = parseInt(w/fd);'+
				'xw = num*fd;'+
				'for(var a=0;a<fd;a++)'+
				'{'+
					'data'+ID+'.push({coords:[[(num*a)-1, 0],[num*(a+1), 0]]});'+
				'}'+
			'}'+
			'var option  = '+
			'{'+
				'grid:{top:0,left:0,right:0,bottom:"50%"},'+
				'xAxis:{splitLine:{show:false},axisLine:{show:false},axisTick:{show:false},axisLabel:{show:false},max:xw,min:0},'+
				'yAxis:{silent:true,splitLine:{show:false},axisLine:{show:false},axisTick:{show:false},axisLabel:{show:false},max:xw,min:0},'+
				'series:[{'+
					'coordinateSystem:"cartesian2d",'+
					'type:"lines",'+
					'polyline:true,'+
					'zlevel:1,'+
					'effect:{show:true,constantSpeed:60,delay:0,symbolSize:[tz,tw],symbol:"image://'+basePath+'/cloudConfiguration/images/zutai_new/gd3.png",trailLength:0.5,loop: true,},'+
					'lineStyle:{normal:{width:th,color:"rgba(255,255,255,0)",opacity:1,curveness:0,type:"solid",}},'+
					'data:data'+ID+
				'}]'+
			'};'+
			'myChart.setOption(option);'+
		'}else'+
		'{'+
			'if(data[0] === 0 || data[0] === "0")'+
			'{'+
				'myChart.setOption({'+
					'series:[{effect:{constantSpeed:2592000},data:data'+ID+'}]'+
				'});'+
				'if(tubehide'+ID+' == 1)'+
				'{'+
					'$("#'+ID+'").parent(".canvas-con").parent(".canvas").hide();'+
				'}'+
			'}else if(data[0] === 1 || data[0] === "1")'+
			'{'+
				'myChart.setOption({'+
					'series:[{effect:{constantSpeed:60},data:data'+ID+'}]'+
				'});'+
				'$("#'+ID+'").parent(".canvas-con").parent(".canvas").show();'+
			'}'+
		'}'+
	'}';
	return jsTMP;
}
//弯道(1)
function jsTemp15(id)
{
	var ID       = id.children(".myECharts").attr("id");//获取图表ID
	var tubehide = id.attr("tubehide");
	if(tubehide == 1)
	{
		tubehide = 1;
	}else
	{
		tubehide = 0;
	}
	//定义JS模板
	var jsTMP = 'var tubehide'+ID+' = '+tubehide+';function new'+ID+'(id,data)'+
	'{'+
		'var myChart = echarts.init(document.getElementById("'+ID+'"));'+//初始化echarts实例
		'if(data == undefined)'+
		'{'+
			'var w  = $("#"+id).width();'+
			'var h  = $("#"+id).height();'+
			'var th;'+
			'var top;'+
			'var lef;'+
			'if(w >= h)'+
			'{'+
				'th  = w*0.2;'+
				'top = th/2;'+
				'lef = th/2;'+
			'}else'+
			'{'+
				'th  = w*0.2;'+
				'top = th/2;'+
				'lef = th/2;'+
			'}'+
			'var tz = parseInt(th*0.6);'+
			'var tw = parseInt(tz * 3.5);'+
			'var option  = '+
			'{'+
				'grid:{top:top,left:lef,right:0,bottom:0},'+
				'xAxis:{splitLine:{show:false},axisLine:{show:false},axisTick:{show:false},axisLabel:{show:false},max:400,min:0},'+
				'yAxis:{silent:true,splitLine:{show:false},axisLine:{show:false},axisTick:{show:false},axisLabel:{show:false},max:400,min:0},'+
				'series:[{'+
					'coordinateSystem:"cartesian2d",'+
					'type:"lines",'+
					'polyline:true,'+
					'zlevel:1,'+
					'effect:{show:true,constantSpeed:60,delay:0,symbolSize:[tz,tw],symbol:"image://'+basePath+'/cloudConfiguration/images/zutai_new/gd1.png",trailLength:0.5,loop: true,},'+
					'lineStyle:{normal:{width:th,color:"rgba(255,255,255,0)",opacity:1,curveness:0,type:"solid",}},'+
					'data:[{coords:[[0, 0],[0, 400],[400, 400]]}]'+
				'}]'+
			'};'+
			'myChart.setOption(option);'+
		'}else'+
		'{'+
			'if(data[0] === 0 || data[0] === "0")'+
			'{'+
				'myChart.setOption({'+
					'series:[{effect:{constantSpeed:2592000},data:data'+ID+'}]'+
				'});'+
				'if(tubehide'+ID+' == 1)'+
				'{'+
					'$("#'+ID+'").parent(".canvas-con").parent(".canvas").hide();'+
				'}'+
			'}else if(data[0] === 1 || data[0] === "1")'+
			'{'+
				'myChart.setOption({'+
					'series:[{effect:{constantSpeed:2592000},data:data'+ID+'}]'+
				'});'+
				'$("#'+ID+'").parent(".canvas-con").parent(".canvas").show();'+
			'}'+
		'}'+
	'}';
	return jsTMP;
}
//弯道(2)
function jsTemp16(id)
{
	var ID       = id.children(".myECharts").attr("id");//获取图表ID
	var tubehide = id.attr("tubehide");
	if(tubehide == 1)
	{
		tubehide = 1;
	}else
	{
		tubehide = 0;
	}
	//定义JS模板
	var jsTMP = 'var tubehide'+ID+' = '+tubehide+';function new'+ID+'(id,data)'+
	'{'+
		'var myChart = echarts.init(document.getElementById("'+ID+'"));'+//初始化echarts实例
		'if(data == undefined)'+
		'{'+
			'var w  = $("#"+id).width();'+
			'var h  = $("#"+id).height();'+
			'var th;'+
			'var top;'+
			'var lef;'+
			'if(w >= h)'+
			'{'+
				'th  = w*0.2;'+
				'top = th/2;'+
				'lef = th/2;'+
			'}else'+
			'{'+
				'th  = w*0.2;'+
				'top = th/2;'+
				'lef = th/2;'+
			'}'+
			'var tz = parseInt(th*0.6);'+
			'var tw = parseInt(tz * 3.5);'+
			'var option  = '+
			'{'+
				'grid:{top:top,left:lef,right:0,bottom:0},'+
				'xAxis:{splitLine:{show:false},axisLine:{show:false},axisTick:{show:false},axisLabel:{show:false},max:400,min:0},'+
				'yAxis:{silent:true,splitLine:{show:false},axisLine:{show:false},axisTick:{show:false},axisLabel:{show:false},max:400,min:0},'+
				'series:[{'+
					'coordinateSystem:"cartesian2d",'+
					'type:"lines",'+
					'polyline:true,'+
					'zlevel:1,'+
					'effect:{show:true,constantSpeed:60,delay:0,symbolSize:[tz,tw],symbol:"image://'+basePath+'/cloudConfiguration/images/zutai_new/gd2.png",trailLength:0.5,loop: true,},'+
					'lineStyle:{normal:{width:th,color:"rgba(255,255,255,0)",opacity:1,curveness:0,type:"solid",}},'+
					'data:[{coords:[[0, 0],[0, 400],[400, 400]]}]'+
				'}]'+
			'};'+
			'myChart.setOption(option);'+
		'}else'+
		'{'+
			'if(data[0] === 0 || data[0] === "0")'+
			'{'+
				'myChart.setOption({'+
					'series:[{effect:{constantSpeed:2592000},data:[{coords:[[0, 0],[0, 400],[400, 400]]}]}]'+
				'});'+
				'if(tubehide'+ID+' == 1)'+
				'{'+
					'$("#'+ID+'").parent(".canvas-con").parent(".canvas").hide();'+
				'}'+
			'}else if(data[0] === 1 || data[0] === "1")'+
			'{'+
				'myChart.setOption({'+
					'series:[{effect:{constantSpeed:60},data:[{coords:[[0, 0],[0, 400],[400, 400]]}]}]'+
				'});'+
				'$("#'+ID+'").parent(".canvas-con").parent(".canvas").show();'+
			'}'+
		'}'+
	'}';
	return jsTMP;
}
//弯道(3)
function jsTemp17(id)
{
	var ID       = id.children(".myECharts").attr("id");//获取图表ID
	var tubehide = id.attr("tubehide");
	if(tubehide == 1)
	{
		tubehide = 1;
	}else
	{
		tubehide = 0;
	}
	//定义JS模板
	var jsTMP = 'var tubehide'+ID+' = '+tubehide+';function new'+ID+'(id,data)'+
	'{'+
		'var myChart = echarts.init(document.getElementById("'+ID+'"));'+//初始化echarts实例
		'if(data == undefined)'+
		'{'+
			'var w  = $("#"+id).width();'+
			'var h  = $("#"+id).height();'+
			'var th;'+
			'var top;'+
			'var lef;'+
			'if(w >= h)'+
			'{'+
				'th  = w*0.2;'+
				'top = th/2;'+
				'lef = th/2;'+
			'}else'+
			'{'+
				'th  = w*0.2;'+
				'top = th/2;'+
				'lef = th/2;'+
			'}'+
			'var tz = parseInt(th*0.6);'+
			'var tw = parseInt(tz * 3.5);'+
			'var option  = '+
			'{'+
				'grid:{top:top,left:lef,right:0,bottom:0},'+
				'xAxis:{splitLine:{show:false},axisLine:{show:false},axisTick:{show:false},axisLabel:{show:false},max:400,min:0},'+
				'yAxis:{silent:true,splitLine:{show:false},axisLine:{show:false},axisTick:{show:false},axisLabel:{show:false},max:400,min:0},'+
				'series:[{'+
					'coordinateSystem:"cartesian2d",'+
					'type:"lines",'+
					'polyline:true,'+
					'zlevel:1,'+
					'effect:{show:true,constantSpeed:60,delay:0,symbolSize:[tz,tw],symbol:"image://'+basePath+'/cloudConfiguration/images/zutai_new/gd3.png",trailLength:0.5,loop: true,},'+
					'lineStyle:{normal:{width:th,color:"rgba(255,255,255,0)",opacity:1,curveness:0,type:"solid",}},'+
					'data:[{coords:[[0, 0],[0, 400],[400, 400]]}]'+
				'}]'+
			'};'+
			'myChart.setOption(option);'+
		'}else'+
		'{'+
			'if(data[0] === 0 || data[0] === "0")'+
			'{'+
				'myChart.setOption({'+
					'series:[{effect:{constantSpeed:2592000},data:[{coords:[[0, 0],[0, 400],[400, 400]]}]}]'+
				'});'+
				'if(tubehide'+ID+' == 1)'+
				'{'+
					'$("#'+ID+'").parent(".canvas-con").parent(".canvas").hide();'+
				'}'+
			'}else if(data[0] === 1 || data[0] === "1")'+
			'{'+
				'myChart.setOption({'+
					'series:[{effect:{constantSpeed:60},data:[{coords:[[0, 0],[0, 400],[400, 400]]}]}]'+
				'});'+
				'$("#'+ID+'").parent(".canvas-con").parent(".canvas").show();'+
			'}'+
		'}'+
	'}';
	return jsTMP;
}
//蓄水池
function jsTemp18(id)
{
	var deviceid     = id.attr("deviceid");//获取设备ID
	var sensorid     = id.attr("sensorid");//获取传感器ID
	var ID           = id.children(".myECharts").attr("id");//获取图表ID
	var devicename   = "蓄水池";//定义曲线图名称
	var sensorname   = "传感器";//定义曲线传感器名称
	var sensortime   = "2019-01-01 00:00:00";//定义时间轴
	var danwei       = "";//单位
	var size         = 20;//字体大小
	var xn           = 5;//实时数据
	var max          = 'var max'+ID+'="";';//最大值
	var dan          = "";
	var bai          = 0.5;//图表值
	var ifupdatedata = [];//定义判断类型数据数轴
	var reservoir    =  id.attr("reservoir");
	if(reservoir)
	{
		var arrData = [reservoir].toString().split(',');
		if(arrData[0])
		{
			max = 'var max'+ID+'='+arrData[0]+';'
			dan = arrData[2]+'/';
		}
		if(arrData[1])
		{
			size = arrData[1];
		}
		if(arrData[2])
		{
			danwei = arrData[2];
		}
	}
	if(deviceid != undefined && deviceid != -1)//如果选择设备
	{
		$.ajax(//请求设备名
		{
			type:'get',
			async:false,
			url:basePath+'/getDevice/'+deviceid+'.htm',
			success: function(data)
			{
				var json=$.parseJSON(data);
				devicename = json.deviceName;//更新图表名称
			},
			error:function()
			{
				tooltips("请求出错！请联系技术支持","Warning");
				flag=false;
			},
		});
		if(sensorid != undefined)//如果选择传感器
		{
			var arrsensorid = [sensorid].toString().split(',');//格式化传感器数组
			for(var a=0;a<arrsensorid.length;a++)
			{
				$.ajax(//请求传感器名
				{
					type:'get',
					async:false,
					url:basePath+'/getSensor/'+arrsensorid[a]+'.htm',
					success: function(data)
					{
						var json=$.parseJSON(data);
						sensorname=json.sensorName;//更新传感器名称
						ifupdatedata.push('if(cdData['+a+'] !== " "){s'+ID+'=cdData['+a+'];}')
					},
					error:function()
					{
						tooltips("请求出错！请联系技术支持","Warning");
						flag=false;
					},
				});
			}
		}
	}
	//定义JS模板
	var jsTMP = 'var time'+ID+'="'+sensortime+'";var s'+ID+'='+xn+';'+max+'var bai'+ID+'='+bai+';function new'+ID+'(id,data,time)'+
	'{'+
		'var myChart = echarts.init(document.getElementById("'+ID+'"));'+//初始化echarts实例
		'if(data == undefined)'+
		'{'+
			'var option  = '+
			'{'+
				'series:['+
				'{'+
					'type:"liquidFill",'+
					'name:"'+devicename+'",'+
					'data:[{name:"'+sensorname+'",value:bai'+ID+'}],'+
					'direction:"right",'+
					'shape:"container",'+
					'color:["rgba(43, 110, 204, 0.7)"],'+
					'center:["50%","50%"],'+
					'amplitude:10,'+
					'outline:{show:false},'+
					'label:{'+
							'formatter:function(param){'+
							'return '+
							'param.seriesName+"\\n"'+
							'+param.name+"\\n"'+
							'+ max'+ID+'+"'+dan+'"+'+ 
							's'+ID+'+"'+danwei+'("+param.value*100+"%)\\n"'+
							'+time'+ID+';'+
						'},'+
						'fontSize:'+size+','+
					'},'+
					'backgroundStyle:{color:"#e3f7ff",}'+
				'}]'+
			'};'+
			'myChart.setOption(option);'+
		'}else'+
		'{'+
			'if(time != undefined)'+
			'{'+
				'var cdData	 = data;'+//定义实时更新数据轴
				ifupdatedata.join("")+
				'time'+ID+'=time;'+
				'if(max'+ID+')'+
				'{'+
					'bai'+ID+'=toDecimal(s'+ID+'/max'+ID+',4);'+
				'}else'+
				'{'+
					'bai'+ID+'=s'+ID+';'+
				'}'+
				'myChart.setOption('+
				'{'+
					'series:['+
					'{'+
						'data:[{name:"'+sensorname+'",value:bai'+ID+'}]'+
					'}]'+
				'});'+
		   '}'+
		'}'+
	'}';
	return jsTMP;
}
//柱状图（竖）
function jsTemp19(id)
{
	var deviceid     = id.attr("deviceid");//获取设备ID
	var sensorid     = id.attr("sensorid");//获取传感器ID
	var ID           = id.children(".myECharts").attr("id");//获取图表ID
	var devicename   = "柱状图示例(竖)";//定义曲线图名称
	var sensorname   = ["传感器1","传感器2","传感器3","传感器4","传感器5"];//定义曲线传感器名称
	var sensortime   = "2019-01-01 00:00:00";//定义时间轴
	var series       = [9,60,-36,38,20];//定义数据轴
	var newseries    = [];//定义实时更新数据轴变量
	var arrdata      = [];//定义更新数组
	var ifupdatedata = [];//定义判断类型数据数轴
    var idColorRgb = id.attr("colorrgb");
	if(deviceid != undefined && deviceid != -1)//如果选择设备
	{
		$.ajax(//请求设备名
		{
			type:'get',
			async:false,
			url:basePath+'/getDevice/'+deviceid+'.htm',
			success: function(data)
			{
				var json=$.parseJSON(data);
				devicename = json.deviceName;//更新图表名称
			},
			error:function()
			{
				tooltips("请求出错！请联系技术支持","Warning");
				flag=false;
			},
		});
		if(sensorid != undefined)//如果选择传感器
		{
			var arrsensorid = [sensorid].toString().split(',');//格式化传感器数组
			sensorname = [];
			series     = [];
			for(var a=0;a<arrsensorid.length;a++)
			{
				$.ajax(//请求传感器名
				{
					type:'get',
					async:false,
					url:basePath+'/getSensor/'+arrsensorid[a]+'.htm',
					success: function(data)
					{
						var json=$.parseJSON(data);
						sensorname.push(a+json.sensorName);//更新传感器名称
						series.push('data'+ID+a);//更新数据轴
						newseries.push('data'+ID+a);//定义实时更新数据轴变量
						arrdata.push('var data'+ID+a+';');//定义数据轴变量
						ifupdatedata.push('if(cdData['+a+'] !== " "){data'+ID+a+'=cdData['+a+'];}')
					},
					error:function()
					{
						tooltips("请求出错！请联系技术支持","Warning");
						flag=false;
					},
				});
			}
		}
	}
	//定义JS模板
	var jsTMP = arrdata.join("")+//定义数据轴数组
	'var time'+ID+';'+//定义时间轴数组
	'function new'+ID+'(id,data,time)'+
	'{'+
		'var myChart = echarts.init(document.getElementById("'+ID+'"));'+//初始化echarts实例
		'if(data == undefined)'+
		'{'+
			'var option  = '+
			'{'+
				'title:{text:"'+devicename+'",subtext:"更新时间:'+sensortime+'",left:"3%",textStyle:{fontSize:"14",color:"'+idColorRgb+'"}},'+//设备名称
				'tooltip:{trigger:"axis",axisPointer:{ type:"shadow"}},'+
				'grid:{left:"3%",right:"4%",bottom:"3%",containLabel:true},'+
				'toolbox:{feature:{saveAsImage:{}}},'+
				'xAxis:{type:"category",axisTick:{alignWithLabel:true},data:["'+sensorname.join('","')+'"],axisLine:{lineStyle:{color:"'+idColorRgb+'"}}},'+
				'yAxis:{type:"value",axisLine:{lineStyle:{color:"'+idColorRgb+'"}}},'+
				'series:[{type: "bar",barGap:0,data:['+series+']}]'+
			'};'+
			'myChart.setOption(option);'+
		'}else'+
		'{'+
			'if(time != undefined)'+
			'{'+
				'var cdData	 = data;'+//定义实时更新数据轴
				ifupdatedata.join("")+
				'time'+ID+'=time;'+
				'myChart.setOption({'+
					'title:{subtext:"更新时间:"'+'+time'+ID+'},'+
					'series:[{data:['+newseries+']}]'+
			   '});'+
		   '}'+
		'}'+
	'}';
	return jsTMP;
}
//柱状图（横）
function jsTemp20(id)
{
	var deviceid     = id.attr("deviceid");//获取设备ID
	var sensorid     = id.attr("sensorid");//获取传感器ID
	var ID           = id.children(".myECharts").attr("id");//获取图表ID
	var devicename   = "柱状图示例(横)";//定义曲线图名称
	var sensorname   = ["传感器1","传感器2","传感器3","传感器4","传感器5"];//定义曲线传感器名称
	var sensortime   = "2019-01-01 00:00:00";//定义时间轴
	var series       = [9,60,-36,38,20];//定义数据轴
	var newseries    = [];//定义实时更新数据轴变量
	var arrdata      = [];//定义更新数组
	var ifupdatedata = [];//定义判断类型数据数轴
    var idColorRgb = id.attr("colorrgb");
	if(deviceid != undefined && deviceid != -1)//如果选择设备
	{
		$.ajax(//请求设备名
		{
			type:'get',
			async:false,
			url:basePath+'/getDevice/'+deviceid+'.htm',
			success: function(data)
			{
				var json=$.parseJSON(data);
				devicename = json.deviceName;//更新图表名称
			},
			error:function()
			{
				tooltips("请求出错！请联系技术支持","Warning");
				flag=false;
			},
		});
		if(sensorid != undefined)//如果选择传感器
		{
			var arrsensorid = [sensorid].toString().split(',');//格式化传感器数组
			sensorname = [];
			series     = [];
			for(var a=0;a<arrsensorid.length;a++)
			{
				$.ajax(//请求传感器名
				{
					type:'get',
					async:false,
					url:basePath+'/getSensor/'+arrsensorid[a]+'.htm',
					success: function(data)
					{
						var json=$.parseJSON(data);
						sensorname.push(a+json.sensorName);//更新传感器名称
						series.push('data'+ID+a);//更新数据轴
						newseries.push('data'+ID+a);//定义实时更新数据轴变量
						arrdata.push('var data'+ID+a+';');//定义数据轴变量
						ifupdatedata.push('if(cdData['+a+'] !== " "){data'+ID+a+'=cdData['+a+'];}')
					},
					error:function()
					{
						tooltips("请求出错！请联系技术支持","Warning");
						flag=false;
					},
				});
			}
		}
	}
	//定义JS模板
	var jsTMP = arrdata.join("")+//定义数据轴数组
	'var time'+ID+';'+//定义时间轴数组
	'function new'+ID+'(id,data,time)'+
	'{'+
		'var myChart = echarts.init(document.getElementById("'+ID+'"));'+//初始化echarts实例
		'if(data == undefined)'+
		'{'+
			'var option  = '+
			'{'+
				'title:{text:"'+devicename+'",subtext:"更新时间:'+sensortime+'",left:"3%",textStyle:{fontSize:"14",color:"'+idColorRgb+'"}},'+//设备名称
				'tooltip:{trigger:"axis",axisPointer:{ type:"shadow"}},'+
				'grid:{left:"3%",right:"4%",bottom:"3%",containLabel:true},'+
				'toolbox:{feature:{saveAsImage:{}}},'+
				'yAxis:{type:"category",axisTick:{alignWithLabel:true},data:["'+sensorname.join('","')+'"],axisLine:{lineStyle:{color:"'+idColorRgb+'"}}},'+
				'xAxis:{type:"value",axisLine:{lineStyle:{color:"'+idColorRgb+'"}}},'+
				'series:[{type: "bar",barGap:0,data:['+series+']}]'+
			'};'+
			'myChart.setOption(option);'+
		'}else'+
		'{'+
			'if(time != undefined)'+
			'{'+
				'var cdData	 = data;'+//定义实时更新数据轴
				ifupdatedata.join("")+
				'time'+ID+'=time;'+
				'myChart.setOption({'+
					'title:{subtext:"更新时间:"'+'+time'+ID+'},'+
					'series:[{data:['+newseries+']}]'+
			   '});'+
		   '}'+
		'}'+
	'}';
	return jsTMP;
}
//饼图(1)
function jsTemp21(id)
{
	var deviceid     = id.attr("deviceid");//获取设备ID
	var sensorid     = id.attr("sensorid");//获取传感器ID
	var ID           = id.children(".myECharts").attr("id");//获取图表ID
	var devicename   = "饼图示例";//定义曲线图名称
	var sensorname   = ["传感器1","传感器2","传感器3","传感器4","传感器5"];//定义曲线传感器名称
	var sensortime   = "2019-01-01 00:00:00";//定义时间轴
	var series       = 	'{value:335,name:"传感器1"},'+
						'{value:310,name:"传感器2"},'+
						'{value:234,name:"传感器3"},'+
						'{value:135,name:"传感器4"},'+
						'{value:154,name:"传感器5"}';
	var arrdata      = [];//定义更新数组
	var ifupdatedata = [];//定义判断类型数据数轴
	var Total        = "";//总计
	var newTotal     = 'var newTotal = "";';//计算
    var idColorRgb = id.attr("colorrgb");

    if(deviceid != undefined && deviceid != -1)//如果选择设备
	{
		$.ajax(//请求设备名
		{
			type:'get',
			async:false,
			url:basePath+'/getDevice/'+deviceid+'.htm',
			success: function(data)
			{
				var json=$.parseJSON(data);
				devicename = json.deviceName;//更新图表名称
			},
			error:function()
			{
				tooltips("请求出错！请联系技术支持","Warning");
				flag=false;
			},
		});
		if(sensorid != undefined)//如果选择传感器
		{
			var arrsensorid = [sensorid].toString().split(',');//格式化传感器数组
			sensorname = [];
			series     = [];
			for(var a=0;a<arrsensorid.length;a++)
			{
				$.ajax(//请求传感器名
				{
					type:'get',
					async:false,
					url:basePath+'/getSensor/'+arrsensorid[a]+'.htm',
					success: function(data)
					{
						var json=$.parseJSON(data);
						sensorname.push(a+json.sensorName);//更新传感器名称
						series.push(//更新数据轴
								'{'+
								   'name:"'+a+json.sensorName+'",'+
								   'value:data'+ID+a+
								'}');
						if(arrsensorid.length == (a+1)){
							Total += 'Number(data'+ID+a+')';
						}else{
							Total += 'Number(data'+ID+a+')+';
						}
						newTotal   = 'var newTotal = '+Total+';';//计算						
						arrdata.push('var data'+ID+a+'=1;');//定义数据轴变量
						ifupdatedata.push('if(cdData['+a+'] !== " "){data'+ID+a+'=cdData['+a+'];}')
					},
					error:function()
					{
						tooltips("请求出错！请联系技术支持","Warning");
						flag=false;
					},
				});
			}
		}
	}
	//定义JS模板
	var jsTMP = arrdata.join("")+//定义数据轴数组
	'var time'+ID+';'+//定义时间轴数组
	'function new'+ID+'(id,data,time)'+
	'{'+
		'var myChart = echarts.init(document.getElementById("'+ID+'"));'+//初始化echarts实例
		'if(data == undefined)'+
		'{'+
			'var option  = '+
			'{'+
				'title:{text:"'+devicename+'",subtext:"更新时间:",x:"center",textStyle:{fontSize:"14",color:"'+idColorRgb+'"}},'+//设备名称
				'tooltip:{trigger:"item",formatter:"{a}<br/>{b}:{c}({d}%)"},'+
				'legend:{type:"scroll",orient:"horizontal",bottom:0,data:["'+sensorname.join('","')+'"],textStyle:{color:"'+idColorRgb+'"}},'+
				'series:[{name:"'+devicename+'",type:"pie",radius:["45%","60%"],avoidLabelOverlap:false,label:{normal:{show: false,position:"center"},emphasis:{show:true,textStyle:{fontSize:"16",}}},data:['+series+']}]'+
			'};'+
			'myChart.setOption(option);'+
		'}else'+
		'{'+
			'if(time != undefined)'+
			'{'+
				'var cdData	 = data;'+//定义实时更新数据轴
				ifupdatedata.join("")+
				'time'+ID+'=time;'+
				newTotal+
				'myChart.setOption({'+
					'title:{subtext:"更新时间:"'+'+time'+ID+'+"  总计:"+newTotal},'+
					'series:[{data:['+series+']}]'+
			   '});'+
		   '}'+
		'}'+
	'}';
	return jsTMP;
}
//饼图(2)
function jsTemp22(id)
{
	var deviceid     = id.attr("deviceid");//获取设备ID
	var sensorid     = id.attr("sensorid");//获取传感器ID
	var ID           = id.children(".myECharts").attr("id");//获取图表ID
	var devicename   = "饼图示例";//定义曲线图名称
	var sensorname   = ["传感器1","传感器2","传感器3","传感器4","传感器5"];//定义曲线传感器名称
	var sensortime   = "2019-01-01 00:00:00";//定义时间轴
	var series       = 	'{value:335,name:"传感器1"},'+
						'{value:310,name:"传感器2"},'+
						'{value:234,name:"传感器3"},'+
						'{value:135,name:"传感器4"},'+
						'{value:154,name:"传感器5"}';
	var arrdata      = [];//定义更新数组
	var ifupdatedata = [];//定义判断类型数据数轴
	var Total        = "";//总计
	var newTotal     = 'var newTotal = "";';//计算
    var idColorRgb = id.attr("colorrgb");
	if(deviceid != undefined && deviceid != -1)//如果选择设备
	{
		$.ajax(//请求设备名
		{
			type:'get',
			async:false,
			url:basePath+'/getDevice/'+deviceid+'.htm',
			success: function(data)
			{
				var json=$.parseJSON(data);
				devicename = json.deviceName;//更新图表名称
			},
			error:function()
			{
				tooltips("请求出错！请联系技术支持","Warning");
				flag=false;
			},
		});
		if(sensorid != undefined)//如果选择传感器
		{
			var arrsensorid = [sensorid].toString().split(',');//格式化传感器数组
			sensorname = [];
			series     = [];
			for(var a=0;a<arrsensorid.length;a++)
			{
				$.ajax(//请求传感器名
				{
					type:'get',
					async:false,
					url:basePath+'/getSensor/'+arrsensorid[a]+'.htm',
					success: function(data)
					{
						var json=$.parseJSON(data);
						sensorname.push(a+json.sensorName);//更新传感器名称
						series.push(//更新数据轴
								'{'+
								   'name:"'+a+json.sensorName+'",'+
								   'value:data'+ID+a+
								'}');
						if(arrsensorid.length == (a+1)){
							Total += 'Number(data'+ID+a+')';
						}else{
							Total += 'Number(data'+ID+a+')+';
						}
						newTotal   = 'var newTotal = '+Total+';';//计算	
						arrdata.push('var data'+ID+a+'=1;');//定义数据轴变量
						ifupdatedata.push('if(cdData['+a+'] !== " "){data'+ID+a+'=cdData['+a+'];}')
					},
					error:function()
					{
						tooltips("请求出错！请联系技术支持","Warning");
						flag=false;
					},
				});
			}
		}
	}
	//定义JS模板
	var jsTMP = arrdata.join("")+//定义数据轴数组
	'var time'+ID+';'+//定义时间轴数组
	'function new'+ID+'(id,data,time)'+
	'{'+
		'var myChart = echarts.init(document.getElementById("'+ID+'"));'+//初始化echarts实例
		'if(data == undefined)'+
		'{'+
			'var option  = '+
			'{'+
				'title:{text:"'+devicename+'",subtext:"更新时间:",x:"center",textStyle:{fontSize:"14",color:"'+idColorRgb+'"}},'+//设备名称
				'tooltip:{trigger:"item",formatter:"{a}<br/>{b}:{c}({d}%)"},'+
				'legend:{type:"scroll",orient:"horizontal",bottom:0,data:["'+sensorname.join('","')+'"],textStyle:{color:"'+idColorRgb+'"}},'+
				'series:[{name:"'+devicename+'",type:"pie",radius:"60%",avoidLabelOverlap:false,label:{normal:{show: false,position:"center"},emphasis:{show:true,textStyle:{fontSize:"16",}}},data:['+series+']}]'+
			'};'+
			'myChart.setOption(option);'+
		'}else'+
		'{'+
			'if(time != undefined)'+
			'{'+
				'var cdData	 = data;'+//定义实时更新数据轴
				ifupdatedata.join("")+
				'time'+ID+'=time;'+
				newTotal+
				'myChart.setOption({'+
					'title:{subtext:"更新时间:"'+'+time'+ID+'+"  总计:"+newTotal},'+
					'series:[{data:['+series+']}]'+
			   '});'+
		   '}'+
		'}'+
	'}';
	return jsTMP;
}
//蓄水池无边框
function jsTemp23(id)
{
	var deviceid     = id.attr("deviceid");//获取设备ID
	var sensorid     = id.attr("sensorid");//获取传感器ID
	var ID           = id.children(".myECharts").attr("id");//获取图表ID
	var sensorname   = "传感器";
	var max          = 'var max'+ID+'="";';//最大值
	var size         = 20;//字体大小
	var Ran          = 8;//波浪幅度
	var color        = "#4c84ff";//波浪颜色
	var xn           = 5;//实时数据
	var bai          = 0.5;//计算后的比例
	var sho          = true;//是否显示百分比
	var ifupdatedata = [];//定义判断类型数据数轴
	var SeTup    	 =  id.attr("publicreservoir");
	if(SeTup)
	{
		var arrData = [SeTup].toString().split(',');
		if(arrData[0])
		{
			max = 'var max'+ID+'='+arrData[0]+';'
		}
		if(arrData[1])
		{
			size = arrData[1];
		}
		if(arrData[2])
		{
			Ran = arrData[2];
		}
		if(arrData[3])
		{
			color = arrData[3];
		}
		if(arrData[4])
		{
			if(arrData[4] == 1)
			{
				sho = false;
			}
		}
	}
	if(deviceid != undefined && deviceid != -1)//如果选择设备
	{
		if(sensorid != undefined)//如果选择传感器
		{
			var arrsensorid = [sensorid].toString().split(',');//格式化传感器数组
			for(var a=0;a<arrsensorid.length;a++)
			{
				$.ajax(//请求传感器名
				{
					type:'get',
					async:false,
					url:basePath+'/getSensor/'+arrsensorid[a]+'.htm',
					success: function(data)
					{
						var json=$.parseJSON(data);
						sensorname=json.sensorName;//更新传感器名称
						ifupdatedata.push('if(cdData['+a+'] !== " "){s'+ID+'=cdData['+a+'];}')
					},
					error:function()
					{
						tooltips("请求出错！请联系技术支持","Warning");
						flag=false;
					},
				});
			}
		}
	}
	//定义JS模板
	var jsTMP = 'var s'+ID+'='+xn+';'+max+'var bai'+ID+'='+bai+';function new'+ID+'(id,data,time)'+
	'{'+
		'var myChart = echarts.init(document.getElementById("'+ID+'"));'+//初始化echarts实例
		'if(data == undefined)'+
		'{'+
			'var option  = '+
			'{'+
				'series:['+
				'{'+
					'type:"liquidFill",'+
					'name:"'+sensorname+'",'+//传感器名称
					'data:[bai'+ID+'],'+//实时数据
					'direction:"right",'+
					'shape:"container",'+
					'color:["'+color+'"],'+//波浪颜色
					'center:["50%","50%"],'+
					'amplitude:'+Ran+','+//波浪幅度
					'outline:{show:false},'+
					'backgroundStyle:{color:"rgba(0, 0, 0, 0)"},'+
					'label:{'+
						'show:'+sho+','+
						'fontSize:'+size+','+
						'color:["'+color+'"],'+
					'},'+
				'}],'+
				'tooltip:{show:true}'+
			'};'+
			'myChart.setOption(option);'+
		'}else'+
		'{'+
			'if(time != undefined)'+
			'{'+
				'var cdData	 = data;'+//定义实时更新数据轴
				ifupdatedata.join("")+
				'if(max'+ID+')'+
				'{'+
					'bai'+ID+'=toDecimal(s'+ID+'/max'+ID+',2);'+
				'}else'+
				'{'+
					'bai'+ID+'=s'+ID+';'+
				'}'+
				'myChart.setOption('+
				'{'+
					'series:['+
					'{'+
						'data:[bai'+ID+']'+
					'}]'+
				'});'+
		   '}'+
		'}'+
	'}';
	return jsTMP;
}
//百分比控件横(单柱)
function jsTemp24(id)
{
	var deviceid     = id.attr("deviceid");//获取设备ID
	var sensorid     = id.attr("sensorid");//获取传感器ID
	var ID           = id.children(".myECharts").attr("id");//获取图表ID
	var grayBar      = "var max"+ID+" = 1;";//背景(最大值)
	var beijing      = "rgba(102, 102, 102,0.5)";//背景颜色
	var tianchong    = "#3dc0e9";//填充颜色
	var Radious      = 20;//圆角
	var color        = "#fff";//文字颜色
	var size         = 16;//文字大小
	var ifupdatedata = [];//定义判断类型数据数轴
	var newProgressbar = id.attr("progressbar");
	if(newProgressbar)
	{
		if(newProgressbar)
		{
			var arrData = [newProgressbar].toString().split(',');
			if(arrData[0])
			{
				grayBar    = "var max"+ID+" = "+arrData[0]+";";
				
			}
			if(arrData[1])
			{
				beijing = arrData[1];//背景颜色
			}
			if(arrData[2])
			{
				tianchong = arrData[2];//填充颜色
			}
			if(arrData[3])
			{
				Radious = Number(arrData[3]);//圆角
			}
			if(arrData[4])
			{
				color = arrData[4];//文字颜色
			}
			if(arrData[5])
			{
				size = Number(arrData[5]);//文字大小
			}
		}
	}
	if(deviceid != undefined && deviceid != -1)//如果选择设备
	{
		if(sensorid != undefined)//如果选择传感器
		{
			var arrsensorid = [sensorid].toString().split(',');//格式化传感器数组
			for(var a=0;a<arrsensorid.length;a++)
			{
				$.ajax(//请求传感器名
				{
					type:'get',
					async:false,
					url:basePath+'/getSensor/'+arrsensorid[a]+'.htm',
					success: function(data)
					{
						var json=$.parseJSON(data);
						sensorname=json.sensorName;//更新传感器名称
						ifupdatedata.push('if(cdData['+a+'] !== " "){data'+ID+'=Number(cdData['+a+']);}')
					},
					error:function()
					{
						tooltips("请求出错！请联系技术支持","Warning");
						flag=false;
					},
				});
			}
		}
	}
	//定义JS模板
	var jsTMP = grayBar +'var data'+ID+'=0;function new'+ID+'(id,data,time)'+
	'{'+
		'var myChart = echarts.init(document.getElementById("'+ID+'"));'+//初始化echarts实例
		'if(data == undefined)'+
		'{'+
			'var option  = '+
			'{'+
				
				'grid:{left:"0",right:"0",bottom:"0",top:"0",containLabel:true},'+//图表位置
				'xAxis:{show:false,axisLabel:{show:false,},axisTick:{show:false,},axisLine:{show:false,}},'+//隐藏X轴
				'yAxis:{type:"category",axisLabel:{show:false,},axisTick:{show:false,},axisLine:{show:false,}},'+//隐藏Y轴
				'series:'+
				'['+
					'{show:true,type:"bar",barGap:"-100%",barWidth:"100%",itemStyle:{barBorderRadius:'+Radious+',color:"'+beijing+'",},z:1,data:[max'+ID+'],},'+//背景色
					
					'{show:true,type:"bar",barGap:"-100%",barWidth:"100%",itemStyle:{barBorderRadius:'+Radious+',color:"'+tianchong+'",},max:max'+ID+',label:{normal:{show:true,textStyle:{color:"'+color+'",fontSize:'+size+',},position:"inside",offset:[10,0],formatter:function(){return ((data'+ID+'/max'+ID+') * 100).toFixed(1) + "%";}}},labelLine:{show:false,},z:2,data:[data'+ID+'],}'+//进度条
				']'+
				
			'};'+
			'myChart.setOption(option);'+
		'}else'+
		'{'+
			'if(time != undefined)'+
			'{'+
				'var cdData	 = data;'+//定义实时更新数据轴
				ifupdatedata.join("")+
				'if(data'+ID+' > max'+ID+')'+
				'{'+
					'max'+ID+' = data'+ID+
				'}'+
				'myChart.setOption('+
				'{'+
					'series:'+
					'['+
						'{data:[max'+ID+'],},'+
						
						'{data:[data'+ID+'],}'+
					']'+
				'});'+
		   '}'+
		'}'+
	'}';
	return jsTMP;
	
}