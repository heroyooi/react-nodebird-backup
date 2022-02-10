# React Nodebird

## Front-end

```command
npm init
npm i next
npm i react react-dom
npm i prop-types
```

### 1-6 Link와 eslint

```command
npm i eslint eslint-plugin-import eslint-plugin-react eslint-plugin-react-hooks -D
```

### 2-1 antd와 styled-components

```command
npm i antd styled-components @ant-design/icons
```

### 2-2 \_app.js와 Head

- 공통되는 부분은 \_app.js 파일을 생성해서 연결해주면 된다.
- \_app.js는 pages들의 공통 부분이다.
- Head로 페이지별 메타 정보와 타이틀 정보를 바꿀 수 있다.

### 3-1 리덕스 설치와 필요성 소개

```command
npm i redux react-redux next-redux-wrapper
```

- 컴포넌트는 화면 그리는 것에만 집중해야한다. 데이터까지 다루는 것은 컴포넌트의 역할이 아니다.
- 컴포넌트에서는 데이터 요청을 안하고, 별도의 모듈이나 라이브러리가 해야한다.

### 3-4 미들웨어와 리덕스 데브툴즈

```command
npm i redux-devtools-extension
```

### 3-10 이미지 캐루셀 구현하기 react-slick

```command
npm i react-slick
```

### 4-1 redux-thunk 이해하기

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

### 4-2 saga 설치하고 generator 이해하기

```command
npm rm redux-thunk
npm i redux-saga next-redux-saga
```

### 4-3 saga 이펙트 알아보기

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

### 4-7. 바뀐 상태 적용하고 eslint 점검하기

```command
npm i -D babel-eslint eslint-config-airbnb eslint-plugin-import eslint-plugin-react-hooks
npm i -D eslint-plugin-jsx-a11y
```

### 4-8. 게시글 댓글 saga 작성하기

```command
npm i shortid
```

### 4-10. immer 도입하기

```command
npm i immer
```

### 4-11. faker로 실감나는 더미데이터 만들기

```command
npm i faker
```

## Back-end

### 5-2. 익스프레스로 라우팅하기

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

### 5-4. MySQL과 시퀄라이즈 연결하기

- [MySQL 다운로드](https://dev.mysql.com/downloads/installer)

```command
npm i sequelize sequelize-cli mysql2
```

```command
npx sequelize init
```

- mysql에서는 테이블 = sequelize에서는 모델

### 5-6. 시퀄라이즈 관계 설정하기

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
  db.Post.belongsTo(db.Post, { as: "Retweet" });
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
  db.Post.belongsToMany(db.User, { through: "Like" });
};

User.associate = (db) => {
  db.User.belongsToMany(db.Post, { through: "Like" });
};
```

- 중간테이블명을 through를 통해서 정해줄 수 있다.

- 관계 정의가 중복될 경우 as를 붙여서 구분해줄 수 있다.

```js
Post.associate = (db) => {
  db.Post.belongsTo(db.User); // post의 작성자
  db.Post.belongsToMany(db.User, { through: "Like", as: "Likers" }); // post의 좋아요를 누른 사람들
};

User.associate = (db) => {
  db.User.hasMany(db.Post); // user의 작성글들
  db.User.belongsToMany(db.Post, { through: "Like", as: "Liked" }); // 내가 좋아요를 누른 글들
};
```

- 나중에 as에 따라서 post.getLikers처럼 게시글 좋아요 누른 사람을 가져오게 된다.

- 같은 테이블에서 다대다 관계를 설정할 때는 중간 테이블내에 생성되는 컬럼명을 따로 지정해준다.

```js
User.associate = (db) => {
  db.User.belongsToMany(db.User, {
    through: "Follow",
    as: "Followers",
    foreignKey: "followingId",
  });
  db.User.belongsToMany(db.User, {
    through: "Follow",
    as: "Followings",
    foreignKey: "followerId",
  });
};
```

### 5-7. 시퀄라이즈 sync nodemon

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

### 5-8. 회원가입 구현하기

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

### 5-9. CORS 문제 해결하기

- 브라우저에서 다른 도메인 서버로 요청을 보낼 때 CORS 문제가 생긴다.
- 서버에서 서버로 요청할 경우 CORS 문제는 생기지 않음.

- CORS 해결하는 법
  - 브라우저에서 프론트 서버로 요청을 보낸다. (proxy 방식)

```command
npm i cors
```

### 5-10. 패스포트로 로그인하기

```js
axios.defaults.baseURL = "http://localhost:3065";
```

- 중복되는 api 주소명을 sagas/index.js 파일에서 baseURL로 지정해준다.

```command
npm i passport passport-local
```

### 5-11. 쿠키세션과 전체 로그인 흐름

```command
npm i express-session cookie-parser
npm i dotenv
```

- 흐름이 이해가 안가면 5-11 강좌 다시 복습할 것

### 5-12 로그인 문제 해결하기

```js
useEffect(() => {
  if (me && me.id) {
    Router.replace("/");
  }
}, [me && me.id]);

