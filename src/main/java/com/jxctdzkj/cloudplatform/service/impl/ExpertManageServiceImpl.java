package com.jxctdzkj.cloudplatform.service.impl;

import com.alibaba.fastjson.JSON;
import com.jxctdzkj.cloudplatform.bean.*;
import com.jxctdzkj.cloudplatform.config.Constant;
import com.jxctdzkj.cloudplatform.service.ExpertManageService;
import com.jxctdzkj.cloudplatform.service.UserService;
import com.jxctdzkj.cloudplatform.utils.ControllerHelper;
import com.jxctdzkj.cloudplatform.utils.HttpUtilsNew;
import com.jxctdzkj.cloudplatform.utils.ResultObject;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.nutz.dao.Cnd;
import org.nutz.dao.Dao;
import org.nutz.dao.FieldFilter;
import org.nutz.dao.pager.Pager;
import org.nutz.dao.util.Daos;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.sql.Timestamp;
import java.util.*;

/**
 * 专家管理系统
 */
@Service
@Slf4j
public class ExpertManageServiceImpl implements ExpertManageService {
    @Autowired
    Dao dao;

    @Autowired
    UserService userService;

    @Autowired
    protected Environment env;

    /**
     * 申请成为专家
     *
     * @param expertsBean
     * @return
     */
    @Override
    public ResultObject addExpert(AquacultureExpertsBean expertsBean) throws RuntimeException {
        SysUserBean userBean = ControllerHelper.getInstance(dao).getLoginUser();
        if (StringUtils.isBlank(userBean.getUserName())) {
            return ResultObject.error("用户未登录");
        }
        if (expertsBean.getId() != 0) {
            AquacultureExpertsBean bean = dao.fetch(AquacultureExpertsBean.class, Cnd.where("id", "=", expertsBean.getId()));
            if (bean != null) {
                expertsBean.setCreateUser(bean.getCreateUser());
                expertsBean.setCreateTime(bean.getCreateTime());
                dao.update(expertsBean);
                return ResultObject.ok();
            } else {
                return ResultObject.apiError("fail");
            }
        } else {
            AquacultureExpertsBean beans = dao.fetch(AquacultureExpertsBean.class, Cnd.where("create_user", "=", userBean.getUserName()));
            expertsBean.setCreateTime(new Date());
            expertsBean.setCreateUser(userBean.getUserName());
            expertsBean.setIsDelete("0");
            expertsBean.setExamine("0");
            if (beans != null) {//如果这人以前是专家，被删除过重新申请走修改模式
                expertsBean.setId(beans.getId());
                if (dao.update(expertsBean) > 0) {
                    return ResultObject.ok();
                } else {
                    return ResultObject.apiError("fail");
                }
            }
            //新增
            if (dao.insert(expertsBean) != null) {
                return ResultObject.ok();
            } else {
                return ResultObject.apiError("fail");
            }
        }
    }

    /**
     * 管理员删除专家
     *
     * @return
     * @User 李英豪
     */
    @Override
    @Transactional
    public ResultObject delExpertExamine(int id) throws RuntimeException {
        SysUserBean userBean = ControllerHelper.getInstance(dao).getLoginUser();
        if (StringUtils.isBlank(userBean.getUserName())) {
            return ResultObject.error("用户未登录");
        }
        AquacultureExpertsBean aquacultureExpertsBean = dao.fetch(AquacultureExpertsBean.class, Cnd.where("id", "=", id));
        aquacultureExpertsBean.setIsDelete("1");
        if (dao.update(aquacultureExpertsBean) > 0) {
            UserRoleBean userRoleBean = userService.findUserRoleBean(aquacultureExpertsBean.getCreateUser());
            if (userRoleBean != null) {//如果用户角色信息不为null
                userRoleBean.setRoleId(userRoleBean.getRoleId() - 1);
                dao.update(userRoleBean);
                userBean.setLevel(2);
                dao.update(userRoleBean);
            }
            return ResultObject.ok();
        } else {
            return ResultObject.apiError("fail");
        }
    }

