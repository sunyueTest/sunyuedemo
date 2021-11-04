var menuData = [
    {
        "id": 1,
        "type": 1,
        "name": "国家项目1",
        "construction_company": "恒大集团",
        "supporting_company": "恒大集团",
        "website": "www.hengda.com",
        "logo": "tupian.logo",
        "create_user": "user",
        "create_time": "2019-04-12 14:20:21",
        "bases": [
            {
                "id": 1,
                "project_id": 1,
                "name": "市级示范基地1",
                "ycoordinate": 36.102,
                "ccoordinate": 102.412,
                "create_user": "chanmufeng",
                "create_time": "2019-04-12 14:20:21"
            },
            {
                "id": 2,
                "project_id": 1,
                "name": "市级示范基地2",
                "ycoordinate": 36.102,
                "ccoordinate": 102.412,
                "create_user": "chanmufeng",
                "create_time": "2019-04-12 14:20:21"
            },
            {
                "id": 2,
                "project_id": 1,
                "name": "市级示范基地2",
                "ycoordinate": 36.102,
                "ccoordinate": 102.412,
                "create_user": "chanmufeng",
                "create_time": "2019-04-12 14:20:21"
            }
        ]
    },
    {
        "id": 2,
        "type": 1,
        "name": "国家项目2",
        "construction_company": "恒小集团",
        "supporting_company": "恒小集团",
        "website": "www.hengda.com",
        "logo": "tupian.logo",
        "create_user": "user",
        "create_time": "2019-04-12 14:20:21",
        "bases": [
            {
                "id": 1,
                "project_id": 2,
                "name": "服务中心1",
                "ycoordinate": 36.102,
                "ccoordinate": 102.412,
                "create_user": "chanmufeng",
                "create_time": "2019-04-12 14:20:21"
            },
            {
                "id": 2,
                "project_id": 2,
                "name": "服务中心2",
                "ycoordinate": 36.102,
                "ccoordinate": 102.412,
                "create_user": "chanmufeng",
                "create_time": "2019-04-12 14:20:21"
            },
            {
                "id": 3,
                "project_id": 2,
                "name": "服务中心3",
                "ycoordinate": 36.102,
                "ccoordinate": 102.412,
                "create_user": "chanmufeng",
                "create_time": "2019-04-12 14:20:21"
            },
            {
                "id": 4,
                "project_id": 2,
                "name": "服务中心4",
                "ycoordinate": 36.102,
                "ccoordinate": 102.412,
                "create_user": "chanmufeng",
                "create_time": "2019-04-12 14:20:21"
            }
            ,
            {
                "id": 5,
                "project_id": 2,
                "name": "服务中心5",
                "ycoordinate": 36.102,
                "ccoordinate": 102.412,
                "create_user": "chanmufeng",
                "create_time": "2019-04-12 14:20:21"
            }
        ]
    },
    {
        "id": 3,
        "type": 1,
        "name": "国家项目3",
        "construction_company": "恒中集团",
        "supporting_company": "恒中集团",
        "website": "www.hengda.com",
        "logo": "tupian.logo",
        "create_user": "user",
        "create_time": "2019-04-12 14:20:21",
        "bases": [
            {
                "id": 1,
                "project_id": 3,
                "name": "培训基地1",
                "ycoordinate": 36.102,
                "ccoordinate": 102.412,
                "create_user": "chanmufeng",
                "create_time": "2019-04-12 14:20:21"
            },
            {
                "id": 2,
                "project_id": 3,
                "name": "培训基地2",
                "ycoordinate": 36.102,
                "ccoordinate": 102.412,
                "create_user": "chanmufeng",
                "create_time": "2019-04-12 14:20:21"
            },
            {
                "id": 2,
                "project_id": 3,
                "name": "培训基地3",
                "ycoordinate": 36.102,
                "ccoordinate": 102.412,
                "create_user": "chanmufeng",
                "create_time": "2019-04-12 14:20:21"
            },
            {
                "id": 3,
                "project_id": 3,
                "name": "培训基地4",
                "ycoordinate": 36.102,
                "ccoordinate": 102.412,
                "create_user": "chanmufeng",
                "create_time": "2019-04-12 14:20:21"
            }
            ,
            {
                "id":4,
                "project_id": 4,
                "name": "培训基地4",
                "ycoordinate": 36.102,
                "ccoordinate": 102.412,
                "create_user": "chanmufeng",
                "create_time": "2019-04-12 14:20:21"
            },
            {
                "id": 5,
                "project_id": 5,
                "name": "培训基地5",
                "ycoordinate": 36.102,
                "ccoordinate": 102.412,
                "create_user": "chanmufeng",
                "create_time": "2019-04-12 14:20:21"
            }
            ,
            {
                "id": 6,
                "project_id": 6,
                "name": "培训基地6",
                "ycoordinate": 36.102,
                "ccoordinate": 102.412,
                "create_user": "chanmufeng",
                "create_time": "2019-04-12 14:20:21"
            }
        ]
    }
];
$(function(){
    var wHeight = $(window).height();
    $(".contentBox").height(wHeight);
    $(".itemBox").height($(".leftBox").height() - $(".searchBox").height() - 15 -30);
    $(".cameraBox").height($(".rightOneBox").height() - $(".rightOneBoxTop").height() - 50);
    $(".dangerMsgItem").height($("#dangerCharts").height() - 32 - 10);
    $(".allMapBox").height($(".rightThreeBox").height() - $(".allMapTitleBox").height() - 10);
    $("#devicePie").height($(".rightFourBox").height());
    $("#environmentBar").height($(".rightFiveBox").height());
    $("#landBar").height($(".rightSixBox").height());


    //加载菜单
    addMenu(menuData);

    $(".item").click(function(){
       $(".item").removeClass("activeItem");
       $(this).addClass("activeItem");
    });

    $(window).resize(function(){
        var wHeight = $(window).height();
        $(".contentBox").height(wHeight);
        $(".itemBox").height($(".leftBox").height() - $(".searchBox").height() - 15 -30);
        $(".cameraBox").height($(".rightOneBox").height() - $(".rightOneBoxTop").height() - 50);
        $(".dangerMsgItem").height($("#dangerCharts").height() - 32 - 10);
        $(".allMapBox").height($(".rightThreeBox").height() - $(".allMapTitleBox").height() - 10);
        $("#devicePie").height($(".rightFourBox").height());
        $("#environmentBar").height($(".rightFiveBox").height());
        $("#landBar").height($(".rightSixBox").height());


    })

});











