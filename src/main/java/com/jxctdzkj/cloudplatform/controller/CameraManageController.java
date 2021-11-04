package com.jxctdzkj.cloudplatform.controller;

import com.jxctdzkj.cloudplatform.bean.*;
import com.jxctdzkj.cloudplatform.config.Constant;
import com.jxctdzkj.cloudplatform.exception.ServiceException;
import com.jxctdzkj.cloudplatform.opLog.EnableOpLog;
import com.jxctdzkj.cloudplatform.service.CameraService;
import com.jxctdzkj.cloudplatform.service.LeChangeService;
import com.jxctdzkj.cloudplatform.service.impl.VersionServiceImpl;
import com.jxctdzkj.cloudplatform.utils.ControllerHelper;
import com.jxctdzkj.cloudplatform.utils.ResultObject;
import com.jxctdzkj.cloudplatform.utils.ReturnObject;
import com.jxctdzkj.support.utils.TextUtils;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.nutz.dao.Cnd;
import org.nutz.dao.Dao;
import org.nutz.dao.Sqls;
import org.nutz.dao.pager.Pager;
import org.nutz.dao.sql.Sql;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import java.util.HashMap;
import java.util.List;

@Slf4j
@RequestMapping({"cameraManage"})
@Controller
public class CameraManageController {

    @Autowired
    Dao dao;

    @Autowired
    CameraService cameraService;

    @Autowired
    VersionServiceImpl versionService;

    @Autowired
    LeChangeService leChangeService;

    @RequestMapping()
    public String index() {

        return "cameraList";
    }

    @RequestMapping(value = "/tokenBind")
    public ModelAndView tokenBind() {
        String userName = ControllerHelper.getInstance(dao).getLoginUserName();
        if (StringUtils.isBlank(userName)) {
            log.error("用户未登录");
            return null;
        }
        Ys7TokenBean hkToken = new Ys7TokenBean(), dhToken = new Ys7TokenBean();
        List<Ys7TokenBean> tokens = dao.query(Ys7TokenBean.class, Cnd.where("user_name", "=", userName));
        if (tokens != null && tokens.size() > 0) {
            String curCameraType = "";
            for (int i = 0; i < tokens.size(); i++) {
                curCameraType = tokens.get(i).getCameraType();
                if (curCameraType.equals(Constant.CameraType.HAI_KANG)) {
                    hkToken = tokens.get(i);
                } else if (curCameraType.equals(Constant.CameraType.DA_HUA)) {
                    dhToken = tokens.get(i);
                }
            }
        }

        HashMap<String, Ys7TokenBean> map = new HashMap<>();
        map.put("hkToken", hkToken);
        map.put("dhToken", dhToken);
        return new ModelAndView("ys7tokenBind", "data", map);
    }

    @RequestMapping(value = "/getCameraList")
    @ResponseBody
    public ReturnObject getCameraList(int page, int limit) {
        ReturnObject result = new ReturnObject();
        SysUserBean user = ControllerHelper.getInstance(dao).getLoginUser();
        if (user == null) {
            throw new ServiceException("用户未登录");
        }
        Pager pager = new Pager(page, limit);
        List<CameraBean> list;
        int count = 0;
        if (user.getLevel() >= 1) {
            //查询用户名下设备的摄像头
            Sql sql = Sqls.create(" select a.* from camera a where a.user_name=@userName and a.delete_flag = '0' ");
            sql.setCallback(Sqls.callback.entities());
            sql.setEntity(dao.getEntity(CameraBean.class));
            sql.params().set("userName", user.getUserName());
            sql.setPager(pager);
            dao.execute(sql);
            list = sql.getList(CameraBean.class);

            Sql sql1 = Sqls.create(" SELECT count(1) from camera a where a.user_name=@userName and a.delete_flag = '0' ");
            sql1.setCallback(Sqls.callback.integer());
            sql1.params().set("userName", user.getUserName());
            dao.execute(sql1);
            count = sql1.getInt();
        } else {
            //查询所有摄像头
            list = dao.query(CameraBean.class, Cnd.where("delete_flag", "=", "0"), pager);
            Sql sql = Sqls.create(" SELECT count(1) from camera a where a.delete_flag = '0' ");
            sql.setCallback(Sqls.callback.integer());
            sql.params().set("userName", user.getUserName());
            dao.execute(sql);
            count = sql.getInt();
        }
        result.setData(list);
        result.setCode(0);
        result.setCount(count);
        return result;
    }

