import { describe, expect, it, vi } from 'vitest';

import { LoginUserUseCase } from '../../src/useCases/users/loginUserUseCase.js';
import { UserService } from '../../src/services/users/userService.js';

describe('LoginUserUseCase', () => {
  it('delegates to the user service and returns its result', async () => {
    const loggedUser = {
      username: 'federico',
      email: 'federico@example.com',
      wishList: [],
      token: 'jwt-token',
    };
    const loginUser = vi.fn().mockResolvedValue(loggedUser);
    const userService = { loginUser } as unknown as UserService;

    const useCase = new LoginUserUseCase(userService);
    const payload = { username: 'federico', password: 'super-secret' };

    const result = await useCase.loginUser(payload);

    expect(loginUser).toHaveBeenCalledWith(payload);
    expect(result).toBe(loggedUser);
  });

  it('propagates invalid-credentials errors from the user service', async () => {
    const loginUser = vi
      .fn()
      .mockRejectedValue(new Error('Invalid username or password'));
    const userService = { loginUser } as unknown as UserService;
    const useCase = new LoginUserUseCase(userService);

    await expect(
      useCase.loginUser({ username: 'federico', password: 'wrong' })
    ).rejects.toThrow('Invalid username or password');
  });
});
