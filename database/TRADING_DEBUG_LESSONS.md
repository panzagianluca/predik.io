# TRADING SYSTEM DEBUGGING LESSONS LEARNED

## 🎯 **Summary**
After extensive debugging of trading functionality, we identified critical patterns and solutions for PostgreSQL function development with Supabase and TypeScript frontends.

---

## 📚 **Key Lessons Learned**

### 1. **ALWAYS Document Database Schema First**
- **Problem**: Constant guessing of table/column names led to 10+ failed attempts
- **Solution**: Created comprehensive `DATABASE_SCHEMA.md` with all tables, columns, and types
- **Lesson**: Never code database functions without confirmed schema documentation

### 2. **Function Return Types Must Match Frontend Expectations**
- **Problem**: PostgreSQL function returned `TABLE()` but frontend expected `JSON` object
- **Error**: "Error al ejecutar la operación" (generic frontend error)
- **Solution**: Changed return type from `RETURNS TABLE()` to `RETURNS JSON`
- **Lesson**: Always check what the frontend `.rpc()` call expects as return value

### 3. **Table Names Are Case-Sensitive and Specific**
- **Problem**: Used `profiles` instead of `users_profile`
- **Error**: `relation "profiles" does not exist`
- **Solution**: Confirmed actual table names from database
- **Lesson**: Never assume table names - always verify in actual database

### 4. **Column Names Must Match Exactly**
- **Problems Encountered**:
  - Used `shares` instead of `shares_owned`
  - Used `avg_price` instead of `average_price` 
  - Used `prediction` instead of `trade_type`
  - Used `mo.text` instead of `mo.option_text`
- **Solution**: Documented all column names per table
- **Lesson**: Get column names from actual database schema, not assumptions

### 5. **Function Signature Conflicts Require Complete Cleanup**
- **Problem**: Multiple function versions (UUID vs TEXT parameters) caused conflicts
- **Error**: `Could not choose the best candidate function`
- **Solution**: Drop ALL versions before recreating
- **Lesson**: When changing function signatures, always drop old versions first

### 6. **PostgreSQL Constraints Must Exist for ON CONFLICT**
- **Problem**: Used `ON CONFLICT` without proper unique constraint
- **Error**: `no unique or exclusion constraint matching the ON CONFLICT specification`
- **Solution**: Used manual IF/ELSE upsert logic instead
- **Lesson**: Verify constraints exist before using ON CONFLICT syntax

### 7. **NULL Values Need Explicit Handling**
- **Problem**: Binary trades have no `option_id` but column expects value
- **Solution**: Explicitly set `option_id` to `NULL` for binary trades
- **Lesson**: Handle nullable columns explicitly in INSERT statements

### 8. **UUID Generation Must Be Explicit**
- **Problem**: Relied on auto-generation for UUID primary keys
- **Solution**: Used `gen_random_uuid()` to explicitly generate UUIDs
- **Lesson**: Don't rely on implicit UUID generation in functions

---

## 🛠️ **Best Practices Established**

### **Before Writing Database Functions:**
1. Document complete table schema with exact column names and types
2. Identify what return type the frontend expects
3. Check for existing function versions that need cleanup
4. Verify constraints for any UPSERT operations

### **Function Development Pattern:**
```sql
-- 1. Drop existing versions
DROP FUNCTION IF EXISTS function_name(param_types...);

-- 2. Use explicit return type matching frontend
CREATE OR REPLACE FUNCTION function_name()
RETURNS JSON  -- Match frontend expectation
LANGUAGE plpgsql
AS $$
DECLARE
    -- Explicit variable declarations
BEGIN
    -- Explicit UUID generation
    v_id := gen_random_uuid();
    
    -- Explicit NULL handling
    INSERT INTO table (col1, nullable_col2) 
    VALUES (value1, NULL);
    
    -- Return JSON matching frontend interface
    RETURN json_build_object(
        'success', true,
        'data', result_value
    );
    
EXCEPTION
    WHEN OTHERS THEN
        RETURN json_build_object(
            'success', false,
            'error', SQLERRM
        );
END;
$$;
```

### **Error Handling Strategy:**
- Always include `EXCEPTION` block with descriptive errors
- Return consistent JSON format for frontend consumption
- Use `SQLERRM` and `SQLSTATE` for debugging

---

## 🚫 **Anti-Patterns to Avoid**

1. **DON'T** assume table/column names without verification
2. **DON'T** use `ON CONFLICT` without confirming unique constraints exist
3. **DON'T** rely on implicit UUID generation in functions
4. **DON'T** ignore function return type mismatches with frontend
5. **DON'T** leave NULL values unhandled in INSERT statements
6. **DON'T** create functions without dropping conflicting versions first

---

## 📋 **Debugging Checklist**

When a database function fails:

- [ ] Verify all table names exist and are spelled correctly
- [ ] Confirm all column names match database schema exactly
- [ ] Check function return type matches frontend expectation
- [ ] Ensure no function signature conflicts exist
- [ ] Verify constraints exist for any ON CONFLICT usage
- [ ] Handle NULL values explicitly in all operations
- [ ] Add comprehensive error handling with descriptive messages

---

## 🎉 **Final Working Solution**

The successful trading function included:
- ✅ Correct table name: `users_profile`
- ✅ Correct column names: `shares_owned`, `average_price`, `trade_type`
- ✅ Explicit UUID generation: `gen_random_uuid()`
- ✅ NULL handling: `option_id = NULL` for binary trades
- ✅ JSON return type matching frontend expectations
- ✅ Comprehensive error handling with try/catch
- ✅ Manual upsert logic instead of ON CONFLICT

**Result**: Trading functionality working for both binary and multiple choice markets! 🎯
