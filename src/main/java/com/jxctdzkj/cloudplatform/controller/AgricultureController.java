package com.jxctdzkj.cloudplatform.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * <pre>
 *     @author  : FlySand
 *     @e-mail  : 1156183505@qq.com
 *     @time    : 2019/9/3.
 *     @desc    : 农业系统相关页面（王致远客户使用）
 * </pre>
 */
@Controller
@RequestMapping("agriculture")
public class AgricultureController {

    /**
     * 首页数据展示
     */
    @RequestMapping("agricultureIndex")
    public Object agricultureIndex() {
        return "agriculture/agricultureIndex";
    }


    /**
     * 种植物联网管理系统
     */
    @RequestMapping("plantingSystem")
    public Object plantingSystem() {
        return "agriculture/plantingSystem";
    }

    /**
     * 仓储物联网管理系统
     */
    @RequestMapping("storage")
    public Object storage() {
        return "agriculture/storage";
    }
    /**
     * 加工物联网管理系统
     */
    @RequestMapping("ioTRegulate")
    public Object ioTRegulate() {
        return "agriculture/ioTRegulate";
    }

    /**
     * 冷链系统管理系统
     */
    @RequestMapping("coldChain")
    public Object coldChain() {
        return "agriculture/coldChain";
    }

    /**
     * 专家系统
     */
    @RequestMapping("specialistSystem")
    public Object specialistSystem() {
        return "agriculture/agricultureAdmin/specialistSystem";
    }

    /**
     * FarmingPromotion农技推广
     */
    @RequestMapping("farmingPromotion")
    public Object farmingPromotion() {
        return "agriculture/farmingPromotion";
    }

    /**
     * 管理员添加农作物类别页面
     * @User 李英豪
     */
    @RequestMapping("categoryManagement")
    public Object categoryManagement() {
        return "agriculture/agricultureAdmin/categoryManagement";
    }

    /**
     * 专家管理页面（知识库）
     * @User 李英豪
     */
    @RequestMapping("knowledgebase")
    public Object knowledgebase() {
        return "agriculture/agricultureAdmin/knowledgebase";
    }
    /**
     * 专家管理页面（远程诊断）
     * @User 李英豪
     */
    @RequestMapping("remotediagnosis")
    public Object remotediagnosis() {
        return "agriculture/agricultureAdmin/remotediagnosis";
    }
    /**
     * 专家管理页面（信息发布）
     * @User 李英豪
     */
    @RequestMapping("messageissue")
    public Object messageissue() {
        return "agriculture/agricultureAdmin/messageissue";
    }
    /**
     * 专家管理页面（留言系统）
     * @User 李英豪
     */
    @RequestMapping("leaveparoleSystem")
    public Object leaveparoleSystem() {
        return "agriculture/agricultureAdmin/leaveparoleSystem";
    }

    /**
     * 专家管理页面（预约系统）
     * @User 李英豪
     */
    @RequestMapping("orderAdministration")
    public Object orderAdministration() {
        return "agriculture/agricultureAdmin/orderAdministration";
    }

    /**
     * 专家管理页面（评价反馈）
     * @User 李英豪
     */
    @RequestMapping("onlineConsultation")
    public Object onlineConsultation() {
        return "agriculture/agricultureAdmin/onlineConsultation";
    }
    /**
     * 专家管理页面（诊断资源库）
     * @User 李英豪
     */
    @RequestMapping("diagnoseResource")
    public Object diagnoseResource() {
        return "agriculture/agricultureAdmin/diagnoseResource";
    }


    /**
     * 专家审核（管理员）
     * @User 李英豪
     */
    @RequestMapping("specialistManagement")
    public Object userconsult() {
        return "agriculture/agricultureAdmin/specialistManagement";
    }

    /**
     * 管理员管理页面（知识库）
     * @User 李英豪
     */
    @RequestMapping("knowledgebaseAdmin")
    public Object knowledgebaseAdmin() {
        return "agriculture/agricultureAdmin/knowledgebaseAdmin";
    }

    /**
     * 管理员管理页面（信息发布）
     * @User 李英豪
     */
    @RequestMapping("messageissueAdmin")
    public Object messageissueAdmin() {
        return "agriculture/agricultureAdmin/messageissueAdmin";
    }

    /**
     * 查看留言（用户）
     * @User 李英豪
     */
    @RequestMapping("seethemessage")
    public Object seethemessage() {
        return "agriculture/seethemessage";
    }
}
