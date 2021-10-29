# React Nodebird

## Front-end

```command
npm init
npm i next
npm i react react-dom
npm i prop-types
```

### 1.6 Link와 eslint

```command
npm i eslint eslint-plugin-import eslint-plugin-react eslint-plugin-react-hooks -D
```

### 2.1 antd와 styled-components

```command
npm i antd styled-components @ant-design/icons
```

### 2.2 \_app.js와 Head

- 공통되는 부분은 \_app.js 파일을 생성해서 연결해주면 된다.
- \_app.js는 pages들의 공통 부분이다.
- Head로 페이지별 메타 정보와 타이틀 정보를 바꿀 수 있다.

### 3.1 리덕스 설치와 필요성 소개

```command
npm i redux react-redux next-redux-wrapper
```

- 컴포넌트는 화면 그리는 것에만 집중해야한다. 데이터까지 다루는 것은 컴포넌트의 역할이 아니다.
- 컴포넌트에서는 데이터 요청을 안하고, 별도의 모듈이나 라이브러리가 해야한다.

### 3.4 미들웨어와 리덕스 데브툴즈

```command
npm i redux-devtools-extension
```

### 3.10 이미지 캐루셀 구현하기 react-slick

```command
npm i react-slick
```

### 4.1 redux-thunk 이해하기

```js
function createThunkMiddleware(extraArgument) {
  return ({ dispatch, getState }) =>
    (next) =>
    (action) => {
      if (typeof action === "function") {
        return action(dispatch, getState, extraArgument);
      }

      return next(action);
    };
}
```

```command
npm i redux-thunk
```

```js
const loginAction = (data) => {
  return (dispatch, getState) => {
    const state = getState(); // initialState
    dispatch(loginRequestAction());
    axios
      .post("/api/login")
      .then((res) => {
        dispatch(loginSuccessAction(res.data));
      })
      .catch((err) => {
        dispatch(loginFailureAction(err));
      });
  };
};
```

- 함수를 리턴하는 비동기 action creator 예시

### 4.2 saga 설치하고 generator 이해하기

```command
npm rm redux-thunk
npm i redux-saga next-redux-saga
```

### 4.3 saga 이펙트 알아보기

```command
npm i axios
```

- 제네레이터를 사용하면 테스트를 할 때 매우 편리하다

```js
function* logIn(action) {
  try {
    const result = yield call(logInAPI, action.data);
    yield put({
      type: "LOG_IN_SUCCESS",
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: "LOG_IN_FAILURE",
      data: err.response.data,
    });
  }
}

function* watchLogIn() {
  // 이벤트 리스너와 같은 역할
  yield takeLatest("LOG_IN_REQUEST", logIn);
}

export default function* rootSaga() {
  yield all([fork(watchLogIn)]);
}

const l = logIn({ type: "LOG_IN_REQUEST", data: { id: "zerocho@gmail.com" } });
l.next(); // yield call(logInAPI, action.data);
l.next(); // yield put({ type: LOG_IN_SUCCESS, ... })
```

- takeLatest: 여러번 클릭했을 경우 마지막 것만 실행 (요청이 여러번 가는 것은 막을 수 없다.)
- takeLeading: 여러번 클릭했을 경우 처음 것만 실행 (요청이 여러번 가는 것은 막을 수 없다.)
- throttle: 제한 시간을 둬서 그 시간만큼 요청도 막을 수 있다. 그 시간 안에는 요청이 한번만 간다.

### 4.7. 바뀐 상태 적용하고 eslint 점검하기

```command
npm i -D babel-eslint eslint-config-airbnb eslint-plugin-import eslint-plugin-react-hooks
npm i -D eslint-plugin-jsx-a11y
```

### 4.8. 게시글 댓글 saga 작성하기

```command

```

## 참고 링크

- [Next 공식문서](https://nextjs.org)

## 듣던 강좌 4-8 05:30
