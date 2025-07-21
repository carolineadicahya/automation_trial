// const db = require(.../)

// // get all
// exports.findAll = async (req, res, next) => {
//   const limit = parseInt(req.query.limit) || 10;
//   const page = parseInt(req.query.page) || 1;
//   const offset = (page - 1) * limit;
//   try {
//     const categories = await Category.findAll({
//       offset: offset,
//       limit: limit,
//     });
//     if (Object.keys(categories).length == 0) {
//       return res.status(404).json({
//         code: 404,
//         message: "There is no data in Category",
//       });
//     }
//     res.json({
//       code: 200,
//       message: "Categories retrieved successfully",
//       data: categories,
//     });
//   } catch (err) {
//     next(err);
//   }
// };

// // get by
// exports.findOne = async (req, res, next) => {
//   try {
//     const category = await Category.findByPk(req.params.id);
//     if (!category) {
//       return res.status(404).json({
//         code: 404,
//         message: "Category not found",
//       });
//     }
//     res.json({
//       code: 200,
//       message: "Category retrieved successfully",
//       data: category,
//     });
//   } catch (err) {
//     next(err);
//   }
// };

// // create
// exports.create = async (req, res, next) => {
//   const { name } = req.body;
//   try {
//     if (!name) {
//       return res.status(400).json({
//         code: 400,
//         message: "name cannot be null",
//       });
//     }
//     const data = await Category.create({ name });
//     res.status(201).json({
//       code: 201,
//       message: "Category created successfully",
//       data: data,
//     });
//   } catch (err) {
//     next(err);
//   }
// };

// // update
// exports.update = async (req, res, next) => {
//   const {
//     params: { id },
//     body: { name },
//   } = req;
//   if (!name) {
//     return res.status(400).json({
//       code: 400,
//       message: "name cannot be null",
//     });
//   }
//   try {
//     const num = await Category.update({ name }, { where: { id } });
//     if (num == 1) {
//       res.status(202).json({
//         code: 202,
//         message: "Category updated successfully",
//         data: {
//           id: parseInt(id),
//           name,
//         },
//       });
//     } else {
//       res.status(400).json({
//         code: 400,
//         message: "Category not exists",
//       });
//     }
//   } catch (err) {
//     next(err);
//   }
// };

// // Delete
// exports.delete = async (req, res, next) => {
//   const id = req.params.id;
//   try {
//     const num = await Category.destroy({ where: { id } });
//     if (num == 1) {
//       res.json({
//         code: 200,
//         message: "Category deleted successfully",
//       });
//     } else {
//       res.status(404).json({
//         code: 404,
//         message: "Category not exists",
//       });
//     }
//   } catch (err) {
//     next(err);
//   }
// };

// // findOne
// exports.findOne = async (req, res, next) => {
//   try {
//     const category = await Category.findByPk(req.params.id);
//     if (!category) {
//       return res.status(404).json({
//         code: 404,
//         message: "Category not found",
//       });
//     }
//     res.json({
//       code: 200,
//       message: "Category retrieved successfully",
//       data: category,
//     });
//   } catch (err) {
//     next(err);
//   }
// };

// // delete
// exports.delete = async (req, res, next) => {
//   const id = req.params.id;
//   try {
//     const num = await Category.destroy({ where: { id } });
//     if (num == 1) {
//       res.json({
//         code: 200,
//         message: "Category deleted successfully",
//       });
//     } else {
//       res.status(404).json({
//         code: 404,
//         message: "Category not exists",
//       });
//     }
//   } catch (err) {
//     next(err);
//   }
// };
