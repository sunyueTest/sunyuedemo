package com.jxctdzkj.cloudplatform.service;

import com.jxctdzkj.cloudplatform.bean.CameraBean;
import com.jxctdzkj.cloudplatform.bean.Ys7TokenBean;
import com.jxctdzkj.cloudplatform.utils.ResultObject;

import java.util.List;

public interface CameraService {

    /**
     * 获取萤石云token，有效期7天，用于访问认证
     * @return
     */
    String getFluorideToken() throws Exception;

    /**
     * 获取萤石云token，有效期7天，用于访问认证
     * 李英豪
     * @return
     */
    String getFluorideToken(String userName) throws Exception;

    /**
     * 添加萤石云摄像头
     * @return
     * @throws Exception
     */
    void addFluorideDevice(String deviceSerial,String validateCode) throws Exception;


    /**
     * 删除萤石云摄像头
     * @return
     * @throws Exception
     */
    void deleteFluorideDevice(String deviceSerial) throws Exception;

    ResultObject getPlayerAddress(long id, int perspective);

    /**
     * 修改萤石云摄像头名称
     * @return
     * @throws Exception
     */
    void updateFluorideDevice(String deviceSerial,String deviceName) throws Exception;

    CameraBean getLiveAddress(CameraBean cameraBean, String channelNo) throws Exception;

    /**
     * 2019-08-02
     * 增加userName改动,如果是1级用户，获取到自己的userName无法完成萤石云查询问题
     * 李英豪
     */
   void test(String deviceSerial, String validateCode,String userName) throws Exception;

    /** 2019-08-02
     * 增加userName改动,如果是1级用户，获取到自己的userName无法完成萤石云查询问题
     * 李英豪
     */
    ResultObject decrypt(String deviceSerial, String validateCode, String UserName) throws Exception;

   void startControl(String deviceSerial,int direction,int speed) throws Exception;

    void stopControl(String deviceSerial,Integer direction) throws Exception;

    void mirrorDevice(String deviceSerial,int command) throws Exception;

    void Capture(String deviceSerial)  throws Exception;

    /**
     * 新增/修改 摄像头秘钥信息
     * @throws Exception
     */
    void addOrUpdateCameraToken(Ys7TokenBean ys7, String appkey, String secret, String userName, String cameraType) throws Exception;

    List<CameraBean> listAllCameras();

    /**
     * 根据摄像头ID获取摄像头详细信息
     * @param id
     * @return
     * @User 李英豪
     */
    ResultObject getCameraDetails(Integer id)throws RuntimeException;

//    ResultObject getPlayerAddressById(long id);

    CameraBean getCameraById(long id);

    Ys7TokenBean getCurrentUserToken(int cameraType);

    void saveAccessToken(String accessToken, long expireTime, int cameraType) throws Exception;

    void saveYs7CameraAddress(CameraBean cameraBean) throws Exception;
}
