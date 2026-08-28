import { describe, expect, it, vi } from 'vitest';

import { RegisterUserUseCase } from '../../src/useCases/users/registerUserUseCase.js';
import { UserService } from '../../src/services/users/userService.js';

describe('RegisterUserUseCase', () => {
  it('delegates to the user service and returns its result', async () => {
    const registeredUser = {
      username: 'federico',
      email: 'federico@example.com',
      createdAt: new Date('2024-01-01'),
      wishList: [],
    };
    const registerUser = vi.fn().mockResolvedValue(registeredUser);
    const userService = { registerUser } as unknown as UserService;

    const useCase = new RegisterUserUseCase(userService);
    const payload = {
      username: 'federico',
      password: 'super-secret',
      email: 'federico@example.com',
    };

    const result = await useCase.registerUser(payload);

    expect(registerUser).toHaveBeenCalledWith(payload);
    expect(result).toBe(registeredUser);
  });

  it('propagates errors raised by the user service', async () => {
    const registerUser = vi
      .fn()
      .mockRejectedValue(new Error('Email already in use.'));
    const userService = { registerUser } as unknown as UserService;
    const useCase = new RegisterUserUseCase(userService);

    await expect(
      useCase.registerUser({
        username: 'federico',
        password: 'super-secret',
        email: 'federico@example.com',
      })
    ).rejects.toThrow('Email already in use.');
  });
});
