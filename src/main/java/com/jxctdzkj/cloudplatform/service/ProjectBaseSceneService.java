package com.jxctdzkj.cloudplatform.service;

import com.jxctdzkj.cloudplatform.bean.*;
import com.jxctdzkj.cloudplatform.service.impl.ProjectBaseSceneServiceImpl;
import com.jxctdzkj.cloudplatform.utils.ResultObject;

import java.util.List;

/**
 * @Description
 * @Author chanmufeng
 * @Date 2019/9/5 10:55
 **/

public interface ProjectBaseSceneService {

    /**
     * 获取所有项目，不分页
     *
     * @return
     */
    List<ProjectBean> listAllProjects();

    /**
     * 获取所有基地，不分页
     *
     * @return
     */
    List<Base> listAllBases();

    /**
     * 获取所有企业，不分页
     *
     * @return
     */
    List<EnterpriseBean> listAllEnterPrises();

    /**
     * 根据当前登录用户获取所有企业信息
     *
     * @param page
     * @param size
     * @param enterpriseName
     * @return
     */
    ResultObject listEnterprises(int page, int size, String enterpriseName);

    /**
     * 根据企业id获取所有项目
     *
     * @param enterpriseId
     * @return
     */
    List<ProjectBean> listProjectsByEnterpriseId(long enterpriseId);

    /**
     * 根据当前用户获取所有项目
     *
     * @return
     */
    ResultObject listProjects(int page, int size, long enterpriseId, String projectName);

    /**
     * 根据当前用户获取所有基地
     *
     * @return
     */
    ResultObject listBases(int page, int size, long projectId, String baseName,int type);

    /**
     * 农业政府平台数据展示左侧菜单栏获取企业信息
     * findEntperpriseList
     * @User 李英豪
     */
    ResultObject findEntperpriseList(int page,int size)throws RuntimeException;

    /**
     * 农业政府平台数据展示左侧菜单栏获取企业下项目信息
     * findProjectList
     * @param entperpriseId 企业Id
     * @param type 类型
     * @User 李英豪
     */
    ResultObject findProjectList(int page,int size,long entperpriseId,int type)throws RuntimeException;

    /**
     * 农业政府平台数据展示左侧菜单栏获取项目下基地信息
     * findBaseList
     * @param projectId 项目Id
     * @param type 类型
     * @User 李英豪
     */
    ResultObject findBaseList(int page,int size,long projectId,int type)throws RuntimeException;

    /**
     * 根据当前用户获取所有场景
     *
     * @return
     */
    ResultObject listScenes(int page, int size, long baseId, String sceneName);

    /**
     * 通过项目id获取其下所有基地
     *
     * @param projectId
     * @return
     */
    List<Base> listBasesByProjectId(long projectId);

    /**
     * 通过基地id获取其下所有场景
     *
     * @param baseId
     * @return
     */
    List<FarmInfoBean> listScenesByBaseId(long baseId, Integer sceneType);

    /**
     * 新建企业
     *
     * @param bean
     * @return
     */
    ResultObject insertEnterprise(EnterpriseBean bean);

    /**
     * 新建项目
     *
     * @param bean
     * @return
     */
    ResultObject insertProject(ProjectBean bean);

    /**
     * 修改企业
     *
     * @param bean
     * @return
     */
    ResultObject updateEnterprise(EnterpriseBean bean);

    /**
     * 修改项目
     *
     * @param bean
     * @return
     */
    ResultObject updateProject(ProjectBean bean);


    /**
     * 根据id删除企业
     *
     * @param id
     * @return
     */
    ResultObject deleteEnterpriseById(long id);

    /**
     * 根据id删除项目
     *
     * @param id
     * @return
     */
    ResultObject deleteProjectById(long id);

    /**
     * 新建基地
     *
     * @param bean
     * @return
     */
    ResultObject insertBase(Base bean);

    /**
     * 修改基地
     *
     * @param bean
     * @return
     */
    ResultObject updateBase(Base bean);

    /**
     * 根据id删除基地
     *
     * @param id
     * @return
     */
    ResultObject deleteBaseById(long id);

    /**
     * 新建场景
     *
     * @param bean
     */
    void insertScene(FarmInfoBean bean) throws Exception;

    /**
     * 修改场景
     *
     * @param bean
     */
    void updateScene(FarmInfoBean bean);

    /**
     * 根据id删除场景
     *
     * @param id
     * @return
     */
    ResultObject deleteSceneById(long id);

    /**
     * 根据子类型（养殖/加工）获取对应场景列表
     *
     * @param subType
     * @return
     */
    List<FarmInfoBean> listScenesBySubType(int subType);


    List<ProjectBean> listProjectsWithBases();

    //删除设备和用户名的匹配，
    List<DeviceBean> getSceneDeviceList(int page, int size, String deviceNumber, List<UserGroupBean> userGroupBeans) throws Exception;

    int getSceneDeviceListCount(String deviceNumber, List<UserGroupBean> userGroupBeans) throws Exception;

    /**
     * 农业政府平台企业停用与恢复
     * updateEnterpriseState
     * @param id 企业Id
     * @param state 启用0 停用1
     * @User 李英豪
     */
    ResultObject updateEnterpriseState(String id, String state)throws RuntimeException;

    /**
     * 获取用户下所有非停用企业
     * @return
     * @User 李英豪
     */
    ResultObject findEntperpriseListCount()throws RuntimeException;

    List<ProjectBaseSceneServiceImpl.Enterprise> listAllEnterprisesForExport();

    List<ProjectBaseSceneServiceImpl.InnerBase> listAllBasesForExport();
}