useEffect(() => {
  if (signUpDone) {
    Router.replace("/");
  }
}, [signUpDone]);
```

- 회원가입 페이지에서 로그인 시 메인으로 리다이렉트

  - push를 하면 뒤로 가기 버튼 클릭 시 이전 페이지로 가지만, replace를 하면 이전 페이지가 기록에서 사라진다.
  - 뒤로 가기 했을 경우 이전 페이지가 나오지 않아야 한다면 replace를 써야 한다.

- [passport-kakao](http://www.passportjs.org/packages/passport-kakao)

### 5-15. credentials로 쿠키 공유하기

- 도메인이 다르면 쿠키도 전달이 되지 않는다.
- 쿠키를 다른 도메인간에 전달하고 싶다면,
  - 백엔드 cors의 옵션 중에 credentials를 true로 설정해줘야 한다.
  - 프론트 axios에서도 api 요청할 때 withCredentials를 true로 설정해줘야 한다.

### 5-16. 내 로그인 정보 매번 불러오기

- routes/user 작성

```js
router.get("/", async (req, res, next) => {
  // GET /user
  try {
    if (req.user) {
      const user = await User.findOne({
        where: { id: req.user.id },
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

### 5-17. 게시글 불러오기

```command
npm i morgan
```

### 5-18. 게시글 좋아요

- 모델을 정의할 때 associate 선언에 따라 관계 메서드가 생긴다.

```js
Post.associate = (db) => {
  db.Post.belongsTo(db.User); // post.addUser, post.getUser, post.setUser
  db.Post.belongsToMany(db.Hashtag, { through: "PostHashtag" }); // post.addHashtags
  db.Post.hasMany(db.Comment); // post.addComments, post.getComments
  db.Post.hasMany(db.Image); // post.addImages, post.getImages
  db.Post.belongsToMany(db.User, { through: "Like", as: "Likers" }); // post.addLikers, post.removeLikers
  db.Post.belongsTo(db.Post, { as: "Retweet" }); // post.addRetweet
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
router.patch("/:postId/like", isLoggedIn, async (req, res, next) => {
  try {
    const post = await Post.findOne({ where: { id: req.params.postId } });
    if (!post) {
      return res.status(403).send("게시글이 존재하지 않습니다.");
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
const reducer = (state = initialState, action) =>
  produce(state, (draft) => {
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
};
```

### 5-20. 팔로우 언팔로우

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
router.patch("/:userId/follow", isLoggedIn, async (req, res, next) => {
  // PATCH /user/1/follow
  try {
    const user = await User.findOne({ where: { id: req.params.userId } });
    if (!user) {
      res.status(403).send("없는 사람을 팔로우하려고 하시네요?");
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
};
```

### 5-21. 이미지 업로드를 위한 multer

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
  storage: multer.diskStorage({
    // diskStorage: 컴퓨터의 하드디스크
    destination(req, file, done) {
      // 나중엔 AWS S3같은 클라우드에다가 저장한다.
      done(null, "uploads");
    },
    filename(req, file, done) {
      // 제로초.png
      const ext = path.extname(file.originalname); // 확장자 추출(.png)
      const basename = path.basename(file.originalname, ext); // 제로초
      done(null, basename + new Date().getTime() + ext); // 제로초15184712891.png
    },
  }),
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
});

// 이미지 업로드 후에 실행
router.post(
  "/images",
  isLoggedIn,
  upload.array("image"),
  async (req, res, next) => {
    // POST /post/images
    console.log(req.files); // 업로드된 이미지 정보들
    res.json(req.files.map((v) => v.filename));
  }
);
```

- input file에서 설정한 name 값 image가 라우터의 upload.array('image')로 전달된다.
  - array인 이유는 이미지를 여러장 올릴 수 있게 하기 위해서다.
  - 한 장만 올릴 꺼라면 upload.single('image')을 사용
  - 이미지가 아니라 텍스트 json이라면 upload.none()
  - input file이 2개 이상 있을 경우 upload.fields([])를 쓰면 된다.

### 6-1. 서버사이드렌더링 준비하기

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
import { END } from "redux-saga";
import wrapper from "../store/configureStore";

// 프론트 서버에서 실행 (브라우저 X)
export const getServerSideProps = wrapper.getServerSideProps(
  async (context) => {
    context.store.dispatch({
      type: LOAD_USER_REQUEST,
    });
    context.store.dispatch({
      type: LOAD_POSTS_REQUEST,
    });
    context.store.dispatch(END);
    await context.store.sagaTask.toPromise();
  }
);
```

### 6-2. SSR시 쿠키 공유하기

- SSR의 주체는 프론트서버에서 백엔드 서버로 보내는 것
  - 브라우저는 개입 조차 못한다.
  - 서버에서 서버로 보내면 쿠키는 자동으로 보내는 것이 아니다. axios에다가 직접 넣어서 보내줘야 한다.

```js
import axios from "axios";

export const getServerSideProps = wrapper.getServerSideProps(
  async (context) => {
    const cookie = context.req ? context.req.headers.cookie : "";
    axios.defaults.headers.Cookie = "";
    if (context.req && cookie) {
      axios.defaults.headers.Cookie = cookie;
    }
    // ...
  }
);
```

### 6-5. CSS 서버사이드렌더링

```command
npm i next
npm i babel-plugin-styled-components
```

```json (.babelrc)
{
  "preset": ["next/babel"],
  "plugins": [
    [
      "babel-plugin-styled-components",
      {
        "ssr": true,
        "displayName": true
      }
    ]
  ]
}
```

### 6-6. 사용자 게시글 해시태그 게시글

```js
encodeURIComponent("리액트");
// '%EB%A6%AC%EC%95%A1%ED%8A%B8'

decodeURIComponent("%EB%A6%AC%EC%95%A1%ED%8A%B8");
// 리액트
```

### 6-7. getStaticPaths

- 다이나믹 라우팅일 때 getStaticProps를 사용하면 무조건 getStaticPaths가 있어야 한다.

### 6-8. swr 사용해보기

```command
npm i swr
```

```js
import useSWR from "swr";
```

- SSR 처리가 필요 없는 dispatch
- SWR도 SSR이 된다.

```js

```

### 6-10. moment와 next 빌드하기

```command
npm i moment
```

- 서버에 배포 이전에 빌드를 한다.
- 빌드를 하면 html, css, js로 결과물이 나온다.
- 웹서버로 그 결과물들을 올려두면 사용자들의 브라우저로 전달된다.

```command
npm run build
```

- 코드를 바꾸면 Github에 푸쉬를 한다.
- CI/CD 도구로 코드에 대한 테스트와 빌드를 해준다. (젠킨스, 써클CI, 트레비스CI)
- AWS 서버로 배포를 해준다.

- 빌드를 하면 페이지 파일별로 λ, ○, ● 표시가 붙는다.
  - λ(람다): getServerSideProps, SSR 페이지들
  - ●: getStaticProps, 미리 html 파일로 만들어져 있는 페이지들
  - ○: 정적 페이지, 404, 500 에러페이지들을 커스텀할 수 있다.
    - [Next - Custom Error Page](https://nextjs.org/docs/advanced-features/custom-error-page)

### 6-11. 커스텀 웹팩과 bundle-analyzer

```command
npm i @next/bundle-analyzer@9.4.4
```

- [Next - next.config.js - Custom Webpack Config](https://nextjs.org/docs/api-reference/next.config.js/custom-webpack-config)
- [Github - next-bundle-analyzer](https://github.com/vercel/next.js/tree/canary/packages/next-bundle-analyzer)

- process.env 설정하는 방법: package.json의 scripts 부분을 수정해주면 된다.

```command
npm i cross-env
```

```json (package.json)
{
  "scripts": {
    "build": "cross-env ANALYZE=true NODE_ENV=production next build"
  }
}
```

- 만약 노드 버전이 12버전이면 빌드가 안될 수 있다. 노드 16버전으로 업그레이드 빌드 성공

### 7-1. aws 배포하기

- aws, S3, lamda
- 서버는 컴퓨터이다. 자기 컴퓨터로 하면 관리가 잘 안되니깐, 남의 컴퓨터(호스팅이나 클라우드)를 사용한다.
- 구글 클라우드도 있지만 aws가 점유율이 높다.
- aws 내 계정 : heroyooi1018@gmail.com
- aws 지역은 미국 동부(버지니아 북부) us-east-1 로 설정, 실서비스 할땐 아시아 태평양(서울)로 설정해야한다.

#### 인스턴스 생성

- [AWS 관리 콘솔](https://console.aws.amazon.com)
- EC2 > 인스턴스 시작 > Ubuntu Server 18.04 LTS(프리티어 사용 가능) > 검토 및 시작
  - 백엔드 서버는 mysql 버전 문제로 인해서 Ubuntu Server 20.04 LTS(프리티어) 로 진행
  - 실무에선 프리티어가 성능도 낮고 제한적이다. 초기 단계 서비스는 가능하다.
  - 실무에선 "3. 인스턴스 구성"에서 모니터링 활성화가 필요하다.
  - "6. 보안 그룹 구성"에서 규칙 추가 HTTP(80), HTTPS(443)
    - SSH 소스 IP는 우리 집 IP로 해서 해커들이 접근하지 못하도록 막는 것이 좋다.
  - "7. 검토"에서 시작하기 누르면 키 페어 설정
    - 새 키 페어 생성 SELECT, 키 페어 이름은 react-nodebird-aws, 키 페어 다운로드 클릭
      - react-nodebird-aws.pem 파일이 다운로드 폴더에 생성됨, react-nodebird 루트 폴더로 이동
      - react-nodebird-aws.pem 파일은 git 에 올리면 안됨
    - 인스턴스 시작 클릭
- EC2 > 리소스 > 인스턴스(실행 중)
  - Name을 front로 변경
- 위와 같은 방식으로 인스턴스 하나 더 생성
  - "7. 검토"에서 시작하기 누르고 키 페어 설정에서 기존 키 페어 선택 (react-nodebird-aws | RSA), 체크박스 활성화 이후 인스턴스 시작 클릭
  - Name을 back으로 변경

* 무료 인스턴스이긴 하지만 무료 쿼터가 초과되면 비용이 발생할 수 있다. 1달에 인스턴스 하나당 15,000원
* 실습할 때만 서버를 켜두고, 그 이외 시간엔 작업 SELECT 에서 인스턴스 상태 설정 > 중지 OR 종료

- gitignore 항목에 필수로 추가 해야할 4가지

  - react-nodebird-aws.pem
  - node_modules
  - .env
  - .next

#### aws 서버 접근 및 설치

- aws에다가 소스코드를 보낼껀데, ftp 방식으로 보낼수도 있고, git 저장소를 통해서 다운받게 할 수 있다.

#### front 서버(리눅스)에 nodejs 설치

- 인스턴스 front 선택 후 연결 클릭 > SSH 클라이언트의 주소 복사
- pem키가 있는 경로(저장소 루트)에서 아래 명령어를 통해 pem 키를 사용해서 원격에 있는 AWS EC2서버로 접근함

```command
ssh -i "react-nodebird-aws.pem" ubuntu@ec2-3-226-66-187.compute-1.amazonaws.com
```

- Are you sure you want to continue connecting? yes

```command
git clone https://github.com/heroyooi/react-nodebird
```

- ubuntu는 폴더 기반이라서 특정 폴더에 들어있다.
  - pwd 명령어로 어느 폴더 안에 들어있는지 알 수 있다.
  - ls 명령어로 현재 경로에서 폴더를 확인할 수 있다.
  - ls -al 명령어로 자세하게 볼 수 있다.
  - ls -a 숨겨진 파일 조회 (.env)

```command
cd react-nodebird
ls
cd front
ls -al
git pull
```

- [데비안과 우분투 기반 리눅스에서 nodejs 설치법](https://nodejs.org/ko/download/package-manager/#debian-and-ubuntu-based-linux-distributions-enterprise-linux-fedora-and-snap-packages)
- [공식 Node.js 바이너리 배포 NodeSource](https://github.com/nodesource/distributions/blob/master/README.md)

- 리눅스 명령어 5줄 그대로 실행

```command
sudo apt-get update
sudo apt-get install -y build-essential
sudo apt-get install curl
curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash --
sudo apt-get install -y nodejs
```

- 잘 설치되었는지 확인

```command
node -v
npm -v
```

```command
npm i
```

#### back 서버(리눅스)에 nodejs 설치

- 인스턴스 back 선택 후 연결 클릭 > SSH 클라이언트의 주소 복사
- pem키가 있는 경로(저장소 루트)에서 아래 명령어를 통해 pem 키를 사용해서 원격에 있는 AWS EC2서버로 접근함

```command
ssh -i "react-nodebird-aws.pem" ubuntu@ec2-50-16-186-189.compute-1.amazonaws.com
```

- Are you sure you want to continue connecting? yes

```command
git clone https://github.com/heroyooi/react-nodebird
cd react-nodebird
cd back

sudo apt-get update
sudo apt-get install -y build-essential
sudo apt-get install curl
curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash --
sudo apt-get install -y nodejs

node -v
npm i
```

#### back 서버(리눅스)에 mysql 설치

- 원래는 mysql도 서버를 따로 두는 것이 좋다. 하지만 서버 3대를 연결하면 너무 복잡해지니, 이 예제에선 백엔드서버 안에다가 설치하도록 한다.

```command
sudo apt-get install mysql-server
```

- Ubuntu Server 18.04 LTS를 사용하면 기본 MySQL이 5버전으로 설치되므로, 백엔드서버는 Ubuntu Server 20.04 LTS를 사용해야 한다.
- Ubuntu Server 18.04 LTS에서 MySQL 5버전 설치 실패(강좌대로 했지만 안된다.)

```command
sudo su
mysql_secure_installation
y
0
```

- 사용자가 루트 바뀌고 비밀번호 재설정
- 나머지 질문들은 다 y로 선택
- 하지만 비번이 인식이 안되었다. 그래서 아래와 같이 비밀번호 재변경

```command
mysql -uroot -p
```

- 비번 입력하고 mysql 명령어 입력

```command
mysql> ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'qwer1234';
```

- 빠져나오려면 exit

```command
mysql> exit;
```

- react-nodebird DB의 테이블 조회

```command
mysql> use react-nodebird;
mysql> show tables;
```

- DB 지우기

```command
mysql> DROP DATABASE `react-nodebird`;
```

- back 폴더의 package.json에 스크립트 "start": "node app" 추가

```command
git pull
npm start
```

- 에러가 나는데 이유는 .env 파일이 back 폴더 안에 없기 때문

```command
vim .env
```

- a로 insert 모드에서 작성 후 ESC 키로 편집모드에서 빠져나간 이후 :wq 로 저장 후 종료, :q는 그냥 종료

```command
cat .env
```

- .env를 제대로 작성했는지 확인

```command
npx sequelize db:create
npm start
```

- 포트 번호가 3065이므로 80으로 변경해줘야한다.

```command
vim app.js
```

- app.js 포트 번호 부분 수정

```js
app.listen(80, () => {
  console.log("서버 실행 중 !!!");
});
```

```command
npm start
```

- [back 서버 확인](http://54.221.180.194)

##### pm2, 포그라운드 프로세스가 아닌 백그라운드 프로세스로 실행

```command
npm i pm2
```

- pm2 설치 후 scripts의 start 명령어 변경

```json (package.json)
{
  "scripts": {
    "start": "pm2 start app.js"
  }
}
```

#### 백엔드 서버 구동

- 루트에서만 80번 포트에 접근 권한이 있기 때문에 sudo 명령어로 실행을 해줘야 한다.

```command
sudo npm start && sudo npx pm2 monit
```

- 서비스가 pm2로 시작된다.
  - 포그라운드로 실행 했으면 서버 구동하느라 다른 명령어를 실행할 수 없다.

```command
sudo npx pm2 reload all
```

- 서버 재기동

#### 기타 pm2 명령어

- pm2 끄기

```command
sudo npx pm2 kill
```

- pm2 항목 조회

```command
sudo npx pm2 list
```

- app.js 실행

```command
sudo npx pm2 start app.js
```

```command
sudo npx pm2 reload all
```

- 우분투 리눅스는 루트와 일반 사용자를 넘나들 수 있고, 루트와 일반 사용자의 권한이 다르다.

##### 리눅스 서버에서 git pull 하다가 충돌이 나는 경우

```command
git reset --hard
git pull
```

#### 프론트 서버(리눅스)에 빌드

```command
npm run build
npm start
npx pm2 monit
```

- 메모리가 모자르면 build가 안될 수도 있다. aws에서 임대한 컴퓨터는 메모리가 1GB 밖에 안되기 때문에 그럴 가능성이 있다. 그럴때는 인스턴스에서 메모리를 늘려주어야 한다.

- 계속해서 소스 코드를 서버로 배포하는 과정
  - 깃헙으로 소스를 보냄
  - 원격 서버에 접속해서 소스를 받음
  - (원격 서버) npm이 추가되어 있을 수 있으니 npm i를 실행해줌
  - (원격 서버) npm run build
  - (원격 서버) npm start
- 이런 걸 대신해주는 CI/CD 툴을 사용한다.

- sudo apt-get update 이런 명령어를 하나씩 수동하는 것이 귀찮으면 도커를 배우면 좋다.
- 서버 한대 띄우면 도커에 명령어를 싹 적어놓고, 도커 실행되면 명령어가 알아서 하나씩 실행되면서 기존 서버와 똑같은 서버를 만들어냄

#### nginx

- front는 next(3060) 서버가 구동되고, back은 express(3065) 서버가 구동됨
- nginx(80)으로 요청이 들어오면 next(3060) & express(3065) 로 요청을 보내준다.
- 왜 이렇게 하냐면? https(443) 요청이 들어오면 SSL을 붙여서 다시 next(3060) & express(3065) 로 요청을 보내준다.

- front, back에 nginx 설치

```command
sudo apt-get install -y nginx
vim /etc/nginx/nginx.conf
```

- 부분 수정 (back)

```conf
{
        ##
        # Virtual Host Configs
        ##

        include /etc/nginx/conf.d/*.conf;
        include /etc/nginx/sites-enabled/*;
        server {
                server_name api.nodebird.tk;
                listen 80;
                location / {
                        proxy_set_header HOST $host;
                        proxy_pass http://127.0.0.1:3065;
                        proxy_redirect off;
                }
        }
}
```

- 부분 수정 (front)

```conf
{
        ##
        # Virtual Host Configs
        ##

        include /etc/nginx/conf.d/*.conf;
        include /etc/nginx/sites-enabled/*;
        server {
                server_name nodebird.tk;
                listen 80;
                location / {
                        proxy_set_header HOST $host;
                        proxy_pass http://127.0.0.1:3060;
                        proxy_redirect off;
                }
        }
}
```

```command
systemctl status nginx.service
```

- nginx 에러 체크

```command
lsof -i tcp:80
kill -9 10015
```

- 80번 포트 사용처가 있으면 pid 조회 및 제거

```command
systemctl start nginx
systemctl restart nginx
```

- 고대디, 가비아, 후이즈 같은 업체에서 도메인을 구매
- 도메인을 사면 네임서버를 준다. 거기서 네임 서버를 알아낸다.

- Route 53 > 호스팅 영역 > 호스팅 영역 생성
- 도메인 이름: nodebird.tk
- 호스팅 영역을 생성하면 해당 레코드(nodebird.tk) NS 유형의 값들로, 위에서 알아낸 네임 서버들을 바꿔준다.

  - 예시) AWS DNS
  - ns-864.awsdns-44.net.
  - ns-455.awsdns-56.com.
  - ns-1938.awsdns-50.co.uk.
  - ns-1172.awsdns-18.org.
  - 도메인에 대한 관리권을 aws로 넘긴다.

- [freenom](https://www.freenom.com/en/index.html?lang=en)
- freenom에서 무료 도메인 생성 및 dns 네임서버 aws 정보로 입력

#### 프론트 서버(리눅스) 구동

- package.json 파일의 scripts start 부분 아래와 같이 수정

```json
{
  "scripts": {
    "start": "cross-env NODE_ENV=production next start -p 3060"
  }
}
```

- ssh 로 프론트 서버 원격 접속해서 아래 명령어 실행

```command
npx pm2 start npm --name "next" --start
```

- 서버 구동 잘됐는지 확인 및 에러 확인

```command
npx pm2 monit
```

- 재부팅

```command
npx pm2 reload all
```

- 재부팅 확인

```command
npx pm2 list
```

- nginx 를 너무 빨리 붙여서 문제가 생김.
- 도메인을 먼저 붙이면 HSTS로 인해 문제가 생긴다. (IP인 상태에서 접속을 해야 진행 가능)

```command
sudo su
lsof -i tcp:80
```

- nginx PID(29917) 확인 후 kill

```command
kill -9 29917
lsof -i tcp:80
```

- 네트워크 및 보안 > 탄력적 IP > 체크 후 작업 클릭 > 탄력적 IP 주소 연결 해제 및 릴리스

### 7-2. aws 배포하기

#### 서버 환경에 맞춰서 주소 수정

- front/sagas/index.js

```js
axios.defaults.baseURL = "http://localhost:3065"; // 개발환경에서 주소
axios.defaults.baseURL = "http://54.83.184.155"; // 백엔드 IP로 변경
```

- back/app.js

```js
app.use(
  cors({
    origin: ["http://localhost:3060", "nodebird.tk", "http://54.89.161.117"], // 프론트 IP 추가
    credentials: true,
  })
);
```

- 프론트는 소스가 바뀌면 빌드과정이 꼭 필요하다. 백엔드는 필요 없음

#### 프론트 서버 기동

```command
npm run build
npx pm2 start npm -- start
```

- pm2를 통해서 npm start

#### 백엔드 서버(리눅스) 기동

```command
sudo npm start
sudo npx pm2 monit
```

- 백엔드 서버 pm2로 기동 및 모니터링

```command
sudo npx pm2 reload all
```

- 백엔드 서버 재기동

### 7-3. aws s3 & lambda

- CORS는 해결되어서 로그인은 가능해졌으니, 쿠키가 저장이 되지 않는다.
- Response Headers의 Set-Cookie가 있으면 브라우저에 쿠키를 넣어주는데, Domain이 valid하지 않아서 에러가 쿠키가 세팅되지 않는다.
  - Network > Headers > General > Request URL(요청을 보낸 곳) 이랑,
    Network > Headers > Response Headers의 Set-Cookie의 Domain(or Access-Control-Allow-Origin)이 다르면 쿠키가 공유되지 않는다. 그래서 nodebird.tk 로 통일을 해줘야 한다.

#### 도메인

- 1년 단위로 빌리는 개념,
  - Gabia는 1년 도메인 22,000원
  - freenom은 1년간 공짜
- 네임서버 설정: aws의 Route 53의 네임서버 정보를 사용하는 도메인 업체의 DNS 네임서버 설정에 등록

  - 예) aws의 Route 53 레코드 생성 화면
    <img src="aws_route53.png" />

  - 예) freenom의 DNS 네임서버 설정 화면
    <img src="freenom_name_server.png" />

#### 탄력적 IP

- 네트워크 및 보안 > 탄력적 IP > 탄력적 IP 주소 할당 (2개 생성)
- ★ 탄력적 IP는 인스턴스랑 연결하면 무료인데, 인스턴스 지우고 탄력적 IP만 남아있으면 비용이 생긴다. 그래서 인스턴스를 지우고 탄력적 IP도 같이 지워줘야 한다.
- 할당 IP 체크 후 작업 SELECT > 탄력적 IP 주소 연결 > 인스턴스 조회 후 선택해서 연결 클릭
- 탄력적 IP를 인스턴스에 연결하면 퍼블릭 IPv4 주소가 고정된다.
  - front: 34.237.177.46
  - back: 35.175.156.100

##### 탄력적 IP로 인해 주소가 바뀌었으니 다시 인스턴스 ssh 연결

- front 인스턴스 ssh

```command
ssh -i "react-nodebird-aws.pem" ubuntu@ec2-34-237-177-46.compute-1.amazonaws.com
```

- back 인스턴스 ssh

```command
ssh -i "react-nodebird-aws.pem" ubuntu@ec2-35-175-156-100.compute-1.amazonaws.com
```

#### Route 53 > 호스팅 영역 > nodebird.tk

- 레코드 생성 > 레코드 (유형: A + 값: 34.237.177.46)
- 레코드 생성 > 레코드 (이름: api + 레코드 유형 A + 값 35.175.156.100)

- www.nodebird.tk 등록하고 싶으면 레코드 생성 > 레코드 (이름: www + 유형: CNAME)

- DNS 등록 성공하면
- [등록한 API 주소](http://api.nodebird.tk)

#### 소스 변경 이후 AWS 리눅스 back 서버 재기동

- back 패키지 2개 더 설치 및 app.js 로직 수정

```command
npm i helmet hpp
```

```js
if (process.env.NODE_ENV === "production") {
  app.use(morgan("combined"));
  app.use(hpp());
  app.use(helmet({ contentSecurityPolicy: false }));
  app.use(
    cors({
      origin: "http://nodebird.tk",
      credentials: true,
    })
  );
} else {
  app.use(morgan("dev"));
  app.use(
    cors({
      origin: true,
      credentials: true,
    })
  );
}

app.use(
  session({
    saveUninitialized: false,
    resave: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
      httpOnly: true,
      secure: false,
      domain: process.env.NODE_ENV === "production" && ".nodebird.tk",
    },
  })
);
```

- 위 소스 수정으로 인하여 프론트 & 백엔드 간 쿠키 공유 가능해짐
  - 예) Network > Headers
    <img src="resolve_cookie.png" />
- back 소스 수정 이후 원격 저장소로 커밋 & 푸쉬
- AWS 리눅스 back 서버 소스 반영 및 재기동

```ssh
sudo git pull
sudo npx pm2 reload all
```

#### AWS 리눅스 back 서버 기동 관련 pm2 명령어

- 만약 소스 머지가 안되면

```ssh
sudo git reset --hard
sudo git pull
sudo npx pm2 reload all
```

- 재기동 잘 되고 있는지 확인

```ssh
sudo npx pm2 list
```

- 서버 죽이기

```ssh
sudo npx pm2 kill
```

#### AWS S3 이미지 업로드

- 강좌 7-3, 18:20 부터 시작
- S3 > 버킷 만들기 클릭

  - 버킷 이름: react-nodebird-tk (react-nodebird-s3, 강좌 버킷 이름)
  - 모든 퍼블릭 액세스 차단 체크 해제
    - 체크 해제해야 프론트 브라우저에서 S3 저장소에 접근할 수 있음

- S3 > 버킷 > 권한 > 버킷 정책 편집 클릭

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AddPerm",
      "Effect": "Allow",
      "Principal": "*",
      "Action": ["s3:GetObject", "s3:PutObject"],
      "Resource": "arn:aws:s3:::react-nodebird-tk/*"
    }
  ]
}
```

- 위와 같이 수정하면 버킷 정책이 퍼블릭으로 바뀐다.
- Resource의 react-nodebird-tk는 내 버킷명이어야함

##### 엑세스 키 생성

- 우측 상단 heroyooi > 보안 자격 증명 클릭
- 액세스 키 > 새 액세스 키 만들기 클릭 > 키 파일 다운로드 버튼 클릭 (rootkey.csv 파일 다운로드 됨)
  - csv 파일은 .env에 넣어두고, 남들에게 노출되면 안된다.
- .env 파일에 S3 두가지 항목 추가

```env
COOKIE_SECRET=nodebirdsecret
DB_PASSWORD=qwer1234
S3_ACCESS_KEY_ID=AKIAZVBOFDPQKZCRY2M2
S3_SECRET_ACCESS_KEY=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
```

##### 로컬 백엔드 서버 s3 설치 및 로직 수정

```command
npm i multer-s3 aws-sdk
```

- multer-s3 는 multer를 사용해서 s3로 한번에 올려주는 것
- aws-sdk 는 s3 접근권한을 얻어서 s3에 연결할 수 있도록 해준다.

```js (back/routes/post.js)
const multerS3 = require("multer-s3");
const AWS = require("aws-sdk");

AWS.config.update({
  accessKeyId: process.env.S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  region: "us-east-1",
});

const upload = multer({
  storage: multerS3({
    s3: new AWS.S3(),
    bucket: "react-nodebird-tk", // 버킷명
    key(req, file, cb) {
      cb(null, `original/${Date.now()}_${path.basename(file.originalname)}`);
    },
  }),
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
});

router.post("/images", isLoggedIn, upload.array("image"), (req, res, next) => {
  res.json(req.files.map((v) => v.location));
});
```

- 기존 multer에서 diskStorage 로 저장했던 방식에서 S3로 저장하도록 로직 부분 수정
- region
  - 미국 동부(버지니아 북부): us-east-1
  - 아시아 태평양(서울): ap-northeast-2
- 프론트에서도 backUrl이 들어갔던 이미지 경로 부분에서 s3 고유 경로로 바뀌기 때문에 backUrl을 제거 해줘야한다.

## 참고 링크

- [Next 공식문서](https://nextjs.org)
- [강좌 저장소](https://github.com/ZeroCho/react-nodebird)
- [aws](https://aws.amazon.com/ko)

## 강좌 7-3
