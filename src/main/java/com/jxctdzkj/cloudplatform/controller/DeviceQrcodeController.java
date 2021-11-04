package com.jxctdzkj.cloudplatform.controller;

import com.jxctdzkj.cloudplatform.bean.DeviceBean;
import com.jxctdzkj.cloudplatform.bean.DeviceQrcodeBean;
import com.jxctdzkj.cloudplatform.bean.SysUserBean;
import com.jxctdzkj.cloudplatform.config.Constant;
import com.jxctdzkj.cloudplatform.exception.ServiceException;
import com.jxctdzkj.cloudplatform.mode.TempFileMode;
import com.jxctdzkj.cloudplatform.opLog.EnableOpLog;
import com.jxctdzkj.cloudplatform.utils.ControllerHelper;
import com.jxctdzkj.cloudplatform.utils.QrCodeUtil;
import com.jxctdzkj.cloudplatform.utils.ResultObject;
import com.jxctdzkj.cloudplatform.utils.ReturnObject;

import org.apache.commons.lang3.StringUtils;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
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
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.URLEncoder;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;
import java.util.UUID;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

import javax.servlet.http.HttpServletResponse;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequestMapping({"deviceQrcode"})
@Controller
public class DeviceQrcodeController {

    @Autowired
    Dao dao;

    @RequestMapping()
    public String index() {

        return "deviceQrcodeList";
    }

    @RequestMapping("getDeviceNumber")
    @ResponseBody
    public ResultObject getDeviceNumber(@RequestParam String deviceQrcode) {
        DeviceQrcodeBean bean = dao.fetch(DeviceQrcodeBean.class, Cnd.where("code", "=", deviceQrcode).and("is_del", "=", "0"));

        return bean == null ? ResultObject.apiError("未找到对应信息") : ResultObject.ok(bean);
    }

    @RequestMapping("getDeviceQrcodeList")
    @ResponseBody
    public ReturnObject getDeviceQrcodeList(int page, int limit, String deviceNumber) {
        ReturnObject result = new ReturnObject();
        Pager pager = new Pager(page, limit);
        List<DeviceQrcodeBean> list = null;
        Sql sql = null;
        if (StringUtils.isNotBlank(deviceNumber)) {
            list = dao.query(DeviceQrcodeBean.class, Cnd.where("device_number", "like", "%" + deviceNumber + "%").and(Cnd.exps("is_del", "=", "0").or("is_del", "is", null)), pager);
            sql = Sqls.create(" SELECT count(1) from device_qrcode where device_number like @deviceNumber and (is_del =0 or is_del is null)");
            sql.params().set("deviceNumber", "%" + deviceNumber + "%");
        } else {
            list = dao.query(DeviceQrcodeBean.class, Cnd.where("is_del", "=", "0").or("is_del", "is", null), pager);
            sql = Sqls.create(" SELECT count(1) from device_qrcode where is_del =0 or is_del is null");
        }

        sql.setCallback(Sqls.callback.integer());
        dao.execute(sql);
        result.setCode(0);
        result.setData(list);
        result.setCount(sql.getInt());
        return result;
    }

    @EnableOpLog(Constant.ModifyType.DELETE)
    @RequestMapping("deleteQrcode")
    @ResponseBody
    public ReturnObject deleteQrcode(int id) {
        ReturnObject result = new ReturnObject();
        Sql sql = Sqls.create("update device_qrcode set is_del =1 where id=@id");
        sql.params().set("id", id);
        dao.execute(sql);
        result.setMsg("ok3");//删除成功
        result.setSuccess(true);
        return result;
    }

    @RequestMapping("uploadFile")
    @ResponseBody
    public ReturnObject uploadFile(@RequestParam("file") MultipartFile file, HttpServletResponse response) {
        ReturnObject result = new ReturnObject();
        File zipFile = null;
        try {
            zipFile = File.createTempFile("qrcode", ".zip");
            makeFile(parseExcelAndUpload(file), zipFile);
            //toClient.close();
            result.setSuccess(true);
        } catch (Exception e) {
            result.setMsg(e.getMessage());
            result.setSuccess(false);
            log.error(e.toString(), e);
        } finally {
            if (zipFile != null) {
                result.setData(zipFile.getName());
            }
        }
        return result;

    }


