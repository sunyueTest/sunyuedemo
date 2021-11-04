package com.jxctdzkj.cloudplatform.service.impl;

import com.jxctdzkj.cloudplatform.bean.CameraApplicationBean;
import com.jxctdzkj.cloudplatform.bean.CameraBean;
import com.jxctdzkj.cloudplatform.service.CameraApplicationService;
import com.jxctdzkj.cloudplatform.utils.ControllerHelper;
import com.jxctdzkj.cloudplatform.utils.ResultObject;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.nutz.dao.Cnd;
import org.nutz.dao.Dao;
import org.nutz.dao.pager.Pager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * @Description
 * @Author chanmufeng
 * @Date 2019/7/31 11:46
 **/

@Service
@Slf4j
public class CameraApplicationServiceImpl implements CameraApplicationService {
    @Autowired
    Dao dao;

    @Override
    public List<CameraApplicationBean> getCameraList(int page, int size, String serial, Long appId, Integer appType) {
        String userName = ControllerHelper.getInstance(dao).getLoginUserName();
        Cnd cnd = Cnd.where("user_name", "=", userName)
                .and("is_del", "=", 0)
                .and("app_id", "=", appId)
                .and("app_type", "=", appType);
        Pager pager = dao.createPager(page, size);

        if (!StringUtils.isBlank(serial)) {
            cnd.and("serial", "LIKE", "%" + serial + "%");
        }

        return dao.query(CameraApplicationBean.class, cnd, pager);
    }

    /**
     * sql语句不包含user_name
     *
     * @return
     */
    @Override
    public List<CameraApplicationBean> getCameraListWithoutUserName(int page, int size, String serial, Long appId, Integer appType) {
        String userName = ControllerHelper.getInstance(dao).getLoginUserName();
        Cnd cnd = Cnd.where("is_del", "=", 0)
                .and("app_id", "=", appId)
                .and("app_type", "=", appType);
        Pager pager = dao.createPager(page, size);

        if (!StringUtils.isBlank(serial)) {
            cnd.and("serial", "LIKE", "%" + serial + "%");
        }

        return dao.query(CameraApplicationBean.class, cnd, pager);
    }

    @Override
    public Object saveCamera(CameraApplicationBean bean) {
        try {
            String userName = ControllerHelper.getLoginUserName();

            long cameraId = bean.getCameraId();
            CameraBean cameraBean = dao.fetch(CameraBean.class, Cnd.where("id", "=", cameraId));
            if (cameraBean == null) {
                return ResultObject.apiError("err163");//摄像头未绑定
            }

            CameraApplicationBean cameraApplicationBean = dao.fetch(CameraApplicationBean.class,
                    Cnd.where("user_name", "=", userName)
                            .and("app_id", "=", bean.getAppId())
                            .and("app_type", "=", bean.getAppType())
                            .and("cameraId", "=", cameraId));
            if (cameraApplicationBean != null) {
                if (cameraApplicationBean.getIsDel().equals("1")) {
                    cameraApplicationBean.setIsDel("0");
                    cameraApplicationBean.setCameraName(bean.getCameraName());
                    return dao.update(cameraApplicationBean) > 0 ? ResultObject.ok("success") : ResultObject.ok("failed");
                }
                return ResultObject.apiError("err164");//摄像头已绑定，请勿重复操作
            }
            //TODO:此处应该添加摄像头是否被其他大棚（或其他）绑定的判断，但是测试环境摄像头有限，在此暂不添加该逻辑
            bean.setSerial(cameraBean.getSerial());
            bean.setUserName(userName);
            dao.insert(bean);
            return ResultObject.ok("success");
        } catch (Exception e) {
            e.printStackTrace();
            return ResultObject.apiError("failed");
        }
    }

    @Override
    public Object deleteCamera(String id) {
        try {
            CameraApplicationBean bean = dao.fetch(CameraApplicationBean.class, Cnd.where("id", "=", id));
            if (bean == null) {
                return ResultObject.apiError("err165");//摄像头已被删除
            }
            bean.setIsDel("1");
            return dao.update(bean) > 0 ? ResultObject.ok("success") : ResultObject.apiError("failed");
        } catch (Exception e) {
            e.printStackTrace();
            return ResultObject.apiError("failed");
        }
    }
}
