//图片上传
var flag = 0;
var str = new Array();
var upload = layui.upload, laydate = layui.laydate;
layui.use('upload', function () {
    var $ = layui.jquery, upload = layui.upload;
});
//异步加载
var strs = new Array();
function ajaxImg(url) {
    $.ajax({
        cache: "true",
        data: "id="+parent.getId(),
        url: "/newTraceSource/"+url+"",
        success: function(data){
            strs = data.data.imgUrl.split("+");
            for(var i=0; i<strs.length-1; i++){
                $("#imgView").append(
                    "<div>"+
                    "<div style='float: left; margin-left: 30px;'>"+
                    "<img width='70' height='70' src='"+strs[i]+"?rand=h9xqeI' />" +
                    "</div></div>"
                );
            }
            if(strs.length-1 >= 8){
                $("#test3").remove();
                $("#alertTitle").html("提示：图片到达最大上传数量, 如需修改请先清空");
            }
        }
    });
    upload.render({
        elem: '#test3',
        url: '/newTraceSource/newUpLoadImg',
        multiple: true,
        before: function (obj) {
            obj.preview(function (index, file, result) {
                $('#demo3').append('<img width="70" height="70" src="'+result+'" alt="'+file.name+'" class="layui-upload-img">')
            });
            if($("#deleteAllImgValue").val() == 1){
                if(flag == 7){
                    $("#test3").remove();
                    $("#alertTitle").html("提示：图片到达最大上传数量");
                }
            }else{
                if(strs.length == 8){
                    $("#test3").remove();
                    $("#alertTitle").html("提示：图片到达最大上传数量");
                }
            }
            if((strs.length+str.length) == 8 && $("#deleteAllImgValue").val() == 0){
                $("#test3").remove();
                $("#alertTitle").html("提示：图片到达最大上传数量");
            }
        },
        done: function (res) {
            if (!res.code > 0) {
                str[flag] = res.url;
                flag++;
            }
        }
    });
}
$("#deleteAllImg").click(function(){
    $("#imgView").remove();
    $("#deleteAllImgValue").val(1);
    if($("#deleteAllImgValue").val() == 1 && ((strs.length-1)+str.length) >=8){
        $("#alertTitle").html("");
        $("#testTest").append("<button type='button' onclick='uploadImgForThis()' class='layui-btn' id='test3'>继续上传</button>")
        upload.render({
            elem: '#test3',
            url: '/newTraceSource/newUpLoadImg',
            multiple: true,
            before: function (obj) {
                obj.preview(function (index, file, result) {
                    $('#demo3').append('<img width="70" height="70" src="'+result+'" alt="'+file.name+'" class="layui-upload-img">')
                });
                if($("#deleteAllImgValue").val() == 1){
                    if(flag == 7){
                        $("#test3").remove();
                        $("#alertTitle").html("提示：图片到达最大上传数量");
                    }
                }else{
                    if(strs.length == 8){
                        $("#test3").remove();
                        $("#alertTitle").html("提示：图片到达最大上传数量");
                    }
                }
                if((strs.length+str.length) == 8 && $("#deleteAllImgValue").val() == 0){
                    $("#test3").remove();
                    $("#alertTitle").html("提示：图片到达最大上传数量");
                }
            },
            done: function (res) {
                if (!res.code > 0) {
                    str[flag] = res.url;
                    flag++;
                }
            }
        });
    }
});
//提交, 参数为提交路径
function submitImgUrl(submitUrl, appendSubmitUrl){
    if(str.length != 0){
        if((str.length+strs.length-1) > 8 && $("#deleteAllImgValue").val() == 0){
            layer.msg("达到图片最大上传数量，请先清空")
            return;
        }
        if($("#deleteAllImgValue").val() == 1){
            $.ajax({
                type: "post",
                url: "/newTraceSource/"+submitUrl+"",
                data: "data="+str+"&sendId="+parent.getId(),
                success: function (data) {
                    if (data.state == 'success') {
                        layer.msg("修改成功");
                        setTimeout(function(){
                            document.location.reload();
                        }, 500);
                    } else {
                        layer.msg(data.msg);
                    }
                }
            });
        }else{
            $.ajax({
                type: "post",
                url: "/newTraceSource/"+appendSubmitUrl+"",
                data: "data="+str+"&sendId="+parent.getId()+"&oldImg="+strs,
                success: function (data) {
                    if (data.state == 'success') {
                        layer.msg("修改成功");
                        setTimeout(function(){
                            document.location.reload();
                        }, 500);
                    } else {
                        layer.msg(data.msg);
                    }
                }
            });
        }
    }else{
        layer.msg("图片不能为空");
    }
};