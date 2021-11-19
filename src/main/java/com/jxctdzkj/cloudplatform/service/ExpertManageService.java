package com.jxctdzkj.cloudplatform.service;

import com.jxctdzkj.cloudplatform.bean.AquacultureDiseasesBean;
import com.jxctdzkj.cloudplatform.bean.AquacultureExpertsBean;
import com.jxctdzkj.cloudplatform.utils.ResultObject;

/**
 * 专家管理系统
 */
public interface ExpertManageService {
    /**
     * 申请成为专家
     *
     * @param expertsBean
     * @User 李英豪
     */
    ResultObject addExpert(AquacultureExpertsBean expertsBean) throws RuntimeException;

    /**
     * 管理员删除专家
     *
     * @return
     * @User 李英豪
     */
    ResultObject delExpertExamine(int id) throws RuntimeException;

    /**
     * 查询所有可查询的专家信息（未删除的）
     *
     * @User 李英豪
     */
    ResultObject findExpertManageList(String expertName) throws RuntimeException;

    /**
     * 查询所有待审核专家信息（未删除的）
     *
     * @User 李英豪
     */
    ResultObject findExpertExamineList(int page, int size) throws RuntimeException;

    /**
     * 根据ID获取用户详细信息
     *
     * @return
     * @User 李英豪
     */
    ResultObject findExpertExamineVal(int id) throws RuntimeException;

    /**
     * 根据用户名获取专家详细信息
     * @param type 是否只查询已审核专家 0 ：已审核  1：所有
     * @return
     * @User 李英豪
     */
    ResultObject findExpertExamineVal_Two(String type) throws RuntimeException;

    /**
     * 根据專家用户名获取专家的头像
     * @param createName 专家登录名
     * @return
     * @User 李英豪
     */
    ResultObject findExpertExamineHandUrl(String createName) throws RuntimeException;

    /**
     * 专家审核反馈
     *
     * @return
     * @User 李英豪
     */
    ResultObject updateExpertExamine(int id, String examine) throws Exception;

    /**
     * 编写文章
     *
     * @param content 文章内容
     * @param title   文章标题
     * @User 李英豪
     */
    ResultObject saveOrUpdateArticleContent(String content, String title, long id, String type,int category) throws RuntimeException;

    /**
     * 查询文章（专家）-----------------
     *
     * @param myArticle 是否查询我的 是：0 不是：1
     * @param title     文章标题
     * @param type      类型 0：文章  1：新闻
     * @param userName  专家登录名
     * @User 李英豪
     */
    ResultObject findArticleList(int myArticle, String title, int page, int size, String type,int category,String userName) throws RuntimeException;

    /**
     * 查询根据ID文章详细信息
     *
     * @User 李英豪
     */
    ResultObject findArticle(int id) throws RuntimeException;

    /**
     * 查询根据ID文章评论详细信息
     *
     * @User 李英豪
     */
    ResultObject findArticleLog(int id,int page,int size) throws RuntimeException;

    /**
     * 删除文章
     *
     * @param id
     * @User 李英豪
     */
    ResultObject delArticle(long id) throws RuntimeException;

    /**
     * 查询疾病菜单信息
     *
     * @param industryType 行业标识 1：渔业 2农业
     * @Param diseasesTypesId    疾病类型id
     * @Param diseasesName 疾病名称
     * @User 李英豪
     */
    ResultObject findDiseaseList(String industryType,int diseasesTypesId,int page,int size,String diseasesName) throws RuntimeException;

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
    ResultObject saveDisease(AquacultureDiseasesBean aquacultureDiseasesBean) throws RuntimeException;

    /**
     * 删除疾病菜单信息
     *
     * @param id
     * @User 李英豪
     */
    ResultObject delDisease(long id) throws RuntimeException;

    /**
     * 留言评分
     *
     * @User 李英豪
     */
    ResultObject updateScore(long id, long expertsId, double totalScore,String comment) throws RuntimeException;

    /**
     * 修改专家信息评分分数与评分次数
     *
     * @User 李英豪
     */
    ResultObject updateScore(long expertsId, double totalScore) throws RuntimeException;

    /**
     * 专家查询有没有用户发给自己的留言（分页版本）
     *
     * @return
     * @User 李英豪
     */
    ResultObject findAquacultureExpertList(int page, int size) throws RuntimeException;

    /**
     * 用户获取询问专家的留言记录（分页版）
     * @return
     * @User 李英豪
     */
    ResultObject getExpertsDiagnosisList(int page, int size) throws RuntimeException;


    ResultObject findDeviceListById(String id);

    ResultObject findDeviceListByIdOne(String id);

    ResultObject findDeviceByProjectWebsite(String id);
}
