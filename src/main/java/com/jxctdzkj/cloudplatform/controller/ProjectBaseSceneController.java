package com.jxctdzkj.cloudplatform.controller;

import cn.afterturn.easypoi.excel.entity.ExportParams;
import com.jxctdzkj.cloudplatform.bean.*;
import cn.afterturn.easypoi.excel.ExcelExportUtil;
import com.jxctdzkj.cloudplatform.config.Constant;
import com.jxctdzkj.cloudplatform.exception.ServiceException;
import com.jxctdzkj.cloudplatform.opLog.EnableOpLog;
import com.jxctdzkj.cloudplatform.service.FarmInfoService;
import com.jxctdzkj.cloudplatform.service.ProjectBaseSceneService;
import com.jxctdzkj.cloudplatform.service.UserService;
import com.jxctdzkj.cloudplatform.service.impl.ProjectBaseSceneServiceImpl;
import com.jxctdzkj.cloudplatform.utils.ControllerHelper;
import com.jxctdzkj.cloudplatform.utils.FileWriteUtil;
import com.jxctdzkj.cloudplatform.utils.ResultObject;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.apache.poi.ss.usermodel.Workbook;
import org.nutz.dao.Cnd;
import org.nutz.dao.Dao;
import org.nutz.dao.pager.Pager;
import org.nutz.dao.sql.Criteria;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.util.HashMap;
import java.util.List;

/**
 * @Description 项目配置管理（项目、基地、场景）
 * @Author chanmufeng
 * @Date 2019/9/5 10:52
 **/
@Controller
@RequestMapping("/projectBaseScene")
@Slf4j
public class ProjectBaseSceneController {

    @Autowired
    Dao dao;

    @Autowired
    FarmInfoService newFarmInfoService;

    @Autowired
    ProjectBaseSceneService projectBaseSceneService;

    @Autowired
    UserService userService;

    // 跳转企业列表
    @RequestMapping(value = "/enterpriseList")
    public String enterpriseList() {
        return "smartAgricultureSystem/enterprise/list";
    }

    // 跳转项目列表
    @RequestMapping(value = "/projectList")
    public ModelAndView projectList() {
        HashMap<String, Object> data = new HashMap<>();
        List<EnterpriseBean> enterpriseBeans = projectBaseSceneService.listAllEnterPrises();
        data.put("enterprises", enterpriseBeans);
        return new ModelAndView("smartAgricultureSystem/project/list", "enterprises", enterpriseBeans);
    }

    // 跳转基地列表
    @RequestMapping(value = "/baseList")
    public ModelAndView baseList() {
//        List<ProjectBean> projects = projectBaseSceneService.listAllProjects();
        List<EnterpriseBean> enterpriseBeans = projectBaseSceneService.listAllEnterPrises();
        HashMap<String, Object> data = new HashMap<>();
//        data.put("projects", projects);
        data.put("enterprises", enterpriseBeans);
        return new ModelAndView("smartAgricultureSystem/base/list", "data", data);
    }

    // 跳转场景列表
    @RequestMapping(value = "/sceneList")
    public ModelAndView sceneList() {
        HashMap<String, Object> data = new HashMap<>();
        List<EnterpriseBean> enterpriseBeans = projectBaseSceneService.listAllEnterPrises();
        data.put("enterprises", enterpriseBeans);
        return new ModelAndView("smartAgricultureSystem/scene/list", "data", data);
    }

    //跳转企业新增
    @RequestMapping(value = "toAddEnterprise")
    public ModelAndView toAddEnterprise() {
        return new ModelAndView("smartAgricultureSystem/enterprise/addOrUpdate", "bean", new EnterpriseBean());
    }

    //跳转项目新增
    @RequestMapping(value = "toAddProject")
    public ModelAndView toAddProject() {
        HashMap<String, Object> data = new HashMap<>();
        data.put("bean", new ProjectBean());
        List<EnterpriseBean> enterpriseBeans = projectBaseSceneService.listAllEnterPrises();
        data.put("enterprises", enterpriseBeans);
        return new ModelAndView("smartAgricultureSystem/project/addOrUpdate", "data", data);
    }

