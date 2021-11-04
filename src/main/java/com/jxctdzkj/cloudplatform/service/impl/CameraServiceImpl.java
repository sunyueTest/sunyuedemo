package com.jxctdzkj.cloudplatform.service.impl;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.jxctdzkj.cloudplatform.bean.CameraBean;
import com.jxctdzkj.cloudplatform.bean.SysUserBean;
import com.jxctdzkj.cloudplatform.bean.Ys7TokenBean;
import com.jxctdzkj.cloudplatform.config.Constant;
import com.jxctdzkj.cloudplatform.exception.ServiceException;
import com.jxctdzkj.cloudplatform.service.CameraService;
import com.jxctdzkj.cloudplatform.service.LeChangeService;
import com.jxctdzkj.cloudplatform.utils.ControllerHelper;
import com.jxctdzkj.cloudplatform.utils.HttpClientUtil;
import com.jxctdzkj.cloudplatform.utils.ResultObject;
import com.jxctdzkj.support.utils.TextUtils;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.nutz.dao.Cnd;
import org.nutz.dao.Dao;
import org.nutz.dao.Sqls;
import org.nutz.dao.sql.Sql;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Iterator;
import java.util.List;

@Service
@Slf4j
public class CameraServiceImpl implements CameraService {

    @Autowired
    Dao dao;

    @Autowired
    LeChangeService leChangeService;

    @Override
    public String getFluorideToken() throws Exception {
        //查询数据库，获取token。
        //ParamBean paramBean = dao.fetch(ParamBean.class, Cnd.where("param_name", "=", "accessToken"));
        String userName = ControllerHelper.getInstance(dao).getLoginUserName();
        if (StringUtils.isBlank(userName)) {
            throw new ServiceException("用户未登录");
        }

        Ys7TokenBean ys7 = dao.fetch(Ys7TokenBean.class, Cnd.where("user_name", "=", userName).and("camera_type", "=", Constant.CameraType.HAI_KANG));
        if (ys7 == null) {
            throw new ServiceException("请先绑定摄像头密钥");
            /*ys7 = new Ys7TokenBean();
            ys7.setAppkey("dd83cd1ab73147bdb2ff041e21b94ad2");
            ys7.setSecret("5d59ad17fd6923165d51fdbe8a534b5f");
            ys7.setUserName(userName);
            dao.insert(ys7);*/
        }
        String accessToken = ys7.getAccessToken();
        long expireTime = ys7.getExpireTime() == null ? System.currentTimeMillis() : ys7.getExpireTime().getTime();
        long now = System.currentTimeMillis();
        if (StringUtils.isNotBlank(accessToken) && expireTime - now >= 2000) {//设置2秒的请求延迟时间。
            return accessToken;
        }//else{
        String url = Constant.YS7_ADDRESS + "/api/lapp/token/get";
        StringBuilder param = new StringBuilder("appKey=").append(ys7.getAppkey())
                .append("&appSecret=").append(ys7.getSecret());
        String jsonString = HttpClientUtil.doPost(url, param.toString());
        JSONObject json = JSON.parseObject(jsonString);
        String code = json.getString("code");
        if ("200".equals(code)) {//请求成功
            JSONObject data = json.getJSONObject("data");
            accessToken = data.getString("accessToken");
            expireTime = data.getLong("expireTime");
            //过期时间更新到数据库，以减少请求萤石云次数。
            Sql sql = Sqls.create(" update ys7_token set access_token=@accessToken,expire_time=@expireTime where appkey=@appkey and secret=@secret ");
            sql.params().set("accessToken", accessToken);//
            sql.params().set("expireTime", new Timestamp(expireTime));
            sql.params().set("appkey", ys7.getAppkey());
            sql.params().set("secret", ys7.getSecret());
            dao.execute(sql);
            return accessToken;
        } else {
            String msg = json.getString("msg");
            log.error(code + ":" + msg);
            throw new ServiceException(msg);
        }
        // }

    }

