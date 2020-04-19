const formidable = require("formidable");
const slugify = require("slugify");
const uuidV4 = require("uuid/v4");
const Post = require("../models/post");
const Categories = require("../models/category");

exports.article_delete = async function(req, res, next) {
  return new Promise(async (resolve, reject) => {
    try {
      await Post.deleteOne({ _id: req.body.postId }, function(err) {
        if (err) {
          throw new Error(err);
        }
        return resolve({ error: false, message: "Successful deletion" });
      });
    } catch (error) {
      return reject(error);
    }
  });
};

exports.article_create = async function(req, res, next) {
  try {
    const form = formidable({ multiples: true });
    const formData = await new Promise((resolve, reject) => {
      return form.parse(req, async (err, fields, files) => {
        if (err) {
          console.log(err);
          reject(err);
        }

        const { title, editorContent: editorContentJson } = fields;
        const editorContent = JSON.parse(editorContentJson);

        const slug = slugify(title, { lower: true });
        const easyId = `post_${uuidV4()}_${slug}_ec_${editorContent.time}`;
        const formFieldsToSave = {
          ...fields,
          easyId,
          slug,
          content: editorContent,
          files,
        };

        return resolve({
          message: "Post created with success!",
          postData: formFieldsToSave,
        });
      });
    });

    const { postData } = formData;
    const {
      title,
      easyId,
      slug,
      content,
      featuredImage: updatedFeaturedImage,
      categories,
      metas,
      postId,
    } = postData;

    const isUpdateMode = !!postId;

    if (isUpdateMode) {
      const filter = {
        _id: postId,
      };
      const newFeaturedImage = !!updatedFeaturedImage
        ? { featuredImage: JSON.parse(updatedFeaturedImage) }
        : {};
      const update = {
        title,
        slug,
        content,
        metas,
        ...newFeaturedImage,
        categories: JSON.parse(categories),
        dateUpdated: new Date().toISOString(),
      };

      let newPost = await Post.findOneAndUpdate(filter, update, {
        new: true,
      });

      console.log("CATEGORIES: ", categories);

      if (!newPost) {
        throw new Error({
          error: true,
          message: "Post " + postId + " not found",
        });
      } else {
        res.status(200).json({
          error: false,
          message: "Updated post " + postId + " with success!",
          post: newPost,
        });
      }
    } else {
      let post = new Post({
        easyId,
        dateCreated: new Date().toISOString(),
        dateUpdated: new Date().toISOString(),
        title,
        slug,
        content,
        featuredImage: JSON.parse(updatedFeaturedImage),
        categories: JSON.parse(categories),
        metas,
        author: {
          name: res.locals.currentUser.username,
        },
      });

      post.save(function(err) {
        if (err) {
          console.log(err);
          return next(err);
        }
        res.status(200).json({
          error: false,
          message: "Saved post " + postId + " with success!",
          post,
        });
      });
    }
  } catch (error) {
    console.log("ERROR SAVING POST : ", error);
    return next(error);
  }
};
