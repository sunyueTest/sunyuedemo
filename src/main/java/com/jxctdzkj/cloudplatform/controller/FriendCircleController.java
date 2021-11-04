package com.jxctdzkj.cloudplatform.controller;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.jxctdzkj.cloudplatform.bean.CircleTempFile;
import com.jxctdzkj.cloudplatform.bean.FriendCircleCommentBean;
import com.jxctdzkj.cloudplatform.bean.FriendCircleLikeBean;
import com.jxctdzkj.cloudplatform.bean.FriendCircleMessageBean;
import com.jxctdzkj.cloudplatform.config.Constant;
import com.jxctdzkj.cloudplatform.exception.ServiceException;
import com.jxctdzkj.cloudplatform.service.RoleManageService;
import com.jxctdzkj.cloudplatform.utils.ControllerHelper;
import com.jxctdzkj.cloudplatform.utils.FlieHttpUtil;
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
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.ModelAndView;

import javax.activation.MimetypesFileTypeMap;
import javax.imageio.ImageIO;
import javax.servlet.http.HttpServletRequest;
import java.awt.*;
import java.io.File;
import java.io.IOException;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.UUID;

@RequestMapping({"friendCircle"})
@Slf4j
@Controller
public class FriendCircleController {

    @Autowired
    Dao dao;

    @Autowired
    RoleManageService roleManageService;

    /**
     * 朋友圈页面跳转
     *
     * @return
     */
    @RequestMapping(value = "friendCirclePage")
    public ModelAndView friendCirclePage(String type) {
        return new ModelAndView("friendCircle/friendCirclePage");
    }

    /**
     * 发布动态接口
     */
    @RequestMapping(value = "")
    public ModelAndView friendCircleList(String type) {
        //获取总页数;
        Sql sql = Sqls.create("SELECT count(1) from t_friend_circle_message where type=@type");
        sql.setCallback(Sqls.callback.integer());
        sql.params().set("type", type);
        dao.execute(sql);
        int count = sql.getInt();
        int totalPage = (int) Math.ceil((double) count / 10);
        HashMap<String, Object> map = new HashMap<>();
        map.put("totalPage", totalPage);
        map.put("type", type);
        return new ModelAndView("friendCircle/friendCircleList", "map", map);

    }

    /**
     * 发布动态
     *
     * @param message
     * @return
     */
    @RequestMapping("publishDynamics")
    @ResponseBody
    public ResultObject publishDynamics(FriendCircleMessageBean message) {
        String userName = ControllerHelper.getLoginUserName();
        if (StringUtils.isBlank(userName) || "null".equals(userName)) {
            return ResultObject.error("用户未登录");
        }
        if (StringUtils.isBlank(message.getContent()) && StringUtils.isBlank(message.getPicture())) {
            return ResultObject.error("先随便说两句吧....");
        }
        message.setUserName(userName);
        message.setCreateTime(new Timestamp(System.currentTimeMillis()));
        dao.insert(message);
        if (StringUtils.isNotBlank(message.getPicture())) {
            String[] imgs = message.getPicture().split(",");
            Sql sql = Sqls.create("delete from circle_temp_file where src in (@imgs)");
            sql.params().set("imgs", imgs);
            dao.execute(sql);
        }
        return ResultObject.ok();
    }


    /**
     * 朋友圈展示
     */
    @RequestMapping("circleShow")
    @ResponseBody
    public ResultObject circleShow(Integer page, Integer limit, String type) {
        String userName = ControllerHelper.getLoginUserName();
        if (StringUtils.isBlank(userName)) {
            return ResultObject.error("用户未登录");
        }

        //查找发表的动态；
        Pager pager = new Pager(page, limit);
        List<FriendCircleMessageBean> messageBeans = dao.query(FriendCircleMessageBean.class, Cnd.where("type", "=", type).desc("create_time"), pager);

        //查找评论
        List<FriendCircleCommentBean> commentBeans = dao.query(FriendCircleCommentBean.class, null);
        //封装评论到个人动态
        for (FriendCircleMessageBean messageBean : messageBeans) {
            int id = messageBean.getId();
            List<FriendCircleCommentBean> cb = new ArrayList<>();
            for (FriendCircleCommentBean commentBean : commentBeans) {
                int fcmid = commentBean.getFcmid();
                if (id == fcmid) {
                    cb.add(commentBean);
                }
            }
            messageBean.setCommentList(cb);
        }
        return ResultObject.ok().data("list", messageBeans);
    }

    @RequestMapping("circleShowForApp")
    @ResponseBody
    public ResultObject circleShowForApp(Integer page, Integer limit, String type) {
        String userName = ControllerHelper.getLoginUserName();
        if (StringUtils.isBlank(userName)) {
            return ResultObject.error("用户未登录");
        }

        //查找发表的动态；
        Pager pager = new Pager(page, limit);
        List<FriendCircleMessageBean> messageBeans = dao.query(FriendCircleMessageBean.class, Cnd.where("type", "=", type).desc("create_time"), pager);
        //查找评论
        List<FriendCircleCommentBean> commentBeans = dao.query(FriendCircleCommentBean.class, null);
        //封装评论到个人动态
        for (FriendCircleMessageBean messageBean : messageBeans) {
            int id = messageBean.getId();
            List<FriendCircleCommentBean> cb = new ArrayList<>();
            for (FriendCircleCommentBean commentBean : commentBeans) {
                int fcmid = commentBean.getFcmid();
                if (id == fcmid) {
                    cb.add(commentBean);
                }
            }
            messageBean.setCommentList(cb);
        }
        return ResultObject.okList(messageBeans, page, limit);
    }