    /**
     * 如果是一级用户，无法查看摄像头解密，验证，解决
     * 新增一个验证萤石云摄像头方法，一级用户经过判断调用此方法，根据前台的对应设备用户名查询
     *
     * @param userName
     * @return
     * @throws Exception
     * @User 李英豪
     */
    @Override
    public String getFluorideToken(String userName) throws Exception {
        //查询数据库，获取token。
        //ParamBean paramBean = dao.fetch(ParamBean.class, Cnd.where("param_name", "=", "accessToken"));
        //String userName = ControllerHelper.getInstance(dao).getLoginUserName();
        Ys7TokenBean ys7 = dao.fetch(Ys7TokenBean.class, Cnd.where("user_name", "=", userName).and("camera_type", "=", Constant.CameraType.HAI_KANG));
        if (ys7 == null) {
            throw new ServiceException("请先绑定摄像头密钥");
            /*ys7 = new Ys7TokenBean();
            ys7.setAppkey("dd83cd1ab73147bdb2ff041e21b94ad2");
            ys7.setSecret("5d59ad17fd6923165d51fdbe8a534b5f");
            ys7.setUserName(userName);
            dao.insert(ys7);*/
        }
        String accessToken = ys7.getAccessToken();
        long expireTime = ys7.getExpireTime() == null ? System.currentTimeMillis() : ys7.getExpireTime().getTime();
        long now = System.currentTimeMillis();
        if (StringUtils.isNotBlank(accessToken) && expireTime - now >= 2000) {//设置2秒的请求延迟时间。
            return accessToken;
        }//else{
        String url = Constant.YS7_ADDRESS + "/api/lapp/token/get";
        StringBuilder param = new StringBuilder("appKey=").append(ys7.getAppkey())
                .append("&appSecret=").append(ys7.getSecret());
        String jsonString = HttpClientUtil.doPost(url, param.toString());
        JSONObject json = JSON.parseObject(jsonString);
        String code = json.getString("code");
        if ("200".equals(code)) {//请求成功
            JSONObject data = json.getJSONObject("data");
            accessToken = data.getString("accessToken");
            expireTime = data.getLong("expireTime");
            //过期时间更新到数据库，以减少请求萤石云次数。
            Sql sql = Sqls.create(" update ys7_token set access_token=@accessToken,expire_time=@expireTime where appkey=@appkey and secret=@secret ");
            sql.params().set("accessToken", accessToken);//
            sql.params().set("expireTime", new Timestamp(expireTime));
            sql.params().set("appkey", ys7.getAppkey());
            sql.params().set("secret", ys7.getSecret());
            dao.execute(sql);
            return accessToken;
        } else {
            String msg = json.getString("msg");
            log.error(code + ":" + msg);
            throw new ServiceException(msg);
        }
        // }

    }

    @Override
    public void addFluorideDevice(String deviceSerial, String validateCode) throws Exception {
        String token = getFluorideToken();
        String url = Constant.YS7_ADDRESS + "/api/lapp/device/add";
        //封装请求参数
        StringBuilder param = new StringBuilder("accessToken=").append(token)
                .append("&deviceSerial=").append(deviceSerial)
                .append("&validateCode=").append(validateCode);
        String jsonString = HttpClientUtil.doPost(url, param.toString());
        JSONObject json = JSON.parseObject(jsonString);
        String code = json.getString("code");
        if (!"200".equals(code) && !"20017".equals(code)) {//请求失败
            String msg = json.getString("msg");
            log.error(code + ":" + msg);
            throw new ServiceException(msg);
        }
    }

    @Override
    public void deleteFluorideDevice(String deviceSerial) throws Exception {
        String token = getFluorideToken();
        String url = Constant.YS7_ADDRESS + "/api/lapp/device/delete";
        //封装请求参数
        StringBuilder param = new StringBuilder("accessToken=").append(token)
                .append("&deviceSerial=").append(deviceSerial);
        String jsonString = HttpClientUtil.doPost(url, param.toString());
        JSONObject json = JSON.parseObject(jsonString);
        String code = json.getString("code");
        if (!"200".equals(code)) {//请求失败
            String msg = json.getString("msg");
            log.error(code + ":" + msg);
            throw new ServiceException(msg);
        }

    }

    @Override
    public ResultObject getPlayerAddress(long id, int perspective) {
        SysUserBean userBean = ControllerHelper.getInstance(dao).getLoginUser();
        Cnd cnd = Cnd.where("id", "=", id).and("deleteFlag", "=", 0);
        if (userBean.getLevel() <= 0) {//新加判断如果用户是系统管理员以上，可以查看下级视频  by 李英豪
            perspective = 1;
        }
        if (perspective == 0) {
            cnd.and("user_name", "=", userBean.getUserName());
        }

        CameraBean cameraBean = dao.fetch(CameraBean.class, cnd);
        if (cameraBean == null) {
            //err101=查询失败
            return ResultObject.apiError("err101");
        }

        try {
            if (StringUtils.isNotBlank(cameraBean.getCameraType())) {
                switch (cameraBean.getCameraType()) {
                    case Constant.CameraType.HAI_KANG:
                        log.info("海康摄像头");
                        return ResultObject.ok().data(getLiveAddress(cameraBean, cameraBean.getChannelNo() == null ? "1" : cameraBean.getChannelNo()));
                    case Constant.CameraType.DA_HUA:
                        log.info("大华摄像头");
                        String token = leChangeService.accessToken();
                        return ResultObject.ok().data(leChangeService.getLiveStreamInfo(cameraBean, token));
                    default:
                        return ResultObject.apiError("fail");
                }
            } else {
                return ResultObject.ok().data(getLiveAddress(cameraBean, "1"));
            }
        } catch (Exception e) {
            log.error(e.toString(), e);
            return ResultObject.error(e.getMessage());
        }
    }

