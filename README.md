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

### 2.2 _app.js와 Head

- 공통되는 부분은 _app.js 파일을 생성해서 연결해주면 된다.
- _app.js는 pages들의 공통 부분이다.
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
npm i shortid
```

### 4.10. immer 도입하기

```command
npm i immer
```

### 4.11. faker로 실감나는 더미데이터 만들기

```command
npm i faker
```

## Back-end

### 5.2. 익스프레스로 라우팅하기

```command
npm init
npm i express
```

- app.get => 가져오다
- app.post => 생성하다
- app.put => 전체 수정
- app.delete => 제거
- app.patch => 부분 수정
- app.options => 찔러보기 (서버야, 나 요청 보내면 받아줄거야?)
- app.head => 헤더만 가져오기 (헤더/바디)
  - 원래는 헤더 바디 둘다 오는데, 헤더만 가져온다.

- REST API를 그대로 지키기는 거의 불가능하다.
- 애매하면 post를 사용한다.

- [Swagger | API 문서 뽑는 프로그램](https://swagger.io)

### 5.4. MySQL과 시퀄라이즈 연결하기

- [MySQL 다운로드](https://dev.mysql.com/downloads/installer)

```command
npm i sequelize sequelize-cli mysql2
```

```command
npx sequelize init
```

- mysql에서는 테이블 = sequelize에서는 모델

### 5.6. 시퀄라이즈 관계 설정하기

#### 1대다 관계

- 사용자가 게시글을 작성한다. 사용자 한명이 여러개의 게시글을 작성할 수 있다.
- user와 post간의 1대다 관계

```js
User.associate = (db) => {
  db.User.hasMany(db.Post);
};

Post.associate = (db) => {
  db.Post.belongsTo(db.User); // 게시글은 작성자에게 속해있다.
};
```
- 위 belongsTo는 Post에 UserId, PostId라는 컬럼을 만들어 준다.

#### 다대다 관계

- 하나의 게시글에 여러개의 해쉬태그를 가질 수 있고, 하나의 해쉬태그가 여러개의 게시글을 가질 수 있다.
- post와 hashtag간의 다대다 관계

```js
Post.associate = (db) => {
  db.Post.belongsToMany(db.Hashtag);
};

Hashtag.associate = (db) => {
  db.Hashtag.belongsToMany(db.Post);
};
```
- 다대다 관계에서는 중간테이블이 하나 생긴다. (PostHashtag)
- HashtagId, PostId 가 서로 짝지어진다.
- 중간테이블로 인하여 검색이 가능해진다.

- 사용자와 게시글의 좋아요 관계
```js
Post.associate = (db) => {
  db.Post.belongsToMany(db.User, { through: 'Like' });
};

User.associate = (db) => {
  db.User.belongsToMany(db.Post, { through: 'Like' });
};
```
- 중간테이블명을 through를 통해서 정해줄 수 있다.

- 관계 정의가 중복될 경우 as를 붙여서 구분해줄 수 있다.
```js
Post.associate = (db) => {
  db.Post.belongsTo(db.User); // post의 작성자
  db.Post.belongsToMany(db.User, { through: 'Like', as: 'Likers' }); // post의 좋아요를 누른 사람들
};

User.associate = (db) => {
  db.User.hasMany(db.Post); // user의 작성글들
  db.User.belongsToMany(db.Post, { through: 'Like', as: 'Liked' }); // 내가 좋아요를 누른 글들
};
```
- 나중에 as에 따라서 post.getLikers처럼 게시글 좋아요 누른 사람을 가져오게 된다.


## 참고 링크

- [Next 공식문서](https://nextjs.org)

## 듣던 강좌 5-6 16:30