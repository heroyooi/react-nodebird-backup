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

```js
Post.associate = (db) => {
  db.Post.belongsTo(db.Post, { as: 'Retweet' });
};
```
- as를 붙여주면 자동으로 PostId 컬럼이 생기는 대신 대신에 RetweetId라고 컬럼을 만들어 준다.

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

- 같은 테이블에서 다대다 관계를 설정할 때는 중간 테이블내에 생성되는 컬럼명을 따로 지정해준다.
```js
User.associate = (db) => {
  db.User.belongsToMany(db.User, { through: 'Follow', as: 'Followers', foreignKey: 'followingId' });
  db.User.belongsToMany(db.User, { through: 'Follow', as: 'Followings', foreignKey: 'followerId' });
};
```

### 5.7. 시퀄라이즈 sync nodemon

```command
npm i nodemon
```

```command
npx sequelize db:create
```
- db 생성

```command
npm run dev
```
- 시퀄라이즈 모델 작성한대로 테이블이 생성된다.

### 5.8. 회원가입 구현하기

- 브라우저(3060), 프론트 서버(Next)(3060), 백엔드 서버(express)(3065), MySQL(3306)
- 포트 하나가 프로그램 하나라고 생각하면 된다.
- 브라우저와 프론트 서버는 같은 프로그램
- 브라우저는 특별히 화면을 보여주기 위해 실행하는 프로그램

```command
npm i bcrypt
```

- 요청/응답은 헤더(상태, 용량, 시간, 쿠키)와 바디(데이터)로 구성되어있다.
- 상태 코드
  - 200 성공, 201 잘 생성됨
  - 300 리다이렉트
  - 400 클라이언트 에러, 401 허가되지 않음
  - 500 서버 에러
