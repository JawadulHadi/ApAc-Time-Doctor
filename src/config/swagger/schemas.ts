/**
 * Swagger/OpenAPI schema definitions for APAC Management System
 *
 * This file contains all the reusable schema definitions used in Swagger documentation.
 * Extracted from main.ts to improve maintainability and reduce code duplication.
 *
 * @author APAC Development Team
 * @version 1.0.0
 * @since 1.0.0
 */
// Define the schema object type inline to avoid import issues
type SchemaObject = {
  type?: string;
  properties?: Record<string, any>;
  required?: string[];
  items?: any;
  example?: any;
  format?: string;
  description?: string;
  scheme?: string;
  bearerFormat?: string;
  $ref?: string;
};
/**
 * JWT Bearer authentication scheme for Swagger
 */
export const JWT_SECURITY_SCHEME: SchemaObject = {
  type: 'http',
  scheme: 'bearer',
  bearerFormat: 'JWT',
  description: 'Enter JWT token obtained from login endpoint in format: Bearer <token>',
};
/**
 * Standard API response wrapper
 */
export const API_RESPONSE_SCHEMA: SchemaObject = {
  type: 'object',
  properties: {
    success: { type: 'boolean', example: true },
    message: { type: 'string', example: 'Operation successful' },
    data: { type: 'object' },
    statusCode: { type: 'number', example: 200 },
    timestamp: { type: 'string', format: 'date-time' },
  },
  required: ['success', 'message', 'statusCode', 'timestamp'],
};
/**
 * Login response schema
 */
export const LOGIN_RESPONSE_SCHEMA: SchemaObject = {
  type: 'object',
  properties: {
    success: { type: 'boolean', example: true },
    message: { type: 'string', example: 'Login successful' },
    data: {
      type: 'object',
      properties: {
        user: { $ref: '#/components/schemas/UserWithProfile' },
        token: { type: 'string', example: 'eyJhbGciOiJIUzI1Ni...' },
        refreshToken: { type: 'string', example: 'eyJhbGciOiJIUzI1Ni...' },
      },
      required: ['user', 'token', 'refreshToken'],
    },
  },
};
/**
 * User with profile schema
 */
export const USER_WITH_PROFILE_SCHEMA: SchemaObject = {
  type: 'object',
  properties: {
    _id: { type: 'string', example: '68fa610c3a50f116c7311d73' },
    fullName: { type: 'string', example: 'John Doe' },
    designation: { type: 'string', example: 'Software Engineer' },
    role: { type: 'string', example: 'MEMBER' },
    displayRole: { type: 'string', example: 'MEMBER' },
    email: { type: 'string', example: 'john@example.com' },
    status: { type: 'string', example: 'Active' },
    cell: { type: 'string', example: '+1-555-0123' },
    profile: { $ref: '#/components/schemas/UserProfile' },
    department: { $ref: '#/components/schemas/Department' },
    permissions: {
      type: 'array',
      items: { type: 'string' },
      example: ['can_submit_request', 'can_view_leave_bank'],
    },
    loginCount: { type: 'number', example: 15 },
  },
  required: ['_id', 'fullName', 'email', 'role', 'status'],
};
/**
 * User profile schema
 */
export const USER_PROFILE_SCHEMA: SchemaObject = {
  type: 'object',
  properties: {
    _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
    userId: { type: 'string', example: '507f1f77bcf86cd799439011' },
    employeeId: { type: 'string', example: 'EMP-12345' },
    fullName: { type: 'string', example: 'John Doe' },
    firstName: { type: 'string', example: 'John' },
    lastName: { type: 'string', example: 'Doe' },
    email: { type: 'string', example: 'john@example.com' },
    role: { type: 'string', example: 'MEMBER' },
    status: { type: 'string', example: 'Active' },
    contactNumber: { type: 'string', example: '+1-555-0123' },
    skills: { type: 'array', items: { type: 'string' }, example: ['JavaScript', 'Node.js'] },
    achievements: { type: 'array', items: { type: 'string' }, example: ['Employee of the Month'] },
  },
  required: ['_id', 'userId', 'fullName', 'email', 'role', 'status'],
};
/**
 * Department schema
 */
