package com.jxctdzkj.cloudplatform.controller;

import com.jxctdzkj.cloudplatform.bean.AquacultureDiseasesBean;
import com.jxctdzkj.cloudplatform.bean.AquacultureExpertsBean;
import com.jxctdzkj.cloudplatform.bean.ArticleBean;
import com.jxctdzkj.cloudplatform.service.ExpertManageService;
import com.jxctdzkj.cloudplatform.utils.ResultObject;
import org.nutz.dao.Dao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.util.Map;

/**
 * 专家管理系统
 */
@Controller
@RequestMapping({"expertManage"})
public class ExpertManageController {
    @Autowired
    Dao dao;
    @Autowired
    ExpertManageService expertManageService;

//    /**
//     * 专家信息页面跳转
//     *
//     * @User 李英豪
//     */
//    @RequestMapping(value = "findExpertManage")
//    public ModelAndView findExpertManage() {
//        return new ModelAndView("expertManage/expert/expertManageList");
//    }


    /**
     * 添加专家
     *
     * @param expertsBean
     * @return
     */
    @RequestMapping(value = "addExpert", method = RequestMethod.POST)
    @ResponseBody
    public ResultObject addExpert(AquacultureExpertsBean expertsBean) {
        ResultObject result;
        try {
            result = expertManageService.addExpert(expertsBean);
        } catch (Exception e) {
            return ResultObject.apiError("fail");
        }
        return result;
    }
    /**
     * 管理员删除专家
     *
     * @return
     * @User 李英豪
     */
    @RequestMapping(value = "delExpertExamine")
    @ResponseBody
    public ResultObject delExpertExamine(int id) {
        try {
            ResultObject result = expertManageService.delExpertExamine(id);
            return result;
        } catch (Exception e) {
            return ResultObject.apiError("fail");
        }
    }

    /**
     * 专家信息查询
     *
     * @param expertName 专家名
     * @return
     * @User 李英豪
     */
    @RequestMapping(value = "findExpertManageList")
    @ResponseBody
    public ResultObject findExpertManageList(String expertName) {
        try {
            ResultObject result = expertManageService.findExpertManageList(expertName);
            return result;
        } catch (Exception e) {
            return ResultObject.apiError("fail");
        }
    }

//    /**
//     * 专家审核页面跳转
//     *
//     * @User 李英豪
//     */
//    @RequestMapping(value = "findExpertExamine")
//    public ModelAndView findExpertExamine() {
//        return new ModelAndView("expertManage/expert/findExpertExamine");
//    }

    /**
     * 获取所有需要审核的专家信息
     *
     * @return
     * @User 李英豪
     */
    @RequestMapping(value = "findExpertExamineList")
    @ResponseBody
    public ResultObject findExpertExamineList(@RequestParam(value = "page", required = false, defaultValue = "1") int page,
                                              @RequestParam(value = "size", required = false, defaultValue = "100") int size) {
        try {
            ResultObject result = expertManageService.findExpertExamineList(page, size);
            return result;
        } catch (Exception e) {
            return ResultObject.apiError("fail");
        }
    }

//
//    /**
//     * 专家详情页面跳转
//     *
//     * @User 李英豪
//     */
//    @RequestMapping(value = "findExpertExamineMav")
//    public ModelAndView findExpertExamineMav(int id) {
//        return new ModelAndView("expertManage/expert/findExpertExamineMav").addObject("id", id);
//    }


    /**
     * 根据ID获取用户详细信息
     *
     * @return
     * @User 李英豪
     */
    @RequestMapping(value = "findExpertExamineVal")
    @ResponseBody
    public ResultObject findExpertExamineVal(int id) {
        try {
            ResultObject result = expertManageService.findExpertExamineVal(id);
            return result;
        } catch (Exception e) {
            return ResultObject.apiError("fail");
        }
    }