    /**
     * 查询所有可查询的专家信息（未删除的）
     */
    @Override
    public ResultObject findExpertManageList(String expertName) throws RuntimeException {
        Map<String, Object> map = new HashMap<>();
        SysUserBean userBean = ControllerHelper.getInstance(dao).getLoginUser();
        if (StringUtils.isBlank(userBean.getUserName())) {
            return ResultObject.error("用户未登录");
        }
        Cnd cnd = Cnd.where("is_delete", "=", "0").and("examine", "=", "1").and("type", "=", "0");
        if (StringUtils.isNotBlank(expertName)) {
            cnd.and("name", "like", "%" + expertName + "%");
        }
        List<AquacultureExpertsBean> list = dao.query(AquacultureExpertsBean.class, cnd);
        Double totalScore;
        for (int i = 0; i < list.size(); i++) {
            if (list.get(i).getTotalScore() > 0) {
                totalScore = list.get(i).getTotalScore() / list.get(i).getFrequency();
                String temp = Double.toString(totalScore);
                int start = temp.indexOf(".");
                String num = temp.substring(0, start);
                String decimal = "0" + temp.substring(start);
                if (Double.parseDouble(decimal) > 0.50) {
                    list.get(i).setTotalScore(Double.parseDouble(num) + 0.5);
                } else {
                    list.get(i).setTotalScore(Double.parseDouble(num));
                }
            }
        }
        map.put("list", list);
        map.put("level", userBean.getLevel());
        map.put("userName", userBean.getUserName());
        return ResultObject.ok().data(map);
    }

    /**
     * 查询所有待审核专家信息（未删除的）
     */
    @Override
    public ResultObject findExpertExamineList(int page, int size) throws RuntimeException {
        SysUserBean userBean = ControllerHelper.getInstance(dao).getLoginUser();
        if (StringUtils.isBlank(userBean.getUserName())) {
            return ResultObject.error("用户未登录");
        }
        Pager pager = new Pager(page, size);
        Cnd cnd = Cnd.where("is_delete", "=", "0").and("examine", "=", "0").and("type", "=", "0");
        List<AquacultureExpertsBean> list = dao.query(AquacultureExpertsBean.class, cnd, pager);
        int count = dao.count(AquacultureExpertsBean.class, cnd);
        return ResultObject.okList(list, page, size, count);
    }

    /**
     * 根据ID获取用户详细信息
     *
     * @return
     * @User 李英豪
     */
    @Override
    public ResultObject findExpertExamineVal(int id) throws RuntimeException {
        SysUserBean userBean = ControllerHelper.getInstance(dao).getLoginUser();
        if (StringUtils.isBlank(userBean.getUserName())) {
            return ResultObject.error("用户未登录");
        }
        AquacultureExpertsBean bean =
                dao.fetch(AquacultureExpertsBean.class, id);
        return ResultObject.ok().data(bean);
    }

    /**
     * 根据用户名获取专家详细信息
     *
     * @param type 是否只查询已审核专家 0 ：已审核  1：所有
     * @return
     * @User 李英豪
     */
    @Override
    public ResultObject findExpertExamineVal_Two(String type) throws RuntimeException {
        SysUserBean userBean = ControllerHelper.getInstance(dao).getLoginUser();
        if (StringUtils.isBlank(userBean.getUserName())) {
            return ResultObject.error("用户未登录");
        }
        Cnd cnd = Cnd.where("create_user", "=", userBean.getUserName()).and("is_delete", "=", "0");
        if ("0".equals(type)) {
            cnd.and("examine", "=", "1");
        }
        AquacultureExpertsBean bean =
                dao.fetch(AquacultureExpertsBean.class, cnd);
        return ResultObject.ok().data(bean);
    }

    /**
     * 根据專家用户名获取专家的头像
     *
     * @param createName 专家登录名
     * @return
     * @User 李英豪
     */
    @Override
    public ResultObject findExpertExamineHandUrl(String createName) throws RuntimeException {
        SysUserBean userBean = ControllerHelper.getInstance(dao).getLoginUser();
        if (StringUtils.isBlank(userBean.getUserName())) {
            return ResultObject.error("用户未登录");
        }
        Cnd cnd = Cnd.where("create_user", "=", createName)
                .and("is_delete", "=", "0")
                .and("examine", "=", "1");

        AquacultureExpertsBean bean =
                dao.fetch(AquacultureExpertsBean.class, cnd);
        if (bean != null && bean.getHeadPhotoPic() != null) {
            return ResultObject.ok().data(bean.getHeadPhotoPic());
        }
        return ResultObject.ok();
    }

