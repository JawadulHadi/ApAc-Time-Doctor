# Request Module API Documentation

## Overview

  The Request Module provides comprehensive API endpoints for managing employee requests including leave applications, work-from-home requests, and other approval-based workflows. The module supports multi-stage approval processes, real-time status tracking, and detailed audit trails.

## Base URL

  ```http
  http://localhost:3200/requests
  ```

## Authentication

  All endpoints require JWT authentication. Include the token in the Authorization header:

  ```http
  Authorization: Bearer <jwt-token>
  ```

## Endpoints

### 1. Create Request

  **Endpoint:** `POST /requests`

  **Description:** Creates a new request for the authenticated user.

  **Request Body:**

  ```json
  {
    "requestType": "WORK_FROM_HOME",
    "requestedDates": ["2024-02-01", "2024-02-02", "2024-02-03"],
    "reason": "Personal work from home for better focus"
  }
  ```

  **Response:**

  ```json
  {
    "success": true,
    "data": {
      "request": {
        "_id": "507f1f77bcf86cd799439011",
        "user": {
          "_id": "507f1f77bcf86cd799439012",
          "email": "user@mailinator.com",
          "fullName": "John Doe",
          "role": "MEMBER",
          "profile": {
            "fullName": "John Doe",
            "designation": "Software Engineer"
          }
        },
        "requestType": "WORK_FROM_HOME",
        "requestedDates": ["2024-02-01", "2024-02-02", "2024-02-03"],
        "days": 3,
        "reason": "Personal work from home for better focus",
        "status": "PENDING",
        "currentStage": "TEAM_LEAD",
        "teamLeadData": {
          "fullName": "Team Lead",
          "email": "lead@mailinator.com",
          "userId": "507f1f77bcf86cd799439013",
          "role": "TEAM_LEAD"
        },
        "remarks": [],
        "createdBy": "507f1f77bcf86cd799439012",
        "updatedBy": "507f1f77bcf86cd799439012",
        "createdAt": "2024-01-15T10:00:00.000Z",
        "updatedAt": "2024-01-15T10:00:00.000Z"
      }
    },
    "message": "Shared Successfully",
    "statusCode": 201
  }
  ```

  **Validation Rules:**

- `requestType`: Must be a valid RequestType enum value
- `requestedDates`: Array of dates in YYYY-MM-DD format (min 1, max 30 dates)
- `reason`: Optional string (min 3, max 500 characters)
- Dates cannot be in the past (except medical emergencies)
- Maximum days per request type apply (CASUAL/SICK: 8, ANNUAL: 30, MATERNITY: 180, etc.)

  **Error Responses:**

  ```json
  {
    "success": false,
    "message": "Cannot request dates in the past",
    "statusCode": 400
  }
  ```

  ---

### 2. Get All Requests

  **Endpoint:** `GET /requests/all`

  **Description:** Retrieves all requests with filtering and pagination options.

  **Query Parameters:**

- `status` (optional): Filter by request status
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 100)

  **Example Request:**

  ```http
  GET /requests/all?status=PENDING&page=1&limit=10
  ```

  **Response:**

  ```json
  {
    "success": true,
    "data": {
      "requests": [
        {
          "_id": "507f1f77bcf86cd799439011",
          "user": {
            "_id": "507f1f77bcf86cd799439012",
            "email": "user@mailinator.com",
            "fullName": "John Doe",
            "role": "MEMBER"
          },
          "requestType": "WORK_FROM_HOME",
          "status": "PENDING",
          "currentStage": "TEAM_LEAD",
          "requestedDates": ["2024-02-01", "2024-02-02"],
          "days": 2,
          "reason": "Remote work",
          "createdAt": "2024-01-15T10:00:00.000Z"
        }
      ],
      "myRequests": [],
      "total": 1,
      "page": 1,
      "limit": 10,
      "totalPages": 1
    },
    "message": "Requests retrieved successfully"
  }
  ```

  **Permission Rules:**

- Members can only see their own requests
- Team Leads can see requests from their team members
- COO can see requests from Team Leads and Reporting Line users
- HR/Admin/Super Admin can see all requests

  ---

### 3. Get Request by ID

  **Endpoint:** `GET /requests/:id`

  **Description:** Retrieves a specific request by ID with full details.

  **Path Parameters:**

