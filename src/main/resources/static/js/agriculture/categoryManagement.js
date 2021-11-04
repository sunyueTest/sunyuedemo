let layer;
layui.use(['form', 'table', 'layedit', 'laydate'], function () {
    layer = layui.layer;
});
var category="1";
$(function () {

    //页面初始加载查询蔬菜类参数
    findCategory(1, "");

    //点击查询第一个大类别下所有小类别信息事件
    $(document).on("click", ".category", function () {
        var type = $("#type").val();
        var data_val = $(this).attr("data_val");
        category=data_val;
        $(".category").css("background", "rgba(0,0,0,0)");
        $(this).css("background", "rgba(0,0,0,.3)");
        findCategory(data_val, type);
    })

    //点击删除图片，删除小类别作物
    $(document).on('click', '.categoryDel img', function () {
        var id = $(this).attr("data-id");
        var categoryId = $(this).attr("data-categoryId");
        delCategory(id, categoryId);
    })

    //点击查询按钮进行查询
    $(document).on('click', '#diseasesNamebnt', function () {
        var type = $("#type").val();
        findCategory(category, type);
    })

    //点击添加打开类别添加窗口
    $(document).on('click', '#addentry', function () {
        $("#tcadd").show();
    });

    //点击X关闭类别添加窗口
    $(document).on('click', '#deleadd', function () {
        $("#tcadd").hide();
        $("#tcbingzhongadd").val("");
    });

    //点击提交农作物
    $(document).on('click', '#addbnt', function () {
        addCategory();
    });

});

/**
 * 根据农作物大类别查询类别下的小类别
 * @param categoryId
 */
let findCategory = function (categoryId, type) {
    $.ajax({
        type: "POST",
        url: "../cropCategory/findCropCategoryList",
        data: {
            categoryId: categoryId,
            type: type
        },
        dataType: "json",
        success: function (res) {
            var $categoryVal = $(".categoryVal").empty();
            var $categoryDiv = "";
            if (res.state == "success" && res.count > 0) {
                for (var i = 0; i < res.count; i++) {
                    var category = res.datas[i];
                    if (i % 5 == 0) {
                        $categoryDiv = $("<div class='categoryDiv'></div>")
                    }
                    var $cate = $('<div class="cate"></div>');
                    var $category = $('<div class="category_val"></div>');
                    var $categoryDel = $('<div class="categoryDel"><img data-categoryId="' + category.categoryId + '" data-id="' + category.id + '" src="/static/img/agriculture/specialistManagement/dele.png" alt=""></div>');
                    $category.text(category.type);
                    $categoryDel.attr("data_val", category.id);
                    $category.appendTo($cate);
                    $categoryDel.appendTo($cate);
                    $cate.appendTo($categoryDiv);
                    $categoryDiv.appendTo($categoryVal);
                }
            }
        }
    })
}

/**
 * 删除作物
 * @param id
 * @param categoryId
 */
delCategory = function (id, categoryId) {
    $('#deletc').show();
    $("#motai").show();
    $(document).on('click', '#deleno', function () {
        $('#deletc').hide()
        $('#motai').hide()
    })

    $(document).on('click', '#deleyes', function () {
        $('#deletc').hide()
        $('#motai').hide()
        $.ajax({
            type: "POST",
            url: "../cropCategory/delCropCategory",
            data: {
                id: id
            },
            dataType: "json",
            success: function (res) {
                layer.msg($.i18n.prop(res.msg));
                var type = $("#type").val();
                findCategory(categoryId, type);
            }
        })
    })
}

addCategory=function(){
    var category=$("#quiz").val();
    var type=$("#tcbingzhongadd").val();
    if(category==null||category==""){
        layer.msg($.i18n.prop("作物种类必选"));
        return;
    }
    if(type==null||type.replace(/[\s　]/g,"")==""){
        layer.msg($.i18n.prop("作物名称必填"));
        return;
    }
    var categoryName=category.split("+")[0];
    var categoryId=category.split("+")[1];
    $.ajax({
        type: "POST",
        url: "../cropCategory/addCropCategory",
        data: {
            categoryName: categoryName,
            categoryId:categoryId,
            type:type
        },
        dataType: "json",
        success: function (res) {
            layer.msg($.i18n.prop(res.msg));
            if(res.state=="success"){
                type = $("#type").val();
                findCategory(category, type);
                $("#tcadd").hide();
                $("#tcbingzhongadd").val("");
            }
        }
    })
};