    @RequestMapping(value = "/listCameras")
    @ResponseBody
    public ResultObject listCameras(@RequestParam(defaultValue = "1") int page, @RequestParam(defaultValue = "10") int limit) {
        SysUserBean user = ControllerHelper.getInstance(dao).getLoginUser();
        if (user == null) {
            throw new ServiceException("用户未登录");
        }
        Pager pager = new Pager(page, limit);
        List<CameraBean> list;
        int count = 0;
        if (user.getLevel() >= 1) {
            //查询用户名下设备的摄像头
            Sql sql = Sqls.create(" select a.* from camera a where a.user_name=@userName and a.delete_flag = '0' ");
            sql.setCallback(Sqls.callback.entities());
            sql.setEntity(dao.getEntity(CameraBean.class));
            sql.params().set("userName", user.getUserName());
            sql.setPager(pager);
            dao.execute(sql);
            list = sql.getList(CameraBean.class);

            Sql sql1 = Sqls.create(" SELECT count(1) from camera a where a.user_name=@userName and a.delete_flag = '0' ");
            sql1.setCallback(Sqls.callback.integer());
            sql1.params().set("userName", user.getUserName());
            dao.execute(sql1);
            count = sql1.getInt();
        } else {
            //查询所有摄像头
            list = dao.query(CameraBean.class, Cnd.where("delete_flag", "=", "0"), pager);
            Sql sql = Sqls.create(" SELECT count(1) from camera a where a.delete_flag = '0' ");
            sql.setCallback(Sqls.callback.integer());
            sql.params().set("userName", user.getUserName());
            dao.execute(sql);
            count = sql.getInt();
        }
        return ResultObject.okList(list, page, limit, count);
    }

    @RequestMapping(value = "/getCameraDetail")
    public ModelAndView getCameraDetail(Integer id) {
        CameraBean camera;
        if (null == id) {
            camera = new CameraBean();
        } else {
            camera = dao.fetch(CameraBean.class, id);
        }
        return new ModelAndView("cameraDetail", "camera", camera);
    }

