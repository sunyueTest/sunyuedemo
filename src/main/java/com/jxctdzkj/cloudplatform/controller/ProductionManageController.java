package com.jxctdzkj.cloudplatform.controller;

import com.jxctdzkj.cloudplatform.bean.*;
import com.jxctdzkj.cloudplatform.config.Constant;
import com.jxctdzkj.cloudplatform.opLog.EnableOpLog;
import com.jxctdzkj.cloudplatform.service.ProductionManageService;
import com.jxctdzkj.cloudplatform.utils.ControllerHelper;
import com.jxctdzkj.cloudplatform.utils.ResultObject;
import lombok.extern.slf4j.Slf4j;
import org.nutz.dao.Cnd;
import org.nutz.dao.Dao;
import org.nutz.dao.pager.Pager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import java.sql.Timestamp;
import java.text.NumberFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

import static com.jxctdzkj.cloudplatform.config.Constant.isRelayDevice;

@Controller
@Slf4j
@RequestMapping({"productionManage"})
public class ProductionManageController {

    @Autowired
    Dao dao;

    @Autowired
    ProductionManageService productionManageService;

    /**
     * 根据当前用户获取池塘列表
     *
     * @return
     */
    @RequestMapping(value = "getAquaculturePondByUser")
    @ResponseBody
    public Object getAquaculturePondByUser(@RequestParam(value = "page", required = false, defaultValue = "1") int page,
                                           @RequestParam(value = "size", required = false, defaultValue = "100") int size) {
        String userName = ControllerHelper.getInstance(dao).getLoginUserName();
        Cnd cnd = Cnd.where("create_user", "=", userName).and("delete_flag", "=", "0");

        List<AquaculturePondBean> list = dao.query(AquaculturePondBean.class, cnd, new Pager(page, size));
        for (int i = 0; i < list.size(); i++) {
            CameraBean cameraBean = dao.fetch(CameraBean.class, Cnd.where("user_name", "=", userName).and("ncode", "=", list.get(i).getId()));
            if (cameraBean != null) {
                list.get(i).setCameraSerial(cameraBean.getSerial());
                list.get(i).setCameraId(cameraBean.getId());
            }
        }
        long count = ControllerHelper.getInstance(dao).getCount("aquaculture_pond " + cnd);

        return ResultObject.okList(list, page, size, count);
    }

    /**
     * 根据当前用户获取农场列表
     *
     * @return
     */
    @RequestMapping(value = "getFarmByUser")
    @ResponseBody
    public Object getFarmByUser(@RequestParam(value = "page", required = false, defaultValue = "1") int page,
                                @RequestParam(value = "size", required = false, defaultValue = "100") int size) {
        System.out.println("<><><><><><><><><><><><>");
        String userName = ControllerHelper.getInstance(dao).getLoginUserName();
        Cnd cnd = Cnd.where("create_user", "=", userName).and("delete_flag", "=", "0");

        List<FarmInfoBean> list = dao.query(FarmInfoBean.class, cnd, new Pager(page, size));
        for (int i = 0; i < list.size(); i++) {
            CameraBean cameraBean = dao.fetch(CameraBean.class, Cnd.where("user_name", "=", userName).and("ncode", "=", list.get(i).getId()));
            if (cameraBean != null) {
                list.get(i).setCameraNumber(cameraBean.getSerial());
            }
        }
        long count = ControllerHelper.getInstance(dao).getCount("farm_info " + cnd);

        return ResultObject.okList(list, page, size, count);
    }

    /**
     * 生产管理-新增池塘信息
     *
     * @return
     */
    @RequestMapping(value = "addPondDetail")
    public ModelAndView addPondDetail() {
        return new ModelAndView("aquaculture/productionManage/pondDetail", "data", new AquaculturePondBean());
    }

    /**
     * 生产管理-修改池塘信息
     *
     * @return
     */
    @RequestMapping(value = "updatePondDetail")
    public ModelAndView updateDeviceDetail(String id) {
        AquaculturePondBean bean = dao.fetch(AquaculturePondBean.class, Cnd.where("id", "=", id));
        return new ModelAndView("aquaculture/productionManage/pondDetail", "data", bean);
    }

    /**
     * 生产管理-修改设备名称、坐标信息
     *
     * @return
     */
    @RequestMapping(value = "updatePondDeviceDetail")
    public ModelAndView updatePondDetail(String id) {
        UserDeviceBean bean = dao.fetch(UserDeviceBean.class, Cnd.where("id", "=", id));
        return new ModelAndView("aquaculture/productionManage/updatePondDeviceDetail", "data", bean);
    }