    @RequestMapping("downloadQrcode")
    @ResponseBody
    public void downloadQrcode(HttpServletResponse response, String fileName) {
        if (StringUtils.isBlank(fileName)) {
            return;
        }
        //权限判定
        SysUserBean user = ControllerHelper.getInstance(dao).getLoginUser();
        if (user != null && user.getLevel() < 1) {
            //定位resource
            String tempPath = System.getProperty("java.io.tmpdir") + File.separator;
            File file = new File(tempPath + fileName);
            //获取流 写入客户端
            try {
                if (file.exists() && file.isFile()) {
                    InputStream fis = new BufferedInputStream(new FileInputStream(file.getPath()));
                    byte[] buffer = new byte[fis.available()];
                    fis.read(buffer);
                    fis.close();
                    OutputStream toClient = new BufferedOutputStream(response.getOutputStream());
                    response.setContentType("application/octet-stream");
                    //如果输出的是中文名的文件，在此处就要用URLEncoder.encode方法进行处理
                    response.setHeader("Content-Disposition", "attachment;filename=" + URLEncoder.encode(file.getName(), "UTF-8"));
                    toClient.write(buffer);
                    toClient.flush();
                    toClient.close();
                }
            } catch (Exception e) {
                log.error(e.toString(), e);
            } finally {
                file.delete();
            }

        }


    }

    /**
     * 解析excel并写入数据库
     *
     * @param file
     * @return
     * @throws IOException
     */

    private List<DeviceQrcodeBean> parseExcelAndUpload(MultipartFile file) throws IOException {
        String fileName = file.getOriginalFilename();
        List<DeviceQrcodeBean> cachedList = new LinkedList<>();//缓存上传的数据内容。
        if (!fileName.matches("^.+\\.(?i)(xls)$") && !fileName.matches("^.+\\.(?i)(xlsx)$")) {
            throw new ServiceException("err54");//上传文件格式不正确
        }
        boolean isExcel2003 = true;
        if (fileName.matches("^.+\\.(?i)(xlsx)$")) {
            isExcel2003 = false;
        }
        InputStream is = file.getInputStream();
        Workbook wb = null;
        if (isExcel2003) {
            wb = new HSSFWorkbook(is);
        } else {
            wb = new XSSFWorkbook(is);
        }
        Sheet sheet = wb.getSheetAt(0);
        if (sheet != null) {
            for (int r = 0; r <= sheet.getLastRowNum(); r++) {
                Row row = sheet.getRow(r);
                if (row == null) {
                    continue;
                }
                String deviceNumber = getCellValue(row.getCell(0));
                if (StringUtils.isNotBlank(deviceNumber)) {
                    DeviceBean device = dao.fetch(DeviceBean.class, Cnd.where("ncode", "=", deviceNumber));
                    if (device == null) {
                        continue;
                    }
                    DeviceQrcodeBean bean = dao.fetch(DeviceQrcodeBean.class, Cnd.where("device_number", "=", deviceNumber));
                    if (bean == null) {
                        String code = UUID.randomUUID().toString().toUpperCase();
                        bean = new DeviceQrcodeBean();
                        bean.setCode(code);
                        bean.setCreateTime(new Timestamp(System.currentTimeMillis()));
                        bean.setDeviceNumber(deviceNumber);
                        dao.insert(bean);
                    }
                    cachedList.add(bean);

                }
            }

        }
        return cachedList;
    }

    /**
     * 生成二维码并打包
     *
     * @param cachedList
     * @throws IOException
     */
    private void makeFile(List<DeviceQrcodeBean> cachedList, File zipFile) throws IOException {
        if (cachedList == null || cachedList.size() == 0) {
            throw new IOException("err130");//未匹配到任何设备
        }
        ZipOutputStream zoutput = null;
        FileOutputStream fOutputStream = null;
        try {
            //File zipFile = new File("C://qrcode.zip");

            /*if (!zipFile.exists())
                zipFile.createNewFile();*/
            fOutputStream = new FileOutputStream(zipFile);
            zoutput = new ZipOutputStream(fOutputStream);
            for (DeviceQrcodeBean qrcode : cachedList) {
                String code = qrcode.getCode();
                String deviceNumber = qrcode.getDeviceNumber();
                try {
                    zoutput.putNextEntry(new ZipEntry(deviceNumber.toUpperCase() + ".png"));
                    QrCodeUtil.drawLogoQRCode(null, zoutput, code, deviceNumber.toUpperCase());
                    //fileList.add(codeFile);
                } catch (Exception e) {
                    log.error(e.toString(), e);
                } finally {
                    if (zoutput != null) {
                        zoutput.flush();
                        zoutput.closeEntry();
                    }
                }
            }
        } catch (Exception e) {
            throw e;
        } finally {
            if (zoutput != null) {
                zoutput.close();
            }
            if (fOutputStream != null) {
                fOutputStream.close();
            }

        }

    }
    /*private void makeQrcodeFile(List<File> fileList) throws IOException {
        ZipOutputStream zoutput = null;
        FileOutputStream fOutputStream = null;
        try {
            File zipFile = new File("C://qrcode.zip");
            if (!zipFile.exists())
                zipFile.createNewFile();
            fOutputStream = new FileOutputStream(zipFile);
            zoutput = new ZipOutputStream(fOutputStream);
            byte[] buffer = new byte[1024 * 10];
            for (File fl : fileList) {
                FileInputStream fis = null;
                BufferedInputStream bufferStream = null;
                try {
                    fis = new FileInputStream(fl);
                    bufferStream = new BufferedInputStream(fis);
                    zoutput.putNextEntry(new ZipEntry(fl.getName()));
                    int len;
                    //读入需要下载的文件的内容，打包到zip文件
                    while ((len = bufferStream.read(buffer)) != -1) {
                        zoutput.write(buffer, 0, len);
                    }
                } catch (Exception e) {
                    log.error(e.toString(), e);
                } finally {
                    zoutput.flush();
                    zoutput.closeEntry();
                    bufferStream.close();
                    fis.close();
                }

            }

        } catch (Exception e) {
            log.error(e.getMessage(), e);
            throw e;
        } finally {
            try {
                zoutput.close();
                fOutputStream.close();
            } catch (Exception e) {
                log.error(e.getMessage());
            }
        }


    }*/