    @RequestMapping(value = "/saveCamera")
    @ResponseBody
    @EnableOpLog(Constant.ModifyType.SAVE)
    public ReturnObject saveCamera(Integer id, String name, String ncode, String serial, String validateCode, String cameraType, String channelNo) {
        ReturnObject result = new ReturnObject();
        try {
            if (id == null) {

                SysUserBean user = ControllerHelper.getInstance(dao).getLoginUser();

                if (user == null) {
                    throw new ServiceException("err21");
                }

                CameraBean cameraBean = dao.fetch(CameraBean.class, Cnd.where("user_name", "=", ControllerHelper.getLoginUserName()).and("serial", "=", serial).and("channelNo", "=", channelNo).and("deleteFlag", "=", 0));
                if (cameraBean != null) {
                    throw new ServiceException("err26");
                }

                //判断当前用户创建的下级用户数量是否超限
                ReturnObject ro = versionService.checkVersion(user.getUserName(), "monitor");
                if (!ro.isSuccess()) return ro;

                /**
                 * 不再调用开放平台API添加摄像头，转而让用户在添加之后，我们平台绑定序列号和验证码
                 */
                //首先判断系统里是否已存在此摄像头，存在的话不再重复调接口添加。
//                Sql sql = Sqls.create(" select * from camera  where serial=@serial and validate_code=@validateCode limit 0,1");
//                sql.setCallback(Sqls.callback.entity());
//                sql.setEntity(dao.getEntity(CameraBean.class));
//                sql.params().set("serial", serial);
//                sql.params().set("validateCode", validateCode);
//                dao.execute(sql);
//                CameraBean otherbean = sql.getObject(CameraBean.class);
//
//                //调用萤石云open API添加摄像头
//                if (otherbean == null && cameraType.equals(Constant.CameraType.HAI_KANG)) {
//                    cameraService.addFluorideDevice(serial, validateCode);
//                }
                Ys7TokenBean ys7 = null;
                switch (cameraType) {
                    case Constant.CameraType.HAI_KANG:
                        ys7 = dao.fetch(Ys7TokenBean.class, Cnd.where("user_name", "=", user.getUserName()).and("camera_type", "=", Constant.CameraType.HAI_KANG));
                        if (ys7 == null) {
                            throw new ServiceException("请先绑定海康摄像头密钥");
                        }
                        break;
                    case Constant.CameraType.DA_HUA:
                        ys7 = dao.fetch(Ys7TokenBean.class, Cnd.where("user_name", "=", user.getUserName()).and("camera_type", "=", Constant.CameraType.DA_HUA));
                        if (ys7 == null) {
                            throw new ServiceException("请先绑定大华摄像头密钥");
                        }
                        break;
                    default:
                        throw new ServiceException("平台目前不支持该摄像头类型");
                }

                CameraBean bean = new CameraBean();
                bean.setName(name);
                bean.setNcode(ncode);
                bean.setUserName(user.getUserName());
                bean.setSerial(serial);
                bean.setValidateCode(validateCode);
                bean.setCameraType(cameraType);
                //海康摄像头默认过期时间为一个月
//                if (cameraType.equals(Constant.CameraType.HAI_KANG)) {
//                    bean.setExpireTime(new Timestamp(System.currentTimeMillis() + 30 * 24 * 60 * 60 * 1000L));
//                }
                if (StringUtils.isBlank(channelNo)) {
                    bean.setChannelNo("1");
                } else {
                    bean.setChannelNo(channelNo);
                }
                dao.insert(bean);
            } else {//update
                //cameraService.updateFluorideDevice(serial,name);
                Sql sql = Sqls.create(" update camera set name=@name,ncode=@ncode, camera_type=@cameraType,channelNo=@channelNo,serial=@serial,validate_code=@validateCode where id=@id ");
                sql.params().set("name", name);
                sql.params().set("ncode", ncode);
                sql.params().set("id", id);
                sql.params().set("cameraType", cameraType);
                if (StringUtils.isBlank(channelNo)) {
                    sql.params().set("channelNo", 0);
                } else {
                    sql.params().set("channelNo", channelNo);
                }
                sql.params().set("serial", serial);
                sql.params().set("validateCode", validateCode);
                dao.execute(sql);
            }
            result.setSuccess(true);
        } catch (Exception e) {
            result.setSuccess(false);
            result.setMsg(e.getMessage());
            log.error(e.getMessage());
        }

        return result;
    }

    @RequestMapping(value = "/deleteCamera")
    @ResponseBody
    @EnableOpLog(Constant.ModifyType.DELETE)
    public ReturnObject deleteCamera(Integer id, String serial) {
        ReturnObject result = new ReturnObject();
        //delete
        try {
//            Sql sql = Sqls.create(" select * from camera  where serial=@serial  and id !=@id limit 0,1");
//            sql.setCallback(Sqls.callback.entity());
//            sql.setEntity(dao.getEntity(CameraBean.class));
//            sql.params().set("serial",serial);
//            sql.params().set("id",id);
//            dao.execute(sql);
//            CameraBean otherbean =sql.getObject(CameraBean.class);
//            if(otherbean==null){
//                cameraService.deleteFluorideDevice(serial);
//            }

            CameraBean bean = dao.fetch(CameraBean.class, id);
            if (bean != null) {
                bean.setDeleteFlag("1");
                dao.update(bean);
            }
//            dao.delete(CameraBean.class,id);
        } catch (Exception e) {
            log.error(e.getMessage());
            result.setMsg(e.getMessage());
            result.setSuccess(false);
        }
        return result;
    }

    @RequestMapping(value = "/getDeviceList")
    @ResponseBody
    public ReturnObject getDeviceList() {
        ReturnObject result = new ReturnObject();
        SysUserBean user = ControllerHelper.getInstance(dao).getLoginUser();
        if (user.getLevel() >= 1) {//用户
            List<UserDeviceBean> list = dao.query(UserDeviceBean.class, Cnd.where("user_name", "=", user.getUserName()).and("is_del", "=", 0));
            result.setData(list);
        } else {//管理员
            List<DeviceBean> list = dao.query(DeviceBean.class, null);
            result.setData(list);
        }

        return result;
    }

