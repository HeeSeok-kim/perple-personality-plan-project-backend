import { Injectable } from '@nestjs/common';
import { Feed } from '../../db/models/feed.models';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'src/db/models/user.models';
import { Comment } from 'src/db/models/comment.models';
import { Sequelize } from 'sequelize-typescript';
import { Op } from 'sequelize';
import { GroupUser } from '../../db/models/groupUser.models';
import { Group } from '../../db/models/group.models';

@Injectable()
export class CommentRepository {
  constructor(
    @InjectModel(Feed)
    private feedModel: typeof Feed,
    @InjectModel(User)
    private userModel: typeof User,
    @InjectModel(Comment)
    private commentModel: typeof Comment,
  ) {}

  async findComment(commentId) {
    return this.commentModel.findOne({
      raw: true,
      where: { comment_id: commentId },
      attributes: [
        'comment_id',
        'user_id',
        'feed_id',
        [Sequelize.col('user.nickname'), 'nickname'],
        'comment',
        'updated_at',
      ],
      include: [
        {
          model: User,
          as: 'user',
          attributes: [],
        },
      ],
    });
  }

  async createComment(userId: number, feedId: number, body: object) {
    return this.commentModel.create({
      user_id: userId,
      feed_id: feedId,
      ...body,
    });
  }

  async deleteComment(commentId, userId) {
    return this.commentModel.destroy({
      where: { commentId, userId },
    });
  }

  async getGroupComment(group_id, feed_id) {
    return this.commentModel.findAll({
      where: {
        ...feed_id,
        '$user.groupUser.group_user_id$': { [Op.ne]: null },
      },
      include: [
        {
          model: User,
          required: false,
          include: [
            {
              model: GroupUser,
              as: 'groupUser',
              attributes: [],
              include: [{ model: Group, attributes: [] }],
              where: { ...group_id },
            },
          ],
          attributes: [],
        },
      ],
      attributes: [
        'comment_id',
        'user_id',
        'feed_id',
        'comment',
        [Sequelize.col('user.nickname'), 'nickname'],
        [Sequelize.col('user.groupUser.group_user_id'), 'group_user_id'],
        [Sequelize.col('user.profile_img'), 'profile_img'],
        'created_at',
        'updated_at',
      ],
      order: [['created_at', 'DESC']],
      raw: true,
    });
  }
}