    @Override
    public void updateFluorideDevice(String deviceSerial, String deviceName) throws Exception {
        //String token = getFluorideToken();
    }

    @Override
    public CameraBean getLiveAddress(CameraBean cameraBean, String channelNo) throws Exception {

        //首先判断该摄像头信息是否过期，如果没有过期，从数据库直接读取信息;否则重新进行拉取，并更新数据库
        if (cameraBean.getExpireTime() != null && cameraBean.getExpireTime().getTime() > System.currentTimeMillis() && !TextUtils.isEmpty(cameraBean.getFlv()) && !TextUtils.isEmpty(cameraBean.getFlvHd())) {
            return cameraBean;
        }

        String token = getFluorideToken();
        log.info("token: " + token);
        String url = Constant.YS7_ADDRESS + "/api/lapp/live/video/list";

        //封装请求参数
        StringBuilder param = new StringBuilder("accessToken=").append(token)
                .append("&pageStart=").append(0).append("&pageSize=").append(20);
        String jsonString = HttpClientUtil.doPost(url, param.toString());
        JSONObject json = JSON.parseObject(jsonString);
        String code = json.getString("code");
        if (!"200".equals(code)) {//请求失败
            String msg = json.getString("msg");
            log.error(code + ":" + msg);
            throw new ServiceException(msg);
        }
        JSONArray array = JSON.parseArray(json.getString("data"));
        String serial = "";
        String liveAddress = "";
        String hdAddress = "";
        String rtmp = "";
        String rtmpHd = "";
        String flvAddress = "";
        String hdFlvAddress = "";
        String curChannelNo = "";

        boolean isFind = false;
        for (Iterator ite = array.iterator(); ite.hasNext(); ) {
            JSONObject jsonObject = (JSONObject) ite.next();
            serial = jsonObject.getString("deviceSerial");
            curChannelNo = jsonObject.getString("channelNo");

            if (cameraBean.getSerial().equals(serial) && channelNo.equals(curChannelNo)) {
                isFind = true;
                liveAddress = jsonObject.getString("liveAddress");
                hdAddress = jsonObject.getString("hdAddress");
                rtmp = jsonObject.getString("rtmp");
                rtmpHd = jsonObject.getString("rtmpHd");
                flvAddress = jsonObject.getString("flvAddress");
                hdFlvAddress = jsonObject.getString("hdFlvAddress");
                cameraBean.setHls(liveAddress);
                cameraBean.setHlsHd(hdAddress);
                cameraBean.setRtmp(rtmp);
                cameraBean.setRtmpHd(rtmpHd);
                cameraBean.setFlv(flvAddress);
                cameraBean.setFlvHd(hdFlvAddress);
                cameraBean.setExpireTime(new Timestamp(System.currentTimeMillis() + 30 * 24 * 60 * 60 * 1000L));

                try {
                    dao.update(cameraBean);
                } catch (Exception e) {
                    e.printStackTrace();
                }
                break;
            }
        }
        if (!isFind) {//未找到对应摄像头
            throw new ServiceException("cameraErr");
        }
        return cameraBean;
    }

    /**
     * 2019-08-02
     * 增加userName改动,如果是1级用户，获取到自己的userName无法完成萤石云查询问题
     * 将原本解密方法更正为绑定设备方法
     * 李英豪
     */
    @Override
    public void test(String deviceSerial, String validateCode, String userName) throws Exception {
        SysUserBean user = ControllerHelper.getInstance(dao).getLoginUser();
        String token = "";
        if (user.getLevel() >= 1) {//用户
            token = getFluorideToken();
        } else {
            token = getFluorideToken(userName);
        }
        String url = Constant.YS7_ADDRESS + "/api/lapp/device/add";
        StringBuilder param = new StringBuilder("accessToken=").append(token)
                .append("&deviceSerial=").append(deviceSerial).
                        append("&validateCode=").append(validateCode);
        String jsonString = HttpClientUtil.doPost(url, param.toString());
        JSONObject json = JSON.parseObject(jsonString);
        String code = json.getString("code");
        if (!"200".equals(code)) {//请求失败
            String msg = json.getString("msg");
            log.error(code + ":" + msg);
            throw new ServiceException(msg);
        }
    }

