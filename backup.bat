@echo off
set DB_NAME=library_db
set DB_USER=root
set DB_PASS=root
set BACKUP_DIR=backups

if not exist "%BACKUP_DIR%" mkdir "%BACKUP_DIR%"

for /f "tokens=2-4 delims=/ " %%a in ('date /t') do (set mydate=%%c-%%a-%%b)
for /f "tokens=1-2 delims=/:" %%a in ('time /t') do (set mytime=%%a%%b)

set BACKUP_FILE=%BACKUP_DIR%\backup_%DB_NAME%_%mydate%_%mytime%.sql

echo Backing up database %DB_NAME% to %BACKUP_FILE%
mysqldump -u %DB_USER% -p%DB_PASS% %DB_NAME% > %BACKUP_FILE%

if %ERRORLEVEL% equ 0 (
    echo Backup completed successfully.
) else (
    echo Error during backup. Please ensure mysqldump is in your PATH.
)
pause
