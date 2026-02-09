# Department Module Guide

## Module Overview

The Department Module manages organizational departments, roles, and designations within the APAC Management System. It provides department hierarchy management and metadata for organizational structure.

### Core Purpose

- Department creation and management
- Role and designation tracking
- Organizational structure maintenance
- Department metadata retrieval
- Department-based filtering and organization

### Key Capabilities

- Create and update departments
- Retrieve department information
- Manage roles and designations
- Filter system departments
- Department hierarchy management

## API Endpoints

### Authentication Required

All endpoints require JWT authentication.

| Method | Endpoint              | Description                    | Required Permission      |
| ------ | --------------------- | ------------------------------ | ------------------------ |
| `GET`  | `/departments`        | Get all departments with roles | Authenticated            |
| `GET`  | `/departments/:id`    | Get department by ID           | Authenticated            |
| `POST` | `/departments/create` | Create new department          | `CAN_MANAGE_DEPARTMENTS` |
| `PUT`  | `/departments/:id`    | Update department              | `CAN_MANAGE_DEPARTMENTS` |

## Data Transfer Objects (DTOs)

### CreateDepartmentDto

Used for creating new departments.

```typescript
{
  name: string;              // Required: Department name
  description?: string;      // Optional: Department description
  headOfDepartment?: string; // Optional: Department head user ID
  parentDepartment?: string; // Optional: Parent department ID
  isActive?: boolean;        // Optional: Active status (default: true)
}
```

**Validation Rules:**

- `name`: Required, unique, non-empty string
- `description`: Optional string
- `headOfDepartment`: Optional MongoDB ObjectId
- `parentDepartment`: Optional MongoDB ObjectId for hierarchy
- `isActive`: Boolean value

### UpdateDepartmentDto

Used for updating existing departments.

```typescript
{
  name?: string;
  description?: string;
  headOfDepartment?: string;
  parentDepartment?: string;
  isActive?: boolean;
}
```

## Key Workflows

### Department Creation

1. **Permission Check**: Verify `CAN_MANAGE_DEPARTMENTS` permission
2. **Validation**: Check department name uniqueness
3. **Department Creation**: Create department record
4. **Hierarchy Setup**: Link to parent department if specified
5. **Response**: Return created department

### Department Retrieval

1. **Authentication**: Verify JWT token
2. **System Filter**: Exclude system departments (SuperAdmin, Admin, HR, IT, LD)
3. **Metadata Fetch**: Retrieve departments with roles
4. **Response**: Return filtered departments and roles

### Department Update

1. **Permission Verification**: Check `CAN_MANAGE_DEPARTMENTS` permission
2. **Department Lookup**: Find department by ID
3. **Validation**: Validate update data
4. **Update**: Apply changes to department
5. **Response**: Return updated department

## Integration Points

### User Module

- Department assignment to users
- Head of department management
- User filtering by department
- Permission-based access

### Profile Module

- Department association in profiles
- Organizational hierarchy
- Department-based reporting

### Leave Bank Module

- Department-based leave tracking
- Department filtering
- Leave analytics by department

### Request Module

- Department-based request routing
- Approval workflow by department
- Department visibility rules

## Usage Examples

### Get All Departments

```bash
curl -X GET http://localhost:3400/departments \
  -H "Authorization: Bearer <jwt-token>"
```

**Response:**

```json
{
  "success": true,
  "data": {
    "departments": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "name": "Engineering",
        "description": "Software development team",
        "isActive": true
      }
    ],
    "roles": ["DEVELOPER", "MANAGER", "LEAD"]
  },
  "message": "All Active Department, and User Roles Retrieved Successfully"
}
```

### Get Department by ID

```bash
curl -X GET http://localhost:3400/departments/507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer <jwt-token>"
```

### Create Department

```bash
curl -X POST http://localhost:3400/departments/create \
  -H "Authorization: Bearer <jwt-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Marketing",
    "description": "Marketing and communications team",
    "isActive": true
  }'
```

### Update Department

```bash
curl -X PUT http://localhost:3400/departments/507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer <jwt-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Updated description",
    "headOfDepartment": "507f1f77bcf86cd799439012"
  }'
```

## Common Scenarios

### Scenario 1: Creating New Department

```typescript
// Admin creates new department
const response = await fetch('/departments/create', {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${adminToken}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: 'Data Science',
    description: 'Data analytics and machine learning team',
    isActive: true,
  }),
});

const { data } = await response.json();
// New department created
```

### Scenario 2: Retrieving Department List

```typescript
// Get all active departments
const response = await fetch('/departments', {
  headers: { Authorization: `Bearer ${token}` },
});

const { data } = await response.json();
// Returns departments (excluding system departments) and roles
```

### Scenario 3: Updating Department

```typescript
// Update department information
const response = await fetch(`/departments/${departmentId}`, {
  method: 'PUT',
  headers: {
    Authorization: `Bearer ${adminToken}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    headOfDepartment: newHeadId,
    description: 'Updated team description',
  }),
});
```

## Configuration Requirements

### Environment Variables

```env
SYSTEM_DEPARTMENTS=SuperAdmin,Admin,HR,IT,LD
```

### System Departments

The following departments are system-managed and filtered from public lists:

- `SuperAdmin`: System administrators
- `Admin`: General administrators
- `HR`: Human resources
- `IT`: Information technology
- `LD`: Learning and development

### Department Hierarchy

Departments can have parent-child relationships:

- Parent departments can contain sub-departments
- Hierarchical reporting structure
- Cascading permissions

## Error Handling

### Common Error Responses

- `400`: Validation errors, duplicate department name
- `401`: Unauthorized, invalid token
- `403`: Insufficient permissions
- `404`: Department not found
- `500`: Internal server error

### Error Response Format

```json
{
  "success": false,
  "message": "Department with this name already exists",
  "statusCode": 400
}
```

## Security Considerations

### Access Control

- Permission-based department management
- System department protection
- Hierarchy-based access control
- Audit trail for changes

### Data Validation

- Department name uniqueness
- Valid ObjectId references
- Hierarchy cycle prevention
- Active status validation

## Performance Notes

### Optimization Tips

- Cache department lists
- Index on department name
- Optimize hierarchy queries
- Implement department caching

### Caching Strategy

- Department list caching (10-minute TTL)
- Role list caching
- Hierarchy caching
- Metadata caching

## Troubleshooting

### Common Issues

1. **Department Creation Fails**: Check name uniqueness, permissions
2. **Department Not Found**: Verify department ID, check if system department
3. **Update Fails**: Validate permissions, check data format
4. **Hierarchy Issues**: Verify parent department exists, check for cycles

### Debug Steps

1. Check application logs for errors
2. Verify user permissions
3. Test with valid department data
4. Check database for existing departments
5. Validate hierarchy relationships
