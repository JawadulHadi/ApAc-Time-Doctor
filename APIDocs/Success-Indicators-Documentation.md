# Success Indicators - Documentation & Use Cases

## 📋 Overview

The Success Indicators system allows users to manage quarterly goals with automatic parent-child duplication when indicators are moved between quarters.

## 🎯 Core Logic

**Simple Rule:**

- If `isMoved = false` → Add indicator as-is
- If `isMoved = true` → Create parent-child duplication

## 📊 Auto-Detection Logic

The system automatically detects target quarters:

| Source Quarter | Target Quarter                          | Behavior |
| -------------- | --------------------------------------- | -------- |
| Q1 → Q2        | Creates child in Q2                     |
| Q2 → Q3        | Creates child in Q3                     |
| Q3 → Q4        | Creates child in Q4                     |
| Q4 → Q4        | Creates child in same Q4 (last quarter) |

## 🎭 Use Cases

### Use Case 1: Add New Indicators

**Scenario:** Adding new goals for current quarter

**Payload:**

```json
{
  "successIndicators": [
    {
      "quarter": 1,
      "year": 2026,
      "isActive": true,
      "indicators": [
        {
          "key": 1,
          "id": 1,
          "content": "Complete Node.js microservices architecture",
          "status": "IN_PROGRESS",
          "isMoved": false,
          "isTransferred": false,
          "reason": "",
          "to": null,
          "from": null
        }
      ]
    }
  ]
}
```

**Expected Response:**

```json
{
  "quarter": 1,
  "indicators": [
    {
      "key": 1,
      "id": 1,
      "content": "Complete Node.js microservices architecture",
      "status": "In Progress",
      "isMoved": false,
      "isTransferred": false,
      "reason": "",
      "to": null,
      "from": null
    }
  ]
}
```

**Result:** ✅ No duplication, indicator added as-is

---

### Use Case 2: Move Indicators Between Quarters

**Scenario:** Moving an incomplete goal to next quarter

**Payload:**

```json
{
  "successIndicators": [
    {
      "quarter": 1,
      "year": 2026,
      "isActive": true,
      "indicators": [
        {
          "key": 1,
          "id": 1,
          "content": "Database migration from PostgreSQL to MongoDB",
          "status": "IN_PROGRESS",
          "isMoved": true,
          "isTransferred": false,
          "reason": "",
          "to": null,
          "from": null
        }
      ]
    }
  ]
}
```

**Expected Response:**

```json
{
  "successIndicators": [
    {
      "quarter": 1,
      "indicators": [
        {
          "key": 1,
          "id": 1,
          "content": "Database migration from PostgreSQL to MongoDB",
          "status": "In Progress",
          "isMoved": true,
          "isTransferred": true,
          "reason": "Moved To Q2",
          "to": 2,
          "from": 1
        }
      ]
    },
    {
      "quarter": 2,
      "indicators": [
        {
          "key": 2,
          "id": 1,
          "content": "Database migration from PostgreSQL to MongoDB",
          "status": "In Progress",
          "isMoved": false,
          "isTransferred": false,
          "reason": "Moved From Q1",
          "from": 1,
          "to": null
        }
      ]
    }
  ]
}
```

**Result:** ✅ Parent-child duplication created

---

### Use Case 3: Handle UNMET Status

**Scenario:** Carrying forward unfinished goals

**Payload:**

```json
{
  "successIndicators": [
    {
      "quarter": 1,
      "year": 2026,
      "isActive": true,
      "indicators": [
        {
          "key": 1,
          "id": 1,
          "content": "Machine learning model integration",
          "status": "UNMET",
          "isMoved": true,
          "isTransferred": false,
          "reason": "",
          "to": null,
          "from": null
        }
      ]
    }
  ]
}
```

**Expected Response:**

```json
{
  "successIndicators": [
    {
      "quarter": 1,
      "indicators": [
        {
          "key": 1,
          "id": 1,
          "content": "Machine learning model integration",
          "status": "Unmet",
          "isMoved": true,
          "isTransferred": true,
          "reason": "Moved To Q2",
          "to": 2,
          "from": 1
        }
      ]
    },
    {
      "quarter": 2,
      "indicators": [
        {
          "key": 2,
          "id": 1,
          "content": "Machine learning model integration",
          "status": "In Progress",
          "isMoved": false,
          "isTransferred": false,
          "reason": "Moved From Q1",
          "from": 1,
          "to": null
        }
      ]
    }
  ]
}
```

