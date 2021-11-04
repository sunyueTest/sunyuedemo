package com.jxctdzkj.cloudplatform.controller;

import com.jxctdzkj.cloudplatform.bean.FarmInfoBean;
import com.jxctdzkj.cloudplatform.bean.ProjectBean;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import java.util.HashMap;

import lombok.extern.slf4j.Slf4j;

/**
 * <pre>
 *     @author  : FlySand
 *     @e-mail  : 1156183505@qq.com
 *     @time    : 2018/10/17.
 *     @desc    :
 * </pre>
 */
@Slf4j
@Controller
public class ViewController {
    /**
     * 用户绑定设备
     *
     * @return
     */
    @RequestMapping("boundDevice")
    public String boundDevice() {
        log.info("用户绑定设备页面");
        return "device/boundDevice";
    }

    /**
     * 地图选点
     *
     * @return
     */
    @RequestMapping("selectPoint")
    public ModelAndView selectPoint(Double longitude, Double latitude) {
        log.info("地图选点页面");
        if (longitude == null) {
            longitude = 122.0963;
        }
        if (latitude == null) {
            latitude = 37.5119;
        }
        HashMap<String, Double> position = new HashMap<>();
        position.put("longitude", longitude);
        position.put("latitude", latitude);
        return new ModelAndView("selectPoint", "position", position);
    }

    /**
     * 指令列表
     *
     * @return
     */
    @RequestMapping("commandList")
    public String commandList() {
        log.info("指令列表页面");
        return "command/commandList";
    }

    /**
     * 下发指令
     *
     * @return
     */
    @RequestMapping("sendCommand")
    public String sendCommand() {
        log.info("下发指令页面");
        return "command/sendCommand";
    }

    /**
     * 查询设备指令
     *
     * @return
     */
    @RequestMapping("selectDeviceType")
    public String selectDeviceType() {
        log.info("查询设备指令页面");
        return "command/selectDeviceType";
    }

    /**
     * 列表显示
     *
     * @return
     */
    @RequestMapping("groupDevice")
    public String groupDevice() {
        log.info("设备列表显示页面");
        return "groupDevice";
    }

    /**
     * 图形化显示
     *
     * @return
     */
    @RequestMapping("dashboard")
    public String dashboard() {
        log.info("图形化显示页面");
        return "dashboard";
    }

    /**
     * 设备体检
     *
     * @return
     */
    @RequestMapping("examination")
    public String examination() {
        log.info("设备体检页面");
        return "examination";
    }

    /**
     * 设备历史记录
     *
     * @return
     */
    @RequestMapping("deviceHistory")
    public String deviceHistory() {
        log.info("设备历史记录页面");
        return "deviceHistory";
    }

    /**
     * 轨迹回放
     *
     * @return
     */
    @RequestMapping("trajectoryReplay")
    public String trajectoryReplay() {
        log.info("轨迹回放");
        return "trajectoryReplay";
    }

    /**
     * 中性管理
     *
     * @return
     */
    @RequestMapping("neutral")
    public String neutral() {
        log.info("中性管理页面");
        return "neutral";
    }

    /**
     * 修改密码
     *
     * @return
     */
    @RequestMapping("changePassword")
    public String changePassword() {
        log.info("修改密码页面");
        return "user/changePassword";
    }

    /**
     * 触发器列表
     *
     * @return
     */
    @RequestMapping("triggerList")
    public String triggerList() {
        log.info("触发器列表");
        return "trigger/triggerList";
    }

    /**
     * 添加触发器
     *
     * @return
     */
    @RequestMapping("addTrigger")
    public ModelAndView addTrigger() {
        log.info("添加触发器页面");
        return new ModelAndView("trigger/addTrigger", "addAll", false);

    }

    /**
     * 一键添加触发器
     *
     * @return
     */
    @RequestMapping("addTriggerAll")
    public ModelAndView addTriggerAll() {
        log.info("一键添加触发器页面");
        return new ModelAndView("trigger/addTrigger", "addAll", true);
    }


    /**
     * 触发历史
     *
     * @return
     */
    @RequestMapping("triggerHistory")
    public String triggerHistory() {
        log.info("添加触发器页面");
        return "trigger/triggerHistory";
    }

    @RequestMapping("agreement")
    public String demo() {
        log.info("用户协议");
        return "protocol/agreement";
    }

    @RequestMapping("privacy")
    public String privacy() {
        log.info("隐私政策");
        return "protocol/privacy";
    }

    /*
    水产报警设置
     */
    @RequestMapping("/alarmSettings")
    public String alarmSettings() {
        log.info("水产报警设置");
        return "aquaculture/alarm/alarmSettings";
    }

    /*
    添加水产报警设置
     */
    @RequestMapping("/addAlarm")
    public String addAlarm() {
        log.info("添加水产报警设置");
        return "aquaculture/alarm/addAlarm";
    }

    /*
    水产报警列表
     */
    @RequestMapping("/alarmList")
    public String alarmList() {
        log.info("水产报警列表");
        return "aquaculture/alarm/alarmList";
    }

    /*
    水产报警历史列表
     */
    @RequestMapping("/alarmHistory")
    public String alarmHistory() {
        log.info("水产报警历史列表");
        return "aquaculture/alarm/alarmHistory";
    }

    /**
     * 水产定时任务管理跳转
     *
     * @return
     */
    @RequestMapping("/toTimedTaskManage")
    public String toTimedTaskManage() {
        log.info("定时任务管理");
        return "aquaculture/timedTaskManage/timedTaskManage";
    }

