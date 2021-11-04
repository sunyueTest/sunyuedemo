package com.jxctdzkj.cloudplatform.service.impl;

import cn.afterturn.easypoi.excel.annotation.Excel;
import com.jxctdzkj.cloudplatform.bean.*;
import com.jxctdzkj.cloudplatform.config.Constant;
import com.jxctdzkj.cloudplatform.exception.ServiceException;
import com.jxctdzkj.cloudplatform.service.ProjectBaseSceneService;
import com.jxctdzkj.cloudplatform.service.UserService;
import com.jxctdzkj.cloudplatform.utils.ControllerHelper;
import com.jxctdzkj.cloudplatform.utils.ResultObject;
import com.jxctdzkj.cloudplatform.utils.Utils;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.nutz.dao.*;
import org.nutz.dao.pager.Pager;
import org.nutz.dao.sql.Criteria;
import org.nutz.dao.sql.Sql;
import org.nutz.dao.sql.SqlCallback;
import org.nutz.dao.util.Daos;
import org.nutz.trans.Trans;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestParam;

import javax.transaction.Transactional;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;

/**
 * @Description
 * @Author chanmufeng
 * @Date 2019/9/5 11:08
 **/
@Slf4j
@Service
public class ProjectBaseSceneServiceImpl implements ProjectBaseSceneService {
    @Autowired
    Dao dao;

    @Autowired
    FarmInfoServiceImpl farmInfoService;

    @Autowired
    UserService userService;

    @Override
    public List<ProjectBean> listAllProjects() {
        SysUserBean userBean = ControllerHelper.getInstance(dao).getLoginUser();
        int level = userBean.getLevel();
        Criteria cri = Cnd.cri();

        //系统管理员可以查看所有项目
        //企业管理员只能查看本企业的所有项目
        if (level == Constant.Define.ROLE_1) {
            //查询所属企业
            cri.where().andInBySql("enterprise_id", "SELECT e.id FROM enterprise e,sys_user_info s WHERE e.id=s.entperprise_id AND s.user_name = '%s'", userBean.getUserName());

        } else if (level == Constant.Define.ROLE_2) {//普通用户只能查看自己创建的项目
            cri.where().andEquals("create_user", userBean.getUserName());
        }

        List<ProjectBean> list = dao.query(ProjectBean.class, cri);

        return list;
    }

    @Override
    public List<Base> listAllBases() {
        SysUserBean userBean = ControllerHelper.getInstance(dao).getLoginUser();
        int level = userBean.getLevel();
        Criteria cri = Cnd.cri();
        String userName = userBean.getUserName();

        //系统管理员可以查看所有基地
        //企业管理员只能查看本企业的所有基地
        if (level == Constant.Define.ROLE_1) {
            cri.where().andInBySql("project_id", "SELECT id FROM project WHERE enterprise_id = (SELECT e.id FROM enterprise e,sys_user_info s WHERE e.id=s.entperprise_id AND s.user_name = '%s')", userName);
        } else if (level == Constant.Define.ROLE_2) {//普通用户只能查看自己创建的基地
            cri.where().andEquals("create_user", userName);
        }

        List<Base> list = dao.query(Base.class, cri);
        return list;
    }

    @Override
    public List<EnterpriseBean> listAllEnterPrises() {
        SysUserBean userBean = ControllerHelper.getInstance(dao).getLoginUser();
        //管理员可以查看所有企业
        Cnd cnd = Cnd.where("is_del", "=", "0").and("state", "=", "0");
        int level = userBean.getLevel();
        if (level == Constant.Define.ROLE_1) {//一级用户根据自己的公司进行查看
            SysUserInfoBean userInfoBean = dao.fetch(SysUserInfoBean.class, Cnd.where("user_name", "=", userBean.getUserName()));
            cnd.and("id", "=", userInfoBean == null ? 0 : userInfoBean.getEntperpriseId());
        } else if (level > Constant.Define.ROLE_1) {
            SysUserInfoBean userInfoBean = dao.fetch(SysUserInfoBean.class, Cnd.where("user_name", "=", userBean.getParentUser()));
            cnd.and("id", "=", userInfoBean == null ? 0 : userInfoBean.getEntperpriseId());
        }

        return dao.query(EnterpriseBean.class, cnd);
    }

