const formidable = require("formidable");
const slugify = require("slugify");
const uuidV4 = require("uuid/v4");
const Post = require("../models/post");

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

        const slug = slugify(title);
        const easyId = `post_${uuidV4()}_${slug}_ec_${editorContent.time}`;
        const formFieldsToSave = {
          ...fields,
          easyId,
          slug,
          content: editorContent,
          files
        };

        return resolve({
          message: "Post created with success!",
          postData: formFieldsToSave
        });
      });
    });

    const { postData } = formData;
    const {
      title,
      easyId,
      slug,
      content,
      featuredImage,
      categories,
      metas
    } = postData;

    let post = new Post({
      easyId,
      dateCreated: new Date().toUTCString(),
      title,
      slug,
      content,
      featuredImage: JSON.parse(featuredImage),
      categories: JSON.parse(categories),
      metas,
      author: {
        name: res.locals.currentUser.username
      }
    });

    post.save(function(err) {
      if (err) {
        console.log(err);
        return next(err);
      }
      res.status(200).json(formData);
    });
  } catch (error) {
    console.log("ERROR SAVING POST : ", error);
    return next(error);
  }
};