    //跳转基地新增
    @RequestMapping(value = "toAddBase")
    public ModelAndView toAddBase() {
        HashMap<String, Object> data = new HashMap<>();
        data.put("bean", new Base());
        //搜索所有基地类型
        List<BaseTypeBean> baseTypes = dao.query(BaseTypeBean.class, null);
        data.put("types", baseTypes);
        //获取所有项目
        List<ProjectBean> projects = projectBaseSceneService.listAllProjects();
        data.put("projects", projects);
        return new ModelAndView("smartAgricultureSystem/base/addOrUpdate", "data", data);
    }

    //跳转场景新增
    @RequestMapping(value = "toAddScene")
    public ModelAndView toAddScene() {
        HashMap<String, Object> data = new HashMap<>();
        data.put("bean", new FarmInfoBean());
//        //搜索所有基地类型
//        List<BaseTypeBean> baseTypes = dao.query(BaseTypeBean.class, null);
//        data.put("types", baseTypes);
        //获取所有基地
        List<Base> bases = projectBaseSceneService.listAllBases();
        data.put("bases", bases);
        return new ModelAndView("smartAgricultureSystem/scene/addOrUpdate", "data", data);
    }

    //跳转企业更新
    @RequestMapping(value = "toUpdateEnterprise")
    public ModelAndView toUpdateEnterprise(@RequestParam long id) {
        EnterpriseBean bean = dao.fetch(EnterpriseBean.class, id);
        return new ModelAndView("smartAgricultureSystem/enterprise/addOrUpdate", "bean", bean);
    }

    //跳转项目更新
    @RequestMapping(value = "toUpdateProject")
    public ModelAndView toUpdateProject(@RequestParam long id) {
        ProjectBean bean = dao.fetch(ProjectBean.class, id);
        HashMap<String, Object> data = new HashMap<>();
        data.put("bean", bean);
        List<EnterpriseBean> enterpriseBeans = projectBaseSceneService.listAllEnterPrises();
        data.put("enterprises", enterpriseBeans);
        return new ModelAndView("smartAgricultureSystem/project/addOrUpdate", "data", data);
    }

    //跳转基地更新
    @RequestMapping(value = "toUpdateBase")
    public ModelAndView toUpdateBase(@RequestParam long id) {
        HashMap<String, Object> data = new HashMap<>();
        //搜索所有基地类型
        List<BaseTypeBean> baseTypes = dao.query(BaseTypeBean.class, null);
        data.put("types", baseTypes);
        //获取所有项目
        List<ProjectBean> projects = projectBaseSceneService.listAllProjects();
        data.put("projects", projects);
        Base bean = dao.fetch(Base.class, id);
        data.put("bean", bean);
        return new ModelAndView("smartAgricultureSystem/base/addOrUpdate", "data", data);
    }

    //跳转场景更新
    @RequestMapping(value = "toUpdateScene")
    public ModelAndView toUpdateScene(@RequestParam long id) {
        HashMap<String, Object> data = new HashMap<>();
        //获取所有基地
        List<Base> bases = projectBaseSceneService.listAllBases();
        data.put("bases", bases);
        FarmInfoBean bean = dao.fetch(FarmInfoBean.class, id);
        data.put("bean", bean);
        return new ModelAndView("smartAgricultureSystem/scene/addOrUpdate", "data", data);
    }

    @RequestMapping(value = "listEnterprises")
    @ResponseBody
    public ResultObject listEnterprises(@RequestParam int page, @RequestParam int size, String enterpriseName) {
        return projectBaseSceneService.listEnterprises(page, size, enterpriseName);
    }

    @RequestMapping(value = "listProjectsByEnterpriseId")
    @ResponseBody
    public ResultObject listProjectsByEnterpriseId(@RequestParam long enterpriseId) {
        List<ProjectBean> projectBeans = projectBaseSceneService.listProjectsByEnterpriseId(enterpriseId);
        return ResultObject.okList(projectBeans);
    }

    @RequestMapping(value = "listProjects")
    @ResponseBody
    public ResultObject listProjects(@RequestParam int page, @RequestParam int size, Long enterpriseId, String projectName) {
        return projectBaseSceneService.listProjects(page, size, enterpriseId == null ? 0 : enterpriseId, projectName);
    }

