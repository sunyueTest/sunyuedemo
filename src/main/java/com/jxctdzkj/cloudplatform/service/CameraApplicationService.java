package com.jxctdzkj.cloudplatform.service;

import com.jxctdzkj.cloudplatform.bean.CameraApplicationBean;

import java.util.List;

public interface CameraApplicationService {
    List<CameraApplicationBean> getCameraList(int page, int size, String serial, Long appId, Integer appType);

    List<CameraApplicationBean> getCameraListWithoutUserName(int page, int size, String serial, Long appId, Integer appType);

    Object saveCamera(CameraApplicationBean bean);

    Object deleteCamera(String id);
}