    @RequestMapping("makeCode")
    @ResponseBody
    public ReturnObject makeCode(String data, HttpServletResponse response) {
        ReturnObject result = new ReturnObject();
        if (StringUtils.isBlank(data)) {
            return result;
        }
        String[] arr = data.split(",");

        List<TempFileMode> list = new ArrayList<>();
        try {
            for (int i = 0; i < arr.length; i++) {
                DeviceQrcodeBean bean = dao.fetch(DeviceQrcodeBean.class, Cnd.where("id", "=", arr[i]));
                if (bean == null) {
                    continue;
                }
                String code = bean.getCode();
                String deviceNumber = bean.getDeviceNumber();
//                File codeFile = new File("C://" + deviceNumber + ".png");//生成后图片的输出地址
                File codeFile = File.createTempFile(deviceNumber, ".png");//生成后图片的输出地址
                QrCodeUtil.drawLogoQRCode(null, codeFile, code, deviceNumber.toUpperCase());
                list.add(new TempFileMode(codeFile, deviceNumber + ".png"));
            }
            generateZip(response.getOutputStream(), list);
            for (TempFileMode fileMode : list) {
                File file = fileMode.getFile();
                if (file.exists() && file.isFile())
                    file.delete();
            }

        } catch (Exception e) {
            log.error(e.getMessage());
        }

        return result;
    }

    /**
     * 文件打包
     *
     * @param os
     * @param files
     * @throws Exception
     */
    private void generateZip(OutputStream os, List<TempFileMode> files) throws Exception {
        ZipOutputStream out = null;
        try {
            byte[] buffer = new byte[1024];
            //生成的ZIP文件名为Demo.zip
            out = new ZipOutputStream(os);
            //需要同时下载的两个文件result.txt ，source.txt
            for (TempFileMode fileMode : files) {
                FileInputStream fis = new FileInputStream(fileMode.getFile());
                out.putNextEntry(new ZipEntry(fileMode.getName()));
                int len;
                //读入需要下载的文件的内容，打包到zip文件
                while ((len = fis.read(buffer)) != -1) {
                    out.write(buffer, 0, len);
                }
                out.flush();
                out.closeEntry();
                fis.close();
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (out != null) {
                out.close();
            }
        }
    }


    private String getCellValue(Cell cell) {
        String cellValue = "";
        if (cell == null) {
            return cellValue;
        } else {
            if (cell.getCellType() == 0) {
                cell.setCellType(1);
            }

            switch (cell.getCellType()) {
                case 0:
                    cellValue = String.valueOf(cell.getNumericCellValue());
                    break;
                case 1:
                    cellValue = String.valueOf(cell.getStringCellValue());
                    break;
                case 2:
                    try {
                        cellValue = String.valueOf(cell.getNumericCellValue());
                    } catch (Exception var3) {
                        cellValue = "0";
                    }
                    break;
                case 3:
                    cellValue = "";
                    break;
                case 4:
                    cellValue = String.valueOf(cell.getBooleanCellValue());
                    break;
                case 5:
                    cellValue = "非法字符";
                    break;
                default:
                    cellValue = "未知类型";
            }

            return cellValue;
        }
    }
}