- [HTTP 상태코드](https://developer.mozilla.org/ko/docs/Web/HTTP/Status)

### 5.9. CORS 문제 해결하기

- 브라우저에서 다른 도메인 서버로 요청을 보낼 때 CORS 문제가 생긴다.
- 서버에서 서버로 요청할 경우 CORS 문제는 생기지 않음.

- CORS 해결하는 법
  - 브라우저에서 프론트 서버로 요청을 보낸다. (proxy 방식)

```command
npm i cors
```

### 5.10. 패스포트로 로그인하기

```js
axios.defaults.baseURL = 'http://localhost:3065';
```
- 중복되는 api 주소명을 sagas/index.js 파일에서 baseURL로 지정해준다.

```command
npm i passport passport-local
```

### 5.11. 쿠키세션과 전체 로그인 흐름

```command
npm i express-session cookie-parser
npm i dotenv
```
- 흐름이 이해가 안가면 5-11 강좌 다시 복습할 것

### 5.12 로그인 문제 해결하기

```js
useEffect(() => {
  if (me && me.id) {
    Router.replace('/');
  }
}, [me && me.id]);

useEffect(() => {
  if (signUpDone) {
    Router.replace('/');
  }
}, [signUpDone]);
```
- 회원가입 페이지에서 로그인 시 메인으로 리다이렉트
  - push를 하면 뒤로 가기 버튼 클릭 시 이전 페이지로 가지만, replace를 하면 이전 페이지가 기록에서 사라진다.
  - 뒤로 가기 했을 경우 이전 페이지가 나오지 않아야 한다면 replace를 써야 한다.

- [passport-kakao](http://www.passportjs.org/packages/passport-kakao)

### 5.15. credentials로 쿠키 공유하기

- 도메인이 다르면 쿠키도 전달이 되지 않는다.
- 쿠키를 다른 도메인간에 전달하고 싶다면,
  - 백엔드 cors의 옵션 중에 credentials를 true로 설정해줘야 한다.
  - 프론트 axios에서도 api 요청할 때 withCredentials를 true로 설정해줘야 한다.

### 5.16. 내 로그인 정보 매번 불러오기

- routes/user 작성

```js
router.get('/', async (req, res, next) => { // GET /user
  try {
    if (req.user) {
      const user = await User.findOne({
        where: { id: req.user.id }
      });
      res.status(200).json(user);  
    } else {
      res.status(200).json(null);
    }    
  } catch (error) {
    console.error(error);
    next(error);
  }  
});
```

- 프론트에서 LOAD_USER_REQUEST 액션을 작성하여 페이지 접근 시 dispatch 해준다.

### 5.17. 게시글 불러오기

```command
npm i morgan
```

### 5.18. 게시글 좋아요

- 모델을 정의할 때 associate 선언에 따라 관계 메서드가 생긴다.

```js
Post.associate = (db) => {
  db.Post.belongsTo(db.User); // post.addUser, post.getUser, post.setUser
  db.Post.belongsToMany(db.Hashtag, { through: 'PostHashtag' }); // post.addHashtags
  db.Post.hasMany(db.Comment); // post.addComments, post.getComments
  db.Post.hasMany(db.Image); // post.addImages, post.getImages
  db.Post.belongsToMany(db.User, { through: 'Like', as: 'Likers' }); // post.addLikers, post.removeLikers
  db.Post.belongsTo(db.Post, { as: 'Retweet' }); // post.addRetweet
};
```

- DB 조작할 땐 꼭 await 을 붙여야 한다.

- 좋아요 dispatch 시 프론트 서버와 백엔드 서버의 과정

- 1. front/components/PostCard.js
  - 처음 페이지에서 이벤트 발생 (dispatch 호출)
```js
const onLike = useCallback(() => {
  dispatch({
    type: LIKE_POST_REQUEST,
    data: post.id,
  });
}, []);
```

- 2. front/sagas/post.js
  - 사가의 등록되어있는 함수 실행
```js
function likePostAPI(data) {
  return axios.patch(`/post/${data}/like`);
}

function* likePost(action) {
  try {
    const result = yield call(likePostAPI, action.data); // 위 페이지의 post.id
    yield put({
      type: LIKE_POST_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: LIKE_POST_FAILURE,
      data: err.response.data,
    });
  }
}

function* watchLikePost() {
  yield takeLatest(LIKE_POST_REQUEST, likePost);
}
```

- 3. back/routes/post.js
  - 백엔드 등록된 라우터 실행
```js  
router.patch('/:postId/like', isLoggedIn, async (req, res, next) => {
  try {
    const post = await Post.findOne({ where: { id: req.params.postId } });
    if (!post) {
      return res.status(403).send('게시글이 존재하지 않습니다.');
    }
    await post.addLikers(req.user.id);
    res.json({ PostId: post.id, UserId: req.user.id }); // 프론트로 PostId, UserId 정보 객체를 넘겨준다.
  } catch (error) {
    next(error);
  }
});
```

- 4. front/reducers/post.js
  - 백엔드에서 내려주는 데이터({ PostId, UserId })를 바탕으로 리덕스 스토어의 모양을 리듀서에서 바꾸어준다.
```js  
const reducer = (state = initialState, action) => produce(state, (draft) => {
  switch (action.type) {
    case LIKE_POST_SUCCESS: {
      const post = draft.mainPosts.find((v) => v.id === action.data.PostId);
      post.Likers.push({ id: action.data.UserId });
      draft.likePostLoading = false;
      draft.likePostDone = true;
      break;
    }    
    default:
      break;
  }
});
```

- 5. front/components/PostCard.js
  - 최종적으로 변형된 스토어의 값을 바탕으로 화면에서 표현해준다.
```js  
const PostCard = ({ post }) => {
  const liked = post.Likers.find((v) => v.id === id);
  //...
}
```

### 5.20. 팔로우 언팔로우

- 1. front/components/FollowButton.js
  - 처음 페이지에서 이벤트 발생 (dispatch 호출)
```js
const { me } = useSelector((state) => state.user);
const isFollowing = me?.Followings.find((v) => v.id === post.User.id);

const onClickButton = useCallback(() => {
  if (isFollowing) {
    dispatch({
      type: UNFOLLOW_REQUEST,
      data: post.User.id,
    });
  } else {
    dispatch({
      type: FOLLOW_REQUEST,
      data: post.User.id,
    });
  }
}, [isFollowing]);
```

- 2. front/sagas/user.js
  - 사가의 등록되어있는 함수 실행
```js
function followAPI(data) {
  return axios.patch(`/user/${data}/follow`);
}

function* follow(action) {
  try {
    const result = yield call(followAPI, action.data);
    yield put({
      type: FOLLOW_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: FOLLOW_FAILURE,
      error: err.response.data,
    });
  }
}

function* watchFollow() {
  yield takeLatest(FOLLOW_REQUEST, follow);
}
```

- 3. back/routes/user.js
  - 백엔드 등록된 라우터 실행
```js
router.patch('/:userId/follow', isLoggedIn, async (req, res, next) => { // PATCH /user/1/follow
  try {
    const user = await User.findOne({ where: { id: req.params.userId } });
    if (!user) {
      res.status(403).send('없는 사람을 팔로우하려고 하시네요?');
    }
    await user.addFollowers(req.user.id);
    res.status(200).json({ UserId: parseInt(req.params.userId, 10) }); // 프론트로 UserId 객체를 넘겨준다.
  } catch (error) {
    console.error(error);
    next(error);
  }
});
```

- 4. front/reducers/user.js
  - 백엔드에서 내려주는 데이터({ UserId })를 바탕으로 리덕스 스토어의 모양을 리듀서에서 바꾸어준다.
```js  
const reducer = (state = initialState, action) => produce(state, (draft) => {
  switch (action.type) {
    case FOLLOW_SUCCESS:
      draft.followLoading = false;
      draft.me.Followings.push({ id: action.data.UserId });
      draft.followDone = true;
      break;
    }    
    default:
      break;
  }
});
```

- 5. front/components/FollowButton.js
  - 최종적으로 변형된 스토어의 값을 바탕으로 화면에서 표현해준다.
```js  
const FollowButton = ({ post }) => {
  const { me } = useSelector((state) => state.user);
  const isFollowing = me?.Followings.find((v) => v.id === post.User.id);
  //...
}
```

### 5.21. 이미지 업로드를 위한 multer

- 폼 태그에 encType="multipart/form-data"를 설정하여 이미지 파일 업로드 처리를 한다.
- multipart를 백엔드에서 처리하기 위해 multer를 설치한다.

```js
<Form encType="multipart/form-data" onFinish={onSubmit}>
  <input type="file" name="image" multiple hidden ref={imageInput} />
</Form>
```

```command
npm i multer
```
- multer는 보통 app에 작성하지 않고, 라우터마다 장착한다.
  - 폼마다 데이터 전송 형식이나 데이터 타입이 다르기 때문에, 개별적으로 라우터마다 넣는다.

- 실습할 때만 하드디스크에 저장하고, 나중에 AWS에 배포하면서 S3 서비스로 대체를 한다.
- 스토리지 옵션만 S3로 갈아끼워주면된다.
```js
// 이미지 업로드 실행
const upload = multer({
  storage: multer.diskStorage({ // diskStorage: 컴퓨터의 하드디스크
    destination(req, file, done) { // 나중엔 AWS S3같은 클라우드에다가 저장한다.
      done(null, 'uploads');
    },
    filename(req, file, done) { // 제로초.png
      const ext = path.extname(file.originalname); // 확장자 추출(.png)
      const basename = path.basename(file.originalname, ext); // 제로초
      done(null, basename + new Date().getTime() + ext); // 제로초15184712891.png
    }
  }),
  limits: { fileSize: 20 * 1024 * 1024 } // 20MB
});

// 이미지 업로드 후에 실행
router.post('/images', isLoggedIn, upload.array('image'), async (req, res, next) => { // POST /post/images
  console.log(req.files); // 업로드된 이미지 정보들
  res.json(req.files.map((v) => v.filename));
});
```
- input file에서 설정한 name 값 image가 라우터의 upload.array('image')로 전달된다.
  - array인 이유는 이미지를 여러장 올릴 수 있게 하기 위해서다.
  - 한 장만 올릴 꺼라면 upload.single('image')을 사용
  - 이미지가 아니라 텍스트 json이라면 upload.none()
  - input file이 2개 이상 있을 경우 upload.fields([])를 쓰면 된다.

### 6.1. 서버사이드렌더링 준비하기

- next-redux-saga 삭제, 필요가 없어짐
- next-redux-wrapper 버전 문제로 SSR이 안되서 버전 변경

```command
npm rm next-redux-saga
npm i next-redux-wrapper@6.0.2
```

- front/pages/index.js 페이지에서 SSR 처리
  - 기존 useEffect 있던 부분을 삭제하고 getServerSideProps로 옮긴다.
  - 사가의 END 액션을 통해 프론트에서 SUCCESS 액션을 기다렸다가 처리하고 렌더링 해준다.
```js
import { END } from 'redux-saga';
import wrapper from '../store/configureStore';

// 프론트 서버에서 실행 (브라우저 X)
export const getServerSideProps = wrapper.getServerSideProps(async (context) => {
  context.store.dispatch({
    type: LOAD_USER_REQUEST,
  });
  context.store.dispatch({
    type: LOAD_POSTS_REQUEST,
  });
  context.store.dispatch(END);
  await context.store.sagaTask.toPromise();
});
```

### 6.2. SSR시 쿠키 공유하기

- SSR의 주체는 프론트서버에서 백엔드 서버로 보내는 것
  - 브라우저는 개입 조차 못한다.
  - 서버에서 서버로 보내면 쿠키는 자동으로 보내는 것이 아니다. axios에다가 직접 넣어서 보내줘야 한다.

```js
import axios from 'axios';

export const getServerSideProps = wrapper.getServerSideProps(async (context) => {
  const cookie = context.req ? context.req.headers.cookie : '';
  axios.defaults.headers.Cookie = '';
  if (context.req && cookie) {
    axios.defaults.headers.Cookie = cookie;
  }
  // ...
});
```  

## 참고 링크

- [Next 공식문서](https://nextjs.org)

## 듣던 강좌 6-3