    /**
     * 根据用户名获取专家详细信息
     * @param type 是否只查询已审核专家 0 ：已审核  1：所有
     * @return
     * @User 李英豪
     */
    @RequestMapping(value = "findExpertExamineVal_Two")
    @ResponseBody
    public ResultObject findExpertExamineVal_Two(@RequestParam(value = "type", required = false, defaultValue = "0") String type) {
        try {
            ResultObject result = expertManageService.findExpertExamineVal_Two(type);
            return result;
        } catch (Exception e) {
            return ResultObject.apiError("fail");
        }
    }

    /**
     * 根据專家用户名获取专家的头像
     * @param createName 专家登录名
     * @return
     * @User 李英豪
     */
    @RequestMapping(value = "findExpertExamineHandUrl")
    @ResponseBody
    public ResultObject findExpertExamineHandUrl(String createName){
        try {
            ResultObject result = expertManageService.findExpertExamineHandUrl(createName);
            return result;
        } catch (Exception e) {
            return ResultObject.apiError("fail");
        }
    }

    /**
     * 专家审核反馈
     *
     * @return
     * @User 李英豪
     */
    @RequestMapping(value = "updateExpertExamine")
    @ResponseBody
    public ResultObject updateExpertExamine(int id, String examine) {
        try {
            ResultObject result = expertManageService.updateExpertExamine(id, examine);
            return result;
        } catch (Exception e) {
            AquacultureExpertsBean bean =
                    dao.fetch(AquacultureExpertsBean.class, id);
            bean.setExamine("0");
            dao.update(bean);
            return ResultObject.apiError("fail");
        }
    }

//    /**
//     * 文章信息页面跳转
//     *
//     * @User 李英豪
//     */
//    @RequestMapping(value = "findArticle")
//    public ModelAndView findArticle(String type) {
//        return new ModelAndView("expertManage/article/articleList").addObject("type",type);
//    }

//    /**
//     * 新增或修改文章页面跳转
//     *
//     * @User 李英豪
//     */
//    @RequestMapping(value = "saveOrUpdateArticle")
//    public ModelAndView saveOrUpdateArticle(
//            @RequestParam(value = "id", required = false, defaultValue = "0") long id,
//            @RequestParam(value = "type") String type) {
//        String title = "";
//        String content = "";
//        if (id != 0) {
//            ArticleBean article = dao.fetch(ArticleBean.class, id);
//            title = article.getTitle();
//            return new ModelAndView
//                    ("expertManage/article/saveOrUpdateArticle", "data", article.getContent())
//                    .addObject("title", title)
//                    .addObject("type", type)
//                    .addObject("id", id);
//        }
//        return new ModelAndView
//                ("expertManage/article/saveOrUpdateArticle", "data", content)
//                .addObject("title", title)
//                .addObject("type", type)
//                .addObject("id", id);
//    }

    /**
     * 新增或修改文章
     *
     * @param content 文章内容
     * @param title   文章标题
     * @User 李英豪
     */
    @RequestMapping(value = "saveOrUpdateArticleContent")
    @ResponseBody
    public ResultObject saveOrUpdateArticleContent(String content, String title,
                                                   @RequestParam(value = "id", required = false, defaultValue = "0") long id, String type,@RequestParam(value = "category", required = false, defaultValue = "0") int category) {
        ResultObject result;
        try {
            result = expertManageService.saveOrUpdateArticleContent(content, title, id, type,category);
        } catch (Exception e) {
            return ResultObject.apiError("fail");
        }
        return result;
    }

    /**
     * 查询文章（专家）
     *
     * @param myArticle 是否查询我的 是：0 不是：1
     * @param title     文章标题
     * @param type      类型 0：文章  1：新闻
     * @param userName  专家登录名
     *                  category 0：农业政府平台  1：名厨亮灶
     * @User 李英豪
     */
    @RequestMapping(value = "findArticleList")
    @ResponseBody
    public ResultObject findArticleList(@RequestParam(value = "myArticle", required = false, defaultValue = "1") int myArticle,
                                        @RequestParam(value = "title", required = false, defaultValue = "")String title,
                                        @RequestParam(value = "page", required = false, defaultValue = "1") int page,
                                        @RequestParam(value = "size", required = false, defaultValue = "10") int size,
                                        @RequestParam(value = "type") String type,
                                        @RequestParam(value = "category", required = false, defaultValue = "0") int category,
                                        @RequestParam(value = "userName", required = false, defaultValue = "")String userName) {
        ResultObject result;
        try {
            result = expertManageService.findArticleList(myArticle, title, page, size, type,category,userName);
        } catch (Exception e) {
            return ResultObject.apiError("fail");
        }
        return result;
    }

