const {Router} = require('express')
const {postProduct, getProduct, updateProduct, deleteProduct , getProductId, sortProductsDescending, sortProductsAscending, productBrand, productPrice} = require('../../controllers/products.controller')


const router = Router()

router.post('/product', postProduct)
router.get('/products', getProduct )
router.get('/product/:id',getProductId)
router.get('/products/descending', sortProductsDescending)
router.get('/products/ascending', sortProductsAscending)
router.get('/products/brand', productBrand)
router.get('/products/price', productPrice)
router.put('/product', updateProduct)
router.delete('/product/:id', deleteProduct)



module.exports = router