# סיכום שינויים - Baseline vs. Actual Feature

## Branch: `feature/baseline-comparison`

### תאריך: דצמבר 2024

---

## סקירה כללית

הוספת תכונת **Baseline vs. Actual Comparison** עם מצב עריכה, המאפשרת למשתמשים:
1. לשמור snapshot של המצב הנוכחי כ-Baseline
2. להשוות בין Baseline ל-Actual עם הדגשה ויזואלית של שינויים
3. לערוך את ה-Baseline ללא השפעה על הנתונים החיים

---

## שינויים ב-Backend

### 1. עדכון מודל Quarter (`server/server.js`)
- **הוספת עמודה**: `baseline_data` (JSON, nullable)
- **סוג**: `DataTypes.JSON`
- **ברירת מחדל**: `null`

### 2. עדכון API Endpoints (`server/server.js`)

#### `POST /api/quarters/:id/baseline`
- **מצב Snapshot**: אם `req.body.data` לא קיים, מעתיק את `data` הנוכחי ל-`baseline_data`
- **מצב Edit**: אם `req.body.data` קיים, מעדכן את `baseline_data` עם הנתונים מהגוף
- **תגובה**: מחזיר את ה-quarter המעודכן עם `baseline_data`

#### `GET /api/quarters/:id`
- **עדכון**: מחזיר גם את `baseline_data` לצד `data`

### 3. תיקון סדר Routes
- **בעיה**: Route `/api/quarters/:id/baseline` היה אחרי route כללי `/:id`
- **פתרון**: העברת routes ספציפיים לפני routes כלליים:
  - `GET /api/quarters/active` (לפני `/:id`)
  - `POST /api/quarters/:id/baseline` (לפני `/:id`)
  - `POST /api/quarters/:id/activate` (לפני `/:id`)

### 4. Database Migration Script (`server/fix_db_schema.js`)
- **תפקיד**: הוספת עמודת `baseline_data` למסד נתונים קיים
- **לוגיקה**: 
  - מנסה להוסיף את העמודה
  - אם העמודה כבר קיימת, מציג הודעת מידע
  - מטפל בשגיאות בצורה אלגנטית

---

## שינויים ב-Frontend

### 1. API Client (`src/services/api.js`)
- **עדכון `setBaseline`**: 
  - מקבל פרמטר `data` אופציונלי
  - אם `data` קיים, שולח אותו ב-body (Edit Mode)
  - אחרת, שולח request ריק (Snapshot Mode)

### 2. Dashboard Component (`src/components/Dashboard.jsx`)

#### State חדש:
- `baselineData`: מאחסן את ה-baseline snapshot
- `showDiff`: boolean לשליטה בהצגת השוואות
- `isEditingBaseline`: boolean למצב עריכה

#### Functions חדשות:

**`handleSetBaseline()`**:
- מציג confirmation dialog
- קורא ל-API לשמירת baseline
- טוען מחדש את ה-quarter ומעדכן את `baselineData`
- מעדכן את ה-ref מיד כדי לעדכן את ה-Header

**`handleEnterEditBaseline()`**:
- בודק שיש baseline data
- מכבה את `showDiff`
- טוען את baseline data למצב הראשי (projects, sprints)
- מפעיל `isEditingBaseline`

**`handleSaveBaseline()`**:
- שולח את המצב הנוכחי (baseline שערוך) ל-API
- טוען מחדש את baseline ו-live data
- יוצא ממצב עריכה

**`handleCancelEditBaseline()`**:
- טוען מחדש את live data מה-API
- יוצא ממצב עריכה

#### עדכון `loadFromAPI()`:
- טוען גם את `baseline_data` ומעדכן את `baselineData` state

#### עדכון `useEffect`:
- יוצא אוטומטית ממצב עריכה בעת החלפת quarter
- מעדכן את ה-ref עם כל המידע הנדרש ל-Header

### 3. Header Component (`src/components/Header.jsx`)

#### UI חדש:
- **כפתור "Edit Baseline"** (סגול):
  - מופיע רק אם יש baseline (`hasBaseline`)
  - מוסתר במצב עריכה
  - עם אייקון עריכה

- **Warning Bar** (כתום):
  - מופיע מעל ה-header במצב עריכה
  - טקסט: "⚠ EDITING BASELINE SNAPSHOT - Changes will not affect live tracking"

- **כפתור "Save Changes"**:
  - במצב רגיל: ירוק, "Save Changes"
  - במצב עריכה: כתום, "Save Baseline"
  - במצב עריכה: שולח ל-`saveBaseline` במקום `saveToAPI`

- **כפתור "Cancel"**:
  - מופיע רק במצב עריכה
  - אפור
  - קורא ל-`cancelEditBaseline`

- **כפתור "Set Baseline"**:
  - מושבת במצב עריכה (disabled, אפור)

#### Logic:
- `useEffect` עם interval (300ms) לבדיקת שינויים ב-ref
- קריאה ל-ref לקבלת `isEditingBaseline` ו-`hasBaseline`
- routing נכון של handlers לפי מצב

### 4. OverviewTab Component (`src/components/OverviewTab.jsx`)

#### Helper Functions:
- `getBaselineValue(baselineData, projectId, field)`: מחזיר ערך baseline
- `isProjectNew(baselineData, projectId)`: בודק אם פרויקט חדש
- `hasValueChanged(currentValue, baselineValue)`: בודק אם הערך השתנה