    @Override
    public ResultObject listEnterprises(@RequestParam int page, @RequestParam int size, String enterpriseName) {
        SysUserBean userBean = ControllerHelper.getInstance(dao).getLoginUser();
        //管理员可以查看所有企业
        Cnd cnd = Cnd.where("is_del", "=", "0");
        int level = userBean.getLevel();
        if (level == Constant.Define.ROLE_1) {//一级用户根据自己的公司进行查看
            SysUserInfoBean userInfoBean = dao.fetch(SysUserInfoBean.class, Cnd.where("user_name", "=", userBean.getUserName()));
            cnd.and("id", "=", userInfoBean == null ? 0 : userInfoBean.getEntperpriseId());
        } else if (level == Constant.Define.ROLE_2) {
            SysUserInfoBean userInfoBean = dao.fetch(SysUserInfoBean.class, Cnd.where("user_name", "=", userBean.getParentUser()));
            cnd.and("id", "=", userInfoBean == null ? "" : userInfoBean.getEntperpriseId());
        }
        if (StringUtils.isNotBlank(enterpriseName)) {
            cnd = cnd.and("name", "like", "%" + enterpriseName + "%");
        }
        List<EnterpriseBean> list = dao.query(EnterpriseBean.class, cnd.orderBy("id", "DESC"), new Pager(page, size));
        if (list != null && list.size() > 0) {
            for (int i = 0; i < list.size(); i++) {
                if ("0".equals(list.get(i).getState())) {
                    list.get(i).setStateValue("启用中");
                } else {
                    list.get(i).setStateValue("停用中");
                }
            }
        }

        int count = dao.count(EnterpriseBean.class, cnd);
        return ResultObject.okList(list, page, size, count);
    }

    @Override
    public List<ProjectBean> listProjectsByEnterpriseId(@RequestParam long enterpriseId) {
        SysUserBean userBean = ControllerHelper.getInstance(dao).getLoginUser();
        Cnd cnd = Cnd.where("enterprise_id", "=", enterpriseId);
        if (userBean.getLevel() > Constant.Define.ROLE_1) {
            cnd.and("create_user", "=", userBean.getUserName());
        }
        return dao.query(ProjectBean.class, cnd);
    }

    @Override
    public ResultObject listProjects(@RequestParam int page, @RequestParam int size, long enterpriseId, String projectName) {
        SysUserBean userBean = ControllerHelper.getInstance(dao).getLoginUser();
        int level = userBean.getLevel();
        Criteria cri = Cnd.cri();

        //系统管理员可以查看所有项目
        //企业管理员只能查看本企业的所有项目
        if (level == Constant.Define.ROLE_1) {
            //查询所属企业
            cri.where().andInBySql("enterprise_id", "SELECT e.id FROM enterprise e,sys_user_info s WHERE e.id=s.entperprise_id AND s.user_name = '%s'", userBean.getUserName());

        } else if (level == Constant.Define.ROLE_2) {//普通用户只能查看自己创建的项目
            cri.where().andEquals("create_user", userBean.getUserName());
        }

        if (enterpriseId != 0) {
            cri.where().andEquals("enterprise_id", enterpriseId);
        }
        if (StringUtils.isNotBlank(projectName)) {
            cri.where().andLike("name", "%" + projectName + "%");
        }
        cri.getOrderBy().desc("id");
        List<ProjectBean> list = dao.query(ProjectBean.class, cri, new Pager(page, size));
        int count = dao.count(ProjectBean.class, cri);
        return ResultObject.okList(list, page, size, count);
    }


    @Override
    public ResultObject listBases(@RequestParam int page, @RequestParam int size, long projectId, String baseName, int type) {
        SysUserBean userBean = ControllerHelper.getInstance(dao).getLoginUser();
        int level = userBean.getLevel();
        Criteria cri = Cnd.cri();
        String userName = userBean.getUserName();

        //系统管理员可以查看所有基地
        //企业管理员只能查看本企业的所有基地
        if (level == Constant.Define.ROLE_1) {
            cri.where().andInBySql("project_id", "SELECT id FROM project WHERE enterprise_id = (SELECT e.id FROM enterprise e,sys_user_info s WHERE e.id=s.entperprise_id AND s.user_name = '%s')", userName);
        } else if (level == Constant.Define.ROLE_2) {//普通用户只能查看自己创建的基地
            cri.where().andEquals("create_user", userName);
        }

        if (StringUtils.isNotBlank(baseName)) {
            cri.where().andLike("name", "%" + baseName + "%");
        }
        if (projectId != 0) {
            cri.where().andEquals("project_id", projectId);
        }
        if (type != 0) {
            cri.where().andEquals("type", type);
        }
        cri.getOrderBy().desc("id");
        List<Base> list = dao.query(Base.class, cri, new Pager(page, size));
        int count = dao.count(Base.class, cri);
        return ResultObject.okList(list, page, size, count);
    }