    @RequestMapping(value = "listBases")
    @ResponseBody
    public ResultObject listBases(@RequestParam int page, @RequestParam int size,
                                  Long projectId, String baseName,
                                  @RequestParam(value = "type", required = false, defaultValue = "0") int type) {
        return projectBaseSceneService.listBases(page, size, projectId == null ? 0 : projectId, baseName, type);
    }

    /**
     * 农业政府平台数据展示左侧菜单栏获取企业信息
     * findEntperpriseList
     *
     * @User 李英豪
     */
    @RequestMapping(value = "findEntperpriseList")
    @ResponseBody
    public ResultObject findEntperpriseList(@RequestParam(value = "page", required = false, defaultValue = "1") int page,
                                            @RequestParam(value = "size", required = false, defaultValue = "100") int size) {
        try {
            ResultObject resultObject = projectBaseSceneService.findEntperpriseList(page, size);
            return resultObject;
        } catch (RuntimeException e) {
            return ResultObject.apiError("fail");
        }
    }

    /**
     * 农业政府平台数据展示左侧菜单栏获取企业下项目信息
     * findProjectList
     *
     * @param entperpriseId 企业Id
     * @param type          类型
     * @User 李英豪
     */
    @RequestMapping(value = "findProjectList")
    @ResponseBody
    public ResultObject findProjectList(@RequestParam(value = "page", required = false, defaultValue = "1") int page,
                                        @RequestParam(value = "size", required = false, defaultValue = "100") int size,
                                        long entperpriseId, @RequestParam(value = "type", required = false, defaultValue = "0") int type) {
        try {
            ResultObject resultObject = projectBaseSceneService.findProjectList(page, size, entperpriseId, type);
            return resultObject;
        } catch (RuntimeException e) {
            return ResultObject.apiError("fail");
        }
    }

    /**
     * 农业政府平台数据展示左侧菜单栏获取项目下基地信息
     * findBaseList
     *
     * @param projectId 项目Id
     * @param type      类型
     * @User 李英豪
     */
    @RequestMapping(value = "findBaseList")
    @ResponseBody
    public ResultObject findBaseList(@RequestParam(value = "page", required = false, defaultValue = "1") int page,
                                     @RequestParam(value = "size", required = false, defaultValue = "100") int size,
                                     long projectId, @RequestParam(value = "type", required = false, defaultValue = "0") int type) {
        try {
            ResultObject resultObject = projectBaseSceneService.findBaseList(page, size, projectId, type);
            return resultObject;
        } catch (RuntimeException e) {
            return ResultObject.apiError("fail");
        }
    }


    @RequestMapping("listBasesByProjectId")
    @ResponseBody
    public ResultObject listBasesByProjectId(@RequestParam long projectId) {
        List<Base> bases = projectBaseSceneService.listBasesByProjectId(projectId);
        return ResultObject.okList(bases);
    }

    @RequestMapping(value = "listScenes")
    @ResponseBody
    public ResultObject listScenes(@RequestParam int page, @RequestParam int size,
                                   Long baseId, String sceneName) {
        return projectBaseSceneService.listScenes(page, size, baseId == null ? 0 : baseId, sceneName);
    }

    @RequestMapping(value = "listScenesByBaseId")
    @ResponseBody
    public ResultObject listScenesByBaseId(long baseId, Integer sceneType) {
        List<FarmInfoBean> scenes = projectBaseSceneService.listScenesByBaseId(baseId, sceneType);
        return ResultObject.okList(scenes);
    }

    @RequestMapping(value = "saveEnterprise")
    @ResponseBody
    @EnableOpLog(Constant.ModifyType.SAVE)
    public ResultObject saveEnterprise(EnterpriseBean bean) {
        if (bean.getId() == 0) {
            return projectBaseSceneService.insertEnterprise(bean);
        }
        return projectBaseSceneService.updateEnterprise(bean);
    }

    @RequestMapping(value = "saveProject")
    @ResponseBody
    @EnableOpLog(Constant.ModifyType.SAVE)
    public ResultObject saveProject(ProjectBean bean) {
        if (bean.getId() == 0) {
            return projectBaseSceneService.insertProject(bean);
        }
        return projectBaseSceneService.updateProject(bean);
    }