    /**
     * 查询根据ID文章详细信息
     *
     * @User 李英豪
     */
    @RequestMapping(value = "findArticle")
    @ResponseBody
    public ResultObject findArticle(int id) {
        ResultObject result;
        try {
            result = expertManageService.findArticle(id);
        } catch (Exception e) {
            return ResultObject.apiError("fail");
        }
        return result;
    }
    /**
     * 查询根据ID文章评论信息
     *
     * @User 李英豪
     */
    @RequestMapping(value = "findArticleLog")
    @ResponseBody
    public ResultObject findArticleLog(int id,
                                    @RequestParam(value = "page", required = false, defaultValue = "1") int page,
                                    @RequestParam(value = "size", required = false, defaultValue = "10") int size) {
        ResultObject result;
        try {
            result = expertManageService.findArticleLog(id,page,size);
        } catch (Exception e) {
            return ResultObject.apiError("fail");
        }
        return result;
    }

    /**
     * 删除文章
     *
     * @param id
     * @User 李英豪
     */
    @RequestMapping(value = "delArticle")
    @ResponseBody
    public ResultObject delArticle(long id) {
        ResultObject result;
        try {
            result = expertManageService.delArticle(id);
        } catch (Exception e) {
            return ResultObject.apiError("fail");
        }
        System.out.println(result);
        return result;
    }


    /**
     * 根据ID查看文章
     *
     * @param id
     * @User 李英豪
     */
    @RequestMapping(value = "showArticle")
    public ModelAndView showArticle(long id) {
        ArticleBean article = dao.fetch(ArticleBean.class, id);
        return new ModelAndView("expertManage/article/showArticle")
                .addObject("article", article);
    }



    /**
     * 查询疾病菜单信息
     *
     * @param industryType 行业标识 1：渔业 2农业
     * @Param diseasesTypesId    疾病类型id
     * @Param diseases_name 疾病名称
     * @User 李英豪
     */
    @RequestMapping(value = "findDiseaseList")
    @ResponseBody
    public ResultObject findDiseaseList(@RequestParam(value = "industryType", required = false, defaultValue = "2")String industryType,
                                        @RequestParam(value = "diseasesTypesId", required = false, defaultValue = "0")int diseasesTypesId,
                                        @RequestParam(value = "page", required = false, defaultValue = "1") int page,
                                        @RequestParam(value = "size", required = false, defaultValue = "50") int size,
                                        @RequestParam(value = "diseases_name", required = false, defaultValue = "")String diseases_name) {
        ResultObject result;
        try {
            result = expertManageService.findDiseaseList(industryType,diseasesTypesId,page,size,diseases_name);
        } catch (Exception e) {
            return ResultObject.apiError("fail");
        }
        return result;
    }

    /**根据设备的id获取设备的六条信息对象
     *
     */
    @RequestMapping(value = "findDeviceListById")
    @ResponseBody
    public ResultObject findDeviceListById(@RequestParam("id") String id) {
        ResultObject result;
        try {
            result = expertManageService.findDeviceListById(id);
        } catch (Exception e) {
            return ResultObject.apiError("fail");
        }
        return result;
    }

    /**根据设备的id获取设备的一条信息对象
     *
     */
    @RequestMapping(value = "findDeviceListByIdOne")
    @ResponseBody
    public ResultObject findDeviceListByIdOne(@RequestParam("id") String id) {
        ResultObject result;
        try {
            result = expertManageService.findDeviceListByIdOne(id);
        } catch (Exception e) {
            return ResultObject.apiError("fail");
        }
        return result;
    }