    /**
     * 农业政府平台数据展示左侧菜单栏获取企业信息
     * findEntperpriseList
     *
     * @User 李英豪
     */
    @Override
    public ResultObject findEntperpriseList(int page, int size) throws RuntimeException {
        SysUserBean userBean = ControllerHelper.getInstance(dao).getLoginUser();
        if (StringUtils.isBlank(userBean.getUserName())) {
            return ResultObject.error("用户未登录");
        }
        int level = userBean.getLevel();
        SysUserInfoBean sysUserInfoBean = dao.fetch(SysUserInfoBean.class, Cnd.where("user_name", "=", userBean.getUserName()));
        //企业的查询条件
        Cnd cnd = Cnd.where("is_del", "=", "0").and("state", "=", "0");
        long entperpriseId;
        /**
         * 1、获取用户下所有企业或该用户所属企业（根据级别而定）
         */
        // 企业白名单过滤器
        FieldFilter ff1 = FieldFilter.create(EnterpriseBean.class, "^id|name$");
        if (level < Constant.Define.ROLE_1) {//如果是管理员获取所有企业的企业信息
        } else if (level == Constant.Define.ROLE_1) {//如果是企业负责人获取所管理企业的企业信息
            entperpriseId = sysUserInfoBean.getEntperpriseId();
            cnd.and("id", "=", entperpriseId);
        } else if (level == Constant.Define.ROLE_2) {//普通用户只能查看自己所属企业的名字
            sysUserInfoBean = dao.fetch(SysUserInfoBean.class, Cnd.where("user_name", "=", userBean.getParentUser()));
            entperpriseId = sysUserInfoBean.getEntperpriseId();
            cnd.and("id", "=", entperpriseId);
        }
        List<EnterpriseBean> enterpriseBeanList = Daos.ext(dao, ff1).query(EnterpriseBean.class, cnd, new Pager(page, size));
        int count = Daos.ext(dao, ff1).count(EnterpriseBean.class, cnd);
        return ResultObject.okList(enterpriseBeanList, page, size, count);
    }

    /**
     * 农业政府平台数据展示左侧菜单栏获取企业下项目信息
     * findProjectList
     *
     * @param entperpriseId 企业Id
     * @User 李英豪
     */
    @Override
    public ResultObject findProjectList(int page, int size, long entperpriseId, int type) throws RuntimeException {
        SysUserBean userBean = ControllerHelper.getInstance(dao).getLoginUser();
        if (StringUtils.isBlank(userBean.getUserName())) {
            return ResultObject.error("用户未登录");
        }
        //项目的查询条件
        Cnd cnd = Cnd.where("enterprise_id", "=", entperpriseId);
        // 项目白名单过滤器
        FieldFilter ff = FieldFilter.create(ProjectBean.class, "^id|name|type$");
        if (userBean.getLevel() == Constant.Define.ROLE_2) {//普通用户只能查看自己创建
            cnd.and("create_user", "=", userBean.getUserName());
        }
        if (type != 0) {
            cnd.and("type", "=", type);
        }
        List<ProjectBean> projectBeanList = Daos.ext(dao, ff).query(ProjectBean.class, cnd, new Pager(page, size));
        int count = Daos.ext(dao, ff).count(ProjectBean.class, cnd);
        return ResultObject.okList(projectBeanList, page, size, count);
    }

    /**
     * 农业政府平台数据展示左侧菜单栏获取项目下基地信息
     * findBaseList
     *
     * @param projectId 项目Id
     * @param type      类型
     * @User 李英豪
     */
    @Override
    public ResultObject findBaseList(int page, int size, long projectId, int type) throws RuntimeException {
        SysUserBean userBean = ControllerHelper.getInstance(dao).getLoginUser();
        if (StringUtils.isBlank(userBean.getUserName())) {
            return ResultObject.error("用户未登录");
        }
        //项目的查询条件
        Cnd cnd = Cnd.where("project_id", "=", projectId);
        if (userBean.getLevel() == Constant.Define.ROLE_2) {//普通用户只能查看自己创建
            cnd.and("create_user", "=", userBean.getUserName());
        }
        if (type != 0) {
            cnd.and("type", "=", type);
        }
        List<Base> baseList = dao.query(Base.class, cnd, new Pager(page, size));
        int count = dao.count(Base.class, cnd);
        return ResultObject.okList(baseList, page, size, count);
    }


