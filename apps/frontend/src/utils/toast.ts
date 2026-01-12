import { enqueueSnackbar, VariantType } from 'notistack';

/**
 * Утилита для показа уведомлений
 */
export const toast = {
    /**
     * Показать успешное уведомление
     */
    success: (message: string) => {
        enqueueSnackbar(message, { variant: 'success' });
    },

    /**
     * Показать информационное уведомление
     */
    info: (message: string) => {
        enqueueSnackbar(message, { variant: 'info' });
    },

    /**
     * Показать предупреждение
     */
    warning: (message: string) => {
        enqueueSnackbar(message, { variant: 'warning' });
    },

    /**
     * Показать ошибку
     */
    error: (message: string) => {
        enqueueSnackbar(message, { variant: 'error' });
    },

    /**
     * Показать обычное уведомление
     */
    default: (message: string) => {
        enqueueSnackbar(message, { variant: 'default' });
    },

    /**
     * Показать уведомление с указанным типом
     */
    show: (message: string, variant: VariantType = 'default') => {
        enqueueSnackbar(message, { variant });
    },
};
