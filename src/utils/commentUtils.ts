export interface Comment {
  _id: string
  userId: string
  userName: string
  avatar: string
  email?: string
  content: string
  parentId: string | null
  createdAt: string
  children?: Comment[] // 用于前端构建的树状结构
}

/**
 * 将扁平的评论数组转换为树状结构
 * @param comments 扁平的评论数组
 * @returns 树状结构的评论数组
 */
export function buildCommentTree(comments: Comment[]): Comment[] {
  // 创建映射以便快速查找
  const commentMap: Record<string, Comment> = {};

  // 初始化所有评论，添加 children 数组
  comments.forEach(comment => {
    commentMap[comment._id] = { ...comment, children: [] };
  });

  const rootComments: Comment[] = [];

  // 构建树状结构
  comments.forEach(comment => {
    const commentNode = commentMap[comment._id];

    if (!comment.parentId) {
      // 主评论
      rootComments.push(commentNode);
    } else {
      // 回复评论，添加到父评论的 children 中
      if (commentMap[comment.parentId]) {
        commentMap[comment.parentId].children!.push(commentNode);
      }
    }
  });

  return rootComments;
}

/**
 * 将嵌套的评论结构扁平化
 * @param comments 嵌套的评论数组
 * @returns 扁平化的评论数组
 */
export function flattenComments(comments: Comment[]): Comment[] {
  const result: Comment[] = [];

  function flatten(commentList: Comment[]) {
    commentList.forEach(comment => {
      result.push(comment);
      if (comment.children && comment.children.length > 0) {
        flatten(comment.children);
      }
    });
  }

  flatten(comments);
  return result;
}

/**
 * 格式化时间显示
 * @param date ISO时间字符串
 * @returns 格式化后的时间字符串
 */
export function formatTime(date: string): string {
  const d = new Date(date);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const minutes = Math.floor(diff / (1000 * 60));

  if (minutes < 1) {
    return '刚刚';
  } else if (minutes < 60) {
    return `${minutes}分钟前`;
  } else if (minutes < 24 * 60) {
    const hours = Math.floor(minutes / 60);
    return `${hours}小时前`;
  } else {
    const days = Math.floor(minutes / (24 * 60));
    if (days < 30) {
      return `${days}天前`;
    } else {
      return d.toLocaleDateString();
    }
  }
}