- `id`: Request ID (MongoDB ObjectId)

  **Response:**

  ```json
  {
    "success": true,
    "data": {
      "request": {
        "_id": "507f1f77bcf86cd799439011",
        "user": {
          "_id": "507f1f77bcf86cd799439012",
          "email": "user@mailinator.com",
          "fullName": "John Doe",
          "role": "MEMBER",
          "profile": {
            "fullName": "John Doe",
            "designation": "Software Engineer",
            "department": "Engineering"
          }
        },
        "requestType": "WORK_FROM_HOME",
        "requestedDates": ["2024-02-01", "2024-02-02"],
        "days": 2,
        "reason": "Remote work for better focus",
        "status": "PENDING",
        "currentStage": "TEAM_LEAD",
        "teamLeadData": {
          "fullName": "Team Lead",
          "email": "lead@mailinator.com",
          "userId": "507f1f77bcf86cd799439013"
        },
        "remarks": [
          {
            "by": {
              "_id": "507f1f77bcf86cd799439013",
              "email": "lead@mailinator.com",
              "fullName": "Team Lead",
              "role": "TEAM_LEAD"
            },
            "role": "TEAM_LEAD",
            "remark": "Please provide more details about your work setup",
            "date": "2024-01-16T09:00:00.000Z"
          }
        ],
        "createdAt": "2024-01-15T10:00:00.000Z",
        "updatedAt": "2024-01-16T09:00:00.000Z"
      }
    },
    "message": "request and user details retrieved successfully"
  }
  ```

  ---

### 4. Get User Requests

  **Endpoint:** `GET /requests/my/request`

  **Description:** Retrieves all requests for the currently authenticated user.

  **Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 100)

  **Response:**

  ```json
  {
    "success": true,
    "data": {
      "requests": [],
      "myRequests": [
        {
          "_id": "507f1f77bcf86cd799439011",
          "requestType": "WORK_FROM_HOME",
          "status": "PENDING",
          "requestedDates": ["2024-02-01", "2024-02-02"],
          "days": 2,
          "reason": "Remote work",
          "createdAt": "2024-01-15T10:00:00.000Z"
        }
      ],
      "total": 1,
      "page": 1,
      "limit": 10,
      "totalPages": 1
    },
    "message": "Found 1 request(s) for the user"
  }
  ```

  ---

### 5. Add Remarks

  **Endpoint:** `PUT /requests/:id/remarks`

  **Description:** Adds remarks/comments to a specific request.

  **Path Parameters:**

- `id`: Request ID (MongoDB ObjectId)

  **Request Body:**

  ```json
  {
    "remark": "This request looks good. Please ensure you have proper internet connectivity."
  }
  ```

  **Response:**

  ```json
  {
    "success": true,
    "data": {
      "request": {
        "_id": "507f1f77bcf86cd799439011",
        "status": "IN_PROCESS",
        "currentStage": "HR",
        "remarks": [
          {
            "by": {
              "_id": "507f1f77bcf86cd799439013",
              "email": "lead@mailinator.com",
              "fullName": "Team Lead",
              "role": "TEAM_LEAD"
            },
            "role": "TEAM_LEAD",
            "remark": "This request looks good. Please ensure you have proper internet connectivity.",
            "date": "2024-01-16T09:00:00.000Z"
          }
        ],
        "updatedAt": "2024-01-16T09:00:00.000Z"
      }
    },
    "message": "Remarks added successfully"
  }
  ```

  **Validation Rules:**

- `remark`: Required string (min 1, max 1000 characters)
- XSS protection applied to prevent malicious content
- Automatic whitespace trimming

  ---

### 6. Process Request (Approve/Reject)

  **Endpoint:** `PUT /requests/:id/action`

  **Description:** Approves or rejects a request based on current approval stage.

  **Path Parameters:**

- `id`: Request ID (MongoDB ObjectId)

  **Request Body (Approve):**

  ```json
  {
    "action": "APPROVED",
    "remarks": "Request approved. Enjoy your remote work days!"
  }
  ```

  **Request Body (Reject):**

  ```json
  {
    "action": "DISAPPROVED",
    "remarks": "Request rejected due to critical on-site requirements."
  }
  ```

  **Response (Approve):**

  ```json
  {
    "success": true,
    "data": {
      "request": {
        "_id": "507f1f77bcf86cd799439011",
        "status": "APPROVED",
        "currentStage": "COMPLETED",
        "approvedBy": "507f1f77bcf86cd799439013",
        "approvedAt": "2024-01-16T10:00:00.000Z",
        "remarks": [
          {
            "by": {
              "_id": "507f1f77bcf86cd799439013",
              "email": "lead@mailinator.com",
              "fullName": "Team Lead",
              "role": "TEAM_LEAD"
            },
            "role": "TEAM_LEAD",
            "remark": "Request approved. Enjoy your remote work days!",
            "date": "2024-01-16T10:00:00.000Z"
          }
        ]
      }
    },
    "message": "Approved successfully"
  }
  ```

  **Approval Workflow:**

  1. **TEAM_LEAD Stage**: Team Lead or Reporting Line users can approve
  2. **COO Stage**: COO, HR, Admin, or Super Admin can approve
  3. **SUPER_ADMIN Stage**: Super Admin or Admin can approve
  4. **HR Stage**: HR users can give final approval

  **Permission Rules:**

