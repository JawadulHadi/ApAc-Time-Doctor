# Success Indicators - All Use Cases with Examples

## **Use Case 1: Add New Indicators**

**Description**: Add new success indicators to any quarter with default values.

**Example Payload**:

```json
{
  "successIndicators": [
    {
      "quarter": 1,
      "isActive": true,
      "year": 2026,
      "indicators": [
        {
          "id": 1,
          "key": 1,
          "content": "Complete React certification",
          "status": "IN_PROGRESS",
          "isMoved": false,
          "isTransferred": false
        }
      ]
    }
  ]
}
```

**Result**:

- Status transformed to `"InProgress"` (CamelCase)
- `isMoved: false`, `isTransferred: false` by default

---

### **Use Case 2: Move Indicators Between Quarters**

**Description**: Move an indicator from one quarter to another (true move, not duplication).

**Example Payload**:

```json
{
  "successIndicators": [
    {
      "quarter": 1,
      "indicators": [
        {
          "id": 1,
          "content": "Complete React certification",
          "status": "IN_PROGRESS",
          "isMoved": true,
          "isTransferred": false,
          "from": 1,
          "to": 2
        }
      ]
    },
    {
      "quarter": 2,
      "indicators": []
    }
  ]
}
```

**Result**:

- **Parent (Q1)**: `isMoved: true`, `isTransferred: true`, `reason: "Moved To Q2"`
- **Clone (Q2)**: `isMoved: false`, `isTransferred: false`, `status: "InProgress"`, `reason: "Moved From Q1"`

---

### **Use Case 3: Delete Indicators**

**Description**: Delete indicators by simply not including them in the payload.

**Example Payload**:

```json
{
  "successIndicators": [
    {
      "quarter": 1,
      "indicators": [
        {
          "id": 2,
          "content": "Complete Node.js course", // This indicator remains
          "status": "MET"
        }
        // Indicator with id=1 is removed (deleted)
      ]
    }
  ]
}
```

**Result**: Indicator with `id=1` is deleted from Q1.

---

### **Use Case 4: Auto-Duplicate UNMET Indicators**

**Description**: Automatically duplicate UNMET indicators to next quarter.

**Example Payload**:

```json
{
  "successIndicators": [
    {
      "quarter": 1,
      "indicators": [
        {
          "id": 1,
          "content": "Complete database optimization",
          "status": "UNMET",
          "isMoved": true,
          "from": 1,
          "to": 2
        }
      ]
    }
  ]
}
```

**Result**:

- **Parent (Q1)**: `isMoved: true`, `reason: "Moved To Q2"`
- **Auto-Created (Q2)**: `status: "InProgress"`, `reason: "Moved From Q1"`

---

### **Use Case 5: Multi-Quarter Movement Chain**

**Description**: Move indicators through multiple quarters (Q1→Q2→Q3).

**Example Payload**:

```json
{
  "successIndicators": [
    {
      "quarter": 2,
      "indicators": [
        {
          "id": 1,
          "content": "Complete React certification",
          "status": "IN_PROGRESS",
          "isMoved": true,
          "isTransferred": false,
          "from": 2,
          "to": 3
        }
      ]
    }
  ]
}
```

**Result**:

- **Q1 Grandparent**: `isMoved: true`, `isTransferred: true` (remains)
- **Q2 Parent**: `isMoved: true`, `isTransferred: true`, `reason: "Moved To Q3"`
- **Q3 Child**: `isMoved: false`, `isTransferred: false`, `status: "InProgress"`

---

### **Use Case 6: Prevent Double Cloning**

**Description**: System prevents creating duplicate clones when both flags are true.

**Example Scenario**:

```json
// This will NOT create a new clone because both flags are true
{
  "quarter": 1,
  "indicators": [
    {
      "id": 1,
      "content": "Complete React certification",
      "status": "IN_PROGRESS",
      "isMoved": true,
      "isTransferred": true, // Both true = no cloning
      "from": 1,
      "to": 2
    }
  ]
}
```

**Result**: No clone created - indicator is just marked as moved.

---

## 🔧 **Key Features Summary**

| Feature                       | Implementation                           | Example                               |
| ----------------------------- | ---------------------------------------- | ------------------------------------- |
| **Status Transformation**     | `CamelCase()`                            | `"IN_PROGRESS"` → `"InProgress"`      |
| **Default Values**            | `isMoved: false`, `isTransferred: false` | New indicators start with defaults    |
| **Dynamic Transfer**          | `isMoved: true` → `isTransferred: true`  | TL move triggers auto-transfer        |
| **Clone Creation**            | Auto-generate in target quarter          | Q1→Q2 creates copy in Q2              |
| **Reason Generation**         | Dynamic messages                         | `"Moved From Q1"`, `"Moved To Q2"`    |
| **Double Cloning Prevention** | Check both flags                         | `isMoved && isTransferred` = no clone |

## 📋 **Complete Flow Example**

**Initial State**: Q1 has indicator "Complete React course"

**Step 1 - Move Q1→Q2**:

```json
{
  "quarter": 1,
  "indicators": [
    {
      "id": 1,
      "content": "Complete React course",
      "isMoved": true,
      "isTransferred": false,
      "from": 1,
      "to": 2
    }
  ]
}
```

**Result**:

- Q1: `isMoved: true`, `isTransferred: true`, `reason: "Moved To Q2"`
- Q2: New clone with `status: "InProgress"`, `reason: "Moved From Q1"`

**Step 2 - Move Q2→Q3**:

```json
{
  "quarter": 2,
  "indicators": [
    {
      "id": 1,
      "content": "Complete React course",
      "isMoved": true,
      "isTransferred": false,
      "from": 2,
      "to": 3
    }
  ]
}
```

**Final Result**:

- Q1: `isMoved: true`, `isTransferred: true` (grandparent, preserved)
- Q2: `isMoved: true`, `isTransferred: true`, `reason: "Moved To Q3"` (parent)
- Q3: New clone with `status: "InProgress"`, `reason: "Moved From Q2"` (child)

This comprehensive system handles all indicator management scenarios with proper tracking, cloning, and prevention of duplicate operations!
