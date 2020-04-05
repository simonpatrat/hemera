const slugify = require("slugify");

const Category = require("../models/category");

exports.category_create = async function(req, res, next) {
  try {
    const { name, description } = req.body;

    const slug = slugify(name);

    let category = new Category({
      dateCreated: new Date().toUTCString(),
      name,
      slug,
      description
    });

    category.save(function(err) {
      if (err) {
        console.log(err);
        return next(err);
      }
      res.message = {
        type: "info",
        text: "Category " + name + " created with success!"
      };
      res.status(200).redirect("/admin/categories");
    });
  } catch (error) {
    return next(error);
  }
};