- Users cannot approve their own requests
- Only users with appropriate role for current stage can approve
- Status transitions are validated

  ---

### 7. Withdraw Request

  **Endpoint:** `PUT /requests/:id/withdraw`

  **Description:** Withdraws a pending request by the request owner.

  **Path Parameters:**

- `id`: Request ID (MongoDB ObjectId)

  **Response:**

  ```json
  {
    "success": true,
    "data": {
      "request": {
        "_id": "507f1f77bcf86cd799439011",
        "status": "WITHDRAWN",
        "currentStage": "COMPLETED",
        "updatedAt": "2024-01-16T11:00:00.000Z"
      }
    },
    "message": "Withdrawn successfully"
  }
  ```

  **Validation Rules:**

- Only request owner can withdraw their request
- Can only withdraw PENDING or IN_PROCESS requests
- Cannot withdraw APPROVED, DISAPPROVED, or COMPLETED requests

  ---

## Data Models

### RequestType Enum

  ```typescript
  enum RequestType {
    CASUAL_LEAVE = 'CASUAL_LEAVE',
    SICK_LEAVE = 'SICK_LEAVE',
    ANNUAL_LEAVE = 'ANNUAL_LEAVE',
    WORK_FROM_HOME = 'WORK_FROM_HOME',
    MATERNITY_LEAVE = 'MATERNITY_LEAVE',
    MARRIAGE_LEAVE = 'MARRIAGE_LEAVE',
    CHILD_DELIVERY = 'CHILD_DELIVERY',
    MEDICAL_EMERGENCY = 'MEDICAL_EMERGENCY',
    COMPENSATORY_LEAVE = 'COMPENSATORY_LEAVE',
    LATE_ARRIVAL = 'LATE_ARRIVAL',
    HALF_DAY = 'HALF_DAY',
    TRAINING = 'TRAINING'
  }
  ```

### RequestStatus Enum

  ```typescript
  enum RequestStatus {
    PENDING = 'PENDING',
    IN_PROCESS = 'IN_PROCESS',
    APPROVED = 'APPROVED',
    DISAPPROVED = 'DISAPPROVED',
    WITHDRAWN = 'WITHDRAWN',
    REJECTED = 'REJECTED',
    COMPLETED = 'COMPLETED'
  }
  ```

### RequestStage Enum

  ```typescript
  enum RequestStage {
    TEAM_LEAD = 'TEAM_LEAD',
    COO = 'COO',
    SUPER_ADMIN = 'SUPER_ADMIN',
    HR = 'HR',
    COMPLETED = 'COMPLETED'
  }
  ```

### ActionType Enum

  ```typescript
  enum ActionType {
    APPROVED = 'APPROVED',
    DISAPPROVED = 'DISAPPROVED'
  }
  ```

## Error Handling

### Common Error Responses

#### 400 Bad Request

  ```json
  {
    "success": false,
    "message": "Invalid date format",
    "statusCode": 400
  }
  ```

#### 401 Unauthorized

  ```json
  {
    "success": false,
    "message": "Unauthorized access",
    "statusCode": 401
  }
  ```

#### 403 Forbidden

  ```json
  {
    "success": false,
    "message": "Cannot approve your own request",
    "statusCode": 403
  }
  ```

#### 404 Not Found

  ```json
  {
    "success": false,
    "message": "Request not found",
    "statusCode": 404
  }
  ```

#### 500 Internal Server Error

  ```json
  {
    "success": false,
    "message": "Internal server error",
    "statusCode": 500
  }
  ```

### Validation Error Messages

- **Date Validation:**
  - "At least one date must be selected"
  - "Cannot request dates in the past"
  - "Cannot request dates more than 6 months in advance"
  - "Cannot request more than X days for REQUEST_TYPE"

- **Request Validation:**
  - "Invalid request ID format"
  - "Request not found"
  - "Cannot process a completed request"

- **Permission Validation:**
  - "Only ROLE can approve at STAGE stage"
  - "Cannot approve your own request"
  - "You can only withdraw your own requests"

## Rate Limiting

- **Request Creation**: 10 requests per hour per user
- **Remarks Addition**: 50 remarks per hour per user
- **Request Processing**: 100 actions per hour per user

## Pagination

  For endpoints supporting pagination:

- **Default page**: 1
- **Default limit**: 10
- **Maximum limit**: 100
- **Response includes**: `total`, `page`, `limit`, `totalPages`

## Search and Filtering

### Status Filtering

  ```markdown
  GET /requests/all?status=PENDING
  GET /requests/all?status=APPROVED
  GET /requests/all?status=DISAPPROVED
  ```