    @Override
    public ResultObject listScenes(@RequestParam int page, @RequestParam int size, long baseId, String sceneName) {
        SysUserBean userBean = ControllerHelper.getInstance(dao).getLoginUser();
        int level = userBean.getLevel();
        Criteria cri = Cnd.cri();
        String userName = userBean.getUserName();

        //系统管理员可以查看所有场景
        //企业管理员只能查看本企业的所有场景
        cri.where().and("type", "=", Constant.FarmInfoType.SCENE).and("delete_flag", "=", "0");
        if (level == Constant.Define.ROLE_1) {
            cri.where().andInBySql("parent_id", "SELECT id FROM base WHERE\tproject_id IN (SELECT\tid FROM\tproject WHERE\tenterprise_id = ( SELECT e.id FROM enterprise e, sys_user_info s WHERE e.NAME = s.company AND s.user_name = '%s' ) )", userName);
        } else if (level == Constant.Define.ROLE_2) {//普通用户只能查看自己创建的基地
            cri.where().andEquals("create_user", userName);
        }
        if (baseId != 0) {
            cri.where().andEquals("parent_id", baseId);
        }
        if (StringUtils.isNotBlank(sceneName)) {
            cri.where().andEquals("farm_name", "%" + sceneName + "%");
        }
        cri.getOrderBy().desc("id");
        List<FarmInfoBean> list = dao.query(FarmInfoBean.class, cri, new Pager(page, size));
        int count = dao.count(FarmInfoBean.class, cri);
        return ResultObject.okList(list, page, size, count);
    }

    @Override
    public List<Base> listBasesByProjectId(long projectId) {
        SysUserBean userBean = ControllerHelper.getInstance(dao).getLoginUser();
        Cnd cnd = Cnd.where("project_id", "=", projectId);
        if (userBean.getLevel() > Constant.Define.ROLE_1) {
            cnd.and("create_user", "=", userBean.getUserName());
        }
        return dao.query(Base.class, cnd);
    }

    @Override
    public List<FarmInfoBean> listScenesByBaseId(long baseId, Integer sceneType) {
        SysUserBean userBean = ControllerHelper.getInstance(dao).getLoginUser();
        Cnd cnd = Cnd.where("parent_id", "=", baseId)
                .and("delete_flag", "=", "0")
                .and("type", "=", Constant.FarmInfoType.SCENE);

        if (userBean.getLevel() > Constant.Define.ROLE_1) {
            cnd.and("create_user", "=", userBean.getUserName());
        }

        if (sceneType != null) {
            cnd.and("sub_type", "=", sceneType);
        }
        return dao.query(FarmInfoBean.class, cnd);
    }

    @Override
    public ResultObject insertEnterprise(EnterpriseBean bean) {
        EnterpriseBean enterpriseBean = dao.fetch(EnterpriseBean.class, Cnd.where("name", "=", bean.getName()));
        if (enterpriseBean != null) {
            return ResultObject.apiError("err187");//用户名已存在
        }

        return dao.insert(bean) != null ? ResultObject.ok("success") : ResultObject.apiError("fail");
    }

    @Override
    public ResultObject insertProject(ProjectBean bean) {
        ProjectBean projectBean = dao.fetch(ProjectBean.class, Cnd.where("name", "=", bean.getName()));
        if (projectBean != null) {
            return ResultObject.apiError("err188");//项目名已存在
        }
        bean.setCreateUser(ControllerHelper.getLoginUserName());
        bean.setCreateTime(Utils.getCurrentTimestamp());
        return dao.insert(bean) != null ? ResultObject.ok("success") : ResultObject.apiError("fail");
    }

    @Override
    public ResultObject updateEnterprise(EnterpriseBean bean) {
        try {
            //开启事务
            Trans.exec(() -> {
                EnterpriseBean oldBean = dao.fetch(EnterpriseBean.class, Cnd.where("id", "=", bean.getId()));
                //如果企业名称被修改，则修改该企业下的所有用户的企业名称
                if (oldBean != null && !oldBean.getName().equals(bean.getName())) {
                    dao.update(SysUserInfoBean.class, Chain.make("company", bean.getName()), Cnd.where("company", "=", oldBean.getName()));
                }
                dao.update(bean);
            });
        } catch (Exception e) {
            log.error(e.toString());
            return ResultObject.apiError("fail");
        }
        return ResultObject.ok("success");
    }

    @Override
    public ResultObject updateProject(ProjectBean bean) {
        return dao.update(bean) > 0 ? ResultObject.ok("success") : ResultObject.apiError("fail");
    }

    @Override
    public ResultObject deleteEnterpriseById(long id) {
        int projectCount = dao.count(ProjectBean.class, Cnd.where("enterprise_id", "=", id));
        if (projectCount > 0) {
            return ResultObject.apiError("err184");//请先删除该企业下的项目信息
        }
        return dao.delete(EnterpriseBean.class, id) > 0 ? ResultObject.ok("success") : ResultObject.apiError("fail");

    }

