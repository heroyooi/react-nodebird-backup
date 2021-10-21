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
  postAdded: false,
};

const ADD_POST = "ADD_POST";
export const addPost = {
  type: ADD_POST,
};

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
    case ADD_POST:
      return {
        ...state,
        mainPosts: [dummyPost, ...state.mainPosts],
        postAdded: true,
      };
    default:
      return state;
  }
};

export default reducer;