### Date Range Filtering (Future Enhancement)

  ```markdown
  GET /requests/all?startDate=2024-01-01&endDate=2024-01-31
  ```

### User Filtering (Future Enhancement)

  ```markdown
  GET /requests/all?userId=507f1f77bcf86cd799439012
  ```

## Webhooks

### Request Status Changes

  Configure webhooks to receive notifications when request status changes:

  ```json
  {
    "event": "request.status.changed",
    "data": {
      "requestId": "507f1f77bcf86cd799439011",
      "oldStatus": "PENDING",
      "newStatus": "APPROVED",
      "userId": "507f1f77bcf86cd799439012",
      "timestamp": "2024-01-16T10:00:00.000Z"
    }
  }
  ```

## SDK Examples

### JavaScript/TypeScript

  ```typescript
  import axios from 'axios';

  class RequestAPI {
    private baseURL = 'http://localhost:3200/requests';
    private token: string;

    constructor(token: string) {
      this.token = token;
    }

    private async request(method: string, endpoint: string, data?: any) {
      const config = {
        method,
        url: `${this.baseURL}${endpoint}`,
        headers: {
          Authorization: `Bearer ${this.token}`,
          'Content-Type': 'application/json',
        },
        data,
      };

      return axios(config);
    }

    async createRequest(requestData: CreateRequestDto) {
      return this.request('POST', '', requestData);
    }

    async getMyRequests(page = 1, limit = 10) {
      return this.request('GET', `/my/request?page=${page}&limit=${limit}`);
    }

    async approveRequest(requestId: string, remarks?: string) {
      return this.request('PUT', `/${requestId}/action`, {
        action: 'APPROVED',
        remarks,
      });
    }

    async addRemarks(requestId: string, remark: string) {
      return this.request('PUT', `/${requestId}/remarks`, { remark });
    }
  }

  // Usage
  const api = new RequestAPI('your-jwt-token');
  const requests = await api.getMyRequests();
  ```

### Python

  ```python
  import requests

  class RequestAPI:
      def __init__(self, token):
          self.base_url = 'http://localhost:3200/requests'
          self.headers = {
              'Authorization': f'Bearer {token}',
              'Content-Type': 'application/json'
          }

      def create_request(self, request_data):
          response = requests.post(
              self.base_url,
              json=request_data,
              headers=self.headers
          )
          return response.json()

      def get_my_requests(self, page=1, limit=10):
          response = requests.get(
              f'{self.base_url}/my/request',
              params={'page': page, 'limit': limit},
              headers=self.headers
          )
          return response.json()

      def approve_request(self, request_id, remarks=None):
          response = requests.put(
              f'{self.base_url}/{request_id}/action',
              json={'action': 'APPROVED', 'remarks': remarks},
              headers=self.headers
          )
          return response.json()

  # Usage
  api = RequestAPI('your-jwt-token')
  requests = api.get_my_requests()
  ```

## Testing

### Unit Tests

  Run unit tests for the request module:

  ```bash
  npm test -- src/modules/request
  ```

### Integration Tests

  Run integration tests:

  ```bash
  npm test:e2e -- src/modules/request
  ```

### Test Coverage

  Target coverage: 90%+ for all request module files.

  ```bash
  npm run test:cov -- src/modules/request
  ```

## Performance

### Response Times

- **Create Request**: < 500ms
- **Get Requests**: < 300ms
- **Add Remarks**: < 200ms
- **Process Request**: < 400ms

### Database Indexes

  Recommended indexes for optimal performance:

  ```javascript
  // Requests collection
  db.requests.createIndex({ "user": 1, "status": 1 })
  db.requests.createIndex({ "status": 1, "currentStage": 1 })
  db.requests.createIndex({ "requestedDates": 1 })
  db.requests.createIndex({ "createdAt": -1 })
  db.requests.createIndex({ "teamLeadData.userId": 1 })
  ```

## Security

### Input Validation

- All inputs are validated using class-validator
- XSS protection for user-generated content
- SQL injection prevention through ORM
- Rate limiting on all endpoints

### Authentication & Authorization

- JWT token validation
- Role-based access control
- Request ownership verification
- Approval stage permissions

### Data Protection

- Sensitive data encryption at rest
- Audit logging for all actions
- Data retention policies
- GDPR compliance considerations

## Monitoring

### Key Metrics

- Request creation rate
- Approval processing time
- Error rates by endpoint
- User activity patterns

### Health Checks

  ```bash
  GET /health/requests
  ```

  Returns service health status and database connectivity.

## Support

  For API support and questions:

- **Documentation**: [API Docs](./README.md)
- **Issues**: Create a ticket in the project repository
- **Contact**: <api-support@company.com>

  ---

  **Last Updated**: February 4, 2026
  **Version**: 2.0.0
  **API Version**: v1
