# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: uth.spec.js >> dashboard totals follow the selected month
- Location: e2e\uth.spec.js:84:1

# Error details

```
Error: expect(locator).not.toBeVisible() failed

Locator:  getByText('September expense')
Expected: not visible
Received: visible
Timeout:  5000ms

Call log:
  - Expect "not toBeVisible" getByText('September expense') with timeout 5000ms
  - waiting for getByText('September expense')
    14 × locator resolved to <td class="px-5 py-4 font-medium text-slate-700">September expense</td>
       - unexpected value "visible"

```

```yaml
- cell "September expense"
```

# Test source

```ts
  2   | 
  3   | async function registerUser(page) {
  4   |   const email = `test-${Date.now()}-${Math.random().toString(36).slice(2)}@example.com`
  5   | 
  6   |   await page.goto('/register')
  7   |   await page.locator('input[name="name"]').fill('Test User')
  8   |   await page.locator('input[name="email"]').fill(email)
  9   |   await page.locator('input[name="address"]').fill('Test Address')
  10  |   await page.locator('input[name="password"]').fill('password123')
  11  |   await page.getByRole('button', { name: 'Register' }).click()
  12  |   await expect(page).toHaveURL(/dashboard/)
  13  | }
  14  | 
  15  | test('user can register and reach the dashboard', async ({ page }) => {
  16  |   await registerUser(page)
  17  |   await expect(page.getByText('Your financial overview')).toBeVisible()
  18  | })
  19  | 
  20  | test('user can add an expense', async ({ page }) => {
  21  |   await registerUser(page)
  22  | 
  23  |   await page.goto('/expenses')
  24  |   await page.getByRole('button', { name: 'Add expense' }).click()
  25  | 
  26  |   await page.locator('input[name="title"]').fill('Groceries')
  27  |   await page.locator('input[name="amount"]').fill('125.50')
  28  |   await page.locator('input[name="transactionDate"]').fill('2026-09-07')
  29  | 
  30  |   await page.getByRole('button', { name: 'Add Expense', exact: true }).click()
  31  | 
  32  |   await expect(page.getByText('Groceries')).toBeVisible()
  33  |   await expect(page.getByText('-125.50')).toBeVisible()
  34  | })
  35  | 
  36  | test('user can add income', async ({ page }) => {
  37  |   await registerUser(page)
  38  | 
  39  |   await page.goto('/income')
  40  |   await page.getByRole('button', { name: 'Add income' }).click()
  41  |   await page.locator('input[name="source"]').fill('Salary')
  42  |   await page.locator('input[name="amount"]').fill('4045000')
  43  |   await page.locator('input[name="receivedDate"]').fill('2026-09-07')
  44  |   await page.getByRole('button', { name: 'Add Income', exact: true }).click()
  45  | 
  46  |   await expect(page.getByText('Salary')).toBeVisible()
  47  |   await expect(page.getByText('+4,045,000.00')).toBeVisible()
  48  | })
  49  | 
  50  | test('user can edit and delete an expense', async ({ page }) => {
  51  |   await registerUser(page)
  52  | 
  53  |   await page.goto('/expenses')
  54  |   await page.getByRole('button', { name: 'Add expense' }).click()
  55  |   await page.locator('input[name="title"]').fill('Original expense')
  56  |   await page.locator('input[name="amount"]').fill('25')
  57  |   await page.locator('input[name="transactionDate"]').fill('2026-09-07')
  58  |   await page.getByRole('button', { name: 'Add Expense', exact: true }).click()
  59  |   await expect(page.getByText('Original expense')).toBeVisible()
  60  | 
  61  |   const expenseRow = page.locator('tr').filter({ hasText: 'Original expense' })
  62  |   await expenseRow.getByRole('button', { name: 'Edit' }).click()
  63  |   await page.locator('input[name="title"]').fill('Updated expense')
  64  |   await page.getByRole('button', { name: 'Save Changes' }).click()
  65  |   await expect(page.getByText('Updated expense')).toBeVisible()
  66  | 
  67  |   page.once('dialog', (dialog) => dialog.accept())
  68  |   const updatedRow = page.locator('tr').filter({ hasText: 'Updated expense' })
  69  |   await updatedRow.getByRole('button', { name: 'Delete' }).click()
  70  |   await expect(page.getByText('No expenses yet. Add your first one.')).toBeVisible()
  71  | })
  72  | 
  73  | test('transaction date picker does not allow future dates', async ({ page }) => {
  74  |   await registerUser(page)
  75  | 
  76  |   await page.goto('/expenses')
  77  |   await page.getByRole('button', { name: 'Add expense' }).click()
  78  | 
  79  |   const dateInput = page.locator('input[name="transactionDate"]')
  80  |   const today = new Date().toISOString().slice(0, 10)
  81  |   await expect(dateInput).toHaveAttribute('max', today)
  82  | })
  83  | 
  84  | test('dashboard totals follow the selected month', async ({ page }) => {
  85  |   await registerUser(page)
  86  | 
  87  |   await page.goto('/expenses')
  88  |   await page.getByRole('button', { name: 'Add expense' }).click()
  89  |   await page.locator('input[name="title"]').fill('September expense')
  90  |   await page.locator('input[name="amount"]').fill('100')
  91  |   await page.locator('input[name="transactionDate"]').fill('2026-09-07')
  92  |   await page.getByRole('button', { name: 'Add Expense', exact: true }).click()
  93  | 
  94  |   await page.goto('/dashboard')
  95  |   const currentMonth = new Date().toISOString().slice(0, 7)
  96  |   await expect(page.locator('input[type="month"]')).toHaveValue(currentMonth)
  97  |   await expect(page.getByText('Total Expenses').locator('..').getByText('100.00', { exact: true })).toBeVisible()
  98  | 
  99  |   await page.locator('input[type="month"]').fill('2026-08')
  100 |   await expect(page.getByText('Total Expenses').locator('..').getByText('0.00', { exact: true })).toBeVisible()
  101 |   await expect(page.getByText('This Month Expenses').locator('..').getByText('0.00', { exact: true })).toBeVisible()
> 102 |   await expect(page.getByText('September expense')).not.toBeVisible()
      |                                                         ^ Error: expect(locator).not.toBeVisible() failed
  103 | })
```