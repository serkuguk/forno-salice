export * from './roles';

export interface User {
    username: string
    roleId: string
    access_token: string
    role: any
}
