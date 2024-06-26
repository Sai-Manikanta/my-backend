const ProductManagement = require('../models/productManagement');

// ProductManagement.findOne().then((product) => {
//     if (!product) {
//         const defaultProduct = new ProductManagement({});
//         defaultProduct.save();
//     }
// });

const getProductManagementData = async (req, res) => {
    try {
        const userId = req.params.userId;
        let productManagementData = await ProductManagement.findOne({ userId });

        if (!productManagementData) {
            productManagementData = new ProductManagement({ userId });
            await productManagementData.save();
        }

        res.json(productManagementData);
    } catch (err) {
        res.status(500).send(err);
    }
}

// const updateProductManagementData = async (req, res) => {
//     const updates = req.body.products;
//     try {
//         const product = await ProductManagement.findOneAndUpdate({ userId });

//         if (!product) {
//             return res.status(404).send('Product not found');
//         }

//         for (const key in updates) {
//             if (updates.hasOwnProperty(key)) {
//                 product[key] = updates[key];
//             }
//         }

//         await product.save();
//         res.json(product);
//     } catch (err) {
//         res.status(500).send(err);
//     }
// }

// const updateProductManagementData = async (req, res) => {
//     const userId = req.params.userId;
//     const updates = req.body;

//     try {
//         const product = await ProductManagement.findOne({ userId });

//         if (!product) {
//             return res.status(404).send('Product not found');
//         }

//         // Function to update nested fields
//         const updateNestedFields = (target, source) => {
//             for (const key of Object.keys(source)) {
//                 if (typeof source[key] === 'object' && source[key] !== null && !Array.isArray(source[key])) {
//                     if (!target[key]) {
//                         target[key] = {};
//                     }
//                     updateNestedFields(target[key], source[key]);
//                 } else {
//                     target[key] = source[key];
//                 }
//             }
//         };

//         updateNestedFields(product, updates);

//         await product.save();
//         res.json(product);
//     } catch (err) {
//         res.status(500).send(err);
//     }
// };

const updateProductManagementData = async (req, res) => {
    const userId = req.params.userId;
    const updates = req.body.products;

    try {
        const options = {
            new: true, // Return the updated document
            upsert: true, // Create a new document if not found
            setDefaultsOnInsert: true // Apply default values if creating a new document
        };

        const product = await ProductManagement.findOneAndUpdate({ userId }, updates, options);

        res.json(product);
    } catch (err) {
        res.status(500).send(err);
    }
};

module.exports = {
    getProductManagementData,
    updateProductManagementData
}