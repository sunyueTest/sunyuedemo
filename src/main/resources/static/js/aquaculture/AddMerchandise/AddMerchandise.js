
//__________富文本__________________________________________________________________________________
//
var editor;
KindEditor.ready(function(K) {
    editor = K.create('textarea[name="content"]',{
        uploadJson : '../goodsManage/uploadImg',
    });
    // var text = [[${data}]];
    // editor.html(text);
});
var ftext='';
function submit(){
    editor.sync();
    ftext=editor.html();
    console.log(editor.html())
    //保存数据
    // $.ajax({
    //     url: "../home/saveHelpDetail",
    //     type : "POST",
    //     data: {
    //         content:$('#demo').val()
    //     },
    //     dataType: "json",
    //     success: function (result) {
    //         layer.msg($.i18n.prop('success'));
    //         $('.layui-layer-close').click();
    //         console.log(result)
    //     }
    // });
}

//______________________ 表单_________________________________________________


var goodsName=document.getElementById('goodsName');
var descr=document.getElementById('descr');
var price=document.getElementById('price');
var num=document.getElementById('num');
var a1=document.getElementById('a1');

var intArray = ''
var data=''




a1.onclick=function () {

    picArry=JSON.stringify(picArry);
    console.log(picArry);
    $.ajax({
        type: "POST",
        url: "../goodsManage/addGoods",
        data:{
            goodsName:goodsName.value,
            descr:descr.value,
            price:price.value,
            store:num.value,
            leftImgs:picArry,
            goodsAttr:ftext
        },
        dataType: "json",
        success: function (res) {

            console.log('成功')
        }
    })

}










//______________图片长传______________________________________________________________
//1
var picArry=new Array();
layui.use('upload', function(){
    var $ = layui.jquery
        ,upload = layui.upload;

    //普通图片上传
    var uploadInst = upload.render({
        elem: '#test1'
        ,url: '../goodsManage/uploadFile/'
        ,before: function(obj){
            //预读本地文件示例，不支持ie8
            obj.preview(function(index, file, result){
                $('#demo1').attr('src', result); //图片链接（base64）
            });
        }
        ,done: function(res){
            //如果上传失败
            if(res.code > 0){
                return layer.msg('上传失败');
            }
            //上传成功
            console.log(res.url)
            var img={
                sort:1,
                src:res.url
            }
            picArry.push(img)
        }
        ,error: function(){
            //演示失败状态，并实现重传
            var demoText = $('#demoText1');
            demoText.html('<span style="color: #FF5722;">上传失败</span> <a class="layui-btn layui-btn-xs demo-reload">重试</a>');
            demoText.find('.demo-reload').on('click', function(){
                uploadInst.upload();
            });
        }
    });
    //2
    var uploadInst2 = upload.render({
        elem: '#test2'
        ,url: '../goodsManage/uploadFile/'
        ,before: function(obj){
            //预读本地文件示例，不支持ie8
            obj.preview(function(index, file, result){
                $('#demo2').attr('src', result); //图片链接（base64）
            });
        }
        ,done: function(res){
            //如果上传失败
            if(res.code > 0){
                return layer.msg('上传失败');
            }
            //上传成功
            var img={
                sort:2,
                src:res.url
            }
            picArry.push(img);
        }
        ,error: function(){
            //演示失败状态，并实现重传
            var demoText = $('#demoText2');
            demoText.html('<span style="color: #FF5722;">上传失败</span> <a class="layui-btn layui-btn-xs demo-reload">重试</a>');
            demoText.find('.demo-reload').on('click', function(){
                uploadInst2.upload();
            });
        }
    });
    //3
    var uploadInst3 = upload.render({
        elem: '#test3'
        ,url: '../goodsManage/uploadFile/'
        ,before: function(obj){
            //预读本地文件示例，不支持ie8
            obj.preview(function(index, file, result){
                $('#demo3').attr('src', result); //图片链接（base64）
            });
        }
        ,done: function(res){
            //如果上传失败
            if(res.code > 0){
                return layer.msg('上传失败');
            }
            //上传成功
            var img={
                sort:3,
                src:res.url
            }
            picArry.push(img)
        }
        ,error: function(){
            //演示失败状态，并实现重传
            var demoText = $('#demoText3');
            demoText.html('<span style="color: #FF5722;">上传失败</span> <a class="layui-btn layui-btn-xs demo-reload">重试</a>');
            demoText.find('.demo-reload').on('click', function(){
                uploadInst3.upload();
            });
        }
    });
    //4
    var uploadInst4 = upload.render({
        elem: '#test4'
        ,url: '../goodsManage/uploadFile/'
        ,before: function(obj){
            //预读本地文件示例，不支持ie8
            obj.preview(function(index, file, result){
                $('#demo4').attr('src', result); //图片链接（base64）
            });
        }
        ,done: function(res){
            //如果上传失败
            if(res.code > 0){
                return layer.msg('上传失败');
            }
            //上传成功
            var img={
                sort:4,
                src:res.url
            }
            picArry.push(img)
        }
        ,error: function(){
            //演示失败状态，并实现重传
            var demoText = $('#demoText4');
            demoText.html('<span style="color: #FF5722;">上传失败</span> <a class="layui-btn layui-btn-xs demo-reload">重试</a>');
            demoText.find('.demo-reload').on('click', function(){
                uploadInst4.upload();
            });
        }
    });
    //5
    var uploadInst5 = upload.render({
        elem: '#test5'
        ,url: '../goodsManage/uploadFile/'
        ,before: function(obj){
            //预读本地文件示例，不支持ie8
            obj.preview(function(index, file, result){
                $('#demo5').attr('src', result); //图片链接（base64）
            });
        }
        ,done: function(res){
            //如果上传失败
            if(res.code > 0){
                return layer.msg('上传失败');
            }
            //上传成功
            var img={
                sort:5,
                src:res.url
            }
            picArry.push(img)
        }
        ,error: function(){
            //演示失败状态，并实现重传
            var demoText = $('#demoText5');
            demoText.html('<span style="color: #FF5722;">上传失败</span> <a class="layui-btn layui-btn-xs demo-reload">重试</a>');
            demoText.find('.demo-reload').on('click', function(){
                uploadInst5.upload();
            });
        }
    });







});







