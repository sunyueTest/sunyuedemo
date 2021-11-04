package com.jxctdzkj.cloudplatform.config;

import com.jxctdzkj.utils.License;
import com.mchange.v2.c3p0.ComboPooledDataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;

import java.beans.PropertyVetoException;

@Configuration
public class DataSourceConfig  {
    @Autowired
    protected Environment env;

    @Bean(name = "dataSource")
    public ComboPooledDataSource dataSource() throws PropertyVetoException {
        if (Constant.Privatisation.LICENCE) {
            License.init(Constant.Privatisation.LICENCE_KEY,false);
        }
        ComboPooledDataSource dataSource = new ComboPooledDataSource();
        dataSource.setDriverClass(env.getProperty("jdbc.driverClassName"));
        dataSource.setJdbcUrl(env.getProperty("jdbc.url"));
        dataSource.setUser(env.getProperty("jdbc.username"));
        dataSource.setPassword(env.getProperty("jdbc.password"));
        dataSource.setMaxPoolSize(50);
        dataSource.setMinPoolSize(3);
        dataSource.setInitialPoolSize(2);
        dataSource.setMaxIdleTime(300);
        dataSource.setAcquireIncrement(2);
        dataSource.setIdleConnectionTestPeriod(60);
        return dataSource;
    }


}

