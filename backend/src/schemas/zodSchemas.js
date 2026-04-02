const { z } = require('zod');

// ── Auth ──────────────────────────────────────────────────────────────────────
const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

// ── Records ───────────────────────────────────────────────────────────────────
const createRecordSchema = z.object({
  amount: z.number({ invalid_type_error: 'Amount must be a number' }).positive('Amount must be positive'),
  type: z.enum(['INCOME', 'EXPENSE'], { errorMap: () => ({ message: 'Type must be INCOME or EXPENSE' }) }),
  category: z.string().min(1, 'Category is required').max(100),
  date: z.string().optional(),
  notes: z.string().max(500).optional(),
});

const updateRecordSchema = createRecordSchema.partial();

// ── User Management (Admin) ───────────────────────────────────────────────────
const updateRoleSchema = z.object({
  role: z.enum(['VIEWER', 'ANALYST', 'ADMIN'], { errorMap: () => ({ message: 'Role must be VIEWER, ANALYST, or ADMIN' }) }),
});

const updateStatusSchema = z.object({
  status: z.enum(['ACTIVE', 'INACTIVE'], { errorMap: () => ({ message: 'Status must be ACTIVE or INACTIVE' }) }),
});

const createUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['VIEWER', 'ANALYST', 'ADMIN'], { errorMap: () => ({ message: 'Role must be VIEWER, ANALYST, or ADMIN' }) }).default('VIEWER'),
});

module.exports = {
  registerSchema,
  loginSchema,
  createRecordSchema,
  updateRecordSchema,
  updateRoleSchema,
  updateStatusSchema,
  createUserSchema,
};