    @Override
    public ResultObject deleteProjectById(long id) {
        int baseCount = dao.count(Base.class, Cnd.where("project_id", "=", id));
        if (baseCount > 0) {
            return ResultObject.apiError("err180");//请先删除该项目下的基地信息
        }
        return dao.delete(ProjectBean.class, id) > 0 ? ResultObject.ok("success") : ResultObject.apiError("fail");
    }

    @Override
    public ResultObject insertBase(Base bean) {
        bean.setCreateUser(ControllerHelper.getLoginUserName());
        bean.setCreateTime(Utils.getCurrentTimestamp());
        return dao.insert(bean) != null ? ResultObject.ok("success") : ResultObject.apiError("fail");
    }

    @Override
    public ResultObject updateBase(Base bean) {
        return dao.update(bean) > 0 ? ResultObject.ok("success") : ResultObject.apiError("fail");
    }

    @Override
    public ResultObject deleteBaseById(long id) {
        String userName = ControllerHelper.getLoginUserName();
        int sceneCount = dao.count(FarmInfoBean.class, Cnd.where("parent_id", "=", id)
                .and("type", "=", Constant.FarmInfoType.SCENE)
                .and("delete_flag", "=", "0")
                .and("create_user", "=", userName)
        );
        if (sceneCount > 0) {
            return ResultObject.apiError("err181");//请先删除该基地下的场景信息
        }
        return dao.delete(Base.class, id) > 0 ? ResultObject.ok("success") : ResultObject.apiError("fail");
    }

    @Override
    @Transactional
    public void insertScene(FarmInfoBean bean) throws ServiceException {
        try {
            SysUserBean userBean = ControllerHelper.getInstance(dao).getLoginUser();
            String userName = userBean.getUserName();

            //初始化三个分组
            //顶级场景分组
            UserGroupBean indexFarmGroupBean = new UserGroupBean(bean.getFarmName(), userName, 0, Utils.getCurrentTimestamp());
            dao.insert(indexFarmGroupBean);

            //添加的顺序为继电器设备分组-》采集设备分组
            //继电器设备分组
            UserGroupBean relayGroupBean = new UserGroupBean("继电器设备", userName, indexFarmGroupBean.getId(), Utils.getCurrentTimestamp());
            if (dao.insert(relayGroupBean) != null) {
                //采集设备分组
                UserGroupBean dataDeviceGroupBean = new UserGroupBean("采集设备", userName, indexFarmGroupBean.getId(), Utils.getCurrentTimestamp());
                dao.insert(dataDeviceGroupBean);
            }
            //创建农场
            bean.setCreateTime(Utils.getCurrentTimestamp());
            bean.setCreateUser(userName);
            bean.setDeleteFlag("0");
            bean.setGroupId(indexFarmGroupBean.getId());
            bean.setType(Constant.FarmInfoType.SCENE);//场景类型

            if (dao.insert(bean) == null) {
                throw new ServiceException("场景添加失败");
            }
        } catch (Exception e) {
            log.error(e.toString());
            if (e instanceof ServiceException) {
                throw e;
            }
            throw new ServiceException("操作失败");
        }
    }

