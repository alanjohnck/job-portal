-- Add Type column to SupportTickets table
-- Run this script if you don't want to stop the app to create a migration

USE job_portalDB;
GO

-- Check if column exists before adding
IF NOT EXISTS (
    SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_NAME = 'SupportTickets' 
    AND COLUMN_NAME = 'Type'
)
BEGIN
    ALTER TABLE SupportTickets
    ADD Type NVARCHAR(50) NOT NULL DEFAULT 'General';
    
    PRINT 'Type column added successfully to SupportTickets table';
END
ELSE
BEGIN
    PRINT 'Type column already exists in SupportTickets table';
END
GO
