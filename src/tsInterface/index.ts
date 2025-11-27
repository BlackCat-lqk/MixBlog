/**
 * @description: 用户信息编辑接口类型
 */
export interface SetUserInfoEditFormType {
  _id: string
  userName: string
  email: string
  desc: string
  avatar: string
  sex: string
  birthday: null
}

/**
 * @description: 首页接口类型
 */
export interface HomeDataBannerDataType {
  title: string
  sub: string
  introduction: string
  mainBtnName: string
  childBtnName: string
  mainBtnUrl: string
  childBtnUrl: string
  cover: string
}

/**
 * @description: 首页文章接口类型
 */
export interface HomeArticleBlogType {
  status: string
}

/**
 * @description: 首页图库接口类型
 */
export interface Comment {
  _id: string
  userId: string
  userName: string
  avatar: string
  content: string
  parentId: string | null
  createdAt: string
  children?: Comment[]
}

export interface LikeView {
  userId: string
  userName: string
  email: string
  viewedAt: string
  likedAt: string
}
export interface HomePhotoItemType {
  _id: string
  title: string
  photos: string[]
  content: string
  createdAt: string
  category: string
  comments: Comment[]
  likes: LikeView[]
  views: LikeView[]
}

/**
 * @description: 首页随记接口类型
 */
export interface HomeNotesType {
  id: string
  title: string
  content: string
  updatedAt: string
  weather: string
  cover: string
}

/**
 * @description: 关于页接口类型
 */
interface modulesType {
  title: string
  content: string
  image: string[]
}
export interface aboutDataType {
  intro: string
  tags: string
  cover: string
  audio: string
  modules: [modulesType]
}

/**
 * @description: 文章页接口类型
 */
export interface ILikeView {
  userId: string
  userName: string
  email: string
  viewedAt: string
  likedAt: string
}

export interface IarticleDetailType {
  _id: string
  title: string
  content?: string
  intro: string
  category: string
  createdAt: string
  tags: string[]
  comments: IComment[]
  likes: ILikeView[]
  views: ILikeView[]
}

export interface IComment {
  _id: string
  userId: string
  userName: string
  avatar: string
  content: string
  parentId: string | null
  createdAt: string
  children?: IComment[]
}

/**
 * @description: 书籍文档页接口类型
 */
export interface IBookDocData {
  _id: string
  filename: string
  category: string
  path: string
  size: number
  updatedAt: string
  suffix: string
  description: string
  docCover: string
}

/**
 * @description: MIXAI页接口类型
 */
export interface IChatMessage {
  role: 'user' | 'assistant'
  content: string
}

/**
 * @description: 封面立绘接口类型
 */
export interface IMarqueeProps {
  items: string[]
  direction?: 'left' | 'right'
  speed?: number // px/s
  itemWidth?: number
  itemHeight?: number
}

/**
 * @description: 图库页接口类型
 */
export interface ImageComment {
  _id: string
  userId: string
  userName: string
  avatar: string
  content: string
  parentId: string | null
  createdAt: string
  children?: ImageComment[]
}

export interface ImageLikeView {
  userId: string
  userName: string
  email: string
  viewedAt: string
  likedAt: string
}
export interface ImagePhotoDetailType {
  _id: string
  title: string
  content: string
  category: string
  createdAt: string
  photos: string[]
  comments: ImageComment[]
  likes: ImageLikeView[]
  views: ImageLikeView[]
}

/**
 * @description: 随笔随记页接口类型
 */
export interface INotesType {
  id: string
  title: string
  content: string
  updatedAt: string
  weather: string
  cover: string
}
export interface IWeatherIcons {
  [key: string]: string
}

/**
 * @description: 登录注册页接口类型
 */
export interface ILoginFormType {
  email: string
  password: string
  rememberMe?: boolean
}
export interface IRegisterFormType {
  userName: string
  email: string
  password: string
  code: string
}

/**
 * @description: 站点导航页接口类型
 */
export interface INavFormValue {
  type: string
  primaryCategory: string
  secondaryCategory: string
  link: string
  siteName: string
  desc: string
  icon: string
}
export interface INavSiteData {
  siteName: string
  link: string
  desc: string
  icon: string
  _id: string
}
export interface INavPrimaryItem {
  secondaryCategory: string
  data: INavSiteData[]
}
export interface INavBlogSiteData {
  primaryCategory: string
  primaryItem: INavPrimaryItem[]
}
export interface INavSiteNav {
  primaryCategory: string
  primaryItem: []
}

/**
 * @description: 公共文章卡片组件接口类型
 */
export interface IArticleCardLikeView {
  userId: string
  userName: string
  email: string
  viewedAt: string
  likedAt: string
}

export interface IArticleCardArticleDetailType {
  _id: string
  title: string
  intro: string
  category: string
  createdAt: string
  tags: string[]
  comments: IArticleCardComment[]
  likes: IArticleCardLikeView[]
  views: IArticleCardLikeView[]
}

export interface IArticleCardComment {
  _id: string
  userId: string
  userName: string
  avatar: string
  content: string
  parentId: string | null
  createdAt: string
  children?: IArticleCardComment[]
}

/**
 * @description: 公共分类组件接口类型
 */
export interface IClassifyItem {
  name: string
  number: number
}

/**
 * @description: 公共评论组件接口类型
 */
export interface ICommentChat {
  _id: string
  userId: string
  userName: string
  avatar: string
  email?: string
  content: string
  parentId: string | null
  createdAt: string
  children?: Comment[]
}

/**
 * @description: 公共反馈组件接口类型
 */
export interface IFeedbackType {
  value: string
  label: string
}

export interface IFeedbackFormData {
  feedbackType: string
  subject: string
  description: string
  screenshots: string[] | []
  environment: {
    url: string
    userAgent: string
    viewport: string
    timestamp: string
  }
  contact: string
}

export interface IFeedbackProps {
  positionBottom?: number
  positionRight?: number
  title?: string
  apiUrl?: string
}