    @RequestMapping(value = "/getVideoPlayer")
    public ModelAndView getVideoPlayer(Integer id) {
        CameraBean bean = dao.fetch(CameraBean.class, id);
        return new ModelAndView("videoPlayer", "data", bean);
    }

    /**
     * 获取摄像头直播链接
     *
     * @param id          摄像头id
     * @param perspective 是否可以进行透视，上级用户查看下级用户摄像头用户，否则的话会因为用户名不匹配导致err101
     *                    0：不允许 1：允许透视
     * @return
     */
    @RequestMapping(value = "/getPlayerAddress")
    @ResponseBody
    public ResultObject getPlayerAddress(long id,
                                         @RequestParam(value = "perspective", required = false, defaultValue = "0") int perspective) {
        return cameraService.getPlayerAddress(id, perspective);
    }

    /**
     * 网络录像机的序列号是一样的
     * 不适配网络硬盘录像机，废弃 不再使用
     * 改用getPlayerAddress 上面这个方法根据id查询
     *
     * @param deviceSerial
     * @param userName
     * @return
     */
    @Deprecated
    @RequestMapping(value = "/getLiveAddress")
    @ResponseBody
    public ResultObject getLiveAddress(String deviceSerial, String userName) {
        try {
            if (userName == null) {
                userName = ControllerHelper.getLoginUserName();
            }
//          CameraBean cameraBean = dao.fetch(CameraBean.class, Cnd.where("user_name","=",ControllerHelper.getLoginUserName()).and("serial", "=", deviceSerial).and("deleteFlag","=",0));
            CameraBean cameraBean = dao.fetch(CameraBean.class, Cnd.where("user_name", "=", userName).and("serial", "=", deviceSerial).and("deleteFlag", "=", 0));

            if (cameraBean != null) {
                if (StringUtils.isNotBlank(cameraBean.getCameraType())) {
                    switch (cameraBean.getCameraType()) {
                        case Constant.CameraType.HAI_KANG:
                            log.info("当前摄像头为海康摄像头");
                            return ResultObject.ok().data(cameraService.getLiveAddress(cameraBean, cameraBean.getChannelNo() == null ? "1" : cameraBean.getChannelNo()));
                        case Constant.CameraType.DA_HUA:
                            log.info("当前摄像头为大华摄像头");
                            String token = leChangeService.accessToken();
                            return ResultObject.ok().data(leChangeService.getLiveStreamInfo(cameraBean, token));
                        default:
                            return ResultObject.apiError("fail");
                    }
                } else {
                    return ResultObject.ok().data(cameraService.getLiveAddress(cameraBean, "1"));
                }
            } else {
                return ResultObject.apiError("fail");
            }
        } catch (Exception e) {
            log.error(e.toString(), e);
            return ResultObject.error(e.toString());
        }
    }

    /**
     * 2019-08-02
     * 增加userName改动,如果是1级用户，获取到自己的userName无法完成萤石云查询问题
     * 李英豪
     */
    @RequestMapping(value = "/bind")
    @ResponseBody
    @EnableOpLog(Constant.ModifyType.SAVE)
    public ReturnObject bind(String deviceSerial, String validateCode, String userName) {
        ReturnObject result = new ReturnObject();
        try {
            cameraService.test(deviceSerial, validateCode, userName);
            result.setSuccess(true);
        } catch (Exception e) {
//            e.printStackTrace();
            result.setSuccess(false);
            result.setMsg(e.getMessage());
        }
        return result;
    }