    @Override
    public void startControl(String deviceSerial, int direction, int speed) throws Exception {
        String token = getFluorideToken();
        //String token="at.44bzrcrxah9xcy8kdooxem0a818m5a8m-9das6a1c3o-1dn1la1-fg2m3xbx2";
        String url = Constant.YS7_ADDRESS + "/api/lapp/device/ptz/start";
        StringBuilder param = new StringBuilder("accessToken=").append(token)
                .append("&deviceSerial=").append(deviceSerial)
                .append("&channelNo=1").append("&direction=")
                .append(direction).append("&speed=").append(speed);
        String jsonString = HttpClientUtil.doPost(url, param.toString());
        JSONObject json = JSON.parseObject(jsonString);
        String code = json.getString("code");
        if (!"200".equals(code)) {//请求失败
            String msg = json.getString("msg");
            log.error(code + ":" + msg);
            throw new ServiceException(msg);
        }
    }

    @Override
    public void stopControl(String deviceSerial, Integer direction) throws Exception {
        String token = getFluorideToken();
        //String token="at.44bzrcrxah9xcy8kdooxem0a818m5a8m-9das6a1c3o-1dn1la1-fg2m3xbx2";
        String url = Constant.YS7_ADDRESS + "/api/lapp/device/ptz/stop";
        StringBuilder param = new StringBuilder("accessToken=").append(token)
                .append("&deviceSerial=").append(deviceSerial)
                .append("&channelNo=1");
        if (direction != null) {
            param.append("&direction=").append(direction);
        }
        String jsonString = HttpClientUtil.doPost(url, param.toString());
        JSONObject json = JSON.parseObject(jsonString);
        String code = json.getString("code");
        if (!"200".equals(code)) {//请求失败
            String msg = json.getString("msg");
            log.error(code + ":" + msg);
            throw new ServiceException(msg);
        }
    }

    @Override
    public void mirrorDevice(String deviceSerial, int command) throws Exception {
        String token = getFluorideToken();
        //String token="at.44bzrcrxah9xcy8kdooxem0a818m5a8m-9das6a1c3o-1dn1la1-fg2m3xbx2";
        String url = Constant.YS7_ADDRESS + "/api/lapp/device/ptz/mirror";
        StringBuilder param = new StringBuilder("accessToken=").append(token)
                .append("&deviceSerial=").append(deviceSerial)
                .append("&channelNo=1").append("&command=").append(command);

        String jsonString = HttpClientUtil.doPost(url, param.toString());
        JSONObject json = JSON.parseObject(jsonString);
        String code = json.getString("code");
        if (!"200".equals(code)) {//请求失败
            String msg = json.getString("msg");
            log.error(code + ":" + msg);
            throw new ServiceException(msg);
        }
    }

    @Override
    public void Capture(String deviceSerial) throws Exception {
        String token = getFluorideToken();
        String url = Constant.YS7_ADDRESS + "/api/lapp/device/capture";
        StringBuilder param = new StringBuilder("accessToken=").append(token)
                .append("&deviceSerial=").append(deviceSerial)
                .append("&channelNo=1");

        String jsonString = HttpClientUtil.doPost(url, param.toString());
        JSONObject json = JSON.parseObject(jsonString);
        String code = json.getString("code");
        if (!"200".equals(code)) {//请求失败
            String msg = json.getString("msg");
            log.error(code + ":" + msg);
            throw new ServiceException(msg);
        }
    }