    @RequestMapping(value = "saveBase")
    @ResponseBody
    @EnableOpLog(Constant.ModifyType.SAVE)
    public ResultObject saveBase(Base bean) {
        if (bean.getId() == 0) {
            return projectBaseSceneService.insertBase(bean);
        }
        return projectBaseSceneService.updateBase(bean);
    }

    @RequestMapping(value = "saveScene")
    @ResponseBody
    @EnableOpLog(Constant.ModifyType.SAVE)
    public ResultObject saveScene(FarmInfoBean bean) {
        try {
            if (bean.getId() == 0) {
                projectBaseSceneService.insertScene(bean);
            } else {
                projectBaseSceneService.updateScene(bean);
            }
        } catch (Exception e) {
            if (e instanceof ServiceException) {
                return ResultObject.apiError(e.getMessage());
            }
            return ResultObject.apiError("操作失败");
        }
        return ResultObject.ok();
    }

    @RequestMapping(value = "delEnterprise")
    @ResponseBody
    @EnableOpLog(Constant.ModifyType.DELETE)
    public ResultObject delEnterprise(@RequestParam long id) {
        return projectBaseSceneService.deleteEnterpriseById(id);
    }

    @RequestMapping(value = "delProject")
    @ResponseBody
    @EnableOpLog(Constant.ModifyType.DELETE)
    public ResultObject delProject(@RequestParam long id) {
        return projectBaseSceneService.deleteProjectById(id);
    }

    @RequestMapping(value = "delBase")
    @ResponseBody
    @EnableOpLog(Constant.ModifyType.DELETE)
    public ResultObject delBase(@RequestParam long id) {
        return projectBaseSceneService.deleteBaseById(id);
    }

    @RequestMapping(value = "delScene")
    @ResponseBody
    @EnableOpLog(Constant.ModifyType.DELETE)
    public ResultObject delScene(@RequestParam long id) {
        return projectBaseSceneService.deleteSceneById(id);
    }

    // 获取农场设备列表
    @RequestMapping(value = "/listSceneDevices")
    @ResponseBody
    public ResultObject listSceneDevices(int page, int size, String deviceNumber, String sceneId) {
        try {
            FarmInfoBean bean = dao.fetch(FarmInfoBean.class, Cnd.where("id", "=", sceneId));
            if (bean == null) {
                return ResultObject.apiError("场景不存在");
            }
            //查询当前场景分组下的所有子分组
            List<UserGroupBean> userGroupBeans = dao.query(UserGroupBean.class, Cnd.where("parent_id", "=", bean.getGroupId()).asc("id"));
            if (userGroupBeans.size() < 2) {
                return ResultObject.apiError("场景设备分组缺失");
            }
            List<DeviceBean> list = projectBaseSceneService.getSceneDeviceList(page, size, deviceNumber, userGroupBeans);
            int count = newFarmInfoService.getFarmDeviceListCountNew(deviceNumber, userGroupBeans);
            return ResultObject.okList(list, page, size, count);
        } catch (Exception e) {
            log.error(e.toString());
            return ResultObject.apiError("fail");
        }
    }

    @RequestMapping({"/toAddEnterpriseManager"})
    @ResponseBody
    public ModelAndView toAddEnterpriseManager(@RequestParam String enterpriseName) {
        return new ModelAndView("smartAgricultureSystem/enterprise/userDetail", "enterpriseName", enterpriseName);
    }

    @RequestMapping({"/toBoundEnterpriseManagerList"})
    public ModelAndView toBoundEnterpriseManagerList(@RequestParam String enterpriseName, @RequestParam String enterpriseId) {
        return new ModelAndView("smartAgricultureSystem/enterprise/boundEnterpriseManagerList")
                .addObject("enterpriseName", enterpriseName)
                .addObject("enterpriseId", enterpriseId);
    }

    @RequestMapping("listEnterpriseManagers")
    @ResponseBody
    public ResultObject listEnterpriseManagers(@RequestParam int size, @RequestParam int page, @RequestParam String enterpriseName, String userName) {
        Criteria cri = Cnd.cri();
        cri.where().andInBySql("user_name", "SELECT user_name FROM sys_user_info WHERE company = '%s' AND level = 1", enterpriseName)
                .andEquals("is_del", "0");
        if (StringUtils.isNotBlank(userName)) {
            cri.where().andLike("user_name", "%" + userName + "%");
        }
        List<SysUserBean> users = dao.query(SysUserBean.class, cri, new Pager(page, size));
        int userCount = dao.count(SysUserBean.class, cri);
        return ResultObject.okList(users, page, size, userCount);
    }

