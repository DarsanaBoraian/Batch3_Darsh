import {take, put, call, fork} from 'redux-saga/effects';

import {itemsActions} from '../features/items/itemsSlice';
import {ApiHelper, PersistanceHelper} from '../helpers';

const {request, success, failure, addItem} = itemsActions;

function callGetRequest(url, data, headers) {
  return ApiHelper.get(url, data, headers);
}

function callPostRequest(url, data, headers) {
  return ApiHelper.post(url, data, headers);
}

function getAccessToken() {
  return PersistanceHelper.getValue('accessToken');
}

function* watchRequest() {
  while (true) {
    const {payload} = yield take(request);

    try {
      let response;

      if (payload?.data?.requestType === 'POST') {
        const {requestType, ...rest} = payload.data;

        const accessToken = yield call(getAccessToken);

        console.log(accessToken);

        response = yield call(callPostRequest, payload.url, rest, {
          'X-Access-Token':
            'RE0wBIr3U1GQGDbocEnmE4g7OJbld9sfc0erzO82F2eVfcZQW2CPcipCNEGermdr',
        });

        yield put(addItem(response));
      } else {
        console.log('it came here');
        response = yield call(callGetRequest, payload.url, {});

        yield put(success(response));
      }
    } catch (err) {
      yield put(failure(err.message));

      // ErrorHelper.handleErrors(err, true);
    }
  }
}

export default function* root() {
  yield fork(watchRequest);
}