**Result:** ✅ UNMET status reset to IN_PROGRESS in child

---

### Use Case 4: Last Quarter Handling

**Scenario:** Moving goals in Q4 (last quarter)

**Payload:**

```json
{
  "successIndicators": [
    {
      "quarter": 4,
      "year": 2026,
      "isActive": true,
      "indicators": [
        {
          "key": 4,
          "id": 1,
          "content": "Stabilize platform and address tech debt",
          "status": "UNMET",
          "isMoved": true,
          "isTransferred": false,
          "reason": "",
          "to": null,
          "from": null
        }
      ]
    }
  ]
}
```

**Expected Response:**

```json
{
  "successIndicators": [
    {
      "quarter": 4,
      "indicators": [
        {
          "key": 4,
          "id": 1,
          "content": "Stabilize platform and address tech debt",
          "status": "Unmet",
          "isMoved": true,
          "isTransferred": true,
          "reason": "Moved To Q4",
          "to": 4,
          "from": 4
        },
        {
          "key": 4,
          "id": 2,
          "content": "Stabilize platform and address tech debt",
          "status": "In Progress",
          "isMoved": false,
          "isTransferred": false,
          "reason": "Moved From Q4",
          "from": 4,
          "to": null
        }
      ]
    }
  ]
}
```

**Result:** ✅ Child created in same quarter (Q4)

---

## 🏗️ Parent-Child Relationship

### Parent Indicator Properties

```json
{
  "isMoved": true,
  "isTransferred": true,
  "reason": "Moved To Q{targetQuarter}",
  "to": {targetQuarter},
  "from": {sourceQuarter}
}
```

### Child Indicator Properties

```json
{
  "id": {newSequentialId},
  "key": {targetQuarter},
  "isMoved": false,
  "isTransferred": false,
  "status": "IN_PROGRESS",
  "reason": "Moved From Q{sourceQuarter}",
  "from": {sourceQuarter},
  "to": null
}
```

## 📝 Field Descriptions

| Field           | Type    | Description                                    |
| --------------- | ------- | ---------------------------------------------- |
| `key`           | Number  | Quarter number (1-4)                           |
| `id`            | Number  | Sequential ID within quarter                   |
| `content`       | String  | Indicator description                          |
| `status`        | String  | `IN_PROGRESS`, `PARTIALLY_MET`, `UNMET`, `MET` |
| `isMoved`       | Boolean | `true` if moved between quarters               |
| `isTransferred` | Boolean | `true` for parent, `false` for child           |
| `reason`        | String  | Movement reason message                        |
| `from`          | Number  | Source quarter number                          |
| `to`            | Number  | Target quarter number                          |

## 🔄 Status Transformation

The system automatically transforms status values to CamelCase format:

- `IN_PROGRESS` → `In Progress`
- `PARTIALLY_MET` → `Partially Met`
- `UNMET` → `Unmet`
- `MET` → `Met`

## 🚀 API Endpoint

**POST** `/profiles/ind/:userId`

**Headers:**

- `Authorization: Bearer {token}`
- `Content-Type: application/json`

**Response Format:**

```json
{
  "success": true,
  "data": {
    "successIndicators": [...]
  },
  "message": "Success indicators updated successfully",
  "statusCode": 200
}
```

## ⚠️ Important Notes

1. **Auto-Detection**: If `from` and `to` are null, system auto-detects target quarter
2. **ID Generation**: Child indicators get new sequential IDs
3. **Status Reset**: Child indicators always start with `IN_PROGRESS` status
4. **Q4 Handling**: Last quarter creates child in same quarter
5. **CamelCase**: All status fields are transformed to CamelCase format

## 🎯 Best Practices

1. **Use `isMoved = false`** for new indicators
2. **Use `isMoved = true`** for moving indicators between quarters
3. **Leave `from`/`to` as null** for auto-detection
4. **Set proper status** to indicate completion level
5. **Use meaningful content** for clear goal tracking
