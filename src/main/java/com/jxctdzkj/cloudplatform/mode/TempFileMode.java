package com.jxctdzkj.cloudplatform.mode;

import java.io.File;

/**
 * <pre>
 *     @author  : FlySand
 *     @e-mail  : 1156183505@qq.com
 *     @time    : 2019/9/3.
 *     @desc    :
 * </pre>
 */
public class TempFileMode extends Mode {

    public TempFileMode(File file, String name) {
        this.file = file;
        this.name = name;
    }

    File file;
    String name;


    public File getFile() {
        return file;
    }

    public void setFile(File file) {
        this.file = file;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