    @Override
    public void addOrUpdateCameraToken(Ys7TokenBean ys7, String appkey, String secret, String userName, String cameraType) throws Exception {
        try {
            if (ys7 == null) {
                ys7 = new Ys7TokenBean();
                ys7.setAppkey(appkey);
                ys7.setSecret(secret);
                ys7.setUserName(userName);
                ys7.setCameraType(cameraType);
                dao.insert(ys7);
            } else {
                ys7.setAppkey(appkey);
                ys7.setSecret(secret);
                ys7.setExpireTime(null);
                ys7.setAccessToken(null);
                ys7.setCameraType(cameraType);
                dao.update(ys7);
            }
        } catch (Exception e) {
            throw new ServiceException("秘钥操作失败");
        }

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
    @Override
    public ResultObject decrypt(String deviceSerial, String validateCode, String userName) throws Exception {
        SysUserBean user = ControllerHelper.getInstance(dao).getLoginUser();
        String token = "";
        if (user.getLevel() >= 1) {//用户
            token = getFluorideToken();
        } else {
            token = getFluorideToken(userName);
        }
        String url = Constant.YS7_ADDRESS + "/api/lapp/device/encrypt/off";
        StringBuilder param = new StringBuilder("accessToken=").append(token)
                .append("&deviceSerial=").append(deviceSerial).
                        append("&validateCode=").append(validateCode);
        String jsonString = HttpClientUtil.doPost(url, param.toString());
        JSONObject json = JSON.parseObject(jsonString);
        String code = json.getString("code");
        String msg = json.getString("msg");
        if (!"200".equals(code)) {//请求失败
            log.error(code + ":" + msg);
            return ResultObject.apiError(msg);
            // throw new ServiceException(msg);
        }
        return ResultObject.ok(msg);
    }

    @Override
    public List<CameraBean> listAllCameras() {
        SysUserBean user = ControllerHelper.getInstance(dao).getLoginUser();
        if (user == null) {
            throw new ServiceException("用户未登录");
        }
        List<CameraBean> list;
        if (user.getLevel() >= 1) {
            //查询用户名下设备的摄像头
            Sql sql = Sqls.create(" select a.* from camera a where a.user_name=@userName and a.delete_flag = '0' ");
            sql.setCallback(Sqls.callback.entities());
            sql.setEntity(dao.getEntity(CameraBean.class));
            sql.params().set("userName", user.getUserName());
            dao.execute(sql);
            list = sql.getList(CameraBean.class);

            Sql sql1 = Sqls.create(" SELECT count(1) from camera a where a.user_name=@userName and a.delete_flag = '0' ");
            sql1.setCallback(Sqls.callback.integer());
            sql1.params().set("userName", user.getUserName());
            dao.execute(sql1);
        } else {
            //查询所有摄像头
            list = dao.query(CameraBean.class, Cnd.where("delete_flag", "=", "0"));
            Sql sql = Sqls.create(" SELECT count(1) from camera a where a.delete_flag = '0' ");
            sql.setCallback(Sqls.callback.integer());
            sql.params().set("userName", user.getUserName());
            dao.execute(sql);
        }
        return list;
    }

    /**
     * 根据摄像头ID获取摄像头详细信息
     *
     * @param id
     * @return
     * @User 李英豪
     */
    @Override
    public ResultObject getCameraDetails(Integer id) throws RuntimeException {
        CameraBean camera = new CameraBean();
        if (id > 0) {
            camera = dao.fetch(CameraBean.class, id);
        }
        return ResultObject.ok().data(camera);
    }

    @Override
    public CameraBean getCameraById(long id) {
        return dao.fetch(CameraBean.class, Cnd.where("id", "=", id).and("delete_flag", "=", "0"));
    }

    @Override
    public Ys7TokenBean getCurrentUserToken(int cameraType) {
        String userName = ControllerHelper.getLoginUserName();
        return dao.fetch(Ys7TokenBean.class, Cnd.where("user_name", "=", userName).and("camera_type", "=", cameraType));
    }

    @Override
    public void saveAccessToken(String accessToken, long expireTime, int cameraType) throws Exception {
        Ys7TokenBean token = getCurrentUserToken(cameraType);
        if (token == null) {
            throw new ServiceException("未找到秘钥信息");
        }
        token.setAccessToken(accessToken);
        token.setExpireTime(new Timestamp(expireTime));
        dao.update(token);
    }

    @Override
    public void saveYs7CameraAddress(CameraBean cameraBean) throws Exception {
        Sql sql = Sqls.create("UPDATE camera SET flv=@flv,flvHd=@flvHd,hls=@hls,hlsHd=@hlsHd,rtmp=@rtmp,rtmpHd=@rtmpHd,expire_time=@expireTime WHERE serial=@serial AND channelNo=@channelNo");
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        String expireTime = simpleDateFormat.format(new Date(System.currentTimeMillis() + 30 * 24 * 60 * 60 * 1000L));
        sql.params().set("flv", cameraBean.getFlv())
                .set("flvHd", cameraBean.getFlvHd())
                .set("hls", cameraBean.getHls())
                .set("hlsHd", cameraBean.getHlsHd())
                .set("rtmp", cameraBean.getRtmp())
                .set("rtmpHd", cameraBean.getRtmpHd())
                .set("expireTime", expireTime)
                .set("serial", cameraBean.getSerial())
                .set("channelNo", cameraBean.getChannelNo());
        dao.execute(sql);
    }

}