    @Override
    @Transactional
    public void updateScene(FarmInfoBean bean) throws ServiceException {
        try {
            FarmInfoBean oldBean = dao.fetch(FarmInfoBean.class, Cnd.where("id", "=", bean.getId()));

            String oldFarmName = oldBean.getFarmName();
            if (oldBean != null) {
                bean.setCreateTime(oldBean.getCreateTime());
                bean.setCreateUser(oldBean.getCreateUser());
                bean.setDeleteFlag(oldBean.getDeleteFlag());
                bean.setGroupId(oldBean.getGroupId());
                bean.setStatus(oldBean.getStatus());
                bean.setType(oldBean.getType());
                bean.setIrrigationTime(oldBean.getIrrigationTime());
                if (dao.update(bean) <= 0) {
                    throw new ServiceException("场景更新失败");
                }
            } else {
                throw new ServiceException("场景不存在");
            }

            //如果场景名称更改，则继续更改对应的根设备分组名称
            if (!bean.getFarmName().equals(oldFarmName)) {
                UserGroupBean userGroupBean = dao.fetch(UserGroupBean.class, oldBean.getGroupId());
                userGroupBean.setGroupName(bean.getFarmName());
                if (dao.update(userGroupBean) <= 0) {
                    throw new ServiceException("场景根设备分组更新失败");
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
            if (e instanceof ServiceException) {
                throw e;
            }
            throw new ServiceException("操作失败");
        }
    }

    @Override
    public ResultObject deleteSceneById(long id) {
        try {
            //开启事务
            Trans.exec(() -> {
                FarmInfoBean bean = dao.fetch(FarmInfoBean.class, Cnd.where("id", "=", id));

                if (bean == null) {
                    throw new RuntimeException("场景不存在");
                }

//                int cropCount = dao.count(FarmCropsBean.class, Cnd.where("farm_info_id", "=", id).and("delete_flag", "=", "0"));
//                if (cropCount > 0) {
//                    throw new ServiceException("该农场下有农产品信息，请先删除农产品");
//                }

                //如果该农场下绑定有设备，则不能删除
                if (farmInfoService.hasBoundedDevice(id + "")) {
                    throw new ServiceException("该场景下有未解绑设备");
                }

                //如果该农场下绑定有摄像头，则不能删除
                int cameraCount = dao.count(CameraApplicationBean.class, Cnd.where("is_del", "=", "0").and("app_id", "=", id).and("app_type", "=", Constant.CameraAppType.DAPENG));
                if (cameraCount > 0) {
                    throw new ServiceException("该场景下有未解绑摄像头");
                }

                //删除其下所有设备分组
                dao.update(UserGroupBean.class, Chain.make("is_del", 1), Cnd.where("parent_id", "=", bean.getGroupId()));

                //删除农场顶级设备分组
                dao.update(UserGroupBean.class, Chain.make("is_del", 1), Cnd.where("id", "=", bean.getGroupId()));

                //标记农场为已删除
                bean.setDeleteFlag("1");
                dao.update(bean);

            });

        } catch (Exception e) {
            log.error(e.toString());
            if (e instanceof ServiceException) {
                return ResultObject.apiError(e.getMessage());
            }
            return ResultObject.apiError("fail");
        }
        return ResultObject.ok("success");
    }

    @Override
    public List<FarmInfoBean> listScenesBySubType(int subType) {
        String userName = ControllerHelper.getLoginUserName();
        return dao.query(FarmInfoBean.class, Cnd.where("create_user", "=", userName)
                .and("type", "=", Constant.FarmInfoType.SCENE)
                .and("sub_type", "=", subType)
                .and("delete_flag", "=", "0"));
    }

    /**
     * 获取项目和基地的二级列表
     *
     * @return
     */
    @Override
    public List<ProjectBean> listProjectsWithBases() {
        //获取所有项目
        SysUserBean userBean = ControllerHelper.getInstance(dao).getLoginUser();
        int level = userBean.getLevel();
        Criteria cri = Cnd.cri();

        //系统管理员可以查看所有项目
        //企业管理员只能查看本企业的所有项目
        if (level == Constant.Define.ROLE_1) {
            //查询所属企业
            cri.where().andInBySql("enterprise_id", "SELECT e.id FROM enterprise e,sys_user_info s WHERE e.name=s.company AND s.user_name = '%s'", userBean.getUserName());
        } else if (level == Constant.Define.ROLE_2) {//普通用户只能查看自己创建的项目
            cri.where().andEquals("create_user", userBean.getUserName());
        }
        List<ProjectBean> projects = dao.query(ProjectBean.class, cri);

        //拼接projectId
        StringBuilder projectIdsStr = new StringBuilder();
        for (int i = 0; i < projects.size(); i++) {
            projectIdsStr.append(projects.get(i).getId());
            if (i != projects.size() - 1) {
                projectIdsStr.append(",");
            }
        }

        //获取项目之下的基地
        //系统管理员可以查看所有场景
        //企业管理员只能查看本企业的所有场景
        cri = Cnd.cri();
        cri.where().and("type", "=", Constant.FarmInfoType.SCENE);
        if (level == Constant.Define.ROLE_1) {
            cri.where().andInBySql("parent_id", "SELECT id FROM base WHERE\tproject_id IN ('%s') )", projectIdsStr.toString());
        } else if (level == Constant.Define.ROLE_2) {//普通用户只能查看自己创建的基地
            cri.where().andEquals("create_user", userBean.getUserName());
        }

        List<Base> bases = dao.query(Base.class, cri);
        for (ProjectBean project : projects) {
            List<Base> sonMenus = new ArrayList<>();
            for (Base base : bases) {
                if (((Long) base.getProjectId()).equals(project.getId())) {
                    sonMenus.add(base);
                }
            }
            project.setBases(sonMenus);
        }

        return projects;

    }

    //删除设备和用户名的匹配，
    @Override
    public List<DeviceBean> getSceneDeviceList(int page, int size, String deviceNumber, List<UserGroupBean> userGroupBeans) throws Exception {

        Pager pager = dao.createPager(page, size);
        Sql sql = null;
        if (StringUtils.isBlank(deviceNumber)) {
            sql = Sqls.create(" SELECT distinct u.*, d.Nserson_type as type, d.device_type as device_type , d.Nsensor_data as data,d.Nonlinestate as onLineState,d.Nrecord_time as time,d.template_id as template_id FROM network d , sys_user_to_devcie u  where is_del=0 and d.Ncode = u.Ncode and (u.group_id = @groupId1 or u.group_id = @groupId2)");
        } else {
            sql = Sqls.create(" SELECT distinct u.*, d.Nserson_type as type, d.device_type as device_type,d.Nsensor_data as data,d.Nonlinestate as onLineState,d.Nrecord_time as time,d.template_id as template_id FROM network d , sys_user_to_devcie u  where u.Ncode LIKE @ncode and is_del=0 and d.Ncode = u.Ncode and (u.group_id = @groupId1 or u.group_id = @groupId2)");
            sql.params().set("ncode", "%" + deviceNumber + "%");
        }
        sql.setCallback((conn, rs, sql1) -> {
            List<DeviceBean> list = new LinkedList<DeviceBean>();
            while (rs.next()) {
                DeviceBean deviceBean = new DeviceBean();
                deviceBean.setId(rs.getLong("id"));
                deviceBean.setData(rs.getString("data"));
                deviceBean.setOnLineState(rs.getInt("onLineState"));
                deviceBean.setDeviceNumber(rs.getString("Ncode"));
                deviceBean.setPassword(rs.getString("Npassword"));
                deviceBean.setUserName(rs.getString("user_name"));
                deviceBean.setCreatTime(rs.getTimestamp("create_time"));
                deviceBean.setName(rs.getString("device_name"));
                deviceBean.setLatitude(rs.getDouble("latitude"));
                deviceBean.setLongitude(rs.getDouble("longitude"));
                deviceBean.setTemplateId(rs.getLong("template_id"));
                deviceBean.setTime(rs.getTimestamp("time"));
                deviceBean.setType(rs.getString("type"));
                deviceBean.setDeviceType(rs.getInt("device_type"));

                list.add(deviceBean);
            }
            return list;
        });
        sql.setPager(pager);
        sql.params().set("groupId1", userGroupBeans.get(0).getId());
        sql.params().set("groupId2", userGroupBeans.get(1).getId());
        dao.execute(sql);
        return sql.getList(DeviceBean.class);
    }

    @Override
    public int getSceneDeviceListCount(String deviceNumber, List<UserGroupBean> userGroupBeans) throws Exception {

        Sql sql = null;
        if (StringUtils.isBlank(deviceNumber)) {
            sql = Sqls.create(" SELECT count(1) FROM network d , sys_user_to_devcie u  where is_del=0 and d.Ncode = u.Ncode and (u.group_id = @groupId1 or u.group_id = @groupId2 ) and u.is_del=0");
        } else {
            sql = Sqls.create(" SELECT count(1) FROM network d , sys_user_to_devcie u  where u.Ncode = @ncode and is_del=0 and d.Ncode = u.Ncode and (u.group_id = @groupId1 or u.group_id = @groupId2 ) and u.is_del=0");
            sql.params().set("ncode", deviceNumber);
        }
        sql.setCallback(Sqls.callback.integer());
        sql.params().set("groupId1", userGroupBeans.get(0).getId());
        sql.params().set("groupId2", userGroupBeans.get(1).getId());
        dao.execute(sql);
        return sql.getInt();
    }

    /**
     * 农业政府平台企业停用与恢复
     * updateEnterpriseState
     *
     * @param id    企业Id
     * @param state 启用0 停用1
     * @User 李英豪
     */
    @Override
    @Transactional
    public ResultObject updateEnterpriseState(String id, String state) throws RuntimeException {
        SysUserBean userBean = ControllerHelper.getInstance(dao).getLoginUser();
        if (StringUtils.isBlank(userBean.getUserName())) {
            return ResultObject.error("用户未登录");
        }
        if (userBean.getLevel() > Constant.Define.ROLE_0) {
            return ResultObject.error("级别不足，无法操作");
        }
        EnterpriseBean enterpriseBean = dao.fetch(EnterpriseBean.class, Cnd.where("id", "=", id));
        enterpriseBean.setState(state);
        dao.update(enterpriseBean);
        /**
         *  停用该企业下所有用户
         */
        userService.updateUserInfoState(Long.parseLong(id), state);
        return ResultObject.ok("success");
    }

    /**
     * 获取用户下所有非停用企业个数
     *
     * @return
     * @User 李英豪
     */
    @Override
    public ResultObject findEntperpriseListCount() throws RuntimeException {
        SysUserBean userBean = ControllerHelper.getInstance(dao).getLoginUser();
        if (userBean.getLevel() > Constant.Define.ROLE_0) {
            return ResultObject.apiError("");
        }
        List<EnterpriseBean> enterpriseBeanList = dao.query(EnterpriseBean.class, Cnd.where("state", "=", "0")
                .and("is_del", "=", "0"));
        return ResultObject.okList(enterpriseBeanList);
    }

    @Override
    public List<Enterprise> listAllEnterprisesForExport() {
        SysUserBean userBean = ControllerHelper.getInstance(dao).getLoginUser();
        //管理员可以查看所有企业
        String sql = "SELECT name ,address,header,tel,ycoordinate,xcoordinate FROM enterprise WHERE is_del = 0 ";
        int level = userBean.getLevel();
        if (level == Constant.Define.ROLE_1) {//一级用户根据自己的公司进行查看
            SysUserInfoBean userInfoBean = dao.fetch(SysUserInfoBean.class, Cnd.where("user_name", "=", userBean.getUserName()));
            sql += ("AND id =" + (userInfoBean == null ? 0 : userInfoBean.getEntperpriseId()));
        } else if (level > Constant.Define.ROLE_1) {
            SysUserInfoBean userInfoBean = dao.fetch(SysUserInfoBean.class, Cnd.where("user_name", "=", userBean.getParentUser()));
            sql += ("AND id =" + (userInfoBean == null ? 0 : userInfoBean.getEntperpriseId()));
        }
        Sql sqlObj = Sqls.create(sql);
        sqlObj.setCallback(new SqlCallback() {
            public Object invoke(Connection conn, ResultSet rs, Sql sql) throws SQLException {
                List<Enterprise> list = new LinkedList<Enterprise>();
//                Enterprise e;
                while (rs.next()) {
                    Enterprise e = new Enterprise();
                    e.setName(rs.getString("name"));
                    e.setAddress(rs.getString("address"));
                    e.setHeader(rs.getString("header"));
                    e.setTel(rs.getString("tel"));
                    e.setLongitude(rs.getDouble("ycoordinate"));
                    e.setLatitude(rs.getDouble("xcoordinate"));
                    list.add(e);
                }
                return list;
            }
        });
        dao.execute(sqlObj);
        List<Enterprise> res = sqlObj.getList(Enterprise.class);
        return sqlObj.getList(Enterprise.class);
    }

    @Data
    public class Enterprise {
        @Excel(name = "企业名称", width = 50)
        private String name;

        @Excel(name = "企业地址", width = 45)
        private String address;

        @Excel(name = "企业负责人", width = 24)
        private String header;

        @Excel(name = "企业电话", width = 24)
        private String tel;

        @Excel(name = "经度", width = 16)
        private double longitude;

        @Excel(name = "纬度", width = 16)
        private double latitude;

    }

    @Override
    public List<InnerBase> listAllBasesForExport() {
        SysUserBean userBean = ControllerHelper.getInstance(dao).getLoginUser();
        int level = userBean.getLevel();
        Criteria cri = Cnd.cri();
        String userName = userBean.getUserName();

        String sqlStr = "SELECT name,ycoordinate,xcoordinate,create_user FROM base";
        //系统管理员可以查看所有基地
        //企业管理员只能查看本企业的所有基地
        if (level == Constant.Define.ROLE_1) {
            sqlStr += "WHERE project_id IN (SELECT id FROM project WHERE enterprise_id = (SELECT e.id FROM enterprise e,sys_user_info s WHERE e.id=s.entperprise_id AND s.user_name =" + userName + ")";
        } else if (level == Constant.Define.ROLE_2) {//普通用户只能查看自己创建的基地
            sqlStr += ("WHERE create_user = " + userName);
        }

        Sql sql = Sqls.create(sqlStr);
        sql.setCallback(new SqlCallback() {
            public Object invoke(Connection conn, ResultSet rs, Sql sql) throws SQLException {
                List<InnerBase> list = new LinkedList<>();
//                Enterprise e;
                while (rs.next()) {
                    InnerBase e = new InnerBase();
                    e.setName(rs.getString("name"));
                    e.setCreateUser(rs.getString("create_user"));
                    e.setXcoordinate(rs.getDouble("xcoordinate"));
                    e.setYcoordinate(rs.getDouble("ycoordinate"));
                    list.add(e);
                }
                return list;
            }
        });
        dao.execute(sql);
        return sql.getList(InnerBase.class);

    }

    @Data
    public class InnerBase {
        @Excel(name = "基地名称", width = 50)
        private String name;

        @Excel(name = "经度", width = 45)
        private double ycoordinate;

        @Excel(name = "纬度", width = 24)
        private double xcoordinate;

        @Excel(name = "创建者", width = 24)
        private String createUser;

    }
}