export const DEPARTMENT_SCHEMA: SchemaObject = {
  type: 'object',
  properties: {
    _id: { type: 'string', example: '68d087eb52b91a26b1bf858b' },
    name: { type: 'string', example: 'Engineering' },
    description: { type: 'string', example: 'Software development team' },
    isActive: { type: 'boolean', example: true },
    teamLead: { type: 'string', example: '68fa4a9b3a50f116c7311796' },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' },
  },
  required: ['_id', 'name', 'isActive'],
};
/**
 * Leave bank record schema
 */
export const LEAVE_BANK_RECORD_SCHEMA: SchemaObject = {
  type: 'object',
  properties: {
    _id: { type: 'string', example: '69089e95f4df6ff5595ee894' },
    year: { type: 'number', example: 2025 },
    department: { type: 'string', example: 'Engineering' },
    monthlyData: {
      type: 'object',
      properties: {
        january: { $ref: '#/components/schemas/MonthlyData' },
        february: { $ref: '#/components/schemas/MonthlyData' },
        march: { $ref: '#/components/schemas/MonthlyData' },
        april: { $ref: '#/components/schemas/MonthlyData' },
        may: { $ref: '#/components/schemas/MonthlyData' },
        june: { $ref: '#/components/schemas/MonthlyData' },
        july: { $ref: '#/components/schemas/MonthlyData' },
        august: { $ref: '#/components/schemas/MonthlyData' },
        september: { $ref: '#/components/schemas/MonthlyData' },
        october: { $ref: '#/components/schemas/MonthlyData' },
        november: { $ref: '#/components/schemas/MonthlyData' },
        december: { $ref: '#/components/schemas/MonthlyData' },
      },
    },
    summary: { $ref: '#/components/schemas/LeaveSummary' },
    user: { $ref: '#/components/schemas/UserWithProfile' },
  },
  required: ['_id', 'year', 'department'],
};
/**
 * Monthly data schema
 */
export const MONTHLY_DATA_SCHEMA: SchemaObject = {
  type: 'object',
  properties: {
    workingDays: { type: 'number', example: 22 },
    shortHours: { type: 'number', example: 0 },
    casualLeave: { type: 'number', example: 1 },
    sickLeave: { type: 'number', example: 0 },
    absent: { type: 'number', example: 0 },
    extraHours: { type: 'number', example: 2 },
    netHoursWorked: { type: 'number', example: 23 },
  },
  required: ['workingDays', 'casualLeave', 'sickLeave', 'absent', 'netHoursWorked'],
};
/**
 * Leave summary schema
 */
export const LEAVE_SUMMARY_SCHEMA: SchemaObject = {
  type: 'object',
  properties: {
    totalCL: { type: 'number', example: 9 },
    totalSL: { type: 'number', example: 8 },
    totalCLAvailed: { type: 'number', example: 2 },
    totalSLAvailed: { type: 'number', example: 1 },
    remainingCL: { type: 'number', example: 7 },
    remainingSL: { type: 'number', example: 7 },
  },
  required: [
    'totalCL',
    'totalSL',
    'totalCLAvailed',
    'totalSLAvailed',
    'remainingCL',
    'remainingSL',
  ],
};
/**
 * Complete schema definitions object
 */
export const SWAGGER_SCHEMAS: Record<string, SchemaObject> = {
  ApiResponse: API_RESPONSE_SCHEMA,
  LoginResponse: LOGIN_RESPONSE_SCHEMA,
  UserWithProfile: USER_WITH_PROFILE_SCHEMA,
  UserProfile: USER_PROFILE_SCHEMA,
  Department: DEPARTMENT_SCHEMA,
  LeaveBankRecord: LEAVE_BANK_RECORD_SCHEMA,
  MonthlyData: MONTHLY_DATA_SCHEMA,
  LeaveSummary: LEAVE_SUMMARY_SCHEMA,
};