    /**
     * 提交评论
     */
    @RequestMapping("comment")
    @ResponseBody
    public ResultObject comment(FriendCircleCommentBean comment) {
        String userName = ControllerHelper.getLoginUserName();
        if (StringUtils.isBlank(userName) || "null".equals(userName)) {
            return ResultObject.error("用户未登录");
        }
        String content = comment.getContent();
        if (StringUtils.isBlank(content)) {
            return ResultObject.error("随便说两句吧...");
        }
        //回复评论
        if (comment.getToId() != null) {
            //解析内容
            if (content.contains("[/reply]:")) {
                String[] arr = content.split(":");
                if (arr.length < 2) {
                    return ResultObject.error("随便说两句吧...");
                }
                FriendCircleCommentBean original = dao.fetch(FriendCircleCommentBean.class, Cnd.where("id", "=", comment.getToId()));
                if (original == null) {
                    return ResultObject.error("找不到评论");
                }
                String toUser = original.getUserName();
                String realContent = arr[1];
                comment.setToUser(toUser);
                comment.setContent(realContent);
            } else {
                comment.setToId(null);//清除不规范的数据
            }
        }
        comment.setUserName(userName);
        comment.setCreateTime(new Timestamp(System.currentTimeMillis()));
        dao.insert(comment);
        return ResultObject.ok();
    }

    @RequestMapping("upload")
    @ResponseBody
    public ResultObject upload(MultipartFile file, HttpServletRequest request) throws MaxUploadSizeExceededException {

        String userName = ControllerHelper.getLoginUserName();
        if (StringUtils.isBlank(userName) || "null".equals(userName)) {
            return ResultObject.error("用户未登录");
        }
        //上传图片
        String fileName = "";
        String oriName = "";
        try {
            oriName = file.getOriginalFilename();
            String suffix = oriName.substring(oriName.lastIndexOf("."));
            // 5.保存图片
            File tempFile = File.createTempFile("circle", suffix);
            file.transferTo(tempFile);
            String uploadResult = FlieHttpUtil.uploadFile(Constant.Url.FILE_UPLOAD_URL, tempFile);
            log.info("uploadResult :" + uploadResult);
            JSONObject json = JSON.parseObject(uploadResult);
            fileName = json.getJSONObject("data").getString("fileName");
            if (StringUtils.isBlank(fileName)) {
                throw new ServiceException("fileName  isEmpty");
            }
            tempFile.delete();
            String realPath = Constant.Url.FILE_DOWNLOAD_PATH + fileName;
            //记录临时数据
            CircleTempFile temp = new CircleTempFile();
            temp.setSrc(realPath);
            temp.setCreateTime(new Timestamp(System.currentTimeMillis()));
            temp.setUserName(userName);
            dao.insert(temp);
            return ResultObject.ok().data("src", realPath);

        } catch (Exception e) {
            log.error(e.toString(), e);
            return ResultObject.error(e.getMessage());
        }
    }


    @RequestMapping("like")
    @ResponseBody
    public ResultObject like(Integer id) {

        String userName = ControllerHelper.getLoginUserName();
        if (StringUtils.isBlank(userName) || "null".equals(userName)) {
            return ResultObject.error("用户未登录");
        }
        //判断用户是否已点赞
        FriendCircleLikeBean like = dao.fetch(FriendCircleLikeBean.class, Cnd.where("fcmid", "=", id).and("user_name", "=", userName));
        if (like != null) {
            return ResultObject.error("已点过赞啦");
        }
        like = new FriendCircleLikeBean();
        like.setFcmid(id);
        like.setUserName(userName);
        like.setCreateTime(new Timestamp(System.currentTimeMillis()));
        dao.insert(like);
        return updateLike(id);
    }

    @RequestMapping("cancelLike")
    @ResponseBody
    public ResultObject cancelLike(Integer id) {

        String userName = ControllerHelper.getLoginUserName();
        if (StringUtils.isBlank(userName) || "null".equals(userName)) {
            return ResultObject.error("用户未登录");
        }
        Sql sql = Sqls.create("delete from t_friend_circle_like where fcmid=@fcmid and user_name = @userName");
        sql.params().set("fcmid", id);
        sql.params().set("userName", userName);
        dao.execute(sql);
        return updateLike(id);
    }

    private ResultObject updateLike(Integer fcmid) {
        int likeCount = 0;
        String topThree = "";
        //点赞人数加1。修改点赞前三的信息。
        List<FriendCircleLikeBean> list = dao.query(FriendCircleLikeBean.class, Cnd.where("fcmid", "=", fcmid).desc("create_time"));

        if (list != null && list.size() > 0) {
            likeCount = list.size();
            for (int i = 0; i < list.size(); i++) {
                if (i > 2)
                    break;
                topThree += list.get(i).getUserName() + ",";


            }
        }
        Sql sql = Sqls.create("update t_friend_circle_message set like_count=@likeCount,top_three=@topThree where id=@id");
        sql.params().set("likeCount", likeCount);
        sql.params().set("topThree", topThree);
        sql.params().set("id", fcmid);

        dao.execute(sql);
        return ResultObject.ok().data("likeCount", likeCount).data("topThree", topThree);
    }
}
