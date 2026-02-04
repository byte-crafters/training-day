import { validate, parse, type InitData } from '@tma.js/init-data-node';
import type { User } from './userService.js';
import { UserService } from './userService.js';

const INIT_DATA_EXPIRES_IN_SEC = 3600 * 24;

export class InitDataValidationError extends Error {
    constructor(message: string, public readonly cause?: unknown) {
        super(message);
        this.name = 'InitDataValidationError';
    }
}

export class MissingBotTokenError extends Error {
    constructor() {
        super('TELEGRAM_BETA_BOT_TOKEN is not set');
        this.name = 'MissingBotTokenError';
    }
}

export interface AuthResult {
    user: User;
    initData: InitData;
    telegramUserId: number;
}

/**
 * Валидирует initData из Telegram Mini App, создаёт/обновляет пользователя в БД.
 * Общая логика для authMiddleware и AuthController.initTelegram.
 */
export async function validateInitDataAndGetUser(initDataRaw: string): Promise<AuthResult> {
    const botToken = process.env.TELEGRAM_BETA_BOT_TOKEN;
    if (!botToken) {
        throw new MissingBotTokenError();
    }

    try {
        validate(initDataRaw, botToken, { expiresIn: INIT_DATA_EXPIRES_IN_SEC });
    } catch (err) {
        throw new InitDataValidationError(
            err instanceof Error ? err.message : 'Validation failed',
            err,
        );
    }

    const initData = parse(initDataRaw);
    if (!initData.user?.id) {
        throw new InitDataValidationError('User data is missing in initData');
    }

    const telegramUserId = initData.user.id;
    const user = await UserService.createOrUpdate(telegramUserId, {
        username: initData.user.username,
        first_name: initData.user.first_name,
        last_name: initData.user.last_name,
    });

    return { user, initData, telegramUserId };
}
