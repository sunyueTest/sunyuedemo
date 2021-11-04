$.fn.InitCamera = function(options){
        var defaults ={
            cameraId:'77',
            url:'../cameraManage/getPlayerAddress'

        };
        var options = $.extend(defaults, options);
        var $this = $(this);

        //清除原有player
        if($("#player")){
            $("#player").remove();
        }
        if($("#playerNoData")){
            $("#playerNoData").remove();
        }

//创建新的player
        var $player = $('<video  id="player" style="width: 100%; height: 100%;" poster="" controls playsInline webkit-playsinline autoplay></video>');
        var $rtmpHd = $('<source id="rtmpHd" type="rtmp/flv"/>');
        var $hlsHd = $('<source id="hlsHd" type="application/x-mpegURL"/>');
        $rtmpHd.appendTo($player);
        $hlsHd.appendTo($player);
        $player.appendTo($this);
        var $playerNoData = $('<div id="playerNoData" style = "height: 100%; width: 100%; text-align: center;position:absolute;top:0; background-color: #ff3800;></div>');
        var $nomsg = $("<span class='nomsg' style ='position:absolute;left:0.5rem;'></span>");
        var $img = $('<img src="../static/img/playBtn.png" style="width: 4rem; margin-top: 3rem />');
        $nomsg.appendTo($playerNoData);
        $img.appendTo($playerNoData);
        $playerNoData.appendTo($this);

        if(options.cameraId!=""){
            $.ajax({
                type: "POST",
                url: options.url,
                data: {
                    id:options.cameraId
                },
                dataType: "json",
                success: function (res) {
                    if (res.state == 'success') {
                        var data = res.data;
                        var rtmpHd = document.getElementById("rtmpHd");
                        rtmpHd.src = data.rtmpHd;
                        var player = new EZUIPlayer('player');
                        $("#player").show();
                        $("#playerNoData").hide();
                    }else {
                        $("#playerNoData").find(".nomsg").text(res.msg).css("display", "block");
                    }
                },
                error: function (e) {

                }
            });
        }



};