package com.jxctdzkj.cloudplatform.config;

import org.nutz.dao.Cnd;
import org.springframework.context.annotation.Condition;
import org.springframework.context.annotation.ConditionContext;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.type.AnnotatedTypeMetadata;

import lombok.extern.slf4j.Slf4j;

/**
 * <pre>
 *     author  : FlySand
 *     e-mail  : 1156183505@qq.com
 *     time    : 2018/7/31.
 *     desc    :
 * </pre>
 */
@Slf4j
@Configuration
public class Constant extends com.jxctdzkj.support.config.Constant implements Condition {

    public static class Project {
        public static boolean SEND_SMS = false;
        public static boolean SEND_EMIL = false;
        //是否进行版本验证 免费版
        public static boolean VERSION_CHECK = false;
        //        30天试用
        public static boolean TRY_OUT = false;
        // 中性管理过期时间
        public static final int CUSTOMIZATION_TIME = 180;

    }

    // 摄像头类型
    public static class CameraType {

        // 海康
        public static final String HAI_KANG = "1";

        // 大华
        public static final String DA_HUA = "2";
    }

    public static class Redis {
        public static boolean ENABLE = false;
        public static boolean DEBUG = false;
    }

    /**
     * 平台私有化配置
     */
    public static class Privatisation {
        // 是否开启私有化部署\\\
        public static final boolean PRIVATISATION = false;
        //        陈阳-上海工地   0
//         陈阳-河北-安国 1
//        张奇鹏-年年好 2
//        王致远-物联网管理平台 3
        public static final int SYSTEM_SELL_TYPE = 2;
       //        在线认证
        public static boolean LICENCE = false;
        // 页面title
        public static String SYSTEM_NAME = "精讯云";
        // 平台公司名称
        public static String COMPANY_NAME = "精讯畅通电子科技";
        // 平台公司logo图片地址
        public static String COMPANY_LOGO_URL;
        public static boolean INDEX_LOGO_SHOW = true;
        // 主页是否显示用户协议
        public static boolean SHOW_USER_AGREEMENT = true;
        // 主页是否显示帮助文档
        public static boolean SHOW_HELP_DOCS = true;
        // 是否开启登录页面的注册功能
        public static boolean REGISTERED_FUNCTION = true;
        // 发送继电器开关指令后是否修改本地数据库的继电器状态
        public static boolean UPDATE_LOCAL_RELAY_STATE = false;
        //认证秘钥
        public static String LICENCE_KEY = "";
        //主页是否显示微信小程序
        public static boolean WECHAT_APPLET_SHOW = true;

    }

    /**
     * websocket链接地址配置
     */
    public static class Address {
        //        报警推送
        public static String SOCKET = "ws://localhost:8080/websocket?";
        //        专家实时会话（在线诊断）
        public static String SOCKET_TOPIC = "ws://localhost:8198";
        //        二维码
        public static final String QRCODE = "http://localhost:8083/file/a9335e0e8e964046a5cfeba55a0cca28.jpeg";
        //        帮助文档地址
        public static final String HELP_DOCS = "http://docs.sennor.net";
        //一键报警 和 智慧公厕
        public static final String ALARM = "ws://localhost:1885/websocket?";
    }

    /**
     * webSocket客户端类型
     */
    public static class WebSocketAddressType {
        // 报警推送，对应Address.SOCKET
        public static final int SOCKET = 1;

        // 一键报警，对应Address.ALARM
        public static final int ALARM = 2;


    }

    //天气预警定时时间
    public static final String CRON_TIME = "0 0 8 * * ?";
    //每周一8点查询延安市苹果信息价格
    public static final String FRUITS_TIME = "0 0 8 ? * MON";

    public static final String COOKIE_LANG = "jxct_lang";
    // 农业登录页
    public static final String USER_TYPE_FARM = "farm";


    // 用户登录类型
    public static final String USER_TYPE = "userType";
    // 演示登录界面用户名
    public static final String DEMO_USER_NAME = "demoUser";
    // 演示登录界面密码
    public static final String DEMO_PASSWORD = "demoPwd";

    public static final String GOODS_PRIFIX = "GD-";

