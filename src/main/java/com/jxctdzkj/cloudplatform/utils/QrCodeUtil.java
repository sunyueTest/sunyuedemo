package com.jxctdzkj.cloudplatform.utils;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.EncodeHintType;
import com.google.zxing.MultiFormatWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.decoder.ErrorCorrectionLevel;

import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;

import java.awt.*;
import java.awt.font.TextAttribute;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.io.OutputStream;
import java.text.AttributedCharacterIterator;
import java.text.AttributedString;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

import javax.imageio.ImageIO;

@Slf4j
public class QrCodeUtil {
    private static final int QRCOLOR = 0xFF000000; // 默认是黑色
    private static final int BGWHITE = 0xFFFFFFFF; // 背景颜色

    private static final int WIDTH = 300; // 二维码宽
    private static final int HEIGHT = 300; // 二维码高


    private static Map<EncodeHintType, Object> hints = new HashMap<EncodeHintType, Object>() {
        private static final long serialVersionUID = 1L;

        {
            put(EncodeHintType.ERROR_CORRECTION, ErrorCorrectionLevel.H);//设置QR二维码的纠错级别（H为最高级别）具体级别信息
            put(EncodeHintType.CHARACTER_SET, "utf-8");// 设置编码方式
            put(EncodeHintType.MARGIN, 1);
        }
    };

    private static BufferedImage drawCode(File logoFile, String qrUrl, String note) {
        try {
            MultiFormatWriter multiFormatWriter = new MultiFormatWriter();
            // 参数顺序分别为：编码内容，编码类型，生成图片宽度，生成图片高度，设置参数
            BitMatrix bm = multiFormatWriter.encode(qrUrl, BarcodeFormat.QR_CODE, WIDTH, HEIGHT, hints);
            BufferedImage image = new BufferedImage(WIDTH, HEIGHT, BufferedImage.TYPE_INT_RGB);

            // 开始利用二维码数据创建Bitmap图片，分别设为黑（0xFFFFFFFF）白（0xFF000000）两色
            for (int x = 0; x < WIDTH; x++) {
                for (int y = 0; y < HEIGHT; y++) {
                    image.setRGB(x, y, bm.get(x, y) ? QRCOLOR : BGWHITE);
                }
            }
            int width = image.getWidth();
            int height = image.getHeight();
            if (Objects.nonNull(logoFile) && logoFile.exists()) {
                // 构建绘图对象
                Graphics2D g = image.createGraphics();
// 读取Logo图片
                BufferedImage logo = ImageIO.read(logoFile);
                // 开始绘制logo图片
                g.drawImage(logo, width * 2 / 5, height * 2 / 5, width * 2 / 10, height * 2 / 10, null);
                g.dispose();
                logo.flush();
            }

            // 自定义文本描述
            if (StringUtils.isNotBlank(note)) {
                // 新的图片，把带logo的二维码下面加上文字
                BufferedImage outImage = new BufferedImage(WIDTH, HEIGHT + 40, BufferedImage.TYPE_4BYTE_ABGR);
                Graphics2D outg = outImage.createGraphics();
                // 画二维码到新的面板
                outg.setColor(Color.BLACK);
                Font font = new Font("黑体", Font.BOLD, 40);
                outg.setFont(font); // 字体、字型、字号
                outg.setRenderingHint(RenderingHints.KEY_TEXT_ANTIALIASING, RenderingHints.VALUE_TEXT_ANTIALIAS_ON);//抗锯齿
                outg.drawImage(image, 0, 0, image.getWidth(), image.getHeight(), null);
// 画文字到新的面板

                int strWidth = outg.getFontMetrics().stringWidth(note);
                if (strWidth > 399) {
// //长度过长就截取前面部分
                    // 长度过长就换行
                    String note1 = note.substring(0, note.length() / 2);
                    String note2 = note.substring(note.length() / 2, note.length());
                    int strWidth1 = outg.getFontMetrics().stringWidth(note1);
                    int strWidth2 = outg.getFontMetrics().stringWidth(note2);
                    //抗锯齿文本
                    outg.setRenderingHint(RenderingHints.KEY_TEXT_ANTIALIASING, RenderingHints.VALUE_TEXT_ANTIALIAS_LCD_HRGB);
                    outg.drawString(note1, 200 - strWidth1 / 2, height + (outImage.getHeight() - height) / 2 + 12);
                    BufferedImage outImage2 = new BufferedImage(WIDTH, HEIGHT + 60, BufferedImage.TYPE_4BYTE_ABGR);
                    Graphics2D outg2 = outImage2.createGraphics();
                    outg2.drawImage(outImage, 0, 0, outImage.getWidth(), outImage.getHeight(), null);
                    outg2.setColor(Color.BLACK);
                    outg2.setFont(new Font("宋体", Font.BOLD, 10)); // 字体、字型、字号
                    //抗锯齿文本
                    outg2.setRenderingHint(RenderingHints.KEY_TEXT_ANTIALIASING, RenderingHints.VALUE_TEXT_ANTIALIAS_LCD_HRGB);
                    outg2.drawString(note2, 200 - strWidth2 / 2, outImage.getHeight() + (outImage2.getHeight() - outImage.getHeight()) / 2 + 5);
                    outg2.dispose();
                    outImage2.flush();
                    outImage = outImage2;
                } else {
                    AttributedString ats = new AttributedString(note);
                    ats.addAttribute(TextAttribute.FONT, font, 0, note.length());
                    AttributedCharacterIterator iter = ats.getIterator();
                    //抗锯齿文本
                    outg.setRenderingHint(RenderingHints.KEY_TEXT_ANTIALIASING, RenderingHints.VALUE_TEXT_ANTIALIAS_ON);
                    outg.drawString(iter, WIDTH / 2 - strWidth / 2, height + (outImage.getHeight() - height) / 2+5); // 画文字
                    //log.error(height +"");
                    //log.error(outImage.getHeight() +"");
                }
                outg.dispose();
                outImage.flush();
                image = outImage;
            }

            //压缩尺寸
            Image img = image.getScaledInstance(220, 220, Image.SCALE_SMOOTH);
            BufferedImage newImage = new BufferedImage(220, 220, BufferedImage.TYPE_INT_ARGB);
            Graphics2D g = newImage.createGraphics();
            g.drawImage(img, 0, 0, null);
            g.dispose();

           /* BufferedImage img1 = new BufferedImage(220, 220, BufferedImage.TYPE_4BYTE_ABGR);
            Graphics2D outg2 = img1.createGraphics();
            outg2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
            outg2.setRenderingHint(RenderingHints.KEY_TEXT_ANTIALIASING, RenderingHints.VALUE_TEXT_ANTIALIAS_ON);
            // 画二维码到新的面板
            outg2.drawImage(image, 0, 0, 220, 220, null);*/
            //image.flush();
            //img1.flush();

            return newImage;

        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    public static void drawLogoQRCode(File logoFile, File codeFile, String qrUrl, String note) throws IOException {//图片文件   二维码储存地址  网页路径                    二维码说明 

        BufferedImage image = drawCode(logoFile, qrUrl, note);
        if (null != image) {
            ImageIO.write(image, "png", codeFile);
        }

    }

    public static void drawLogoQRCode(File logoFile, OutputStream out, String qrUrl, String note) throws IOException {//图片文件   二维码储存地址  网页路径                    二维码说明 

        BufferedImage image = drawCode(logoFile, qrUrl, note);
        if (null != image) {
            ImageIO.write(image, "png", out);
        }

    }


}