    /**
     * 生产管理-池塘绑定设备页面跳转
     *
     * @return
     */
    @RequestMapping(value = "toBoundPondDevice")
    public ModelAndView toBoundPondDevice(String id) {
        AquaculturePondBean bean = dao.fetch(AquaculturePondBean.class, Cnd.where("id", "=", id));
        return new ModelAndView("aquaculture/productionManage/boundPondDevice", "data", bean);
    }

    /**
     * 生产管理-池塘绑定设备 添加设备页面跳转
     *
     * @return
     */
    @RequestMapping(value = "addPondDeviceDetail")
    public ModelAndView addPondDeviceDetail(String id) {
        AquaculturePondBean bean = dao.fetch(AquaculturePondBean.class, Cnd.where("id", "=", id));
        return new ModelAndView("aquaculture/productionManage/addPondDeviceDetail", "data", bean);
    }

    /**
     * 生产管理-添加或修改池塘信息
     *
     * @return
     */
    @RequestMapping(value = "addOrUpdatePond", method = RequestMethod.POST)
    @ResponseBody
    @EnableOpLog(Constant.ModifyType.SAVE)
    public ResultObject addOrUpdatePond(AquaculturePondBean paramBean) {
        try {
            // 修改
            if (paramBean.getId() != 0) {
                AquaculturePondBean bean = dao.fetch(AquaculturePondBean.class, Cnd.where("id", "=", paramBean.getId()));
                if (bean != null) {
                    bean.setPondName(paramBean.getPondName());
                    bean.setOutputAmount(paramBean.getOutputAmount());
                    bean.setPutInAmount(paramBean.getPutInAmount());

                    bean.setPutInFryAmount(paramBean.getPutInFryAmount());
                    bean.setSurvivalAmount(paramBean.getSurvivalAmount());
                    bean.setRateOfSurvival(
                            (int) (Integer.parseInt(paramBean.getSurvivalAmount()) / Float.valueOf(paramBean.getPutInFryAmount()) * 100) + "%"
                    );
                    bean.setLastPutInTime(new Date());

                    dao.update(bean);
                    return ResultObject.ok(bean);
                } else {
                    return ResultObject.apiError("fail");
                }
            } else {
                SysUserBean sysUserBean = ControllerHelper.getInstance(dao).getLoginUser();
                paramBean.setLastPutInTime(new Date());
                paramBean.setCreatTime(new Date());
                paramBean.setCreateUser(sysUserBean.getUserName());
                paramBean.setDeleteFlag("0");

                // 投放数
                int putInFryAmount = Integer.parseInt(paramBean.getPutInFryAmount());
                // 获得存活数量
                int survivalAmount = Integer.parseInt(paramBean.getSurvivalAmount());
                // 存活率


                NumberFormat numberFormat = NumberFormat.getInstance();
                numberFormat.setMaximumFractionDigits(2);
                String  rateOfSurvival = numberFormat.format((float)survivalAmount /(float)putInFryAmount * 100);
                paramBean.setRateOfSurvival(rateOfSurvival + "%");
                //新增
                if (dao.insert(paramBean) != null) {
                    return ResultObject.ok(paramBean);
                } else {
                    return ResultObject.apiError("fail");
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResultObject.apiError("fail");
        }
    }

    /**
     * 删除池塘
     */
    @RequestMapping(value = "delPond", method = RequestMethod.POST)
    @ResponseBody
    @EnableOpLog(Constant.ModifyType.DELETE)
    public Object delPond(@RequestParam(value = "id") String id) {
        String userName = ControllerHelper.getInstance(dao).getLoginUserName();
        AquaculturePondBean bean = dao.fetch(AquaculturePondBean.class,
                Cnd.where("id", "=", id).
                        and("delete_flag", "=", "0").
                        and("create_user", "=", userName));
        if (bean != null) {
            // 逻辑删除 0-未删除 1-已删除
            bean.setDeleteFlag("1");
            if (dao.update(bean) > 0) {
                return ResultObject.ok("success");
            }
        }
        return ResultObject.apiError("fail");
    }

    /**
     * 获取该用户已绑定池塘的设备
     *
     * @param page
     * @param size
     * @param deviceCode
     * @param isDevice 用于判断该次查询是否是主页查询或池塘设备管理页面查询
     *                 由于设备管理页面查询没有设备会把摄像头信息显示
     * @return
     */
    @ResponseBody
    @RequestMapping(value = "/getPondDeviceList")
    public Object getPondDeviceList(int page, int size, String deviceCode, String pondId,String isDevice) {
        String userName = ControllerHelper.getInstance(dao).getLoginUserName();
        List list = productionManageService.getUserPondDeviceList(page, size, userName, deviceCode, pondId, "0",isDevice);
        int count = 0;
        if (list != null && list.size() != 0) {
            //如果返回的是数据是DeviceBean类型，则正常处理，否则，count默认为0
            // 如果count包含两种情况，一种是设备数量为0，摄像头数量也是0；此外也可能是设备数量为0，摄像头数量>0
            //据此前端进行特殊处理
            if (list.get(0) instanceof DeviceBean) {
                count = productionManageService.getUserPondDeviceCount(userName, deviceCode, pondId, "0");
            }
        }
        return ResultObject.okList(list, page, size, count);
    }

    /**
     * 获取该用户已绑定农场的设备
     *
     * @param page
     * @param size
     * @param deviceCode
     * @return
     */
    @ResponseBody
    @RequestMapping(value = "/getFarmDeviceList")
    public Object getFarmDeviceList(int page, int size, String deviceCode, String farmId) {
        String userName = ControllerHelper.getInstance(dao).getLoginUserName();
        List<DeviceBean> list = productionManageService.getUserFarmDeviceList(page, size, userName, deviceCode, farmId);
        int count = productionManageService.getUserFarmDeviceCount(userName, deviceCode, farmId);
        return ResultObject.okList(list, page, size, count);
    }

    /**
     * 绑定池塘设备
     *
     * @param id
     * @param deviceNumber
     * @param name
     * @return
     */
    @ResponseBody
    @RequestMapping(value = "/boundPondDevice")
    @EnableOpLog(Constant.ModifyType.SAVE)
    public ResultObject boundPondDevice(@RequestParam(value = "id") String id,
                                        @RequestParam(value = "deviceNumber") String deviceNumber,
                                        @RequestParam(value = "name") String name,
                                        @RequestParam(value = "longitude") double longitude,
                                        @RequestParam(value = "latitude") double latitude) {

        String userName = ControllerHelper.getInstance(dao).getLoginUserName();
        DeviceBean deviceBean = dao.fetch(DeviceBean.class, deviceNumber);
        if (deviceBean == null) {
            return ResultObject.apiError("err24");
        }
        if(isRelayDevice(deviceBean.getDeviceType())){
            return ResultObject.apiError("err189");
        }

        List<UserDeviceBean> uBean = dao.query(UserDeviceBean.class,
                Cnd.where("nCode", "=", deviceNumber).and("is_del", "=", "0")
                        .and("user_name", "=", userName).and("group_id", "=", "0"));
        if (uBean.size() > 0) {
            return ResultObject.apiError("err26");
        }

        UserDeviceBean udBean = new UserDeviceBean();
        udBean.setDeviceNumber(deviceNumber);
        udBean.setUserName(userName);
        udBean.setCreateTime(new Timestamp(new Date().getTime()));
        udBean.setDeviceName(name);
        udBean.setLongitude(longitude);
        udBean.setLatitude(latitude);
        udBean.setGroupId(0);
        udBean.setPondId(id);
        if (dao.insert(udBean) != null) {
            return ResultObject.ok("success");
        } else {
            return ResultObject.apiError("error10");
        }
    }

    @ResponseBody
    @RequestMapping(value = "/updatePondDevice")
    @EnableOpLog
    public ResultObject boundPondDevice(@RequestParam(value = "id") String id,
                                        @RequestParam(value = "name") String name,
                                        @RequestParam(value = "longitude") double longitude,
                                        @RequestParam(value = "latitude") double latitude) {

        String userName = ControllerHelper.getInstance(dao).getLoginUserName();
        UserDeviceBean deviceBean = dao.fetch(UserDeviceBean.class, Cnd.where("id", "=", id).and("user_name", "=", userName));
        if (deviceBean == null) {
            return ResultObject.apiError("err24");
        }
        deviceBean.setName(name);
        deviceBean.setLongitude(longitude);
        deviceBean.setLatitude(latitude);
        if (dao.update(deviceBean) > 0) {
            return ResultObject.ok("success");
        } else {
            return ResultObject.apiError("error17");
        }
    }

    /**
     * 删除池塘设备
     *
     * @param deviceNumber
     * @return
     */
    @ResponseBody
    @RequestMapping(value = "/delPondDevice")
    @EnableOpLog(Constant.ModifyType.DELETE)
    public ResultObject delPondDevice(@RequestParam(value = "deviceNumber") String deviceNumber) {
        String userName = ControllerHelper.getInstance(dao).getLoginUserName();
        UserDeviceBean udBean = dao.fetch(UserDeviceBean.class,
                Cnd.where("nCode", "=", deviceNumber).and("user_name", "=", userName).
                        and("group_id", "=", "0").and("is_del", "=", "0"));
        if (udBean == null) {
            return ResultObject.apiError("err24");
        } else {
            udBean.setIsDel(1);
            if (dao.update(udBean) > 0) {
                return ResultObject.ok("success");
            } else {
                return ResultObject.apiError("fail");
            }
        }
    }

    /**
     * 生产管理-池塘绑定摄像头
     *
     * @return
     */
    @RequestMapping(value = "toBindCamera")
    public ModelAndView toBindCamera(String id) {
        String userName = ControllerHelper.getInstance(dao).getLoginUserName();
        CameraBean cameraBean = dao.fetch(CameraBean.class, Cnd.where("user_name", "=", userName).and("ncode", "=", id));
        HashMap<String, Object> map = new HashMap();
        map.put("pondId", id);
        if (cameraBean != null) {
            map.put("cameraBean", cameraBean);
        } else {
            map.put("cameraBean", new CameraBean());
        }
        return new ModelAndView("aquaculture/productionManage/bingCamera", "map", map);
    }

    /**
     * 绑定摄像头
     *
     * @return
     */
    @ResponseBody
    @RequestMapping(value = "/saveCamera")
    @EnableOpLog(Constant.ModifyType.SAVE)
    public ResultObject saveCamera(String pondId, String serial, String validateCode, String cameraType, String channelNo) {
        AquaculturePondBean aquaculturePondBean = dao.fetch(AquaculturePondBean.class, Cnd.where("id", "=", pondId));
        String userName = ControllerHelper.getInstance(dao).getLoginUserName();
        Ys7TokenBean ys7 = null;
        switch (cameraType) {
            case Constant.CameraType.HAI_KANG:
                ys7 = dao.fetch(Ys7TokenBean.class, Cnd.where("user_name", "=", userName).and("camera_type", "=", Constant.CameraType.HAI_KANG));
                if (ys7 == null) {
                    return ResultObject.apiError("请先绑定海康摄像头密钥");
                }
                break;
            case Constant.CameraType.DA_HUA:
                ys7 = dao.fetch(Ys7TokenBean.class, Cnd.where("user_name", "=", userName).and("camera_type", "=", Constant.CameraType.DA_HUA));
                if (ys7 == null) {
                    return ResultObject.apiError("请先绑定大华摄像头密钥");
                }
                break;
            default:
                return ResultObject.apiError("平台目前不支持该摄像头类型");
        }

        if (aquaculturePondBean != null) {
            CameraBean oldCamaraBean = dao.fetch(CameraBean.class, Cnd.where("user_name", "=", userName).and("ncode", "=", pondId));
            if (oldCamaraBean == null) {
                CameraBean bean = new CameraBean();
                bean.setSerial(serial);
                bean.setValidateCode(validateCode);
                bean.setName(aquaculturePondBean.getPondName() + "摄像头");
                bean.setNcode(pondId);
                bean.setUserName(userName);
                bean.setDeleteFlag("0");
                bean.setCameraType(cameraType);
                bean.setChannelNo(channelNo);
                //海康摄像头默认过期时间为一个月
//                if (cameraType.equals(Constant.CameraType.HAI_KANG)) {
//                    bean.setExpireTime(new Timestamp(System.currentTimeMillis() + 30 * 24 * 60 * 60 * 1000L));
//                }

                return dao.insert(bean) == null ? ResultObject.apiError("fail") : ResultObject.ok("success");
            } else {
                oldCamaraBean.setSerial(serial);
                oldCamaraBean.setValidateCode(validateCode);
                oldCamaraBean.setCameraType(cameraType);
                oldCamaraBean.setChannelNo(channelNo);
                return dao.update(oldCamaraBean) > 0 ? ResultObject.ok("success") : ResultObject.apiError("fail");
            }
        } else {
            return ResultObject.apiError("找不到池塘信息");
        }
    }
}
