/**
 * Script for loading building list and distance (time) matrix
 * @author Hanzhi Zhou
 */

/**
 *
 */
import axios from 'axios';
import { NotiMsg } from '../store/notification';
import Expirable from './Expirable';
import { loadFromCache } from './Loader';

const api =
    window.location.host.indexOf('localhost') === -1 &&
    window.location.host.indexOf('127.0.0.1') === -1
        ? `${window.location.protocol}//${window.location.host}/`
        : 'http://localhost:8000/';

export interface TimeMatrixJSON extends Expirable {
    timeMatrix: number[];
}

export interface BuildingListJSON extends Expirable {
    buildingList: string[];
}

/**
 * Try to load the walking time matrix between buildings from localStorage.
 * If it expires or does not exist,
 * load a fresh one from the data backend and store it in localStorage.
 *
 * storage key: "timeMatrix"
 */
export async function loadTimeMatrix(force = false): Promise<NotiMsg<Int32Array>> {
    const data = await loadFromCache<Int32Array, TimeMatrixJSON>(
        'timeMatrix',
        requestTimeMatrix,
        x => Int32Array.from(x.timeMatrix),
        {
            infoMsg: 'Time matrix loaded',
            warnMsg: x => `Failed to load time matrix: ${x}. Old data is used instead`,
            errMsg: x => `Failed to load time matrix: ${x}. `,
            expireTime: 1000 * 86400,
            timeoutTime: 10000,
            force
        }
    );
    return data;
}

/**
 * Try to load the array of the names of buildings from localStorage.
 * If it expires or does not exist,
 * load a fresh one from the data backend and store it in localStorage.
 *
 * storage key: "buildingList"
 */
export async function loadBuildingList(force = false): Promise<NotiMsg<string[]>> {
    const data = await loadFromCache<string[], BuildingListJSON>(
        'buildingList',
        requestBuildingList,
        x => x.buildingList,
        {
            infoMsg: 'Building list loaded',
            warnMsg: x => `Failed to load building list: ${x}. Old data is used instead`,
            errMsg: x => `Failed to load building list: ${x}. `,
            expireTime: 1000 * 86400,
            timeoutTime: 10000,
            force
        }
    );
    return data;
}

async function requestTimeMatrix(): Promise<Int32Array> {
    const res = await axios.get(`${api}/data/Distance/Time_Matrix.json`);
    const data: number[][] = res.data;

    if (data instanceof Array && data.length) {
        const flattened = new Int32Array(data.length ** 2);

        for (let i = 0; i < data.length; i++) flattened.set(data[i], i * data.length);

        localStorage.setItem(
            'timeMatrix',
            JSON.stringify({
                modified: new Date().toJSON(),
                timeMatrix: Array.from(flattened)
            })
        );

        return flattened;
    } else {
        throw new Error('Data format error');
    }
}

async function requestBuildingList(): Promise<string[]> {
    const res = await axios.get(`${api}/data/Distance/Building_Array.json`);
    const data = res.data;
    if (data instanceof Array && typeof data[0] === 'string') {
        localStorage.setItem(
            'buildingList',
            JSON.stringify({
                modified: new Date().toJSON(),
                buildingList: data
            })
        );

        return data;
    } else {
        throw new Error('Data format error');
    }
}