    @RequestMapping(value = "/bindToken")
    @ResponseBody
    @EnableOpLog(Constant.ModifyType.SAVE)
    public ReturnObject bindToken(String appkey, String secret, String cameraType) {
        ReturnObject result = new ReturnObject();
        try {

            String userName = ControllerHelper.getInstance(dao).getLoginUserName();
            if (StringUtils.isBlank(userName)) {
                throw new Exception("err21");
            }

            if ((StringUtils.isBlank(appkey))) {
                throw new Exception("appkey");
            }
            if ((StringUtils.isBlank(secret))) {
                throw new Exception("秘钥为空");
            }

            Ys7TokenBean tokenBean = dao.fetch(Ys7TokenBean.class, Cnd.where("user_name", "=", userName).and("camera_type", "=", cameraType));
            if (tokenBean == null) {
                tokenBean = new Ys7TokenBean();
                tokenBean.setAppkey(appkey);
                tokenBean.setSecret(secret);
                tokenBean.setCameraType(cameraType);
                tokenBean.setUserName(userName);
                dao.insert(tokenBean);
            } else {
                tokenBean.setAppkey(appkey);
                tokenBean.setSecret(secret);
                tokenBean.setAccessToken("");
                dao.update(tokenBean);
            }
            result.setSuccess(true);
        } catch (Exception e) {
            log.error(e.toString(), e);
            result.setSuccess(false);
            result.setMsg(e.getMessage());
        }
        return result;
    }

    @RequestMapping(value = "/startControl")
    @ResponseBody
    public ReturnObject startControl(String deviceSerial, int direction, int speed) {
        ReturnObject result = new ReturnObject();
        try {
            cameraService.startControl(deviceSerial, direction, speed);
            result.setSuccess(true);
        } catch (Exception e) {
            e.printStackTrace();
            result.setMsg(e.getMessage());
            result.setSuccess(false);
        }
        return result;
    }

    @RequestMapping(value = "/stopControl")
    @ResponseBody
    public ReturnObject stopControl(String deviceSerial, Integer direction) {
        ReturnObject result = new ReturnObject();
        try {
            cameraService.stopControl(deviceSerial, direction);
            result.setSuccess(true);
        } catch (Exception e) {
            e.printStackTrace();
            result.setMsg(e.getMessage());
            result.setSuccess(false);
        }
        return result;
    }

    @RequestMapping(value = "/mirrorDevice")
    @ResponseBody
    public ReturnObject mirrorDevice(String deviceSerial, int command) {
        ReturnObject result = new ReturnObject();
        try {
            cameraService.mirrorDevice(deviceSerial, command);
            result.setSuccess(true);
        } catch (Exception e) {
            e.printStackTrace();
            result.setMsg(e.getMessage());
            result.setSuccess(false);
        }
        return result;
    }

    /**
     * 关闭萤石云设备视频加密功能
     *
     * @param deviceSerial 设备序列号(接口要求存在英文字母需要大写)
     * @param validateCode 设备验证码(六位大写字母)
     * @return 2019-08-02
     * 增加userName改动,如果是1级用户，获取到自己的userName无法完成萤石云查询问题
     * 李英豪
     * @User 李英豪
     */
    @RequestMapping(value = "/decrypt")
    @ResponseBody
    @EnableOpLog
    public ResultObject decrypt(String deviceSerial, String validateCode, String userName) {
        //ReturnObject result = new ReturnObject();
        ResultObject result = null;
        try {
            result = cameraService.decrypt(deviceSerial, validateCode, userName);
            //result.setSuccess(true);
        } catch (Exception e) {
            e.printStackTrace();
            //result.setSuccess(false);
            return ResultObject.apiError(e.getMessage());
        }
        return result;
    }

    @RequestMapping("getAppkeyAndSecret")
    @ResponseBody
    public ResultObject getAppkeyAndSecret() {
        String userName = ControllerHelper.getInstance(dao).getLoginUserName();
        if (StringUtils.isBlank(userName)) {
            return ResultObject.apiError("用户未登录");
        }

        Ys7TokenBean hkToken = new Ys7TokenBean(), dhToken = new Ys7TokenBean();
        List<Ys7TokenBean> tokens = dao.query(Ys7TokenBean.class, Cnd.where("user_name", "=", userName));
        if (tokens != null && tokens.size() > 0) {
            String curCameraType = "";
            for (int i = 0; i < tokens.size(); i++) {
                curCameraType = tokens.get(i).getCameraType();
                if (curCameraType.equals(Constant.CameraType.HAI_KANG)) {
                    hkToken = tokens.get(i);
                } else if (curCameraType.equals(Constant.CameraType.DA_HUA)) {
                    dhToken = tokens.get(i);
                }
            }
        }

        return ResultObject.ok().data("hkToken", hkToken).data("dhToken", dhToken);
    }