//加载导航菜单
function addMenu(data){
    var $itemBox = $(".itemBox");
    $itemBox.empty();
    var $ul = $("<ul class='menuUl'></ul>");
    for(var i=0;i<data.length;i++){
        var $li = $("<li class='menuLi'></li>");
        var $h2 = $("<h2 class='obtain'></h2>");
        var $secondary = $("<div class='secondary hideSecondary'></div>");
        $h2.appendTo($li);
        $secondary.appendTo($li);
        $li.appendTo($ul);
        $ul.appendTo($itemBox);
        $h2.html(data[i].name +'<i></i>');


        $h2.click(function(){
            if($(this).hasClass("obtain")){
                $(this).removeClass("obtain");
                $(this).addClass("obFocus");
                $(this).find("i").addClass("arrowRot");
                $(this).parent(".menuLi").find(".secondary").height($(this).parent(".menuLi").find(".secondary").find(".item").length *2.2 +"rem");
                $(this).parent(".menuLi").find(".secondary").addClass("showSecondary");
                $(this).parent(".menuLi").find(".secondary").removeClass("hideSecondary");
            }else{
                $(this).removeClass("obFocus");
                $(this).addClass("obtain");
                $(this).find("i").removeClass("arrowRot");
                $(this).parent(".menuLi").find(".secondary").height(0);
                $(this).parent(".menuLi").find(".secondary").addClass("hideSecondary");
                $(this).parent(".menuLi").find(".secondary").removeClass("showSecondary");
            }
        });





        for(var j = 0;j<data[i].bases.length;j++){
            var $h3 = $("<h3 class='item'></h3>");
            $h3.text(data[i].bases[j].name);
            $h3.attr("data-id",data[i].bases[j].id);
            $h3.appendTo($secondary)


        }
    }
}
