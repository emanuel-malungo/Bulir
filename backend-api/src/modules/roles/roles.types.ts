export interface IRole {
  id: number;
  name: string;
  description?: string;
}

export interface IPermission {
  id: number;
  name: string;
  description?: string;
}

export interface IRoleWithPermissions extends IRole {
  permissions: IPermission[];
}

export interface ICreateRoleRequest {
  name: string;
  description?: string;
}

export interface ICreateRoleResponse {
  data: IRole;
  message: string;
}

export interface IGetRoleResponse {
  data: IRoleWithPermissions;
}

export interface IListRolesResponse {
  data: IRole[];
}

export interface IUpdateRoleResponse {
  data: IRole;
  message: string;
}

export interface IDeleteRoleResponse {
  message: string;
}

export interface ICreatePermissionRequest {
  name: string;
  description?: string;
}

export interface ICreatePermissionResponse {
  data: IPermission;
  message: string;
}

export interface IListPermissionsResponse {
  data: IPermission[];
}

export interface IDeletePermissionResponse {
  message: string;
}

export interface IAssignPermissionResponse {
  message: string;
  data: {
    roleId: number;
    permissionId: number;
  };
}

export interface IUserWithRoles {
  id: number;
  fullName: string;
  email: string;
  roles: IRole[];
}

export interface IApiError {
  error?: string;
  errors?: any[];
}
