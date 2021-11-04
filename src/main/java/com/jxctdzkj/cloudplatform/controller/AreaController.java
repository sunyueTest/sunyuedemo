package com.jxctdzkj.cloudplatform.controller;

import com.jxctdzkj.cloudplatform.bean.AreaBean;
import com.jxctdzkj.cloudplatform.bean.DeviceBean;
import com.jxctdzkj.cloudplatform.config.Constant;
import com.jxctdzkj.cloudplatform.opLog.EnableOpLog;
import com.jxctdzkj.cloudplatform.utils.ResultObject;
import com.jxctdzkj.support.utils.TextUtils;
import lombok.extern.slf4j.Slf4j;
import org.nutz.dao.Cnd;
import org.nutz.dao.Dao;
import org.nutz.dao.pager.Pager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * <pre>
 *     author  : FlySand
 *     e-mail  : 1156183505@qq.com
 *     time    : 2018/8/28.
 *     desc    : 区域
 * </pre>
 */
@RestController
@Slf4j
@RequestMapping({"area"})
public class AreaController {
    @Autowired
    Dao dao;

    /**
     * 查询区域列表
     */
    @RequestMapping(value = "selAreaList", method = RequestMethod.GET)
    public Object selAreaList(@RequestParam(value = "areaCode") String areaCode) {
        if (TextUtils.isEmpty(areaCode)) {
            return ResultObject.apiError("区域编码不能为空");
        }
        List<AreaBean> loginUser = dao.query(AreaBean.class, Cnd.where("Pcode", "=", areaCode));
        return ResultObject.okList(loginUser, 1, 0);
    }

    /**
     * 添加区域
     */
    @EnableOpLog(Constant.ModifyType.SAVE)
    @RequestMapping(value = "addArea", method = RequestMethod.GET)
    public Object addArea(@RequestParam(value = "areaCode") String areaCode,
                          @RequestParam(value = "pCode") String pCode,
                          @RequestParam(value = "name") String name) {
        if (TextUtils.isEmpty(areaCode)) {
            return ResultObject.apiError("区域编码不能为空");
        }
        if (TextUtils.isEmpty(pCode)) {
            return ResultObject.apiError("pCode不能为空");
        }
        if (TextUtils.isEmpty(name)) {
            return ResultObject.apiError("区域名不能为空");
        }
        AreaBean areaBean = dao.fetch(AreaBean.class, areaCode);
        if (areaBean != null) {
            return ResultObject.apiError("区域编码已经存在");
        }
        AreaBean areaParentBean = dao.fetch(AreaBean.class, pCode);
        if (areaParentBean == null) {
            return ResultObject.apiError("父区域编码不存在");
        }
        areaBean = new AreaBean();
        areaBean.setCode(areaCode);
        areaBean.setpCode(pCode);
        areaBean.setName(name);

        AreaBean insertBean = dao.insert(areaBean);
        if (insertBean != null) {
            return ResultObject.ok("添加成功");
        }
        return ResultObject.apiError("添加失败");
    }

    /**
     * 删除区域
     */
    @EnableOpLog(Constant.ModifyType.DELETE)
    @RequestMapping(value = "delArea", method = RequestMethod.GET)
    public Object delArea(@RequestParam(value = "areaCode") String areaCode) {
        if (TextUtils.isEmpty(areaCode)) {
            return ResultObject.apiError("code不能为空");
        }
        AreaBean areaBean = dao.fetch(AreaBean.class, areaCode);
        if (areaBean == null) {
            return ResultObject.apiError("编码不存在");
        }

        List<DeviceBean> beanList = dao.query(DeviceBean.class, Cnd.where("Acode", "=", areaCode));
        if (beanList.size() > 0) {
            log.info("beanList  =" + beanList.size());
            return ResultObject.apiError("该区域有绑定设备");
        }

        return dao.delete(areaBean) > 0 ? ResultObject.ok("删除成功") : ResultObject.apiError("删除失败");
    }

    /**
     * 修改区域
     */
    @RequestMapping(value = "upAreaName", method = RequestMethod.GET)
    @EnableOpLog
    public Object upAreaName(
            @RequestParam(value = "code") String code,
            @RequestParam(value = "name") String name) {
        if (TextUtils.isEmpty(name)) {
            return ResultObject.apiError("name不能为空");
        }
        AreaBean areaBean = dao.fetch(AreaBean.class, code);
        if (areaBean == null) {
            return ResultObject.apiError("区域不存在");
        }
        areaBean.setName(name);

        return dao.update(areaBean) > 0 ? ResultObject.ok("修改成功") : ResultObject.apiError("修改失败");
    }

    /**
     * 查询区域下的设备
     */
    @RequestMapping(value = "getAreaDevice", method = RequestMethod.GET)
    public Object getAreaDevice(
            @RequestParam(value = "areaCode") String areaCode,
            @RequestParam(value = "page", defaultValue = "1", required = false) int page,
            @RequestParam(value = "size", defaultValue = "100", required = false) int size) {
        //区域编码校验
        AreaBean areaBean = dao.fetch(AreaBean.class, areaCode);
        if (areaBean == null) {
            return ResultObject.apiError("区域编码不存在");
        }
        Pager pager = dao.createPager(page, size);
        List<DeviceBean> loginUser = dao.query(DeviceBean.class, Cnd.where("Acode", "=", areaCode), pager);
        return ResultObject.okList(loginUser, page, size);
    }

}
