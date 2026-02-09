# Request Module Guide

## Module Overview

The Request Module manages employee requests for leaves, time off, and other approvals within the APAC Management System. It provides a comprehensive workflow system with multi-stage approval processes, remarks, and status tracking.

### Core Purpose

- Request creation and management
- Multi-stage approval workflow
- Request status tracking
- Remarks and comments system
- Request history and audit trail
- Approval/rejection processing

### Key Capabilities

- Create various types of requests (leave, time off, etc.)
- Multi-level approval workflow
- Add remarks to requests
- Approve or reject requests
- View request history
- Filter and search requests
- Real-time status updates

## API Endpoints

### Authentication Required

All endpoints require JWT authentication.

| Method | Endpoint                 | Description                 | Required Permission | DTO Used           |
| ------ | ------------------------ | --------------------------- | ------------------- | ------------------ |
| `POST` | `/requests`              | Create a new request        | Authenticated       | `CreateRequestDto` |
| `GET`  | `/requests/all`          | Get all requests (filtered) | Authenticated       | Query Parameters   |
| `GET`  | `/requests/:id`          | Get specific request by ID  | Authenticated       | N/A                |
| `GET`  | `/requests/my/request`   | Get current user's requests | Authenticated       | Query Parameters   |
| `PUT`  | `/requests/:id/remarks`  | Add remarks to request      | Authenticated       | `AddRemarksDto`    |
| `PUT`  | `/requests/:id/action`   | Approve or reject request   | Authenticated       | `ProcessActionDto` |
| `PUT`  | `/requests/:id/withdraw` | Withdraw pending request    | Authenticated       | N/A                |

## Data Transfer Objects (DTOs)

### CreateRequestDto

Used for creating new requests.

```bash
{
  requestType: RequestType;     // Required: Type of request (CASUAL, SICK, ANNUAL, etc.)
  requestedDates: string[];     // Required: Array of dates in YYYY-MM-DD format
  reason?: string;              // Optional: Reason for request (min 3, max 500 chars)
}
```

**Validation Rules:**

- `requestType`: Must be valid RequestType enum value
- `requestedDates`: Required array, min 1 date, max 30 dates, each in YYYY-MM-DD format
- `reason`: Optional string, min 3 characters, max 500 characters
- Dates cannot be in the past (except for medical emergencies)
- Maximum days per request type: CASUAL/SICK (8), ANNUAL (30), MATERNITY (180), etc.
- Cannot request dates more than 6 months in advance (except ANNUAL leave)

### AddRemarksDto

Used for adding remarks to requests.

```bash
{
  remark: string; // Required: Remark text (min 1, max 1000 chars)
}
```

**Validation Rules:**

- `remark`: Required string, min 1 character, max 1000 characters
- Cannot contain suspicious patterns (XSS protection)
- Automatically trimmed of whitespace

### ProcessActionDto

Used for approving or rejecting requests.

```bash
{
  action: ActionType;  // Required: APPROVED or DISAPPROVED
  remarks?: string;    // Optional: Action remarks (max 1000 chars)
}
```

**Validation Rules:**

- `action`: Must be `APPROVED` or `DISAPPROVED`
- `remarks`: Optional feedback message, max 1000 characters
- Status transitions are validated based on current request status

## Key Workflows

### Request Creation Process

1. **Authentication**: Verify user session
2. **Validation**: Validate request data and dates
3. **Request Creation**: Create request with PENDING status
4. **Workflow Initialization**: Set up approval stages
5. **Notification**: Notify approvers
6. **Response**: Return created request

### Approval Workflow

1. **Request Retrieval**: Fetch request by ID
2. **Permission Check**: Verify user can approve at current stage
3. **Action Processing**: Apply approval or rejection
4. **Stage Advancement**: Move to next approval stage if approved
5. **Status Update**: Update request status
6. **Notification**: Notify requester and next approvers
7. **Response**: Return updated request

### Remarks Addition

1. **Authentication**: Verify user identity
2. **Request Lookup**: Find request by ID
3. **Remark Creation**: Add timestamped remark
4. **Notification**: Notify relevant parties
5. **Response**: Return added remark

### Request Filtering

1. **Query Parameters**: Parse filter criteria
2. **Permission Check**: Apply visibility rules
3. **Database Query**: Fetch matching requests
4. **Data Transformation**: Format response data
5. **Response**: Return filtered requests

## Integration Points

### User Module

- User authentication
- User profile information
- Approver identification
- Permission validation

### Profile Module

- Employee information
- Department association
- Manager hierarchy

### Email Service

- Request submission notifications
- Approval/rejection notifications
- Remark notifications
- Status change alerts

### Leave Bank Module

- Leave balance verification
- Leave deduction on approval
- Leave type validation

## Usage Examples

### Create Request

```bash
curl -X POST http://localhost:3400/requests \
  -H "Authorization: Bearer <jwt-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "requestType": "WORK_FROM_HOME",
    "requestedDates": ["2024-02-01", "2024-02-02", "2024-02-03"],
    "reason": "Personal work from home for better focus"
  }'
```

### Get All Requests