#### Visual Diff Rendering:

**Effort Columns (Backend/Android/iOS)**:
- אם `showDiff` ויש שינוי: רקע צהוב (`bg-yellow-50`)
- טקסט "Was: [OldValue]" קטן, אפור, עם קו חוצה מתחת ל-input

**Sprint Allocation Cells**:
- אותו לוגיקה כמו Effort columns
- רקע צהוב לתאים ששונו
- טקסט "Was: [OldValue]" מתחת ל-input

**Epic Column**:
- תג "NEW" (כחול) לפרויקטים שלא היו ב-baseline
- מופיע רק אם `showDiff` ו-`isProjectNew`

#### Props חדשים:
- `baselineData`: נתוני baseline
- `showDiff`: boolean לשליטה בהצגת השוואות

### 5. TeamTab Component (`src/components/TeamTab.jsx`)

#### Helper Functions:
- אותן helper functions כמו ב-OverviewTab

#### Visual Diff Rendering:
- אותו לוגיקה כמו OverviewTab:
  - Effort column עם רקע צהוב ושינוי
  - Sprint allocation cells עם רקע צהוב ושינוי
  - תג "NEW" לפרויקטים חדשים

#### Props חדשים:
- `baselineData`
- `showDiff`

### 6. App Component (`src/App.jsx`)

#### עדכונים:
- הוספת `setBaselineFunctionRef` (בנוסף ל-`saveFunctionRef`)
- העברת `baselineRef` ל-Header
- Handlers:
  - `handleSetBaseline()`: קורא ל-ref
  - עדכון `handleSave()`: תומך גם בשמירת baseline

---

## UI/UX Improvements

### 1. Visual Feedback
- **תאים ששונו**: רקע צהוב (`bg-yellow-50`)
- **ערך קודם**: טקסט קטן (`text-[9px]`), אפור, עם קו חוצה
- **פרויקטים חדשים**: תג "NEW" כחול

### 2. Safety Features
- **Confirmation Dialog**: לפני שמירת baseline
- **Disabled Buttons**: "Set Baseline" מושבת במצב עריכה
- **Auto Exit**: יוצא ממצב עריכה בעת החלפת quarter
- **Force showDiff off**: מכבה אוטומטית בעת כניסה למצב עריכה

### 3. User Experience
- **Toggle "Show Changes"**: מופיע רק אם יש baseline ולא במצב עריכה
- **Warning Bar**: אזהרה ברורה במצב עריכה
- **Visual Distinction**: כפתורים משנים צבע במצב עריכה

---

## קבצים שנוצרו

1. `server/fix_db_schema.js` - Database migration script
2. `fix_db_schema.js` (root) - Duplicate (לא בשימוש)

---

## קבצים שעודכנו

### Backend:
- `server/server.js` - מודל, routes, endpoints

### Frontend:
- `src/services/api.js` - API client
- `src/App.jsx` - Routing ו-refs
- `src/components/Dashboard.jsx` - State management ו-logic
- `src/components/Header.jsx` - UI controls
- `src/components/OverviewTab.jsx` - Diff rendering
- `src/components/TeamTab.jsx` - Diff rendering

---

## Testing Checklist

- [x] שמירת baseline עובדת
- [x] הצגת "Edit Baseline" button אחרי שמירה
- [x] כניסה למצב עריכה
- [x] שמירת baseline שערוך
- [x] ביטול עריכה
- [x] הצגת diff (Show Changes toggle)
- [x] הדגשת תאים ששונו
- [x] תג "NEW" לפרויקטים חדשים
- [x] יציאה אוטומטית ממצב עריכה בעת החלפת quarter
- [x] Disable "Set Baseline" במצב עריכה

---

## Known Issues / Future Improvements

1. **Header Refresh**: משתמש ב-interval (300ms) לבדיקת שינויים ב-ref. אפשר לשפר עם callback mechanism.
2. **Performance**: בדיקת diff על כל render - אפשר לממוט עם `useMemo`.
3. **Visual Polish**: אפשר להוסיף אנימציות למעבר בין מצבים.

---

## Technical Notes

- **Database**: SQLite עם Sequelize ORM
- **State Management**: React hooks (useState, useEffect, useRef)
- **API Communication**: Fetch API דרך service layer
- **Styling**: Tailwind CSS
- **Error Handling**: Try-catch blocks עם user-friendly messages

---

## Migration Instructions

להפעלת התכונה על מסד נתונים קיים:

1. הרץ את migration script:
   ```bash
   cd server
   node fix_db_schema.js
   ```

2. הפעל מחדש את השרת:
   ```bash
   node server.js
   ```

3. באפליקציה:
   - לחץ על "Set Baseline" כדי לשמור snapshot ראשון
   - השתמש ב-"Show Changes" כדי לראות השוואות
   - השתמש ב-"Edit Baseline" כדי לתקן את ה-snapshot

---

## Summary

תכונה זו מוסיפה יכולת ניהול baseline מתקדמת עם:
- שמירת snapshots
- השוואה ויזואלית
- עריכה בטוחה של baseline
- UI/UX מקצועי עם feedback ברור

כל השינויים תואמים לאדריכלות הקיימת ולא שוברים פונקציונליות קיימת.

