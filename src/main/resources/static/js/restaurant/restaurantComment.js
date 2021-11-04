var id=$("#id").val();
//显示条数
var bestSize = 5;
$(function () {
    findCommentList();
})

findCommentList=function () {
    $.ajax({
        url: "/restaurant/findRestaurantCommentList",
        type: "POST",
        data: {
            restaurantId:id
        },
        error: function () {
            layer.msg('提交异常');
        },
        // beforeSend: function () {
        //     ShowDiv();
        // },
        success: function (res) {
            if (res.state == 'success') {
                console.log('res.count------------' + res.count);
                layui.use(['laypage', 'layer'], function () {
                    var laypage = layui.laypage
                        , layer = layui.layer;
                    laypage.render({
                        elem: 'laypage'
                        , count: res.count //数据总数
                        , limit: bestSize
                        , jump: function (obj) {
                            let page = obj.curr;
                            $(".bestSize").text(res.count);
                            console.log(page);
                            commentList(page);
                        }
                    });
                });
            } else {
                layer.msg(res.msg);

            }
        },
        // complete: function () {
        //     HiddenDiv();
        // }
    });
}
commentList=function (page) {

    $.ajax({
        url: "/restaurant/findRestaurantCommentList",
        type: "POST",
        data: {
            restaurantId: id,
            page: page,
        },
        error: function () {
            layer.msg('提交异常');
        },
        // beforeSend: function () {
        //     ShowDiv();
        // },
        success: function (res) {
            if (res.state == 'success') {
                var datas = res.datas;
                var $div = "";

                for (var i = 0; i < datas.length; i++) {
                    var $a="";
                    if(datas[i].remarks.length>99){
                        $a="<a class='remarksA' onclick='remarksCheck("+i+")'>展开</a>";
                    }
                    var $class="remarks"+i
                    $div += '<div class="log"><p><span>' + datas[i].commentName + '</span>&nbsp;&nbsp;&nbsp;<span>' + datas[i].createTime + '</span>&nbsp;&nbsp;&nbsp;<span>' + datas[i].restaurantName + '</span></p>' +
                        '<p>评分：</p>' +
                        '<div class="remarks"'+$class+'>' + datas[i].remarks + '</div>' +$a+
                        '</div>'
                }
                $(".commentDiv").html($div);
            } else {
                layer.msg(res.msg);
            }
        },
    })
}
remarksCheck=function (i) {
    var remarks=$(".remarks"+i).text();
    var k=remarks.length%53;
    $(".remarks"+i).css("height",k*3.5+"vh");
}