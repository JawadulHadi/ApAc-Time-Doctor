# Leave Bank Module - Comprehensive Review

## Module Overview
The Leave Bank module manages employee leave balances, leave requests, and leave calculations in the APAC Management System.

## Core Components

### 1. LeaveBankService (`src/modules/leave-bank/leave-bank.service.ts`)

#### Key Methods:

**Leave Balance Management:**
- `getLeaveBank(userId: Types.ObjectId): Promise<ILeaveBankRecord>`
- `updateLeaveBank(userId: Types.ObjectId, updateData: any): Promise<ILeaveBankRecord>`
- `calculateLeaveBalance(userId: Types.ObjectId): Promise<ISummaryData>`

**Leave Request Processing:**
- `processLeaveRequest(requestData: any): Promise<void>`
- `approveLeaveRequest(requestId: string, approverId: Types.ObjectId): Promise<void>`
- `rejectLeaveRequest(requestId: string, reason: string): Promise<void>`

**Reporting and Analytics:**
- `getLeaveSummary(filter: ILeaveBankFilter): Promise<ISummaryData>`
- `getMonthlyBankData(year: number): Promise<IMonthlyBank[]>`
- `exportLeaveData(filter: ILeaveBankFilter): Promise<any>`

#### Dependencies:
- `UserService` (resolved via ModuleRef)
- `LeaveBankRepository`
- `BankCalculator`, `BankHelper`, `BankTransformer`
- `LeaveBankActionHelper`

#### Implementation Flow:
1. **Leave Balance Calculation**:
   - Fetches user's leave records
   - Calculates accrued leave based on tenure
   - Deducts used leave
   - Updates monthly bank data

2. **Leave Request Processing**:
   - Validates leave availability
   - Checks overlapping requests
   - Processes approval workflow
   - Updates leave balances

#### Issues Found:
- **CRITICAL**: Race condition in leave balance updates
- **HIGH**: Missing transaction support for leave operations
- **MEDIUM**: No audit trail for leave changes
- **LOW**: Inconsistent error handling

### 2. LeaveBankController (`src/modules/leave-bank/leave-bank.controller.ts`)

#### Endpoints:
- `GET /leave-bank` - Get current user leave balance
- `GET /leave-bank/summary` - Get leave summary
- `POST /leave-bank/request` - Submit leave request
- `PUT /leave-bank/request/:id/approve` - Approve leave request
- `PUT /leave-bank/request/:id/reject` - Reject leave request
- `GET /leave-bank/monthly/:year` - Get monthly data
- `GET /leave-bank/export` - Export leave data

#### Issues Found:
- Missing rate limiting on leave requests
- No proper validation for leave dates
- Improper HTTP status codes

### 3. LeaveBankRepository (`src/modules/leave-bank/leave-bank.repository.ts`)

#### Key Methods:
- `create(leaveBankData: Partial<ILeaveBankRecord>): Promise<ILeaveBankRecord>`
- `findByUserId(userId: Types.ObjectId): Promise<ILeaveBankRecord | null>`
- `updateByUserId(userId: Types.ObjectId, updateData: any): Promise<ILeaveBankRecord>`
- `findWithFilter(filter: ILeaveBankFilter): Promise<ILeaveBankRecord[]>`

#### Issues Found:
- Missing database indexes for performance
- No query optimization for large datasets
- Missing soft delete functionality

## Unit Testing Status

### Existing Tests:
- ✅ `leave-bank.controller.spec.ts` - Controller tests exist

### Missing Tests:
- ❌ `leave-bank.service.spec.ts` - **MISSING** - Critical service layer not tested
- ❌ `leave-bank.repository.spec.ts` - Repository tests missing
- ❌ Integration tests for leave workflows

### Required Unit Tests for LeaveBankService:

```typescript
describe('LeaveBankService', () => {
  describe('calculateLeaveBalance', () => {
    it('should calculate correct leave balance for active employee')
    it('should handle prorated leave for new employees')
    it('should account for carry-over leave')
    it('should handle leave accrual caps')
    it('should calculate monthly accrual correctly')
  })

  describe('processLeaveRequest', () => {
    it('should approve valid leave request')
    it('should reject insufficient balance requests')
    it('should detect overlapping leave dates')
    it('should handle business day calculations')
    it('should update leave balance correctly')
  })

  describe('approveLeaveRequest', () => {
    it('should approve request with valid approver')
    it('should handle unauthorized approvers')
    it('should send approval notifications')
    it('should update leave balance atomically')
    it('should handle approval failures gracefully')
  })

  describe('getLeaveSummary', () => {
    it('should return accurate summary data')
    it('should filter by date range correctly')
    it('should calculate totals correctly')
    it('should handle empty datasets')
  })
})
```

## Security Issues:

### Critical:
1. **Race Condition**: Multiple leave requests can exceed balance
2. **Unauthorized Access**: Missing role-based access control
3. **Data Integrity**: No transaction support for complex operations

### High:
1. **Leave Fraud**: No validation for leave request authenticity
2. **Privilege Escalation**: Missing approver authorization checks
3. **Data Exposure**: Leave data accessible without proper permissions

### Medium:
1. **Audit Trail**: No logging of leave changes
2. **Business Logic**: No validation for business rules

## Performance Issues:

1. **Concurrent Updates**: Leave balance updates not atomic
2. **Missing Indexes**: Database queries slow on large datasets
3. **N+1 Queries**: Leave summary queries not optimized
4. **No Caching**: Frequently accessed leave data not cached

