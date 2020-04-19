const slugify = require("slugify");

const Category = require("../models/category");

exports.category_create = async function(req, res, next) {
  try {
    const { name, description } = req.body;

    const slug = slugify(name, { lower: true });

    let category = new Category({
      dateCreated: new Date().toISOString(),
      dateUpdated: new Date().toISOString(),
      name,
      slug,
      description,
    });

    category.save(function(err) {
      if (err) {
        console.log(err);
        return next(err);
      }
      res.message = {
        type: "info",
        text: "Category " + name + " created with success!",
      };
      res.status(200).redirect("/admin/categories");
    });
  } catch (error) {
    return next(error);
  }
};

exports.category_update = async function(req, res, next) {
  try {
    const { name, description, categoryId, posts } = req.body;
    console.log({ name, description, categoryId, posts });
    const slug = slugify(name, { lower: true });

    const filter = {
      _id: categoryId,
    };
    const update = {
      name,
      slug,
      description,
      dateUpdated: new Date().toISOString(),
      posts,
    };

    let newCategory = await Category.findOneAndUpdate(filter, update, {
      new: true,
    });

    if (!newCategory) {
      throw new Error({
        error: true,
        message: "newCategory " + categoryId + " not found",
      });
    } else {
      res.status(200).json({
        error: false,
        message: "Updated category " + categoryId + " with success!",
        category: newCategory,
      });
    }
  } catch (error) {
    return next(error);
  }
};

exports.category_delete = async function(req, res, next) {
  return new Promise(async (resolve, reject) => {
    try {
      await Category.deleteOne({ _id: req.body.categoryId }, function(err) {
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
