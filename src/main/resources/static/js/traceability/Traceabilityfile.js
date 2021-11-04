layui.use(['laydate','upload'], function(){
  var upload = layui.upload,laydate=layui.laydate;
    //执行一个laydate实例
    laydate.render({
        elem: '#productDate' //指定元素
    });
   //普通图片上传
   var uploadInst1=upload.render({
    elem: '#test1'
    ,url: '/traceSource/uploadFile/'
    ,before: function(obj){
      //预读本地文件示例，不支持ie8
      obj.preview(function(index, file, result){
        $('#demo1').attr('src', result); //图片链接（base64）
      });
    }
    ,done: function(res){
      //如果上传失败
      if(res.state == 'success'){
          console.log(res.url);
        $("#imgSrc").val(res.url);
      }else{
           layer.msg('上传失败');
      }
      //上传成功
    }
    ,error: function(){
      //演示失败状态，并实现重传
      var demoText = $('#demoText');
      demoText.html('<span style="color: #FF5722;">上传失败</span> <a class="layui-btn layui-btn-xs demo-reload">重试</a>');
      demoText.find('.demo-reload').on('click', function(){
        uploadInst1.upload();
      });
    }
  });

    var uploadInst2=upload.render({
        elem: '#test2'
        ,url: '/traceSource/uploadFile/'
        ,before: function(obj){
            //预读本地文件示例，不支持ie8
            obj.preview(function(index, file, result){
                $('#demo2').attr('src', result); //图片链接（base64）
            });
        }
        ,done: function(res){
            //如果上传失败
            if(res.state == 'success'){
                console.log(res.url);
                $("#imgSrc2").val(res.url);
            }else{
                layer.msg('上传失败');
            }
            //上传成功
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

   var uploadInst3= upload.render({
        elem: '#test3'
        ,url: '/traceSource/uploadFile/'
        ,before: function(obj){
            //预读本地文件示例，不支持ie8
            obj.preview(function(index, file, result){
                $('#demo3').attr('src', result); //图片链接（base64）
            });
        }
        ,done: function(res){
            //如果上传失败
            if(res.state == 'success'){
                console.log(res.url);
                $("#imgSrc3").val(res.url);
            }else{
                layer.msg('上传失败');
            }
            //上传成功
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


    $('#file-bnt').click(function(){
    var name=$('#name').val();
      var productCode=$('#productCode').val();
      var productTime=$('#productDate').val();
      var enterprise=$('#enterprise').val();
      var specs=$('#specs').val();
      var originPlace=$('#originPlace').val();
      var feedSource=$('#feedSource').val();
      var seedSource=$('#seedSource').val();
      var drugUse=$('#drugUse').val();
      var testService=$('#testService').val();
      var processService=$('#processService').val();
      var logistics=$('#logistics').val();
      var imgSrc= $("#imgSrc").val();
        var imgSrc2= $("#imgSrc2").val();
        var imgSrc3= $("#imgSrc3").val();

      $.ajax({
          type: "post",
          url: "/traceSource/addTraceSource",
          timeout: 30000,
          data: {
              name: name,
              productCode: productCode,
              productTime:productTime,
              enterprise:enterprise,
              specs:specs,
              originPlace:originPlace,
              feedSource:feedSource,
              seedSource:seedSource,
              drugUse:drugUse,
              testService:testService,
              processService:processService,
              logistics:logistics,
              imgSrc:imgSrc,
              imgSrc2:imgSrc2,
              imgSrc3:imgSrc3
          }, error: function (data, type, err) {
              console.log(err);
              layer.closeAll('loading');
              layer.msg($.i18n.prop('fail'), {
                  offset: '6px'
              });
          },
          success: function (data) {
              layer.closeAll('loading');
              if (data.state == 'success') {
                  layer.msg("创建成功");
                  window.location.href="/traceSource/traceList";
              } else {
                  layer.msg($.i18n.prop(data.msg));
              }
          }

      });

  });
  
  
})