    /**
     * 专家审核反馈
     *
     * @return
     * @User 李英豪
     */
    @Override
    public ResultObject updateExpertExamine(int id, String examine) throws Exception {
        SysUserBean userBean = ControllerHelper.getInstance(dao).getLoginUser();
        if (StringUtils.isBlank(userBean.getUserName())) {
            return ResultObject.error("用户未登录");
        }
        AquacultureExpertsBean bean =
                dao.fetch(AquacultureExpertsBean.class, id);
        bean.setExamine(examine);
        if (dao.update(bean) > 0) {//专家审核完成
            if ("1".equals(examine)) {//如果是审核通过，修改用户角色为专家
                UserRoleBean userRoleBean = userService.findUserRoleBean(bean.getCreateUser());
                if (userRoleBean != null) {//如果用户角色信息不为null
                    userRoleBean.setRoleId(userRoleBean.getRoleId() + 1);
                    dao.update(userRoleBean);
                    userBean.setLevel(1);
                    dao.update(userRoleBean);
                }
            }
        }
        return ResultObject.ok();
    }

    /**
     * 编写文章
     *
     * @param content 文章内容
     * @param title   文章标题
     * @User 李英豪
     */
    @Override
    public ResultObject saveOrUpdateArticleContent(String content, String title, long id, String type,int category) throws RuntimeException {
        SysUserBean userBean = ControllerHelper.getInstance(dao).getLoginUser();
        if (StringUtils.isBlank(userBean.getUserName())) {
            return ResultObject.error("用户未登录");
        }
        if (id == 0) {//新增
            ArticleBean article = new ArticleBean();
            article.setContent(content);
            article.setCreateName(userBean.getUserName());
            article.setCreateId(userBean.getId());
            article.setTitle(title);
            article.setIsDelete(0);
            article.setType(type);
            article.setCreateTime(new Timestamp(new Date().getTime()));

            if(category== Constant.Category.CATEGORY0){
                AquacultureExpertsBean bean = dao.fetch(AquacultureExpertsBean.class, Cnd.where("create_user", "=", userBean.getUserName()));
                article.setExpertName(bean.getName());
            }else{
                article.setExpertName(userBean.getRealName());
            }

            article.setCategory(category);
            if (dao.insert(article) != null) {
                return ResultObject.ok();
            }
        } else {
            ArticleBean article = dao.fetch(ArticleBean.class, id);
            article.setContent(content);
            article.setTitle(title);
            if (dao.update(article) > 0) {
                return ResultObject.ok();
            }
        }

        return null;
    }

    /**
     * 查询文章
     *
     * @param myArticle 是否查询我的 是：0 不是：1
     * @User 李英豪
     */
    @Override
    public ResultObject findArticleList(int myArticle, String title, int page, int size, String type,int category, String userName) throws RuntimeException {
        Pager pager = new Pager(page, size);
        SysUserBean userBean = ControllerHelper.getInstance(dao).getLoginUser();
        if (StringUtils.isBlank(userBean.getUserName())) {
            return ResultObject.error("用户未登录");
        }
        Cnd cnd = Cnd.where("is_delete", "=", 0).and("type", "=", type);
        if (StringUtils.isNotBlank(title)) {
            cnd.and("title", "like", "%" + title + "%");
        }
        if (userName != null && !"".equals(userName)) {
            cnd.and("create_name", "=", userName);
        }
        if (myArticle == 0 && (userName == null || "".equals(userName))) {
            cnd.and("create_id", "=", userBean.getId());
        }
        cnd.and("category","=",category);
        cnd.orderBy("create_time", "desc");
        List<ArticleBean> list = dao.query(ArticleBean.class, cnd, pager);
        int count = dao.count(ArticleBean.class, cnd);
        return ResultObject.okList(list, page, size, count);
    }