    /**根据设备的id获取设备的一条信息对象
     *
     */
    @RequestMapping(value = "findDeviceByProjectWebsite")
    @ResponseBody
    public ResultObject findDeviceByProjectWebsite(@RequestParam("id") String id) {
        ResultObject result;
        try {
            result = expertManageService.findDeviceByProjectWebsite(id);
        } catch (Exception e) {
            return ResultObject.apiError("fail");
        }
        return result;
    }

    /**
     * 新增疾病菜单信息
     * //     * @param speciesId 物种id
     * //     * @param species 物种
     * //     * @param diseasesTypesId 疾病类型id
     * //     * @param diseasesTypes 疾病类型
     * //     * @param diseasesName 疾病名称
     * //     * @param diseasesContent 疾病详情及预防措施
     * //     * @param industryType 行业类型 1-水产  0：农业
     *
     * @User 李英豪
     */
    @RequestMapping(value = "saveDisease")
    @ResponseBody
    public ResultObject saveDisease(AquacultureDiseasesBean aquacultureDiseasesBean) {
        ResultObject result;
        try {
            result = expertManageService.saveDisease(aquacultureDiseasesBean);
        } catch (Exception e) {
            return ResultObject.apiError("fail");
        }
        return result;

    }
    /**
     * 删除疾病菜单信息
     *
     * @param id
     * @User 李英豪
     */
    @RequestMapping(value = "delDisease")
    @ResponseBody
    public ResultObject delDisease(long id) {
        ResultObject result;
        try {
            result = expertManageService.delDisease(id);
        } catch (Exception e) {
            return ResultObject.apiError("fail");
        }
        System.out.println(result);
        return result;
    }

//    /**
//     * 留言系统页面跳转
//     */
//    @RequestMapping(value = "findMessageBoard")
//    public ModelAndView findMessageBoard() {
//        SysUserBean userBean = ControllerHelper.getInstance(dao).getLoginUser();
//        AquacultureExpertsBean bean = dao.fetch(AquacultureExpertsBean.class, Cnd.where("create_user", "=", userBean.getUserName()));
//        String isAquaculture = "1";//判断是否专家，专家：0
//        if (bean != null) {
//            isAquaculture = "0";
//        }
//        return new ModelAndView(
//                "expertManage/messageBoard/findMessageBoardList").addObject("isAquaculture", isAquaculture);
//    }

    /**
     * 留言评分
     * @param expertsId  专家id
     * @param totalScore 分数
     * @param comment  用户评论内容
     * @User 李英豪
     */
    @RequestMapping(value = "updateScore")
    @ResponseBody
    public ResultObject updateScore(long id, long expertsId, double totalScore,String comment) {
        ResultObject result;
        try {
            result = expertManageService.updateScore(id, expertsId, totalScore,comment);
        } catch (Exception e) {
            return ResultObject.apiError("fail");
        }
        return result;
    }

    /**
     * 专家查询有没有用户发给自己的留言（分页版本）
     *
     * @return
     * @User 李英豪
     */
    @RequestMapping("findAquacultureExpertList")
    @ResponseBody
    public ResultObject findAquacultureExpertList(@RequestParam(value = "page", required = false, defaultValue = "1") int page,
                                                  @RequestParam(value = "size", required = false, defaultValue = "10") int size) {
        ResultObject result;
        try {
            result = expertManageService.findAquacultureExpertList(page, size);
        } catch (Exception e) {
            return ResultObject.apiError("fail");
        }
        return result;
    }

    /**
     * 用户获取询问专家的留言记录（分页版）
     *
     * @return
     * @User 李英豪
     */
    @RequestMapping(value = "getExpertsDiagnosisList")
    @ResponseBody
    public ResultObject getExpertsDiagnosisList(@RequestParam(value = "page", required = false, defaultValue = "1") int page,
                                                @RequestParam(value = "size", required = false, defaultValue = "10") int size) {
        ResultObject result;
        try {
            result = expertManageService.getExpertsDiagnosisList(page, size);
        } catch (Exception e) {
            return ResultObject.apiError("fail");
        }
        return result;
    }
}


