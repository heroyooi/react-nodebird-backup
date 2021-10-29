export const initialState = {
  mainPosts: [
    {
      id: 1,
      User: { id: 1, nickname: "제로초" },
      content: "첫 번째 게시글 #해시태그 #익스프레스",
      Images: [
        {
          src: "https://ww.namu.la/s/c9b792fe86b7a8148a24d0454d0d2e20dfbbbb7184ec13997ee7710a6f21799714c249924699e70702ee8d5ff13eadf7236334336dc076000c27258bb11bfc840793b5b464f55f822dd2cd4ce2e64e838e44e5071590684c19d2b09aea2ab073",
        },
        {
          src: "https://ww.namu.la/s/392a93e0518b2e7f4b08d63326269afbafb05c6e4f3f48c2487cd8b84f6a0ffc5158b87cb8adf0dd52985a5d5c8a93683645ce796b7596c2b310c47e458e9134a325d9d8f14dccd4ca93a39c50952ee76fed1d8ece78eb8bd19648b0313570a8",
        },
        {
          src: "https://dcimg4.dcinside.co.kr/viewimage.php?no=24b0d769e1d32ca73deb87fa11d02831de04ca5aee4f7f339edb1c2bdb4278361f8581f59dee3e4765568fba1b71566d0559eaf11b633e6e6da657c04db89e8308ad3437318da2acc40f6018b9d7c68bd30a15698cf9a741580070dd26fab5eb74cd",
        },
      ],
      Comments: [
        {
          User: {
            nickname: "nero",
          },
          content: "우와 개정판이 나왔군요~",
        },
        {
          User: {
            nickname: "hero",
          },
          content: "얼른 사고싶어요~",
        },
      ],
    },
  ],
  imagePaths: [],
  addPostLoading: false,
  addPostDone: false,
  addPostError: null,
  addCommentLoading: false,
  addCommentDone: false,
  addCommentError: null,
};

export const ADD_POST_REQUEST = "ADD_POST_REQUEST";
export const ADD_POST_SUCCESS = "ADD_POST_SUCCESS";
export const ADD_POST_FAILURE = "ADD_POST_FAILURE";

export const ADD_COMMENT_REQUEST = "ADD_COMMENT_REQUEST";
export const ADD_COMMENT_SUCCESS = "ADD_COMMENT_SUCCESS";
export const ADD_COMMENT_FAILURE = "ADD_COMMENT_FAILURE";

export const addPost = (data) => ({
  type: ADD_POST_REQUEST,
  data,
});

export const addComment = (data) => ({
  type: ADD_COMMENT_REQUEST,
  data,
});

const dummyPost = {
  id: 2,
  content: "더미데이터입니다.",
  User: {
    id: 1,
    nickname: "제로초",
  },
  Images: [],
  Comments: [],
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_POST_REQUEST:
      return {
        ...state,
        addPostLoading: true,
        addPostDone: false,
        addPostError: null,
      };
    case ADD_POST_SUCCESS:
      return {
        ...state,
        mainPosts: [dummyPost, ...state.mainPosts],
        addPostLoading: false,
        addPostDone: true,
      };
    case ADD_POST_FAILURE:
      return {
        ...state,
        addPostLoading: false,
        addPostError: action.error,
      };
    case ADD_COMMENT_REQUEST:
      return {
        ...state,
        addCommentLoading: true,
        addCommentDone: false,
        addCommentError: null,
      };
    case ADD_COMMENT_SUCCESS:
      return {
        ...state,
        addCommentLoading: false,
        addCommentDone: true,
      };
    case ADD_COMMENT_FAILURE:
      return {
        ...state,
        addCommentLoading: false,
        addCommentError: action.error,
      };
    default:
      return state;
  }
};

export default reducer;
