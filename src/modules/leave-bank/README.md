# Leave Bank Module Guide

## Module Overview

The Leave Bank Module manages employee leave records, attendance tracking, and leave balance management within the APAC Management System. It provides comprehensive leave tracking, Excel import functionality, and automated email notifications for leave balances.

### Core Purpose

- Leave balance tracking and management
- Monthly attendance record maintenance
- Federal holiday tracking (US and CAD)
- Excel file import for bulk updates
- Automated leave balance notifications
- Leave analytics and reporting

### Key Capabilities

- Monthly leave bank records per employee
- Excel (.xlsx) file upload for bulk processing
- Leave balance calculations (CL, SL, remaining)
- Federal holiday management
- Bulk and individual email notifications
- Advanced filtering and search
- Leave history tracking

## API Endpoints

### Authentication Required

All endpoints require JWT authentication.

| Method | Endpoint                               | Description                           | Required Permission     |
| ------ | -------------------------------------- | ------------------------------------- | ----------------------- |
| `GET`  | `/leave-bank`                          | Get all leave bank records (filtered) | `CAN_VIEW_LEAVE_BANK`   |
| `GET`  | `/leave-bank/:employeeId`              | Get leave bank by employee ID         | `CAN_VIEW_LEAVE_BANK`   |
| `POST` | `/leave-bank/upload`                   | Upload Excel file for processing      | `CAN_MANAGE_LEAVE_BANK` |
| `POST` | `/leave-bank/bulk-emails`              | Send bulk leave balance emails        | `CAN_MANAGE_LEAVE_BANK` |
| `POST` | `/leave-bank/:employeeId/send-email`   | Send single employee email            | `CAN_MANAGE_LEAVE_BANK` |
| `POST` | `/leave-bank/:employeeId/email-action` | Send/cancel email action              | `CAN_MANAGE_LEAVE_BANK` |

## Data Transfer Objects (DTOs)

### CreateLeaveBankDto

Used for creating leave bank records.

```typescript
{
  userId?: string;                    // MongoDB ObjectId
  employeeId?: string;
  email?: string;
  name?: string;
  department?: string;
  year?: number;
  month?: string;                     // Format: "YYYY-MM"
  monthlyBank?: MonthlyBankDto;       // Working days, hours, etc.
  summary?: AttendanceRecordsDto;     // Leave totals and balances
  federalHolidays?: FederalHolidayDto; // US and CAD holidays
}
```

### MonthlyBankDto

Monthly attendance data.

```typescript
{
  workingDays?: number;    // Total working days in month
  shortHours?: number;     // Short hours taken
  leaves?: number;         // Total leaves taken
  absent?: number;         // Absent days
  extraHours?: number;     // Extra hours worked
  netHoursWorked?: number; // Net hours calculation
}
```

### AttendanceRecordsDto

Leave balance summary.

```typescript
{
  totalCL?: number;           // Total casual leave quota
  totalSL?: number;           // Total sick leave quota
  usedCL?: number;            // Used casual leaves
  usedSL?: number;            // Used sick leaves
  remainingCL?: number;       // Remaining casual leaves
  remainingSL?: number;       // Remaining sick leaves
  totalLeaves?: number;       // Total leaves available
  netLeavesInDays?: number;   // Net leaves calculation
  shortHoursInDays?: number;  // Short hours converted to days
}
```

### EmployeeNotificationDto

Email notification control.

```typescript
{
  sendEmail: boolean;   // True to send, false to cancel
  baseUrl?: string;     // Base URL for email links
  month?: string;       // Specific month for action
}
```

## Key Workflows

### Excel File Upload Process

1. **File Validation**: Check file type (.xlsx) and size
2. **Authentication**: Verify user permissions
3. **File Processing**: Parse Excel data using leave-bank processor
4. **Data Validation**: Validate employee IDs, emails, and data format
5. **Database Update**: Create or update leave bank records
6. **Response**: Return processing results with success/error counts

### Bulk Email Notification

1. **Permission Check**: Verify `CAN_MANAGE_LEAVE_BANK` permission
2. **Filter Application**: Apply year, month, department filters
3. **Employee Fetch**: Retrieve matching leave bank records
4. **Email Generation**: Create personalized leave balance emails
5. **Bulk Send**: Send emails to all filtered employees
6. **Response**: Return email sending results

### Leave Balance Calculation

1. **Monthly Data**: Fetch monthly attendance records
2. **Leave Usage**: Calculate used CL and SL
3. **Remaining Balance**: Compute remaining leaves
4. **Short Hours**: Convert short hours to days
5. **Net Calculation**: Calculate net leave balance

### Federal Holiday Tracking

1. **Holiday Input**: Record US and CAD federal holidays
2. **Status Tracking**: Track Off, No Off, No Off but added, N/a
3. **Leave Adjustment**: Adjust leave balances for holidays
4. **Reporting**: Include in monthly summaries

## Integration Points

### User Module

- Employee ID validation
- Email address verification
- User profile association
- Permission validation

### Profile Module