    /**
     * 查询根据ID文章详细信息
     *
     * @User 李英豪
     */
    @Override
    public ResultObject findArticle(int id) throws RuntimeException {
        SysUserBean userBean = ControllerHelper.getInstance(dao).getLoginUser();
        if (StringUtils.isBlank(userBean.getUserName())) {
            return ResultObject.error("用户未登录");
        }
        ArticleBean articleBean = dao.fetch(ArticleBean.class, id);
//        if (articleBean != null) {
//            if(articleBean.getCategory()==Constant.Category.CATEGORY1){
//                articleBean.setNum(articleBean.getNum()+1);
//                dao.update(articleBean,"^num$");
//                Pager pager=new Pager(page,size);
//                List<ArticleCommentBean> list=dao.query(ArticleCommentBean.class,Cnd.where("article_id","=",id).orderBy("create_time","desc"),pager);
//                int count=dao.count(ArticleCommentBean.class,Cnd.where("article_id","=",id));
//                articleBean.setList(list);
//                articleBean.setCount(count);
//            }
//            articleBean.setNum(articleBean.getNum()+1);
//            dao.update(articleBean,"^num$");
            return ResultObject.ok(articleBean);
//        }
//        return ResultObject.ok();
    }

    /**
     * 查询根据ID文章详细信息
     *
     * @User 李英豪
     */
    @Override
    public ResultObject findArticleLog(int id,int page,int size) throws RuntimeException {
        SysUserBean userBean = ControllerHelper.getInstance(dao).getLoginUser();
        if (StringUtils.isBlank(userBean.getUserName())) {
            return ResultObject.error("用户未登录");
        }
        ArticleBean articleBean = dao.fetch(ArticleBean.class, id);
        if (articleBean != null) {
            articleBean.setNum(articleBean.getNum()+1);
            dao.update(articleBean,"^num$");
        }
        return ResultObject.ok();
    }
    /**
     * 删除文章
     *
     * @param id
     * @User 李英豪
     */
    @Override
    public ResultObject delArticle(long id) throws RuntimeException {
        SysUserBean userBean = ControllerHelper.getInstance(dao).getLoginUser();
        if (StringUtils.isBlank(userBean.getUserName())) {
            return ResultObject.error("用户未登录");
        }
        ArticleBean article = dao.fetch(ArticleBean.class, id);
        if (article != null) {
            article.setIsDelete(1);
            if (dao.update(article) > 0) {
                return ResultObject.ok("删除成功");
            }
        }
        return ResultObject.ok("无数据");
    }