```bash
curl -X GET "http://localhost:3400/requests/all?status=PENDING" \
  -H "Authorization: Bearer <jwt-token>"
```

### Get My Requests

```bash
curl -X GET http://localhost:3400/requests/my/request \
  -H "Authorization: Bearer <jwt-token>"
```

### Get Request by ID

```bash
curl -X GET http://localhost:3400/requests/507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer <jwt-token>"
```

### Add Remarks

```bash
curl -X PUT http://localhost:3400/requests/507f1f77bcf86cd799439011/remarks \
  -H "Authorization: Bearer <jwt-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "remark": "Please provide more details about the dates"
  }'
```

### Approve Request

```bash
curl -X PUT http://localhost:3400/requests/507f1f77bcf86cd799439011/action \
  -H "Authorization: Bearer <jwt-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "action": "APPROVED",
    "remarks": "Approved for the requested dates"
  }'
```

### Reject Request

```bash
curl -X PUT http://localhost:3400/requests/507f1f77bcf86cd799439011/action \
  -H "Authorization: Bearer <jwt-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "action": "DISAPPROVED",
    "remarks": "Insufficient leave balance"
  }'
```

## Common Scenarios

### Scenario 1: Employee Submits Leave Request

```bash
// Create leave request
const response = await fetch('/requests', {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    requestType: 'CASUAL_LEAVE',
    requestedDates: ['2024-02-01', '2024-02-02', '2024-02-03', '2024-02-04', '2024-02-05'],
    reason: 'Vacation',
  }),
});

const { data } = await response.json();
// Request created with PENDING status
```

### Scenario 2: Manager Reviews Requests

```bash
// Get all pending requests
const response = await fetch('/requests/all?status=PENDING', {
  headers: { Authorization: `Bearer ${managerToken}` },
});

const { data } = await response.json();
// Display pending requests for review
```

### Scenario 3: Approval Process

```bash
// Manager approves request
const response = await fetch(`/requests/${requestId}/action`, {
  method: 'PUT',
  headers: {
    Authorization: `Bearer ${managerToken}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    action: 'APPROVED',
    remarks: 'Enjoy your time off!',
  }),
});

// Request moves to next approval stage or becomes APPROVED
```

## Configuration Requirements

### Environment Variables

```env
EMAIL_NOTIFICATIONS_ENABLED=true
MAX_REQUEST_DAYS=30
APPROVAL_STAGES=2
```

### Request Types

- `CASUAL_LEAVE`: Casual leave request (max 8 days)
- `SICK_LEAVE`: Sick leave request (max 8 days)
- `ANNUAL_LEAVE`: Annual leave request (max 30 days)
- `WORK_FROM_HOME`: Remote work request (max 30 days)
- `MATERNITY_LEAVE`: Maternity leave request (max 180 days)
- `MARRIAGE_LEAVE`: Marriage leave request (max 7 days)
- `CHILD_DELIVERY`: Child delivery leave request (max 14 days)
- `MEDICAL_EMERGENCY`: Medical emergency leave request (max 7 days)
- `COMPENSATORY_LEAVE`: Compensatory leave request (max 14 days)
- `LATE_ARRIVAL`: Late arrival request (max 1 day)
- `HALF_DAY`: Half day request (max 1 day)
- `TRAINING`: Training request (max 30 days)

### Request Status Values

- `PENDING`: Awaiting approval
- `IN_PROCESS`: Partially approved, moving to next stage
- `APPROVED`: Fully approved
- `DISAPPROVED`: Rejected
- `WITHDRAWN`: Withdrawn by requester
- `REJECTED`: System rejected (e.g., duplicate dates)
- `COMPLETED`: Final status after approval/disapproval

## Error Handling

### Common Error Responses

- `400`: Invalid dates, validation errors, insufficient leave balance
- `401`: Unauthorized, invalid token
- `403`: Insufficient permissions, cannot approve own request
- `404`: Request not found
- `500`: Internal server error

### Error Response Format

```bash
{
  "success": false,
  "message": "End date must be after start date",
  "statusCode": 400
}
```

## Security Considerations

### Access Control

- Users can only view their own requests (unless manager/admin)
- Approval permissions validated
- Cannot approve own requests
- Department-level visibility

### Data Validation

- Date range validation
- Leave balance verification
- Duplicate request prevention
- Status transition validation

### Audit Trail

- All actions logged
- Timestamp tracking
- User attribution
- Status change history

## Performance Notes

### Optimization Tips

- Cache user permissions
- Index on userId and status
- Implement pagination
- Optimize approval queries

### Caching Strategy

- Request list caching (1-minute TTL)
- User request caching
- Approval workflow caching

## Troubleshooting

### Common Issues

1. **Request Creation Fails**: Check date validity, leave balance
2. **Cannot Approve**: Verify approval permissions, check stage
3. **Request Not Visible**: Check user permissions, department access
4. **Status Not Updating**: Verify workflow configuration

### Debug Steps

1. Check application logs for errors
2. Verify user permissions in database
3. Test with valid date ranges
4. Check approval workflow configuration
5. Validate request status transitions