- Employee information retrieval
- Department association
- Contact information

### Email Service

- Leave balance notifications
- Bulk email sending
- Email templates
- Delivery tracking

### Excel Processing Service

- File parsing and validation
- Data transformation
- Error handling
- Batch processing

## Usage Examples

### Get All Leave Bank Records

```bash
curl -X GET "http://localhost:3400/leave-bank?year=2024&month=January&department=Engineering" \
  -H "Authorization: Bearer <jwt-token>"
```

### Get Employee Leave Bank

```bash
curl -X GET http://localhost:3400/leave-bank/EMP-12345 \
  -H "Authorization: Bearer <jwt-token>"
```

### Upload Excel File

```bash
curl -X POST "http://localhost:3400/leave-bank/upload?month=2024-01" \
  -H "Authorization: Bearer <jwt-token>" \
  -F "file=@leave_records.xlsx"
```

### Send Bulk Emails

```bash
curl -X POST "http://localhost:3400/leave-bank/bulk-emails?year=2024&month=January" \
  -H "Authorization: Bearer <jwt-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "baseUrl": "https://apac-dev.agilebrains.com"
  }'
```

### Send Single Employee Email

```bash
curl -X POST http://localhost:3400/leave-bank/EMP-12345/send-email \
  -H "Authorization: Bearer <jwt-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "baseUrl": "https://apac-dev.agilebrains.com"
  }'
```

### Email Action Control

```bash
curl -X POST http://localhost:3400/leave-bank/EMP-12345/email-action \
  -H "Authorization: Bearer <jwt-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "sendEmail": true,
    "month": "2024-01"
  }'
```

## Common Scenarios

### Scenario 1: Monthly Leave Update

```typescript
// Upload monthly leave data
const formData = new FormData();
formData.append('file', excelFile);

const response = await fetch('/leave-bank/upload?month=2024-01', {
  method: 'POST',
  headers: { Authorization: `Bearer ${token}` },
  body: formData,
});

const result = await response.json();
// Check processing results
Logger.log(`Processed: ${result.data.processed}, Errors: ${result.data.errors.length}`);
```

### Scenario 2: Department Leave Report

```typescript
// Get leave records for specific department
const response = await fetch(
  '/leave-bank?year=2024&month=January&department=Engineering&sort=-remainingCL',
  {
    headers: { Authorization: `Bearer ${token}` },
  },
);

const { data } = await response.json();
// Display leave balances sorted by remaining CL
```

### Scenario 3: Leave Balance Notification

```typescript
// Send leave balance emails to all employees
const response = await fetch('/leave-bank/bulk-emails?year=2024&month=January', {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    baseUrl: 'https://apac-dev.agilebrains.com',
  }),
});
```

## Configuration Requirements

### Environment Variables

```env
EMAIL_SERVICE_ENABLED=true
MAX_EXCEL_FILE_SIZE=10485760  # 10MB
LEAVE_BANK_BUCKET=leave-bank-uploads
```

### Excel File Format

- **Required Columns**: Employee ID, Email, Name, Department
- **Leave Columns**: Total CL, Total SL, Used CL, Used SL
- **Monthly Columns**: Working Days, Short Hours, Leaves, Absent
- **Format**: .xlsx (Excel 2007+)

### Leave Calculation Rules

- Standard CL quota: 8 days/year
- Standard SL quota: 8 days/year
- Short hours conversion: 8 hours = 1 day
- Working hours: 8 hours/day

## Error Handling

### Common Error Responses

- `400`: Invalid file format, validation errors, missing required fields
- `401`: Unauthorized, invalid token
- `403`: Insufficient permissions
- `404`: Employee not found
- `413`: File size too large
- `500`: Internal server error, processing errors

### Error Response Format

```json
{
  "success": false,
  "message": "Invalid Excel file format",
  "statusCode": 400,
  "errors": [
    {
      "row": 5,
      "field": "employeeId",
      "message": "Employee ID is required"
    }
  ]
}
```

## Security Considerations

### Access Control

- Permission-based access to leave data
- Department-level data filtering
- Employee data privacy
- Audit trail for changes

### Data Validation

- Employee ID verification
- Email format validation
- Numeric range validation
- Date format validation

### File Security

- File type validation
- Size limit enforcement
- Malicious file detection
- Secure file processing

## Performance Notes

### Optimization Tips

- Batch process Excel uploads
- Cache leave balance calculations
- Use database indexes on employeeId and month
- Implement pagination for large datasets

### Caching Strategy

- Leave balance caching (1-hour TTL)
- Department summaries caching
- Federal holiday caching
- Email template caching

## Troubleshooting

### Common Issues

1. **Excel Upload Fails**: Check file format, column names, data types
2. **Email Not Sent**: Verify email service configuration, employee emails
3. **Incorrect Balances**: Check calculation formulas, input data
4. **Missing Records**: Verify employee ID exists, month format correct

### Debug Steps

1. Check application logs for processing errors
2. Validate Excel file structure and data
3. Test with sample data file
4. Verify email service connectivity
5. Check database records for data integrity
