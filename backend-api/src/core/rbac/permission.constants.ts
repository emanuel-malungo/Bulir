export const PERMISSIONS = {
	// User Management
	USER_VIEW_PROFILE: 'user:view:profile',
	USER_UPDATE_PROFILE: 'user:update:profile',
	USER_VIEW_All: 'user:view:all',
	USER_DELETE: 'user:delete',
	USER_DEACTIVATE: 'user:deactivate',

	// Service Management
	SERVICE_VIEW: 'service:view',
	SERVICE_CREATE: 'service:create',
	SERVICE_UPDATE: 'service:update',
	SERVICE_DELETE: 'service:delete',
	SERVICE_PUBLISH: 'service:publish',
	SERVICE_UNPUBLISH: 'service:unpublish',

	// Reservation Management
	RESERVATION_VIEW_OWN: 'reservation:view:own',
	RESERVATION_VIEW_ALL: 'reservation:view:all',
	RESERVATION_CREATE: 'reservation:create',
	RESERVATION_UPDATE: 'reservation:update',
	RESERVATION_CANCEL: 'reservation:cancel',
	RESERVATION_CONFIRM: 'reservation:confirm',

	// Role Management (Admin only)
	ROLE_VIEW: 'role:view',
	ROLE_CREATE: 'role:create',
	ROLE_UPDATE: 'role:update',
	ROLE_DELETE: 'role:delete',

	// Balance & Payments
	BALANCE_VIEW: 'balance:view',
	BALANCE_WITHDRAW: 'balance:withdraw',
	TRANSACTION_VIEW: 'transaction:view',
} as const;

export type PermissionCode = typeof PERMISSIONS[keyof typeof PERMISSIONS];