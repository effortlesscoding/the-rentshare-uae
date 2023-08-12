import { Response } from './types';
import { config } from './config';

const BASE_URL = config.apiHost;

export interface User {
    id: string;
    email: string;
    extraDetails: object;
}

export const login = (request:{
    email: string;
    password: string;
}): Promise<Response<User>> =>
        fetch(`${BASE_URL}/users/login`, {
            method: 'POST',
            body: JSON.stringify(request),
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then(r => {
            return r.json().then(user => {
                return ({ status: r.status, data: user as User });
            });
        });


export const register = (request:{
    email: string;
    password: string;
    extraDetails: object;
}): Promise<Response<User>> =>
    fetch(`${BASE_URL}/users/register`, {
            method: 'POST',
            body: JSON.stringify(request),
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then(r => {
            return r.json().then(user => {
                return ({ status: r.status, data: user as User });
            });
        });