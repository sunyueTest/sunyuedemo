/**
 * 地图地块绘制js
 * 引用此js前提
 * 1、此js调用了高德Polygon（绘图），Text（文字）两部分所以必须引用高德js
 *      <script type="text/javascript" src="https://webapi.amap.com/maps?v=1.4.10&key=96a943dab4656930f33276727a084933&plugin=AMap.MouseTool"></script>
 *      <script src="https://a.amap.com/jsapi_demos/static/demo-center/js/demoutils.js"></script>
 *      <script src="//webapi.amap.com/ui/1.0/main.js?v=1.0.11"></script>
 *
 * 2、此js必须放在高德js下面，否则此js先引用
 *
 * 3、运行此js，需调用lot（id）方法，只需要在html中加载时调用lot(id)方法即可
 *
 * 4、lot(id)中id为地段id---lot表中主键，或者其余表中外键例如地块表的lot_id
 * @user 李英豪
 */
new_element = document.createElement("script");
new_element.setAttribute("type","text/javascript");
new_element.setAttribute("src", "../static/layui/layui.all.js");
document.body.appendChild(new_element);
//定义弹窗是否弹出
var alert=false;
/**
 * 根据ID获取对应的坐标信息
 * 用于查看时，能够看到画的线
 **/
var lotname="";
var Z=1;
var xy = [];
var X =116.397459;
var Y =39.908671;
function lot(id) {
    xy = [];
    $.ajax({
        type: "POST",
        url: "../lot/currencyShowLot",
        data: {id: id},
        dataType: "json",
        async:false,
        success: function (data) {
            if ('success' != data.state) {
                if(alert){
                    layer.alert("查询不到地段信息，请查看此地段是否已被删除或未添加地段");
                }
            }else{
                var lot=data.data.lot;
                var coordinateX=lot.coordinateX.split(",");
                var coordinateY=lot.coordinateY.split(",");
                lotname=lot.lotName;
                Z = coordinateX.length;
                for (var i = 0; i < coordinateX.length; i++) {
                    if(i==0){
                        X=0;
                        Y=0;
                    }
                    xy.push([coordinateX[i], coordinateY[i]]);
                    X = X + parseFloat(coordinateX[i]);
                    Y = Y + parseFloat(coordinateY[i]);
                }
                console.log("修改前X"+X/Z);
                console.log("修改前Y"+Y/Z);
                map.setCenter([X/Z,Y/Z])
            }
             findLot();
        }
    })
}


function findLot() {
/**
 * 绘制多边形
 */
var polygon = new AMap.Polygon({
    path: xy,
    fillColor: '#1791fc', // 多边形填充颜色
    strokeColor: '#FF33FF', // 线条颜色
    strokeOpacity: 0.2,
    fillOpacity: 0.4,
    iconLabel: "HELLO",
});
map.add(polygon);

/**
 * 多边形显示字
 */
var text = new AMap.Text({
    text: lotname,
    verticalAlign: 'bottom',
    position: [X / Z, Y / Z],
    height: 1000,
    style: {
        'background-color': 'transparent',
        '-webkit-text-stroke': '#fff',
        '-webkit-text-stroke-width': '0.5px',
        'text-align': 'center',
        'border': 'none',
        'color': 'black',
        'font-size': '24px',
        'font-weight': 600
    }
});
text.setMap(map);
}