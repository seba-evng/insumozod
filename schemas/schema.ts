import { z } from 'zod';

export const emailSchema = z
  .string()
  .min(1, 'El email es requerido')
  .email('Email inválido');

export const passwordSchema = z
  .string()
  .min(6, 'La contraseña debe tener al menos 6 caracteres')
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    'Debe contener mayúscula, minúscula y número'
  );

export const nameSchema = z
  .string()
  .min(2, 'El nombre debe tener al menos 2 caracteres')
  .max(50, 'El nombre no puede exceder 50 caracteres');

export const phoneSchema = z
  .string()
  .min(10, 'El teléfono debe tener al menos 10 dígitos')
  .regex(/^\d+$/, 'Solo números');

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

export const registerSchema = z
  .object({
    name: nameSchema,
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Confirma tu contraseña'),
    phone: phoneSchema,
    terms: z
      .boolean()
      .refine((val) => val === true, 'Debes aceptar los términos'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  });

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;