    /**
     * 根据摄像头ID获取摄像头详细信息
     *
     * @param id
     * @return
     * @User 李英豪
     */
    @RequestMapping(value = "/getCameraDetails")
    @ResponseBody
    public ResultObject getCameraDetails(Integer id) {
        ResultObject result;
        try {
            result = cameraService.getCameraDetails(id);
        } catch (Exception e) {
            return ResultObject.apiError("fail");
        }
        return result;
    }


    /**
     * 获取摄像头直播链接新接口，通过浏览器调用开放平台api获取数据
     *
     * @param id          摄像头id
     * @param perspective 是否允许当前用户透视其他用户摄像头
     * @return
     */
    @RequestMapping(value = "/getCameraAddress")
    @ResponseBody
    public ResultObject getCameraAddress(@RequestParam long id, @RequestParam int perspective) {
        SysUserBean userBean = ControllerHelper.getInstance(dao).getLoginUser();
        String userName = userBean.getUserName();
        CameraBean cameraBean = cameraService.getCameraById(id);
        if (cameraBean == null) {
            return ResultObject.apiError("摄像头不存在");
        }

        if (userBean.getLevel() <= 0) {//新加判断如果用户是系统管理员以上，可以查看下级视频  by 李英豪
            perspective = 1;
        }

        if (perspective == 0 && !userName.equals(cameraBean.getUserName())) {
            return ResultObject.apiError("无法查看其他用户的摄像头信息");
        }

        //未查找到直播链接，则查询当前用户绑定的accessToken
        Ys7TokenBean token = cameraService.getCurrentUserToken(Integer.valueOf(cameraBean.getCameraType()));
        if (token == null) {
            return ResultObject.apiError("请先绑定摄像头密钥");
        }

        //大华摄像头依然调用原来的接口
        if (cameraBean.getCameraType().equals(Constant.CameraType.DA_HUA)) {
            String dahuaToken = leChangeService.accessToken();
            return ResultObject.ok().data("camera", leChangeService.getLiveStreamInfo(cameraBean, dahuaToken));
        }

        //首先判断该摄像头信息是否过期，如果没有过期，从数据库直接读取信息;否则重新进行拉取，并更新数据库
        if (cameraBean.getExpireTime() != null && cameraBean.getExpireTime().getTime() > System.currentTimeMillis() && !TextUtils.isEmpty(cameraBean.getFlv()) && !TextUtils.isEmpty(cameraBean.getFlvHd())) {
            return ResultObject.ok().data("camera", cameraBean);
        }


        String accessToken = token.getAccessToken();
        long expireTime = token.getExpireTime() == null ? System.currentTimeMillis() : token.getExpireTime().getTime();
        long now = System.currentTimeMillis();
        if (StringUtils.isNotBlank(accessToken) && expireTime - now >= 2000) {//设置2秒的请求延迟时间。
            return ResultObject.ok().data("accessToken", accessToken).data("serial", cameraBean.getSerial()).data("channelNo", cameraBean.getChannelNo()).data("cameraType", cameraBean.getCameraType());
        }

        //未查找到accessToken，则返回appKey和appSecret
        return ResultObject.ok().data("appKey", token.getAppkey()).data("appSecret", token.getSecret()).data("serial", cameraBean.getSerial()).data("channelNo", cameraBean.getChannelNo()).data("cameraType", cameraBean.getCameraType());
    }

    @RequestMapping(value = "/uploadAccessToken")
    @ResponseBody
    public ResultObject uploadAccessToken(@RequestParam String accessToken, @RequestParam long expireTime, @RequestParam int cameraType) {
        try {
            cameraService.saveAccessToken(accessToken, expireTime, cameraType);
        } catch (Exception e) {
            log.error(e.toString());
            return ResultObject.apiError("上传失败");
        }
        return ResultObject.ok();
    }

    @RequestMapping(value = "/uploadYs7CameraAddress")
    @ResponseBody
    public ResultObject uploadYs7CameraAddress(CameraBean cameraBean) {
        try {
            cameraService.saveYs7CameraAddress(cameraBean);
        } catch (Exception e) {
            log.error(e.toString());
            return ResultObject.apiError("直播链接保存失败");
        }
        return ResultObject.ok();
    }
}
