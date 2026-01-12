import { enqueueSnackbar, VariantType } from 'notistack';

/**
 * Утилита для показа уведомлений
 */
export const toast = {
    /**
     * Показать успешное уведомление
     */
    success: (message: string, duration?: number) => {
        enqueueSnackbar(message, { variant: 'success', autoHideDuration: duration });
    },

    /**
     * Показать информационное уведомление
     */
    info: (message: string, duration?: number) => {
        enqueueSnackbar(message, { variant: 'info', autoHideDuration: duration });
    },

    /**
     * Показать предупреждение
     */
    warning: (message: string, duration?: number) => {
        enqueueSnackbar(message, { variant: 'warning', autoHideDuration: duration });
    },

    /**
     * Показать ошибку
     */
    error: (message: string, duration?: number) => {
        enqueueSnackbar(message, { variant: 'error', autoHideDuration: duration });
    },

    /**
     * Показать обычное уведомление
     */
    default: (message: string, duration?: number) => {
        enqueueSnackbar(message, { variant: 'default', autoHideDuration: duration });
    },

    /**
     * Показать уведомление с указанным типом
     */
    show: (message: string, variant: VariantType = 'default', duration?: number) => {
        enqueueSnackbar(message, { variant, autoHideDuration: duration });
    },
};
