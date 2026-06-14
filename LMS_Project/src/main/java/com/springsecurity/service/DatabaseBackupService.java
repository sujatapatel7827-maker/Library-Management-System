package com.springsecurity.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;

@Service
public class DatabaseBackupService {

    @Value("${spring.datasource.username:root}")
    private String dbUsername;

    @Value("${spring.datasource.password:root}")
    private String dbPassword;

    // Daily at midnight (cron format: second, minute, hour, day of month, month, day(s) of week)
    @Scheduled(cron = "0 0 0 * * ?")
    public void backupDatabase() {
        String dbName = "library_db";
        String backupDir = "backups";
        
        // Create backups directory if it doesn't exist
        File dir = new File(backupDir);
        if (!dir.exists()) {
            dir.mkdir();
        }

        String date = new SimpleDateFormat("yyyy-MM-dd_HH-mm-ss").format(new Date());
        String fileName = backupDir + "/backup_" + dbName + "_" + date + ".sql";

        // Note: mysqldump must be in the system PATH for this to work automatically
        String command = String.format("mysqldump -u %s -p%s --add-drop-database -B %s -r %s", 
                                       dbUsername, dbPassword, dbName, fileName);

        try {
            System.out.println("Starting database backup: " + fileName);
            Process process = Runtime.getRuntime().exec(command);
            int processComplete = process.waitFor();

            if (processComplete == 0) {
                System.out.println("Backup created successfully at: " + fileName);
            } else {
                System.err.println("Could not create the backup. Process exited with code: " + processComplete);
            }
        } catch (IOException | InterruptedException e) {
            System.err.println("Exception occurred during backup: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