    public static final String IMG_LOCATION_LEFT = "leftImg";

    //萤石云开放平台域名
//    public static final String YS7_ADDRESS = "https://open.ys7.com";
    public static String YS7_ADDRESS = "https://localhost:8443";


    @Override
    public boolean matches(ConditionContext conditionContext, AnnotatedTypeMetadata annotatedTypeMetadata) {
        return Redis.DEBUG;
    }

    public static class DeviceType {
        //以太网温湿度
        public static final int HUMIDITY = 0;
        //nb设备
        public static final int NB = 1;
        //网络继电器
        public static final int RELAY = 2;
        //噪声扬尘 - 指令下发（改屏幕标题显示）
        public static final int DUST = 3;
        //NB全网通
        public static final int ALLNET = 4;
        //LoRa
        public static final int LORA = 5;
        //NB全网通带下发指令
        public static final int ALLNET_COMMAND = 6;
        //NB GPS
        public static final int NB_GPS = 7;
        //智慧井盖，带加密校验
        public static final int WELL_COVER = 8;
        //LoRa 温湿度
        public static final int LORA_HUMIDITY = 9;
        //LoRa 继电器
        public static final int LORA_RELAY = 10;
        //电信井盖
        public static final int NB_TELECOM_WELL_COVER = 11;
        //Mqtt LoRaWan 继电器
        public static final int LORA_WAN_RELAY = 12;
        //Mqtt LoRaWan 温湿度
        public static final int LORA_WAN_HUMIDITY = 13;
        //国控站数据校准
        public static final int NATIONAL_STANDARD = 14;
        //一键报警器
        public static final int KEY_ALARM = 15;


    }

    public static class FarmInfoType {
        //王致远项目——场景
        public static final int SCENE = 1;
    }

    /**
     * 王志远项目-场景分类
     */
    public static class SceneType {
        public final static int CULTIVATION = 0;//养殖场景
        public final static int WORKING = 1;//加工场景
    }

    public static class Url extends com.jxctdzkj.support.config.Constant.Url {
        public static final String FILE_BASE_URL = "http://localhost:885";
        public static final String FILE_UPLOAD_URL = FILE_BASE_URL + "/file/upload";
        public static final String FILE_DOWNLOAD_PATH = FILE_BASE_URL + "/file/";
        public static final String FILE_DELETE_URL = FILE_BASE_URL + "/file/delete";
        public static final String COMMAND_URL = "http://localhost:8086/device/sendRelayCommand";
        public static final String LORA_COMMAND_URL = "http://localhost:8084/device/sendLoraRelayCommand";
        public static final String LORA_WAN_COMMAND_URL = "http://localhost:1882/device/sendRelayCommand";
    }

    public static class ModifyType {
        public final static String SAVE = "新建";
        public final static String UPDATE = "编辑";
        public final static String DELETE = "删除";
    }

    /**
     * 摄像头使用场景类型
     */
    public static class CameraAppType {
        //大棚/农场
        public final static int DAPENG = 1;
        //王致远项目-场景
        public final static int SCENE = 2;

    }



    /**
     * 专家文章大类型
     */
    public static class Category {
        public final static int CATEGORY0 = 0;//农业政府平台
    }


    /**
     * 判断设备是否是继电器
     *
     * @param deviceType 设备类型
     * @return
     */
    public static boolean isRelayDevice(int deviceType) {

        return deviceType == Constant.DeviceType.RELAY || deviceType == Constant.DeviceType.LORA_RELAY || deviceType == Constant.DeviceType.LORA_WAN_RELAY;
    }


    /**
     * 判断设备是否是继电器
     *
     * @return
     */
    public static Cnd isRelayDevice(Cnd cnd) {
        Cnd condition;
        if (cnd == null) {
            condition = Cnd.NEW().where("device_type", "=", Constant.DeviceType.RELAY);
        } else {
            condition = cnd.and("device_type", "=", Constant.DeviceType.RELAY);
        }
        return condition.or("device_type", "=", Constant.DeviceType.LORA_RELAY).or("device_type", "=", Constant.DeviceType.LORA_WAN_RELAY);
    }

}
