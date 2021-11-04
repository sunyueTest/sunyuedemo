package com.jxctdzkj.cloudplatform.controller;

import com.jxctdzkj.cloudplatform.bean.AquacultureExpertsBean;
import com.jxctdzkj.cloudplatform.bean.AquacultureExpertsDiagnosisBean;
import com.jxctdzkj.cloudplatform.bean.SysUserBean;
import com.jxctdzkj.cloudplatform.utils.ControllerHelper;
import com.jxctdzkj.cloudplatform.utils.ResultObject;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.nutz.dao.Cnd;
import org.nutz.dao.Dao;
import org.nutz.dao.util.cri.Static;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import java.util.Date;
import java.util.List;

@Controller
@Slf4j
@RequestMapping({"productService"})
public class ProductServiceController {

    @Autowired
    Dao dao;

    /**
     * 专家诊断-选择专家跳转
     * @return
     */
    @RequestMapping(value = "toExpertDiagnosis")
    public ModelAndView toExpertDiagnosis() {
        return new ModelAndView("aquaculture/productService/expertDiagnosis");
    }

    /**
     * 专家诊断-病情描述提交 跳转
     * @return
     */
    @RequestMapping(value = "toIllnessDescription")
    public ModelAndView toIllnessDescription(String expertsId) {
        return new ModelAndView("aquaculture/productService/illnessDescription", "expertsId", expertsId);
    }

    /**
     * 新增专家问诊
     * @return
     */
    @RequestMapping(value = "addExpertsDiagnosis", method = RequestMethod.POST)
    @ResponseBody
    public ResultObject addExpertsDiagnosis(AquacultureExpertsDiagnosisBean paramBean){
        SysUserBean userBean = ControllerHelper.getInstance(dao).getLoginUser();
        if (StringUtils.isBlank(userBean.getUserName())) {
            return ResultObject.error("用户未登录");
        }
        try{
            paramBean.setCreateUser(userBean.getUserName());
            paramBean.setCreateTime(new Date());
            paramBean.setAnswerFlag("0");
            paramBean.setCreateName(userBean.getRealName());
            //新增
            if(dao.insert(paramBean) != null){
                return ResultObject.ok(paramBean);
            }else{
                return ResultObject.apiError("fail");
            }
        }catch (Exception e){
            return ResultObject.apiError("fail");
        }
    }

    /**
     * 获取专家问诊记录
     * @return
     */
    @RequestMapping(value = "getExpertsDiagnosisList")
    @ResponseBody
    public ResultObject getExpertsDiagnosisList(){
        String userName = ControllerHelper.getInstance(dao).getLoginUserName();
        try{
            List<AquacultureExpertsDiagnosisBean> list = dao.query(AquacultureExpertsDiagnosisBean.class, Cnd.where("create_user", "=",  userName).and(new Static("1=1 order by create_time desc")));
            list.forEach(l->{
                AquacultureExpertsBean bean = dao.fetch(AquacultureExpertsBean.class, Cnd.where("id", "=", l.getExpertsId()));
                l.setExpertsPic(bean.getIdCardPicPositive());
                l.setExpertsName(bean.getName());
            });
            return ResultObject.ok(list);
        }catch (Exception e){
            return ResultObject.apiError("fail");
        }
    }

    /**
     * 更多专家问诊记录跳转
     * @return
     */
    @RequestMapping(value = "toMoreQuestions")
    public ModelAndView toMoreQuestions(){
        return new ModelAndView("aquaculture/productService/moreQuestions");
    }

    /**
     * 更多渔友提问记录跳转
     * @return
     */
    @RequestMapping(value = "toMoreFindNews")
    public ModelAndView toMoreFindNews(){
        return new ModelAndView("aquaculture/productService/moreFindNews");
    }

    /**
     * 页面专家点击渔友提的问题，跳转页面
     * @param id
     * @return
     * @User 李英豪
     */
    @RequestMapping(value = "fishermanProblem")
    public ModelAndView fishermanProblem(String id){
        ModelAndView mav=new ModelAndView();
        mav.setViewName("aquaculture/productService/fishermanProblem");
        mav.addObject("id",id);
        return mav;
    }
    /**
     * 页面专家点击渔友提的问题，查询当前点击的信息的详细问题
     * @param id
     * @return
     * @User 李英豪
     */
    @RequestMapping(value = "fishermanProblemDetails")
    @ResponseBody
    public ResultObject fishermanProblemDetails(String id){
        AquacultureExpertsDiagnosisBean aquacultureExpertsDiagnosisBean=dao.fetch(AquacultureExpertsDiagnosisBean.class,Cnd.where("id","=",id));
        return ResultObject.ok(aquacultureExpertsDiagnosisBean);
    }

    /**
     * 专家反馈问题。修改问题表信息与状态
     * @param id
     * @return
     * @User 李英豪
     */
    @RequestMapping(value = "expertFeedback")
    @ResponseBody
    public ResultObject expertFeedback(String id,String expertReply){
        String msg="";
        try {
            AquacultureExpertsDiagnosisBean aquacultureExpertsDiagnosisBean=dao.fetch(AquacultureExpertsDiagnosisBean.class,Cnd.where("id","=",id));
            aquacultureExpertsDiagnosisBean.setAnswer(expertReply);
            aquacultureExpertsDiagnosisBean.setAnswerFlag("1");
            aquacultureExpertsDiagnosisBean.setAnswerTime(new Date());
            dao.update(aquacultureExpertsDiagnosisBean);
            msg="感谢您的热心帮助";
        }catch (RuntimeException e){
            return ResultObject.apiError("fail");
        }
            return ResultObject.ok(msg);
    }

    /**
     * 页面专家点击渔友提的问题，跳转页面
     * @param id
     * @return
     * @User 李英豪
     */
    @RequestMapping(value = "fishermenQuestions")
    public ModelAndView fishermenQuestions(String id){
        ModelAndView mav=new ModelAndView();
        mav.setViewName("aquaculture/productService/fishermenQuestions");
        mav.addObject("id",id);
        return mav;
    }

    /**
     * 渔友点击自己提的问题，查询当前点击的信息的详细问题
     * @param id
     * @return
     * @User 李英豪
     */
    @RequestMapping(value = "fishermanQuestionsDetails")
    @ResponseBody
    public ResultObject fishermanQuestionsDetails(String id){
        AquacultureExpertsDiagnosisBean aquacultureExpertsDiagnosisBean=dao.fetch(AquacultureExpertsDiagnosisBean.class,Cnd.where("id","=",id));
        return ResultObject.ok(aquacultureExpertsDiagnosisBean);
    }
}
