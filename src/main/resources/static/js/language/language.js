/**
 * 选择要显示的国际化的语言
 * @param lang
 */
function selectLang(lang) {
    $.ajax({url:"/language/setLanguage",
        data: { lang: lang},
        success:function(result){
            location.reload();
        }
    });
}

/**
 * 读取国际化后的文字
 * @param code 国际化的基础字段
 * @returns {string}
 */
function loadProperties(code) {
    let codeVal = "";
    $.ajax({
        url: "/language/getlanguageVal?code="+code,
        async: false,
        success: function(data){
            codeVal = data;
        }
    });
    return codeVal;
}

layui.use("table", function() {
    let table = layui.table;
    table.render({
        id: "tableLoad",
        elem: "#langTable",
        method: "post",
        url: "/language/getLanguageList",
        where: {code: ""},
        toolbar: '#toolbar', //开启头部工具栏，并为其绑定左侧模板
        defaultToolbar: ['filter', 'exports', 'print'], //默认右侧工具栏
        page: true,  //开启分页
        parseData: function(res){ //res 即为原始返回的数据
            return {
                "code": 0, //解析接口状态
                "msg": res.msg, //解析提示文本
                "count": res.count, //解析数据长度
                "data": res.datas,//解析数据列表
            };
        },
        cols: [[
            {field:'id', align:'center', title: 'ID', fixed: 'left'},
            {field: 'code', align:'center', title: loadProperties("基础字段")},
            {field: 'chinese', align:'center', title: loadProperties("中文")},
            {field: 'english', align:'center', title: loadProperties("英文")},
            {align:'center', title: loadProperties("操作"), toolbar: "#optionBar"}
        ]]
    });

    let $ = layui.$, active = {
        //执行重载
        reload: function() {
            let code = $("#code").val();
            table.reload("tableLoad", {
                page: { curr: 1 },
                where: { code: code}
            });
            //重新赋值查询条件的值，因为table.reload会清空查询条件。
            $("#code").val(code);
        },
        //执行添加
        add: function (){
            layer.open({
                type: 2,
                title: loadProperties("add"),
                area: ['500px', '300px'],
                //iframe的请求地址
                content: "/language/add"
            });
        },
        //执行修改
        edit: function (data){
            layer.open({
                type: 2,
                title: loadProperties("edit"),
                area: ['500px', '300px'],
                //iframe的请求地址
                content: "/language/edit?code="+data.code
            });
        },
        //执行删除
        del: function (data){
            layer.confirm(loadProperties("confirmDelete"), {
                title: loadProperties("info"),
                btn: [loadProperties("yes"), loadProperties("cancel")], icon: 2
            }, function(){
                $.ajax({url:"/language/delByCode",
                    data: { code: data.code},
                    success:function(result){
                        active.reload();
                        layer.closeAll();
                    }
                });
            }, function(){
                layer.closeAll();
            });
        }
    }

    //监听表格顶部工具栏toolbar
    table.on("toolbar(langTableFilter)", function (obj) {
        switch (obj.event) {
            case "search":
                active.reload();
                break;
            case "add":
                active.add();
                break;
            default:
                break;
        }
    });

    //监听表格行工具栏tool
    table.on('tool(langTableFilter)', function (obj) {
        let data = obj.data;
        switch (obj.event) {
            case "edit":
                active.edit(data);
                break;
            case "del":
                active.del(data);
                break;
            default:
                break;
        }
    });

    layui.tableReload = function(){
        active.reload();
    };
});