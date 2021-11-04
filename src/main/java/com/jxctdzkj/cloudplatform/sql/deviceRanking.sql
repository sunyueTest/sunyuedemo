-- 智慧工地设备排行榜接口中使用的SQL语句，方便后期维护时查看
-- 具体参数查看getDeviceRankingList接口
SELECT
	device_name,
	min( sensor_value ) AS num
FROM
	(
        SELECT
            s.sensor_code,
            ud.device_name AS device_name,
            ud.Ncode
        FROM
            sensor s,
            sys_user_to_devcie ud
        WHERE
            s.sensor_ncode = ud.Ncode
            AND ud.user_name = '123'
            AND s.sensor_name = '湿度'
	) AS sc,
	(
        SELECT
            sensor_code,
            sensor_value
        FROM
            sensor_data_2019_03_09_09_57
        WHERE
            DATE_SUB( CURDATE( ), INTERVAL 1 YEAR ) <= date( record_time ) UNION ALL
        SELECT
            sensor_code,
            sensor_value
        FROM
            sensor_data_2019_03_09_10_07
        WHERE
            DATE_SUB( CURDATE( ), INTERVAL 1 YEAR ) <= date( record_time ) UNION ALL
        SELECT
            sensor_code,
            sensor_value
        FROM
            sensor_data_2019_03_12_13_38
        WHERE
            DATE_SUB( CURDATE( ), INTERVAL 1 YEAR ) <= date( record_time )
	) AS sd
WHERE
	sd.sensor_code = sc.sensor_code
GROUP BY
	sc.device_name
ORDER BY
	num ASC