$(function(){
    // $.post("../demoAddress/getList", {"page":1, "size": 100, "status":1}, function (res) {
    //     if (res.state == 'success') {
    //         let datas = res.datas;
    //         let html = "";
    //         for(let i = 0; i < datas.length; i++){
    //             html += "<div class='item'>" +
    //                 "<img class='itemImg findItem' src='"+datas[i].imgUrl+"' data-myUrl='"+datas[i].address+"'data-user='"+datas[i].userName+"'data-pwd='"+datas[i].password+"'/> " +
    //                 "<div class='itemMsgBox'>" +
    //                 "<span class='itemName findItem' data-myUrl='"+datas[i].address+"'data-user='"+datas[i].userName+"'data-pwd='"+datas[i].password+"'>"+datas[i].demoName+"</span>" +
    //                 "<span class='more' data-user='"+datas[i].userName+"'data-pwd='"+datas[i].password+"' data-myUrl='"+datas[i].address+"'>一键复制</span>" +
    //                 // "<span class='copy' data-myUrl='"+datas[i].address+"'>复制地址</span>" +
    //                 "</div>" +
    //                 "</div>"
    //         }
    //         $("#itemBoxDiv").html(html);
    //     }
    // });



    function getList(page){
        $.post("../demoAddress/getList", {"page":page, "size": 8, "status":1}, function (res) {
            if (res.state == 'success') {
                console.log(res);
                let datas = res.datas;
                let html = "";
                for(let i = 0; i < datas.length; i++){
                    html +='<div class="main-box">\n' +
                        '            <div class="mianbox-pic main-boxa">\n' +
                        '                <img src="'+datas[i].imgUrl+'" data-myUrl="'+datas[i].address+'" data-user="'+datas[i].userName+'" data-pwd="'+datas[i].password+'"   alt="">\n' +
                        '            <div class="mianbox-bnt" data-myUrl="'+datas[i].address+'" data-user="'+datas[i].userName+'" data-pwd="'+datas[i].password+'">一键复制</div>\n'+
                        '            </div>\n' +
                        '            <div class="mainbox-title main-boxa">\n' +
                        '                <p>'+datas[i].demoName+'</p>\n' +
                        '            </div>\n' +
                        '            <div class="mainsrc" data-myUrl="'+datas[i].address+'" data-user="'+datas[i].userName+'" data-pwd="'+datas[i].password+'"></div>\n'+
                        '            </div>'
                }
                // let mainint='<div class="main-int" id="mainint'+page+'"></div>';
                // $('#main').append(mainint);
                // let id='#mainint'+page;
                $('#mainint').append(html);
            }
        });
    }
    getList(1);
    $(document).on('click', '.mainsrc', function () {
        let url = $(this).attr('data-myUrl');
        let user = $(this).attr('data-user');
        let pwd = $(this).attr('data-pwd');
        setCookie("userType", url, 30);
        setCookie("demoUser", user, 30);
        setCookie("demoPwd", pwd, 30);
        window.open("../doLogin");
    });
    // /**
    //  * 复制选择的大屏的访问地址
    //  */
    // $(document).on('click', '.copy', function () {
    //     let url = $(this).attr('data-myUrl');
    //     var curWwwPath = window.document.location.href.replace("industryAbility","");
    //     var oInput = document.createElement('input');
    //     oInput.value = curWwwPath+"doLogin="+url;
    //     document.body.appendChild(oInput);
    //     oInput.select(); // 选择对象
    //     document.execCommand("Copy"); // 执行浏览器复制命令
    //     oInput.className = 'oInput';
    //     oInput.style.display = 'none';
    //     layui.use('layer', function () {
    //         layer.msg("复制成功");
    //    })
    // });
    /**
     * 复制选择的大屏的账号密码
     */
    $(document).on('click', '.mianbox-bnt', function () {
        let user = $(this).attr('data-user');
        let pwd = $(this).attr('data-pwd');
        let url = $(this).attr('data-myUrl');
        var curWwwPath = window.document.location.href.replace("industryAbility","");
        var oInput = document.createElement('textarea');
        oInput.value = "访问地址："+curWwwPath+"doLogin="+url+"\n"+
            "账号："+user+"\n"+
            "密码："+pwd
        document.body.appendChild(oInput);
        oInput.select(); // 选择对象
        document.execCommand("Copy"); // 执行浏览器复制命令
        oInput.className = 'oInput';
        oInput.style.display = 'none';
        layui.use('layer', function () {
            layer.msg("复制成功");
        })
    });



    $(document).ready(function(){
        $(window).bind('scroll',function(){
            show()
        });
        function show(){
            if($(window).scrollTop()+$(window).height()>=$(document).height()){
                read();
            }
        }
        function read(){
            // alert('111');
        }
    });



    var n = 1;

    $(window).scroll(function () {
        if ($(window).scrollTop()+5 > $(document).height() - $(window).height()) {
            n++;
            console.log(n)
            getList(n)
        }
    });



});