    /**
     * 水产定时任务管理-新增
     *
     * @return
     */
    @RequestMapping("/toTimedTaskManageAdd")
    public String toTimedTaskManageAdd() {
        log.info("定时任务管理");
        return "aquaculture/timedTaskManage/timedTaskManageAdd";
    }

    /**
     * 水产定时任务管理-列表
     *
     * @return
     */
    @RequestMapping("/toTimedTaskManageList")
    public String toTimedTaskManageList() {
        log.info("定时任务管理");
        return "aquaculture/timedTaskManage/timedTaskManageList";
    }

    /**
     * 组态应用管理
     *
     * @return
     */
    @RequestMapping("/conditionConfig2")
    public String conditionConfig() {
        log.info("组态应用管理");
        return "aquaculture/conditionConfig/conditionConfig";
    }

    /**
     * 水产定时任务管理-历史
     *
     * @return
     */
    @RequestMapping("/toTimedTaskManageHistory")
    public String toTimedTaskManageHistory() {
        log.info("定时任务管理");
        return "aquaculture/timedTaskManage/timedTaskManageHistory";
    }

    /**
     * 行业赋能列表-
     *
     * @return
     */
    @RequestMapping("/industryAbility")
    public String list() {
        log.info("行业赋能列表");
        return "monitor/industryAbility";
    }

    /**
     * 行业赋能列表-
     *
     * @return
     */
    @RequestMapping("/iA")
    public String iA() {
        log.info("行业赋能列表");
        return "redirect:industryAbility";
    }


    /**
     * @return
     */
    @RequestMapping("/bohaiBay")
    public String bohaiBay() {
        log.info("溯源");
        return "bohaiBay/bohaiBay";
    }

    /**
     * 曲线分析
     */
    @RequestMapping("curveAnalysis")
    public String curveAnalysis() {
        log.info("曲线分析页面");
        return "curve/curveAnalysis";
    }

    /**
     * 大棚详情大屏
     */
    @RequestMapping("greenhouseDetail")
    public ModelAndView greenhouseDetail(String id, String farmName) {
        log.info("智慧大棚详情:id----" + id + "   farmname----" + farmName);
        HashMap<String, Object> data = new HashMap<>();
        data.put("id", id);
        data.put("farmName", farmName);
        return new ModelAndView("monitor/greenhouseDetail", "data", data);
    }

    /**
     * 井盖管理
     */
    @RequestMapping("coverManager")
    public String coverManager() {
        log.info("井盖管理页面");
        return "cover/coverManager";
    }

    /**
     * 杨凌控制机柜大屏(演示账号测试)
     *
     * @return
     */
    @RequestMapping(value = "toYanglingControlScreen")
    public ModelAndView toYanglingControlScreen(String id, String farmName) {
        HashMap<String, String> data = new HashMap<>();
        data.put("id", id);
        data.put("farmName", farmName);
        return new ModelAndView("monitor/yanglingControlScreen", "data", data);
    }


    /**
     * 井盖管理
     */
    @RequestMapping("agricultureIndex")
    public String agricultureIndex() {
        log.info("agricultureIndex");
        return "agriculture/agricultureIndex";
    }

    /**
     * 种植物联网
     */
    @RequestMapping("plantingSystem")
    public String plantingSystem() {
        log.info("plantingSystem");
        return "agriculture/plantingSystem";
    }

    /**
     * 加工物联网管理系统
     */
    @RequestMapping("ioTRegulate")
    public String ioTRegulate() {
        log.info("ioTRegulate");
        return "agriculture/ioTRegulate";
    }

    /**
     * 井盖管理
     */
    @RequestMapping("machiningSystem")
    public ModelAndView machiningSystem() {
        log.info("machiningSystem");
//        HashMap<String,Object> data = new HashMap<>();
//        data.put("bean",new Project());
        ProjectBean bean = new ProjectBean();
        return new ModelAndView("agriculture/agricultureAdmin/machiningSystem", "bean", bean);
    }


    /**
     * 井盖管理
     */
    @RequestMapping("newFlowerRoom")
    public String newFlowerRoom() {
        log.info("newFlowerRoom");
        return "monitor/newFlowerRoom";
    }

    /**
     * 物联网仓库
     */
    @RequestMapping("storage")
    public String storage() {
        log.info("storage");
        return "agriculture/storage";
    }

    /**
     * 溯源信息
     */
    @RequestMapping("traceabilityInformation")
    public String traceabilityInformation() {
        log.info("traceabilityInformation");
        return "agriculture/traceabilityInformation";
    }

    /**
     * 气象灾害预警系统
     */
    @RequestMapping("meteorologicalWarning")
    public String meteorologicalWarning() {
        log.info("meteorologicalWarning");
        return "monitor/meteorologicalWarning";
    }
    /**
     * 投入品农事监管系统
     */
    @RequestMapping("farmerManagement")
    public String farmerManagement() {
        log.info("farmerManagement");
        return "monitor/farmerManagement";
    }

    /**
     * 大棚控制系统
     */
    @RequestMapping("greenhouseDetailControl")
    public ModelAndView greenhouseDetailControl() {
        log.info("greenhouseDetailControl");
        return new ModelAndView("monitor/greenhouseDetailControl", "data", new FarmInfoBean());
    }


    /**
     * 路径导航（工厂）
     */
    @RequestMapping("pathNavigation")
    public String pathNavigation() {
        return "pathNavigation/factoryPathNavigation";
    }

    /**
     * 延安市智慧农业调度指挥中心--最新
     *
     * @return
     */
//    @RequestMapping(value = "yanAnNewB")
    public String plot() {
        return "redirect:plot/index.html";
    }

    @RequestMapping(value = "toPlot")
    public ModelAndView toPlot(){
        return new ModelAndView(plot());
    }
}