    /**
     * 查询疾病菜单信息
     *
     * @param industryType 行业标识 1：渔业 2农业
     * @Param diseasesTypesId    疾病类型id
     * @Param diseasesName 疾病名称
     * @User 李英豪
     */
    @Override
    public ResultObject findDiseaseList(String industryType, int diseasesTypesId, int page, int size, String diseasesName) throws RuntimeException {
        SysUserBean userBean = ControllerHelper.getInstance(dao).getLoginUser();
        if (StringUtils.isBlank(userBean.getUserName())) {
            return ResultObject.error("用户未登录");
        }
        //添加分类列表
        Map<String, Object> map = new HashMap<>();
        List<AquacultureDiseasesBean> beanList = new ArrayList<AquacultureDiseasesBean>();
        AquacultureDiseasesBean bean1 = new AquacultureDiseasesBean();
        AquacultureDiseasesBean bean2 = new AquacultureDiseasesBean();
        bean1.setSpeciesId(21);
        bean1.setSpecies("设备");
        bean1.setDiseasesTypesId("1");
        bean1.setDiseasesTypes("网关设备");
        beanList.add(bean1);
        bean2.setSpeciesId(21);
        bean2.setSpecies("设备");
        bean2.setDiseasesTypesId("2");
        bean2.setDiseasesTypes("终端设备");
        beanList.add(bean2);
        map.put("beanList", beanList);

        //登录验证接口
        String account = env.getProperty("yun.zuotoujing.net.account");
        String password = env.getProperty("yun.zuotoujing.net.password");
        HashMap<String, String> map22 = new HashMap<String,String>();
        map22.put("account", account);
        map22.put("passwd", password);
        String s3 = HttpUtilsNew.doPost("http://yun.zuotoujing.net:8088/service-api-v3/wlx/user/03/login", map22);
        String data = JSON.parseObject(s3, HashMap.class).get("data").toString();
        String at = JSON.parseObject(data, HashMap.class).get("at").toString();
        String guid = JSON.parseObject(data, HashMap.class).get("guid").toString();
        String id = JSON.parseObject(data, HashMap.class).get("id").toString();

        //获取设备列表
        HashMap<String, String> map1 = new HashMap<String,String>();
        map1.put("uid", id);
        map1.put("at", at);
        map1.put("guid", guid);
        map1.put("resultFields", "{id,devAlias,id,termType,devAlias}");
        String s1 = HttpUtilsNew.doPost("http://yun.zuotoujing.net:8088/service-api-v3/wlx/data/03/devList", map1);
        String datas = JSON.parseObject(s1, HashMap.class).get("data").toString();
        List<Object> list =JSON.parseArray(datas);

        //添加分类详情列表
        List<AquacultureDiseasesBean> contentList = new ArrayList<AquacultureDiseasesBean>();
        for (Object object : list){
            AquacultureDiseasesBean bean = new AquacultureDiseasesBean();
            Map <String,Object> ret = (Map<String, Object>) object;//取出list里面的值转为map
            Object devAlias = ret.get("id");
            bean.setIds(ret.get("id").toString());
            bean.setSpeciesId(0);
            bean.setDiseasesName(ret.get("devAlias").toString());
            contentList.add(bean);
        }
        return ResultObject.okList(contentList, page, size, contentList.size()).data(map);
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
    @Override
    public ResultObject saveDisease(AquacultureDiseasesBean aquacultureDiseasesBean) throws RuntimeException {
        SysUserBean userBean = ControllerHelper.getInstance(dao).getLoginUser();
        if (StringUtils.isBlank(userBean.getUserName())) {
            return ResultObject.error("用户未登录");
        }
        if (aquacultureDiseasesBean.getId() != 0) {
            AquacultureDiseasesBean bean = dao.fetch(AquacultureDiseasesBean.class, Cnd.where("id", "=", aquacultureDiseasesBean.getId()));
            if (bean != null) {
                bean.setSpeciesId(aquacultureDiseasesBean.getSpeciesId());
                bean.setSpecies(aquacultureDiseasesBean.getSpecies());
                bean.setDiseasesTypesId(aquacultureDiseasesBean.getDiseasesTypesId());
                bean.setDiseasesTypes(aquacultureDiseasesBean.getDiseasesTypes());
                bean.setDiseasesName(aquacultureDiseasesBean.getDiseasesName());
                bean.setDiseasesContent(aquacultureDiseasesBean.getDiseasesContent());
                bean.setIndustryType(aquacultureDiseasesBean.getIndustryType());
                dao.update(bean);
                return ResultObject.ok();
            } else {
                return ResultObject.apiError("fail");
            }
        } else {
            aquacultureDiseasesBean.setCreateTime(new Date());
            aquacultureDiseasesBean.setIsDelete("0");
            aquacultureDiseasesBean.setUserName(userBean.getUserName());
            //新增
            if (dao.insert(aquacultureDiseasesBean) != null) {
                return ResultObject.ok();
            } else {
                return ResultObject.apiError("fail");
            }
        }
    }

    /**
     * 删除疾病菜单信息
     *
     * @param id
     * @User 李英豪
     */
    @Override
    public ResultObject delDisease(long id) throws RuntimeException {
        SysUserBean userBean = ControllerHelper.getInstance(dao).getLoginUser();
        if (StringUtils.isBlank(userBean.getUserName())) {
            return ResultObject.error("用户未登录");
        }
        AquacultureDiseasesBean disease = dao.fetch(AquacultureDiseasesBean.class, id);
        if (disease != null) {
            disease.setIsDelete("1");
            if (dao.update(disease) > 0) {
                return ResultObject.ok("删除成功");
            }
        }
        return ResultObject.ok("无数据");
    }

    /**
     * 留言评分
     *
     * @User 李英豪
     */
    @Override
    public ResultObject updateScore(long id, long expertsId, double totalScore, String comment) throws RuntimeException {
        SysUserBean userBean = ControllerHelper.getInstance(dao).getLoginUser();
        if (StringUtils.isBlank(userBean.getUserName())) {
            return ResultObject.error("用户未登录");
        }
        AquacultureExpertsDiagnosisBean bean = dao.fetch(AquacultureExpertsDiagnosisBean.class, id);
        if (bean != null) {
            bean.setTotalScore(totalScore);
            bean.setComment(comment);
            if (dao.update(bean) > 0) {
                return updateScore(expertsId, totalScore);
            }
        }
        return ResultObject.ok("无数据");
    }

    /**
     * 修改专家信息评分分数与评分次数
     *
     * @User 李英豪
     */
    @Override
    public ResultObject updateScore(long expertsId, double totalScore) throws RuntimeException {
        SysUserBean userBean = ControllerHelper.getInstance(dao).getLoginUser();
        if (StringUtils.isBlank(userBean.getUserName())) {
            return ResultObject.error("用户未登录");
        }
        AquacultureExpertsBean bean = dao.fetch(AquacultureExpertsBean.class, expertsId);
        if (bean != null) {
            bean.setTotalScore(bean.getTotalScore() + totalScore);
            bean.setFrequency(bean.getFrequency() + 1);
            if (dao.update(bean) > 0) {
                return ResultObject.ok("评分成功");
            }
        }
        return ResultObject.ok("无数据");
    }

    /**
     * 专家查询有没有用户发给自己的留言（分页版本）
     *
     * @return
     * @User 李英豪
     */
    @Override
    public ResultObject findAquacultureExpertList(int page, int size) throws RuntimeException {
        SysUserBean userBean = ControllerHelper.getInstance(dao).getLoginUser();
        if (StringUtils.isBlank(userBean.getUserName())) {
            return ResultObject.error("用户未登录");
        }
        Pager pager = new Pager(page, size);
        //获取当前登录用户的所创建的专家账号id
        AquacultureExpertsBean aquacultureExpertsBean = dao.fetch(AquacultureExpertsBean.class,
                Cnd.where("create_user", "=", userBean.getUserName()).
                        and("is_delete", "=", "0"));
        int count = 0;
        List<AquacultureExpertsDiagnosisBean> diagnosisList = new ArrayList<AquacultureExpertsDiagnosisBean>();
        if (aquacultureExpertsBean != null) {
            long experts_id = aquacultureExpertsBean.getId();
            diagnosisList = dao.query(AquacultureExpertsDiagnosisBean.class,
                    Cnd.where("experts_id", "=", experts_id).orderBy("create_time", "desc"), pager);
            if (diagnosisList.size() > 0) {
                for (int i = 0; i < diagnosisList.size(); i++) {
                    userBean = dao.fetch(SysUserBean.class, Cnd.where("user_name", "=", diagnosisList.get(i).getCreateUser()));
                    diagnosisList.get(i).setCreateUser(userBean.getRealName());
                }
            }
            count = dao.count(AquacultureExpertsDiagnosisBean.class,
                    Cnd.where("experts_id", "=", experts_id));
        }
        return ResultObject.okList(diagnosisList, page, size, count);
    }

    /**
     * 用户获取询问专家的留言记录（分页版）
     *
     * @return
     * @User 李英豪
     */
    @Override
    public ResultObject getExpertsDiagnosisList(int page, int size) throws RuntimeException {
        SysUserBean userBean = ControllerHelper.getInstance(dao).getLoginUser();
        if (StringUtils.isBlank(userBean.getUserName())) {
            return ResultObject.error("用户未登录");
        }
        Pager pager = new Pager(page, size);
        int count = 0;
        Cnd cnd = (Cnd) Cnd.where("create_user", "=", userBean.getUserName()).orderBy("create_time", "desc");
        List<AquacultureExpertsDiagnosisBean> list = dao.query(AquacultureExpertsDiagnosisBean.class, cnd, pager);
        count = dao.count(AquacultureExpertsDiagnosisBean.class, cnd);
        return ResultObject.okList(list, page, size, count);
    }
}