    // 绑定设备-跳转
    @RequestMapping(value = "toBoundFarmDevice")
    public ModelAndView toBoundFarmDevice(String farmId) {
        FarmInfoBean bean = dao.fetch(FarmInfoBean.class, Cnd.where("id", "=", farmId));
        return new ModelAndView("smartAgricultureSystem/scene/boundFarmDevice", "bean", bean);
    }

    // 绑定设备列表-跳转
    @RequestMapping(value = "toBoundDeviceList")
    public ModelAndView toBoundDeviceList(String id) {
        FarmInfoBean bean = dao.fetch(FarmInfoBean.class, Cnd.where("id", "=", id));
        return new ModelAndView("smartAgricultureSystem/scene/boundFarmDeviceList", "bean", bean);
    }

    // 绑定摄像头列表-跳转
    @RequestMapping(value = "toBoundCameraList")
    public ModelAndView toBoundCameraList(String appId) {
        HashMap data = new HashMap();
        data.put("appId", appId);
        data.put("appType", Constant.CameraAppType.DAPENG);
        return new ModelAndView("smartAgricultureSystem/scene/boundCameraList", "data", data);
    }

    // 绑定摄像头-跳转
    @RequestMapping(value = "toBoundCamera")
    public ModelAndView toBoundFarmDevice(String appId, String appType) {
        HashMap data = new HashMap();
        data.put("appId", appId);
        data.put("appType", appType);

        //查询当前用户绑定的所有摄像头
        String userName = ControllerHelper.getLoginUserName();
        List<CameraBean> cameraBeans = dao.query(CameraBean.class, Cnd.where("user_name", "=", userName).and("delete_flag", "=", "0"));
        data.put("cameraBeans", cameraBeans);
        return new ModelAndView("smartAgricultureSystem/scene/boundCamera", "data", data);
    }

    /**
     * 农业政府平台企业停用与恢复
     * updateEnterpriseState
     *
     * @param id    企业Id
     * @param state 启用0 停用1
     * @User 李英豪
     */
    @RequestMapping(value = "updateEnterpriseState")
    @ResponseBody
    @EnableOpLog
    public ResultObject updateEnterpriseState(String id, String state) {
        ResultObject resultObject = null;
        try {
            resultObject = projectBaseSceneService.updateEnterpriseState(id, state);
        } catch (RuntimeException e) {
            log.error(e.toString());
            resultObject.apiError("fail");
        }
        return resultObject;
    }

    /**
     * 获取用户下所有非停用企业个数
     *
     * @return
     * @User 李英豪
     */
    @RequestMapping(value = "findEntperpriseListCount")
    @ResponseBody
    public ResultObject findEntperpriseListCount() {
        ResultObject resultObject = null;
        try {
            resultObject = projectBaseSceneService.findEntperpriseListCount();
        } catch (RuntimeException e) {
            log.error(e.toString());
            resultObject.apiError("fail");
        }
        return resultObject;
    }

    @RequestMapping("exportEnterprises")
    public void countEnterprise(HttpSession session, HttpServletResponse response, HttpServletRequest request) throws Exception {
        FileWriteUtil.writeXls(session, response, request, "企业数据.xls");
        //--
        Workbook excel = ExcelExportUtil.exportExcel(new ExportParams("企业数据信息表", "企业数据"), ProjectBaseSceneServiceImpl.Enterprise.class, projectBaseSceneService.listAllEnterprisesForExport());
        excel.write(response.getOutputStream());
    }

    @RequestMapping("exportBases")
    public void exportBases(HttpSession session, HttpServletResponse response, HttpServletRequest request) throws Exception {
        FileWriteUtil.writeXls(session, response, request, "基地数据.xls");
        //--
        Workbook excel = ExcelExportUtil.exportExcel(new ExportParams("基地数据信息表", "基地数据"), ProjectBaseSceneServiceImpl.InnerBase.class, projectBaseSceneService.listAllBasesForExport());
        excel.write(response.getOutputStream());
    }
}
