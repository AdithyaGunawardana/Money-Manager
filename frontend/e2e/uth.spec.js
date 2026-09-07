import { test, expect } from '@playwright/test'

async function registerUser(page) {
  const email = `test-${Date.now()}-${Math.random().toString(36).slice(2)}@example.com`

  await page.goto('/register')
  await page.locator('input[name="name"]').fill('Test User')
  await page.locator('input[name="email"]').fill(email)
  await page.locator('input[name="address"]').fill('Test Address')
  await page.locator('input[name="password"]').fill('password123')
  await page.getByRole('button', { name: 'Register' }).click()
  await expect(page).toHaveURL(/dashboard/)
}

test('user can register and reach the dashboard', async ({ page }) => {
  await registerUser(page)
  await expect(page.getByText('Your financial overview')).toBeVisible()
})

test('user can add an expense', async ({ page }) => {
  await registerUser(page)

  await page.goto('/expenses')
  await page.getByRole('button', { name: 'Add expense' }).click()

  await page.locator('input[name="title"]').fill('Groceries')
  await page.locator('input[name="amount"]').fill('125.50')
  await page.locator('input[name="transactionDate"]').fill('2026-09-07')

  await page.getByRole('button', { name: 'Add Expense', exact: true }).click()

  await expect(page.getByText('Groceries')).toBeVisible()
  await expect(page.getByText('-125.50')).toBeVisible()
})

test('user can add income', async ({ page }) => {
  await registerUser(page)

  await page.goto('/income')
  await page.getByRole('button', { name: 'Add income' }).click()
  await page.locator('input[name="source"]').fill('Salary')
  await page.locator('input[name="amount"]').fill('4045000')
  await page.locator('input[name="receivedDate"]').fill('2026-09-07')
  await page.getByRole('button', { name: 'Add Income', exact: true }).click()

  await expect(page.getByText('Salary')).toBeVisible()
  await expect(page.getByText('+4,045,000.00')).toBeVisible()
})

test('user can edit and delete an expense', async ({ page }) => {
  await registerUser(page)

  await page.goto('/expenses')
  await page.getByRole('button', { name: 'Add expense' }).click()
  await page.locator('input[name="title"]').fill('Original expense')
  await page.locator('input[name="amount"]').fill('25')
  await page.locator('input[name="transactionDate"]').fill('2026-09-07')
  await page.getByRole('button', { name: 'Add Expense', exact: true }).click()
  await expect(page.getByText('Original expense')).toBeVisible()

  const expenseRow = page.locator('tr').filter({ hasText: 'Original expense' })
  await expenseRow.getByRole('button', { name: 'Edit' }).click()
  await page.locator('input[name="title"]').fill('Updated expense')
  await page.getByRole('button', { name: 'Save Changes' }).click()
  await expect(page.getByText('Updated expense')).toBeVisible()

  page.once('dialog', (dialog) => dialog.accept())
  const updatedRow = page.locator('tr').filter({ hasText: 'Updated expense' })
  await updatedRow.getByRole('button', { name: 'Delete' }).click()
  await expect(page.getByText('No expenses yet. Add your first one.')).toBeVisible()
})

test('transaction date picker does not allow future dates', async ({ page }) => {
  await registerUser(page)

  await page.goto('/expenses')
  await page.getByRole('button', { name: 'Add expense' }).click()

  const dateInput = page.locator('input[name="transactionDate"]')
  const today = new Date().toISOString().slice(0, 10)
  await expect(dateInput).toHaveAttribute('max', today)
})

test('dashboard totals follow the selected month', async ({ page }) => {
  await registerUser(page)

  const today = new Date().toISOString().slice(0, 10)
  const currentMonth = today.slice(0, 7)

  await page.goto('/expenses')
  await page.getByRole('button', { name: 'Add expense' }).click()
  await page.locator('input[name="title"]').fill('September expense')
  await page.locator('input[name="amount"]').fill('100')
  await page.locator('input[name="transactionDate"]').fill(today)
  await page.getByRole('button', { name: 'Add Expense', exact: true }).click()

  await page.goto('/dashboard')
  await expect(page.locator('input[type="month"]')).toHaveValue(currentMonth)
  await expect(page.getByText('Total Expenses').locator('..').getByText('100.00', { exact: true })).toBeVisible()

  await page.locator('input[type="month"]').fill('2026-08')
  await expect(page.getByText('Total Expenses').locator('..').getByText('0.00', { exact: true })).toBeVisible()
  await expect(page.getByText('This Month Expenses').locator('..').getByText('0.00', { exact: true })).toBeVisible()
  await expect(page.getByText('September expense')).not.toBeVisible()
})