## Business Logic Issues:

1. **Leave Accrual**: Complex tenure-based calculations not properly tested
2. **Carry-over Logic**: Leave carry-over rules not clearly defined
3. **Business Days**: Holiday and weekend calculations inconsistent
4. **Leave Types**: Different leave types not properly differentiated

## Recommendations

### High Priority:
1. **Implement transaction support** for leave operations
2. **Add comprehensive unit tests** for LeaveBankService
3. **Implement proper authorization** for all leave operations
4. **Add audit logging** for all leave changes
5. **Fix race conditions** in leave balance updates

### Medium Priority:
1. **Add caching layer** for leave balance data
2. **Implement business day calculations** with holidays
3. **Add leave type management** system
4. **Optimize database queries** with proper indexes

### Low Priority:
1. **Add leave analytics** and reporting
2. **Implement leave forecasting** features
3. **Add bulk operations** for admin tasks
4. **Implement leave calendar** integration

## Security Improvements:

### Transaction Support:
```typescript
async processLeaveRequest(requestData: LeaveRequestDto): Promise<void> {
  const session = await this.leaveBankRepository.startSession();
  
  try {
    await session.withTransaction(async () => {
      // Check leave balance
      const currentBalance = await this.getLeaveBalance(requestData.userId, session);
      
      // Validate sufficient balance
      if (currentBalance.available < requestData.days) {
        throw new ConflictException('Insufficient leave balance');
      }
      
      // Process request
      await this.createLeaveRequest(requestData, session);
      await this.updateLeaveBalance(requestData.userId, -requestData.days, session);
    });
  } finally {
    await session.endSession();
  }
}
```

### Authorization:
```typescript
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Permission('leave:approve')
async approveLeaveRequest(
  @Param('id') requestId: string,
  @Body() approvalDto: ApprovalDto,
  @CurrentUser() user: UserPayload,
) {
  // Validate approver permissions
  if (!this.canApproveLeave(user, requestId)) {
    throw new ForbiddenException('Insufficient permissions');
  }
  
  return this.leaveBankService.approveLeaveRequest(requestId, user._id);
}
```

### Rate Limiting:
```typescript
@Throttle(5, 60) // 5 requests per minute
@Post('/request')
async submitLeaveRequest(@Body() requestData: LeaveRequestDto) {
  return this.leaveBankService.processLeaveRequest(requestData);
}
```

## Performance Optimizations:

### Database Indexes:
```typescript
// LeaveBank schema indexes
@Index({ userId: 1, year: 1, month: 1 }) // Composite index for user queries
@Index({ userId: 1, 'leaveRequests.status': 1 }) // Index for pending requests
@Index({ 'leaveRequests.startDate': 1, 'leaveRequests.endDate': 1 }) // Index for date queries
```

### Caching Strategy:
```typescript
@Cacheable(ttl: 300) // 5 minutes cache
async getLeaveBank(userId: Types.ObjectId): Promise<ILeaveBankRecord> {
  return this.leaveBankRepository.findByUserId(userId);
}

@CacheInvalidate(pattern = 'leave-bank:*')
async updateLeaveBank(userId: Types.ObjectId, updateData: any): Promise<ILeaveBankRecord> {
  return this.leaveBankRepository.updateByUserId(userId, updateData);
}
```

### Query Optimization:
```typescript
async getLeaveSummary(filter: ILeaveBankFilter) {
  return this.leaveBankModel
    .aggregate([
      { $match: this.buildFilterQuery(filter) },
      {
        $group: {
          _id: '$userId',
          totalBalance: { $sum: '$balance' },
          usedLeave: { $sum: '$used' },
          availableLeave: { $subtract: ['$balance', '$used'] }
        }
      },
      { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'user' } }
    ])
    .exec();
}
```

## Business Logic Improvements:

### Leave Accrual Calculator:
```typescript
class LeaveAccrualCalculator {
  calculateAccrual(employee: Employee, period: DateRange): number {
    const tenureMonths = this.calculateTenure(employee.hireDate, period.end);
    const accrualRate = this.getAccrualRate(tenureMonths, employee.role);
    const periodDays = this.getBusinessDays(period.start, period.end);
    
    return (accrualRate / 365) * periodDays;
  }
  
  private getAccrualRate(tenureMonths: number, role: string): number {
    // Role and tenure-based accrual rates
    if (tenureMonths < 12) return this.baseAccrualRate;
    if (tenureMonths < 60) return this.baseAccrualRate * 1.2;
    return this.baseAccrualRate * 1.5;
  }
}
```

### Business Day Calculator:
```typescript
class BusinessDayCalculator {
  calculateBusinessDays(startDate: Date, endDate: Date, holidays: Date[] = []): number {
    let businessDays = 0;
    const current = new Date(startDate);
    
    while (current <= endDate) {
      if (this.isBusinessDay(current, holidays)) {
        businessDays++;
      }
      current.setDate(current.getDate() + 1);
    }
    
    return businessDays;
  }
  
  private isBusinessDay(date: Date, holidays: Date[]): boolean {
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const isHoliday = holidays.some(holiday => 
      holiday.toDateString() === date.toDateString()
    );
    
    return !isWeekend && !isHoliday;
  }
}
```

## Integration Points:
- UserService for user validation
- Email service for leave notifications
- Holiday calendar service for business day calculations
- MongoDB for data persistence
- Cache service for performance optimization
