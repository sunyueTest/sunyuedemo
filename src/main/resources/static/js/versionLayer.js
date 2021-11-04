/**
 * 缴费升级弹窗
 * @param msg
 */
function feeEscalation(msg,num) {
    layer.open({
        title: $.i18n.prop('服务升级'),
        content: $.i18n.prop('您当前使用的是免费版精讯云')+',' + msg + $.i18n.prop('已达到上限')+num+'，'+$.i18n.prop('如需添加更多，请升级为专业版'),
        btn: [$.i18n.prop('残忍拒绝'),$.i18n.prop('点击升级')],
        yes: function (index, layero) {
            //第一个按钮的回调
            layer.close(index);
        },
        btn2: function (index, layero) {
            //第二个按钮的回调
            window.open("http://p.qiao.baidu.com/cps/chat?siteId=13221390&userId=20515774&cp=&cr=&cw=%E4%BA%91%E5%B9%B3%E5%8F%B0");
        },
        skin:'fee-class',
        offset: '100px',
        // area: '370px'
    });
}

/**
 * 续费弹窗
 */
function renewal() {
    layer.open({
        title: $.i18n.prop('账户到期'),
        content: $.i18n.prop('过期续费'),
        btn: [$.i18n.prop('残忍拒绝'),$.i18n.prop('yes')],
        yes: function (index, layero) {
            //第一个按钮的回调
            layer.close(index);
        },
        btn2: function (index, layero) {
            //第二个按钮的回调
            window.open("http://p.qiao.baidu.com/cps/chat?siteId=13221390&userId=20515774&cp=&cr=&cw=%E4%BA%91%E5%B9%B3%E5%8F%B0");
        },
        skin:'fee-class',
        offset: '100px',
        // area: '370px'
    });
}