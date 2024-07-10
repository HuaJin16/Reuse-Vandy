const Post = require("../models/post.model");
const handleErrors = require("../utils/errors");
const Notification = require("../models/notification.model");
const SavedPost = require("../models/savedPost.model");
const User = require("../models/user.model");

// create a new user post using the Post model
const newPost = async (req, res) => {
  try {
    const post = await Post.create(req.body);
    return res.status(201).json(post);
  } catch (err) {
    const postErrors = handleErrors(err);
    return res.status(400).json({ postErrors });
  }
};

// delete a user post
const deletePost = async (req, res) => {
  try {
    // check if the post exists
    const post = await Post.findById(req.params.id);
    if (!post) throw Error("unavailable");

    // check if user is the owner of the post
    if (req.user.id !== post.userRef) throw Error("unauthorized");

    // retrieve the SavedPost document for the given post ID
    const savedPostDoc = await SavedPost.findOne({
      savedPosts: req.params.id,
    });

    if (savedPostDoc) {
      // get the recipient's details from the savedPostDoc
      const recipientId = savedPostDoc.userId.toString();
      const recipient = await User.findById(recipientId);
      const recipientName = `${recipient.firstName} ${recipient.lastName}`;

      // get the sender's details from the post
      const senderId = post.userRef.toString();
      const sender = await User.findById(senderId);
      const senderName = `${sender.firstName} ${sender.lastName}`;

      // create a notification for the deleted post
      const notification = new Notification({
        recipientId,
        recipientName,
        senderId,
        senderName,
        postInfo: {
          postId: req.params.id,
          title: post.title,
          imageUrls: post.imageUrls,
        },
        notifType: "post_deleted",
        read: false,
      });
      await notification.save();

      // emit the notification to all connected clients
      req.app.get("io").emit("new_notification");
    }

    await Post.findByIdAndDelete(req.params.id);
    res.status(200).json("Post deleted");
  } catch (err) {
    const postErrors = handleErrors(err);
    return res.status(400).json({ postErrors });
  }
};

// update an existing post
const editPost = async (req, res) => {
  try {
    // check if the post exists
    const post = await Post.findById(req.params.id);
    if (!post) throw Error("unavailable");

    // check if user is the owner of the post
    if (req.user.id !== post.userRef) throw Error("unauthorized");

    const editedPost = await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json(editedPost);
  } catch (err) {
    const postErrors = handleErrors(err);
    return res.status(400).json({ postErrors });
  }
};

// retrieve a post through its ID
const getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) throw Error("unavailable");
    res.status(200).json(post);
  } catch (err) {
    const postErrors = handleErrors(err);
    return res.status(400).json({ postErrors });
  }
};

// retrieves a list of posts based on query parameters
const getPosts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 2;
    const page = parseInt(req.query.page) || 1;
    const startIndex = (page - 1) * limit;
    const searchTerm = req.query.searchTerm || "";
    const sort = req.query.sort || "createdAt";
    const order = req.query.order || "desc";
    const category = req.query.category || "";
    const tagsQuery = req.query.tags ? req.query.tags.split(",") : [];

    // stores search criteria
    const query = {
      $and: [
        {
          $or: [
            { title: { $regex: searchTerm, $options: "i" } },
            { description: { $regex: searchTerm, $options: "i" } },
          ],
        },
      ],
    };

    if (category) {
      query.$and.push({ [category]: true });
    }

    if (tagsQuery.length > 0) {
      query.$and.push({ $or: tagsQuery.map((tag) => ({ [tag]: true })) });
    }

    const totalCount = await Post.countDocuments(query);
    const totalPages = Math.ceil(totalCount / limit);

    // fetches posts matching the user's searchTerm in title or description
    const posts = await Post.find(query)
      .sort({ [sort]: order })
      .limit(limit)
      .skip(startIndex);

    // calculate the range of posts being displayed
    const startRange = startIndex + 1;
    const endRange = Math.min(startIndex + posts.length, totalCount);
    let message = `${startRange}-${endRange} of ${totalCount} results for "${searchTerm}"`;
    if (totalCount === 0) {
      message = "";
    }

    return res.status(200).json({
      posts,
      postRange: message,
      totalPages,
    });
  } catch (err) {
    const postErrors = handleErrors(err);
    return res.status(400).json({ postErrors });
  }
};

module.exports = { newPost, deletePost, editPost, getPost, getPosts };
